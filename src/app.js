// ===== Woodshed app =====
(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
};
const round = (x, d = 0) => (x == null || isNaN(x) ? null : Math.round(x * 10 ** d) / 10 ** d);
const fmtC = (c) => (c == null ? '—' : (c > 0 ? '+' : c < 0 ? '−' : '±') + Math.abs(Math.round(c)) + '¢');
const cls = (c) => { const a = Math.abs(c); return a <= 20 ? 'c-good' : a <= 40 ? 'c-near' : 'c-off'; };

// ---------- music ----------
const NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const SHARPS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const SHARP_KEYS = new Set([7, 2, 9, 4, 11]);
const sharpKey = (m) => SHARP_KEYS.has(((Math.round(m) % 12) + 12) % 12);
const pcName = (m, sharp) => (sharp ? SHARPS : NAMES)[((Math.round(m) % 12) + 12) % 12];
const noteName = (m, sharp) => pcName(m, sharp) + (Math.floor(Math.round(m) / 12) - 1);
const QUAL = {
  maj: { sym: '', voice: [4, 7, 12] },
  maj7: { sym: 'maj7', voice: [4, 7, 11, 14] },
  m7: { sym: 'm7', voice: [3, 7, 10, 14] },
  '7': { sym: '7', voice: [4, 7, 10, 14] },
  maj6: { sym: '6', voice: [4, 7, 9, 14] },
  m: { sym: 'm', voice: [3, 7, 12] },
  m6: { sym: 'm6', voice: [3, 7, 9, 14] },
  m7b5: { sym: 'm7♭5', voice: [3, 6, 10] },
  dim7: { sym: '°7', voice: [3, 6, 9, 12] },
  sus: { sym: '7sus4', voice: [5, 10, 14] },
};
const FN = { 0: 'R', 1: '♭9', 2: '9', 3: '♭3', 4: '3', 5: '11', 6: '♯11', 7: '5', 8: '♭13', 9: '13', 10: '♭7', 11: '7' };
const FN_ORDER = ['R', '♭3', '3', '5', '♭7', '7', '9', '11', '♯11', '13', '♭9', '♭13', '♭5', '°7'];
function fnName(interval, q) {
  const iv = ((interval % 12) + 12) % 12;
  if ((q === 'dim7' || q === 'm7b5') && iv === 6) return '♭5';
  if (q === 'dim7' && iv === 9) return '°7';
  return FN[iv];
}
const chordName = (root, q, sharp) => pcName(root, sharp) + QUAL[q].sym;

// ---------- exercises ----------
const EX = [
  { id: 'glide', noTempo: true, name: 'Lip-trill glide', short: 'Warm-up', tags: ['Warm-up', 'Breath flow'], tempo: 84,
    notes: [[7, 1], [5, 1], [4, 1], [2, 1], [0, 3], [null, 1]], chords: [{ r: 0, q: 'maj', b: 8 }],
    how: 'Lip trill (or hum on “mm”) down 5‑4‑3‑2‑1, connected like one long breath. Keep it light and easy; volume doesn’t matter here.',
    why: 'Lip trills, hums and straw phonation partly close the mouth, which balances the air pressure above and below the vocal folds. It’s the gentlest way to get breath and fold closure coordinated before you ask for more.' },
  { id: 'five', name: 'Five-tone scale', short: 'Clean onsets', tags: ['Intonation', 'Clean onsets'], tempo: 96,
    notes: [[0, 1], [2, 1], [4, 1], [5, 1], [7, 1], [5, 1], [4, 1], [2, 1], [0, 2], [null, 2]], chords: [{ r: 0, q: 'maj7', b: 12 }],
    how: 'Sing on “noo,” then try “nah.” Start each repetition with a clean onset: no breathy “h” before the vowel and no glottal click. Land every note in the center, no scoops.',
    why: 'Clean, balanced onsets are the foundation of tone: the folds meet exactly as the air arrives. Here, scoops and slow settling are flagged so you can hear the difference between an inflection you chose and a habit.' },
  { id: 'maj7arp', name: 'Major 7 arpeggio', short: 'Chord tones', tags: ['Chord-tone intonation'], tempo: 88,
    notes: [[0, 1], [4, 1], [7, 1], [11, 1], [7, 1], [4, 1], [0, 2]], chords: [{ r: 0, q: 'maj7', b: 8 }],
    how: 'Sing on “doo.” Hear the major 7th as a leading tone, a half step under the octave, and don’t let it sag toward the 6th.',
    why: 'Jazz melodies live on 7th chords. The major 7th is the tone singers most often tune flat, and the analysis tracks your accuracy on each chord tone separately.' },
  { id: 'm7arp', name: 'Minor 7 arpeggio + 9', short: 'Minor color', tags: ['Extensions', 'ii-chord color'], tempo: 88,
    notes: [[0, 1], [3, 1], [7, 1], [10, 1], [14, 2], [10, 1], [7, 1], [3, 1], [0, 3]], chords: [{ r: 0, q: 'm7', b: 12 }],
    how: 'Sing on “dah.” The 9th at the top should float; it is a color, not a strain. If it feels high, use the up-then-down direction so you don’t camp at the top.',
    why: 'The minor 7th chord is the ii in a ii–V–I. Its ♭3 and ♭7 are where blues inflection lives, so this makes it easy to see whether you bend those tones on purpose or by accident.' },
  { id: 'guide', name: 'ii–V–I guide tones', short: '3rds & 7ths', tags: ['Hearing harmony', '3rds & 7ths'], tempo: 100,
    notes: [[5, 4], [5, 4], [4, 6], [null, 2], [12, 4], [11, 4], [11, 6], [null, 2]],
    chords: [{ r: 2, q: 'm7', b: 4 }, { r: 7, q: '7', b: 4 }, { r: 0, q: 'maj7', b: 8 }, { r: 2, q: 'm7', b: 4 }, { r: 7, q: '7', b: 4 }, { r: 0, q: 'maj7', b: 8 }],
    how: 'Hold each note while the chord changes underneath. In the first line, the 3rd of the ii chord becomes the 7th of the V without moving, then resolves down a half step to the 3rd of I. The second line does the same from the 7th of ii. Use “oo.”',
    why: 'Guide tones (3rds and 7ths) define the harmony. Feeling one pitch change function under you is the core skill for improvising and for singing melodies with a jazz ear.' },
  { id: 'ext', noTempo: true, name: 'Sing the extensions', short: '9ths & 13ths', tags: ['Intonation vs. harmony', 'Straight tone'], tempo: 66,
    notes: [[0, 2], [4, 2], [7, 2], [11, 2], [14, 2], [9, 2], [0, 4]], chords: [{ r: 0, q: 'maj7', b: 16 }],
    how: 'The chord rings the whole time. Sing each tone straight (no vibrato) and tune it against the piano. The 9th and 13th feel suspended; tune them to the chord, not to the note before.',
    why: 'Extensions are what make jazz harmony sound like jazz, and they’re hard to hear because they aren’t in the basic triad. Straight tone shows your raw intonation without vibrato hiding it.' },
  { id: 'messa', noTempo: true, name: 'Straight tone → late vibrato', short: 'Vibrato control', tags: ['Vibrato', 'Phrase endings'], tempo: 60,
    notes: [[7, 8], [null, 4]], chords: [{ r: 0, q: 'maj7', b: 12 }],
    how: 'Start dead straight, like speaking on pitch. Around beat 3, let vibrato appear on its own; don’t manufacture it. Swell a little, then taper to nothing.',
    why: 'Delayed, relaxed vibrato is a signature jazz sound at the ends of phrases. The analysis measures when your vibrato starts, how fast it is and how wide it is.' },
  { id: 'pulse', noTempo: true, name: 'Vibrato pulses', short: 'Build the motion', tags: ['Vibrato', 'Low register'], tempo: 60, lowZone: true,
    notes: [[0, 4, { rate: 4 }], [null, 2], [0, 4, { rate: 5 }], [null, 2], [0, 4, { rate: 6 }], [null, 2], [0, 6, 'vib'], [null, 4]],
    chords: [{ r: 0, q: 'maj7', b: 28 }],
    how: 'On one comfortable low note, sing “oh” and make small, even pulses in time with the soft ticks: 4 per second, then 5, then 6. Keep each pulse about a quarter tone wide, driven by easy breath and a loose throat, with no jaw or tongue wobble. On the last note there are no ticks: relax and let the pulse turn into a natural vibrato. If your throat starts to squeeze, stop and reset.',
    why: 'Vibrato is a regular pitch oscillation, usually 4.5–6.5 times a second. Pulsing in time gives your body the motion at a speed you choose; then you stop steering it so it can run freely. Some teachers prefer to let vibrato emerge purely from freedom, so treat this as a gentle drill, not a workout. Woodshed measures the rate you produced against each target.' },
  { id: 'switch', noTempo: true, name: 'Straight ↔ vibrato switch', short: 'Vibrato on demand', tags: ['Vibrato control', 'Low register'], tempo: 66, lowZone: true,
    notes: [[0, 2, 'straight'], [0, 2, 'vib'], [0, 2, 'straight'], [0, 2, 'vib'], [null, 2], [4, 2, 'straight'], [4, 2, 'vib'], [2, 2, 'straight'], [2, 4, 'vib'], [null, 4]],
    chords: [{ r: 0, q: 'maj7', b: 24 }],
    how: 'Hold the pitch and switch vibrato on and off every two beats without stopping the sound: straight, vibrato, straight, vibrato. Then do the same as the melody steps down. Keep the volume even through each switch, so only the vibrato changes.',
    why: 'Jazz singers use vibrato as a color they choose: straight at the start of a phrase, warmth at the end. Switching on cue is the clearest test of control. Woodshed checks each two-beat section against its goal (sing live for this one; uploads can’t tell the sections apart).' },
  { id: 'lowbloom', noTempo: true, name: 'Low-note vibrato bloom', short: 'Warmth down low', tags: ['Vibrato', 'Low register', 'Hum to vowel'], tempo: 60, lowZone: true,
    notes: [[7, 6, 'bloom'], [null, 2], [4, 6, 'bloom'], [null, 2], [0, 8, 'bloom'], [null, 4]],
    chords: [{ r: 0, q: 'maj7', b: 28 }],
    how: 'Start each long note on a hum (“mm”) for about a beat, open to “oh,” and let vibrato appear after a beat or two. Down here, use less weight than feels natural: think of your speaking voice on pitch, not a big chesty sound. Extra weight and pressure are a common reason low vibrato turns slow or wobbly or disappears.',
    why: 'Low notes are where many singers lose their vibrato: a heavy sound stiffens it. Starting on a hum keeps the airflow balanced as the vowel opens. The analysis reports whether vibrato appeared on each low note, when it started, and its rate and width.' },
  { id: 'blues', name: 'Blues-scale run', short: 'Swing time', tags: ['Agility', 'Swing feel'], tempo: 120, swing: true,
    notes: [[12, 0.5], [10, 0.5], [7, 0.5], [6, 0.5], [5, 0.5], [3, 0.5], [0, 1], [null, 4]], chords: [{ r: 0, q: '7', b: 8 }],
    how: 'Swing the eighths and sit back on the beat. Scat it: “doo” on downbeats, “bah” on upbeats. Pass through the ♯4 (the blue note) without lingering.',
    why: 'Short, swung notes test agility. Each note still has to land, which shows you whether quick passages smear the pitch.' },
  { id: 'enclose', name: 'Bebop enclosures', short: 'Chromatic aim', tags: ['Chromatic accuracy', 'Scat'], tempo: 116, swing: true,
    notes: [[9, 0.5], [7, 0.5], [5, 0.5], [3, 0.5], [4, 1], [2, 0.5], [-1, 0.5], [0, 2], [null, 2]], chords: [{ r: 0, q: 'maj7', b: 8 }],
    how: 'Each target (the 3rd, then the root) is approached from a step above and a half step below, a classic bebop “enclosure.” Keep the chromatic notes small and quick and land the target dead in tune.',
    why: 'Enclosures are core bebop vocabulary. Approach tones pull your ear off center, so this trains you to aim for the target note.' },
  { id: 'free', name: 'Free sing / song take', short: 'Repertoire', tags: ['Real-world check'], free: true,
    how: 'Sing a phrase or a whole tune. Pick a drone chord to tune against if you like. Each note is compared with the nearest equal-tempered pitch, so deliberate bends and blue notes will show as “off.” Treat that as information, not a grade.',
    why: 'Exercises build skills; songs show whether they transfer. Upload recordings of singers you love as “reference” takes and tag what you like. Woodshed compares those with your own takes.' },
  { id: 'standards', name: 'Standards practice', short: 'Sing over the changes', tags: ['Repertoire', 'Changes', 'Tempo'], free: true, std: true,
    how: 'Pick a tune, a key that suits your voice, a tempo and a feel, then sing the melody (or scat) over piano and bass. Follow the chord chart below; the current bar lights up as it plays. The changes follow common fake-book versions, which vary, so tell me if a tune differs from how you know it. Use “Melody & lyrics” to add the melody and words from your own lead sheet; with a melody saved, you can toggle a melody voice and get note-by-note scoring.',
    why: 'Standards are where all the drills meet: chord-tone intonation, phrasing over changes, and time. Each note is compared with the nearest equal-tempered pitch and labeled with the chord tone it landed on, so your tendencies (like a sagging ♭3) show up in real repertoire. Tempo is tracked per tune.' },
];
for (const ex of EX) {
  if (ex.free) continue;
  ex.beats = ex.notes.reduce((s, n) => s + n[1], 0);
  const offs = ex.notes.filter((n) => n[0] != null).map((n) => n[0]);
  ex.min = Math.min(...offs); ex.max = Math.max(...offs);
}
const exById = (id) => EX.find((e) => e.id === id) || EX[0];

// ---------- settings ----------
const VOICE_PRESETS = [
  { id: 'bass', label: 'Bass', low: 40, top: 60, stretch: 64 },
  { id: 'baritone', label: 'Baritone', low: 43, top: 64, stretch: 67 },
  { id: 'tenor', label: 'Tenor', low: 48, top: 67, stretch: 72 },
  { id: 'alto', label: 'Alto / contralto', low: 52, top: 69, stretch: 72 },
  { id: 'mezzo', label: 'Mezzo-soprano', low: 55, top: 74, stretch: 77 },
  { id: 'soprano', label: 'Soprano', low: 60, top: 79, stretch: 84 },
];
const DEFAULTS = { setupDone: false, customTunes: {}, tuneEdits: {}, melodies: {}, lyrics: {}, focus: [], label: 'Voice not set', low: 55, top: 72, stretch: 74, useStretch: 0, guide: 'first', metro: 1, vol: 0.7, A4: 440 };
let S = { ...DEFAULTS };
const topLimit = () => (+S.useStretch ? S.stretch : S.top);

