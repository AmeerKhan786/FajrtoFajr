# Changelog

## v2.0
- Expanded from seven to ten core daily practices.
- Added 100 Salawat, 100 Istighfar and 10-minute Muraqaba tracker.
- Added daily intention, evening reflection and gratitude journal.
- Added optional discipline anchors: phone-free morning, movement, sleep routine and kindness/service.
- Reworked strict-mode gap detection to evaluate every elapsed day, including days with no record.
- Added v1 local-data migration and version-2 backup import.
- Clarified that strict reset is evaluated when the app is reopened after the Fajr boundary.

## v1.0
- Initial Fajr-to-Fajr 90-day tracker with five prayers, Quran pages and dhikr.

## v3.0
- Added explicit optional daily anchors for phone-free first 30 minutes, 20-minute movement, sleep routine and kindness/service.
- Added AlAdhan city-based prayer-time lookup with configurable calculation method.
- Added permission-based prayer notifications while the app is open/active; no background delivery guarantee.
- Added 10-minute Muraqaba countdown timer.
- Added weekly and monthly summaries with print support.
- Added 90-day completion certificate, unlocked after 90 fully completed days.
- Added daily hours entry for meaningful report totals.
- Bumped service-worker cache to v3.


## v4.0
- Prayer accountability: separate Fajr, Dhuhr, Asr, Maghrib and Isha status as not recorded, on time or delayed.
- Muraqaba session history with per-session duration and timestamps.
- Dhikr counter expanded to 1,000 with 100/300/500/1,000 milestone indicators.
- Weekly Muhasaba fields for actions, shortcomings, habits and next-week intentions.
- Daily screen-time and unnecessary phone-use tracking.
- Sadaqah/kindness log with optional amount and private note.
- Bedtime and wake-up time records.
- Preserved private daily journal, reflections and local-only storage.
- Service-worker cache bumped to v4.


## v5.0
- Added separate Sunnah and Nafl completion records alongside each of the five daily prayers.
- Added a post-sunrise Ishraq prayer check-in.
- Added Friday-only Salat al-Tasbih completion and an additional Salawat counter with no fixed target.
- Added migration-safe storage for the new worship records.
- Bumped service-worker cache to v5.


## v6 — Islamic calendar and fasting companion
- Added Gregorian + Hijri date header and configurable Hijri adjustment.
- Added upcoming Islamic occasions and optional special-day notifications.
- Added fasting types, daily fasting log, Suhoor/Fajr cutoff and Iftar/Maghrib time display.
- Added automatic Ramadan mode with Suhoor, Iftar, Taraweeh, Qiyam and Quran tracking.
- Prayer times refresh on a new date when city settings are available; default city for a fresh install is Bengaluru, India.
- Preserved v1–v5 challenge data and added fasting-record migration defaults.

- Added spiritual analytics dashboard, 7/30/60/90-day milestones, sleep and screen-time summaries.
- Added Quran surah/ayah, memorisation/revision and daily learning notes.
- Added habit-recovery planning and saved weekly Muhasaba history.

## v7 — focused worship tabs and expanded daily wird
- Added a six-tab navigation structure: Today, Worship, Fasting, Quran, Insights and Calendar. The dual-date strip remains visible at the top.
- Added a Tahajjud/night-prayer check-in.
- Added daily Surah At-Taghabun counter with a configurable 3–41 repetition target.
- Added a daily Darood-e-Nariyah counter.
- Added separate morning adhkar (after Fajr) and evening adhkar (after Maghrib) check-ins with private notes.
- Muraqaba timer duration is now configurable from 1–180 minutes; the separate session log remains available.
- Istighfar and non-Friday Salawat counters now allow counts above 100 while retaining 100 as the core challenge minimum.
- Updated local-data migration/import handling and service-worker cache to v7.


## v8
- Added 21-, 45-, 75- and 100-completed-day milestones with individual printable certificates.
- Certificates include Gregorian and full Hijri dates for the qualifying completion day.
- Added current and longest completion streak analytics.
- Extended the challenge grid and progress display to 100 days.
- Added a dedicated Bad habits tab with PIN-gated AES-GCM encrypted local storage, trigger/replacement notes, wins, setbacks and delete controls.
- Bumped service-worker cache to v8.


## v9 — discipline-first daily command centre
- Reframed the home experience around discipline, commitment and consistency.
- Added three daily commitments: worship, discipline and personal priority.
- Added end-of-day review: honoured commitments, blockers and one adjustment for tomorrow.
- Persisted commitments per challenge day and included them in existing JSON backup/export.
- Replaced heuristic tab routing with explicit predictable tab assignments.
- Added clearer focus states and compact mobile styling for the commitment workflow.
- Bumped service-worker cache to v9.

## v10 — Health and measurable habit accountability
- Added a Health tab for user-entered medicines and supplements, with a daily taken/not-taken checklist.
- Added daily movement tracking for walking, strength basics, focus/mobility breaks, minutes and notes.
- Added weekly exercise-minute and monthly active-day summaries.
- Upgraded the encrypted Bad Habits vault with date-keyed daily quantity logs, a seven-day view, rolling weekly totals and current-month totals.
- Added migration defaults for health and exercise records and preserved health plans in JSON backup/import.
- Bumped service-worker cache to v10.
- Health tracker records user-defined medication plans; it does not prescribe medicines, doses or exercise intensity.

