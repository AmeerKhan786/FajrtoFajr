# Fajr to Fajr — 100 Day Challenge v13

A mobile-first, installable PWA for a self-reported daily worship and discipline routine.

## Ten core daily practices
1. Fajr
2. Dhuhr
3. Asr
4. Maghrib
5. Isha
6. Seven Quran pages
7. 100 Salawat
8. 100 Istighfar
9. 100 Dhikr
10. Muraqaba / quiet mindful reflection — 10 minutes

## Optional discipline anchors
- Phone-free first 30 minutes.
- 20 minutes of movement.
- Protect sleep routine.
- One act of kindness or service.

Optional anchors support consistency but do not count toward the ten core practices or strict reset rule. Daily intention, evening reflection and gratitude are also available.

## Day boundary and strict mode
A challenge day runs from the configurable local-time boundary (default 05:00) to the next boundary. Set it to local Fajr time and update it as prayer times change. The app does not calculate prayer times.

Strict mode is enabled by default. When the app is opened after a new boundary, it checks every elapsed challenge day since the last visit. Any incomplete or unrecorded day restarts the 100-day challenge at Day 1. The reset is evaluated on app open, not by a background alarm. Turn strict mode off in Settings if you prefer a non-resetting tracker.

## Privacy and backups
Data stays in this browser's localStorage. It does not sync across devices. Export JSON backups regularly. Version 2 imports older v1 backups and carries forward prayer, Quran and dhikr records; new counters start at zero for past days.

## Run locally
Serve this directory over HTTP, e.g. `python -m http.server 8000`, then open `http://localhost:8000`.

## Deploy
Upload the contents of this directory to a repository root and enable GitHub Pages from `main` / root. Open the HTTPS URL in Android Chrome and choose Install app / Add to Home screen.

## Religious and personal boundaries
This is a self-tracking tool, not a religious authority. It does not verify worship, define accepted practice, calculate prayer times, or determine religious rulings. The wording/counts are user-configurable in spirit; follow trusted scholarly guidance and personal circumstances. Muraqaba is presented as a quiet reflection/remembrance practice, not as a prescribed religious ruling.


## v3 additions
- Four optional discipline anchors: phone-free first 30 minutes, 20 minutes movement, sleep routine, kindness/service.
- Prayer times: enter city and country in Settings; fetches daily timings from AlAdhan. Choose calculation method and confirm with your local mosque.
- Reminders: browser notifications are best-effort while the app is open/active. Browser/OS battery controls can delay or suppress them; no guaranteed background alarms.
- Muraqaba: 10-minute in-app countdown timer; manually record minutes in the daily counter.
- Weekly/monthly report cards and print support.
- Certificate unlocks after 100 fully completed challenge days; print/save as PDF.


## v4 accountability additions
- Prayer status is recorded separately for each prayer: not recorded, on time or delayed. The app does not infer missed prayers or issue religious rulings.
- Muraqaba sessions can be logged with duration and local timestamp; daily cumulative minutes are tracked.
- Dhikr target supports up to 1,000 with 100, 300, 500 and 1,000 milestones.
- Weekly Muhasaba records actions, shortcomings, habits and intentions.
- Digital distraction log records total screen time and unnecessary phone use.
- Sadaqah/kindness entries allow a private description and optional amount.
- Sleep discipline records bedtime and wake-up time.
- All records remain local to this browser and are included in JSON backup/export.


## v5 worship additions
- Separate optional Sunnah and Nafl check-ins for Fajr, Dhuhr, Asr, Maghrib and Isha.
- Ishraq prayer check-in as a separate post-sunrise practice.
- Friday-only Salat al-Tasbih completion and additional Salawat count, with no imposed target.
- These are personal tracking fields only. The app does not prescribe rak'ah counts, timings or rulings; follow trusted scholarly guidance and your local timetable.


## v6 — Islamic calendar, fasting and Ramadan

- Gregorian and Hijri dates shown together at the top using the device's `Intl` Islamic Umm al-Qura calendar, with a configurable ±2-day Hijri adjustment.
- Islamic occasion calendar includes Ramadan, last ten nights and odd nights, Eid al-Fitr, Arafah, Eid al-Adha, Tashreeq days, Ashura, monthly white days, and commonly marked dates whose observance differs between communities.
- Fasting log supports Ramadan, Monday/Thursday, Ayyam al-Bid, Ashura, Arafah, Qada and other voluntary fasts.
- Suhoor cutoff is displayed from Fajr and Iftar from Maghrib using the configured prayer-time calculation; times are estimates and should be checked against the local mosque.
- Ramadan mode activates automatically when the calculated Hijri month is Ramadan and reveals Suhoor, Iftar, Taraweeh, Qiyam and Quran page tracking.
- Optional Islamic special-day notifications appear when the app is open; prayer-time notifications are best effort while the app is active. Browser notifications are not guaranteed background alarms.
- The event calendar is calculated, not moon-sighting confirmation. Hijri dates can differ by locality and authority; adjust the date offset or follow local announcements.
- Religious notes are informational reminders, not fatwas. Special-night observances, Mawlid, Isra and Mi'raj and mid-Sha'ban practices vary; consult trusted scholarly guidance.