// ---------- storage ----------
// Everything lives in this browser: IndexedDB when available, localStorage as a fallback.
// Use Progress → Your data to download a backup file or restore one.
const Store = {
  mode: 'local', idb: null, key: 'woodshed.v1',
  async init() {
    try {
      if (!window.indexedDB) return;
      this.idb = await new Promise((res, rej) => {
        const rq = indexedDB.open('woodshed', 1);
        rq.onupgradeneeded = () => { const db = rq.result; if (!db.objectStoreNames.contains('takes')) db.createObjectStore('takes', { keyPath: 'id' }); if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv'); };
        rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); rq.onblocked = () => rej(new Error('blocked'));
      });
      this.mode = 'idb';
      // one-time move of anything saved by older localStorage-based versions
      const old = this._local();
      if ((old.takes && old.takes.length) || old.settings) {
        for (const t of old.takes || []) await this.putTake(t);
        if (old.settings && !(await this.loadSettings())) await this.saveSettings(old.settings);
        try { localStorage.removeItem(this.key); } catch (e) {}
      }
    } catch (e) { this.idb = null; this.mode = 'local'; }
  },
  _tx(store, mode, fn) {
    return new Promise((res, rej) => {
      const tx = this.idb.transaction(store, mode), os = tx.objectStore(store);
      let out; const rq = fn(os); if (rq) rq.onsuccess = () => (out = rq.result);
      tx.oncomplete = () => res(out); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error || new Error('Storage write was aborted (is the disk full?)'));
    });
  },
  _local() { try { return JSON.parse(localStorage.getItem(this.key)) || { takes: [], settings: null }; } catch (e) { return { takes: [], settings: null }; } },
  _saveLocal(d) { try { localStorage.setItem(this.key, JSON.stringify(d)); return true; } catch (e) { return false; } },
  async listTakes() {
    if (this.idb) return ((await this._tx('takes', 'readonly', (os) => os.getAll())) || []).sort((a, b) => b.ts - a.ts);
    return this._local().takes.slice().sort((a, b) => b.ts - a.ts);
  },
  async putTake(take) {
    const body = JSON.parse(JSON.stringify(take));
    if (this.idb) return this._tx('takes', 'readwrite', (os) => os.put(body));
    const d = this._local();
    const i = d.takes.findIndex((t) => t.id === take.id);
    if (i >= 0) d.takes[i] = body; else d.takes.push(body);
    if (!this._saveLocal(d)) throw new Error('Browser storage is full or unavailable');
  },
  async deleteTake(id) {
    if (this.idb) return this._tx('takes', 'readwrite', (os) => os.delete(id));
    const d = this._local(); d.takes = d.takes.filter((t) => t.id !== id); this._saveLocal(d);
  },
  async loadSettings() {
    if (this.idb) return (await this._tx('kv', 'readonly', (os) => os.get('settings'))) || null;
    return this._local().settings;
  },
  async saveSettings(s) {
    const body = JSON.parse(JSON.stringify(s));
    if (this.idb) return this._tx('kv', 'readwrite', (os) => os.put(body, 'settings'));
    const d = this._local(); d.settings = body; this._saveLocal(d);
  },
  async clearAll() {
    if (this.idb) { await this._tx('takes', 'readwrite', (os) => os.clear()); await this._tx('kv', 'readwrite', (os) => os.clear()); }
    try { localStorage.removeItem(this.key); } catch (e) {}
  },
};
// one write at a time per take, coalescing bursts
const writers = new Map();
function saveTakeSoon(take, delay = 700) {
  let w = writers.get(take.id);
  if (!w) { w = { timer: null, busy: false, dirty: false }; writers.set(take.id, w); }
  clearTimeout(w.timer);
  setSaveState('Saving…');
  w.timer = setTimeout(() => flush(take, w), delay);
}
async function flush(take, w) {
  if (w.busy) { w.dirty = true; return; }
  w.busy = true;
  try { await Store.putTake(take); setSaveState('Saved in this browser'); requestPersist(); }
  catch (e) { setSaveState('Couldn’t save: ' + (e.message || e.code || e)); }
  w.busy = false;
  if (w.dirty) { w.dirty = false; flush(take, w); }
}
let persistAsked = false;
function requestPersist() {
  if (persistAsked) return; persistAsked = true;
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
}
let settingsTimer = null;
function saveSettingsSoon() {
  clearTimeout(settingsTimer);
  settingsTimer = setTimeout(() => Store.saveSettings(S).catch(() => toast('Couldn’t save settings')), 600);
}
const setSaveState = (t) => { const e = $('saveState'); if (e) e.textContent = t; };

// ---------- timeline ----------
function rootRange(ex) {
  const top = ex.lowZone ? Math.min(topLimit(), S.low + 10) : topLimit();
  const rMin = S.low - ex.min, rMax = top - ex.max;
  return rMax < rMin ? [rMin, rMin] : [rMin, rMax];
}
function rootSequence(ex, start, dir, reps) {
  const [rMin, rMax] = rootRange(ex);
  const seq = [];
  if (dir === 'down') { for (let r = start; r >= rMin && seq.length < reps; r--) seq.push(r); }
  else if (dir === 'updown') {
    const up = [];
    for (let r = start; r <= rMax && up.length < Math.ceil((reps + 1) / 2); r++) up.push(r);
    seq.push(...up);
    for (let k = up.length - 2; k >= 0 && seq.length < reps; k--) seq.push(up[k]);
  } else { for (let r = start; r <= rMax && seq.length < reps; r++) seq.push(r); }
  return seq.length ? seq : [start];
}
const swingMap = (b) => { const f = Math.floor(b), r = b - f; return f + (r <= 0.5 ? r * (4 / 3) : 2 / 3 + (r - 0.5) * (2 / 3)); };

function buildTimeline(ex, roots, tempo) {
  const spb = 60 / tempo;
  const notes = [], chords = [], clicks = [];
  const first = ex.chords[0];
  for (let b = 0; b < 4; b++) clicks.push({ t: b * spb, accent: b === 0 });
  chords.push({ t0: 0, t1: 4 * spb, root: roots[0] + first.r, q: first.q, cue: true, sharp: sharpKey(roots[0]) });
  let beat = 4;
  roots.forEach((root, k) => {
    const ps = beat;
    const sh = sharpKey(root);
    let cb = 0;
    const chs = [];
    for (const c of ex.chords) {
      const ch = { t0: (ps + cb) * spb, t1: (ps + cb + c.b) * spb, root: root + c.r, q: c.q, b0: cb, b1: cb + c.b, sharp: sh };
      chords.push(ch); chs.push(ch); cb += c.b;
    }
    let nb = 0;
    for (const [off, b, goal] of ex.notes) {
      if (off != null) {
        const sb = ex.swing ? swingMap(nb) : nb, eb = ex.swing ? swingMap(nb + b) : nb + b;
        const ch = chs.find((c) => nb >= c.b0 && nb < c.b1) || chs[0];
        notes.push({ midi: root + off, t0: (ps + sb) * spb, t1: (ps + eb) * spb, fn: fnName(root + off - ch.root, ch.q),
          chord: chordName(ch.root, ch.q, sh), sharp: sh, rep: k, goal: goal || null, guide: S.guide === 'all' || (S.guide === 'first' && k === 0) });
      }
      if (goal && goal.rate) {
        const a = (ps + nb) * spb, e = (ps + nb + b) * spb;
        for (let t = a + spb; t < e - 0.01; t += 1 / goal.rate) clicks.push({ t, tick: true });
      }
      nb += b;
    }
    if (+S.metro) for (let b = 0; b < ex.beats; b++) if (b % 2 === 1) clicks.push({ t: (ps + b) * spb });
    beat += ex.beats;
    if (k < roots.length - 1) {
      const nx = roots[k + 1];
      chords.push({ t0: beat * spb, t1: (beat + 4) * spb, root: nx + first.r, q: first.q, cue: true, sharp: sharpKey(nx) });
      if (+S.metro) { clicks.push({ t: (beat + 1) * spb }); clicks.push({ t: (beat + 3) * spb }); }
      beat += 4;
    }
  });
  return { notes, chords, clicks, total: beat * spb + 0.6, spb };
}

