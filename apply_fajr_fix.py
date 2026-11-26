#!/usr/bin/env python3
"""Apply the Fajr to Fajr daily-recording fix to a local repository checkout.

Run from the repository root:
    python apply_fajr_fix.py

The script makes backups before changing either file and refuses to proceed
if the expected source fragments are not present exactly once.
"""
from pathlib import Path
from datetime import datetime
import shutil
import sys

ROOT = Path.cwd()
APP = ROOT / "app.js"
SW = ROOT / "sw.js"

if not APP.is_file() or not SW.is_file():
    sys.exit("Run this script from the FajrtoFajr repository root (app.js and sw.js must exist).")

app = APP.read_text(encoding="utf-8")
sw = SW.read_text(encoding="utf-8")

replacements = [
    (
        "function currentRecord(){return state.startedAt?getRecord():null}",
        "function currentRecord(){return getRecord()}",
        "Allow daily records before starting the challenge",
    ),
    (
        "$('taskControls').hidden=!started;",
        "$('taskControls').hidden=false;",
        "Keep daily tracking controls visible",
    ),
    (
        "$('taskList').innerHTML=started?tasks.map(",
        "$('taskList').innerHTML=tasks.map(",
        "Render daily task list without challenge-start gate",
    ),
    (
        "}).join(''):'<div class=\"empty\">Start your challenge to begin tracking.</div>';",
        "}).join('');",
        "Remove challenge-start empty-state branch",
    ),
    (
        "document.addEventListener('click',e=>{const p=e.target.closest('[data-prayer]');if(p)updatePrayer(p.dataset.prayer,p.value);const s=e.target.closest('[data-counter]');if(s)updateCounter(s.dataset.counter,Number(s.dataset.delta));});",
        "document.addEventListener('change',e=>{const p=e.target.closest('[data-prayer]');if(p)updatePrayer(p.dataset.prayer,p.value);});\ndocument.addEventListener('click',e=>{const s=e.target.closest('[data-counter]');if(s)updateCounter(s.dataset.counter,Number(s.dataset.delta));});",
        "Save prayer dropdown selections on change",
    ),
]

for old, new, description in replacements:
    count = app.count(old)
    if count != 1:
        sys.exit(f"STOP: expected exactly one occurrence for '{description}', found {count}. No files changed.")
    app = app.replace(old, new, 1)

if sw.count("fajr-to-fajr-v15") != 1:
    sys.exit("STOP: expected exactly one v15 service-worker cache name. No files changed.")
sw = sw.replace("fajr-to-fajr-v15", "fajr-to-fajr-v16", 1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
shutil.copy2(APP, ROOT / f"app.js.backup-{stamp}")
shutil.copy2(SW, ROOT / f"sw.js.backup-{stamp}")
APP.write_text(app, encoding="utf-8")
SW.write_text(sw, encoding="utf-8")

print("Updated app.js and sw.js successfully.")
print("Backups were created alongside the originals.")
print("Next: commit and push both files, then test the hosted PWA.")
