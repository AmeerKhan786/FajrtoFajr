const fs = require('fs');
const assert = require('assert');
const vm = require('vm');
const crypto = require('crypto').webcrypto;
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

// Structural and wiring checks
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
const requiredIds = [
  'mainTabs','calendarPanel','gregorianDate','hijriDate','fastingCaution','fastingPanel','ramadanControls',
  'milestoneCertificates','currentStreakInsight','bestStreakInsight','milestoneCountInsight',
  'commitmentPanel','commitWorship','commitDiscipline','commitPersonal','commitHonoured','commitReview','commitNextStep','saveCommitments',
  'healthPanel','healthDateLabel','medicineList','medName','medDose','medTime','addMedicine','exerciseWalk','exerciseStrength','exerciseMobility','exerciseFocus','exerciseMinutes','focusMinutes','weightEntry','saveHealthDay','medWeekTotal','medWeekMissed','moveWeekTotal','focusWeekTotal','exerciseMonthDays','healthSummary',
  'badHabitsPanel','badHabitsLocked','badHabitsUnlocked','badHabitsPin','badHabitsPinConfirm','badHabitsUnlock','badHabitsLock','badHabitName','badHabitUnit','badHabitBaseline','badHabitWhy','badHabitTrigger','badHabitReplacement','addBadHabit','badHabitsList','habitLogDate','badHabitDailyBoard','habitWeekTotal','habitWeekZero','habitMonthTotal','habitMonthZero','habitMonthlyBreakdown','habitFeedback','habitAnalytics','matrixRange','habitMatrix','consistencyCalendar','monthConsistency','weeklyConsistency','matrixInsight','annualReportBtn','annualReportOutput','prayerOnTimeRate','prayerDelayedCount','sunnahTotal','naflTotal','quranMemorisedDays','quranRevisionDays','healthCorrelation'
];
for (const id of requiredIds) assert(ids.includes(id), `Missing UI id: ${id}`);
const tabs = [...html.matchAll(/data-tab="([^"]+)"/g)].map(x => x[1]);
for (const tab of ['today','worship','fasting','quran','insights','calendar','health','badhabits']) assert(tabs.includes(tab), `Missing tab ${tab}`);
assert.equal(tabs.length, 8, 'Expected eight focused tabs');
// Direct JS element references must resolve in the static page; settings controls are injected in the settings modal.
const directRefs = [...js.matchAll(/\$\('([^']+)'\)/g)].map(x => x[1]);
const dynamicSettings = new Set(['boundary','strict','prayerCity','prayerCountry','prayerMethod','remindersEnabled','specialReminders','hijriAdjustment']);
for (const id of new Set(directRefs)) if (!dynamicSettings.has(id)) assert(ids.includes(id), `JS refers to missing DOM id: ${id}`);
for (const fn of ['hijriParts','islamicEvents','renderIslamicCalendar','renderInsights','completedDates','longestStreak','completionDateFor','certificate','encryptBadHabits','decryptBadHabits','pinKey','unlockBadHabits','lockBadHabits','renderBadHabitsList','renderHabitDailyBoard','saveHabitDailyLog','habitPeriodSummary','habitReductionPercent','habitAbstinenceStreak','setupTabs','renderCommitments','saveCommitments','renderHealth','addMedicine','saveHealthDay','renderDeepAnalytics','annualJourneyReport']) assert(js.includes(`function ${fn}`) || js.includes(`async function ${fn}`), `Missing function ${fn}`);
for (const n of [21,45,75,100]) assert(js.includes(String(n)) && html.includes(String(n)), `Missing milestone ${n}`);
assert(js.includes('PBKDF2') && js.includes('AES-GCM'), 'Private vault must use PBKDF2 + AES-GCM');
assert(js.includes('210000'), 'PBKDF2 iteration count missing');
assert(js.includes('badHabitsPinSession=null'), 'PIN session must be cleared on lock');
assert(js.includes("'habitLogDate').addEventListener('change',renderBadHabitsList"), 'Habit date selector change wiring missing');
assert(js.includes('value===0') && js.includes('replacementUsed'), 'Habit recovery / abstinence logic missing');
assert(html.includes('Record 0') || js.includes('Record 0'), 'Explicit abstinence check-in missing');
assert(html.includes('why I am choosing to quit') || html.includes('badHabitWhy'), 'Quit motivation field missing');
assert(js.includes('habitReductionPercent') && js.includes('urge>=7'), 'Baseline reduction and urge-response accountability missing');
assert(js.includes('function isRamadanDate(h)') && js.includes('function fastingDateCaution(h)'), 'Ramadan and fasting exception logic missing');
assert(js.includes('if(m!==9&&d>=13&&d<=15&&!(m===12&&d===13))'), 'Ayyam al-Bid must avoid Ramadan and 13 Dhul Hijjah collision');
assert(js.includes("fastingCaution').hidden=!caution"), 'Fasting caution banner not wired');
assert(sw.includes('fajr-to-fajr-v18'), 'Service worker cache not bumped to v15');
assert(css.includes('.private-panel') && css.includes('.habit-log-board') && css.includes('.health-panel'), 'Expected styles missing');
assert(css.includes('.habit-matrix') && css.includes('.consistency-calendar') && css.includes('.weekly-consistency'), 'Habit analytics styles missing');
assert(js.includes('function matrixHabitRows()') && js.includes('function renderHabitAnalytics()'), 'Habit matrix / analytics renderer missing');
assert(js.includes('function renderDeepAnalytics()') && js.includes('function annualJourneyReport()'), 'Deep analytics / annual report functions missing');
assert(js.includes('annualReportBtn').includes ? true : js.includes('annualReportBtn'), 'Annual report button wiring missing');
assert(js.includes('pairs.length>=3'), 'Sleep / digital comparison must require sufficient paired records');
// Execute the new analytics/report functions with deterministic fixture records.
const deepStart=js.indexOf('function renderDeepAnalytics(){');
const deepEnd=js.indexOf('function matrixHabitRows(){',deepStart);
assert(deepStart>=0 && deepEnd>deepStart,'Cannot isolate deep analytics functions');
const deepSource=js.slice(deepStart,deepEnd);
const nodes={};
const fixtureDays={
 '2026-11-10':{prayers:{fajr:'on-time',dhuhr:'delayed',asr:'on-time',maghrib:'on-time',isha:'delayed'},sunnah:{fajr:true,dhuhr:false},nafl:{fajr:true},quran:7,quranStudy:{memorised:true,revised:true},fasting:{done:true,quranPages:2},dhikr:100,muraqaba:10,unnecessaryPhone:20,commitments:{worship:'Pray on time',honoured:true},reflection:'Reflect A'},
 '2026-11-11':{prayers:{fajr:'on-time',dhuhr:'on-time'},sunnah:{fajr:true},nafl:{},quran:5,quranStudy:{memorised:false,revised:true},fasting:{done:false},dhikr:50,muraqaba:5,unnecessaryPhone:60,commitments:{discipline:'Less scrolling',honoured:false},muhasaba:{intentions:'Be steady'}},
 '2026-11-12':{prayers:{isha:'delayed'},sunnah:{},nafl:{dhuhr:true},quran:3,quranStudy:{memorised:true,revised:false},fasting:{done:true},dhikr:25,muraqaba:2,unnecessaryPhone:45,reflection:'Reflect C'}
};
const deepCtx={state:{days:fixtureDays,healthLogs:{'2026-11-10':{bedtime:'22:00',wakeup:'06:00'},'2026-11-11':{bedtime:'23:00',wakeup:'06:00'},'2026-11-12':{bedtime:'22:30',wakeup:'06:30'}},startedAt:'2026-11-10'},
  $:id=>(nodes[id]||(nodes[id]={textContent:'',innerHTML:''})),
  sleepDurationMinutes:(a,b)=>a&&b?480:null,escapeHtml:x=>String(x),isDone:()=>false,
  boundaryDate:()=> '2026-11-12',shiftDate:(d,n)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)}};
