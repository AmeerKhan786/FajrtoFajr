# Fajr to Fajr v15 — QA report

## Release changes
- Prayer punctuality: calculates on-time share and delayed check-in count from recorded prayer statuses only.
- Sunnah and Nafl: totals separate optional prayer check-ins; no target or religious judgement is applied.
- Quran: counts days marked for memorisation and revision, separately from pages read.
- Sleep / digital-use comparison: compares recorded sleep durations on dates with <=30 minutes vs >30 minutes of unnecessary phone use. It appears only with at least three paired records and explicitly warns that this is descriptive, not causal or medical.
- Personal journey report: generates a printable report from all available records on/after the challenge start date, including prayer, Quran, optional prayers, fasting, dhikr, Muraqaba, commitments, reflections and sleep.
- Existing weekly/monthly report, habit matrix, recovery prompt, commitment tracker, encrypted private vault, health tab and Islamic calendar are retained.
- Service-worker cache bumped to `fajr-to-fajr-v15`.

## Automated checks executed
- `node --check app.js` — PASS.
- `node --check sw.js` — PASS.
- `TZ=Asia/Kolkata node test-app.cjs` — PASS.
- Existing suite covers navigation simulation, eight-tab visibility, unique DOM IDs, UI references, Hijri/Ramadan date handling, Fajr boundary, Tahajjud 04:00 assignment, health/sleep migration, encrypted private-habit vault, explicit-zero logs and abstinence calculations.
- Added deterministic execution tests for prayer punctuality percentage, delayed count, Sunnah/Nafl totals, Quran memorisation/revision days, Quran page aggregation and commitment summary — PASS.
- ZIP archive integrity and clean extraction checked after packaging.

## Manual verification still required
1. On the deployed HTTPS app, open Insights and check that the deeper accountability section renders.
2. Enter on-time and delayed prayer statuses across multiple dates; confirm the rate only uses recorded statuses.
3. Enter Sunnah and Nafl check-ins; verify totals increase independently.
4. Save Quran memorisation and revision on different dates; verify separate day counts.
5. Enter sleep and unnecessary phone-use records on at least three dates; verify the descriptive comparison appears and does not claim causality.
6. Generate and print the personal journey report.
7. Export JSON backup, reinstall/update, restore backup and verify the same analytics.
8. Test offline reload and installed PWA behavior on Android Chrome after one online visit.

## Limits and interpretation
- No real Android device or live GitHub Pages deployment was available for this test pass; those are not claimed as passed.
- The sleep / phone-use view is a descriptive comparison of self-reported records, not evidence of cause and effect, and not medical advice.
- The journey report summarizes only what was entered locally. Missing records are not interpreted as missed worship.
- This app is a self-accountability tool, not a religious authority. Optional practice records are not measures of faith or spiritual worth.