- Added a spiritual progress dashboard for prayer check-ins, Quran pages, dhikr, Muraqaba, fasting, completion milestones, average recorded sleep and digital-use totals.
- Added Quran surah/ayah study notes with memorisation and revision check-ins, plus a daily learning reflection.
- Added a habit-recovery prompt to record what disrupted a routine and one realistic next step.
- Weekly Muhasaba submissions are archived locally for review.

## v7 additions
The app now uses six focused tabs (Today, Worship, Fasting, Quran, Insights, Calendar). The date strip remains visible across tabs. Worship includes Tahajjud, configurable Surah At-Taghabun repetitions (3–41), daily Darood-e-Nariyah, and separate post-Fajr morning / post-Maghrib evening adhkar check-ins. Istighfar and daily Salawat retain a 100 minimum for the core challenge but can be counted above 100. Muraqaba timer duration can be set from 1 to 180 minutes.

Adhkar wording, repetition counts and religious recommendations are not hard-coded: use your trusted collection and scholarly guidance. The counters are personal records only.

The core challenge requires at least 100 Istighfar daily and at least 100 Salawat on non-Friday days. Friday Salawat is recorded separately in the Friday worship panel; the daily 100 Salawat minimum is waived for Friday in the challenge completion calculation. Counts can exceed 100 on other days.


## v8 milestones, streaks and private habits

- The challenge view now runs to 100 days and highlights 21, 45, 75 and 100 completed-day milestones.
- Each milestone certificate unlocks after that many fully completed challenge days. The certificate includes both Gregorian and Hijri completion dates (Hijri date uses the configured calendar adjustment). Certificates can be printed or saved as PDF.
- Current and longest consecutive completion streaks are shown separately. A completed day uses the existing core-practice completion rules.
- The Bad habits tab is PIN-gated. Habit labels, triggers, replacement plans and win/setback counts are encrypted locally with AES-GCM; the PIN key is derived using PBKDF2. The vault is locked after a page reload and when the app is backgrounded.
- PIN encryption requires a secure browser context (HTTPS, such as GitHub Pages). The standalone file preview may not provide Web Crypto and is not the supported place to create the vault.
- PIN recovery is intentionally unavailable. If the PIN is lost, encrypted vault contents cannot be decrypted. Exported JSON contains the encrypted vault, not plaintext entries.
- This is local-device protection, not cloud sync or protection against someone who can control the unlocked browser session or device.


## v9 — discipline, commitment and consistency

- Product design is organised around Plan → Execute → Review → Improve.
- The Today tab contains the daily checklist, progress and a three-part commitment card: worship, discipline and personal priority.
- The end-of-day review records whether commitments were honoured, what helped or interrupted the plan, and one adjustment for tomorrow.
- Commitment records are stored per challenge day and included in JSON backup/export. Older records migrate with empty commitment fields.
- Navigation now uses explicit, predictable tab assignments rather than relying on page-text heuristics. The date strip remains visible while navigating.
- The seven tabs are Today, Worship, Fasting, Quran, Insights, Calendar and private Bad habits.
- The challenge rules and existing worship trackers are preserved. Daily commitments do not silently change the ten core completion requirements or strict-mode rules.

The app is intended to encourage honest self-accountability and recovery, not shame. A missed day should lead to a practical next step rather than abandoning the overall effort.


## v10: Health and habit accountability
The Health tab lets you enter your own clinician-approved medicines/supplements and check off each dose taken each day. It also tracks walking, strength basics, focus/mobility breaks and exercise minutes, with weekly and monthly summaries. It does not prescribe medicines, supplements, doses, or exercise plans.

The encrypted Bad Habits tab now supports a numeric count for each date. It displays the current day, recent seven daily counts, a rolling seven-day total, and current-month total. Example labels and quantities are user-entered; no behaviour is pre-populated. These private logs remain inside the encrypted vault.

## v11 Health and accountability
The Health tab supports a user-entered medicine/supplement plan with a daily taken checkbox for each item. It also tracks walking, strength basics, mobility, focused-work sessions, exercise minutes and optional weight entries. Weekly summaries show medicine check-ins, movement minutes and focus minutes; monthly summaries show active movement days. The app does not prescribe medicines, doses, supplements, diets or exercise intensity. Enter only the plan agreed with a clinician/pharmacist and adjust exercise to your abilities.

The encrypted Bad Habits vault is a monitor rather than a notes-only list. Each behaviour has a unit label and date-specific numeric count (including zero). Select a date to enter or correct its count. The private board totals the current week and month and reports zero-count days, making reduction and streaks visible over time. Habit data remains encrypted in the vault and is not included as plaintext in JSON backups.


## v11 — Health and daily accountability

