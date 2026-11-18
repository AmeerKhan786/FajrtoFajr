# Repository maintenance notes — 18 November 2026

## GitHub connector status
Repository inspection succeeded. Write attempts to create branches and add files
returned HTTP 403 `Resource not accessible by integration`. No commits or file
changes were made remotely.

## FajrtoFajr
- `main` tree inspected.
- README still titles app as v13, while QA report describes v15.
- CHANGELOG has duplicate v15 entries.
- README/changelog/QA report should be reconciled before the next release.
- Existing tests include broad structural and function-level checks, but no
  repository CI workflow was present in the inspected tree.
- A proposed workflow is included at
  `.github/workflows/quality-checks.yml` in this patch bundle.
- The workflow runs syntax checks, the existing regression suite with
  `TZ=Asia/Kolkata`, manifest JSON validation, duplicate-ID validation, and
  expected eight-tab checks.

## AI repository
- `main` tree inspected and latest quality-check workflow run succeeded.
- Workflow run: https://github.com/AmeerKhan786/AI/actions/runs/44342147001
- It validates syntax, existing regression tests, Chromium E2E, JSON and the
  120-lesson/12-phase structure.
- Avoid changing the curriculum or app structure without a concrete bug/test
  finding.

## Device/live testing not yet done
- Android Chrome install/update
- Offline service-worker reload after a prior online visit
- Backup/restore across update
- Live PWA browser interaction on deployed URL
