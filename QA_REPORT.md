# Fajr to Fajr v18 — stability fix QA report

## Source baseline
The application changes are based on the exact current GitHub `app.js` content retrieved during this review. Its Git blob SHA was `8256a1cd0e0ad24fce9144d5d73fe18b6b546006`, matching the previously prepared complete app source. This avoids replacing the repository with an older uploaded copy.

## Fixes
- Clear decrypted private-habit state and lock the vault before reset/import; refresh lock UI after state replacement.
- Use `boundaryDate()` for the Hijri date associated with fasting and the Islamic calendar's daily record.
- Pass the date key to `isDone()` in weekly/monthly reports.
- Restrict offline app-shell fallback to navigation requests; return 503 for unavailable non-navigation resources.
- Re-check day state on visibility return and every 30 seconds while open, so Fajr boundary rollovers are noticed without waiting for another user action.
- Correct sleep validation message to match the existing `<24 hour` accepted duration.

## Local automated checks
- `node --check app.js` — PASS.
- `node --check sw.js` — PASS.
- `node --check test-stability-regressions.cjs` — PASS.
- `TZ=Asia/Kolkata node test-stability-regressions.cjs` — PASS.
- Tests cover report date argument, Fajr-aligned fasting/calendar, private vault reset/restore, visibility/boundary refresh, service-worker fallback, cache version, Fajr boundary calculation, and Friday completion behavior.

## Not yet verified
- Existing repository `test-app.cjs` has not been run in this local package because it was not available as a local file during this pass.
- The new regression test is not yet added to the GitHub Actions workflow.
- No live Android device test, live deployed PWA test, offline browser test, or backup/restore test has been performed.
- No GitHub commit or deployment was made: the connected GitHub integration rejected branch creation with HTTP 403 (Resource not accessible by integration).

## Release caution
Export a JSON backup before replacing the app files. Preserve the existing localStorage key and data schema.
