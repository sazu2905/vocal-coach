// ---------- suggestions (shared by Progress hover and Over time) ----------
const EXT_FNS = ['9', '11', '13', '♯11', '♭9', '♭13'];
// preset fields: ex, tempo, dir, reps, guide, start ('low'|'high'), drone [key, q]
const SUGG = {
  'fn:♭3:flat': { h: 'Minor 3rds are running flat', items: [
    { ex: 'm7arp', tempo: 72, dir: 'updown', guide: 'off', t: 'Sing it slower with the melody guide off. Before each ♭3, hear it for a beat in your head, and think of it as reaching up from the root rather than settling down from the 5th. A slightly brighter vowel (“eh” rather than “uh”) helps keep it from sagging.' },
    { ex: 'free', drone: [2, 'm7'], t: 'Over a Dm7 drone, alternate D–F–D on “oo,” holding the F (the ♭3) straight for four slow beats. Stay within ±10¢ on the live readout before adding any vibrato.' },
    { ex: 'guide', tempo: 84, guide: 'off', t: 'The first held note of line one is the ♭3 of the ii chord. Lock it in before the chord changes underneath it.' },
    { ex: 'blues', tempo: 96, t: 'Slow the run down and land the ♭3 straight. Once it’s centered, add the bend on purpose.' }] },
  'fn:♭3:sharp': { h: 'Minor 3rds are drifting sharp', items: [
    { ex: 'm7arp', tempo: 72, dir: 'updown', guide: 'off', t: 'Keep the ♭3 from leaning toward the major 3rd. Hear it as three half steps up from the root, and keep the vowel a touch darker.' },
    { ex: 'free', drone: [2, 'm7'], t: 'Over a Dm7 drone, slide slowly from D up to F and stop the moment it locks with the drone. Notice how much lower that is than where you’ve been landing.' },
    { ex: 'blues', tempo: 96, t: 'If the in-between “blue” 3rd is intentional, tag those notes 👍 in Review so Woodshed treats it as a choice. Otherwise land it straight.' }] },
  'fn:3:sharp': { h: 'Major 3rds are running sharp', items: [
    { ex: 'maj7arp', tempo: 76, guide: 'off', t: 'Piano 3rds are already about 14¢ wider than acoustically pure ones, and you’re landing above even that. Aim a hair lower and a little darker than feels “sweet.”' },
    { ex: 'ext', tempo: 60, guide: 'off', t: 'The 3rd is the second held note. Sing it straight and listen for the beating against the chord to slow down and stop.' },
    { ex: 'free', drone: [5, 'maj'], t: 'Over an F major drone, sing F–A–F slowly on “oh,” holding the A until it settles into the chord.' }] },
  'fn:3:flat': { h: 'Major 3rds are running flat', items: [
    { ex: 'maj7arp', tempo: 76, guide: 'off', t: 'A flat major 3rd sounds bluesy against a major chord. Brighten the vowel slightly on the 3rd and hear it as the bright, sunny tone of the chord.' },
    { ex: 'five', tempo: 88, t: 'The 3rd is passed through twice per repetition. Keep the air moving through it instead of relaxing as you come down.' },
    { ex: 'free', drone: [5, 'maj'], t: 'Over an F major drone, sing F–A–F slowly, holding the A straight.' }] },
  'fn:7:flat': { h: 'Major 7ths are sagging', items: [
    { ex: 'maj7arp', tempo: 76, guide: 'off', t: 'Hear the major 7th as a leading tone pulling up to the octave: a half step below the root, not a whole step above the 6th.' },
    { ex: 'guide', tempo: 84, guide: 'off', t: 'Line two ends on the 7th of the I chord. Hold it bright and steady while the piano sits under it.' },
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Tune the 7th straight against the sustained chord before moving on to the 9th.' }] },
  'fn:7:sharp': { h: 'Major 7ths are pushing sharp', items: [
    { ex: 'maj7arp', tempo: 76, guide: 'off', t: 'You’re leaning up toward the root. Let the 7th sit a clean half step below it, without reaching.' },
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Sing the 7th straight and lighter. Pushing volume tends to push pitch up too.' }] },
  'fn:♭7:flat': { h: 'Dominant 7ths (♭7) are flat', items: [
    { ex: 'guide', tempo: 84, guide: 'off', t: 'In line one, the held F becomes the ♭7 of G7 when the chord changes. Keep it up as the harmony shifts under it.' },
    { ex: 'free', drone: [7, '7'], t: 'Over a G7 drone, sing G–F–G slowly. The F is a whole step below the root, so tune it from the top down.' },
    { ex: 'blues', tempo: 100, t: 'The ♭7 is the second note of the run. Slow it down and make sure that note lands before the run moves on.' }] },
  'fn:♭7:sharp': { h: 'Dominant 7ths (♭7) are sharp', items: [
    { ex: 'free', drone: [7, '7'], t: 'Over a G7 drone, sing G–F–G slowly. Keep the F a full whole step below G; sharp, it starts to sound like a major 7th.' },
    { ex: 'guide', tempo: 84, guide: 'off', t: 'In line one, keep the held F from creeping up when the G7 arrives.' }] },
  'fn:5': { h: 'Fifths are off-center', items: [
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Fifths lock audibly. Hold the 5th straight and listen for the beating against the chord to disappear completely.' },
    { ex: 'maj7arp', tempo: 76, guide: 'off', t: 'The 5th is the middle of the arpeggio. Pause on it mentally and check it against the bass.' },
    { ex: 'free', drone: [5, 'maj'], t: 'Over an F major drone, sing F–C–F slowly and hold the C until it fuses with the drone.' }] },
  'fn:R': { h: 'Roots are off-center', items: [
    { ex: 'five', tempo: 84, t: 'Each repetition starts and ends on the root. Match the bass note exactly before you move.' },
    { ex: 'free', drone: [5, 'maj'], t: 'Over an F major drone, hum F until it disappears into the drone, then open to “oh” without the pitch moving.' }] },
  'fn:ext': { h: 'Extensions (9ths, 11ths, 13ths) are off-center', items: [
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Slow the drill down and sing each extension straight. The 9th and 13th will feel suspended, so tune them to the chord, not to the note before.' },
    { ex: 'm7arp', tempo: 76, guide: 'off', t: 'The 9th is the top of the arpeggio. Let it float rather than reaching for it.' },
    { ex: 'free', drone: [5, 'maj7'], t: 'Over an Fmaj7 drone, sing F–G–F (root–9th–root) and F–D–F (root–13th), holding each extension four beats.' }] },
  'fn:chrom': { h: 'Chromatic tones (♯11, ♭9, ♭13) are off-center', items: [
    { ex: 'enclose', tempo: 100, t: 'Slow the enclosures down. The chromatic approach note is short and the target is long; land the target before you think about the next one.' },
    { ex: 'blues', tempo: 96, t: 'The ♯11 is the passing blue note. Make it quick, but let it pass through its real pitch rather than smearing.' },
    { ex: 'free', drone: [7, '7'], t: 'Over a G7 drone, try G–A♭–G (♭9) and G–E♭–G (♭13) slowly to hear where those tensions really sit.' }] },
  'reg:high:flat': { h: 'Upper notes are running flat', items: [
    { ex: 'maj7arp', tempo: 80, dir: 'updown', t: 'Going up, open the vowel slightly toward “uh” or “aw” and keep the breath moving instead of pushing louder.' },
    { ex: 'glide', t: 'Lip-trill glides into the top of your range first. Trills balance the air, so the top notes stop feeling like a reach.' },
    { ex: 'five', tempo: 88, start: 'high', dir: 'down', t: 'Start at the top of the range and work down, so the high notes come while your voice is fresh.' }] },
  'reg:high:sharp': { h: 'Upper notes are running sharp', items: [
    { ex: 'maj7arp', tempo: 80, dir: 'updown', t: 'Sing the top lighter. Extra effort near the top often drives the pitch up.' },
    { ex: 'five', tempo: 88, start: 'high', dir: 'down', t: 'Start high and descend softly, keeping the top notes gentle.' }] },
  'reg:low': { h: 'Low notes are less centered', items: [
    { ex: 'five', tempo: 84, start: 'high', dir: 'down', t: 'Work downward into the low range with speech-like weight. Voices often lose definition down there when they add “chest.”' },
    { ex: 'lowbloom', t: 'Start each low note on a hum and open to “oh.” The hum keeps the pitch focused as the vowel opens.' },
    { ex: 'free', drone: [4, 'maj'], t: 'Over an E major drone, hum E3 and then open to a vowel without the pitch moving.' }] },
  'reg:mid': { h: 'Middle-range notes are off-center', items: [
    { ex: 'five', tempo: 84, t: 'Go slower and give each note a full beat to lock before moving.' },
    { ex: 'maj7arp', tempo: 76, guide: 'all', t: 'Turn the melody guide on for every repetition for a few days, then switch it back to off.' }] },
  'scoop': { h: 'Lots of notes start with a scoop', items: [
    { ex: 'five', tempo: 84, t: 'Sing on “noo” and pre-hear each note before you breathe. Start the sound right on the pitch with no slide into it.' },
    { ex: 'maj7arp', tempo: 80, t: 'Sing it detached on “dit” so every note starts fresh and in place. Then go back to legato.' },
    { ex: 'enclose', tempo: 100, t: 'Enclosures train aim: approach notes are fine, but the target should land with no slide.' }] },
  'settle': { h: 'Notes take a while to settle', items: [
    { ex: 'five', tempo: 84, t: 'Hear the pitch first, then start the sound. A tiny silent beat of audiation before each repetition helps.' },
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Long, straight notes against a chord show exactly how long you take to land. Aim to be centered within the first syllable.' }] },
  'vib:none': { h: 'Long notes rarely have vibrato', items: [
    { ex: 'lowbloom', t: 'Hum, open to “oh,” and let vibrato appear on its own after a beat or two. Lighter weight is the key in the low range.' },
    { ex: 'pulse', reps: 3, t: 'Gently pulse at 4, 5 and 6 per second to feel the motion, then let it go free on the last note.' },
    { ex: 'messa', t: 'Start straight and let vibrato bloom around beat 3.' }] },
  'vib:fast': { h: 'Vibrato is fast', items: [
    { ex: 'pulse', reps: 3, t: 'Spend most of your time on the 4 and 5 per second notes, and let each pulse take its full time. Fast vibrato often comes from throat tension.' },
    { ex: 'messa', t: 'Start straight, then let the vibrato come in slowly and loosely.' },
    { ex: 'switch', tempo: 60, t: 'Switching between straight and vibrato at a slower tempo builds control over the rate.' }] },
  'vib:slow': { h: 'Vibrato is slow or wide', items: [
    { ex: 'pulse', reps: 3, t: 'Focus on the 6 per second note with smaller pulses. A slow, wide vibrato usually means too much weight.' },
    { ex: 'lowbloom', t: 'Sing lighter; less weight usually tightens and evens out the vibrato.' }] },
  'goals': { h: 'Vibrato targets are often missed', items: [
    { ex: 'pulse', tempo: 60, reps: 3, t: 'At first, make the pulses even and a bit bigger, about a quarter tone. The detector needs a steady wave of at least ±10¢. Narrow them once the rate is consistent.' },
    { ex: 'switch', tempo: 60, t: 'At 60 bpm the two-beat sections are longer, which gives the vibrato time to start and stop clearly.' }] },
  'lean:flat': { h: 'Overall you lean flat', items: [
    { ex: 'glide', t: 'Warm up with lip trills; flatness often comes from air energy dropping off.' },
    { ex: 'five', tempo: 88, t: 'Keep the air moving through the end of every note, and think the vowel a shade brighter.' },
    { ex: 'free', drone: [5, 'maj'], t: 'Sing your song phrases over a drone in the song’s key and watch the live readout.' }] },
  'lean:sharp': { h: 'Overall you lean sharp', items: [
    { ex: 'five', tempo: 88, t: 'Sing a notch softer and think of arriving at each pitch from above.' },
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Straight tones against a chord reveal pushing. Back off the volume until the beating stops.' }] },
  'accuracy': { h: 'Overall pitch accuracy', items: [
    { ex: 'maj7arp', tempo: 76, guide: 'all', t: 'Slow down and turn the melody guide on for every repetition for a few days, then take it away again.' },
    { ex: 'five', tempo: 84, t: 'Simple steps at a slower tempo let you lock each note before you move on.' }] },
  'free': { h: 'Song takes are less centered than exercises', items: [
    { ex: 'free', drone: [7, 'maj'], t: 'Sing the tune over a drone in its key, using the chord pad to follow the changes. Intonation habits show up most against harmony.' },
    { ex: 'ext', tempo: 60, guide: 'off', t: 'Extensions are the tones melodies love to sit on, and they’re the hardest to tune.' }] },
};
function suggestionKey(kind, key, value) {
  if (kind === 'fn') {
    if (['♭5', '°7'].includes(key)) return 'fn:chrom';
    if (EXT_FNS.includes(key)) return key === '♯11' || key === '♭9' || key === '♭13' ? 'fn:chrom' : 'fn:ext';
    if (key === '5' || key === 'R') return 'fn:' + key;
    return `fn:${key}:${value < 0 ? 'flat' : 'sharp'}`;
  }
  if (kind === 'reg') return key === 'high' ? `reg:high:${value < 0 ? 'flat' : 'sharp'}` : 'reg:' + key;
  return key;
}
function presetLabel(it) {
  const ex = exById(it.ex), bits = [];
  if (it.tune) bits.push(tuneById(it.tune).name);
  if (it.tempo) bits.push(it.tempo + ' bpm');
  if (it.dir) bits.push({ up: 'going up', down: 'going down', updown: 'up & back' }[it.dir]);
  if (it.start) bits.push(it.start === 'high' ? 'start high' : 'start low');
  if (it.reps) bits.push(it.reps + ' reps');
  if (it.guide) bits.push({ off: 'guide off', first: 'guide 1st rep', all: 'guide every rep' }[it.guide]);
  if (it.drone) bits.push(pcName(it.drone[0]) + QUAL[it.drone[1]].sym + ' drone');
  return { name: ex.name, bits: bits.join(' · ') };
}
function applyPreset(it) {
  const ex = exById(it.ex);
  if (it.guide && S.guide !== it.guide) { S.guide = it.guide; saveSettingsSoon(); renderSettings(); }
  if (it.dir) st.dir = it.dir;
  if (it.reps) st.reps = it.reps;
  if (it.tune) { st.std.tune = it.tune; if (it.tempo) st.std.tempos[it.tune] = it.tempo; }
  else if (it.tempo) st.tempos[ex.id] = it.tempo;
  if (it.drone) { st.droneKey = it.drone[0]; st.droneQ = it.drone[1]; }
  if (!ex.free) {
    const [a, b] = rootRange(ex);
    st.starts[ex.id] = it.start === 'high' || (!it.start && st.dir === 'down') ? b : a;
  }
  Tip.hide(true);
  selectExercise(ex.id);
  showTab('practice');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const l = presetLabel(it);
  toast(`Loaded ${l.name}${l.bits ? ' · ' + l.bits : ''}`);
}
function tipContent(title, sub, sugKey, onTrack) {
  const sg = sugKey && typeof sugKey === 'object' ? sugKey : SUGG[sugKey];
  const box = el('div');
  box.append(el('h4', {}, title), sub ? el('div', { class: 'sub' }, sub) : null);
  if (!sg) return box;
  const items = onTrack ? sg.items.slice(0, 1) : sg.items;
  box.append(el('div', { class: 'sub', style: 'margin:6px 0 2px' }, onTrack ? 'On track. To keep it there:' : (sg.h + '. Do more of:')));
  for (const it of items) {
    const l = presetLabel(it);
    box.append(el('div', { class: 'si' },
      el('div', { class: 'sitop' }, el('div', {}, el('b', {}, l.name), l.bits ? el('div', { class: 'tw' }, l.bits) : null),
        el('button', { class: 'btn small', onclick: () => applyPreset(it) }, 'Load')),
      el('p', {}, it.t)));
  }
  return box;
}

// ---------- tooltip ----------
const Tip = {
  timer: null, pinned: false, owner: null,
  show(anchor, content, { x, y, pin = false } = {}) {
    const t = $('tip');
    clearTimeout(this.timer);
    if (this.pinned && !pin && this.owner !== anchor) return;
    this.owner = anchor; this.pinned = pin;
    t.innerHTML = '';
    if (pin) t.append(el('button', { class: 'x', onclick: () => this.hide(true) }, '✕'));
    t.append(content); t.hidden = false;
    const r = anchor.getBoundingClientRect();
    const W = t.offsetWidth, H = t.offsetHeight;
    let left, top;
    if (x != null) {
      left = x + 14; top = y + 14;
      if (left + W > innerWidth - 8) left = Math.max(8, x - 14 - W);
      if (top + H > innerHeight - 8) top = Math.max(8, y - 14 - H);
    } else {
      // beside the anchor so it never covers the rows below it
      top = Math.min(Math.max(8, r.top - 10), innerHeight - H - 8);
      if (r.right + 10 + W <= innerWidth - 8) left = r.right + 10;
      else if (r.left - 10 - W >= 8) left = r.left - 10 - W;
      else { left = Math.max(8, Math.min(r.left, innerWidth - W - 8)); top = r.bottom + 6 + H > innerHeight ? Math.max(8, r.top - 6 - H) : r.bottom + 6; }
    }
    t.style.left = left + 'px'; t.style.top = top + 'px';
  },
  hideSoon() { if (this.pinned) return; clearTimeout(this.timer); this.timer = setTimeout(() => this.hide(), 260); },
  hide(force) { if (this.pinned && !force) return; clearTimeout(this.timer); $('tip').hidden = true; this.pinned = false; this.owner = null; },
};
function bindTip() {
  const t = $('tip');
  t.addEventListener('mouseenter', () => clearTimeout(Tip.timer));
  t.addEventListener('mouseleave', () => Tip.hideSoon());
  document.addEventListener('click', (e) => { if (Tip.pinned && !t.contains(e.target) && !(Tip.owner && Tip.owner.contains(e.target))) Tip.hide(true); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') Tip.hide(true); });
}
function hoverTip(elm, build) {
  elm.classList.add('hoverable');
  elm.addEventListener('mouseenter', () => Tip.show(elm, build()));
  elm.addEventListener('mouseleave', () => Tip.hideSoon());
  elm.addEventListener('click', (e) => { e.stopPropagation(); Tip.show(elm, build(), { pin: true }); });
}

// Attach hover suggestions to the Progress tab (layout unchanged).
function decorateProgress() {
  document.querySelectorAll('#tendFn tbody tr').forEach((tr) => {
    const fn = tr.firstChild.textContent, signed = parseFloat(tr.children[2].textContent.replace('−', '-').replace('±', ''));
    const n = tr.children[1].textContent;
    hoverTip(tr, () => tipContent(`${fn}: average ${fmtC(signed)}`, `${n} notes in your recent exercise takes`, suggestionKey('fn', fn, signed), Math.abs(signed) < 12));
  });
  document.querySelectorAll('#tendRegion tbody tr').forEach((tr) => {
    const lbl = tr.firstChild.textContent, key = lbl.startsWith('Low') ? 'low' : lbl.startsWith('High') ? 'high' : 'mid';
    const signed = parseFloat(tr.children[2].textContent.replace('−', '-').replace('±', '')), abs = parseFloat(tr.children[4].textContent);
    hoverTip(tr, () => tipContent(`${lbl}: average ${fmtC(signed)}, ${abs}¢ off on average`, null, suggestionKey('reg', key, signed), Math.abs(signed) < 12 && abs < 18));
  });
  document.querySelectorAll('#tendOther li').forEach((li) => {
    const txt = li.textContent;
    let key = null, ok = false;
    if (txt.startsWith('Scoops')) { key = 'scoop'; ok = parseFloat(txt.match(/([\d.]+)%/)?.[1] || 0) < 20; }
    else if (txt.startsWith('Vibrato')) { const r = parseFloat(txt.match(/([\d.]+) Hz/)?.[1] || 5.5); key = r > 7.2 ? 'vib:fast' : r < 4.6 ? 'vib:slow' : 'vib:none'; ok = r <= 7.2 && r >= 4.6; }
    else if (txt.startsWith('Median pitch error')) { key = 'accuracy'; ok = true; }
    if (key) hoverTip(li, () => tipContent(txt, null, key, ok));
  });
}

// ---------- over time ----------
const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const keyDate = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const weekKey = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dayKey(d.getTime()); };
const fmtDay = (k) => keyDate(k).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const okNotes = (t) => t.notes.filter((n) => !n.missed);
const METRICS = [
  { id: 'medAbs', label: 'Median pitch error (exercises)', unit: '¢', better: 'low', src: 'ex', min: 5, warn: 15,
    value: (ns) => DSP.median(ns.map((n) => Math.abs(n.cents))), sug: () => 'accuracy', desc: 'Typical distance from the target pitch across all exercise notes. Lower is better.' },
  { id: 'inTune', label: 'Notes within ±20¢ (exercises)', unit: '%', better: 'high', src: 'ex', min: 5, warn: 70,
    value: (ns) => (100 * ns.filter((n) => Math.abs(n.cents) <= 20).length) / ns.length, sug: () => 'accuracy', desc: 'Share of exercise notes that landed within ±20¢ of the target. Higher is better.' },
  { id: 'lean', label: 'Overall lean (exercises)', unit: '¢', better: 'zero', src: 'ex', min: 5, warn: 8,
    value: (ns) => DSP.mean(ns.map((n) => n.cents)), sug: (v) => (v < 0 ? 'lean:flat' : 'lean:sharp'), desc: 'Average signed error. Below zero is flat, above is sharp; the shaded band is ±10¢.' },
  ...FN_ORDER.map((f) => ({ id: 'fn:' + f, label: `${f} lean (any singing over a chord)`, unit: '¢', better: 'zero', src: 'all', min: 3, warn: 12, filter: (n) => n.fn === f,
    value: (ns) => DSP.mean(ns.map((n) => n.cents)), sug: (v) => suggestionKey('fn', f, v), desc: `Average signed error on notes that were the ${f} of the chord sounding at the time (exercises, plus free singing over a drone). Zero is perfectly centered.` })),
  ...[['low', 'Low range'], ['mid', 'Middle range'], ['high', 'High range']].map(([k, l]) => ({ id: 'reg:' + k, label: `${l} lean (exercises)`, unit: '¢', better: 'zero', src: 'ex', min: 4, warn: 12,
    filter: (n) => regionOf(n.target) === k, value: (ns) => DSP.mean(ns.map((n) => n.cents)), sug: (v) => suggestionKey('reg', k, v), desc: `Average signed error on exercise notes in your ${l.toLowerCase()}.` })),
  { id: 'scoop', label: 'Notes starting with a scoop', unit: '%', better: 'low', src: 'ex', min: 8, warn: 20,
    value: (ns) => (100 * ns.filter((n) => n.onset === 'scoop').length) / ns.length, sug: () => 'scoop', desc: 'Share of exercise notes that slid up into pitch. Lower means cleaner onsets.' },
  { id: 'settle', label: 'Median settle time', unit: ' ms', better: 'low', src: 'ex', min: 8, warn: 120,
    value: (ns) => DSP.median(ns.map((n) => n.settleMs)), sug: () => 'settle', desc: 'How long notes take to reach a steady pitch. Lower is better.' },
  { id: 'vibPct', label: 'Long notes with vibrato', unit: '%', better: 'high', src: 'all', min: 3, warn: 40, filter: (n) => n.dur >= 1.2 && !n.goal,
    value: (ns) => (100 * ns.filter((n) => n.vib).length) / ns.length, sug: () => 'vib:none', desc: 'Share of notes longer than 1.2s (outside the vibrato drills) where vibrato showed up.' },
  { id: 'vibRate', label: 'Vibrato rate', unit: ' Hz', better: 'target', target: 5.5, src: 'all', min: 2, warn: 1.2, filter: (n) => !!n.vib,
    value: (ns) => DSP.mean(ns.map((n) => n.vib.rate)), sug: (v) => (v > 5.5 ? 'vib:fast' : 'vib:slow'), desc: 'Average vibrato speed. Around 5–6 Hz is typical; the shaded band is 4.6–6.8 Hz.' },
  { id: 'vibExt', label: 'Vibrato width', unit: '¢', better: null, src: 'all', min: 2, filter: (n) => !!n.vib,
    value: (ns) => DSP.mean(ns.map((n) => n.vib.extent)), sug: () => null, desc: 'Average vibrato width (± cents). Jazz singers often keep it fairly narrow; there’s no single right value.' },
  { id: 'goals', label: 'Vibrato drill targets met', unit: '%', better: 'high', src: 'all', min: 3, warn: 60, filter: (n) => !!n.goal,
    value: (ns) => (100 * ns.filter(goalHit).length) / ns.length, sug: () => 'goals', desc: 'Share of notes in the vibrato drills that hit their goal (pulse rate, straight, vibrato or late bloom).' },
  { id: 'free', label: 'Song takes: median error vs nearest note', unit: '¢', better: 'low', src: 'free', min: 5, warn: 18,
    value: (ns) => DSP.median(ns.map((n) => Math.abs(n.cents))), sug: () => 'free', desc: 'Typical distance from the nearest equal-tempered pitch in free singing. Bends count as errors here, so expect it to run higher than exercises.' },
];
function tempoMetrics() {
  const keys = [...new Set(ownTakes().filter(tracksTempo).map(tempoKey))];
  return keys.map((key) => ({ id: 'tempo:' + key, label: `${tempoName(key)}: fastest clean tempo`, unit: ' bpm', better: 'high', src: 'takes', min: 1, warn: null, tempoKey: key,
    sug: () => tempoSugg(key), desc: `Each small dot is one take at the tempo you sang it: filled means clean, hollow means not clean yet. The line follows the fastest clean tempo per day; the dotted line is the exercise’s default tempo. ${CLEAN_TEXT}` }));
}
const allMetrics = () => [...METRICS, ...tempoMetrics()];
const metricById = (id) => allMetrics().find((m) => m.id === id) || METRICS[0];
function regionOf(m) { return m < S.low + 5 ? 'low' : m >= topLimit() - 3 ? 'high' : 'mid'; }
function badness(m, v) {
  if (v == null || isNaN(v)) return null;
  if (m.better === 'low') return v;
  if (m.better === 'high') return -v;
  if (m.better === 'zero') return Math.abs(v);
  if (m.better === 'target') return Math.abs(v - m.target);
  return null;
}
function isProblem(m, v) {
  if (v == null || m.warn == null) return false;
  if (m.better === 'low') return v >= m.warn;
  if (m.better === 'high') return v < m.warn;
  if (m.better === 'zero') return Math.abs(v) >= m.warn;
  if (m.better === 'target') return Math.abs(v - m.target) >= m.warn;
  return false;
}
function notesFor(m, takes, excludeEx) {
  const out = [];
  for (const t of takes) {
    if (excludeEx && t.exId === excludeEx) continue;
    if (m.src === 'ex' && t.free) continue;
    if (m.src === 'free' && !t.free) continue;
    for (const n of okNotes(t)) if (!m.filter || m.filter(n)) out.push(n);
  }
  return out;
}
function measure(m, takes, excludeEx) {
  if (m.tempoKey) {
    const ts = takes.filter((t) => t.tempo && tempoKey(t) === m.tempoKey && (!excludeEx || t.exId !== excludeEx));
    const clean = ts.filter(isClean);
    return { v: clean.length ? Math.max(...clean.map((t) => t.tempo)) : null, n: ts.length, tried: ts.length ? Math.max(...ts.map((t) => t.tempo)) : null, tries: ts };
  }
  const ns = notesFor(m, takes, excludeEx);
  return ns.length >= m.min ? { v: m.value(ns), n: ns.length } : { v: null, n: ns.length };
}
function trendTakes(rangeDays = 0) {
  let t = ownTakes().slice().sort((a, b) => a.ts - b.ts);
  if (rangeDays) { const cut = Date.now() - rangeDays * 864e5; t = t.filter((x) => x.ts >= cut); }
  return t;
}
function series(m, takes, grain, excludeEx) {
  const groups = new Map();
  for (const t of takes) { const k = grain === 'week' ? weekKey(t.ts) : dayKey(t.ts); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(t); }
  return [...groups.entries()].map(([k, ts]) => ({ key: k, date: keyDate(k), takes: ts, ...measure(m, ts, excludeEx) }));
}
const fmtV = (m, v) => (v == null ? '—' : m.unit === '¢' && m.better === 'zero' ? fmtC(v) : m.unit === ' Hz' ? v.toFixed(2) + ' Hz' : Math.round(v) + m.unit);

// Effect estimates: does doing exercise e coincide with the metric improving?
function helpEstimates(m, takes) {
  if (m.better == null) return [];
  const days = series(m, takes, 'day');
  const exIds = [...new Set(takes.map((t) => t.exId))];
  const res = [];
  for (const e of exIds) {
    const ser = series(m, takes, 'day', e).filter((d) => d.v != null);
    const did = (key) => takes.some((t) => t.exId === e && dayKey(t.ts) === key);
    const withD = [], without = [];
    for (let i = 0; i + 1 < ser.length; i++) {
      const gap = (ser[i + 1].date - ser[i].date) / 864e5;
      if (gap > 4) continue;
      const delta = badness(m, ser[i].v) - badness(m, ser[i + 1].v);
      (did(ser[i].key) ? withD : without).push(delta);
    }
    // same session: other notes before vs after the first take of e that day
    const same = [];
    const byDay = new Map();
    for (const t of takes) { const k = dayKey(t.ts); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(t); }
    for (const [, ts] of byDay) {
      const first = ts.find((t) => t.exId === e); if (!first) continue;
      const before = measure(m, ts.filter((t) => t.ts < first.ts), e), after = measure(m, ts.filter((t) => t.ts > first.ts), e);
      if (before.v != null && after.v != null) same.push(badness(m, before.v) - badness(m, after.v));
    }
    const next = withD.length ? DSP.mean(withD) - (without.length ? DSP.mean(without) : 0) : null;
    const sameEff = same.length ? DSP.mean(same) : null;
    const obs = withD.length + same.length;
    if (!obs) { res.push({ e, obs: 0, practiced: new Set(takes.filter((t) => t.exId === e).map((t) => dayKey(t.ts))).size }); continue; }
    const parts = [next, sameEff].filter((x) => x != null);
    res.push({ e, next, nNext: withD.length, nWithout: without.length, same: sameEff, nSame: same.length, score: DSP.mean(parts), obs,
      practiced: new Set(takes.filter((t) => t.exId === e).map((t) => dayKey(t.ts))).size });
  }
  void days;
  return res.sort((a, b) => (b.obs ? 1 : 0) - (a.obs ? 1 : 0) || (b.score ?? -1e9) - (a.score ?? -1e9));
}
const effThr = (m) => (m.unit === '%' ? 3 : m.unit === ' ms' ? 10 : m.unit === ' Hz' ? 0.15 : 2);
const confidence = (obs) => (obs >= 10 ? 'fairly consistent' : obs >= 5 ? 'some evidence' : obs >= 2 ? 'early hint' : 'one data point');

function autoFocus(takes) {
  const out = [];
  for (const m of METRICS) {
    if (m.better == null) continue;
    const r = measure(m, takes.slice(-30));
    if (r.v != null && isProblem(m, r.v)) out.push({ id: m.id, sev: badness(m, r.v) / (m.warn || 1) });
  }
  return out.sort((a, b) => b.sev - a.sev).slice(0, 4).map((x) => x.id);
}
const tr = { metric: null, grain: 'day', range: 0, table: false };

function sparkline(points, m) {
  const W = 200, H = 40, pad = 4;
  const vs = points.filter((p) => p.v != null);
  if (vs.length < 2) return el('div', { class: 'muted', style: 'font-size:11.5px;margin-top:6px' }, vs.length ? 'One day of data so far' : 'Not enough notes per day to chart yet');
  const t0 = vs[0].date.getTime(), t1 = vs[vs.length - 1].date.getTime() || t0 + 1;
  let lo = Math.min(...vs.map((p) => p.v)), hi = Math.max(...vs.map((p) => p.v));
  if (m.better === 'zero') { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  if (hi - lo < 1e-6) { hi += 1; lo -= 1; }
  const x = (d) => pad + ((d.getTime() - t0) / (t1 - t0 || 1)) * (W - 2 * pad), y = (v) => pad + ((hi - v) / (hi - lo)) * (H - 2 * pad);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', '100%'); svg.setAttribute('height', H);
  if (m.better === 'zero') { const z = document.createElementNS(ns, 'line'); Object.entries({ x1: 0, x2: W, y1: y(0), y2: y(0), stroke: 'rgba(255,255,255,.15)', 'stroke-dasharray': '3 3' }).forEach(([k, v]) => z.setAttribute(k, v)); svg.append(z); }
  const pl = document.createElementNS(ns, 'polyline');
  pl.setAttribute('points', vs.map((p) => `${x(p.date)},${y(p.v)}`).join(' '));
  Object.entries({ fill: 'none', stroke: '#bf8735', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }).forEach(([k, v]) => pl.setAttribute(k, v));
  svg.append(pl);
  const last = vs[vs.length - 1], c = document.createElementNS(ns, 'circle');
  Object.entries({ cx: x(last.date), cy: y(last.v), r: 3.5, fill: '#bf8735', stroke: '#1b2436', 'stroke-width': 2 }).forEach(([k, v]) => c.setAttribute(k, v));
  svg.append(c);
  return svg;
}
function windowValue(m, takes, fromTs, toTs) { return measure(m, takes.filter((t) => t.ts >= fromTs && t.ts < toTs)); }

function renderFocus(takes) {
  const box = $('focusGrid'); box.innerHTML = '';
  if (!takes.length) { box.append(el('p', { class: 'muted' }, 'Practice for a few days and your focus areas will appear here.')); return; }
  let ids = (S.focus && S.focus.length ? S.focus : autoFocus(takes)).filter((id) => allMetrics().some((m) => m.id === id));
  if (!ids.length) ids = ['medAbs', 'inTune'];
  const firstTs = takes[0].ts, lastTs = takes[takes.length - 1].ts;
  for (const id of ids) {
    const m = metricById(id);
    const recent = windowValue(m, takes, lastTs - 7 * 864e5, lastTs + 1);
    const early = windowValue(m, takes, firstTs, firstTs + 7 * 864e5);
    const span = (lastTs - firstTs) / 864e5;
    let delta = null, word = '', cls_ = '';
    if (span >= 8 && recent.v != null && early.v != null && m.better) {
      const d = badness(m, early.v) - badness(m, recent.v);
      const thr = m.unit === '%' ? 5 : m.unit === ' ms' ? 15 : m.unit === ' Hz' ? 0.2 : 3;
      delta = d; word = d > thr ? 'improving' : d < -thr ? 'slipping' : 'holding steady'; cls_ = d > thr ? 'status-good' : d < -thr ? 'status-bad' : 'muted';
    }
    const card = el('button', { class: 'fcard' + (tr.metric === id ? ' on' : ''), onclick: () => { tr.metric = id; renderTrends(); } },
      el('div', { class: 'k' }, m.label),
      el('div', { class: 'v ' + (isProblem(m, recent.v) ? 'status-warn' : '') }, fmtV(m, recent.v)),
      el('div', { class: 'd ' + cls_ }, delta != null ? `${word}: was ${fmtV(m, early.v)} in week one` : span < 8 ? 'Trend appears after a week of practice' : `${recent.n} notes recently`),
      sparkline(series(m, takes, 'day'), m));
    const sk = m.sug(recent.v);
    if (sk) hoverTip(card, () => tipContent(m.label + ': ' + fmtV(m, recent.v), `Last 7 days, ${recent.n} notes`, sk, !isProblem(m, recent.v)));
    box.append(card);
  }
}
function renderChart(m, takes) {
  const wrap = $('trChart'); wrap.innerHTML = '';
  const allP = series(m, takes, tr.grain);
  const pts = allP.filter((p) => p.v != null);
  const tried = m.tempoKey ? allP.filter((p) => p.tried != null) : [];
  const hov = m.tempoKey ? tried : pts;
  $('trDesc').textContent = m.desc + (m.tempoKey ? '' : (tr.grain === 'week' ? ' Each point is one week (Monday start).' : ' Each point is one day.') + ' Bigger dots mean more notes measured.');
  if (!hov.length) { wrap.append(el('div', { class: 'empty muted' }, 'No measurements for this yet. Sing exercises that include it and it’ll show up here.')); $('trTable').innerHTML = ''; return; }
  const W = Math.max(320, wrap.clientWidth || 900), H = 280, pl = 56, pr = 16, pt = 16, pb = 34;
  const t0 = hov[0].date.getTime(), t1 = hov[hov.length - 1].date.getTime();
  const span = Math.max(t1 - t0, 864e5 * (tr.grain === 'week' ? 14 : 3));
  const tMin = t0 - span * 0.04, tMax = t0 + span * 1.04;
  const kTakes = m.tempoKey ? takes.filter((t) => tracksTempo(t) && tempoKey(t) === m.tempoKey) : [];
  const vals = [...pts.map((p) => p.v), ...kTakes.map((t) => t.tempo)];
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (m.tempoKey) { const d = defaultTempo(m.tempoKey); lo = Math.min(lo, d - 10); hi = Math.max(hi, d + 6); }
  if (m.better === 'zero') { lo = Math.min(lo, -12); hi = Math.max(hi, 12); }
  if (m.unit === '%') { lo = Math.min(lo, 0); hi = Math.max(hi, 100); }
  if (m.id === 'vibRate') { lo = Math.min(lo, 4); hi = Math.max(hi, 7.5); }
  if (m.better === 'low' && m.unit !== '%') lo = Math.min(lo, 0);
  if (lo === hi) { lo -= 5; hi += 5; }
  const padV = (hi - lo) * 0.08 || 1; lo -= padV; hi += padV;
  const x = (d) => pl + ((d - tMin) / (tMax - tMin)) * (W - pl - pr), y = (v) => pt + ((hi - v) / (hi - lo)) * (H - pt - pb);
  const ns = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); (parent || svg).append(e); return e; };
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('height', H);
  svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `${m.label} over time`);
  // reference band
  if (m.better === 'zero') mk('rect', { x: pl, width: W - pl - pr, y: y(10), height: y(-10) - y(10), fill: 'rgba(255,255,255,0.045)' });
  if (m.id === 'vibRate') mk('rect', { x: pl, width: W - pl - pr, y: y(6.8), height: y(4.6) - y(6.8), fill: 'rgba(255,255,255,0.045)' });
  // y grid
  const ticks = 5, step = niceStep((hi - lo) / ticks);
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
    mk('line', { x1: pl, x2: W - pr, y1: y(v), y2: y(v), stroke: Math.abs(v) < 1e-9 && m.better === 'zero' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.06)' });
    const tx = mk('text', { x: pl - 8, y: y(v) + 4, 'text-anchor': 'end', fill: '#6b7590', 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' });
    tx.textContent = (m.better === 'zero' && v > 0 ? '+' : '') + (Math.abs(step) < 1 ? v.toFixed(1) : Math.round(v)) + (m.unit === '%' ? '%' : '');
  }
  if (m.better === 'zero') {
    const a = mk('text', { x: W - pr, y: y(hi) + 12, 'text-anchor': 'end', fill: '#98a2b6', 'font-size': 11 }); a.textContent = 'sharp ↑';
    const b = mk('text', { x: W - pr, y: y(lo) - 4, 'text-anchor': 'end', fill: '#98a2b6', 'font-size': 11 }); b.textContent = 'flat ↓';
  }
  if (m.tempoKey) {
    const d = defaultTempo(m.tempoKey);
    mk('line', { x1: pl, x2: W - pr, y1: y(d), y2: y(d), stroke: 'rgba(255,255,255,0.3)', 'stroke-dasharray': '2 4' });
    const tx = mk('text', { x: pl + 6, y: y(d) - 5, fill: '#98a2b6', 'font-size': 11 }); tx.textContent = `default ${d} bpm`;
  }
  // x labels
  const nLab = Math.min(hov.length, Math.floor((W - pl - pr) / 70));
  const every = Math.max(1, Math.ceil(hov.length / Math.max(1, nLab)));
  hov.forEach((p, i) => { if (i % every === 0 || i === hov.length - 1) { const tx = mk('text', { x: x(p.date), y: H - 10, 'text-anchor': 'middle', fill: '#6b7590', 'font-size': 11 }); tx.textContent = fmtDay(p.key); } });
  // line + points
  if (kTakes.length) {
    // every take as a small dot: filled = clean, hollow = not clean yet
    const byKey = new Map();
    for (const t of kTakes) { const k = tr.grain === 'week' ? weekKey(t.ts) : dayKey(t.ts); if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(t); }
    for (const [k, ts] of byKey) {
      const d = keyDate(k);
      ts.forEach((t, i) => {
        const cx = x(d) + (i - (ts.length - 1) / 2) * 9;
        mk('circle', { cx, cy: y(t.tempo), r: 3.5, fill: isClean(t) ? '#bf8735' : '#0b1019', stroke: isClean(t) ? '#0b1019' : '#8a93a6', 'stroke-width': isClean(t) ? 1 : 1.6, opacity: 0.95 });
      });
    }
  }
  if (pts.length > 1) mk('polyline', { points: pts.map((p) => `${x(p.date)},${y(p.v)}`).join(' '), fill: 'none', stroke: '#bf8735', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
  const maxN = Math.max(1, ...pts.map((p) => p.n));
  const cross = mk('line', { y1: pt, y2: H - pb, stroke: 'rgba(237,230,214,0.25)', visibility: 'hidden' });
  const dots = pts.map((p) => mk('circle', { cx: x(p.date), cy: y(p.v), r: 4 + 3 * Math.sqrt(p.n / maxN), fill: '#bf8735', stroke: '#0b1019', 'stroke-width': 2 }));
  // last value label
  const lp = pts[pts.length - 1] || { date: hov[hov.length - 1].date, v: null };
  const lt = lp.v == null ? null : mk('text', { x: Math.min(W - pr - 4, x(lp.date) + 10), y: y(lp.v) - 10, 'text-anchor': x(lp.date) > W - 80 ? 'end' : 'start', fill: '#ede6d6', 'font-size': 12, 'font-family': 'JetBrains Mono, monospace' });
  if (lt) lt.textContent = fmtV(m, lp.v);
  // hover layer
  const hit = mk('rect', { x: pl, y: pt, width: W - pl - pr, height: H - pt - pb, fill: 'transparent' });
  let cur = -1;
  const showAt = (ev, pin) => {
    const r = svg.getBoundingClientRect(), sx = ((ev.clientX - r.left) / r.width) * W;
    let best = 0; hov.forEach((p, i) => { if (Math.abs(x(p.date) - sx) < Math.abs(x(hov[best].date) - sx)) best = i; });
    const p = hov[best];
    cross.setAttribute('x1', x(p.date)); cross.setAttribute('x2', x(p.date)); cross.setAttribute('visibility', 'visible');
    dots.forEach((d, i) => d.setAttribute('stroke', pts[i] === p ? '#ede6d6' : '#0b1019'));
    if (best === cur && !pin) return; cur = best;
    const exs = {}; p.takes.forEach((t) => { const k = t.tune ? t.tune.name : t.exName; exs[k] = (exs[k] || 0) + 1; });
    const label = tr.grain === 'week' ? 'Week of ' + fmtDay(p.key) : keyDate(p.key).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const sub = m.tempoKey ? `Tried: ${p.tries.map((t) => `${t.tempo} bpm (${t.summary?.inTune ?? '—'}%${isClean(t) ? ', clean' : ''})`).join(', ')}`
      : `${p.n} notes · practiced: ${Object.entries(exs).map(([k, v]) => (v > 1 ? `${k} ×${v}` : k)).join(', ')}`;
    const sk = m.sug(p.v);
    const head = m.tempoKey ? `${label}: ${p.v != null ? 'clean at ' + p.v + ' bpm' : 'no clean take yet'}` : `${label}: ${fmtV(m, p.v)}`;
    const content = sk ? tipContent(head, sub, sk, !m.tempoKey && !isProblem(m, p.v)) : el('div', {}, el('h4', {}, `${label}: ${fmtV(m, p.v)}`), el('div', { class: 'sub' }, sub));
    Tip.show(svg, content, { x: ev.clientX, y: ev.clientY, pin });
  };
  hit.addEventListener('mousemove', (e) => showAt(e, false));
  hit.addEventListener('click', (e) => { e.stopPropagation(); cur = -1; showAt(e, true); });
  hit.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); cur = -1; Tip.hideSoon(); });
  wrap.append(svg);
  if (m.tempoKey) {
    const sw = (dash, fill, stroke) => { const e = document.createElementNS(ns, 'svg'); e.setAttribute('width', 26); e.setAttribute('height', 10);
      if (!dash) mk('line', { x1: 0, x2: 26, y1: 5, y2: 5, stroke, 'stroke-width': 2 }, e); mk('circle', { cx: 13, cy: 5, r: dash ? 3.5 : 5, fill, stroke, 'stroke-width': 1.6 }, e); return e; };
    wrap.append(el('div', { class: 'legend' }, el('span', {}, sw(false, '#bf8735', '#0b1019'), 'Fastest clean tempo (line)'), el('span', {}, sw(true, '#bf8735', '#0b1019'), 'Clean take'), el('span', {}, sw(true, '#0b1019', '#8a93a6'), 'Take not clean yet')));
  }
  // table view
  const tb = $('trTable'); tb.innerHTML = '';
  const t = el('table', {}, el('thead', {}, el('tr', {}, ['Date', 'Value', 'Notes', 'Exercises'].map((h) => el('th', {}, h)))));
  const body = el('tbody');
  for (const p of hov.slice().reverse()) body.append(el('tr', { style: 'cursor:default' }, el('td', { class: 'num' }, fmtDay(p.key)), el('td', { class: 'num' }, fmtV(m, p.v) + (m.tempoKey ? ` (tried up to ${p.tried})` : '')), el('td', { class: 'num dim' }, p.n), el('td', { class: 'muted' }, [...new Set(p.takes.map((x) => (x.tune ? x.tune.name : x.exName)))].join(', '))));
  t.append(body); tb.append(t);
}
function niceStep(raw) { const p = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / p; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p; }

function renderHelp(m, takes) {
  const box = $('trHelp'); box.innerHTML = '';
  if (m.better == null) { box.append(el('p', { class: 'muted' }, 'This measure has no “better” direction, so there’s nothing to attribute. Pick another measure.')); return; }
  const days = new Set(takes.map((t) => dayKey(t.ts))).size;
  box.append(el('p', { class: 'muted', style: 'font-size:13px' },
    `For “${m.label},” Woodshed checks two things for each exercise: how this measure moved from a day you did the exercise to your next practice day, compared with days you didn’t; and, within a session, how it changed from before you did the exercise to after. The exercise’s own notes are left out, so an exercise can’t grade itself. With ${days} practice day${days === 1 ? '' : 's'} of data these are educated guesses, not proof. Practicing the same few exercises every day makes them hard to tell apart, so mixing up your routine sharpens the picture.`));
  const est = helpEstimates(m, takes);
  const withData = est.filter((r) => r.obs);
  if (!withData.length) { box.append(el('p', {}, 'Not enough data yet. This needs at least two practice days (or a session where you measured before and after an exercise) that include this measure.')); return; }
  const best = withData.find((r) => r.score >= effThr(m));
  const unit = m.unit.trim() || '';
  const fmtD = (d) => (d == null ? '—' : (m.unit === ' Hz' ? `${d > 0 ? 'better by ' : 'worse by '}${Math.abs(d).toFixed(2)} Hz` : Math.abs(d) < 1 ? 'about the same' : `${d > 0 ? 'better by ' : 'worse by '}${Math.round(Math.abs(d))}${unit}`));
  if (best) {
    const sk = m.sug(measure(m, takes.slice(-30)).v);
    const sg = sk && SUGG[sk]?.items.find((it) => it.ex === best.e);
    box.append(el('p', {}, el('b', {}, 'Best guess so far: '), exById(best.e).name, ` (${confidence(best.obs)}). `, sg ? el('span', { class: 'muted' }, 'Suggested tweak: ' + presetLabel(sg).bits + '. ') : null,
      sg ? el('button', { class: 'btn small', onclick: () => applyPreset(sg) }, 'Load it') : el('button', { class: 'btn small', onclick: () => applyPreset({ ex: best.e }) }, 'Load it')));
  } else box.append(el('p', {}, 'No exercise stands out as helping yet.'));
  const maxAbs = Math.max(...withData.map((r) => Math.abs(r.score)), 1e-6);
  const t = el('table', {}, el('thead', {}, el('tr', {}, ['Exercise', 'Days practiced', 'Next practice day', 'Later the same session', 'Overall', 'Confidence', ''].map((h) => el('th', {}, h)))));
  const body = el('tbody');
  for (const r of est) {
    const ex = exById(r.e);
    if (!r.obs) { body.append(el('tr', { style: 'cursor:default' }, el('td', {}, ex.name), el('td', { class: 'num dim' }, r.practiced), el('td', { class: 'dim', colspan: 5 }, 'can’t measure separately yet (it’s the only source of this measure on those days, or there’s no follow-up day)'))); continue; }
    const w = (Math.abs(r.score) / maxAbs) * 50;
    const bar = el('div', { class: 'helpbar' }, el('span', { class: 'mid' }), el('i', { style: `left:${r.score < 0 ? 50 - w : 50}%;width:${w}%;background:${r.score > 0 ? 'var(--good)' : 'var(--off)'}` }));
    body.append(el('tr', { style: 'cursor:default' }, el('td', {}, ex.name), el('td', { class: 'num dim' }, r.practiced),
      el('td', { class: 'num' }, r.nNext ? `${fmtD(r.next)} (${r.nNext})` : '—'), el('td', { class: 'num' }, r.nSame ? `${fmtD(r.same)} (${r.nSame})` : '—'),
      el('td', {}, bar), el('td', { class: 'muted' }, Math.abs(r.score) < effThr(m) ? 'no clear effect' : confidence(r.obs)),
      el('td', {}, el('button', { class: 'btn small', onclick: () => applyPreset({ ex: r.e }) }, 'Load'))));
  }
  t.append(body);
  box.append(el('div', { style: 'overflow-x:auto' }, t), el('p', { class: 'muted', style: 'font-size:12px' }, 'Numbers in parentheses are how many day-pairs or sessions the estimate is based on. Green bars mean the measure tended to improve after that exercise; the bar on its own isn’t proof.'));
}
function renderLog(takes) {
  const box = $('trLog'); box.innerHTML = '';
  if (!takes.length) { box.append(el('p', { class: 'muted' }, 'No practice logged yet.')); return; }
  const days = [];
  const last = keyDate(dayKey(takes[takes.length - 1].ts)), first = keyDate(dayKey(takes[0].ts));
  const start = new Date(Math.max(first, last - 41 * 864e5));
  for (let d = new Date(start); d <= last; d.setDate(d.getDate() + 1)) days.push(dayKey(d.getTime()));
  const counts = {};
  for (const t of takes) { const k = dayKey(t.ts); counts[t.exId] = counts[t.exId] || {}; counts[t.exId][k] = (counts[t.exId][k] || 0) + 1; }
  const maxC = Math.max(...Object.values(counts).flatMap((o) => Object.values(o)));
  const t = el('table', { class: 'logtable' }, el('thead', {}, el('tr', {}, el('th', {}), days.map((k) => el('th', { class: 'dim' }, keyDate(k).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }))))));
  const body = el('tbody');
  for (const ex of EX) {
    if (!counts[ex.id]) continue;
    body.append(el('tr', { style: 'cursor:default' }, el('td', { class: 'lbl' }, ex.name), days.map((k) => {
      const c = counts[ex.id][k] || 0;
      return el('td', {}, el('div', { class: 'cell', title: `${ex.name}, ${fmtDay(k)}: ${c} take${c === 1 ? '' : 's'}`, style: c ? `background:rgba(191,135,53,${0.25 + 0.75 * (c / maxC)});color:#1a1408` : 'background:rgba(255,255,255,0.03)' }, c || ''));
    })));
  }
  t.append(body); box.append(t);
}
function renderTrends() {
  const all = trendTakes(0);
  const takes = trendTakes(+tr.range);
  if (!tr.metric) { const f = (S.focus && S.focus[0]) || autoFocus(all)[0]; tr.metric = f || 'medAbs'; }
  const sel = $('trMetric');
  sel.innerHTML = '';
  const groups = [['Overall', ['medAbs', 'inTune', 'lean']], ['Tempo', tempoMetrics().map((m) => m.id)], ['Chord tones', FN_ORDER.map((f) => 'fn:' + f)], ['Range', ['reg:low', 'reg:mid', 'reg:high']], ['Onsets', ['scoop', 'settle']], ['Vibrato', ['vibPct', 'vibRate', 'vibExt', 'goals']], ['Songs', ['free']]];
  for (const [g, ids] of groups) if (ids.length) sel.append(el('optgroup', { label: g }, ids.map((id) => el('option', { value: id }, metricById(id).label))));
  sel.value = tr.metric; $('trGrain').value = tr.grain; $('trRange').value = String(tr.range);
  const m = metricById(tr.metric);
  const pinned = (S.focus || []).includes(m.id);
  $('trPin').textContent = pinned ? '★ In focus areas' : '☆ Add to focus areas';
  $('trTableBtn').textContent = tr.table ? 'Hide table' : 'Show table';
  $('trTable').hidden = !tr.table;
  renderFocus(all);
  renderChart(m, takes);
  renderHelp(m, takes);
  renderLog(all);
}
function bindTrends() {
  bindTip();
  $('trMetric').addEventListener('change', (e) => { tr.metric = e.target.value; renderTrends(); });
  $('trGrain').addEventListener('change', (e) => { tr.grain = e.target.value; renderTrends(); });
  $('trRange').addEventListener('change', (e) => { tr.range = +e.target.value; renderTrends(); });
  $('trTableBtn').addEventListener('click', () => { tr.table = !tr.table; renderTrends(); });
  $('trPin').addEventListener('click', () => {
    let f = S.focus && S.focus.length ? [...S.focus] : autoFocus(trendTakes(0));
    if (f.includes(tr.metric)) f = f.filter((x) => x !== tr.metric); else f = [...f, tr.metric].slice(-8);
    S.focus = f; saveSettingsSoon(); renderTrends();
  });
  window.addEventListener('resize', () => { if (!$('tab-trends').hidden) renderTrends(); });
}
