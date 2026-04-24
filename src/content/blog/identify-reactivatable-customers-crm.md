---
title: "How to Identify Your Most Reactivatable Customers in Any CRM"
description: "Step-by-step guide to finding your most reactivatable lapsed customers in any CRM. Scoring framework, filters, and segmentation strategy used by top service businesses."
date: "2026-04-12"
author: "David Henzel"
image: "/blog/images/identify-reactivatable-customers-crm.jpg"
tags:
  - "How-To Guide"
  - "Industry Guide"
  - "Franchise Operations"
slug: "identify-reactivatable-customers-crm"
category: "how-to"
vertical: "cross-vertical"
primary_keyword: "lapsed customer analysis"
secondary_keywords: ["identify lapsed customers CRM", "reactivatable customer segments", "CRM lapsed customer report", "customer reactivation segmentation", "win-back customer list"]
meta_title: "How to Identify Your Most Reactivatable Customers in Any CRM (2026)"
meta_description: "Step-by-step guide to finding your most reactivatable lapsed customers in any CRM. Scoring framework, filters, and segmentation strategy used by top service businesses."
pillar_page: "/blog/customer-reactivation-guide"
cta: "free-audit"
status: "published"
---

# How to Identify Your Most Reactivatable Customers in Any CRM

Most businesses know they have lapsed customers. Very few know *which* lapsed customers are worth calling first.

The difference matters. A well-targeted reactivation campaign converts 25-40% of contacts. A poorly targeted one wastes your budget calling people who moved, switched to a competitor a year ago, or were never profitable to begin with.

This guide shows you how to pull the right list from any CRM — Mindbody, Zenoti, Vagaro, Salesforce, HubSpot, or a spreadsheet — and score each customer by how likely they are to come back. No data science degree required.

---

## Why Targeting Is the Highest-Leverage Part of Reactivation

Before you write a single call script or email sequence, the list you build determines 80% of your campaign's success.

Here's why:

| Campaign Approach | Avg. Reactivation Rate | Cost per Reactivated Customer |
|-------------------|----------------------|------------------------------|
| Call every lapsed customer | 15-20% | $45-70 |
| Call scored and segmented list | 30-40% | $18-30 |
| Email every lapsed customer | 2-4% | $8-15 |

The scored list isn't just more effective — it's dramatically more cost-efficient. You reach the same number of reactivated customers with roughly half the call volume.

For benchmarks across industries, see our [Reactivation Rate Benchmarks report](/blog/customer-reactivation-rate-benchmarks).

---

## Step 1: Define "Lapsed" for Your Business

Before you can find reactivatable customers, you need to define what "lapsed" means in your specific context. This varies by industry and service frequency.

### Lapse Thresholds by Vertical

| Business Type | Normal Visit Cycle | Lapsed After | Deep Lapsed After |
|--------------|-------------------|-------------|-------------------|
| Gym / Fitness Studio | Weekly | 30 days no visit | 90 days |
| Dental Practice | 6 months | 8 months past last cleaning | 14 months |
| MedSpa / Aesthetics | 4-8 weeks | 12 weeks | 6 months |
| Hair Salon | 4-6 weeks | 10 weeks | 5 months |
| Pet Grooming | 4-8 weeks | 12 weeks | 6 months |
| HVAC / Home Services | Seasonal (2x/year) | Missed seasonal appointment | 18 months |

**The golden window:** Customers who lapsed 1-3x their normal visit cycle are your highest-value targets. Beyond that, conversion rates drop sharply.

### How to Pull This in Your CRM

**In most CRMs, this is a date filter:**

1. Find the "Last Visit Date" or "Last Appointment Date" field
2. Filter for customers where that date is older than your lapse threshold
3. Exclude customers who have a future appointment booked

**Mindbody:** Reports → Client Reports → Clients Not Visited Since → Set your date threshold

**Zenoti:** Analytics → Guest Reports → Lost Guests → Set the inactivity period

**Vagaro:** Reports → Customer Reports → Inactive Clients → Choose timeframe

**Salesforce / HubSpot:** Create a custom report or list where `Last Activity Date < [your threshold]` AND `Next Appointment Date = null`

---

## Step 2: Build Your Reactivation Score

Not every lapsed customer is equally reactivatable. Use these five factors to score each one, then prioritize your outreach accordingly.

### The 5-Factor Reactivation Score

| Factor | Weight | What It Measures | Data Source |
|--------|--------|-----------------|-------------|
| **Recency** | 30% | How recently they lapsed | Last visit date |
| **Frequency** | 25% | How often they used to come | Visit count over time |
| **Value** | 20% | How much they spent | Lifetime revenue or avg. ticket |
| **Tenure** | 15% | How long they were a customer | First visit to last visit span |
| **Engagement** | 10% | Recent non-visit activity | Email opens, website visits, social |