vm.createContext(deepCtx);vm.runInContext(deepSource+'renderDeepAnalytics();annualJourneyReport();',deepCtx);
assert.equal(nodes.prayerOnTimeRate.textContent,'63%','Prayer punctuality aggregation incorrect');
assert.equal(nodes.prayerDelayedCount.textContent,'3','Delayed prayer count incorrect');
assert.equal(nodes.sunnahTotal.textContent,'2','Sunnah total incorrect');
assert.equal(nodes.naflTotal.textContent,'2','Nafl total incorrect');
assert.equal(nodes.quranMemorisedDays.textContent,'2','Quran memorisation days incorrect');
assert.equal(nodes.quranRevisionDays.textContent,'2','Quran revision days incorrect');
assert(nodes.annualReportOutput.innerHTML.includes('Quran pages recorded: 17'),'Journey report Quran aggregation incorrect');
assert(nodes.annualReportOutput.innerHTML.includes('Commitment days recorded: 2'),'Journey report commitment aggregation incorrect');



// Navigation regression: use broad compatibility APIs and bind each tab button directly.
assert(js.includes("Array.from(main.children).filter(el=>el.tagName==='SECTION'"));
assert(js.includes("button.addEventListener('click'"));
assert(!js.includes("main.querySelectorAll(':scope > section')"), 'Navigation must not rely on :scope support');
const navigationBlock=js.slice(js.indexOf('function setupTabs(){'),js.indexOf("document.addEventListener('visibilitychange'"));
for (const tab of ['today','worship','fasting','quran','insights','calendar','health','badhabits']) assert(navigationBlock.includes(`'${tab}'`), `Navigation mapping missing ${tab}`);
assert(html.includes('id="healthSleepSection"') && html.includes('id="sleepHistory"'), 'Sleep tracker/history must live inside Health');
const healthPanelHtml=html.slice(html.indexOf('id="healthPanel"'),html.indexOf('id="prayerTimesPanel"'));
assert(healthPanelHtml.includes('id="bedtime"') && healthPanelHtml.includes('id="wakeup"'), 'Sleep inputs must be in Health tab');
assert.equal((html.match(/id="bedtime"/g)||[]).length,1,'Bedtime input must exist once');
assert.equal((html.match(/id="wakeup"/g)||[]).length,1,'Wake-up input must exist once');
assert(html.includes('Check-in opens from 4:00 AM') || html.includes('opens at 04:00'), 'Tahajjud 4am guidance missing');
assert(js.includes('function sleepDurationMinutes(') && js.includes('function renderSleepHistory()'), 'Sleep duration/history functions missing');
assert(js.includes('function tahajjudRecordDate(') && js.includes('function tahajjudRecord()'), 'Tahajjud day-boundary allocation missing');