// ---------- audio engine ----------
// Direct additive synthesis into a sample buffer (fast, no audio-graph overhead).
const Synth = (() => {
  const N = 4096, SIN = new Float32Array(N + 1);
  for (let i = 0; i <= N; i++) SIN[i] = Math.sin((2 * Math.PI * i) / N);
  const hz = (m) => DSP.midiToHz(m, S.A4);
  // partials: [[mult, amp]], env(tSinceStart) -> gain; renders from t0 for dur seconds
  function add(out, sr, t0, dur, f, partials, env) {
    const s0 = Math.max(0, Math.round(t0 * sr)), s1 = Math.min(out.length, Math.round((t0 + dur) * sr));
    const P = partials.filter(([m]) => f * m < sr / 2 - 200);
    const inc = P.map(([m]) => (f * m * N) / sr), ph = P.map(() => 0);
    const B = 32; // envelope evaluated every 32 samples, linearly interpolated
    let gA = env(0);
    for (let blk = s0; blk < s1; blk += B) {
      const end = Math.min(s1, blk + B), gB = env((end - s0) / sr), step = (gB - gA) / (end - blk);
      let g = gA;
      for (let i = blk; i < end; i++, g += step) {
        let v = 0;
        for (let k = 0; k < P.length; k++) { const p = ph[k]; const j = p | 0; v += P[k][1] * (SIN[j] + (SIN[j + 1] - SIN[j]) * (p - j)); ph[k] = (p + inc[k]) % N; }
        out[i] += g * v;
      }
      gA = gB;
    }
  }
  function ep(out, sr, midi, t0, t1, vel) {
    const d = Math.max(0.03, t1 - t0), rel = 0.35;
    const env = (t) => {
      if (t < 0.006) return (vel * t) / 0.006;
      let g = vel * (0.38 + 0.62 * Math.exp(-(t - 0.006) / 0.45));
      if (t > d) g *= Math.exp(-(t - d) / 0.12);
      return g;
    };
    add(out, sr, t0, d + rel, hz(midi), [[1, 1.25], [3, 0.002], [5, 0.02]], env);
    // bright attack partial (2nd harmonic) that fades quickly
    add(out, sr, t0, Math.min(d + rel, 0.8), hz(midi), [[2, 0.35]], (t) => env(t) * Math.exp(-t / 0.25));
  }
  function voicing(out, sr, root, q, t0, t1, vel = 0.075) {
    const v = QUAL[q].voice;
    let base = root; while (base + v[0] < 50) base += 12; while (base + v[0] > 61) base -= 12;
    for (const iv of v) ep(out, sr, base + iv, t0, t1, vel);
  }
  function bass(out, sr, midi, t0, t1, peak, sus, tau) {
    const d = Math.max(0.05, t1 - t0);
    const env = (t) => {
      if (t < 0.008) return (peak * t) / 0.008;
      let g = sus + (peak - sus) * Math.exp(-(t - 0.008) / tau);
      if (t > d - 0.03) g *= Math.max(0, (d - t) / 0.03 + 0);
      return t > d ? 0 : g;
    };
    add(out, sr, t0, d, hz(midi), [[1, 1], [2, 0.12], [3, 0.1], [4, 0.03]], env);
  }
  function guide(out, sr, midi, t0, t1) {
    const e = Math.max(0.06, t1 - t0 - 0.04);
    const env = (t) => (t < 0.04 ? (0.2 * t) / 0.04 : t < e ? 0.2 : Math.max(0, 0.2 * (1 - (t - e) / 0.05)));
    add(out, sr, t0, e + 0.05, hz(midi), [[1, 1], [3, -0.11], [5, 0.04]], env);
  }
  function click(out, sr, t, accent, tick) {
    const f = tick ? 3200 : accent ? 2200 : 1600, a = tick ? 0.035 : accent ? 0.08 : 0.05;
    add(out, sr, t, 0.05, f, [[1, 1], [3, 0.3]], (x) => (x < 0.002 ? (a * x) / 0.002 : a * Math.exp(-(x - 0.002) / 0.008)));
  }
  return { voicing, bass, guide, click };
})();
const AE = {
  ctx: null, master: null, bus: null, droneBus: null,
  async ensure() {
    if (!this.ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      this.ctx = new C({ latencyHint: 'interactive' });
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3;
      this.master = this.ctx.createGain(); this.master.gain.value = 0.9;
      this.master.connect(comp); comp.connect(this.ctx.destination);
    }
    if (this.ctx.state !== 'running') await this.ctx.resume();
    return this.ctx;
  },
  newBus(vol) {
    const g = this.ctx.createGain(); g.gain.value = vol; g.connect(this.master); return g;
  },
  ep(bus, midi, t0, t1, vel = 0.16) {
    const c = bus.context, f = DSP.midiToHz(midi, S.A4);
    const g = c.createGain(); g.connect(bus);
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
    const g2 = c.createGain(); g2.gain.setValueAtTime(0.35, t0); g2.gain.exponentialRampToValueAtTime(0.04, t0 + 0.6);
    const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = f; const g3 = c.createGain(); g3.gain.value = 0.25;
    o1.connect(g); o2.connect(g2).connect(g); o3.connect(g3).connect(g);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vel, t0 + 0.006);
    g.gain.setTargetAtTime(vel * 0.38, t0 + 0.01, 0.45);
    g.gain.setValueAtTime(vel * 0.38, Math.max(t0 + 0.02, t1 - 0.01));
    g.gain.setTargetAtTime(0, t1, 0.12);
    for (const o of [o1, o2, o3]) { o.start(t0); o.stop(t1 + 0.8); }
  },
  bass(bus, midi, t0, t1) {
    const c = bus.context; let m = midi; while (m > 47) m -= 12; while (m < 36) m += 12;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = DSP.midiToHz(m, S.A4);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    const g = c.createGain(); o.connect(lp).connect(g).connect(bus);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.32, t0 + 0.01); g.gain.setTargetAtTime(0.16, t0 + 0.02, 0.35);
    g.gain.setValueAtTime(0.16, Math.max(t0 + 0.03, t1 - 0.02)); g.gain.setTargetAtTime(0, t1 - 0.02, 0.05);
    o.start(t0); o.stop(t1 + 0.4);
  },
  chord(bus, root, q, t0, t1) {
    const v = QUAL[q].voice;
    let base = root; while (base + v[0] < 50) base += 12; while (base + v[0] > 61) base -= 12;
    for (const iv of v) this.ep(bus, base + iv, t0, t1, 0.085);
    this.bass(bus, root, t0, t1);
  },
  voicing(bus, root, q, t0, t1, vel = 0.075) {
    const v = QUAL[q].voice;
    let base = root; while (base + v[0] < 50) base += 12; while (base + v[0] > 61) base -= 12;
    for (const iv of v) this.ep(bus, base + iv, t0, t1, vel);
  },
  bassNote(bus, midi, t0, t1) {
    const c = bus.context;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = DSP.midiToHz(midi, S.A4);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650;
    const g = c.createGain(); o.connect(lp).connect(g).connect(bus);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.34, t0 + 0.008); g.gain.setTargetAtTime(0.2, t0 + 0.02, 0.18);
    g.gain.setValueAtTime(0.2, Math.max(t0 + 0.03, t1 - 0.03)); g.gain.linearRampToValueAtTime(0, t1);
    o.start(t0); o.stop(t1 + 0.05);
  },
  pad(bus, midi, t0, t1, vel = 0.05, attack = 0.6) {
    const c = bus.context, f = DSP.midiToHz(midi, S.A4);
    const g = c.createGain(); g.connect(bus);
    for (const [mult, type, amp] of [[1, 'sine', 1], [1.003, 'triangle', 0.35], [2, 'sine', 0.2]]) {
      const o = c.createOscillator(); o.type = type; o.frequency.value = f * mult;
      const a = c.createGain(); a.gain.value = amp; o.connect(a).connect(g); o.start(t0); o.stop(t1 + 1);
    }
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vel, t0 + attack); g.gain.setValueAtTime(vel, t1); g.gain.linearRampToValueAtTime(0, t1 + 0.8);
  },
  guide(bus, midi, t0, t1) {
    const c = bus.context;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = DSP.midiToHz(midi, S.A4);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600;
    const g = c.createGain(); o.connect(lp).connect(g).connect(bus);
    const e = Math.max(t0 + 0.06, t1 - 0.04);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.2, t0 + 0.04); g.gain.setValueAtTime(0.2, e); g.gain.linearRampToValueAtTime(0, e + 0.05);
    o.start(t0); o.stop(e + 0.1);
  },
  click(bus, t, accent, tick) {
    const c = bus.context, o = c.createOscillator(), g = c.createGain();
    o.type = tick ? 'sine' : 'square'; o.frequency.value = tick ? 3200 : accent ? 2200 : 1600;
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    o.connect(hp).connect(g).connect(bus);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(tick ? 0.035 : accent ? 0.08 : 0.05, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.04);
    o.start(t); o.stop(t + 0.06);
  },
  // Accompaniment is rendered ahead of time (OfflineAudioContext) so playback never stutters,
  // however many notes a chorus has. Band and melody are separate buffers so the melody can be muted live.
  cache: new Map(),
  sigOf(tl, part) {
    const str = JSON.stringify([part, S.A4, tl.total, part === 'band' ? [tl.comp || tl.chords, tl.bass || null, tl.clicks] : tl.notes.filter((n) => n.guide).map((n) => [n.midi, n.t0, n.t1])]);
    let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return part + h + ':' + str.length;
  },
  async render(tl, part) {
    const sr = this.ctx.sampleRate, len = Math.ceil((tl.total + 1.5) * sr);
    const out = new Float32Array(len);
    const jobs = [];
    if (part === 'band') {
      if (tl.comp) {
        for (const c of tl.comp) jobs.push(() => Synth.voicing(out, sr, c.root, c.q, c.t0, c.t1, c.vel));
        for (const b of tl.bass) jobs.push(() => Synth.bass(out, sr, b.midi, b.t0, b.t1, 0.34, 0.2, 0.18));
      } else for (const ch of tl.chords) jobs.push(() => { Synth.voicing(out, sr, ch.root, ch.q, ch.t0, ch.t1, 0.085); let m = ch.root; while (m > 47) m -= 12; while (m < 36) m += 12; Synth.bass(out, sr, m, ch.t0, ch.t1, 0.32, 0.16, 0.35); });
      for (const k of tl.clicks) jobs.push(() => Synth.click(out, sr, k.t, k.accent, k.tick));
    } else for (const n of tl.notes) if (n.guide) jobs.push(() => Synth.guide(out, sr, n.midi, n.t0, n.t1));
    let t = performance.now();
    for (let i = 0; i < jobs.length; i++) {
      jobs[i]();
      if (performance.now() - t > 40) { await new Promise((r) => setTimeout(r, 0)); t = performance.now(); }
    }
    const buf = this.ctx.createBuffer(1, len, sr);
    buf.copyToChannel(out, 0);
    return buf;
  },
  get(tl, part) {
    const key = this.sigOf(tl, part);
    if (!this.cache.has(key)) {
      if (this.cache.size > 8) this.cache.delete(this.cache.keys().next().value);
      this.cache.set(key, this.render(tl, part).catch((e) => { this.cache.delete(key); throw e; }));
    }
    return this.cache.get(key);
  },
  async prepare(tl) {
    const hasMel = tl.notes.some((n) => n.guide);
    const [band, mel] = await Promise.all([this.get(tl, 'band'), hasMel ? this.get(tl, 'melody') : null]);
    return { band, mel };
  },
  playPrepared(bufs, T0, melodyOn = true) {
    this.stopBus();
    const bus = (this.bus = this.newBus(+S.vol));
    const srcs = [];
    const a = this.ctx.createBufferSource(); a.buffer = bufs.band; a.connect(bus); a.start(T0); srcs.push(a);
    this.melGain = null;
    if (bufs.mel) {
      const g = this.ctx.createGain(); g.gain.value = melodyOn ? 1 : 0; g.connect(bus); this.melGain = g;
      const b = this.ctx.createBufferSource(); b.buffer = bufs.mel; b.connect(g); b.start(T0); srcs.push(b);
    }
    this.srcs = srcs;
  },
  setMelody(on) { if (this.melGain) this.melGain.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.02); },
  startDrone(root, q) {
    this.stopDrone();
    if (!q) return;
    const bus = (this.droneBus = this.newBus(+S.vol));
    const now = this.ctx.currentTime + 0.05;
    let base = root; while (base < 48) base += 12; while (base > 59) base -= 12;
    const tones = [0, ...QUAL[q].voice.slice(0, 3)];
    for (const iv of tones) this.pad(bus, base + iv, now, now + 3600, 0.035, 0.15);
    this.pad(bus, base - 12, now, now + 3600, 0.05, 0.15);
  },
  stopBus() {
    if (this.bus) { const b = this.bus, srcs = this.srcs || []; b.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03); setTimeout(() => { srcs.forEach((x) => { try { x.stop(); } catch (e) {} }); b.disconnect(); }, 300); this.bus = null; this.srcs = []; this.melGain = null; }
  },
  stopDrone() { if (this.droneBus) { const b = this.droneBus; b.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06); setTimeout(() => b.disconnect(), 800); this.droneBus = null; } },
  playBuffer(raw, sr, from, to) {
    this.stopPlayback();
    const s0 = Math.max(0, Math.floor(from * sr)), s1 = Math.min(raw.length, Math.ceil(to * sr));
    if (s1 <= s0) return;
    const buf = this.ctx.createBuffer(1, s1 - s0, sr);
    buf.copyToChannel(raw.subarray(s0, s1), 0);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const g = this.ctx.createGain(); g.gain.value = 1; src.connect(g).connect(this.master);
    src.start(); this.player = src;
    return src;
  },
  stopPlayback() { if (this.player) { try { this.player.stop(); } catch (e) {} this.player = null; } },
};

// ---------- mic capture ----------
const Mic = {
  stream: null, src: null, proc: null, chunks: [], ring: new Float32Array(4096), ringPos: 0, capStart: null,
  async start() {
    const ctx = await AE.ensure();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 } });
    this.src = ctx.createMediaStreamSource(this.stream);
    this.proc = ctx.createScriptProcessor(2048, 1, 1);
    const sink = ctx.createGain(); sink.gain.value = 0;
    this.chunks = []; this.capStart = null; this.ring.fill(0);
    this.proc.onaudioprocess = (e) => {
      const d = e.inputBuffer.getChannelData(0);
      if (this.capStart == null) this.capStart = ctx.currentTime - d.length / ctx.sampleRate;
      this.chunks.push(new Float32Array(d));
      const r = this.ring;
      if (d.length >= r.length) r.set(d.subarray(d.length - r.length));
      else { r.copyWithin(0, d.length); r.set(d, r.length - d.length); }
    };
    this.src.connect(this.proc); this.proc.connect(sink); sink.connect(ctx.destination);
    this.sink = sink;
  },
  stop() {
    try { this.src && this.src.disconnect(); this.proc && this.proc.disconnect(); this.sink && this.sink.disconnect(); } catch (e) {}
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    const len = this.chunks.reduce((s, c) => s + c.length, 0);
    const raw = new Float32Array(len); let o = 0;
    for (const c of this.chunks) { raw.set(c, o); o += c.length; }
    this.chunks = []; this.stream = null;
    return raw;
  },
};

// ---------- piano roll ----------
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function fitCanvas(cv, w, h) {
  const dpr = window.devicePixelRatio || 1;
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); return g;
}
function drawRoll(cv, o) {
  const W = o.width, H = o.height, g = fitCanvas(cv, W, H);
  const lo = o.lo, hi = o.hi, padL = 44, padT = 22;
  const y = (m) => padT + ((hi - m) / (hi - lo)) * (H - padT - 8);
  const x = (t) => padL + ((t - o.t0) / (o.t1 - o.t0)) * (W - padL - 8);
  g.clearRect(0, 0, W, H);
  // out-of-range shading
  g.fillStyle = 'rgba(255,255,255,0.025)';
  g.fillRect(padL, padT, W - padL, y(topLimit() + 0.5) - padT);
  g.fillRect(padL, y(S.low - 0.5), W - padL, H - y(S.low - 0.5));
  // grid
  g.font = '11px ' + css('--mono');
  for (let m = Math.ceil(lo); m <= Math.floor(hi); m++) {
    const yy = y(m), isC = m % 12 === 0, black = [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
    if (black) { g.fillStyle = 'rgba(255,255,255,0.018)'; g.fillRect(padL, yy - (y(m) - y(m + 0.5)), W - padL, (y(m) - y(m + 1))); }
    g.strokeStyle = isC ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.045)';
    g.beginPath(); g.moveTo(padL, yy); g.lineTo(W, yy); g.stroke();
    if (!black || isC) { g.fillStyle = isC ? css('--text') : css('--dim'); g.fillText(noteName(m), 6, yy + 4); }
  }
  // chords
  g.fillStyle = css('--muted'); g.font = '12px ' + css('--sans');
  for (const c of o.chords || []) {
    if (c.t1 < o.t0 || c.t0 > o.t1) continue;
    const xx = Math.max(padL, x(c.t0));
    g.strokeStyle = 'rgba(255,255,255,0.07)'; g.beginPath(); g.moveTo(x(c.t0), padT - 4); g.lineTo(x(c.t0), H); g.stroke();
    g.fillStyle = c.cue ? css('--dim') : css('--brass');
    g.fillText(chordName(c.root, c.q, c.sharp), xx + 4, 15);
  }
  // targets (±20¢ band)
  for (const n of o.targets || []) {
    if (n.t1 < o.t0 || n.t0 > o.t1) continue;
    const x0 = x(n.t0), x1 = x(n.t1), yc = y(n.midi), hh = Math.max(5, y(n.midi - 0.2) - yc);
    g.fillStyle = n.sel ? 'rgba(217,164,65,0.55)' : n.missed ? 'rgba(228,111,95,0.25)' : 'rgba(217,164,65,0.34)';
    g.fillRect(x0, yc - hh, Math.max(2, x1 - x0 - 2), hh * 2);
    if (n.sel) { g.strokeStyle = css('--brass'); g.strokeRect(x0, yc - hh, Math.max(2, x1 - x0 - 2), hh * 2); }
  }
  // trace
  const tr = o.trace;
  if (tr && tr.length) {
    g.lineWidth = 2.2; g.lineCap = 'round';
    const colOf = (t, m) => {
      let ref = null;
      if (o.targets) for (const n of o.targets) if (t >= n.t0 && t <= n.t1) { ref = n.midi; break; }
      if (ref == null) { if (o.targets && o.targets.length && !o.free) return 'rgba(237,230,214,0.35)'; ref = Math.round(m); }
      const c = Math.abs((m - ref) * 100);
      return c <= 20 ? css('--good') : c <= 40 ? css('--near') : css('--off');
    };
    let prev = null;
    for (const p of tr) {
      if (!p || p.m == null || p.t < o.t0 - 0.1 || p.t > o.t1 + 0.1) { prev = null; continue; }
      if (prev && p.t - prev.t < 0.06) {
        g.strokeStyle = colOf(p.t, p.m);
        g.beginPath(); g.moveTo(x(prev.t), y(prev.m)); g.lineTo(x(p.t), y(p.m)); g.stroke();
      }
      prev = p;
    }
  }
  if (o.playhead != null) {
    g.strokeStyle = 'rgba(237,230,214,0.6)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(x(o.playhead), padT - 6); g.lineTo(x(o.playhead), H); g.stroke();
  }
  return { x, y };
}

// ---------- UI state ----------
const st = {
  exId: 'five', starts: {}, dir: 'up', reps: 6, tempos: {},
  droneKey: 0, droneQ: '',
  std: { tune: 'autumn', keys: {}, tempos: {}, feels: {}, choruses: 2, melodyOn: true, autoscroll: true },
  running: null, // {kind:'play'|'live', ...}
  current: null, // current take (object) + raw audio
  takes: [], sel: -1,
};
const micAllowed = () => {
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return false;
  try { if (document.featurePolicy && !document.featurePolicy.allowsFeature('microphone')) return false; } catch (e) {}
  return true;
};

function toast(msg, ms = 2600) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), ms);
}
function overlay(on, text) { $('overlay').hidden = !on; if (text) $('overlayText').textContent = text; }