### How to Score Each Factor

**Recency (30 points max)**
- Lapsed 1-2 months: 30 points
- Lapsed 2-4 months: 25 points
- Lapsed 4-6 months: 15 points
- Lapsed 6-12 months: 8 points
- Lapsed 12+ months: 3 points

**Frequency (25 points max)**
- Visited 2+ times per month: 25 points
- Visited monthly: 20 points
- Visited every 2-3 months: 12 points
- Visited fewer than 4 times total: 5 points

**Value (20 points max)**
- Top 20% by revenue: 20 points
- Top 50% by revenue: 15 points
- Bottom 50% by revenue: 8 points

**Tenure (15 points max)**
- Customer for 2+ years: 15 points
- Customer for 1-2 years: 12 points
- Customer for 6-12 months: 8 points
- Customer for under 6 months: 4 points

**Engagement (10 points max)**
- Opened email in last 30 days: 5 points
- Visited website in last 30 days: 3 points
- Follows on social media: 2 points

**Total score: out of 100.**

### Priority Tiers

| Tier | Score | Action | Expected Reactivation Rate |
|------|-------|--------|---------------------------|
| **A — Hot** | 70-100 | Phone call first, within 48 hours | 35-50% |
| **B — Warm** | 45-69 | Phone call, batch 2 | 20-35% |
| **C — Cool** | 25-44 | Email + SMS sequence, phone if budget allows | 10-20% |
| **D — Cold** | 0-24 | Email only or exclude from campaign | 3-8% |

**Focus your call budget on Tier A and B.** These customers convert at 3-5x the rate of Tier C and D, and they generate higher revenue when they return.

---

## Step 3: Apply Exclusion Filters

Before you start calling, remove these segments — they waste time and can damage your brand:

### Must-Exclude List

- **Do Not Call requests.** Legal requirement. Check your CRM's communication preferences.
- **Customers with billing disputes or chargebacks.** They left angry. A phone call won't help.
- **Customers who explicitly cancelled with a reason.** "I moved to another state" is not a reactivation opportunity.
- **Deceased customers.** This sounds obvious, but CRM lists don't clean themselves. Check for notes.
- **Customers with no valid phone number.** If phone is your primary channel, don't waste a slot on email-only contacts.

### Should-Exclude (Situational)

- **Customers who already received a win-back campaign in the last 90 days.** Avoid fatigue.
- **Customers with fewer than 2 total visits.** They never really became customers. Consider a different approach (new customer re-engagement rather than reactivation).
- **Customers who lapsed more than 18 months ago.** Conversion rates drop below 5% and the data may be stale.

---

## Step 4: Segment by Reason for Lapsing (When Available)

If your CRM tracks cancellation reasons, membership holds, or last-visit notes, use them. The reason someone left determines the best approach to bring them back.

### Reactivation Strategy by Lapse Reason

| Reason | Best Approach | What to Say |
|--------|--------------|------------|
| **Schedule conflict / too busy** | Offer flexible timing, new hours | "We've added [early/late/weekend] availability" |
| **Financial / price** | Lead with value, not discounts | "Clients who return save more long-term because..." |
| **Moved locations** | Check if within reasonable distance | "We have a location at [nearest address]" |
| **Dissatisfied with service** | Acknowledge and offer a reset | "We'd like to make it right — here's what's changed" |
| **Life event (baby, surgery, travel)** | Empathetic timing | "We know life got busy — no pressure, just checking in" |
| **No stated reason** | Standard script — discovery call | Use the [reactivation call script](/blog/reactivation-call-script) |

**The "no stated reason" segment is usually your largest and most reactivatable.** These people didn't leave because of a problem — they drifted. A phone call from a real person is often all it takes.

---

## Step 5: Build the Call List

Now assemble everything into a prioritized, actionable list.

### Your Final Call List Should Include

For each customer:

1. **Name and phone number** — Primary contact info
2. **Reactivation score and tier** — For prioritization
3. **Last visit date and service** — So the agent can reference it naturally
4. **Visit frequency and total visits** — Context for the conversation
5. **Any known lapse reason** — To tailor the bridge
6. **Lifetime value** — So the agent knows the stakes
7. **Preferred services** — What to suggest rebooking

### Exporting from Your CRM

**Mindbody:** Use the Client Export with custom fields, or use the API if you're technical. Include `Last Visit Date`, `Total Visits`, `Revenue`, and contact fields.