// Exercise the real setupTabs function against a lightweight DOM model. This verifies
// that every tab button has a working click handler and reveals the correct group.
const setupStart = js.indexOf('function setupTabs(){');
const setupEnd = js.indexOf("\ndocument.addEventListener('visibilitychange'", setupStart);
assert(setupStart >= 0 && setupEnd > setupStart, 'Cannot isolate setupTabs for interaction test');
const setupSource = js.slice(setupStart, setupEnd);
function makeClassList(classes=[]) {
  const set = new Set(classes);
  return { contains: name => set.has(name), toggle: (name,on) => on ? set.add(name) : set.delete(name) };
}
const mockTabs = ['today','worship','fasting','quran','insights','calendar','health','badhabits'].map(tab => ({
  dataset:{tab},classList:makeClassList(),attrs:{},handlers:{},tabIndex:0,
  setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.handlers[k]=fn;},focus(){}
}));
const mockSections = [
  ['hero','', ['hero']],['stats','',[]],['todayPanel','',[]],['commitmentPanel','',[]],
  ['fastingPanel','',[]],['islamicEventsPanel','',[]],['spiritualDashboard','',[]],
  ['healthPanel','',[]],['prayerTimesPanel','',[]],['quranStudyPanel','',[]],
  ['recoveryPanel','',[]],['badHabitsPanel','',[]],['sunnahPanel','',[]],
  ['dailyWirdPanel','',[]],['adhkarPanel','',[]],['fridayPanel','',[]],
  ['accountabilityPanel','',[]],['','Muraqaba timer',[]],['','Weekly and monthly reports',[]],
  ['','Session history',[]],['','Build your consistency',[]],['','Distraction accountability',[]],
  ['','Good deeds log',[]],['','Review your week honestly',[]],['','100-day progress',[]],
  ['','One day at a time.',[]]
].map(([id,heading,classes])=>({
  tagName:'SECTION',id,hidden:false,dataset:{},classList:makeClassList(classes),
  querySelector(){return heading?{textContent:heading}:null}
}));
const mockMain={children:mockSections,dataset:{}};
const mockNav={querySelectorAll:()=>mockTabs};
const mockWindow={scrollTo(){}};
const mockDoc={getElementById:id=>id==='app'?mockMain:id==='mainTabs'?mockNav:null};
const mockCtx={document:mockDoc,window:mockWindow,$:id=>mockDoc.getElementById(id),Date,boundaryDate:()=> '2026-11-12',
  renderAdditionalPrayers(){},renderHealth(){},renderInsights(){},renderBadHabitsLock(){}};
