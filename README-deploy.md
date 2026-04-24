# Deploy Runbook

This repo deploys to SiteGround via GitHub Actions. The old local FTP scripts
(`publish-post.js`, `update-blog-index.js`, `inject-hero-images.js`) are
**retired** — do not use them. Everything flows through `main` → CI → FTP.

## Secrets

Set these in **Repo Settings → Secrets and variables → Actions → New
repository secret**:

| Secret | Value | Used by |
|--------|-------|---------|
| `FTP_HOST` | SiteGround FTP server (e.g. `ftp.winbackengine.com` or the server hostname from SiteGround's control panel) | `deploy.yml` |
| `FTP_USER` | SiteGround FTP user | `deploy.yml` |
| `FTP_PASS` | SiteGround FTP password | `deploy.yml` |
| `ANTHROPIC_API_KEY` | Anthropic API key for daily post generation | `daily-post.yml` |
| `OPENAI_API_KEY` | OpenAI key for hero image generation | `daily-post.yml` |
| `GH_PUSH_TOKEN` | Fine-grained PAT, scope `contents: write` on this repo only, so the daily workflow can commit back and re-trigger `deploy.yml` | `daily-post.yml` |

The same three FTP values used to live in `.env` locally — copy them over.

## First deploy (do this once, carefully)

The deploy workflow ships with **only** `workflow_dispatch` enabled. This is
deliberate — the first run must be a dry-run you inspect by hand.

1. Add the three FTP secrets above.
2. Open the **Actions** tab → **Deploy to SiteGround** → **Run workflow**.
3. Leave `dry_run: true` (default) → Run.
4. Open the run log. The FTP step will print the full upload plan:
   - **Expected**: new/updated files under `/blog/`, `/blog/images/`, plus
     any Astro route changes (homepage, `_astro/*` asset bundles, etc.).
   - **Red flags**: the log shows it would *delete* files you want to keep
     (WordPress files, mailboxes, anything not in the repo). If you see that,
     **stop**, tell Claude, and we'll widen the `exclude:` list in
     `.github/workflows/deploy.yml` before a real run.
5. If the plan looks clean: re-run the workflow, uncheck `dry_run`. This
   performs the real FTP transfer. Expect ~2–4 minutes.
6. Verify live:
   - `https://winbackengine.com/` — homepage loads
   - `https://winbackengine.com/blog/` — index shows all 30 posts
   - `https://winbackengine.com/blog/gym-winback-campaigns-that-work/` —
     previously orphan HTML post now served by Astro build
   - A known-good hero image loads on any post page

7. Once verified: edit `.github/workflows/deploy.yml`, **uncomment** the
   `push:` trigger block, commit + push. From that point on, every push to
   `main` auto-deploys.

## Daily autonomous posts

See `.github/workflows/daily-post.yml`. Runs on cron, generates one post +
hero image, commits to `main`, which triggers `deploy.yml`. Skip or disable
this workflow from the **Actions** tab anytime (the `disable-workflow`
command exists via `gh` CLI too).

The generator enforces quality gates (min word count, H2 structure,
primary-keyword-in-title). If checks fail, the workflow exits non-zero and
no commit is made — so a bad AI output doesn't ship.

## Recovery

- **Bad post went live**: `git revert <sha>` + push. `deploy.yml` will
  redeploy without that post's HTML. The orphan file on SiteGround stays
  until the next full sync — if urgent, delete manually via SiteGround
  File Manager.
- **FTP deploy broke the live site**: roll back by reverting to the last
  known-good commit and re-deploying. The sync-state file on the server
  (`.ftp-deploy-sync-state.json`) will reconcile.
- **Secrets rotated**: update them in GitHub Settings; no code changes
  needed.