function showTab(name) {
  for (const b of $('tabs').children) b.classList.toggle('on', b.dataset.tab === name);
  for (const s of ['practice', 'review', 'history', 'trends', 'settings']) $('tab-' + s).hidden = s !== name;
  Tip.hide(true);
  if (name === 'trends') renderTrends();
  if (name === 'review') renderReview();
  if (name === 'history') renderHistory();
  if (name === 'practice') { drawIdleRoll(); renderTempoHint(); }
}

// ---------- practice tab ----------
function renderExList() {
  const box = $('exList'); box.innerHTML = '';
  for (const ex of EX) {
    box.append(el('button', { class: 'exitem' + (ex.id === st.exId ? ' on' : ''), onclick: () => selectExercise(ex.id) },
      el('b', {}, ex.name), el('span', {}, ex.short)));
  }
}
function selectExercise(id) {
  if (st.running) stopAll();
  st.exId = id; renderExList(); renderExDetail(); drawIdleRoll();
  try { localStorage.setItem('woodshed.ex', id); } catch (e) {}
}
function renderExDetail() {
  const ex = exById(st.exId);
  $('exName').textContent = ex.name;
  $('exTags').innerHTML = ''; ex.tags.forEach((t) => $('exTags').append(el('span', { class: 'tag' }, t)));
  $('exHow').textContent = ex.how; $('exWhy').textContent = ex.why;
  document.querySelectorAll('[data-ex]').forEach((e) => (e.hidden = !!ex.free));
  document.querySelectorAll('[data-free]').forEach((e) => (e.hidden = !ex.free || !!ex.std));
  document.querySelectorAll('[data-std]').forEach((e) => (e.hidden = !ex.std));
  $('stdEditor').hidden = !ex.std || !st.std.editorOpen;
  $('progBuilder').hidden = !ex.free || !st.builder.open;
  $('btnPlay').hidden = !!ex.free && !ex.std;
  if (!ex.free) {
    const [rMin, rMax] = rootRange(ex);
    const s = $('selStart'); s.innerHTML = '';
    for (let r = rMin; r <= rMax; r++) s.append(el('option', { value: r }, `${pcName(r, sharpKey(r))} (sings ${noteName(r + ex.min)}${ex.max > ex.min ? '–' + noteName(r + ex.max) : ''})`));
    let start = st.starts[ex.id];
    if (start == null || start < rMin || start > rMax) start = st.dir === 'down' ? rMax : rMin;
    s.value = start; st.starts[ex.id] = start;
    $('selDir').value = st.dir;
    const rs = $('selReps'); rs.innerHTML = '';
    for (const n of [1, 2, 3, 4, 5, 6, 8, 10, 12]) rs.append(el('option', { value: n }, n));
    rs.value = st.reps;
    $('inTempo').value = st.tempos[ex.id] || ex.tempo;
  } else if (ex.std) renderStdControls();
  else renderChordPad();
  renderTempoHint();
  updateModeHint();
}
function logToChords(log, end) {
  const out = [];
  log.forEach((c, i) => {
    if (!c.q) return;
    const t1 = i + 1 < log.length ? log[i + 1].t : end;
    if (t1 > c.t) out.push({ t0: c.t, t1, root: c.root, q: c.q });
  });
  return out;
}
const Q_LIST = [['', 'Off'], ['maj', 'maj'], ['maj7', 'maj7'], ['7', '7'], ['m7', 'm7'], ['maj6', '6'], ['dim7', 'dim (°7)']];
function setDrone(key, q) {
  st.droneKey = key; st.droneQ = q;
  const r = st.running;
  if (r && r.kind === 'live' && r.free) {
    if (q) AE.startDrone(key + 48, q); else AE.stopDrone();
    const t = AE.ctx.currentTime - r.T0;
    const last = r.chordLog[r.chordLog.length - 1];
    if (last && t - last.t < 0.05) r.chordLog.pop();
    r.chordLog.push({ t, root: key + 48, q: q || null });
  }
  renderChordPad();
}
function renderChordPad() {
  const box = $('chordPad'); if (!box) return;
  box.innerHTML = '';
  const cur = st.droneQ ? pcName(st.droneKey) + QUAL[st.droneQ].sym : 'no drone';
  const row2 = el('div', { class: 'prow' }, el('span', { class: 'plabel' }, 'Chord type'),
    Q_LIST.map(([q, lbl]) => el('button', { class: 'pbtn' + (st.droneQ === q ? ' on' : ''), onclick: () => setDrone(st.droneKey, q) }, lbl)),
    el('span', { class: 'nowchord' }, st.droneQ ? cur : ''));
  const row3 = el('div', { class: 'prow' }, el('span', { class: 'plabel' }, 'Root'),
    NAMES.map((n, i) => el('button', { class: 'pbtn' + (st.droneKey === i ? ' on' : ''), onclick: () => setDrone(i, st.droneQ || 'maj7') }, n)));
  box.append(renderProgRow(), row2, row3,
    el('p', { class: 'hint', style: 'margin:0' }, progState()
      ? 'With a progression chosen, Sing live plays it as a looping drone that changes chords at the tempo (no count-in). Chord type and Root buttons still override it until the next chord change.'
      : 'Click a chord type or root while you sing to change the drone. Changes are logged, so each note’s chord tone appears in Review.'));
}
function currentPlan() {
  const ex = exById(st.exId);
  const roots = rootSequence(ex, +st.starts[ex.id], st.dir, st.reps);
  const tempo = Math.max(40, Math.min(240, +$('inTempo').value || ex.tempo));
  return { ex, roots, tempo, tl: buildTimeline(ex, roots, tempo) };
}
function updateModeHint() {
  const ex = exById(st.exId);
  const parts = [];
  if (!micAllowed()) {
    parts.push('This browser isn’t giving the page microphone access, so live singing isn’t available. You can still play exercises, record yourself with another app, and upload the recording here. Live mode needs a browser with microphone support and the page served over HTTPS.');
  } else if (ex.std) parts.push('Wear headphones so the band doesn’t leak into the mic. A one-bar count-in plays first; press Stop any time.');
  else if (ex.free) parts.push('Wear headphones if you use a drone. Press Stop when you’re done.');
  else parts.push('Wear headphones so the piano doesn’t leak into the mic. A one-bar count-in plays first.');
  $('modeHint').textContent = parts.join(' ');
  $('btnLive').disabled = !micAllowed();
  $('btnLive').title = micAllowed() ? '' : 'Microphone access isn’t available in this browser';
}
function rollRange() { return { lo: S.low - 3, hi: topLimit() + 3 }; }
function rollWidth() { return $('liveRoll').parentElement.clientWidth || 800; }
function drawIdleRoll() {
  if (st.running) return;
  const ex = exById(st.exId), { lo, hi } = rollRange();
  if (ex.std) { const { tl, hasMelody } = stdPlan(); drawRoll($('liveRoll'), { width: rollWidth(), height: 300, lo, hi, t0: 0, t1: Math.min(tl.total, 14), chords: tl.chords, targets: tl.notes, free: !hasMelody }); $('readout').innerHTML = ''; renderStdChart(-1); return; }
  if (ex.free) { drawRoll($('liveRoll'), { width: rollWidth(), height: 300, lo, hi, t0: 0, t1: 8, free: true }); $('readout').innerHTML = ''; return; }
  const { tl } = currentPlan();
  const span = Math.min(tl.total, 14);
  drawRoll($('liveRoll'), { width: rollWidth(), height: 300, lo, hi, t0: 0, t1: span, targets: tl.notes, chords: tl.chords });
  $('readout').innerHTML = '';
}

function setRunningUI(on) {
  $('btnStop').hidden = !on;
  $('btnPlay').disabled = on; $('btnLive').disabled = on || !micAllowed(); $('btnUpload').style.pointerEvents = on ? 'none' : '';
  $('btnUpload').style.opacity = on ? 0.45 : 1;
  document.querySelectorAll('.exitem').forEach((b) => (b.disabled = false));
}
async function prepareAudio(tl) {
  const t = setTimeout(() => overlay(true, 'Preparing the accompaniment…'), 120);
  try { return await AE.prepare(tl); } finally { clearTimeout(t); overlay(false); }
}
const melodyOnFor = (p) => (p.std ? !!st.std.melodyOn : true);
async function playExercise() {
  const ctx = await AE.ensure();
  const p = exById(st.exId).std ? stdPlan() : currentPlan();
  const bufs = await prepareAudio(p.tl);
  const T0 = ctx.currentTime + 0.15;
  AE.playPrepared(bufs, T0, melodyOnFor(p));
  st.running = { kind: 'play', T0, plan: p };
  setRunningUI(true); $('status').textContent = 'Playing…';
  animate();
}
async function startLive() {
  const ex = exById(st.exId);
  await AE.ensure();
  let plan = null, bufs = null;
  if (ex.std || !ex.free) {
    plan = ex.std ? stdPlan() : currentPlan();
    try { bufs = await prepareAudio(plan.tl); } catch (e) { toast('Couldn’t prepare the accompaniment: ' + e.message); return; }
  }
  try { await Mic.start(); }
  catch (e) {
    toast('Couldn’t open the microphone: ' + (e.message || e.name)); return;
  }
  const ctx = AE.ctx;
  if (ex.std) {
    const p = plan;
    const T0 = ctx.currentTime + 0.3;
    AE.playPrepared(bufs, T0, melodyOnFor(p));
    st.running = { kind: 'live', free: !p.hasMelody, T0, plan: p, trace: [] };
  } else if (ex.free) {
    const ps = progState();
    if (ps) { const c = progChordAt(ps, 0); st.droneKey = c.pc; st.droneQ = c.q; }
    if (st.droneQ) AE.startDrone(st.droneKey + 48, st.droneQ);
    st.running = { kind: 'live', free: true, T0: ctx.currentTime, trace: [], chordLog: [{ t: 0, root: st.droneKey + 48, q: st.droneQ || null }], prog: ps };
    if (ps) st.running.progKey = progChordAt(ps, 0).key;
  } else {
    const p = plan;
    const T0 = ctx.currentTime + 0.3;
    AE.playPrepared(bufs, T0, true);
    st.running = { kind: 'live', free: false, T0, plan: p, trace: [] };
  }
  setRunningUI(true); $('status').textContent = 'Listening…';
  animate();
}
function stopAll(analyze = true) {
  const r = st.running; if (!r) return;
  st.running = null;
  AE.stopBus(); AE.stopDrone();
  setRunningUI(false); $('status').textContent = '';
  if (r.kind === 'live') {
    const raw = Mic.stop();
    if (analyze && raw.length > AE.ctx.sampleRate * 0.5) {
      const offset = (Mic.capStart ?? r.T0) - r.T0; // raw time 0 == timeline time `offset`
      overlay(true, 'Analyzing your take…');
      setTimeout(() => {
        try { analyzeTake({ raw, sr: AE.ctx.sampleRate, mode: 'live', free: r.free, plan: r.plan, offset, chordLog: r.chordLog, lag: r.lag }); }
        catch (e) { console.error(e); toast('Analysis failed: ' + e.message); }
        overlay(false);
      }, 30);
    }
  }
  drawIdleRoll();
}
function animate() {
  const r = st.running; if (!r) return;
  const ctx = AE.ctx, now = ctx.currentTime - r.T0;
  const { lo, hi } = rollRange();
  let reading = null;
  if (r.kind === 'live') {
    const f = DSP.liveFrame(Mic.ring, ctx.sampleRate, S.A4);
    if (f && f.voiced) { r.trace.push({ t: now, m: f.midi }); reading = f; } else r.trace.push(null);
    if (r.trace.length > 6000) r.trace.splice(0, 1000);
  }
  // estimate round-trip lag (output + input latency) so the live trace lines up with the targets
  if (r.plan && r.plan.std) { const bi = r.plan.tl.bars.findIndex((b) => now >= b.t0 && now < b.t1); renderStdChart(bi >= 0 ? r.plan.tl.bars[bi].index : -1); }
  if (r.plan && r.plan.std) scrollLyrics(r.plan, now);
  if (r.kind === 'live' && r.free && r.prog) progTick(r, now);
  if (r.kind === 'live' && r.plan && !r.plan.tl.notes.length && r.lag == null) r.lag = (ctx.outputLatency || 0) + (ctx.baseLatency || 0) + 0.05;
  if (r.kind === 'live' && r.plan && r.plan.tl.notes.length) {
    r.frame = (r.frame || 0) + 1;
    if (r.lag == null) r.lag = (ctx.outputLatency || 0) + (ctx.baseLatency || 0) + 0.05;
    if (r.frame % 30 === 0) {
      const pts = r.trace.filter((p) => p && p.t > now - 6);
      if (pts.length > 40) {
        let best = r.lag, bs = -1;
        for (let sh = 0; sh <= 0.45; sh += 0.02) {
          let sc = 0;
          for (const p of pts) { const n = r.plan.tl.notes.find((n) => p.t - sh >= n.t0 && p.t - sh <= n.t1); if (n && Math.abs(p.m - n.midi) < 0.5) sc++; }
          if (sc > bs) { bs = sc; best = sh; }
        }
        r.lag = best;
      }
    }
  }
  const lag = r.lag || 0;
  const shown = lag ? r.trace.map((p) => (p ? { t: p.t - lag, m: p.m } : null)) : r.trace;
  const span = 8, t0 = Math.max(-1, now - span * 0.35);
  const liveChords = r.plan ? r.plan.tl.chords : logToChords(r.chordLog || [], now + span);
  drawRoll($('liveRoll'), { width: rollWidth(), height: 300, lo, hi, t0, t1: t0 + span, targets: r.plan ? r.plan.tl.notes : [], chords: liveChords, trace: shown, playhead: now, free: !r.plan || (!!r.plan.std && !r.plan.hasMelody) });
  const ro = $('readout');
  if (r.kind === 'live') {
    if (reading) {
      let ref = Math.round(reading.midi);
      if (r.plan) { const tt = now - lag; const n = r.plan.tl.notes.find((n) => tt >= n.t0 && tt <= n.t1); if (n) ref = n.midi; }
      const c = (reading.midi - ref) * 100;
      ro.innerHTML = `<div class="big ${cls(c)}">${noteName(Math.round(reading.midi))}</div><div class="sm">${fmtC(c)} vs ${noteName(ref)}</div>`;
    } else ro.innerHTML = '<div class="sm">—</div>';
  } else ro.innerHTML = '';
  if (r.plan && now > r.plan.tl.total) { stopAll(true); return; }
  requestAnimationFrame(animate);
}