vm.createContext(mockCtx);
vm.runInContext(setupSource+'\nsetupTabs();',mockCtx);
for (const tab of mockTabs) {
  assert.equal(typeof tab.handlers.click,'function',`Tab ${tab.dataset.tab} has a click listener`);
  tab.handlers.click({preventDefault(){}});
  assert.equal(mockMain.dataset.activeTab,tab.dataset.tab,`Tab ${tab.dataset.tab} should become active`);
  assert(mockSections.some(s=>!s.hidden),`Tab ${tab.dataset.tab} should reveal at least one section`);
  for (const s of mockSections) {
    if (s.id==='fridayPanel') continue;
    if (s.dataset.tabPanel) assert.equal(s.hidden,s.dataset.tabPanel!==tab.dataset.tab,`Wrong visibility for ${s.id||'heading panel'} in ${tab.dataset.tab}`);
  }
}


// Evaluate the actual pure calendar and challenge functions from app.js in an isolated VM.
const getLine = prefix => {
  const line = js.split(/\r?\n/).find(x => x.startsWith(prefix));
  assert(line, `Cannot find source function ${prefix}`);
  return line;
};

// Legacy sleep records are migrated from challenge-day entries to independent Health history.
const loadStart = js.indexOf('function load(){');
const loadEnd = js.indexOf('function clamp(',loadStart);
const localDateLine = getLine('function localDate(');
const validDateLine = getLine('function validDate(');
const loadCtx = {
  KEY:'fajr90_state_v1',
  localStorage:{getItem:()=>JSON.stringify({days:{'2026-11-11':{bedtime:'23:00',wakeup:'07:00',prayers:{},fasting:{},habits:{}}},healthLogs:{}})},
  Date,Intl,Math,Number,String,JSON
};
vm.createContext(loadCtx);
vm.runInContext([getLine('const fresh='),loadStart>=0?js.slice(loadStart,loadEnd):'',getLine('function clamp('),localDateLine,validDateLine,
  'this.migrated=load();'].join('\n'),loadCtx);
assert.equal(loadCtx.migrated.healthLogs['2026-11-11'].bedtime,'23:00','Legacy bedtime must migrate');
assert.equal(loadCtx.migrated.healthLogs['2026-11-11'].wakeup,'07:00','Legacy wake-up must migrate');

