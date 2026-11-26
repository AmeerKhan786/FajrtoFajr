Fajr to Fajr recording fix — source patch

Contents:
- apply_fajr_fix.py: safely applies the reviewed changes to app.js and sw.js.
- README.txt: usage and verification notes.

How to use:
1. Download and unzip this package.
2. Put apply_fajr_fix.py in the root of your local AmeerKhan786/FajrtoFajr checkout,
   beside app.js and sw.js.
3. Run: python apply_fajr_fix.py
4. Review the changes, then commit and push app.js and sw.js to GitHub.
5. Wait for GitHub Pages deployment and test the live app.

The script creates timestamped backups and refuses to modify files if the expected
source snippets are missing or ambiguous.

Changes:
- Daily records no longer require the 100-day challenge to have been started.
- The daily task controls and task list remain available before challenge start.
- Prayer dropdowns save on the change event rather than the click event.
- Service worker cache version changes from v15 to v16.

Important:
This is a source patch, not a deployed release. GitHub write access was denied
when the update was attempted. Test on a copy first and export your app data
before making changes. The patch does not clear localStorage or intentionally
modify stored records.
