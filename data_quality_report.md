# Dataset Quality Report

Source: `data.csv`

## Summary

The dataset is structurally clean but semantically weak for training or evaluating a news classifier.

- Rows: 88
- Columns: `text`, `label`
- Labels:
  - `finance`: 30
  - `business`: 29
  - `technology`: 29
- Missing values: none
- Exact duplicate texts: none
- Average text length: about 69.5 characters / 10 words

## Strengths

- The CSV parses correctly as two columns: `text` and `label`.
- Class counts are nearly balanced.
- No blank labels or blank text fields were found.
- No exact duplicate headlines were found.
- The file is valid UTF-8. If PowerShell displays entries such as rupee signs or curly apostrophes incorrectly, that is a terminal encoding issue, not CSV corruption.

## Main Quality Risks

### 1. Label Boundaries Are Ambiguous

The three labels overlap heavily:

- `technology` includes market, investment, crypto, and funding headlines.
- `business` includes stock-market, banking, interest-rate, and crypto headlines.
- `finance` includes corporate earnings, infrastructure contracts, public spending, and technology adoption.

This makes it hard for a model to learn stable distinctions. For example, crypto headlines appear under both `technology` and `finance`, while tech-stock headlines appear under both `technology` and `business`.

### 2. Dataset Is Too Small

There are only 88 total examples. This is suitable for demos or smoke tests, but too small for robust supervised training or credible offline evaluation.

Recommended minimum for a first useful classifier:

- 300-500 examples per class for a lightweight baseline.
- 1,000+ examples per class if the model will be evaluated seriously.

### 3. Synthetic Headline Style

Many rows look generated or template-like. Examples include vague placeholders such as `Company X`, `Tech giant XYZ`, and `Global retailer ABC`.

This can cause a classifier to learn artificial writing patterns instead of real news patterns.

### 4. Geographic Shortcut Risk

The `finance` class is strongly India-focused, while `technology` and `business` are more globally mixed.

A model may learn that India-specific terms such as `RBI`, `SEBI`, `Nifty`, `Sensex`, `INR`, and `rupee` imply `finance`, instead of learning the actual topic distinction.

### 5. Time Staleness

Several rows reference 2023, 2024, or 2025. Since this project is being reviewed in 2026, decide whether the dataset is meant to be historical training data or current news examples. If it is meant to represent current news, refresh or remove stale rows.

## Recommended Label Rules

Use stricter rules before expanding the dataset:

- `technology`: Product launches, software, hardware, cybersecurity, AI systems, cloud, telecom, privacy, and technical regulation where the technology itself is the main subject.
- `finance`: Markets, banking, central banks, monetary policy, currencies, bonds, funds, stocks, crypto as an asset class, fiscal metrics, and financial regulation.
- `business`: Company operations, mergers, acquisitions, earnings, supply chains, labor, trade, pricing, retail, manufacturing, and sector-level commercial activity.

When a headline touches multiple areas, label by the primary event:

- A company raising money is usually `business`, unless the headline is mainly about a fund, bond, stock, bank, or market instrument.
- A tech company stock rally is usually `finance`, not `technology`.
- A product powered by AI is `technology`, unless the business event is the main story.
- Crypto market movement is `finance`; blockchain product infrastructure is `technology`.

## Immediate Remediation Plan

1. Review the rows listed in `data_label_review.csv`.
2. Apply the recommended labels only where the rule is clear.
3. Remove or replace placeholder examples such as `Company X`, `XYZ`, and `ABC`.
4. Normalize punctuation if this CSV is used directly for model training.
5. Add real headlines from consistent sources and balance geography across all labels.
6. Keep a held-out manually reviewed test set separate from training data.

## Verdict

Use this dataset only as a toy/demo dataset until label boundaries are cleaned and the sample size is expanded.