async function handleUpload(file) {
  if (!file) return;
  const ctx = await AE.ensure();
  overlay(true, 'Decoding ' + file.name + '…');
  try {
    const ab = await file.arrayBuffer();
    const buf = await ctx.decodeAudioData(ab);
    let raw = buf.getChannelData(0);
    if (buf.numberOfChannels > 1) {
      const r2 = buf.getChannelData(1); const mix = new Float32Array(raw.length);
      for (let i = 0; i < raw.length; i++) mix[i] = 0.5 * (raw[i] + r2[i]);
      raw = mix;
    }
    if (buf.duration > 600) { toast('That file is over 10 minutes; analyzing the first 10.'); raw = raw.subarray(0, buf.sampleRate * 600); }
    overlay(true, 'Analyzing your take…');
    await new Promise((r) => setTimeout(r, 30));
    const ex = exById(st.exId);
    const plan = ex.std ? stdPlan() : ex.free ? null : currentPlan();
    analyzeTake({ raw, sr: buf.sampleRate, mode: 'upload', free: ex.std ? !plan.hasMelody : !!ex.free, plan, fileName: file.name });
  } catch (e) {
    console.error(e); toast('Couldn’t read that file. Try an .m4a, .mp3 or .wav.');
  } finally { overlay(false); $('fileIn').value = ''; }
}

// ---------- analysis ----------
function analyzeTake({ raw, sr, mode, free, plan, offset = 0, fileName, chordLog, lag = 0 }) {
  const tr = DSP.track(raw, sr, S.A4);
  const notes = [];
  let chords = [];
  if (!free && plan) {
    const targets = plan.tl.notes;
    if (mode === 'live') {
      // timeline time -> raw time = t - offset; then search for the best lag (output+input latency)
      const shiftedT = targets.map((n) => ({ ...n, t0: n.t0 - offset, t1: n.t1 - offset }));
      const sh = DSP.bestShift(tr, shiftedT, -0.05, 0.4);
      shiftedT.forEach((n, i) => {
        const a = DSP.frameAt(tr, n.t0 + sh), b = DSP.frameAt(tr, n.t1 + sh);
        if (n.t0 + sh > tr.t[tr.n - 1]) return; // stopped early
        const r = DSP.analyzeNote(tr, a, b, n.midi, { raw, sr });
        notes.push(noteRecord(i, n, r, n.t0 + sh, n.t1 + sh));
      });
      chords = plan.tl.chords.map((c) => ({ t0: round(c.t0 - offset + sh, 3), t1: round(c.t1 - offset + sh, 3), root: c.root, q: c.q, cue: !!c.cue, sharp: !!c.sharp }));
    } else {
      const segs = DSP.segment(tr);
      const map = DSP.align(segs, targets.map((n) => n.midi));
      let firstHit = map.findIndex((m) => m >= 0), lastHit = map.length - 1;
      while (lastHit >= 0 && map[lastHit] < 0) lastHit--;
      if (firstHit < 0) { firstHit = 0; lastHit = -1; }
      for (let i = firstHit; i <= lastHit; i++) {
        const n = targets[i], s = segs[map[i]];
        const r = s ? DSP.analyzeNote(tr, s.i0, s.i1, n.midi, { raw, sr }) : { missed: true };
        notes.push(noteRecord(i, n, r, null, null));
      }
    }
  } else {
    if (plan && plan.std && mode === 'live') {
      chords = plan.tl.chords.filter((c) => !c.cue).map((c) => ({ t0: round(c.t0 - offset + lag, 3), t1: round(c.t1 - offset + lag, 3), root: c.root, q: c.q, sharp: !!c.sharp }));
    } else if (chordLog && chordLog.some((c) => c.q)) {
      const end = raw.length / sr + offset;
      chords = logToChords(chordLog, end).map((c) => ({ t0: round(c.t0 - offset, 3), t1: round(c.t1 - offset, 3), root: c.root, q: c.q, sharp: false }));
    }
    const segs = DSP.segment(tr);
    segs.forEach((s, i) => {
      const r = DSP.analyzeNote(tr, s.i0, s.i1, null, { raw, sr });
      if (r.missed) return;
      const mid = (r.t0 + r.t1) / 2;
      const ch = chords.find((c) => mid >= c.t0 && mid < c.t1);
      const fn = ch ? fnName(r.target - ch.root, ch.q) : null;
      notes.push(noteRecord(i, { midi: r.target, fn, chord: ch ? chordName(ch.root, ch.q) : null, rep: 0 }, r, null, null));
    });
  }
  const ex = exById(st.exId);
  let trace = DSP.compactTrace(tr, 0.02);
  if (trace.data.length > 15000) trace = DSP.compactTrace(tr, 0.05);
  const take = {
    id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ts: Date.now(), mode, whose: $('selWhose').value, exId: ex.id, exName: ex.name, free: !!free,
    fileName: fileName || null,
    keys: plan && plan.roots ? plan.roots.map((r) => noteName(r, sharpKey(r))) : plan && plan.std ? [plan.keyName] : null, tempo: plan ? plan.tempo : null,
    tune: plan && plan.std ? { id: plan.tune.id, name: plan.tune.name, key: plan.keyName, feel: plan.feel, choruses: plan.choruses } : null,
    drone: free && chords.length && !(plan && plan.std) ? [...new Set(chords.map((c) => chordName(c.root, c.q)))].join(', ') : null,
    duration: round(raw.length / sr, 2),
    notes, chords, trace,
    settings: { low: S.low, top: topLimit(), A4: S.A4 },
    rating: 0, feel: [], comment: '',
  };
  take.summary = summarize(take);
  st.current = { take, raw, sr };
  st.sel = -1;
  if (!notes.filter((n) => !n.missed).length) { toast('I couldn’t find clear sung notes in that take. Try singing a little louder or closer to the mic.', 5000); return; }
  saveTakeSoon(take, 50);
  st.takes = [take, ...st.takes.filter((t) => t.id !== take.id)];
  showTab('review');
}
function noteRecord(i, n, r, tt0, tt1) {
  const base = { i, target: n.midi, name: noteName(n.midi, n.sharp), fn: n.fn || null, chord: n.chord || null, rep: n.rep ?? 0,
    tt0: tt0 != null ? round(tt0, 3) : null, tt1: tt1 != null ? round(tt1, 3) : null, goal: n.goal || null, tag: { v: 0, chips: [] } };
  if (r.missed) return { ...base, missed: true };
  return { ...base, missed: false,
    cents: round(r.cents, 1), settleMs: r.settleMs, onset: r.onset, stability: round(r.stability, 1),
    vib: r.vibrato ? { rate: round(r.vibrato.rate, 2), extent: round(r.vibrato.extent, 0), onset: round(r.vibrato.onset, 2) } : null,
    clarity: round(r.clarity, 3), h1h2: round(r.h1h2, 1), bright: round(r.bright, 0), ring: round(r.ring, 1), level: round(r.level, 1),
    dur: round(r.dur, 3), t0: round(r.t0, 3), t1: round(r.t1, 3) };
}

function summarize(take) {
  const ok = take.notes.filter((n) => !n.missed);
  const abs = ok.map((n) => Math.abs(n.cents));
  const sm = {
    n: ok.length, missed: take.notes.length - ok.length,
    medAbs: round(DSP.median(abs), 1), inTune: ok.length ? round((100 * abs.filter((a) => a <= 20).length) / ok.length, 0) : null,
    signed: round(DSP.mean(ok.map((n) => n.cents)), 1),
    scoopPct: ok.length ? round((100 * ok.filter((n) => n.onset === 'scoop').length) / ok.length, 0) : null,
    settle: round(DSP.median(ok.map((n) => n.settleMs)), 0),
    clarity: round(DSP.mean(ok.map((n) => n.clarity)), 2),
    h1h2: round(DSP.mean(ok.filter((n) => n.h1h2 != null).map((n) => n.h1h2)), 1),
    bright: round(DSP.mean(ok.filter((n) => n.bright != null).map((n) => n.bright)), 0),
  };
  const vib = ok.filter((n) => n.vib);
  const long = ok.filter((n) => n.dur >= 0.9);
  sm.longN = long.length; sm.vibN = vib.length;
  if (vib.length) {
    sm.vibRate = round(DSP.mean(vib.map((n) => n.vib.rate)), 2);
    sm.vibExt = round(DSP.mean(vib.map((n) => n.vib.extent)), 0);
    const on = vib.filter((n) => n.vib.onset != null).map((n) => n.vib.onset);
    sm.vibOnset = on.length ? round(DSP.mean(on), 2) : null;
  }
  const straight = ok.filter((n) => !n.vib && n.dur >= 0.4);
  sm.straightStab = straight.length ? round(DSP.median(straight.map((n) => n.stability)), 1) : null;
  const gl = take.notes.filter((n) => n.goal);
  if (gl.length) {
    const res = gl.map((n) => ({ n, hit: goalHit(n) }));
    sm.goals = { n: res.length, hit: res.filter((r) => r.hit).length };
  }
  sm.byFn = groupStats(ok.filter((n) => n.fn), (n) => n.fn);
  const lowB = take.settings.low + 5, highB = take.settings.top - 3;
  sm.byRegion = groupStats(ok, (n) => (n.target < lowB ? 'low' : n.target >= highB ? 'high' : 'mid'));
  sm.regionBounds = { lowB, highB };
  return sm;
}
function goalHit(n) {
  if (!n.goal || n.missed) return false;
  const g = n.goal;
  if (g.rate) return !!n.vib && Math.abs(n.vib.rate - g.rate) <= 0.75;
  if (g === 'straight') return !n.vib;
  if (g === 'vib') return !!n.vib;
  if (g === 'bloom') return !!n.vib && (n.vib.onset == null || n.vib.onset >= 0.6);
  return false;
}
function goalLabel(g) { return !g ? '' : g.rate ? `${g.rate} Hz pulses` : g === 'straight' ? 'straight' : g === 'vib' ? 'vibrato' : 'late vibrato'; }
function vibratoCoach(take, out) {
  const gl = take.notes.filter((n) => n.goal);
  if (!gl.length) return;
  const s = take.summary;
  out.push({ k: s.goals.hit / s.goals.n >= 0.7 ? 'good' : 'work', t: `Vibrato goals met on ${s.goals.hit} of ${s.goals.n} notes.` });
  const pulses = gl.filter((n) => n.goal.rate);
  if (pulses.length) {
    const parts = pulses.map((n) => `${n.goal.rate} → ${n.missed ? 'missed' : n.vib ? n.vib.rate.toFixed(1) + ' Hz' : 'no steady pulse'}`);
    const rates = pulses.filter((n) => n.vib).map((n) => n.vib.rate - n.goal.rate);
    let tip = 'Rates are close to the targets. Next, try making the pulses smaller and smoother.';
    if (pulses.some((n) => !n.vib)) tip = 'Where no steady pulse showed up, make the pulses a little larger and more even; the detector needs a regular wave of at least ±10¢.';
    else if (rates.length && DSP.mean(rates) > 0.6) tip = 'You tend to run faster than the target. Slow pulses need more patience than effort, so relax the throat and let each pulse take its full time.';
    else if (rates.length && DSP.mean(rates) < -0.6) tip = 'You tend to lag behind the target. Keep the pulse light and let the breath drive it.';
    out.push({ k: 'info', t: `Pulse targets (Hz) → what you produced: ${parts.join(', ')}. ${tip}` });
  }
  const st_ = gl.filter((n) => n.goal === 'straight'), vb = gl.filter((n) => n.goal === 'vib' && !n.goal.rate);
  if (st_.length && vb.length && take.exId === 'switch') {
    const sOk = st_.filter(goalHit).length, vOk = vb.filter(goalHit).length;
    let tip = '';
    if (sOk < st_.length && vOk === vb.length) tip = ' The vibrato is carrying into the straight sections. Think of “straight” as speech-like and slightly lighter.';
    else if (vOk < vb.length && sOk === st_.length) tip = ' Straight is easy for you; the vibrato needs to come in faster. Pulse the first one or two cycles on purpose to get it started.';
    out.push({ k: 'info', t: `Straight sections stayed straight ${sOk} of ${st_.length}; vibrato sections had vibrato ${vOk} of ${vb.length}.${tip}` });
  }
  const bl = gl.filter((n) => n.goal === 'bloom');
  if (bl.length) {
    const v = bl.filter((n) => n.vib);
    if (!v.length) out.push({ k: 'work', t: 'No vibrato appeared on the low notes. Lighten the weight (more speech, less “chest”), keep the air moving after the hum opens to “oh,” and try one round of “Vibrato pulses” first to get the motion going.' });
    else {
      const on = v.filter((n) => n.vib.onset != null).map((n) => n.vib.onset);
      out.push({ k: v.length === bl.length ? 'good' : 'info', t: `Vibrato bloomed on ${v.length} of ${bl.length} low notes: ${DSP.mean(v.map((n) => n.vib.rate)).toFixed(1)} Hz, ±${Math.round(DSP.mean(v.map((n) => n.vib.extent)))}¢${on.length ? `, starting about ${DSP.mean(on).toFixed(1)}s in` : ''}.${v.length < bl.length ? ' The lowest notes are usually the last to free up, so go lighter there.' : ''}` });
    }
  }
}
function groupStats(notes, keyFn) {
  const g = {};
  for (const n of notes) { const k = keyFn(n); (g[k] = g[k] || []).push(n.cents); }
  const out = {};
  for (const [k, a] of Object.entries(g)) out[k] = { n: a.length, signed: round(DSP.mean(a), 1), abs: round(DSP.mean(a.map(Math.abs)), 1) };
  return out;
}

