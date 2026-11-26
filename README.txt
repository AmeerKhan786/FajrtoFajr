FAJR TO FAJR — STABILITY FIX RELEASE (v18)

FILES
- app.js: complete replacement based on the exact app.js blob currently on GitHub at the time of review (SHA 8256a1cd0e0ad24fce9144d5d73fe18b6b546006).
- sw.js: complete replacement; cache updated to fajr-to-fajr-v18.
- test-stability-regressions.cjs: new regression checks for the fixes in this release.

FIXES
1. Private habit vault is locked/cleared before reset and before importing a backup; lock UI is refreshed after the new state is loaded.
2. Calendar and fasting date now use the active Fajr-to-Fajr day boundary, rather than the midnight-based civil date.
3. Weekly/monthly reports evaluate each record using its own date, preserving Friday-specific completion rules.
4. Service worker only uses index.html as an offline fallback for navigation requests. Missing JS/CSS/resources return HTTP 503 rather than HTML.
5. App refreshes the current day when it returns to the foreground and checks for a Fajr-boundary rollover every 30 seconds while open.
6. Sleep validation wording now matches the actual accepted range (greater than 0 and less than 24 hours).

DATA SAFETY
- Existing localStorage key and state schema are preserved.
- No user records are intentionally deleted or migrated by these fixes.
- Export a JSON backup before replacing files.

APPLY ON GITHUB (Android-friendly)
1. Open https://github.com/AmeerKhan786/FajrtoFajr
2. Open app.js, choose Edit, replace its full contents with this package's app.js, then commit.
3. Open sw.js, replace its full contents with this package's sw.js, then commit.
4. Add test-stability-regressions.cjs to the repository root.
5. In .github/workflows/quality-check.yml, add this step after the existing regression test step:

   - name: Stability regression tests
     run: TZ=Asia/Kolkata node test-stability-regressions.cjs

6. Existing test-app.cjs may contain an old service-worker cache-version expectation. If its assertion expects v15/v16/v17, update that expected version to v18. Do not change unrelated tests.
7. Wait for GitHub Actions and GitHub Pages to finish. Do not treat deployment as successful until the workflow passes.
8. On Android Chrome, close the installed PWA fully, reopen it online once so the v18 service worker installs, then test offline reload.

IMPORTANT LIMITATION
The GitHub connector returned HTTP 403 for branch creation (write access unavailable), so these files have NOT been committed or deployed. This package is ready for manual application. The regression script has been run locally; it is not yet wired into GitHub Actions until step 5 is completed.
