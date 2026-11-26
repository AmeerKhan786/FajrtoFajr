Fajr to Fajr — updated source files

Files
- app.js: complete updated application JavaScript.
- sw.js: service worker with cache version v17 so browsers fetch the updated app.js.

Apply in GitHub
1. Open the FajrtoFajr repository.
2. Open app.js, choose Edit (pencil), select all, and replace it with the complete contents of this app.js file.
3. Commit the change.
4. Repeat for sw.js using the supplied sw.js file, then commit.
5. Wait for GitHub Pages to finish deploying, then reload the app. If the old version remains, close the installed PWA and reopen it after the service worker updates.

Important
- Export a JSON backup from the app before updating if you have any records you cannot afford to lose. These code changes do not intentionally change the localStorage key or data schema.
- Do not upload app.js.patch as app.js. This package contains the complete app.js file.
- These files have been syntax-checked with Node.js, but a live browser/device end-to-end test has not been run.
