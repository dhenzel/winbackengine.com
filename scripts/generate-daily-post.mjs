#!/usr/bin/env node
/**
 * generate-daily-post.mjs
 *
 * Reads the editorial calendar, finds the next unpublished entry, drafts a
 * blog post via Claude (with prompt caching on the voice guide + exemplar
 * posts), generates a hero image via OpenAI gpt-image-1, validates the
 * output against quality gates, and writes:
 *   - src/content/blog/<slug>.md
 *   - public/blog/images/<slug>.jpg
 *
 * Run:   node scripts/generate-daily-post.mjs
 * Env:   ANTHROPIC_API_KEY, OPENAI_API_KEY
 *        ANTHROPIC_MODEL (optional, default: claude-sonnet-4-7-20250929)
 *        DRY_RUN=1 (write to tmp/ instead of repo paths)
 *
 * Exits non-zero on any validation failure — the workflow won't commit
 * bad output.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

const CALENDAR_PATH = path.join(REPO, 'content/editorial-calendar.md');
const VOICE_GUIDE_PATH = path.join(REPO, 'scripts/voice-guide.md');
const POSTS_DIR = path.join(REPO, 'src/content/blog');
const IMAGES_DIR = path.join(REPO, 'public/blog/images');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-7-20250929';
const DRY_RUN = process.env.DRY_RUN === '1';

const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/1Be1vCXeKrBtUIrx4WBb';

// Exemplar posts — Claude reads these to learn the voice. Picked one pillar
// (long, structural) and one long-tail (tighter, sharper) so Claude can infer
// both modes. These paths are stable; prompt cache will hit.
const EXEMPLAR_SLUGS = ['gym-member-reactivation', 'gym-winback-campaigns-that-work'];

// ------------- calendar parsing -------------

function parseCalendar(md) {
  const rows = [];
  for (const line of md.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map(s => s.trim());
    if (cells.length < 5) continue;
    if (/^-+$/.test(cells[0])) continue;          // separator row
    if (!/^\d+$/.test(cells[0])) continue;        // header / non-data row
    const [day, title, keyword, type, vertical, url] = cells;
    const slug = url ? url.replace(/^\/blog\//, '').replace(/\/$/, '') : null;
    rows.push({ day: parseInt(day, 10), title, keyword, type, vertical, url, slug });
  }
  return rows;
}

function existingSlugs() {
  const slugs = new Set();
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const fm = matter(raw).data;
    slugs.add(fm.slug || f.replace(/\.(md|mdx)$/, ''));
  }
  return slugs;
}

function findNextPost(entries, published) {
  return entries.find(e => e.slug && !published.has(e.slug)) || null;
}

// ------------- exemplar loading -------------

function loadExemplars() {
  return EXEMPLAR_SLUGS.map(slug => {
    const p = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(p)) throw new Error(`Exemplar missing: ${slug}`);
    return fs.readFileSync(p, 'utf8');
  });
}

// ------------- Claude call -------------

const SAVE_POST_TOOL = {
  name: 'save_post',
  description: 'Save the drafted blog post. Call this exactly once with the finished content.',
  input_schema: {
    type: 'object',
    required: ['title', 'description', 'body_markdown'],
    properties: {
      title: { type: 'string', description: 'Post title (must contain the primary keyword naturally).' },
      description: { type: 'string', description: '150–160 char meta description. First-person brand voice.' },
      meta_title: { type: 'string', description: 'SEO title tag, usually title + " (2026)" or similar, <=60 chars.' },
      meta_description: { type: 'string', description: 'Same as description, optimized for SERP snippet.' },
      body_markdown: {
        type: 'string',
        description: 'Full post body in Markdown. Start with a specific scenario or number. Use ## for H2s. Include at least one table or numbered breakdown. End with a CTA linking to the booking widget URL.',
      },
      secondary_keywords: {
        type: 'array',
        items: { type: 'string' },
        description: '3–5 secondary keywords the post naturally covers.',
      },
    },
  },
};

async function draftPost(entry, voiceGuide, exemplars) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemBlocks = [
    {
      type: 'text',
      text: `You are drafting a blog post for Winback Engine (winbackengine.com), a customer-reactivation service for multi-location franchises. Follow the voice guide below EXACTLY.\n\nYou must call the save_post tool exactly once. Do not write prose outside the tool call.`,
    },
    {
      type: 'text',
      text: `<voice_guide>\n${voiceGuide}\n</voice_guide>`,
      cache_control: { type: 'ephemeral' },
    },
    {
      type: 'text',
      text: `<exemplar_post_1>\n${exemplars[0]}\n</exemplar_post_1>\n\n<exemplar_post_2>\n${exemplars[1]}\n</exemplar_post_2>`,
      cache_control: { type: 'ephemeral' },
    },
  ];

  const userMessage = `Draft today's post for the editorial calendar entry below.

<calendar_entry>
Day: ${entry.day}
Title: ${entry.title}
Primary keyword: ${entry.keyword}
Content type: ${entry.type}
Vertical: ${entry.vertical}
Target URL: ${entry.url}
</calendar_entry>

Requirements:
- ${entry.type.toLowerCase().includes('pillar') ? '2500+ words, 6+ H2 sections' : '1200+ words, 4+ H2 sections'}
- Primary keyword "${entry.keyword}" appears in the title and naturally in the first 150 words
- At least one table OR numbered economic breakdown
- Internal links: use /blog/<slug>/ format for pillar posts, ${BOOKING_URL} for the CTA
- Do NOT use /audit, /roi-calculator, or /tools/roi-calculator — those routes don't exist
- Close with a Winback Engine CTA linking to ${BOOKING_URL}`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: systemBlocks,
    tools: [SAVE_POST_TOOL],
    tool_choice: { type: 'tool', name: 'save_post' },
    messages: [{ role: 'user', content: userMessage }],
  });

  const toolUse = res.content.find(b => b.type === 'tool_use');
  if (!toolUse) throw new Error('Claude did not call save_post tool');

  const usage = res.usage;
  console.log(`[claude] input=${usage.input_tokens} output=${usage.output_tokens} cache_read=${usage.cache_read_input_tokens ?? 0} cache_write=${usage.cache_creation_input_tokens ?? 0}`);

  return toolUse.input;
}

// ------------- image generation -------------

async function generateImage(entry) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Editorial hero image for a blog post titled "${entry.title}".
Industry: ${entry.vertical}. Theme: customer reactivation, winning back lapsed customers.
Style: clean modern editorial photography, slight dark teal and green accents (brand
colors #0f172a navy + #10b981 green), professional, no text overlays, no logos,
no stock-photo cliches, 16:9 composition.`;

  const res = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1536x1024',
    quality: 'medium',
    output_format: 'jpeg',
    n: 1,
  });

  const b64 = res.data[0].b64_json;
  return Buffer.from(b64, 'base64');
}

// ------------- validation -------------

function validatePost(draft, entry) {
  const errors = [];
  const body = draft.body_markdown || '';

  const minWords = entry.type.toLowerCase().includes('pillar') ? 2000 : 1000;
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  if (wordCount < minWords) {
    errors.push(`Word count ${wordCount} < required ${minWords}`);
  }

  const h2Count = (body.match(/^##\s+/gm) || []).length;
  const minH2 = entry.type.toLowerCase().includes('pillar') ? 5 : 3;
  if (h2Count < minH2) {
    errors.push(`Only ${h2Count} H2 headings, need ${minH2}+`);
  }

  const keywordInTitle = draft.title?.toLowerCase().includes(entry.keyword.toLowerCase());
  if (!keywordInTitle) {
    errors.push(`Primary keyword "${entry.keyword}" missing from title "${draft.title}"`);
  }

  if (/\(\/audit\)|\(\/tools\/roi-calculator\)|\(\/roi-calculator\)/.test(body)) {
    errors.push(`Body contains forbidden /audit or /roi-calculator link`);
  }

  if (!body.includes(BOOKING_URL)) {
    errors.push(`Body missing booking widget CTA (${BOOKING_URL})`);
  }

  if (!draft.description || draft.description.length < 80 || draft.description.length > 170) {
    errors.push(`Description length ${draft.description?.length} outside 80–170 char window`);
  }

  return { ok: errors.length === 0, errors, wordCount, h2Count };
}

// ------------- markdown assembly + save -------------

function deriveTags(entry) {
  const tags = [];
  const v = (entry.vertical || '').toLowerCase();
  const t = (entry.type || '').toLowerCase();
  if (v && !/cross|general|tier/.test(v)) {
    tags.push(entry.vertical.split(/\s+/)[0]);
  }
  if (t.includes('pillar')) tags.push('Industry Guide');
  else if (t.includes('case')) tags.push('Case Study');
  else if (t.includes('how-to')) tags.push('How-To Guide');
  else if (t.includes('comparison')) tags.push('Comparison');
  else if (t.includes('benchmark') || t.includes('data')) tags.push('Benchmarks');
  else tags.push('Strategy Guide');
  if (tags.length < 3) tags.push('Franchise Operations');
  return tags.slice(0, 3);
}

function yamlQuote(s) {
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function yamlArray(arr) {
  return '[' + arr.map(yamlQuote).join(', ') + ']';
}

function assembleMarkdown(entry, draft, today) {
  const slug = entry.slug;
  const tags = deriveTags(entry);
  const lines = ['---'];
  lines.push(`title: ${yamlQuote(draft.title)}`);
  lines.push(`description: ${yamlQuote(draft.description)}`);
  lines.push(`date: ${yamlQuote(today)}`);
  lines.push(`author: "David Henzel"`);
  lines.push(`image: ${yamlQuote(`/blog/images/${slug}.jpg`)}`);
  lines.push(`tags:`);
  for (const t of tags) lines.push(`  - ${yamlQuote(t)}`);
  lines.push(`slug: ${yamlQuote(slug)}`);
  lines.push(`primary_keyword: ${yamlQuote(entry.keyword)}`);
  if (draft.secondary_keywords?.length) {
    lines.push(`secondary_keywords: ${yamlArray(draft.secondary_keywords)}`);
  }
  if (draft.meta_title) lines.push(`meta_title: ${yamlQuote(draft.meta_title)}`);
  if (draft.meta_description) lines.push(`meta_description: ${yamlQuote(draft.meta_description)}`);
  lines.push(`status: "published"`);
  lines.push('---');
  lines.push('');
  lines.push(draft.body_markdown.trim());
  return lines.join('\n') + '\n';
}

// ------------- main -------------

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');

  const calendar = parseCalendar(fs.readFileSync(CALENDAR_PATH, 'utf8'));
  const published = existingSlugs();
  const entry = findNextPost(calendar, published);

  if (!entry) {
    console.log('[done] Editorial calendar exhausted — no new post today.');
    process.exit(0);
  }

  console.log(`[picked] Day ${entry.day}: ${entry.title} → ${entry.slug}`);

  const voiceGuide = fs.readFileSync(VOICE_GUIDE_PATH, 'utf8');
  const exemplars = loadExemplars();

  console.log('[draft] calling Claude...');
  const draft = await draftPost(entry, voiceGuide, exemplars);

  const val = validatePost(draft, entry);
  console.log(`[validate] words=${val.wordCount} h2=${val.h2Count} ok=${val.ok}`);
  if (!val.ok) {
    console.error('[fail] validation errors:');
    for (const e of val.errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log('[image] calling OpenAI...');
  const imgBuf = await generateImage(entry);

  const today = new Date().toISOString().slice(0, 10);
  const md = assembleMarkdown(entry, draft, today);

  const mdPath = DRY_RUN
    ? path.join('/tmp', `${entry.slug}.md`)
    : path.join(POSTS_DIR, `${entry.slug}.md`);
  const imgPath = DRY_RUN
    ? path.join('/tmp', `${entry.slug}.jpg`)
    : path.join(IMAGES_DIR, `${entry.slug}.jpg`);

  fs.writeFileSync(mdPath, md);
  fs.writeFileSync(imgPath, imgBuf);

  console.log(`[saved] ${mdPath} (${md.length} bytes)`);
  console.log(`[saved] ${imgPath} (${imgBuf.length} bytes)`);
  console.log(`::set-output name=slug::${entry.slug}`);
  console.log(`::set-output name=title::${draft.title}`);
}

main().catch(err => {
  console.error('[error]', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