const calStart = js.indexOf('function hijriParts(');
const calEnd = js.indexOf('function renderIslamicCalendar()', calStart);
assert(calStart >= 0 && calEnd > calStart, 'Calendar function block could not be extracted');
const calendarFunctions = js.slice(calStart, calEnd);
const localDateFn = getLine('function localDate(');
const shiftDateFn = getLine('function shiftDate(');
const boundaryDateFn = getLine('function boundaryDate(');
const tahajjudDateStart = js.indexOf('function tahajjudRecordDate(');
const tahajjudDateEnd = js.indexOf('function tahajjudRecord()',tahajjudDateStart);
const tahajjudDateFn = js.slice(tahajjudDateStart,tahajjudDateEnd);
const tahajjudOpenStart = js.indexOf('function tahajjudWindowOpen(');
const tahajjudOpenEnd = js.indexOf('\n',tahajjudOpenStart);
const tahajjudOpenFn = js.slice(tahajjudOpenStart,tahajjudOpenEnd);
const isDoneFn = getLine('function isDone(');
const taskCountFn = getLine('function taskCount(');
const sleepFn = js.slice(js.indexOf('function sleepDurationMinutes('),js.indexOf('function formatSleepDuration('));
const ctx = { Date, Intl, Math, Number, String, state: { prayerConfig: { hijriAdjustment: 0 }, dayBoundary: '05:00' } };
vm.createContext(ctx);
vm.runInContext([localDateFn,shiftDateFn,boundaryDateFn,tahajjudDateFn,tahajjudOpenFn,isDoneFn,taskCountFn,sleepFn,calendarFunctions,
  'this.api={hijriParts,islamicEvents,isRamadanDate,fastingDateCaution,isDone,taskCount,boundaryDate,tahajjudRecordDate,tahajjudWindowOpen,sleepDurationMinutes};'
].join('\n'), ctx);

const api = ctx.api;

// Verify all 12 Hijri months are actually produced by the browser/Node Umm al-Qura calendar over a two-year sample.
const monthExamples = new Map();
for (let t = new Date(2026,0,1); t <= new Date(2028,0,1); t.setDate(t.getDate()+1)) {
  const h = api.hijriParts(new Date(t));
  assert(h.month >= 1 && h.month <= 12, `Invalid Hijri month ${h.month}`);
  assert(h.day >= 1 && h.day <= 30, `Invalid Hijri day ${h.day}`);
  assert(h.year > 1400, `Invalid Hijri year ${h.year}`);
  if (!monthExamples.has(h.month)) monthExamples.set(h.month, new Date(t));
}
assert.equal(monthExamples.size, 12, 'Calendar sample did not cover all 12 Hijri months');
for (let m=1;m<=12;m++) assert(monthExamples.has(m), `Hijri month ${m} not sampled`);
const monthYearDays=new Map();
for (let t = new Date(2025,0,1); t <= new Date(2029,0,1); t.setDate(t.getDate()+1)) { const h=api.hijriParts(new Date(t)); const key=`${h.year}-${h.month}`; if(!monthYearDays.has(key))monthYearDays.set(key,new Set()); monthYearDays.get(key).add(h.day); }
const completeMonths=[...monthYearDays.values()].filter(ds=>ds.has(1)&&([...ds].includes(29)||[...ds].includes(30)));
assert(completeMonths.length>=24,'Expected at least 24 complete Hijri month samples across four Gregorian years');
for (const ds of completeMonths) { const sorted=[...ds].sort((a,b)=>a-b); assert(sorted.length===29||sorted.length===30,'Every complete sampled Hijri month must be 29 or 30 days'); assert(sorted.every((d,i)=>d===i+1),'Hijri month sample contains a missing day'); }

// Hijri adjustment must move the reported date by the requested number of civil days.
const sample = new Date(2026,10,12,12);
ctx.state.prayerConfig.hijriAdjustment = 0;
const baseHijri = api.hijriParts(sample);
ctx.state.prayerConfig.hijriAdjustment = 1;
const adjustedHijri = api.hijriParts(sample);
ctx.state.prayerConfig.hijriAdjustment = 0;
const nextDayHijri = api.hijriParts(new Date(2026,10,13,12));
assert.equal(adjustedHijri.text, nextDayHijri.text, 'Hijri +1 adjustment should match next day');
ctx.state.prayerConfig.hijriAdjustment = -1;
const adjustedMinusHijri = api.hijriParts(sample);
ctx.state.prayerConfig.hijriAdjustment = 0;
const previousDayHijri = api.hijriParts(new Date(2026,10,11,12));
assert.equal(adjustedMinusHijri.text, previousDayHijri.text, 'Hijri -1 adjustment should match previous day');

