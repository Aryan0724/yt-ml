# PreYT Product Rule

> **Every user-visible CLAIM must have a traceable origin.**

---

## The Rule

```
Never present simulated, guessed, randomized, hardcoded,
or illustrative data as real user intelligence.

A claim is any assertion that:
  - Contains a number shown as a result or recommendation
  - Predicts user outcomes (clicks, views, growth, retention)
  - Compares the user to a benchmark, competitor, or average
  - Uses definitive outcome words like "will", "can", "expected", or "projected"

If we don't have the data:
    say we don't have it (honest empty state).

If we have a model prediction:
    identify it as a prediction and cite the model.

If we have an estimate / heuristic:
    label it as a heuristic / priority ranking, not a measured statistic.

If we have observed / API data:
    identify its source (e.g. YouTube Data API, DataForSEO Google Trends).
```

---

## What This Means in Practice

| Situation | What to do |
|---|---|
| YouTube channel data not connected | Show empty state + "Connect YouTube" prompt |
| Competitor list requires API we don't have | Show "Not connected yet" card, list what it will show |
| CTR improvement estimate is not statistically backed | Show Priority (`Critical` / `Important` / `Polish`), NOT a percentage |
| Gemini AI report present | Show it, clearly labeled as AI interpretation of real inputs |
| ML score | Show it, labeled as "Predicted Score" or "Model Score" |
| Channel DNA from real `channel_stats.json` | Show it, labeled with source |
| Channel DNA fabricated from random seed | **Do not show it** |
| Topic trend data from DataForSEO / Trends | Show time-series + metrics + source attribution |
| Topic trend provider unconfigured | Return `status: "unavailable"`, `reason: "provider_not_configured"`, NO fake graphs |

---

## Examples of Acceptable vs. Unacceptable Claims

### ✅ Acceptable (Traceable)
- `"Your face occupies 8.1% of the thumbnail frame."` (Computed via OpenCV / YOLO)
- `"Brightness: 142/255"` (Computed from pixel luminance)
- `"Topic interest accelerated +31% over 12 months"` (Computed from real DataForSEO / Trends time series)
- `"Recent Momentum: Rising (High Confidence)"` (Computed deterministically from trend slope + coverage)
- `"This fix is Priority: High"` (Heuristic ranking based on verified threshold violation)

### ❌ Unacceptable (Untraceable / Fabricated)
- `"+18% to +34% CTR potential"` (Not statistically validated)
- `"38% higher CTR on average"` (Recycled unverified internet statistic)
- `"+42% search velocity optimization"` (Invented marketing claim)
- `"You are missing out on 40% more views by not uploading on Saturdays"` (Fabricated competitor insight)
- Hardcoded competitor channels (MrBeast, MKBHD) with joke URLs

---

## What Was Removed in Truth Audits (Phase 4A & 4B)

The following fabricated outputs and unsupported claims were deleted:

1. `ChannelDNAEngine` random seed generation for unknown channels (`np.random.default_rng(seed)`).
2. Hardcoded `"historical_errors"` string identical for every channel.
3. `CompetitorEngine` hardcoded competitor names, Rick Roll reference URLs, fake CTRs, fake average views.
4. Frontend `generateChannelAudit()` 330-line hardcoded niche video benchmark database.
5. "Post-Fix Impact Metric Forecast" panel showing `+18% to +34% CTR lift`.
6. "Channel Rhythm & Reach Synergy" panel showing fabricated upload frequency and subscriber velocity.
7. "Competitor Gravity Map" panel with hardcoded MrBeast/MKBHD avatars.
8. `v40_heuristic_analyzer.py` improvement percentage strings (`"+8% to +12% CTR potential"`).
9. Frontend fallback improvement cards claiming `+9% to +15% feed attention` and `+6% to +12% readability`.
10. `v30_ranking_engine.py` unsupported `38% higher CTR` claim.
11. Residual `potentialImprovement` assignments and "Predicted CTR" misleading label.
12. `activity-pulse.tsx` `+42% search velocity` ticker claim.

---

## How to Add New Features

Before shipping any new metric, card, or claim, answer:

1. **What is the source?** (API call / model output / user input / deterministic computation from real inputs)
2. **Is it labeled correctly?** (estimate vs prediction vs observed data)
3. **What does the user see if the data is unavailable?** (honest empty state, not a fabricated fallback)

If you cannot answer question 1, the feature is not ready to ship.