**Zenoti:** Guest Data Export → Select the fields above → Filter by your lapse threshold → Export CSV.

**Vagaro:** Customer List → Filter inactive → Select columns → Export.

**Salesforce:** Build a Report with Contact fields + `Last Activity`, `Total Opportunities Won`, `Lifetime Value`. Add filters for your lapse threshold. Export to CSV.

**HubSpot:** Create an Active List with enrollment triggers for last activity date. Add columns for deal amount, lifecycle stage, and last engagement. Export.

**Spreadsheet / manual:** If you don't have a CRM, you can still score customers manually. Export your booking history, calculate last visit and visit count per customer, and apply the scoring framework above in a spreadsheet.

---

## Step 6: Set Your Campaign Cadence

Don't call everyone on day one. Stagger outreach by tier to maintain quality and track results.

### Recommended Cadence

| Week | Focus | Volume |
|------|-------|--------|
| Week 1 | Tier A (hot) — all contacts | 100% of Tier A |
| Week 2 | Tier B (warm) — first half | 50% of Tier B |
| Week 3 | Tier B (warm) — second half | 50% of Tier B |
| Week 4 | Tier C (cool) — phone overflow + email/SMS | Best of Tier C + all email |

**Why stagger?** Two reasons:

1. **Quality control.** You can listen to Week 1 calls, refine the script, and improve before scaling.
2. **Capacity management.** If Tier A converts at 40%, you need appointment slots for those rebooks. Don't flood your calendar.

---

## Real-World Example: Fitness Studio Chain

A 12-location fitness brand used this framework to reactivate lapsed members across all locations:

**Starting list:** 8,400 lapsed members (no visit in 60+ days)

**After scoring and filtering:**
- Tier A: 1,200 members (14%)
- Tier B: 2,800 members (33%)
- Tier C: 2,600 members (31%)
- Excluded: 1,800 members (22% — moved, DNC, dispute, or deep lapsed)

**Results after 4-week campaign:**
- Tier A: 44% reactivated (528 members)
- Tier B: 28% reactivated (784 members)
- Tier C (email + SMS only): 8% reactivated (208 members)
- **Total: 1,520 members reactivated**
- **Revenue recovered: $380K in first 90 days**

Without scoring, calling all 8,400 would have cost 2.5x more and reactivated fewer people, because agent time was wasted on low-probability contacts.

---

## The Scoring Shortcut (If You Don't Have Time)

If building a full scoring model feels like too much, here's the 80/20 version. Use these three filters to get 80% of the benefit:

1. **Last visit within 6 months** — Recency alone predicts 50%+ of reactivation likelihood
2. **3+ total visits** — They were real customers, not one-time visitors
3. **Valid phone number on file** — You can actually reach them

Apply those three filters and sort by last visit date (most recent first). That's your call list. It won't be as precise as the full scoring model, but it will dramatically outperform an unsegmented blast.

---

## What Happens After You Build the List

The list is the foundation. What you do with it determines results.

**Option 1: Run the campaign in-house.** Give the list to your front desk team or dedicated caller. Use the [reactivation call script](/blog/reactivation-call-script) and track results by tier. This works if you have the staff capacity and can maintain call quality.

**Option 2: Outsource to a dedicated reactivation partner.** Hand the list (or CRM access) to a team that specializes in lapsed customer outreach. They bring trained agents, proven scripts, and tracking infrastructure. You get results without pulling your staff off their regular work.

At [Winback Engine](/), we handle the entire process — from list building and scoring to trained agent calls and rebooking. We plug into your CRM, build the scored list, execute the calls, and report back with exactly how many customers rebooked and how much revenue was recovered.

**The best part:** We guarantee 3x ROI. If the campaign doesn't generate at least 3x what you pay, you don't pay.

---

## Key Takeaways

1. **Not all lapsed customers are equal.** Scoring by recency, frequency, value, tenure, and engagement lets you focus on the ones most likely to return.
2. **The golden window is 1-3x the normal visit cycle.** After that, conversion rates drop fast.
3. **Exclude before you include.** Removing DNC, disputes, deep lapsed, and one-time visitors cleans your list dramatically.
4. **Tier A and B customers drive 85%+ of reactivation revenue.** Prioritize phone calls for these tiers.
5. **Even a simple 3-filter approach beats no segmentation at all.** Last visit + visit count + phone number is the minimum viable targeting.

**Ready to find out how many reactivatable customers are sitting in your CRM right now?**

[Book Your Free Reactivation Audit →](https://api.leadconnectorhq.com/widget/booking/1Be1vCXeKrBtUIrx4WBb)