const FN_TIPS = {
  '7': { flat: 'Your major 7ths sit {c} flat. In jazz the maj7 is a bright, almost-leading tone: hear it a half step under the root, not a step above the 6th.', sharp: 'Your major 7ths run {c} sharp; you may be pulling up toward the root. Let it sit a clean half step below.' },
  '♭7': { flat: 'Your ♭7s are {c} flat. Dominant 7ths tend to get dragged down; tune it as a whole step below the root.', sharp: 'Your ♭7s are {c} sharp, drifting toward the major 7th. Hear the whole step down from the root.' },
  '3': { flat: 'Major 3rds sit {c} flat. Against a major chord that sounds bluesy or sad: great when you mean it, but not as a default.', sharp: 'Major 3rds are {c} sharp. Piano 3rds are already wide, so match the piano rather than brightening further.' },
  '♭3': { flat: 'Minor 3rds are {c} flat. Keep them anchored; a sagging ♭3 makes the whole chord sound droopy.', sharp: 'Minor 3rds drift {c} sharp, toward the major 3rd. That “in-between” blue 3rd is a great effect, but use it on purpose.' },
  'R': { flat: 'Roots are {c} flat. The root is your home base, so check it against the bass note.', sharp: 'Roots are {c} sharp. Check them against the bass note.' },
  '5': { flat: 'Fifths sit {c} flat. Perfect 5ths are the easiest interval to lock in; listen for the beating to disappear.', sharp: 'Fifths sit {c} sharp. Listen for the beating to disappear.' },
};
function coachNotes(take) {
  const s = take.summary, out = [];
  if (!s.n) return [{ k: 'work', t: 'No clear notes were detected. Sing a little louder or closer to the mic, and check that the right input is selected.' }];
  const ex = !take.free;
  if (s.medAbs <= 10) out.push({ k: 'good', t: `Very precise center: median error ${s.medAbs}¢, ${s.inTune}% of notes within ±20¢.` });
  else if (s.medAbs <= 18) out.push({ k: 'good', t: `Solid intonation: median error ${s.medAbs}¢, ${s.inTune}% within ±20¢.` });
  else if (s.medAbs <= 30) out.push({ k: 'work', t: `Intonation is close but not locked (median ${s.medAbs}¢, ${s.inTune}% within ±20¢). Drop the tempo by 10–15 bpm and hold each note until it “clicks” against the chord.` });
  else out.push({ k: 'work', t: `Pitch is wandering (median ${s.medAbs}¢${ex ? '' : ' from the nearest note'}). ${ex ? 'Set Melody guide to “Every repetition” for now, and start from the bottom of the exercise range.' : 'If that was deliberate bending, ignore this. Otherwise try the same phrase over a drone.'}` });
  if (s.signed <= -12) out.push({ k: 'work', t: `You lean flat overall (average ${fmtC(s.signed)}). Common causes are letting breath energy drop at the ends of notes or a dark, “swallowed” vowel. Keep the air moving through the release and think the vowel a shade brighter.` });
  else if (s.signed >= 12) out.push({ k: 'work', t: `You lean sharp overall (average ${fmtC(s.signed)}). That often comes from pushing volume or reaching up for notes. Sing a little softer and think of arriving at each pitch from above.` });
  vibratoCoach(take, out);
  // chord tones
  const fns = Object.entries(s.byFn || {}).filter(([, v]) => v.n >= 3 && Math.abs(v.signed) >= 15).sort((a, b) => Math.abs(b[1].signed) - Math.abs(a[1].signed)).slice(0, 2);
  for (const [fn, v] of fns) {
    const dir = v.signed < 0 ? 'flat' : 'sharp';
    const tpl = FN_TIPS[fn]?.[dir] || (['9', '11', '13', '♯11', '♭9', '♭13'].includes(fn)
      ? `Your ${fn}s run {c} ${dir}. Extensions are hard to hear because they’re outside the triad; “Sing the extensions” with a sustained chord is the drill for this.`
      : `Your ${fn}s run {c} ${dir}.`);
    out.push({ k: 'work', t: tpl.replace('{c}', Math.abs(Math.round(v.signed)) + '¢') });
  }
  const hi = s.byRegion?.high, lo = s.byRegion?.low;
  if (hi && hi.n >= 3 && hi.signed <= -15) out.push({ k: 'work', t: `Your upper notes (${noteName(s.regionBounds.highB)} and up) run ${Math.abs(Math.round(hi.signed))}¢ flat. Approaching your top, open the vowel slightly (toward “uh” or “aw”) and keep the breath flowing rather than pushing louder.` });
  if (lo && lo.n >= 3 && (lo.abs >= 25 || Math.abs(lo.signed) >= 15)) out.push({ k: 'work', t: `Your low notes (below ${noteName(s.regionBounds.lowB)}) are less centered (avg ${fmtC(lo.signed)}). Down there, voices often lose definition when they add weight. Lighten up and let the low notes speak more like talking.` });
  if (s.scoopPct >= 30) out.push(ex
    ? { k: 'work', t: `${s.scoopPct}% of notes started with a scoop from below. Scoops are real jazz vocabulary, but in exercises aim to land in the center so the scoop becomes a choice, not a habit. Hear the pitch in your head before you breathe.` }
    : { k: 'info', t: `${s.scoopPct}% of notes started with a scoop. If they were stylistic, great; tag the ones you liked so Woodshed learns your taste.` });
  else if (s.settle >= 140) out.push({ k: 'work', t: `Notes take about ${s.settle} ms to settle on pitch. Pre-hear each note and start the sound right on it.` });
  if (s.goals) { /* vibrato covered by goal feedback */ }
  else if (s.vibN) {
    if (s.vibRate > 7.2) out.push({ k: 'work', t: `Vibrato is fast (${s.vibRate} Hz, ±${s.vibExt}¢), which often signals throat tension. Work on “Straight tone → late vibrato” and let it come slower and looser.` });
    else if (s.vibRate < 4.6 || s.vibExt > 95) out.push({ k: 'work', t: `Vibrato is slow or wide (${s.vibRate} Hz, ±${s.vibExt}¢), which can read as a wobble. It usually comes from too much weight or pressure; sing lighter.` });
    else out.push({ k: 'good', t: `Healthy vibrato: ${s.vibRate} Hz, ±${s.vibExt}¢${s.vibOnset != null ? `, starting about ${s.vibOnset}s into the note` : ''}. Jazz singers often keep it narrower and later than classical singers.` });
  } else if (s.longN >= 2) out.push({ k: 'info', t: 'Your long notes stayed straight, which is a valid jazz color. When you want warmth at the end of a phrase, let vibrato bloom late.' });
  if (s.straightStab != null && s.straightStab > 12) out.push({ k: 'work', t: `Straight tones waver by about ±${s.straightStab}¢. Steady breath pressure is the fix: lip trills, then the same notes on a vowel.` });
  if (s.clarity != null && (s.clarity < 0.78 || (s.h1h2 != null && s.h1h2 > 12))) out.push({ k: 'info', t: `Your tone reads breathy (clarity ${s.clarity}${s.h1h2 != null ? `, H1–H2 ${s.h1h2} dB` : ''}). Breathy is a lovely soft-jazz color, but if it’s your only color, try straw phonation and clean onsets on the five-tone scale. (These are rough measures; mic and vowel affect them.)` });
  else if (s.h1h2 != null && s.h1h2 < -3 && s.clarity > 0.92) out.push({ k: 'info', t: `Your tone may be on the pressed side (H1–H2 ${s.h1h2} dB). If the throat feels tight, add a touch more air. (This is a rough measure; mic and vowel affect it.)` });
  if (s.missed && s.missed / (s.n + s.missed) > 0.15) out.push({ k: 'info', t: `${s.missed} notes weren’t detected. They were too quiet, too far off, or skipped.` });
  return out;
}

// ---------- review tab ----------
function renderReview() {
  const cur = st.current;
  $('reviewEmpty').hidden = !!cur; $('reviewBody').hidden = !cur;
  if (!cur) return;
  const tk = cur.take, s = tk.summary;
  $('revTitle').textContent = takeTitle(tk) + (tk.whose === 'ref' ? ' · reference' : '');
  const d = new Date(tk.ts);
  $('revMeta').textContent = [d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    tk.mode === 'live' ? 'live' : 'uploaded' + (tk.fileName ? ` (${tk.fileName})` : ''), tk.keys ? `keys ${tk.keys[0]}→${tk.keys[tk.keys.length - 1]}` : null,
    tk.tempo ? tk.tempo + ' bpm' : null, tk.drone ? 'drone ' + tk.drone : null].filter(Boolean).join(' · ');
  $('btnPlayTake').disabled = !cur.raw;
  $('btnAgain').hidden = tk.free;
  // stats
  const box = $('revStats'); box.innerHTML = '';
  const stat = (k, v, sub, c) => box.append(el('div', { class: 'stat' }, el('div', { class: 'k' }, k), el('div', { class: 'v ' + (c || '') }, v ?? '—'), sub ? el('div', { class: 's' }, sub) : null));
  stat('Median pitch error', s.medAbs != null ? s.medAbs + '¢' : '—', tk.free ? 'vs nearest note' : 'vs target', s.medAbs != null ? cls(s.medAbs) : '');
  stat('In tune (±20¢)', s.inTune != null ? s.inTune + '%' : '—', `${s.n} notes${s.missed ? `, ${s.missed} missed` : ''}`);
  stat('Overall lean', fmtC(s.signed), s.signed < -5 ? 'flat' : s.signed > 5 ? 'sharp' : 'centered');
  stat('Settle time', s.settle != null ? s.settle + ' ms' : '—', `${s.scoopPct ?? 0}% scooped`);
  stat('Vibrato', s.vibN ? `${s.vibRate} Hz` : 'none', s.vibN ? `±${s.vibExt}¢ on ${s.vibN} notes` : s.longN ? 'long notes were straight' : 'no long notes');
  if (s.goals) stat('Vibrato goals', `${s.goals.hit}/${s.goals.n}`, 'notes on target', s.goals.hit / s.goals.n >= 0.7 ? 'c-good' : 'c-near');
  stat('Clarity', s.clarity ?? '—', s.h1h2 != null ? `H1–H2 ${s.h1h2} dB · ${s.bright} Hz bright` : '');
  // coach
  const ul = $('revCoach'); ul.innerHTML = '';
  const icon = { good: '✓', work: '→', info: '•' };
  for (const c of coachNotes(tk)) ul.append(el('li', { class: c.k }, el('span', { class: 'ic' }, icon[c.k]), el('span', {}, c.t)));
  renderRevRoll(); renderNoteTable(); renderNoteDetail(); renderFeel();
}
function traceDecode(tr) {
  return tr.data.map((v, i) => (v ? { t: tr.t0 + i * tr.step, m: v / 10 } : null));
}
function renderRevRoll() {
  const tk = st.current.take;
  const pts = traceDecode(tk.trace);
  const dur = Math.max(2, tk.duration || (pts.length * tk.trace.step));
  const box = $('revScroll');
  const W = Math.max(box.clientWidth || 900, Math.min(20000, dur * 90));
  const ok = tk.notes.filter((n) => !n.missed);
  const mids = ok.map((n) => n.target);
  const lo = Math.min(S.low - 3, ...mids.map((m) => m - 2)), hi = Math.max(topLimit() + 3, ...mids.map((m) => m + 2));
  const targets = tk.notes.filter((n) => (n.tt0 != null) || !n.missed).map((n) => ({ midi: n.target, t0: n.tt0 ?? n.t0, t1: n.tt1 ?? n.t1, missed: n.missed, sel: n.i === st.sel }));
  st.revMap = drawRoll($('revRoll'), { width: W, height: 280, lo, hi, t0: 0, t1: dur, targets, chords: tk.chords || [], trace: pts, free: tk.free, playhead: st.playhead ?? null });
}
function renderNoteTable() {
  const tk = st.current.take, t = $('noteTable'); t.innerHTML = '';
  const head = el('tr', {}, ['#', tk.free ? 'Nearest' : 'Target', tk.notes.some((n) => n.fn) ? 'Tone' : '', 'Pitch', 'Settle', 'Onset', 'Vibrato', 'Clarity', 'Like?'].map((h) => el('th', {}, h)));
  t.append(el('thead', {}, head));
  const tb = el('tbody');
  tk.notes.forEach((n, k) => {
    const thumbs = el('td', { onclick: (e) => e.stopPropagation() },
      el('button', { class: 'thumb' + (n.tag.v === 1 ? ' on' : ''), title: 'I like this', onclick: () => setTag(n, n.tag.v === 1 ? 0 : 1) }, '👍'),
      el('button', { class: 'thumb' + (n.tag.v === -1 ? ' on' : ''), title: 'I don’t like this', onclick: () => setTag(n, n.tag.v === -1 ? 0 : -1) }, '👎'));
    const row = n.missed
      ? el('tr', { class: n.i === st.sel ? 'sel' : '' }, el('td', { class: 'num dim' }, k + 1), el('td', {}, n.name), el('td', { class: 'dim' }, n.fn ? `${n.fn} of ${n.chord}` : ''), el('td', { class: 'dim', colspan: 6 }, 'not detected'))
      : el('tr', { class: n.i === st.sel ? 'sel' : '', onclick: () => selectNote(n) },
        el('td', { class: 'num dim' }, k + 1), el('td', {}, n.name), el('td', { class: 'muted' }, n.fn ? `${n.fn} of ${n.chord}` : ''),
        el('td', { class: 'num ' + cls(n.cents) }, fmtC(n.cents)), el('td', { class: 'num' }, n.settleMs + ' ms'),
        el('td', { class: n.onset === 'clean' ? 'muted' : 'c-near' }, n.onset),
        el('td', { class: 'num' }, n.vib ? `${n.vib.rate}Hz ±${n.vib.extent}¢` : n.dur >= 0.4 ? `straight ±${Math.round(n.stability)}¢` : '—',
          n.goal ? el('span', { class: 'pill', style: `border-color:var(${goalHit(n) ? '--good' : '--near'})` }, (goalHit(n) ? '✓ ' : '✗ ') + goalLabel(n.goal)) : null),
        el('td', { class: 'num' }, n.clarity != null ? n.clarity.toFixed(2) : '—'), thumbs);
    tb.append(row);
  });
  t.append(tb);
}
const NOTE_CHIPS = [['warm', 1], ['bright', 1], ['clear', 1], ['nice vibrato', 1], ['good bend', 1], ['breathy', -1], ['pressed', -1], ['wobbly', -1], ['thin', -1], ['strained', -1]];
function renderNoteDetail() {
  const box = $('noteDetail'); box.innerHTML = '';
  const tk = st.current.take, n = tk.notes.find((x) => x.i === st.sel);
  if (!n || n.missed) return;
  const row = el('div', { class: 'row' },
    el('span', {}, 'Sung ', el('b', {}, noteName(Math.round(n.target + n.cents / 100)) + ' ' + fmtC(n.cents))),
    el('span', {}, 'Length ', el('b', {}, n.dur.toFixed(2) + 's')),
    el('span', {}, 'Stability ', el('b', {}, '±' + Math.round(n.stability) + '¢')),
    n.vib ? el('span', {}, 'Vibrato onset ', el('b', {}, n.vib.onset != null ? n.vib.onset + 's' : '—')) : null,
    el('span', {}, 'H1–H2 ', el('b', {}, n.h1h2 != null ? n.h1h2 + ' dB' : '—')),
    el('span', {}, 'Brightness ', el('b', {}, n.bright != null ? n.bright + ' Hz' : '—')),
    el('span', {}, '2–4 kHz ring ', el('b', {}, n.ring != null ? n.ring + ' dB' : '—')));
  const chips = el('div', { class: 'chips' }, NOTE_CHIPS.map(([c, sgn]) => el('button', { class: 'chipbtn' + (sgn < 0 ? ' neg' : '') + (n.tag.chips.includes(c) ? ' on' : ''),
    onclick: () => { const i = n.tag.chips.indexOf(c); if (i >= 0) n.tag.chips.splice(i, 1); else n.tag.chips.push(c); saveTakeSoon(tk); renderNoteDetail(); } }, c)));
  box.append(el('div', { class: 'notedetail' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px' },
      el('b', {}, `Note ${tk.notes.indexOf(n) + 1}: ${n.name}${n.fn ? ` (${n.fn} of ${n.chord})` : ''}`),
      el('button', { class: 'btn small', onclick: () => playNote(n) }, '▶ Replay')), row, chips));
}
function setTag(n, v) { n.tag.v = v; saveTakeSoon(st.current.take); renderNoteTable(); }
function selectNote(n) { st.sel = n.i; renderNoteTable(); renderNoteDetail(); renderRevRoll(); playNote(n);
  const x = st.revMap?.x(n.t0) ?? 0, box = $('revScroll'); if (x < box.scrollLeft || x > box.scrollLeft + box.clientWidth - 60) box.scrollLeft = x - 120; }