- Added a Health tab for a user-defined daily medicine/supplement list, dose/instruction notes, reminder-time reference, and per-day taken check-ins.
- Added exercise tracking for walking, strength, mobility, breathing/focus, movement minutes, focused-session minutes, optional weight and notes.
- Added weekly medicine check-ins and movement/focus summaries, plus monthly exercise-day counts.
- Expanded the encrypted Bad Habits vault with a quantitative daily log per habit, selectable date, explicit zero entries, and weekly/monthly summaries and per-habit breakdowns.
- Health records and medicine plans are stored locally in the normal app backup. Bad-habit details and logs remain inside the encrypted vault.
- No medicine, supplement, dose, or exercise prescription is pre-filled. Enter the exact regimen confirmed by a clinician/pharmacist and start movement gradually within personal medical limits.

Medicine statuses distinguish not recorded, taken, and missed/skipped. Weekly summaries show both total recorded statuses and missed/skipped entries. The tracker does not send guaranteed background medication alarms.

## v12 current build notes

### Quit-habit accountability
The private tab is designed as a quit plan rather than a passive habit list. For each behaviour you choose to change, add a private reason, unit, optional current daily baseline, common trigger and replacement action. For each date, record a numeric count; enter **0 explicitly** when you stayed away. You can also record urge intensity (0–10), the day's trigger, the coping action and whether you used your replacement action.

The board reports tracked days, zero-count days, lapse days, current consecutive explicitly-recorded zero-day streak, weekly/monthly totals and comparison against the baseline. A day with no entry is deliberately not counted as an abstinent day. A lapse does not delete previous successful days. Per-habit totals retain their own unit; totals for different habits are not added together as if they were comparable. Older numeric logs remain readable and are converted to structured records when edited.

All habit labels, reasons and daily logs remain inside the AES-GCM encrypted PIN vault. The PIN cannot be recovered. Keep the JSON backup somewhere secure; it includes the encrypted vault, not plaintext habit entries.

### Calendar and fasting QA
The automated tests exercise the actual calendar and challenge helper functions from `app.js`. They sample every Hijri month, check complete 29/30-day month sequences, Ramadan's 29/30-day sequence and day-mode detection, last-ten/odd nights, Eid reminders, Arafah, the Days of Tashreeq, Ayyam al-Bid exclusions and Hijri adjustment. Friday and non-Friday challenge completion is checked separately, including a Friday inside a sampled Ramadan.

Umm al-Qura dates are calculated estimates and can differ from local moon-sighting announcements. The fasting caution banners are informational prompts only. Follow local announcements and trusted scholarly guidance. Suhoor/Fajr and Iftar/Maghrib times depend on the configured prayer-time source and should be checked against your local mosque.

### Running automated checks
From this folder, run:

```bash
node --check app.js
node --check sw.js
TZ=Asia/Kolkata node test-app.cjs
```

The automated suite does not replace real Android testing. Background reminders, online prayer-time refresh and UI behavior on your phone still need deployment/device verification.


## v13 navigation and sleep update
The eight tabs have been repaired with direct button listeners, explicit panel grouping, keyboard navigation and a visible mobile grid. Sleep tracking now lives inside the Health tab and stores bed time, out-of-bed time, calculated duration, weekly average and date history in the Health log. Previous challenge sleep entries are migrated into this history. Tahajjud check-in opens from 04:00 local time; sessions recorded between 04:00 and the Fajr-to-Fajr boundary are assigned to the upcoming challenge day. The service-worker cache is v13 so a deployment can replace older cached UI files.

## v13 sleep and Tahajjud details
Sleep is logged within the Health tab (not a separate tab). Enter the time you got into bed and the time you got out of bed. The app calculates duration across midnight, rejects incomplete or identical time pairs, and displays recent sleep history, a recent 7-day average, and monthly tracked-night count. Older sleep data saved on challenge-day records is migrated into the Health history on load.

The Tahajjud checkbox is unavailable before 04:00 local time and opens at 04:00. With the default 05:00 Fajr-to-Fajr boundary, a check-in during 04:00–04:59 is assigned to the upcoming challenge day, then remains available for retrospective logging after Fajr. This is a personal tracker setting, not a religious ruling about the valid Tahajjud period.


## v14 habit analytics
The Insights tab now includes a 14/30-day habit matrix, monthly consistency heatmap and four-week trend. It distinguishes target met, partial progress and no record. Missing data is excluded from rates rather than counted as failure. See `QA_REPORT.md` for test coverage and limitations.


## v15 — deeper accountability and journey report
- Added prayer punctuality rate and delayed prayer count based only on recorded prayer statuses.
- Added Sunnah and Nafl check-in totals, plus Quran memorisation and revision-day totals.
- Added a descriptive sleep / unnecessary phone-use comparison when at least three dates have both records; it explicitly avoids causal or medical claims.
- Added a printable personal journey report summarising challenge completion, prayer records, Quran, optional prayers, fasting, dhikr, Muraqaba, commitments, reflections and recorded sleep.
- Existing commitment planning, weekly Muhasaba, recovery prompts, private encrypted quit-habit vault, health tracking and habit matrix remain in place.
- Report data is generated locally from the records on this device; export a JSON backup to retain it.