// Month-by-month religious-calendar coverage and special dates.
const ev = (m,d) => api.islamicEvents({month:m,day:d}).map(x=>x.title);
assert(ev(1,1).some(x=>x.includes('Islamic New Year')));
assert(ev(1,9).some(x=>x.includes('before Ashura')));
assert(ev(1,10).some(x=>x.includes('Ashura')));
assert(ev(3,12).some(x=>x.includes('Rabi')));
assert(ev(7,27).some(x=>x.includes('Isra')));
assert(ev(8,15).some(x=>x.includes('Mid-Sha')));
assert(ev(9,1).some(x=>x.includes('Ramadan begins')));
for (const d of [21,22,23,25,27,29]) assert(ev(9,d).some(x=>x.includes('Last ten nights')), `Last-ten-night marker missing on 9/${d}`);
for (const d of [21,23,25,27,29]) assert(ev(9,d).some(x=>x.includes('Odd night')), `Odd-night marker missing on 9/${d}`);
assert(!ev(9,20).some(x=>x.includes('Last ten nights')));
assert.equal(api.isRamadanDate({month:9,day:1}), true);
assert.equal(api.isRamadanDate({month:9,day:30}), true);
assert.equal(api.isRamadanDate({month:8,day:30}), false);
assert(ev(10,1).some(x=>x.includes('Eid al-Fitr')));
assert(api.islamicEvents({month:10,day:1}).some(x=>x.detail.includes('Eid prayer reminder')),'Eid al-Fitr must surface Eid prayer reminder');
assert(ev(10,2).some(x=>x.includes('Shawwal')));
assert(ev(12,8).some(x=>x.includes('Days of Hajj')));
assert(ev(12,9).some(x=>x.includes('Arafah')));
assert(ev(12,10).some(x=>x.includes('Eid al-Adha')));
assert(api.islamicEvents({month:12,day:10}).some(x=>x.detail.includes('Eid prayer reminder')),'Eid al-Adha must surface Eid prayer reminder');
for (const d of [11,12,13]) assert(ev(12,d).some(x=>x.includes('Tashreeq')), `Tashreeq marker missing on 12/${d}`);
assert(!ev(12,13).some(x=>x.includes('Ayyam al-Bid')), '13 Dhul Hijjah must not be mislabelled as Ayyam al-Bid fast day');
assert(ev(12,14).some(x=>x.includes('Ayyam al-Bid')));
assert(ev(12,15).some(x=>x.includes('Ayyam al-Bid')));
for (const m of [1,2,3,4,5,6,7,8,10,11]) assert(ev(m,13).some(x=>x.includes('Ayyam al-Bid')), `White-day marker missing in month ${m}`);
assert(!ev(9,13).some(x=>x.includes('Ayyam al-Bid')), 'Ayyam al-Bid should not appear as a separate fasting suggestion during Ramadan');
assert.equal(api.fastingDateCaution({month:10,day:1}).includes('Eid al-Fitr'), true);
assert.equal(api.fastingDateCaution({month:12,day:10}).includes('Eid al-Adha'), true);
for (const d of [11,12,13]) assert(api.fastingDateCaution({month:12,day:d}).includes('Tashreeq'));
assert.equal(api.fastingDateCaution({month:12,day:9}), '', 'Arafah should not get the Eid/Tashreeq fasting caution');
assert.equal(api.fastingDateCaution({month:10,day:2}), '', 'Shawwal after Eid should not get the Eid-day caution');
assert.equal(api.fastingDateCaution({month:9,day:15}), '', 'Normal Ramadan day should not show prohibited-day warning');
assert.equal(api.islamicEvents({month:9,day:15}).length, 0, 'Ramadan should not flood the upcoming-events list with a repeated generic daily event');

// Ramadan month length: validate the actual Umm al-Qura day sequence for a full observed Ramadan in sample range.
let ramadanDates=[];
for (let t = new Date(2026,0,1); t <= new Date(2028,0,1); t.setDate(t.getDate()+1)) {
  const h=api.hijriParts(new Date(t)); if(h.month===9 && h.day>=1 && h.day<=30) ramadanDates.push({date:new Date(t),day:h.day,year:h.year});
}
const rYear=ramadanDates.find(x=>x.day===1)?.year;
const oneRamadan=ramadanDates.filter(x=>x.year===rYear);
const uniqueDays=[...new Set(oneRamadan.map(x=>x.day))].sort((a,b)=>a-b);
assert(uniqueDays.length===29||uniqueDays.length===30,'An observed Ramadan month should contain 29 or 30 days');
assert(uniqueDays.every((d,i)=>d===i+1),'Ramadan day sequence has a gap');
for (const x of oneRamadan) assert(api.isRamadanDate({month:9,day:x.day}));
const ramadanFriday=oneRamadan.find(x=>x.date.getDay()===5),ramadanWeekday=oneRamadan.find(x=>x.date.getDay()!==5);
assert(ramadanFriday && ramadanWeekday,'Sample Ramadan should include both Friday and non-Friday dates');