async function playNote(n) {
  const cur = st.current; if (!cur.raw) { toast('Audio isn’t kept for past takes, only the analysis.'); return; }
  await AE.ensure(); AE.playBuffer(cur.raw, cur.sr, Math.max(0, n.t0 - 0.08), n.t1 + 0.08);
}
async function playTake() {
  const cur = st.current; if (!cur || !cur.raw) return;
  await AE.ensure();
  if (AE.player) { AE.stopPlayback(); $('btnPlayTake').textContent = '▶ Play take'; st.playhead = null; renderRevRoll(); return; }
  const src = AE.playBuffer(cur.raw, cur.sr, 0, cur.raw.length / cur.sr);
  const t0 = AE.ctx.currentTime; $('btnPlayTake').textContent = '■ Stop';
  const tick = () => {
    if (AE.player !== src) return;
    st.playhead = AE.ctx.currentTime - t0; renderRevRoll();
    const box = $('revScroll'), x = st.revMap.x(st.playhead);
    if (x > box.scrollLeft + box.clientWidth - 80) box.scrollLeft = x - 100;
    requestAnimationFrame(tick);
  };
  src.onended = () => { if (AE.player === src) AE.player = null; st.playhead = null; $('btnPlayTake').textContent = '▶ Play take'; renderRevRoll(); };
  tick();
}
const FEEL = ['easy', 'effortful', 'strained', 'tired', 'sounded like me', 'loved the tone'];
function renderFeel() {
  const tk = st.current.take;
  const s = $('stars'); s.innerHTML = '';
  for (let i = 1; i <= 5; i++) s.append(el('button', { class: i <= tk.rating ? 'on' : '', title: i + ' / 5', onclick: () => { tk.rating = tk.rating === i ? 0 : i; saveTakeSoon(tk); renderFeel(); } }, '★'));
  const c = $('feelChips'); c.innerHTML = '';
  for (const f of FEEL) c.append(el('button', { class: 'chipbtn' + (tk.feel.includes(f) ? ' on' : ''), onclick: () => { const i = tk.feel.indexOf(f); if (i >= 0) tk.feel.splice(i, 1); else tk.feel.push(f); saveTakeSoon(tk); renderFeel(); } }, f));
  const ta = $('takeComment'); if (document.activeElement !== ta) ta.value = tk.comment || '';
}

// ---------- history / progress ----------
function takeTitle(t) { return t.tune ? t.tune.name + ' · ' + t.tune.key : t.exName; }
function ownTakes() { return st.takes.filter((t) => t.whose !== 'ref'); }
function renderHistory() {
  const own = ownTakes().slice(0, 20);
  const notes = own.flatMap((t) => t.notes.filter((n) => !n.missed && !t.free));
  $('tendSub').textContent = own.length ? `From your last ${own.length} take${own.length > 1 ? 's' : ''} (exercises only). Bars show average lean: left is flat, right is sharp.` : '';
  const fnBox = $('tendFn'); fnBox.innerHTML = '';
  const byFn = groupStats(notes.filter((n) => n.fn), (n) => n.fn);
  const fnRows = FN_ORDER.filter((f) => byFn[f]).map((f) => [f, byFn[f]]);
  fnBox.append(fnRows.length ? leanTable(fnRows, 'Tone') : el('p', { class: 'muted' }, 'Sing a few exercises to see which chord tones you tend to tune high or low.'));
  const rg = $('tendRegion'); rg.innerHTML = '';
  const allOk = own.flatMap((t) => t.notes.filter((n) => !n.missed));
  const lowB = S.low + 5, highB = topLimit() - 3;
  const byR = groupStats(allOk, (n) => (n.target < lowB ? 'low' : n.target >= highB ? 'high' : 'mid'));
  const rRows = [['low', `Low (below ${noteName(lowB)})`], ['mid', 'Middle'], ['high', `High (${noteName(highB)}+)`]].filter(([k]) => byR[k]).map(([k, lbl]) => [lbl, byR[k]]);
  rg.append(rRows.length ? leanTable(rRows, 'Region') : el('p', { class: 'muted' }, 'No data yet.'));
  const other = $('tendOther'); other.innerHTML = '';
  if (own.length >= 2) {
    const meds = own.filter((t) => t.summary?.medAbs != null && !t.free).map((t) => t.summary.medAbs);
    const recent = meds.slice(0, 5), prev = meds.slice(5, 10);
    const vib = allOk.filter((n) => n.vib);
    const lines = [];
    if (recent.length && prev.length) lines.push(`Median pitch error, last ${recent.length} takes vs the ${prev.length} before: ${round(DSP.median(recent), 1)}¢ vs ${round(DSP.median(prev), 1)}¢.`);
    lines.push(`Scoops: ${round((100 * allOk.filter((n) => n.onset === 'scoop').length) / Math.max(1, allOk.length), 0)}% of notes.`);
    if (vib.length) lines.push(`Vibrato: ${round(DSP.mean(vib.map((n) => n.vib.rate)), 2)} Hz, ±${round(DSP.mean(vib.map((n) => n.vib.extent)), 0)}¢ on average.`);
    other.append(el('ul', { class: 'pref' }, lines.map((l) => el('li', {}, l))));
  }
  renderTaste();
  renderTakeTable();
  renderTempoCard();
  decorateProgress();
  renderStorageInfo();
}
function leanTable(rows, label) {
  const t = el('table', {}, el('thead', {}, el('tr', {}, el('th', {}, label), el('th', {}, 'Notes'), el('th', {}, 'Avg lean'), el('th', {}, ''), el('th', {}, 'Avg |error|'))));
  const tb = el('tbody');
  for (const [k, v] of rows) {
    const w = Math.min(50, Math.abs(v.signed) * 1.25);
    const bar = el('div', { class: 'bar' }, el('span', { class: 'mid' }), el('i', { style: `left:${v.signed < 0 ? 50 - w : 50}%;width:${w}%;background:${Math.abs(v.signed) <= 8 ? 'var(--good)' : Math.abs(v.signed) <= 18 ? 'var(--near)' : 'var(--off)'}` }));
    tb.append(el('tr', { style: 'cursor:default' }, el('td', {}, k), el('td', { class: 'num dim' }, v.n), el('td', { class: 'num' }, fmtC(v.signed)), el('td', {}, bar), el('td', { class: 'num' }, v.abs + '¢')));
  }
  t.append(tb); return t;
}
const FEATS = [
  ['pitch error', (n) => Math.abs(n.cents), '¢', 'more centered', 'less centered', 0],
  ['settle time', (n) => n.settleMs, ' ms', 'quicker to settle', 'slower to settle', 0],
  ['clarity', (n) => n.clarity, '', 'clearer (less breathy)', 'breathier', 2],
  ['H1–H2', (n) => n.h1h2, ' dB', 'more breathy/airy (higher H1–H2)', 'firmer closure (lower H1–H2)', 1],
  ['brightness', (n) => n.bright, ' Hz', 'brighter', 'darker', 0],
  ['vibrato width', (n) => (n.vib ? n.vib.extent : n.dur >= 0.6 ? 0 : null), '¢', 'wider vibrato', 'narrower or no vibrato', 0],
  ['vibrato rate', (n) => (n.vib ? n.vib.rate : null), ' Hz', 'faster vibrato', 'slower vibrato', 2],
  ['scoop', (n) => (n.onset === 'scoop' ? 1 : 0), '', 'scooped more often', 'scooped less often', 2],
];
function compareSets(A, B) {
  const res = [];
  for (const [name, f, unit, more, less, dp] of FEATS) {
    const a = A.map(f).filter((v) => v != null && !isNaN(v)), b = B.map(f).filter((v) => v != null && !isNaN(v));
    if (a.length < 3 || b.length < 3) continue;
    const ma = DSP.mean(a), mb = DSP.mean(b);
    const sd = Math.sqrt((DSP.std(a) ** 2 + DSP.std(b) ** 2) / 2) || 1e-9;
    const d = (ma - mb) / sd;
    if (Math.abs(d) >= 0.5) res.push({ name, d, ma, mb, unit, dp, word: d > 0 ? more : less });
  }
  return res.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));
}
function renderTaste() {
  const box = $('taste'); box.innerHTML = '';
  const all = st.takes;
  const tagged = (whoseRef, v) => all.filter((t) => (t.whose === 'ref') === whoseRef).flatMap((t) => t.notes.filter((n) => !n.missed && n.tag?.v === v));
  const liked = [...tagged(false, 1), ...tagged(true, 1)], disliked = [...tagged(false, -1), ...tagged(true, -1)];
  const refLiked = [...tagged(true, 1), ...all.filter((t) => t.whose === 'ref' && t.rating >= 4).flatMap((t) => t.notes.filter((n) => !n.missed && n.tag?.v !== -1))];
  const mine = ownTakes().flatMap((t) => t.notes.filter((n) => !n.missed));
  box.append(el('p', { class: 'muted', style: 'font-size:13px' }, `${liked.length} liked and ${disliked.length} disliked notes tagged so far${refLiked.length ? `, plus ${refLiked.length} notes from reference singers you liked` : ''}.`));
  const cmp = compareSets(liked, disliked);
  if (liked.length >= 3 && disliked.length >= 3) {
    box.append(el('h3', { style: 'font-size:15px;margin-top:10px' }, 'Notes you like, compared with notes you don’t'));
    box.append(cmp.length ? el('ul', { class: 'pref' }, cmp.slice(0, 5).map((c) => el('li', {}, `Liked notes are ${c.word}: `, el('span', { class: 'mono' }, `${c.ma.toFixed(c.dp)}${c.unit} vs ${c.mb.toFixed(c.dp)}${c.unit}`), el('span', { class: 'pill' }, `effect ${Math.abs(c.d).toFixed(1)}`))))
      : el('p', { class: 'muted' }, 'No clear pattern yet; your likes and dislikes measure about the same. Keep tagging.'));
  } else box.append(el('p', {}, 'Tag at least 3 notes you like and 3 you don’t (👍/👎 in Review) to see what separates them.'));
  if (refLiked.length >= 3 && mine.length >= 3) {
    const r = compareSets(refLiked, mine);
    box.append(el('h3', { style: 'font-size:15px;margin-top:14px' }, 'Reference singers you like, compared with you'));
    box.append(r.length ? el('ul', { class: 'pref' }, r.slice(0, 5).map((c) => el('li', {}, `They’re ${c.word}: `, el('span', { class: 'mono' }, `${c.ma.toFixed(c.dp)}${c.unit} vs your ${c.mb.toFixed(c.dp)}${c.unit}`), el('span', { class: 'pill ref' }, 'reference'))))
      : el('p', { class: 'muted' }, 'On these measures you’re already close to the references you like.'));
  } else box.append(el('p', { class: 'muted', style: 'font-size:13px' }, 'To compare yourself with singers you admire: in Practice, choose “Free sing,” set Voice to “A reference singer,” upload a short a cappella or voice-forward clip, then rate it and tag the notes you love.'));
}
function renderTakeTable() {
  const t = $('takeTable'); t.innerHTML = '';
  if (!st.takes.length) { t.append(el('tbody', {}, el('tr', {}, el('td', { class: 'muted' }, 'No takes yet.')))); return; }
  t.append(el('thead', {}, el('tr', {}, ['When', 'Exercise', 'Tempo', 'How', 'Notes', 'Median error', 'In tune', 'Rating', ''].map((h) => el('th', {}, h)))));
  const tb = el('tbody');
  for (const tk of st.takes) {
    const d = new Date(tk.ts), s = tk.summary || {};
    const del = el('button', { class: 'btn small danger', onclick: (e) => {
      e.stopPropagation();
      if (del.dataset.arm) { Store.deleteTake(tk.id).catch(() => toast('Couldn’t delete')); st.takes = st.takes.filter((x) => x.id !== tk.id); if (st.current?.take.id === tk.id) st.current = null; renderHistory(); renderPlan(); }
      else { del.dataset.arm = 1; del.textContent = 'Confirm'; setTimeout(() => { if (del.isConnected) { delete del.dataset.arm; del.textContent = 'Delete'; } }, 3000); }
    } }, 'Delete');
    tb.append(el('tr', { onclick: () => { st.current = { take: tk, raw: null, sr: null }; st.sel = -1; showTab('review'); } },
      el('td', { class: 'num' }, d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })),
      el('td', {}, takeTitle(tk), tk.whose === 'ref' ? el('span', { class: 'pill ref' }, 'reference') : null),
      el('td', { class: 'num' }, tk.tempo ? tk.tempo + ' bpm' : '—'),
      el('td', { class: 'muted' }, tk.mode), el('td', { class: 'num' }, s.n ?? '—'),
      el('td', { class: 'num ' + (s.medAbs != null ? cls(s.medAbs) : '') }, s.medAbs != null ? s.medAbs + '¢' : '—'),
      el('td', { class: 'num' }, s.inTune != null ? s.inTune + '%' : '—'), el('td', {}, tk.rating ? '★'.repeat(tk.rating) : ''), el('td', {}, del)));
  }
  t.append(tb);
}

