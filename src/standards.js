// ---------- standards ----------
// Chord changes follow common fake-book versions (simplified where noted). Melodies are not included: you sing them.
const BUILTIN_TUNES = [
  { id: 'fblues', name: 'Jazz blues in F', key: 5, minor: false, feel: 'swing', tempo: 120,
    sections: [[0, 'Blues']],
    bars: 'F7 | B♭7 | F7 | Cm7 F7 | B♭7 | Bdim7 | F7 | Am7 D7 | Gm7 | C7 | F7 D7 | Gm7 C7' },
  { id: 'mblues', name: 'Minor blues in C', key: 0, minor: true, feel: 'swing', tempo: 112,
    sections: [[0, 'Blues']],
    bars: 'Cm7 | Cm7 | Cm7 | Cm7 | Fm7 | Fm7 | Cm7 | Cm7 | A♭7 | G7 | Cm7 | G7' },
  { id: 'autumn', name: 'Autumn Leaves', key: 7, minor: true, feel: 'swing', tempo: 120,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'C']],
    bars: 'Cm7 | F7 | B♭maj7 | E♭maj7 | Am7b5 | D7 | Gm6 | Gm6 | Cm7 | F7 | B♭maj7 | E♭maj7 | Am7b5 | D7 | Gm6 | Gm6 | Am7b5 | D7 | Gm6 | Gm6 | Cm7 | F7 | B♭maj7 | E♭maj7 | Am7b5 | D7 | Gm7 C7 | Fm7 B♭7 | E♭maj7 | Am7b5 D7 | Gm6 | Gm6' },
  { id: 'bluebossa', name: 'Blue Bossa', key: 0, minor: true, feel: 'bossa', tempo: 140,
    sections: [[0, 'A'], [8, 'B']],
    bars: 'Cm7 | Cm7 | Fm7 | Fm7 | Dm7b5 | G7 | Cm7 | Cm7 | E♭m7 | A♭7 | D♭maj7 | D♭maj7 | Dm7b5 | G7 | Cm7 | Dm7b5 G7' },
  { id: 'attya', name: 'All the Things You Are', key: 8, minor: false, feel: 'swing', tempo: 132,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'A']],
    bars: 'Fm7 | B♭m7 | E♭7 | A♭maj7 | D♭maj7 | G7 | Cmaj7 | Cmaj7 | Cm7 | Fm7 | B♭7 | E♭maj7 | A♭maj7 | Am7b5 D7 | Gmaj7 | Gmaj7 | Am7 | D7 | Gmaj7 | Gmaj7 | F♯m7b5 | B7 | Emaj7 | C7 | Fm7 | B♭m7 | E♭7 | A♭maj7 | D♭maj7 | D♭m7 G♭7 | Cm7 | Bdim7 | B♭m7 | E♭7 | A♭maj7 | Gm7b5 C7' },
  { id: 'atrain', name: 'Take the A Train', key: 0, minor: false, feel: 'swing', tempo: 160,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'A']],
    bars: 'Cmaj7 | Cmaj7 | D7 | D7 | Dm7 | G7 | Cmaj7 | Dm7 G7 | Cmaj7 | Cmaj7 | D7 | D7 | Dm7 | G7 | Cmaj7 | Cmaj7 | Fmaj7 | Fmaj7 | Fmaj7 | Fmaj7 | D7 | D7 | Dm7 | G7 | Cmaj7 | Cmaj7 | D7 | D7 | Dm7 | G7 | Cmaj7 | Dm7 G7' },
  { id: 'satin', name: 'Satin Doll', key: 0, minor: false, feel: 'swing', tempo: 120,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'A']],
    bars: 'Dm7 G7 | Dm7 G7 | Em7 A7 | Em7 A7 | Am7 D7 | A♭m7 D♭7 | Cmaj7 | Cmaj7 | Dm7 G7 | Dm7 G7 | Em7 A7 | Em7 A7 | Am7 D7 | A♭m7 D♭7 | Cmaj7 | Cmaj7 | Gm7 | C7 | Fmaj7 | Fmaj7 | Am7 | D7 | Dm7 | G7 | Dm7 G7 | Dm7 G7 | Em7 A7 | Em7 A7 | Am7 D7 | A♭m7 D♭7 | Cmaj7 | Cmaj7' },
  { id: 'misty', name: 'Misty', key: 3, minor: false, feel: 'ballad', tempo: 66,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'A']],
    bars: 'E♭maj7 | B♭m7 E♭7 | A♭maj7 | A♭m7 D♭7 | E♭maj7 Cm7 | Fm7 B♭7 | Gm7 C7 | Fm7 B♭7 | E♭maj7 | B♭m7 E♭7 | A♭maj7 | A♭m7 D♭7 | E♭maj7 Cm7 | Fm7 B♭7 | E♭maj7 | B♭m7 E♭7 | B♭m7 | E♭7 | A♭maj7 | A♭maj7 | Am7 | D7 | Gm7 C7 | Fm7 B♭7 | E♭maj7 | B♭m7 E♭7 | A♭maj7 | A♭m7 D♭7 | E♭maj7 Cm7 | Fm7 B♭7 | E♭maj7 | Fm7 B♭7' },
  { id: 'rhythm', name: 'Rhythm changes (I Got Rhythm)', key: 10, minor: false, feel: 'swing', tempo: 160,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'A']],
    bars: 'B♭maj7 G7 | Cm7 F7 | B♭maj7 G7 | Cm7 F7 | Fm7 B♭7 | E♭maj7 Edim7 | B♭maj7 G7 | Cm7 F7 | B♭maj7 G7 | Cm7 F7 | B♭maj7 G7 | Cm7 F7 | Fm7 B♭7 | E♭maj7 Edim7 | B♭maj7 F7 | B♭maj7 | D7 | D7 | G7 | G7 | C7 | C7 | F7 | F7 | B♭maj7 G7 | Cm7 F7 | B♭maj7 G7 | Cm7 F7 | Fm7 B♭7 | E♭maj7 Edim7 | B♭maj7 F7 | B♭maj7' },
  { id: 'blackbird', name: 'Bye Bye Blackbird', key: 5, minor: false, feel: 'swing', tempo: 132,
    sections: [[0, 'A'], [8, 'A'], [16, 'B'], [24, 'A']],
    bars: 'Fmaj7 | A♭dim7 | Gm7 | C7 | Gm7 | C7 | Fmaj7 | Fmaj7 | Fmaj7 | A♭dim7 | Gm7 | C7 | Gm7 | C7 | Fmaj7 | F7 | Fm7 | Fm7 | Cm7 | F7 | B♭maj7 | B♭maj7 | Am7b5 | D7 | Gm7 | C7 | Fmaj7 | D7 | Gm7 | C7 | Fmaj7 | Fmaj7' },
  { id: 'summertime', name: 'Summertime (simplified changes)', key: 9, minor: true, feel: 'ballad', tempo: 76,
    sections: [[0, 'A'], [8, 'A']],
    bars: 'Am6 | E7 | Am6 | Am6 | Dm6 | Dm6 | E7 | E7 | Am6 | E7 | Am6 | A7 | Dm7 | E7 | Am6 | E7' },
];
// Built-in tunes with your edits applied, plus your own progressions (rebuilt when they change).
let _tunes = null;
function invalidateTunes() { _tunes = null; }
function allTunes() {
  if (_tunes) return _tunes;
  const out = [];
  for (const b of BUILTIN_TUNES) {
    const ed = (S.tuneEdits || {})[b.id];
    const text = ed ? ed.bars : serializeBars(b.bars.split('|').map((x) => x.trim()), b.sections);
    const p = parseBarsText(text);
    out.push({ ...b, text, parsed: p.ok ? p.parsed : parseBarsText(serializeBars(b.bars.split('|').map((x) => x.trim()), b.sections)).parsed,
      sections: p.ok && p.sections.length ? p.sections : b.sections, edited: !!ed, builtin: true });
  }
  for (const c of Object.values(S.customTunes || {})) {
    const p = parseBarsText(c.bars);
    if (!p.ok || !p.parsed.length) continue;
    out.push({ ...c, text: c.bars, parsed: p.parsed, sections: p.sections, custom: true });
  }
  return (_tunes = out);
}
const tuneById = (id) => allTunes().find((t) => t.id === id) || allTunes()[0];
const LETTER = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const QMAP = { '': 'maj', maj7: 'maj7', m7: 'm7', '7': '7', m7b5: 'm7b5', m6: 'm6', '6': 'maj6', dim7: 'dim7', m: 'm' };
function parseChord(sym) {
  const m = sym.match(/^([A-G])([♭♯b#]?)(.*)$/);
  if (!m) throw new Error('Bad chord ' + sym);
  const pc = (LETTER[m[1]] + (m[2] === '♭' || m[2] === 'b' ? -1 : m[2] ? 1 : 0) + 12) % 12;
  const q = QMAP[m[3]];
  if (!q) throw new Error('Unknown quality ' + sym);
  return { pc, q };
}
// Forgiving chord parser for the builder: accepts common lead-sheet spellings and maps
// extensions onto the nearest chord Woodshed can voice (C9 -> C7, Cmaj9 -> Cmaj7, Cø -> Cm7♭5 ...).
function parseChordLoose(sym) {
  const t = sym.trim().replace(/♭/g, 'b').replace(/♯/g, '#');
  const m = t.match(/^([A-Ga-g])([b#]?)(.*)$/);
  if (!m) return null;
  const pc = (LETTER[m[1].toUpperCase()] + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0) + 12) % 12;
  let x = m[3].split('/')[0].replace(/[()]/g, '');
  let q = null;
  if (x === '' || x === 'maj' || x === 'M' || x === 'add9') q = 'maj';
  else if (/^(m7b5|ø7?|min7b5|-7b5|mi7b5)$/.test(x)) q = 'm7b5';
  else if (/^(dim7?|°7?|o7?)$/.test(x)) q = 'dim7';
  else if (/^(m6|min6|-6|mi6|m69|m6\/9)$/.test(x)) q = 'm6';
  else if (/^(maj|M|Δ|\^|ma)(7|9|11|13)?(#11|b5)?$/.test(x)) q = 'maj7';
  else if (/^(m|min|-|mi)(7|9|11|13)?$/.test(x)) q = /\d/.test(x) ? 'm7' : 'm';
  else if (/^(m|min|-)(maj7|M7|Δ7?)$/.test(x)) q = 'm';
  else if (/^(6|69|6\/9)$/.test(x)) q = 'maj6';
  else if (/^(7?sus4?|9sus4?|13sus4?|sus2)$/.test(x)) q = 'sus';
  else if (/^(7|9|11|13|alt|7alt)/.test(x)) q = '7';
  return q ? { pc, q } : null;
}
function parseBarsText(text) {
  const bars = [], sections = [], bad = [];
  text.split('|').map((b) => b.trim()).forEach((b, i) => {
    if (!b && i === text.split('|').length - 1) return;
    let body = b;
    const sm = body.match(/^\[([^\]]{1,8})\]\s*/);
    if (sm) { sections.push([bars.length, sm[1]]); body = body.slice(sm[0].length); }
    const toks = body.split(/\s+/).filter(Boolean);
    if (!toks.length) { bad.push(`bar ${bars.length + 1} is empty`); bars.push(bars.length ? bars[bars.length - 1] : []); return; }
    if (toks.length > 4) bad.push(`bar ${bars.length + 1} has more than 4 chords`);
    const chs = toks.slice(0, 4).map((tk) => { const c = parseChordLoose(tk); if (!c) bad.push(`“${tk}” in bar ${bars.length + 1}`); return c; });
    bars.push(chs.filter(Boolean));
  });
  return { ok: !bad.length && bars.length > 0 && bars.every((b) => b.length), parsed: bars, sections, bad };
}
function serializeBars(barTexts, sections) {
  const sec = new Map((sections || []).map(([i, l]) => [i, l]));
  return barTexts.map((b, i) => (sec.has(i) ? `[${sec.get(i)}] ` : '') + b).join(' | ');
}
const keyLabel = (tune, tonic) => {
  const sharp = tune.minor ? sharpKey(tonic + 3) : sharpKey(tonic);
  return pcName(tonic, sharp) + (tune.minor ? ' minor' : '');
};
const tuneSharp = (tune, tonic) => (tune.minor ? sharpKey(tonic + 3) : sharpKey(tonic));
const FEELS = [['swing', 'Swing'], ['ballad', 'Ballad'], ['bossa', 'Bossa nova'], ['even', 'Even 8ths']];

function buildStdTimeline(tune, tonic, tempo, feel, choruses, mel) {
  const spb = 60 / tempo;
  const shift = (((tonic - tune.key) % 12) + 12) % 12;
  const sharp = tuneSharp(tune, tonic);
  const chords = [], comp = [], bass = [], clicks = [], bars = [];
  const nb = tune.parsed.length;
  const rootMidi = (pc) => 48 + ((pc + shift) % 12);
  const first = tune.parsed[0][0];
  for (let b = 0; b < 4; b++) clicks.push({ t: b * spb, accent: b === 0 });
  chords.push({ t0: 0, t1: 4 * spb, root: rootMidi(first.pc), q: first.q, cue: true, sharp });
  comp.push({ root: rootMidi(first.pc), q: first.q, t0: 0, t1: 3.6 * spb, vel: 0.06 });
  let prevBass = 41;
  const bassAt = (pc) => { // nearest octave to the previous bass note, within E2–D3
    let best = null;
    for (let m = 36; m <= 50; m++) if (((m - pc) % 12 + 12) % 12 === 0 && (best == null || Math.abs(m - prevBass) < Math.abs(best - prevBass))) best = m;
    prevBass = best; return best;
  };
  const third = (q) => (['m7', 'm7b5', 'm6', 'dim7', 'm'].includes(q) ? 3 : 4);
  const fifth = (q) => (['m7b5', 'dim7'].includes(q) ? 6 : 7);
  let beat = 4;
  for (let c = 0; c < choruses; c++) {
    for (let i = 0; i < nb; i++) {
      const bar = tune.parsed[i];
      const nextBar = tune.parsed[(i + 1) % nb];
      const b0 = beat;
      bars.push({ t0: b0 * spb, t1: (b0 + 4) * spb, index: i, chorus: c });
      const per = 4 / bar.length;
      bar.forEach((ch, k) => {
        const root = rootMidi(ch.pc);
        const t0 = (b0 + k * per) * spb, t1 = (b0 + (k + 1) * per) * spb;
        chords.push({ t0, t1, root, q: ch.q, sharp, bar: i });
        // comping
        if (feel === 'ballad') comp.push({ root, q: ch.q, t0, t1: t1 - 0.05, vel: 0.07 });
        else if (feel === 'bossa') {
          for (const [o, d] of (per === 4 ? [[0, 1.2], [1.5, 0.4], [2.5, 1.2]] : [[0, 1.2], [1.5, 0.4]])) comp.push({ root, q: ch.q, t0: t0 + o * spb, t1: t0 + (o + d) * spb, vel: 0.07 });
        } else if (feel === 'even') {
          for (let o = 0; o < per; o += 2) comp.push({ root, q: ch.q, t0: t0 + o * spb, t1: t0 + (o + 1.6) * spb, vel: 0.075 });
        } else {
          // swing: Charleston-ish hits (beat 1 and the swung "and" of 2) per full bar; one hit per half bar
          if (per === 4) { comp.push({ root, q: ch.q, t0, t1: t0 + 1.3 * spb, vel: 0.075 }); comp.push({ root, q: ch.q, t0: t0 + (1 + 2 / 3) * spb, t1: t0 + 2.6 * spb, vel: 0.06 }); }
          else comp.push({ root, q: ch.q, t0, t1: t0 + 1.5 * spb, vel: 0.075 });
        }
      });
      // bass line
      const nextRootPc = nextBar[0].pc;
      const appr = (nextRootPc + (i % 2 ? 1 : -1) + 12) % 12;
      let line;
      if (feel === 'ballad') {
        line = bar.length === 1 ? [[bar[0].pc, 0, 2], [bar[0].pc + fifth(bar[0].q), 2, 2]] : [[bar[0].pc, 0, 2], [bar[1].pc, 2, 2]];
      } else if (feel === 'bossa') {
        const a = bar[0], z = bar[bar.length - 1];
        line = [[a.pc, 0, 1.5], [a.pc + 7, 1.5, 0.5], [z.pc, 2, 1.5], [z.pc + 7, 3.5, 0.5]];
      } else if (bar.length === 1) {
        const ch = bar[0];
        line = [[ch.pc, 0, 1], [ch.pc + third(ch.q), 1, 1], [ch.pc + fifth(ch.q), 2, 1], [appr, 3, 1]];
      } else {
        line = [[bar[0].pc, 0, 1], [bar[0].pc + fifth(bar[0].q), 1, 1], [bar[1].pc, 2, 1], [appr, 3, 1]];
      }
      for (const [pc, o, d] of line) bass.push({ midi: bassAt(((pc + shift) % 12 + 12) % 12), t0: (b0 + o) * spb, t1: (b0 + o + d) * spb - 0.02 });
      if (+S.metro && feel !== 'ballad') { clicks.push({ t: (b0 + 1) * spb }); clicks.push({ t: (b0 + 3) * spb }); }
      beat += 4;
    }
  }
  // your melody (imported or typed in), transposed to the chosen key
  const notes = [];
  if (mel && mel.notes && mel.notes.length) {
    let ms = (((tonic - mel.key) % 12) + 12) % 12; if (ms > 6) ms -= 12;
    ms += 12 * (mel.octave || 0);
    const formBeats = nb * 4;
    for (let c = 0; c < choruses; c++) {
      let pos = 0;
      for (const [m, b] of mel.notes) {
        const s0 = pos + (mel.offset || 0), s1 = s0 + b;
        pos += b;
        if (m == null || s0 >= formBeats) continue;
        let a0 = 4 + c * formBeats + s0, a1 = 4 + c * formBeats + Math.min(s1, formBeats + 2);
        if (feel === 'swing') { a0 = swingMap(a0); a1 = swingMap(a1); }
        if (a0 < 0) continue;
        const t0 = a0 * spb, t1 = Math.max(t0 + 0.06, a1 * spb - 0.01);
        const ch = chords.find((x) => !x.cue && t0 >= x.t0 - 1e-6 && t0 < x.t1) || chords.find((x) => t0 >= x.t0 && t0 < x.t1);
        const midi = m + ms;
        notes.push({ midi, t0, t1, fn: ch ? fnName(midi - ch.root, ch.q) : null, chord: ch ? chordName(ch.root, ch.q, sharp) : null, rep: c, guide: true, sharp });
      }
    }
  }
  // final chord rings
  const last = tune.parsed[0][0];
  const end = beat * spb;
  comp.push({ root: rootMidi(last.pc), q: last.q, t0: end, t1: end + 2.5 * spb, vel: 0.07 });
  bass.push({ midi: bassAt((last.pc + shift) % 12), t0: end, t1: end + 2.5 * spb });
  chords.push({ t0: end, t1: end + 2.5 * spb, root: rootMidi(last.pc), q: last.q, sharp, bar: 0 });
  return { notes, chords, comp, bass, clicks, bars, total: end + 3 * spb, spb, nb, formLen: nb * 4 * spb, start: 4 * spb };
}
function stdState() {
  const s = st.std;
  const tune = tuneById(s.tune);
  const tonic = s.keys[tune.id] ?? tune.key;
  const tempo = Math.max(40, Math.min(300, s.tempos[tune.id] || tune.tempo));
  const feel = s.feels[tune.id] || tune.feel;
  return { tune, tonic, tempo, feel, choruses: s.choruses };
}
function stdPlan() {
  const { tune, tonic, tempo, feel, choruses } = stdState();
  const mel = (S.melodies || {})[tune.id];
  const tl = buildStdTimeline(tune, tonic, tempo, feel, choruses, mel);
  return { std: true, tune, tempo, feel, choruses, keyName: keyLabel(tune, tonic), roots: null, tl, hasMelody: tl.notes.length > 0 };
}

// ---------- your melody & lyrics (entered by you) ----------
const PITCH_RE = /^([A-Ga-g])([#b♯♭]?)(-?\d)$/;
function parsePitch(tok) {
  const m = tok.match(PITCH_RE); if (!m) return null;
  const acc = m[2] === '#' || m[2] === '♯' ? 1 : m[2] === 'b' || m[2] === '♭' ? -1 : 0;
  return 12 * (+m[3] + 1) + LETTER[m[1].toUpperCase()] + acc;
}
function parseDur(d) { if (d.includes('/')) { const [a, b] = d.split('/').map(Number); return a / b; } return Number(d); }
function parseMelodyText(text) {
  const out = [], errs = [];
  for (const tok of text.replace(/\|/g, ' ').split(/\s+/).filter(Boolean)) {
    const [p, d] = tok.split(':');
    const dur = d != null ? parseDur(d) : NaN;
    if (!(dur > 0)) { errs.push(tok); continue; }
    if (/^r$/i.test(p)) { out.push([null, dur]); continue; }
    const m = parsePitch(p);
    if (m == null) { errs.push(tok); continue; }
    out.push([m, dur]);
  }
  return { notes: out, errs };
}
function parseMidi(buf) {
  const d = new DataView(buf); let p = 0;
  const str = (n) => { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(d.getUint8(p + i)); p += n; return s; };
  const u32 = () => { const v = d.getUint32(p); p += 4; return v; }, u16 = () => { const v = d.getUint16(p); p += 2; return v; };
  const vlq = () => { let v = 0, b; do { b = d.getUint8(p++); v = (v << 7) | (b & 0x7f); } while (b & 0x80); return v; };
  if (str(4) !== 'MThd') throw new Error('Not a MIDI file');
  const hl = u32(); u16(); const ntr = u16(); const div = u16(); p += hl - 6;
  if (div & 0x8000) throw new Error('SMPTE-timed MIDI files aren’t supported');
  const tracks = [];
  for (let t = 0; t < ntr && p < d.byteLength; t++) {
    const id = str(4), len = u32(), end = p + len;
    if (id !== 'MTrk') { p = end; continue; }
    let tick = 0, rs = 0; const on = new Map(), notes = [];
    while (p < end) {
      tick += vlq();
      let st_ = d.getUint8(p);
      if (st_ & 0x80) p++; else st_ = rs;
      if (st_ === 0xff) { p++; const l = vlq(); p += l; continue; }
      if (st_ === 0xf0 || st_ === 0xf7) { const l = vlq(); p += l; continue; }
      rs = st_;
      const type = st_ & 0xf0;
      if (type === 0x80 || type === 0x90) {
        const k = d.getUint8(p++), v = d.getUint8(p++);
        if (type === 0x90 && v > 0) on.set(k, tick);
        else if (on.has(k)) { notes.push({ k, s: on.get(k), e: tick }); on.delete(k); }
      } else if (type === 0xc0 || type === 0xd0) p += 1;
      else p += 2;
    }
    p = end;
    if (notes.length) tracks.push(notes);
  }
  if (!tracks.length) throw new Error('No notes found in that file');
  const notes = tracks.sort((a, b) => b.length - a.length)[0].sort((a, b) => a.s - b.s || b.k - a.k);
  const mono = [];
  for (const n of notes) { const prev = mono[mono.length - 1]; if (prev && n.s === prev.s) continue; if (prev && prev.e > n.s) prev.e = n.s; mono.push({ ...n }); }
  const out = []; let cur = 0;
  for (const n of mono) {
    if (n.s > cur) out.push([null, (n.s - cur) / div]);
    out.push([n.k, Math.max(1, n.e - n.s) / div]); cur = Math.max(n.e, n.s + 1);
  }
  return out;
}
function melodyRangeText(mel, tonic) {
  let ms = (((tonic - mel.key) % 12) + 12) % 12; if (ms > 6) ms -= 12; ms += 12 * (mel.octave || 0);
  const ps = mel.notes.filter((n) => n[0] != null).map((n) => n[0] + ms);
  if (!ps.length) return '';
  const lo = Math.min(...ps), hi = Math.max(...ps);
  const fits = lo >= S.low - 2 && hi <= Math.max(S.top, S.stretch);
  return { text: `${noteName(lo)}–${noteName(hi)}`, fits };
}
function saveMelody(mel) {
  S.melodies = { ...(S.melodies || {}), [st.std.tune]: mel };
  st.std.melodyOn = true;
  saveSettingsSoon(); renderStdControls(); drawIdleRoll(); renderTempoHint();
}
function renderStdEditor() {
  const box = $('stdEditor'); if (!box || box.hidden) return;
  const { tune, tonic } = stdState();
  const mel = (S.melodies || {})[tune.id];
  box.innerHTML = '';
  const keySel = el('select', {}, [...Array(12)].map((_, k) => el('option', { value: k }, keyLabel(tune, k))));
  keySel.value = mel ? mel.key : tune.key;
  const offIn = el('input', { type: 'number', step: '0.5', value: mel ? mel.offset || 0 : 0, style: 'width:80px' });
  const octSel = el('select', {}, [[-1, 'Down an octave'], [0, 'As written'], [1, 'Up an octave']].map(([v, l]) => el('option', { value: v }, l)));
  octSel.value = mel ? mel.octave || 0 : 0;
  const ta = el('textarea', { placeholder: 'One note per token as pitch:beats, with r for rests and | for bar lines (ignored). Example: G4:1 A4:0.5 B♭4:1.5 | r:1 D5:3', style: 'min-height:90px;font-family:var(--mono);font-size:13px' });
  if (mel && mel.src === 'text') ta.value = mel.text || '';
  const fileIn = el('input', { type: 'file', accept: '.mid,.midi,audio/midi', hidden: true });
  const status = el('div', { class: 'muted', style: 'font-size:13px;margin:6px 0' });
  if (mel) {
    const r = melodyRangeText(mel, tonic);
    status.append(`Saved: ${mel.notes.filter((n) => n[0] != null).length} notes from ${mel.src === 'midi' ? 'a MIDI file' : 'typed notes'}, written in ${keyLabel(tune, mel.key)}. In ${keyLabel(tune, tonic)} it spans `,
      el('b', { class: r.fits ? 'c-good' : 'c-near' }, r.text), r.fits ? ', which is inside your range.' : ', which goes outside your range; try another key or an octave shift.');
  } else status.append('No melody saved for this tune yet.');
  const meta = () => ({ key: +keySel.value, offset: +offIn.value || 0, octave: +octSel.value || 0 });
  fileIn.addEventListener('change', async () => {
    const f = fileIn.files[0]; if (!f) return;
    try { const notes = parseMidi(await f.arrayBuffer()); saveMelody({ notes, src: 'midi', name: f.name, ...meta() }); toast(`Imported ${notes.filter((n) => n[0] != null).length} notes from ${f.name}`); }
    catch (e) { toast('Couldn’t read that MIDI file: ' + e.message, 4000); }
    fileIn.value = '';
  });
  const lyr = el('textarea', { placeholder: 'Paste the lyrics from your own lead sheet or songbook. Blank lines separate sections.', style: 'min-height:140px' });
  lyr.value = (S.lyrics || {})[tune.id] || '';
  box.append(
    el('h3', {}, `Your melody & lyrics for ${tune.name}`),
    el('p', { class: 'muted', style: 'font-size:13px' }, 'Woodshed doesn’t ship melodies or lyrics. Several of these songs are still under copyright, and for public-domain ones like Bye Bye Blackbird a lead sheet or the original sheet music you trust beats a transcription from memory. Add them from your own copy here. With a melody saved, Woodshed can play it and scores your take against it note by note, just like the exercises.'),
    status,
    el('div', { class: 'controls', style: 'margin:6px 0' },
      el('label', { class: 'field' }, 'Written in', keySel),
      el('label', { class: 'field' }, 'Offset (beats)', offIn),
      el('label', { class: 'field' }, 'Octave', octSel),
      el('label', { class: 'btn small' }, '⬆ Import MIDI file', fileIn),
      mel ? el('button', { class: 'btn small', onclick: () => saveMelody({ ...mel, ...meta() }) }, 'Apply key/offset/octave') : null,
      mel ? el('button', { class: 'btn small danger', onclick: () => { const m = { ...(S.melodies || {}) }; delete m[tune.id]; S.melodies = m; saveSettingsSoon(); renderStdControls(); drawIdleRoll(); } }, 'Remove melody') : null),
    el('p', { class: 'hint', style: 'margin:0 0 6px' }, 'Offset moves the melody against the form: use a negative number for pickup notes (−1 starts one beat before bar 1, inside the count-in). MIDI export from MuseScore, Sibelius, Dorico or Finale works; Woodshed takes the busiest track and keeps the top note of any chord.'),
    ta,
    el('div', { class: 'actions', style: 'margin:6px 0 16px' }, el('button', { class: 'btn small primary', onclick: () => {
      const r = parseMelodyText(ta.value);
      if (!r.notes.length) { toast('No notes found. Use pitch:beats, like G4:1'); return; }
      if (r.errs.length) toast(`Skipped ${r.errs.length} token(s) I couldn’t read: ${r.errs.slice(0, 4).join(' ')}`, 5000);
      saveMelody({ notes: r.notes, src: 'text', text: ta.value, ...meta() });
    } }, 'Save typed melody')),
    el('h3', { style: 'font-size:16px' }, 'Lyrics'),
    lyr,
    el('div', { class: 'actions', style: 'margin-top:6px' },
      el('button', { class: 'btn small primary', onclick: () => { S.lyrics = { ...(S.lyrics || {}), [tune.id]: lyr.value.slice(0, 20000) }; saveSettingsSoon(); renderStdLyrics(); toast('Lyrics saved'); } }, 'Save lyrics'),
      el('label', { class: 'field', style: 'flex-direction:row;align-items:center;gap:6px' }, el('input', { type: 'checkbox', checked: st.std.autoscroll !== false, onchange: (e) => { st.std.autoscroll = e.target.checked; } }), 'Scroll lyrics with the music')),
  );
}
function renderStdLyrics() {
  const box = $('stdLyrics'); if (!box) return;
  const txt = (S.lyrics || {})[st.std.tune] || '';
  box.hidden = !txt.trim();
  box.textContent = txt;
  $('stdWrap').classList.toggle('withlyrics', !!txt.trim());
}
function scrollLyrics(plan, now) {
  const box = $('stdLyrics'); if (!box || box.hidden || st.std.autoscroll === false) return;
  const tl = plan.tl, into = now - tl.start; if (into < 0) return;
  const frac = (into % tl.formLen) / tl.formLen;
  const target = frac * (box.scrollHeight - box.clientHeight);
  if (Math.abs(box.scrollTop - target) > 2) box.scrollTop = target;
}
function renderStdControls() {
  const { tune, tonic, tempo, feel, choruses } = stdState();
  const ts = $('stdTune');
  ts.innerHTML = '';
  ts.append(el('optgroup', { label: 'Standards' }, allTunes().filter((t) => t.builtin).map((t) => el('option', { value: t.id }, t.name + (t.edited ? ' (edited)' : '')))));
  const mine = allTunes().filter((t) => t.custom);
  if (mine.length) ts.append(el('optgroup', { label: 'My progressions' }, mine.map((t) => el('option', { value: t.id }, t.name))));
  ts.value = tune.id;
  const ks = $('stdKey'); ks.innerHTML = '';
  for (let k = 0; k < 12; k++) ks.append(el('option', { value: k }, keyLabel(tune, k) + (k === tune.key ? ' (usual key)' : '')));
  ks.value = tonic;
  $('stdTempo').value = tempo;
  const fs = $('stdFeel'); if (!fs.options.length) FEELS.forEach(([v, l]) => fs.append(el('option', { value: v }, l)));
  fs.value = feel;
  const cs = $('stdChorus'); if (!cs.options.length) [1, 2, 3, 4].forEach((n) => cs.append(el('option', { value: n }, n)));
  cs.value = choruses;
  const mel = (S.melodies || {})[tune.id];
  const mb = $('stdMelBtn');
  mb.disabled = !mel;
  mb.classList.toggle('on', !!mel && !!st.std.melodyOn);
  mb.textContent = !mel ? '♪ Melody voice (add a melody first)' : st.std.melodyOn ? '♪ Melody voice: on' : '♪ Melody voice: off';
  renderStdChart(-1);
  renderStdLyrics();
  renderStdEditor();
}
function renderStdChart(activeBar) {
  const box = $('stdChart'); if (!box) return;
  const { tune, tonic } = stdState();
  const shift = (((tonic - tune.key) % 12) + 12) % 12, sharp = tuneSharp(tune, tonic);
  const sig = tune.id + ':' + tonic + ':' + tune.text;
  if (box.dataset.sig !== sig) {
    box.dataset.sig = sig; box.innerHTML = '';
    const secAt = new Map(tune.sections.map(([i, l]) => [i, l]));
    tune.parsed.forEach((bar, i) => {
      box.append(el('div', { class: 'stdbar', 'data-i': i },
        secAt.has(i) ? el('span', { class: 'sec' }, secAt.get(i)) : null,
        el('span', { class: 'bn' }, i + 1),
        bar.map((c) => el('span', { class: 'ch' }, chordName(48 + ((c.pc + shift) % 12), c.q, sharp)))));
    });
  }
  box.querySelectorAll('.stdbar').forEach((b) => b.classList.toggle('on', +b.dataset.i === activeBar));
}
function bindStd() {
  $('stdTune').addEventListener('change', (e) => { st.std.tune = e.target.value; renderStdControls(); renderTempoHint(); drawIdleRoll(); });
  $('stdKey').addEventListener('change', (e) => { st.std.keys[st.std.tune] = +e.target.value; renderStdControls(); drawIdleRoll(); });
  $('stdTempo').addEventListener('change', (e) => { st.std.tempos[st.std.tune] = +e.target.value; renderTempoHint(); drawIdleRoll(); });
  $('stdFeel').addEventListener('change', (e) => { st.std.feels[st.std.tune] = e.target.value; });
  $('stdChorus').addEventListener('change', (e) => { st.std.choruses = +e.target.value; drawIdleRoll(); });
  $('stdChangesBtn').addEventListener('click', () => { if (st.builder.open && st.builder.from === 'std') closeBuilder(); else openBuilder(st.std.tune, 'std'); });
  $('stdNewBtn').addEventListener('click', () => openBuilder(null, 'std'));
  $('stdMelBtn').addEventListener('click', () => { st.std.melodyOn = !st.std.melodyOn; AE.setMelody(st.std.melodyOn); renderStdControls(); });
  $('stdEditBtn').addEventListener('click', () => { st.std.editorOpen = !st.std.editorOpen; const b = $('stdEditor'); b.hidden = !st.std.editorOpen; $('stdEditBtn').classList.toggle('on', st.std.editorOpen); renderStdEditor(); });
}

// ---------- tempo tracking ----------
const tempoKey = (t) => (t.tune ? 'std:' + t.tune.id : t.exId);
const tracksTempo = (t) => !!t.tempo && (!!t.tune || (!exById(t.exId).noTempo && !exById(t.exId).free && EX.some((e) => e.id === t.exId)));
const tempoName = (key) => (key.startsWith('std:') ? tuneById(key.slice(4)).name : exById(key).name);
const defaultTempo = (key) => (key.startsWith('std:') ? tuneById(key.slice(4)).tempo : exById(key).tempo);
function isClean(t) {
  const s = t.summary; if (!s || s.medAbs == null || !s.n) return false;
  return t.free ? s.medAbs <= 18 && s.inTune >= 65 : s.medAbs <= 15 && s.inTune >= 75;
}
const CLEAN_TEXT = '“Clean” means at least 75% of notes within ±20¢ and a median error of 15¢ or less (songs and standards: 65% and 18¢, measured against the nearest note).';
function tempoStatus(key) {
  const ts = ownTakes().filter((t) => tracksTempo(t) && tempoKey(t) === key).sort((a, b) => a.ts - b.ts);
  if (!ts.length) return null;
  const first = ts[0], last = ts[ts.length - 1];
  const clean = ts.filter(isClean);
  const fastestClean = clean.length ? Math.max(...clean.map((t) => t.tempo)) : null;
  const def = defaultTempo(key);
  const step = last.tempo < 100 ? 4 : 6;
  let next, why;
  if (isClean(last)) {
    if (last.tempo >= def) { next = Math.min(Math.round(def * 1.3), last.tempo + step); why = `Clean at full tempo (${def}). Push on only if you want extra headroom.`; }
    else { next = Math.min(def, last.tempo + step); why = `Your last take at ${last.tempo} was clean, so nudge it up ${next - last.tempo} bpm.`; }
  } else if ((last.summary?.inTune ?? 0) < 55) { next = Math.max(40, last.tempo - step); why = `The last take at ${last.tempo} was only ${last.summary?.inTune ?? 0}% in tune, so come down a notch and make it clean first.`; }
  else { next = last.tempo; why = `Stay at ${last.tempo} until a take comes out clean, then move up.`; }
  return { key, name: tempoName(key), def, first, last, fastestClean, next, why, count: ts.length, exId: first.exId, tune: first.tune ? first.tune.id : null };
}
function tempoSugg(key) {
  const s = tempoStatus(key); if (!s) return null;
  const item = s.tune ? { ex: 'standards', tune: s.tune, tempo: s.next, t: s.why + ' Sing one chorus at the new tempo before adding more.' }
    : { ex: s.exId, tempo: s.next, t: s.why + ' Two clean takes in a row at one tempo is a good rule before moving up again.' };
  return { h: `Building speed on ${s.name}`, items: [item] };
}
function renderTempoHint() {
  const box = $('tempoHint'); if (!box) return;
  const ex = exById(st.exId);
  box.innerHTML = '';
  if ((ex.free && !ex.std) || ex.noTempo) return;
  const key = ex.std ? 'std:' + st.std.tune : ex.id;
  const s = tempoStatus(key);
  if (!s) { box.append(`Tempo tracking starts with your first take. Default tempo is ${defaultTempo(key)} bpm.`); return; }
  box.append(`Last time: ${s.last.tempo} bpm (${s.last.summary?.inTune ?? '—'}% in tune) · fastest clean: ${s.fastestClean ?? 'none yet'} · suggested next: ${s.next} bpm `,
    el('button', { class: 'btn small', onclick: () => { if (ex.std) { st.std.tempos[st.std.tune] = s.next; $('stdTempo').value = s.next; } else { st.tempos[ex.id] = s.next; $('inTempo').value = s.next; } drawIdleRoll(); toast('Tempo set to ' + s.next); } }, `Use ${s.next}`));
}
function renderTempoCard() {
  const box = $('tempoCard'); if (!box) return;
  box.innerHTML = '';
  const keys = [...new Set(ownTakes().filter(tracksTempo).map(tempoKey))];
  if (!keys.length) { box.append(el('p', { class: 'muted' }, 'Tempo shows up here once you’ve logged exercise takes.')); return; }
  box.append(el('p', { class: 'muted', style: 'font-size:13px' }, CLEAN_TEXT + ' Hover a row for what to do next.'));
  const t = el('table', {}, el('thead', {}, el('tr', {}, ['Exercise / tune', 'Default', 'First', 'Latest', 'Fastest clean', 'Next to try', ''].map((h) => el('th', {}, h)))));
  const body = el('tbody');
  for (const key of keys) {
    const s = tempoStatus(key);
    const lt = s.last;
    const row = el('tr', {},
      el('td', {}, s.name), el('td', { class: 'num dim' }, s.def), el('td', { class: 'num' }, s.first.tempo),
      el('td', { class: 'num' }, `${lt.tempo} `, el('span', { class: isClean(lt) ? 'c-good' : 'c-near' }, `(${lt.summary?.inTune ?? '—'}%)`)),
      el('td', { class: 'num ' + (s.fastestClean ? '' : 'dim') }, s.fastestClean ?? '—'),
      el('td', { class: 'num' }, s.next),
      el('td', {}, el('button', { class: 'btn small', onclick: (e) => { e.stopPropagation(); applyPreset(tempoSugg(key).items[0]); } }, 'Load')));
    hoverTip(row, () => tipContent(`${s.name}: ${lt.tempo} bpm last time`, `${s.count} takes · started at ${s.first.tempo} · fastest clean ${s.fastestClean ?? 'none yet'}`, tempoSugg(key), false));
    body.append(row);
  }
  t.append(body); box.append(el('div', { style: 'overflow-x:auto' }, t));
}