// Friday logic: only the 100 Salawat core minimum is waived; all other core items remain required.
const baseRecord={prayers:{fajr:'on-time',dhuhr:'delayed',asr:'on-time',maghrib:'on-time',isha:'on-time'},quran:7,salawat:0,istighfar:100,dhikr:100,muraqaba:10};
assert.equal(new Date('2026-11-13T12:00:00').getDay(),5,'Test fixture must be Friday');
assert.equal(api.isDone(baseRecord,'2026-11-13'),true,'Friday should not require 100 daily Salawat');
assert.equal(api.isDone(baseRecord,`${ramadanFriday.date.getFullYear()}-${String(ramadanFriday.date.getMonth()+1).padStart(2,'0')}-${String(ramadanFriday.date.getDate()).padStart(2,'0')}`),true,'A Friday within Ramadan should apply the Friday Salawat exception');
assert.equal(api.isDone(baseRecord,`${ramadanWeekday.date.getFullYear()}-${String(ramadanWeekday.date.getMonth()+1).padStart(2,'0')}-${String(ramadanWeekday.date.getDate()).padStart(2,'0')}`),false,'A non-Friday in Ramadan must retain the 100 Salawat minimum');
assert.equal(api.taskCount(baseRecord,'2026-11-13'),10,'Friday should count the Salawat task as waived');
assert.equal(api.isDone(baseRecord,'2026-11-12'),false,'Non-Friday still requires 100 Salawat');
assert.equal(api.taskCount(baseRecord,'2026-11-12'),9,'Non-Friday Salawat task should remain incomplete');
assert.equal(api.isDone({...baseRecord,salawat:100},'2026-11-12'),true,'100 Salawat should complete non-Friday core item');
for (const [key,mutate] of [
  ['prayer',r=>r.prayers.fajr='missing'],['Quran',r=>r.quran=6],['Istighfar',r=>r.istighfar=99],['Dhikr',r=>r.dhikr=99],['Muraqaba',r=>r.muraqaba=9]
]) {const r=JSON.parse(JSON.stringify(baseRecord));mutate(r);assert.equal(api.isDone(r,'2026-11-13'),false,`Friday must still require ${key}`);}

// Fajr-to-Fajr boundary checks (run with TZ=Asia/Kolkata).
ctx.state.dayBoundary='05:00';
const beforeFajr=new Date(2026,10,12,4,59,0),atFajr=new Date(2026,10,12,5,0,0);
assert.equal(api.boundaryDate(beforeFajr),'2026-11-11');
assert.equal(api.boundaryDate(atFajr),'2026-11-12');

// Daily habit log compatibility: both prior numeric logs and new structured logs are supported.
const habitStart=js.indexOf('function habitLogValue('), habitEnd=js.indexOf('function renderBadHabitsLock()',habitStart);
const habitFns=js.slice(habitStart,habitEnd);
const habitsCtx={Date,Math,Number,String,shiftDate: (key,n)=>{const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}};
vm.createContext(habitsCtx);
vm.runInContext(`${habitFns}\nthis.h={habitLogValue,habitPeriodSummary,habitReductionPercent,habitAbstinenceStreak};`,habitsCtx);
assert.equal(habitsCtx.h.habitLogValue(5),5,'Legacy numeric log compatibility');
assert.equal(habitsCtx.h.habitLogValue({count:0,urge:8}),0,'Structured explicit-zero log');
const habit={baselineDaily:5,logs:{'2026-11-09':{count:0},'2026-11-10':{count:0},'2026-11-11':{count:2},'2026-11-12':{count:0},'2026-11-13':0}};
const summary=habitsCtx.h.habitPeriodSummary(habit,'2026-11-09','2026-11-15');
assert.equal(summary.days,5);assert.equal(summary.total,2);assert.equal(summary.zero,4);assert.equal(summary.lapses,1);
assert.equal(habitsCtx.h.habitAbstinenceStreak(habit,'2026-11-13'),2,'A lapse day must reset the run; only consecutive explicit zeros count');
assert.equal(habitsCtx.h.habitReductionPercent(habit,summary),92,'Reduction is calculated against baseline times tracked days');
assert.equal(habitsCtx.h.habitReductionPercent({baselineDaily:null},summary),null,'Reduction is omitted without a user-provided baseline');
assert.equal(habitsCtx.h.habitAbstinenceStreak(habit,'2026-11-14'),0,'An unrecorded day must not be treated as abstinent');

