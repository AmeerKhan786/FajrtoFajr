# Fajr to Fajr PWA refresh patch (v16)

This patch is designed to update a checkout of the FajrtoFajr repository and address stale installed PWA assets.

## Apply

1. Download/extract this ZIP.
2. Put `apply-pwa-refresh.js` in the root of your local FajrtoFajr repository (same folder as `index.html`, `app.js`, and `sw.js`).
3. Run: `node apply-pwa-refresh.js`
4. Run the checks printed by the script:
   `node --check app.js && node --check sw.js && node --check test-app.cjs && TZ=Asia/Kolkata node test-app.cjs`
5. Review the changes (`git diff`), commit, and push to `main`.
6. After Pages deployment completes, open the PWA online once. If still stale, Chrome Android > Site settings > Storage > clear site data, then reopen and reinstall (export app JSON backup first).

The patch updates source files only; it does not deploy or change GitHub remotely.