// ---------- suggested session ----------
function renderPlan() {
  const own = ownTakes().filter((t) => !t.free).slice(0, 10);
  const notes = own.flatMap((t) => t.notes.filter((n) => !n.missed));
  const plan = ['glide']; const why = [];
  const add = (id, reason) => { if (!plan.includes(id) && plan.length < 4) { plan.push(id); if (reason) why.push(reason); } };
  if (notes.length >= 12) {
    const byFn = groupStats(notes.filter((n) => n.fn), (n) => n.fn);
    const worst = Object.entries(byFn).filter(([, v]) => v.n >= 5 && Math.abs(v.signed) >= 12).sort((a, b) => Math.abs(b[1].signed) - Math.abs(a[1].signed))[0];
    if (worst) {
      const ext = ['9', '11', '13', '♯11', '♭9', '♭13'].includes(worst[0]);
      add(ext ? 'ext' : 'guide', `your ${worst[0]}s run ${fmtC(worst[1].signed)}`);
    }
    const scoop = notes.filter((n) => n.onset === 'scoop').length / notes.length;
    if (scoop >= 0.25) add('five', `${Math.round(scoop * 100)}% of exercise notes start with a scoop`);
    const vib = notes.filter((n) => n.vib);
    const vr = vib.length ? DSP.mean(vib.map((n) => n.vib.rate)) : null;
    if (vr && (vr > 7.2 || vr < 4.6)) add('messa', `vibrato averages ${vr.toFixed(1)} Hz`);
    const longN = notes.filter((n) => n.dur >= 1.2 && !n.goal);
    if (longN.length >= 4 && longN.filter((n) => n.vib).length / longN.length < 0.3) add('lowbloom', 'your long notes rarely show vibrato');
    const pul = notes.filter((n) => n.goal && n.goal.rate);
    if (pul.length >= 3 && pul.filter(goalHit).length / pul.length < 0.5) add('pulse', 'vibrato pulse targets were mostly missed');
    const hi = notes.filter((n) => n.target >= topLimit() - 3);
    if (hi.length >= 4 && DSP.mean(hi.map((n) => n.cents)) <= -15) add('maj7arp', 'your top notes run flat');
    const doneRecently = new Set(own.slice(0, 4).map((t) => t.exId));
    for (const id of ['guide', 'maj7arp', 'ext', 'enclose', 'blues', 'messa', 'm7arp', 'five']) if (!doneRecently.has(id)) add(id);
  } else { add('five'); add('maj7arp'); add('guide'); }
  plan.push('free');
  const ol = $('planList'); ol.innerHTML = '';
  plan.forEach((id, i) => { const ex = exById(id); ol.append(el('li', {}, el('button', { onclick: () => selectExercise(id) }, el('span', { class: 'n' }, i + 1), ex.name, el('small', {}, ex.short)))); });
  $('planWhy').textContent = why.length ? 'Chosen because ' + why.join('; ') + '.' : notes.length < 12 ? 'A starter plan. It adapts as you log takes.' : 'Rotating through exercises you haven’t done recently.';
}

// ---------- settings tab ----------
function renderSettings() {
  const opt = (sel, lo, hi, v) => { sel.innerHTML = ''; for (let m = lo; m <= hi; m++) sel.append(el('option', { value: m }, noteName(m))); sel.value = v; };
  $('setLabel').value = S.label;
  opt($('setLow'), 36, 72, S.low); opt($('setTop'), 52, 86, S.top); opt($('setStretch'), 52, 88, S.stretch);
  const ps = $('setPreset'); if (ps && !ps.options.length) { ps.append(el('option', { value: '' }, 'Choose a preset…')); VOICE_PRESETS.forEach((p) => ps.append(el('option', { value: p.id }, `${p.label} (${noteName(p.low)}–${noteName(p.top)})`))); }
  $('setUseStretch').value = String(+S.useStretch); $('setGuide').value = S.guide; $('setMetro').value = String(+S.metro);
  $('setVol').value = S.vol; $('setA4').value = S.A4;
  updateChip();
}
function updateChip() { $('profileChip').textContent = `${S.label} · ${noteName(S.low)}–${noteName(Math.max(S.top, S.stretch))} · Jazz`; }
function bindSettings() {
  const on = (id, key, conv = (v) => v) => $(id).addEventListener('change', (e) => {
    S[key] = conv(e.target.value);
    if (S.top < S.low + 7) S.top = S.low + 7;
    if (S.stretch < S.top) S.stretch = S.top;
    renderSettings(); renderExDetail(); drawIdleRoll(); saveSettingsSoon();
  });
  on('setLabel', 'label', (v) => { S.setupDone = true; return v; }); on('setLow', 'low', Number); on('setTop', 'top', Number); on('setStretch', 'stretch', Number);
  on('setUseStretch', 'useStretch', Number); on('setGuide', 'guide'); on('setMetro', 'metro', Number);
  on('setVol', 'vol', Number); on('setA4', 'A4', (v) => Math.max(425, Math.min(452, Number(v) || 440)));
}

// ---------- data copy / import ----------
// ---------- backup files ----------
function backupBlob() {
  const data = { app: 'woodshed', format: 2, exported: new Date().toISOString(), settings: S, takes: st.takes };
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}
async function downloadBackup() {
  const name = `woodshed-backup-${dayKey(Date.now())}.json`;
  const blob = backupBlob();
  try {
    if (window.showSaveFilePicker) {
      const h = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'Woodshed backup', accept: { 'application/json': ['.json'] } }] });
      const w = await h.createWritable(); await w.write(blob); await w.close();
      toast(`Saved ${st.takes.length} takes to ${h.name}`); return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast(`Downloaded ${name} (${st.takes.length} takes)`);
}
async function restoreBackup(file) {
  if (!file) return;
  let d;
  try { d = JSON.parse(await file.text()); } catch (e) { toast('That file isn’t a Woodshed backup (it isn’t valid JSON).', 4000); return; }
  const takes = Array.isArray(d.takes) ? d.takes.filter((t) => t && t.id && Array.isArray(t.notes)) : [];
  if (!takes.length && !d.settings) { toast('No takes or settings found in that file.', 4000); return; }
  const withSettings = $('restoreSettings').checked && d.settings && typeof d.settings === 'object';
  overlay(true, `Restoring ${takes.length} takes…`);
  let ok = 0;
  for (const t of takes) { try { await Store.putTake(t); ok++; } catch (e) { console.warn(e); } }
  if (withSettings) {
    // merge: libraries are combined, everything else comes from the backup
    const b = d.settings;
    S = { ...DEFAULTS, ...b,
      customTunes: { ...(S.customTunes || {}), ...(b.customTunes || {}) }, tuneEdits: { ...(S.tuneEdits || {}), ...(b.tuneEdits || {}) },
      melodies: { ...(S.melodies || {}), ...(b.melodies || {}) }, lyrics: { ...(S.lyrics || {}), ...(b.lyrics || {}) } };
    try { await Store.saveSettings(S); } catch (e) { toast('Couldn’t save restored settings'); }
    invalidateTunes(); renderSettings(); renderWelcome();
  }
  overlay(false);
  st.takes = await Store.listTakes().catch(() => st.takes);
  toast(`Restored ${ok} of ${takes.length} takes${withSettings ? ' and your settings' : ''}.`, 4000);
  renderHistory(); renderPlan(); renderExDetail(); drawIdleRoll();
}
async function eraseAll() {
  await Store.clearAll();
  S = { ...DEFAULTS }; st.takes = []; st.current = null; invalidateTunes();
  renderSettings(); renderHistory(); renderPlan(); renderExDetail(); drawIdleRoll(); renderWelcome();
  toast('All Woodshed data in this browser was erased.');
}
async function renderStorageInfo() {
  const box = $('storeMode'); if (!box) return;
  let usage = '';
  try { if (navigator.storage && navigator.storage.estimate) { const e = await navigator.storage.estimate(); usage = ` Using about ${(e.usage / 1048576).toFixed(1)} MB.`; } } catch (e) {}
  let persisted = false;
  try { persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : false; } catch (e) {}
  box.textContent = `${st.takes.length} ${st.takes.length === 1 ? 'take is' : 'takes are'} saved in this browser on this device${Store.mode === 'idb' ? '' : ' (basic storage, so space is limited)'}.${usage} Audio isn’t stored, only the analysis. Nothing is uploaded anywhere. Download a backup file now and then: browsers can clear site data${persisted ? ' (this browser has agreed to keep it, but backups are still wise)' : ''}, and a backup is how you move your history to another browser or device.`;
}

// ---------- voice setup ----------
function applyVoicePreset(id) {
  const p = VOICE_PRESETS.find((v) => v.id === id); if (!p) return;
  Object.assign(S, { label: p.label, low: p.low, top: p.top, stretch: p.stretch, setupDone: true });
  saveSettingsSoon(); renderSettings(); renderWelcome(); renderExDetail(); drawIdleRoll(); renderPlan();
  toast(`Voice set to ${p.label}: exercises now stay between ${noteName(p.low)} and ${noteName(p.top)}.`, 4000);
}
function renderWelcome() {
  const box = $('welcome'); if (!box) return;
  box.hidden = !!S.setupDone;
  if (S.setupDone) return;
  box.innerHTML = '';
  box.append(el('h3', {}, 'Welcome to Woodshed'),
    el('p', { class: 'muted', style: 'font-size:14px' }, 'Pick the voice type closest to yours so the exercises stay in a comfortable range. You can fine-tune the exact notes any time in Settings. Everything you record stays in this browser.'),
    el('div', { class: 'actions', style: 'margin-top:8px' }, VOICE_PRESETS.map((p) => el('button', { class: 'btn small', onclick: () => applyVoicePreset(p.id) }, `${p.label} `, el('span', { class: 'dim mono', style: 'font-size:11.5px' }, `${noteName(p.low)}–${noteName(p.top)}`))),
      el('button', { class: 'btn small', onclick: () => { S.setupDone = true; saveSettingsSoon(); renderWelcome(); showTab('settings'); } }, 'Set it myself…')));
}

/*__STD__*/
/*__BUILDER__*/
/*__TRENDS__*/
// ---------- boot ----------
function bind() {
  for (const b of $('tabs').children) b.addEventListener('click', () => showTab(b.dataset.tab));
  $('selStart').addEventListener('change', (e) => { st.starts[st.exId] = +e.target.value; drawIdleRoll(); });
  $('selDir').addEventListener('change', (e) => { st.dir = e.target.value; const ex = exById(st.exId); const [a, b] = rootRange(ex); st.starts[ex.id] = st.dir === 'down' ? b : a; renderExDetail(); drawIdleRoll(); });
  $('selReps').addEventListener('change', (e) => { st.reps = +e.target.value; drawIdleRoll(); });
  $('inTempo').addEventListener('change', (e) => { st.tempos[st.exId] = +e.target.value; drawIdleRoll(); });
  $('btnPlay').addEventListener('click', () => playExercise().catch((e) => toast(e.message)));
  $('btnLive').addEventListener('click', () => startLive().catch((e) => toast(e.message)));
  $('btnStop').addEventListener('click', () => stopAll(true));
  $('fileIn').addEventListener('change', (e) => handleUpload(e.target.files[0]));
  $('btnPlayTake').addEventListener('click', playTake);
  $('btnAgain').addEventListener('click', () => { if (st.current) selectExercise(st.current.take.exId); showTab('practice'); });
  $('takeComment').addEventListener('input', (e) => { if (st.current) { st.current.take.comment = e.target.value.slice(0, 4000); saveTakeSoon(st.current.take, 1200); } });
  $('btnBackup').addEventListener('click', downloadBackup);
  $('restoreFile').addEventListener('change', (e) => { restoreBackup(e.target.files[0]); e.target.value = ''; });
  $('btnErase').addEventListener('click', (e) => {
    const b = e.currentTarget;
    if (!b.dataset.arm) { b.dataset.arm = 1; b.textContent = 'Click again to erase everything'; setTimeout(() => { if (b.isConnected) { delete b.dataset.arm; b.textContent = 'Erase all data in this browser'; } }, 4000); return; }
    delete b.dataset.arm; b.textContent = 'Erase all data in this browser'; eraseAll();
  });
  $('setPreset').addEventListener('change', (e) => { if (e.target.value) applyVoicePreset(e.target.value); e.target.value = ''; });
  window.addEventListener('resize', () => { if (!$('tab-practice').hidden) drawIdleRoll(); if (!$('tab-review').hidden && st.current) renderRevRoll(); });
  bindSettings();
  bindTrends();
  bindStd();
}
async function boot() {
  try { st.exId = localStorage.getItem('woodshed.ex') || 'five'; } catch (e) {}
  if (!EX.find((e) => e.id === st.exId)) st.exId = 'five';
  bind(); renderSettings(); renderExList(); renderExDetail(); renderPlan(); drawIdleRoll();
  if (!micAllowed()) { $('banner').hidden = false; $('bannerText').textContent = 'Live microphone isn’t available in this browser, so use ▶ Play exercise and upload a recording instead. Everything else works.'; }
  await Store.init();
  try { const s = await Store.loadSettings(); if (s) S = { ...DEFAULTS, ...s }; } catch (e) {}
  invalidateTunes();
  renderWelcome();
  try { st.takes = await Store.listTakes(); } catch (e) { console.warn(e); toast('Couldn’t load past takes.'); }
  renderSettings(); renderExDetail(); renderPlan(); drawIdleRoll();
}
boot();
// ---------- offline support (service worker) ----------
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            $('banner').hidden = false; $('bannerText').innerHTML = '';
            $('bannerText').append('A new version of Woodshed is ready. ', el('button', { class: 'btn small', onclick: () => location.reload() }, 'Reload to update'));
          }
        });
      });
    }).catch(() => {});
  });
}
window.__woodshed = { st, S: () => S, Store, analyzeTake, buildTimeline, rootSequence, exById, currentPlan, stdPlan, AE };
})();