## v11 — Health routine and measurable habit accountability
- Added a dedicated Health tab with user-managed medicine/supplement plan and daily taken/not-taken check-ins.
- Added movement and focus tracking: walking, strength basics, mobility, focused-work sessions, minutes and optional weight entries.
- Added weekly medicine check-ins, movement minutes and focus minutes, plus monthly active movement days.
- Added private per-date behaviour counts, selectable log date, weekly/monthly totals and zero-count-day summaries inside the encrypted Bad Habits vault.
- Added explicit unit labels for each monitored behaviour (e.g. cigarettes, occurrences or minutes).
- Bumped service-worker cache to v11.


## v11 — Health and accountability
- Added a Health tab with a configurable medicine/supplement schedule and daily taken status.
- Added walking, strength, mobility, breathing/focus, exercise minutes, focused minutes and optional weight logging.
- Added weekly and monthly health summaries.
- Added date-specific numeric logs to each private habit, supporting explicit zero counts and weekly/monthly accountability.
- Kept private habit labels, triggers, replacement plans and daily logs encrypted in the PIN vault.
- Medicine check-ins distinguish not recorded, taken, and missed/skipped; weekly reporting separately counts missed doses.

## v12 — quit-focused accountability and full calendar QA
- Reworked the private habit area into a quit-plan board: record the reason for quitting, user-entered daily baseline, measurement unit, triggers and replacement action.
- Added a date-specific daily check-in for every monitored habit: exact count (including an explicit zero), strongest urge (0–10), trigger note, coping action and whether the replacement action was used.
- Added a prominent “Record 0 · stayed away” action. A lapse is recorded without erasing earlier abstinent days; missing dates do not count as abstinent.
- Added tracked zero-day streaks, weekly and monthly per-habit counts, zero days, lapse days and percentage comparison against the user's baseline.
- Preserved compatibility with legacy numeric daily logs; new entries are stored as structured encrypted records inside the PIN vault.
- Restored the complete Health tab markup and all required medicine, exercise, focus, weight and summary controls that were referenced by JavaScript but absent from the previous packaged HTML.
- Added fasting-date caution banners for Eid al-Fitr, Eid al-Adha and the Days of Tashreeq; these are informational prompts, not religious rulings.
- Corrected the upcoming-occasion list so Ramadan does not appear as a repetitive generic event every day, and so the 13th of Dhul Hijjah is not simultaneously presented as an Ayyam al-Bid fasting day.
- Bumped service-worker cache to v12.
- Expanded the automated test suite to cover all 12 Hijri months, complete 29/30-day month samples, Ramadan day progression, last-ten/odd nights, Eid reminders, Arafah, Tashreeq, white days, Hijri adjustment, Friday/non-Friday rules, Ramadan Friday behavior, Fajr boundary and private-habit log/encryption cases.


## v13 — navigation repair, sleep history and 04:00 Tahajjud window
- Rebuilt tab switching using direct event listeners on every tab button and a broad-compatible `main.children` section lookup instead of a `:scope` selector.
- Added tab semantics, active-state updates, keyboard left/right navigation, and a four-column mobile tab grid so all eight tabs remain visible without horizontal swiping.
- Made section-to-tab assignments explicit and preserved the Friday-only panel condition when changing tabs.
- Moved sleep tracking into the existing Health tab; no extra tab was created.
- Added separate bed-entry and out-of-bed time fields, overnight duration calculation, validation, weekly average, monthly tracked-night count and a rolling history list.
- Kept backward compatibility by migrating previously stored bedtime/wakeup values from challenge records into the Health sleep history.
- Updated Insights sleep averages to use the Health sleep log.
- Set the Tahajjud tracking window to open at 04:00 local time and disable check-in before that time. A session recorded between 04:00 and the configured Fajr-to-Fajr boundary is assigned to the upcoming challenge date, preventing it from being misfiled under the previous day.
- Bumped the service-worker cache to v13 to prevent stale v12 assets from persisting after deployment.
- Expanded automated tests to simulate clicks on all eight tab buttons, verify panel visibility, check sleep calculations (including midnight crossover and invalid durations), and test Tahajjud date assignment immediately before and at the 04:00 / 05:00 boundaries.

## v14 — Habit matrix and consistency analytics
- Added a 30-day/14-day habit matrix with individual rows for the five daily prayers, Quran, Salawat, Istighfar, Dhikr, Muraqaba, morning/evening adhkar, Tahajjud, fasting and movement.
- Added explicit visual distinction between target met, partial progress and no record. Missing records are not scored as failures.
- Added current-month consistency heatmap and four-week trend view.
- Added transparent tracked-day denominators and explanatory notes to avoid misleading percentages.
- Bumped service-worker cache to v14.


## v15 — Deeper accountability
- Added prayer punctuality, delayed status, Sunnah/Nafl, Quran memorisation and revision analytics.
- Added a cautious descriptive sleep vs unnecessary phone-use comparison (no causal inference).
- Added printable journey report for all available recorded dates.
- Bumped service-worker cache to v15.

## v15 — Deeper accountability
- Added prayer punctuality, delayed status, Sunnah/Nafl, Quran memorisation and revision analytics.
- Added a cautious descriptive sleep vs unnecessary phone-use comparison (no causal inference).
- Added printable personal journey report for all available dates since challenge start.
- Bumped service-worker cache to v15.
