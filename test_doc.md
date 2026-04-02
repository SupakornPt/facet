# test_doc — unit test logic

This document describes **what** the Vitest suite verifies, **complete testcase inventory** (every `it()`), and **which production logic** each part maps to. Source tests live under `web/src/lib/`.

**Total:** 22 test cases — `scoring.test.ts` (17) + `storedAnswers.test.ts` (5).

---

## How to run

From `web/`:

```bash
npm run test
```

---

## Complete testcase inventory

### A. `web/src/lib/scoring.test.ts`

#### Describe: `computeAssessment quality metrics (response validity / accuracy)`

| # | `it(...)` name | Input / setup | Expected |
|---|----------------|---------------|----------|
| A1 | `computes social desirability index as (sum of SD items / 25) * 100` | Empty `questions`; answers all SD ids `33–36, 59` = `5` | `socialDesirabilityIndex === 100` |
| A1b | (same `it`) | Same; all SD answers = `1` | `socialDesirabilityIndex === 20` |
| A2 | `treats missing SD answers as 0 in the sum` | Empty payload; `{}` answers | `socialDesirabilityIndex === 0` |
| A3 | `passes attention checks only when Q41=4, Q42=2, Q62=4` | `41:4, 42:2, 62:4` | `attentionPass === true`; `attentionDetail` all `{ ok: true }` |
| A3b | (same `it`) | `41:3, 42:2, 62:4` | `attentionPass === false`; item `41` has `ok: false` |
| A4 | `computes consistency pair diff as abs(ra - (6 - rb)) for each pair` | `37:3, 38:3, 39:2, 40:5, 60:1, 61:4` | `diff` for `37–38`, `39–40`, `60–61` equals `Math.abs(ra - (6 - rb))` for those values |
| A5 | `uses 0 for missing answers in consistency pairs` | `{}` answers | `consistencyPairs.length === 3`; each `diff === Math.abs(0 - (6 - 0))` |
| A6 | `aggregates social desirability when only some items are answered` | `33:5, 34:5` only | `socialDesirabilityIndex === (10 / 25) * 100` |
| A7 | `fails attention checks when an item is omitted (undefined !== expected)` | `41:4, 42:2` (no `62`) | `attentionPass === false`; detail for `62` has `ok: false` |

#### Describe: `computeAssessment facet scores`

| # | `it(...)` name | Input / setup | Expected |
|---|----------------|---------------|----------|
| B1 | `scores a forward item as raw / (n * 5) * 100 on the main factor` | One question: Will / Drive, `reverse: false`; answer `{ 1: 5 }` | Will `score === 100`, `count === 1`; Drive `score === 100` |
| B2 | `reverse-scores items with reverse: true (6 - raw)` | One question: Energy / Sociability, `reverse: true`; answer `{ 10: 1 }` | Energy `score === 100` (scored value `5`) |
| B3 | `matches formulas on real question bank for a partial response` | Full `questions.json`; `{ 1: 1, 2: 2 }` only | Will `count === 2`, `score === 50`; Drive same |
| B4 | `returns five main factors in MAIN_FACTORS order` | One Drive question; `{ 1: 3 }` | `r.factors.map(f => f.factor)` equals `[...MAIN_FACTORS]` |
| B5 | `returns sub-facets in SUBFACET_ORDER with score 0 when unanswered` | One Drive question; `{ 1: 3 }` | `subFacets.length === SUBFACET_ORDER.length`; names match order; `Authority` has `score === 0`, `count === 0`, `factor === "Will"` |
| B6 | `skips items without subFacet or with a non-main factor (no aggregation)` | Q1 valid Drive; Q2 no `subFacet`; Q3 factor `Invalid` + Drive; answers all `5` | Will `count === 1`, `score === 100` |
| B7 | `aggregates multiple main factors from one payload` | Q1 Will/Drive, Q2 Energy/Sociability; `{ 1: 5, 2: 4 }` | Will `100`, Energy `80`, Affection `0` |
| B8 | `omits unanswered questions from counts (undefined raw)` | Two Will/Drive items (second reverse); only `{ 1: 5 }` | Will `count === 1`, `score === 100` |