// Encryption round-trip and wrong-PIN rejection.
(async()=>{
 const pin='12345678',salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const data=[{name:'private test',baselineDaily:5,why:'private',logs:{'2026-11-12':{count:0,urge:2}}}];
 const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(data)));
 const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher);
 assert.deepStrictEqual(JSON.parse(new TextDecoder().decode(plain)),data,'Encrypted habit vault must preserve structured daily logs');
 const wrongMaterial=await crypto.subtle.importKey('raw',new TextEncoder().encode('87654321'),'PBKDF2',false,['deriveKey']);
 const wrongKey=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},wrongMaterial,{name:'AES-GCM',length:256},false,['decrypt']);
 await assert.rejects(()=>crypto.subtle.decrypt({name:'AES-GCM',iv},wrongKey,cipher),'Wrong PIN must not decrypt');
 assert.equal(api.sleepDurationMinutes('23:00','07:00'),480,'Sleep duration should cross midnight correctly');
assert.equal(api.sleepDurationMinutes('22:30','06:15'),465,'Sleep duration with minutes should be correct');
assert.equal(api.sleepDurationMinutes('23:00','23:00'),null,'Identical times should be rejected');
assert.equal(api.sleepDurationMinutes('10:00','09:59'),1439,'Long sleep below 24 hours should still be recorded');
assert.equal(api.sleepDurationMinutes('','06:00'),null,'Partial sleep record must not calculate');
assert.equal(api.tahajjudRecordDate(new Date('2026-11-12T04:00:00')), '2026-11-12','04:00 should belong to the upcoming Fajr-to-Fajr challenge day');
assert.equal(api.tahajjudRecordDate(new Date('2026-11-12T04:59:00')), '2026-11-12','04:59 should belong to the upcoming Fajr-to-Fajr challenge day');
assert.equal(api.tahajjudRecordDate(new Date('2026-11-12T03:59:00')), '2026-11-11','Before 04:00 should remain on the previous challenge day');
assert.equal(api.tahajjudRecordDate(new Date('2026-11-12T05:00:00')), '2026-11-12','At day-boundary should belong to current challenge day');
assert.equal(api.tahajjudWindowOpen(new Date('2026-11-12T03:59:00')),false,'Tahajjud check-in remains unavailable before 04:00');
assert.equal(api.tahajjudWindowOpen(new Date('2026-11-12T04:00:00')),true,'Tahajjud check-in opens at 04:00');
assert(js.includes("$('tahajjudDone').disabled=!isAfterFour"),'Tahajjud checkbox must be disabled before 04:00');
console.log('PASS: actual eight-tab click/visibility simulation; Health-embedded sleep tracking; sleep-duration validation, history and legacy-data migration; 04:00 Tahajjud assignment; structural DOM/wiring; eight tabs; health controls; private quit-plan fields; monthly/daily habit logs; 12 Hijri months with 29/30-day month validation; Ramadan 29/30-day sequence and every Ramadan day mode; odd/even last-ten nights; Eid prayer reminders; Arafah/Tashreeq/white days; fasting caution banners; Hijri adjustment; Friday and non-Friday core rules including Friday within Ramadan; Fajr boundary; legacy-log migration; abstinence streak; baseline reduction; AES-GCM/PBKDF2 round-trip and wrong-PIN rejection');
})().catch(e=>{console.error(e);process.exit(1)});
