// ---------- progression builder (Standards + Free sing) ----------
st.builder = { open: false, mode: 'grid', draft: null, from: 'std' };
st.prog = { id: '', keys: {}, tempos: {} };
const textToCells = (text) => {
  const out = [];
  text.split('|').forEach((b) => {
    const t = b.trim(); if (!t) return;
    const m = t.match(/^\[([^\]]{1,8})\]\s*/);
    out.push({ sec: m ? m[1] : '', text: m ? t.slice(m[0].length) : t });
  });
  return out;
};
const cellsToText = (cells) => cells.map((c) => (c.sec.trim() ? `[${c.sec.trim()}] ` : '') + c.text.trim()).join(' | ');
const cellValid = (txt) => { const tk = txt.trim().split(/\s+/).filter(Boolean); return tk.length >= 1 && tk.length <= 4 && tk.every((x) => parseChordLoose(x)); };

function openBuilder(tuneId, from) {
  const t = tuneId ? tuneById(tuneId) : null;
  st.builder.from = from;
  st.builder.mode = 'grid';
  st.builder.draft = t
    ? { id: t.custom ? t.id : null, baseId: t.builtin ? t.id : null, name: t.name, key: t.key, minor: !!t.minor, feel: t.feel, tempo: t.tempo, cells: textToCells(t.text) }
    : { id: null, baseId: null, name: 'My progression', key: 0, minor: false, feel: 'swing', tempo: 120,
      cells: [{ sec: 'A', text: 'Dm7' }, { sec: '', text: 'G7' }, { sec: '', text: 'Cmaj7' }, { sec: '', text: 'Cmaj7' }] };
  st.builder.open = true;
  $('progBuilder').hidden = false;
  renderBuilder();
  $('progBuilder').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function closeBuilder() { st.builder.open = false; $('progBuilder').hidden = true; }
function builderStatus() {
  const d = st.builder.draft;
  const p = parseBarsText(cellsToText(d.cells));
  const box = $('bStatus'); if (!box) return p;
  box.className = 'muted'; box.style.fontSize = '13px';
  if (!d.cells.length) { box.textContent = 'Add at least one bar.'; box.className = 'c-off'; }
  else if (!p.ok) { box.textContent = `${d.cells.length} bars. Fix: ${p.bad.slice(0, 4).join('; ')}${p.bad.length > 4 ? '…' : ''}`; box.className = 'c-off'; }
  else box.textContent = `${d.cells.length} bars, ${p.sections.length ? 'sections ' + p.sections.map((x) => x[1]).join(' ') : 'no section labels'}. Looks good.`;
  $('bSave') && ($('bSave').disabled = !p.ok);
  $('bSaveNew') && ($('bSaveNew').disabled = !p.ok);
  return p;
}
function renderBuilder() {
  const box = $('progBuilder'), d = st.builder.draft;
  if (!box || !d) return;
  box.innerHTML = '';
  const isBuiltin = !!d.baseId;
  const title = isBuiltin ? `Edit the changes: ${d.name}` : d.id ? `Edit progression: ${d.name}` : 'New progression';
  const nameIn = el('input', { type: 'text', value: d.name, oninput: (e) => (d.name = e.target.value.slice(0, 60)) });
  const keySel = el('select', { onchange: (e) => (d.key = +e.target.value) }, NAMES.map((n, i) => el('option', { value: i }, n)));
  keySel.value = d.key;
  const minorSel = el('select', { onchange: (e) => (d.minor = e.target.value === '1') }, el('option', { value: '0' }, 'Major'), el('option', { value: '1' }, 'Minor'));
  minorSel.value = d.minor ? '1' : '0';
  const feelSel = el('select', { onchange: (e) => (d.feel = e.target.value) }, FEELS.map(([v, l]) => el('option', { value: v }, l)));
  feelSel.value = d.feel;
  const tempoIn = el('input', { type: 'number', min: 40, max: 300, step: 2, value: d.tempo, onchange: (e) => (d.tempo = Math.max(40, Math.min(300, +e.target.value || 120))) });
  box.append(
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:10px' }, el('h3', { style: 'margin:0' }, title),
      el('div', { class: 'actions' },
        el('button', { class: 'pbtn' + (st.builder.mode === 'grid' ? ' on' : ''), onclick: () => { st.builder.mode = 'grid'; renderBuilder(); } }, 'Grid'),
        el('button', { class: 'pbtn' + (st.builder.mode === 'text' ? ' on' : ''), onclick: () => { st.builder.mode = 'text'; renderBuilder(); } }, 'Text'))),
    isBuiltin
      ? el('p', { class: 'muted', style: 'font-size:13px' }, `Changes are written in ${keyLabel(tuneById(d.baseId), d.key)}; the Key menu still transposes them. Saving replaces this standard’s changes for you, and “Reset to original” brings the built-in version back.`)
      : el('div', { class: 'controls', style: 'margin:8px 0' },
        el('label', { class: 'field' }, 'Name', nameIn), el('label', { class: 'field' }, 'Written in', keySel), el('label', { class: 'field' }, 'Mode', minorSel),
        el('label', { class: 'field' }, 'Feel', feelSel), el('label', { class: 'field' }, 'Default tempo', tempoIn)));
  if (st.builder.mode === 'grid') {
    const grid = el('div', { class: 'bgrid' });
    d.cells.forEach((c, i) => {
      const chordIn = el('input', { type: 'text', value: c.text, class: 'bchord' + (cellValid(c.text) ? '' : ' bad'), placeholder: 'Dm7 G7', spellcheck: 'false',
        oninput: (e) => { c.text = e.target.value; e.target.classList.toggle('bad', !cellValid(c.text)); builderStatus(); },
        onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); const nx = grid.querySelectorAll('.bchord')[i + 1]; if (nx) nx.focus(); else { d.cells.push({ sec: '', text: c.text }); renderBuilder(); box.querySelectorAll('.bchord')[i + 1]?.focus(); } } } });
      const secIn = el('input', { type: 'text', value: c.sec, class: 'bsec', placeholder: '§', maxlength: 6, title: 'Section label (A, B, Bridge…)', oninput: (e) => { c.sec = e.target.value; builderStatus(); } });
      grid.append(el('div', { class: 'bcell' },
        el('div', { class: 'btop' }, secIn, el('span', { class: 'bn' }, i + 1),
          el('button', { class: 'bx', title: 'Insert a bar before this one', onclick: () => { d.cells.splice(i, 0, { sec: '', text: c.text }); renderBuilder(); } }, '+'),
          el('button', { class: 'bx', title: 'Delete this bar', onclick: () => { d.cells.splice(i, 1); renderBuilder(); } }, '✕')),
        chordIn));
    });
    box.append(grid, el('div', { class: 'actions', style: 'margin:8px 0' },
      el('button', { class: 'btn small', onclick: () => { d.cells.push({ sec: '', text: d.cells.length ? d.cells[d.cells.length - 1].text : 'Cmaj7' }); renderBuilder(); } }, '+ 1 bar'),
      el('button', { class: 'btn small', onclick: () => { for (let k = 0; k < 4; k++) d.cells.push({ sec: '', text: d.cells.length ? d.cells[d.cells.length - 1].text : 'Cmaj7' }); renderBuilder(); } }, '+ 4 bars'),
      d.cells.length >= 4 ? el('button', { class: 'btn small', onclick: () => { d.cells.push(...d.cells.slice(-4).map((c) => ({ sec: '', text: c.text }))); renderBuilder(); } }, 'Repeat last 4 bars') : null,
      d.cells.length >= 8 ? el('button', { class: 'btn small', onclick: () => { d.cells.push(...d.cells.slice(-8).map((c) => ({ sec: '', text: c.text }))); renderBuilder(); } }, 'Repeat last 8 bars') : null));
  } else {
    const ta = el('textarea', { spellcheck: 'false', style: 'min-height:120px;font-family:var(--mono);font-size:13px', oninput: (e) => { d.cells = textToCells(e.target.value); builderStatus(); } });
    ta.value = cellsToText(d.cells);
    box.append(ta);
  }
  box.append(
    el('p', { class: 'hint', style: 'margin:4px 0' }, 'One to four chords per bar (split evenly). Write chords the usual way: C, Cm, C6, Cm6, Cmaj7 (CΔ, C^7), Cm7 (C-7), C7, Cm7b5 (Cø), Cdim7 (C°7), C7sus4. Extensions such as C9, C13, C7♭9, Cmaj9 or Cm11 are played as the basic 7th chord. In text mode, separate bars with | and mark sections with [A].'),
    el('div', { id: 'bStatus' }),
    el('div', { class: 'actions', style: 'margin-top:10px' },
      el('button', { class: 'btn primary small', id: 'bSave', onclick: () => saveBuilder(false) }, isBuiltin ? 'Save changes to this standard' : d.id ? 'Save' : 'Save progression'),
      d.id || isBuiltin ? el('button', { class: 'btn small', id: 'bSaveNew', onclick: () => saveBuilder(true) }, 'Save as a new progression') : null,
      isBuiltin && (S.tuneEdits || {})[d.baseId] ? el('button', { class: 'btn small', onclick: () => {
        const e = { ...(S.tuneEdits || {}) }; delete e[d.baseId]; S.tuneEdits = e; invalidateTunes(); saveSettingsSoon(); toast('Restored the original changes'); openBuilder(d.baseId, st.builder.from); afterTunesChanged(); } }, 'Reset to original') : null,
      d.id ? el('button', { class: 'btn small danger', onclick: (e) => {
        const b = e.currentTarget;
        if (!b.dataset.arm) { b.dataset.arm = 1; b.textContent = 'Confirm delete'; return; }
        const c = { ...(S.customTunes || {}) }; delete c[d.id]; S.customTunes = c; invalidateTunes(); saveSettingsSoon();
        if (st.std.tune === d.id) st.std.tune = 'autumn'; if (st.prog.id === d.id) st.prog.id = '';
        closeBuilder(); afterTunesChanged(); toast('Progression deleted'); } }, 'Delete') : null,
      el('button', { class: 'btn small', onclick: closeBuilder }, 'Close')));
  builderStatus();
}
function saveBuilder(asNew) {
  const d = st.builder.draft;
  const p = parseBarsText(cellsToText(d.cells));
  if (!p.ok) { toast('Fix the highlighted bars first.'); return; }
  const text = cellsToText(d.cells);
  let id;
  if (d.baseId && !asNew) {
    S.tuneEdits = { ...(S.tuneEdits || {}), [d.baseId]: { bars: text } };
    id = d.baseId;
  } else {
    const base = d.baseId ? tuneById(d.baseId) : d;
    id = !asNew && d.id ? d.id : 'my-' + Date.now().toString(36);
    const name = asNew && (d.id || d.baseId) ? (d.name.replace(/ \(my version\)$/, '') + ' (my version)') : d.name.trim() || 'My progression';
    S.customTunes = { ...(S.customTunes || {}), [id]: { id, name, key: d.key ?? base.key, minor: !!(d.minor ?? base.minor), feel: d.feel || base.feel, tempo: d.tempo || base.tempo, bars: text,
      sections: p.sections } };
  }
  invalidateTunes(); saveSettingsSoon();
  if (st.builder.from === 'free') st.prog.id = id; else st.std.tune = id;
  toast('Saved');
  closeBuilder(); afterTunesChanged();
}
function afterTunesChanged() {
  const ex = exById(st.exId);
  if (ex.std) renderStdControls(); else if (ex.free) renderChordPad();
  drawIdleRoll(); renderTempoHint();
}