#### Describe: `allQuestionsAnswered`

| # | `it(...)` name | Input / setup | Expected |
|---|----------------|---------------|----------|
| C1 | `is true when every question id has an answer` | Two questions `id 1, 2`; `{ 1: 3, 2: 4 }` | `true` |
| C2 | `is false when any question is missing` | Same questions; `{ 1: 3 }` | `false` |
| C2b | (same `it`) | Same questions; `{}` | `false` |

---

### B. `web/src/lib/storedAnswers.test.ts`

#### Describe: `sanitizeStoredAnswersRecord`

| # | `it(...)` name | Input / setup | Expected |
|---|----------------|---------------|----------|
| D1 | `returns null for non-object inputs` | `null`, `undefined`, `"x"`, `1`, `[]` | each `sanitizeStoredAnswersRecord(...) === null` |
| D2 | `keeps only valid question ids and Likert range 1–5` | Object: valid `firstId → 4`, plus `999999`, `abc`, `"2.5"` keys | Result `{ [firstId]: 4 }` only (`firstId` = first id in `questions.json`) |
| D3 | `truncates finite numbers toward zero within range` | `{ [firstId]: 4.9 }` | `{ [firstId]: 4 }` |
| D4 | `drops out-of-range or non-finite values` | `firstId → 0`, second bank question id → `6` | `{}` |
| D5 | `ignores __proto__ and constructor keys (no merge pollution)` | `JSON.parse` string with `__proto__`, `constructor`, and valid `"${firstId}":3` | `{ [firstId]: 3 }`; `Object.prototype` has no `polluted` |

---

## Specification reference (logic under test)

### 1. `computeAssessment` — quality metrics

**Module:** `web/src/lib/scoring.ts`

| Area | Rule |
|------|------|
| **Social desirability** | IDs `33, 34, 35, 36, 59`; `(sum / 25) * 100`; missing → `0`. |
| **Attention** | `41 === 4`, `42 === 2`, `62 === 4` (strict); `attentionPass` = all `ok`. |
| **Consistency** | Pairs `(37,38)`, `(39,40)`, `(60,61)`; `diff = abs(ra - (6 - rb))`; missing → `0`. |

### 2. `computeAssessment` — facet scores

| Area | Rule |
|------|------|
| **Item** | Reverse: `6 - raw`; else `raw`. Skip if no `subFacet` or factor not in `MAIN_FACTORS`. |
| **Factor / sub-facet** | `(sum / (count * 5)) * 100`; empty → `0`. |
| **Sub-facet list** | Fixed `SUBFACET_ORDER`; empty row placeholder `factor: "Will"`. |
| **Factor list** | Fixed `MAIN_FACTORS` order. |

### 3. `allQuestionsAnswered`

`true` iff every `q` in the list has `answers[q.id] !== undefined`.

### 4. `sanitizeStoredAnswersRecord`

`null` if not a plain object. Keep only integer-string keys, IDs in `questions.json`, values finite integers in `1..5` after `trunc`. Dangerous keys ignored; output is a clean `Record<number, number>`.

---

## Out of scope (not covered by these tests)

- React UI, routing, and i18n.
- `scoreBand` / narratives (`interpretations.ts`).
- `loadAnswers` / `saveAnswers` / `sessionStorage` integration (only pure `sanitizeStoredAnswersRecord` is tested).
- End-to-end browser flows.

---

## File map

| Item | Path |
|------|------|
| This doc | `test_doc.md` (repo root) |
| Scoring tests | `web/src/lib/scoring.test.ts` |
| Storage sanitization tests | `web/src/lib/storedAnswers.test.ts` |
| Scoring implementation | `web/src/lib/scoring.ts` |
| Sanitization implementation | `web/src/lib/storedAnswers.ts` |
| Session load/save | `web/src/lib/storage.ts` |
