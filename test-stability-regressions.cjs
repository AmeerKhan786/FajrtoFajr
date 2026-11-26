'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const app = fs.readFileSync(__dirname + '/app.js', 'utf8');
const sw = fs.readFileSync(__dirname + '/sw.js', 'utf8');

// Report completion must evaluate each record against its own date (Friday rule).
assert.match(app, /rows\.filter\(\(\[d,r\]\)=>isDone\(r,d\)\)/,
  'Weekly/monthly reports must pass each record date into isDone');

// Fasting's Hijri date must follow the Fajr-to-Fajr record date.
assert.match(app, /function saveFasting\(\)\{const r=getRecord\(\),h=hijriParts\(new Date\(boundaryDate\(\)\+'T12:00:00'\)\)/,
  'Fasting must use the active Fajr-to-Fajr date');
assert.match(app, /function renderIslamicCalendar\(\)\{const dayDate=boundaryDate\(\),now=new Date\(dayDate\+'T12:00:00'\)/,
  'Calendar day and fasting record must use the same Fajr boundary');

// Reset and restore must clear decrypted private data and re-render vault lock state.
assert.match(app, /lockBadHabits\(true\);state=fresh\(\);save\(\).*?renderBadHabitsLock\(\);/s,
  'Reset must lock the private vault and refresh its UI');
assert.match(app, /lockBadHabits\(true\);localStorage\.setItem\(KEY,JSON\.stringify\(next\)\);state=next;.*?renderBadHabitsLock\(\);/s,
  'Restore must lock the old vault and refresh its UI');

// A visible app must re-check day-boundary changes; background tab locks the vault.
assert.match(app, /document\.addEventListener\('visibilitychange',\(\)=>\{if\(document\.hidden\).*?refreshDay\(\);render\(\);/s,
  'Visibility return must refresh the active day');
assert.match(app, /setInterval\(\(\)=>\{const nextBoundaryDate=boundaryDate\(\);if\(nextBoundaryDate!==activeBoundaryDate\)/,
  'Open app must detect crossing the Fajr boundary');

// The app shell fallback must be limited to navigation requests, never JS/CSS/API fetches.
assert.match(sw, /if\(request\.mode==='navigate'\)\{\s*const shell=await caches\.match\('\.\/index\.html'\)/,
  'Offline index fallback must only serve navigation requests');
assert.match(sw, /status:503/, 'Missing offline resources should return an explicit 503');
assert.match(sw, /const CACHE='fajr-to-fajr-v18'/, 'Cache version must be incremented');

// Execute the actual boundary and completion functions in an isolated VM.
const line = prefix => {
  const found = app.split(/\r?\n/).find(x => x.startsWith(prefix));
  assert.ok(found, `Missing function: ${prefix}`);
  return found;
};
const ctx = { Date, Math, Number, String, state: { dayBoundary: '05:00' } };
vm.createContext(ctx);
vm.runInContext([
  line('function localDate('),
  line('function boundaryDate('),
  line('function isDone('),
  'this.api={boundaryDate,isDone};'
].join('\n'), ctx);
assert.equal(ctx.api.boundaryDate(new Date(2026,10,26,4,59)), '2026-11-25');
assert.equal(ctx.api.boundaryDate(new Date(2026,10,26,5,0)), '2026-11-26');
const completed={prayers:{fajr:'on-time',dhuhr:'on-time',asr:'on-time',maghrib:'on-time',isha:'on-time'},quran:7,salawat:0,istighfar:100,dhikr:100,muraqaba:10};
assert.equal(ctx.api.isDone(completed,'2026-11-27'), true, 'Friday should waive Salawat core target');
assert.equal(ctx.api.isDone(completed,'2026-11-26'), false, 'Thursday should retain Salawat core target');
console.log('PASS: report date, Fajr-aligned fasting/calendar, private-vault reset/restore, visibility/boundary refresh, offline fallback, cache version, and Friday/date-boundary regression checks');