// Free sing: a progression played as a looping drone that changes chords at the tempo.
function progState() {
  if (!st.prog.id) return null;
  const tune = allTunes().find((t) => t.id === st.prog.id);
  if (!tune) return null;
  const tonic = st.prog.keys[tune.id] ?? tune.key;
  const tempo = st.prog.tempos[tune.id] || tune.tempo;
  return { tune, tonic, tempo, shift: (((tonic - tune.key) % 12) + 12) % 12, spb: 60 / tempo, nb: tune.parsed.length };
}
function progChordAt(ps, t) {
  const beat = Math.max(0, t / ps.spb), bi = Math.floor(beat / 4) % ps.nb, bar = ps.tune.parsed[bi];
  const ci = Math.min(bar.length - 1, Math.floor((beat % 4) / (4 / bar.length)));
  const c = bar[ci];
  return { key: Math.floor(beat / 4) + ':' + ci, pc: (c.pc + ps.shift) % 12, q: c.q, bar: bi };
}
function progTick(r, now) {
  if (!r.prog) return;
  const c = progChordAt(r.prog, now);
  if (c.key !== r.progKey) { r.progKey = c.key; setDrone(c.pc, c.q); }
}
function renderProgRow() {
  const ps = progState();
  const sel = el('select', { onchange: (e) => { st.prog.id = e.target.value; renderChordPad(); } },
    el('option', { value: '' }, 'None (play chords by hand)'),
    allTunes().some((t) => t.custom) ? el('optgroup', { label: 'My progressions' }, allTunes().filter((t) => t.custom).map((t) => el('option', { value: t.id }, t.name))) : null,
    el('optgroup', { label: 'Standards' }, allTunes().filter((t) => t.builtin).map((t) => el('option', { value: t.id }, t.name + (t.edited ? ' (edited)' : '')))));
  sel.value = st.prog.id;
  const row = el('div', { class: 'prow' }, el('span', { class: 'plabel' }, 'Progression'), sel);
  if (ps) {
    const ks = el('select', { onchange: (e) => { st.prog.keys[ps.tune.id] = +e.target.value; } }, [...Array(12)].map((_, k) => el('option', { value: k }, keyLabel(ps.tune, k))));
    ks.value = ps.tonic;
    const tin = el('input', { type: 'number', min: 40, max: 300, step: 2, value: ps.tempo, style: 'width:70px', onchange: (e) => { st.prog.tempos[ps.tune.id] = Math.max(40, Math.min(300, +e.target.value || ps.tune.tempo)); } });
    row.append(ks, el('span', { class: 'muted', style: 'font-size:12px' }, 'bpm'), tin,
      el('button', { class: 'pbtn', onclick: () => openBuilder(ps.tune.id, 'free') }, '✎ Edit'));
  }
  row.append(el('button', { class: 'pbtn ghost', onclick: () => openBuilder(null, 'free') }, '+ New progression'));
  return row;
}
