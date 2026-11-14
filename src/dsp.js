// ===== DSP: pitch tracking and per-note voice analysis =====
const DSP = (() => {
  const median = (a) => {
    if (!a.length) return NaN;
    const s = Float64Array.from(a).sort();
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : 0.5 * (s[m - 1] + s[m]);
  };
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
  const std = (a) => {
    if (a.length < 2) return 0;
    const m = mean(a);
    return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1));
  };
  const percentile = (a, p) => {
    if (!a.length) return NaN;
    const s = Float64Array.from(a).sort();
    return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))];
  };

  // Box-filter decimation to roughly 22 kHz (voice pitch lives well below that).
  function decimate(x, sr) {
    const D = Math.max(1, Math.round(sr / 22050));
    if (D === 1) return { y: x, sr, D };
    const n = Math.floor(x.length / D);
    const y = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const o = i * D;
      for (let k = 0; k < D; k++) s += x[o + k];
      y[i] = s / D;
    }
    return { y, sr: sr / D, D };
  }

  function makeYin(sr) {
    const W = Math.round(0.023 * sr);
    const tauMin = Math.max(2, Math.floor(sr / 1100));
    const tauMax = Math.ceil(sr / 65);
    const d = new Float64Array(tauMax + 2);
    const dp = new Float64Array(tauMax + 2);
    const need = W + tauMax + 1;
    function frame(x, off, thr = 0.15) {
      let cum = 0;
      dp[0] = 1;
      for (let tau = 1; tau <= tauMax; tau++) {
        let s = 0;
        const o2 = off + tau;
        for (let j = 0; j < W; j++) {
          const v = x[off + j] - x[o2 + j];
          s += v * v;
        }
        d[tau] = s;
        cum += s;
        dp[tau] = cum > 0 ? (s * tau) / cum : 1;
      }
      let tau = -1;
      for (let t = tauMin; t < tauMax; t++) {
        if (dp[t] < thr) {
          while (t + 1 < tauMax && dp[t + 1] < dp[t]) t++;
          tau = t;
          break;
        }
      }
      if (tau < 0) {
        let best = tauMin;
        for (let t = tauMin; t < tauMax; t++) if (dp[t] < dp[best]) best = t;
        tau = best;
      }
      let bt = tau;
      if (tau > 1 && tau < tauMax) {
        const a = dp[tau - 1], b = dp[tau], c = dp[tau + 1];
        const den = 2 * (a - 2 * b + c);
        if (Math.abs(den) > 1e-12) bt = tau + (a - c) / den;
      }
      let e = 0;
      for (let j = 0; j < W; j++) e += x[off + j] * x[off + j];
      const rms = Math.sqrt(e / W);
      return { f0: sr / bt, ap: Math.max(0, Math.min(1, dp[tau])), rms };
    }
    return { frame, W, need, sr };
  }

  const hzToMidi = (f, A4 = 440) => 69 + 12 * Math.log2(f / A4);
  const midiToHz = (m, A4 = 440) => A4 * Math.pow(2, (m - 69) / 12);

  // Single-frame pitch estimate for live display (x = most recent raw samples).
  let liveYin = null;
  function liveFrame(raw, sr, A4 = 440) {
    const { y, sr: sd } = decimate(raw, sr);
    if (!liveYin || liveYin.sr !== sd) liveYin = makeYin(sd);
    if (y.length < liveYin.need) return null;
    const r = liveYin.frame(y, y.length - liveYin.need);
    const db = 20 * Math.log10(r.rms + 1e-9);
    const voiced = r.ap < 0.2 && db > -48;
    return { midi: hzToMidi(r.f0, A4), clarity: 1 - r.ap, db, voiced };
  }

  // Full pitch track of a recording. hop = 10 ms.
  function track(raw, sr0, A4 = 440, hop = 0.01, onProgress) {
    const { y, sr } = decimate(raw, sr0);
    const yin = makeYin(sr);
    const hopS = Math.max(1, Math.round(hop * sr));
    const n = Math.max(0, Math.floor((y.length - yin.need) / hopS));
    const t = new Float32Array(n), midi = new Float32Array(n), clar = new Float32Array(n),
      db = new Float32Array(n), ap = new Float32Array(n), voiced = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const off = i * hopS;
      const r = yin.frame(y, off);
      t[i] = (off + yin.W / 2) / sr;
      midi[i] = hzToMidi(r.f0, A4);
      ap[i] = r.ap;
      clar[i] = 1 - r.ap;
      db[i] = 20 * Math.log10(r.rms + 1e-9);
    }
    const floor = percentile(Array.from(db), 0.1);
    const gate = Math.max(floor + 12, -60);
    for (let i = 0; i < n; i++) voiced[i] = ap[i] < 0.2 && db[i] > gate && midi[i] > 30 && midi[i] < 90 ? 1 : 0;
    // Octave-jump repair against local voiced median.
    for (let i = 0; i < n; i++) {
      if (!voiced[i]) continue;
      const nb = [];
      for (let k = Math.max(0, i - 5); k <= Math.min(n - 1, i + 5); k++) if (voiced[k] && k !== i) nb.push(midi[k]);
      if (nb.length < 4) continue;
      const m = median(nb);
      const dlt = midi[i] - m;
      if (Math.abs(dlt) > 9) {
        const fixed = midi[i] - 12 * Math.round(dlt / 12);
        if (Math.abs(fixed - m) < 2) midi[i] = fixed;
        else voiced[i] = 0;
      }
    }
    // Drop voiced blips shorter than 40 ms.
    let i = 0;
    while (i < n) {
      if (!voiced[i]) { i++; continue; }
      let j = i;
      while (j < n && voiced[j]) j++;
      if ((j - i) * hop < 0.04) for (let k = i; k < j; k++) voiced[k] = 0;
      i = j;
    }
    return { t, midi, clarity: clar, db, voiced, hop, n, A4, gate };
  }

  function frameAt(tr, time) {
    // frames are uniformly spaced
    if (tr.n < 2) return 0;
    const t0 = tr.t[0];
    return Math.max(0, Math.min(tr.n, Math.round((time - t0) / tr.hop)));
  }

  // Harmonic amplitudes via direct DFT at h*f0 on a Hann-windowed slice.
  function harmonics(raw, sr, center, f0, maxH = 20, fmax = 5000) {
    const N = 2048 * Math.max(1, Math.round(sr / 48000));
    const s = Math.round(center * sr - N / 2);
    if (s < 0 || s + N > raw.length) return null;
    const out = [];
    for (let h = 1; h <= maxH && h * f0 < fmax; h++) {
      const w = (2 * Math.PI * h * f0) / sr;
      const cw = Math.cos(w), sw = Math.sin(w);
      let c = 1, si = 0, re = 0, im = 0;
      for (let k = 0; k < N; k++) {
        const win = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / (N - 1));
        const v = raw[s + k] * win;
        re += v * c;
        im -= v * si;
        const nc = c * cw - si * sw;
        si = si * cw + c * sw;
        c = nc;
      }
      out.push(re * re + im * im);
    }
    return out;
  }

  function vibratoOf(cents, hop) {
    const n = cents.length;
    if (n * hop < 0.5) return null;
    // linear detrend
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let i = 0; i < n; i++) { sx += i; sy += cents[i]; sxx += i * i; sxy += i * cents[i]; }
    const b = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1);
    const a = (sy - b * sx) / n;
    const r = new Float64Array(n);
    for (let i = 0; i < n; i++) r[i] = cents[i] - (a + b * i);
    const s = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let acc = 0, c = 0;
      for (let k = i - 1; k <= i + 1; k++) if (k >= 0 && k < n) { acc += r[k]; c++; }
      s[i] = acc / c;
    }
    const zc = [];
    for (let i = 1; i < n; i++) if ((s[i - 1] < 0 && s[i] >= 0) || (s[i - 1] >= 0 && s[i] < 0)) zc.push(i);
    let e = 0;
    for (let i = 0; i < n; i++) e += s[i] * s[i];
    const extent = Math.SQRT2 * Math.sqrt(e / n);
    if (zc.length < 3) return { present: false, extent, rate: 0 };
    const halfP = [];
    for (let i = 1; i < zc.length; i++) halfP.push((zc[i] - zc[i - 1]) * hop);
    const mp = mean(halfP);
    const rate = 1 / (2 * mp);
    const reg = std(halfP) / mp;
    const present = extent >= 10 && zc.length >= 5 && rate >= 3.5 && rate <= 9 && reg < 0.4;
    return { present, extent, rate, reg };
  }

  /**
   * Analyze one note. i0..i1 = frame range. target = MIDI (float ok) or null (nearest semitone).
   * opts: { raw, sr, nominalStart }
   */
  function analyzeNote(tr, i0, i1, target, opts = {}) {
    const hop = tr.hop;
    const idx = [];
    for (let i = Math.max(0, i0); i < Math.min(tr.n, i1); i++) if (tr.voiced[i]) idx.push(i);
    if (idx.length < 5) return { missed: true };
    const sungAll = idx.map((i) => tr.midi[i]);
    const tgt = target == null ? Math.round(median(sungAll)) : target;
    const cents = idx.map((i) => (tr.midi[i] - tgt) * 100);
    const first = idx[0], last = idx[idx.length - 1];
    const dur = (last - first + 1) * hop;
    const L = cents.length;
    // provisional steady part -> the note's own center pitch
    const p0 = Math.min(Math.max(Math.round(0.08 / hop), Math.floor(L * 0.15)), Math.floor(L * 0.4));
    const p1 = Math.max(p0 + 1, L - Math.max(1, Math.floor(L * 0.1)));
    const center = median(cents.slice(p0, p1));
    // settle: first point where the 60 ms running median is within ±25¢ of that center
    const w = Math.max(3, Math.round(0.06 / hop));
    let settleK = L;
    for (let k = 0; k + w <= L; k++) {
      if (Math.abs(median(cents.slice(k, k + w)) - center) <= 25) { settleK = k; break; }
    }
    const settle = Math.min(dur, settleK * hop);
    const early = median(cents.slice(0, Math.min(4, L))) - center;
    let onset = 'clean';
    if (settle >= 0.05 && early < -50) onset = 'scoop';
    else if (settle >= 0.05 && early > 50) onset = 'from above';
    // steady part
    let s0 = Math.max(Math.min(settleK, Math.floor(L * 0.5)), Math.round(0.08 / hop), Math.floor(L * 0.15));
    let s1 = L - Math.max(1, Math.floor(L * 0.1));
    if (s1 - s0 < 3) { s0 = Math.floor(L * 0.25); s1 = Math.max(s0 + 1, Math.floor(L * 0.9)); }
    const steady = cents.slice(s0, s1);
    const err = median(steady);
    const vib = steady.length * hop >= 0.5 ? vibratoOf(steady, hop) : null;
    let stability;
    if (vib && vib.present) {
      const win = Math.max(3, Math.round(1 / vib.rate / hop));
      const centers = [];
      for (let k = 0; k + win <= steady.length; k += Math.max(1, win >> 1)) centers.push(mean(steady.slice(k, k + win)));
      stability = std(centers);
    } else stability = std(steady);
    let vibOnset = null;
    if (vib && vib.present && L * hop >= 1.0) {
      const ww = Math.round(0.3 / hop);
      for (let k = 0; k + ww <= L; k += 2) {
        const seg = cents.slice(k, k + ww);
        const m = mean(seg);
        let e = 0;
        for (const v of seg) e += (v - m) * (v - m);
        if (Math.sqrt(e / seg.length) * Math.SQRT2 > 9 && k >= settleK) { vibOnset = k * hop + 0.15; break; }
      }
    }
    let vibOut = vib && vib.present ? { rate: vib.rate, extent: vib.extent, onset: vibOnset } : null;
    if (vibOut && vibOnset != null) {
      const k0 = Math.round((vibOnset - 0.15) / hop);
      if (s1 - k0 >= Math.round(0.5 / hop)) {
        const v2 = vibratoOf(cents.slice(k0, s1), hop);
        if (v2 && v2.present) vibOut = { rate: v2.rate, extent: v2.extent, onset: vibOnset };
      }
    }
    const clarity = mean(idx.slice(s0, s1).map((i) => tr.clarity[i]));
    const level = mean(idx.slice(s0, s1).map((i) => tr.db[i]));
    // spectral features
    let h1h2 = null, bright = null, ring = null;
    if (opts.raw) {
      const picks = [];
      const steadyIdx = idx.slice(s0, s1);
      const np = Math.min(6, steadyIdx.length);
      for (let p = 0; p < np; p++) picks.push(steadyIdx[Math.floor(((p + 0.5) * steadyIdx.length) / np)]);
      const acc = [];
      let f0sum = 0, cnt = 0;
      for (const fi of picks) {
        const f0 = midiToHz(tr.midi[fi], tr.A4);
        const H = harmonics(opts.raw, opts.sr, tr.t[fi], f0);
        if (!H || H.length < 2) continue;
        H.forEach((p, k) => (acc[k] = (acc[k] || 0) + p));
        f0sum += f0; cnt++;
      }
      if (cnt) {
        const f0 = f0sum / cnt;
        const P = acc.map((p) => p / cnt);
        h1h2 = 10 * Math.log10((P[0] + 1e-12) / (P[1] + 1e-12));
        let tot = 0, wsum = 0, rsum = 0;
        P.forEach((p, k) => {
          const f = (k + 1) * f0;
          tot += p; wsum += p * f;
          if (f >= 2000 && f <= 4000) rsum += p;
        });
        bright = wsum / (tot || 1);
        ring = 10 * Math.log10((rsum + 1e-12) / (tot + 1e-12));
      }
    }
    let timing = null;
    if (opts.nominalStart != null) timing = tr.t[first] - opts.nominalStart;
    return {
      missed: false,
      target: tgt,
      sung: tgt + err / 100,
      cents: err,
      settleMs: Math.round(settle * 1000),
      onset,
      stability,
      vibrato: vibOut,
      clarity, level, h1h2, bright, ring, dur,
      t0: tr.t[first], t1: tr.t[last] + hop,
      timing,
    };
  }

  // Split a track into sung notes (for uploads and free singing).
  function segment(tr) {
    const n = tr.n, hop = tr.hop;
    const half = Math.max(1, Math.round(0.06 / hop));
    const sm = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      if (!tr.voiced[i]) continue;
      let s = 0, c = 0;
      for (let k = i - half; k <= i + half; k++) if (k >= 0 && k < n && tr.voiced[k]) { s += tr.midi[k]; c++; }
      sm[i] = s / c;
    }
    const maxGap = Math.round(0.05 / hop);
    const segs = [];
    let cur = null, gap = 0, out = 0;
    const close = (end) => {
      if (cur && end - cur.i0 >= Math.round(0.08 / hop)) segs.push({ i0: cur.i0, i1: end });
      cur = null;
    };
    for (let i = 0; i < n; i++) {
      if (!tr.voiced[i]) {
        if (cur) { gap++; if (gap > maxGap) { close(i - gap + 1); gap = 0; } }
        continue;
      }
      gap = 0;
      if (!cur) { cur = { i0: i, sum: 0, cnt: 0 }; out = 0; }
      const center = cur.cnt ? cur.sum / cur.cnt : sm[i];
      if (cur.cnt >= 4 && Math.abs(sm[i] - center) > 0.6) {
        out++;
        if (out >= 4) {
          const start = i - out + 1;
          close(start);
          cur = { i0: start, sum: 0, cnt: 0 };
          for (let k = start; k <= i; k++) if (tr.voiced[k]) { cur.sum += sm[k]; cur.cnt++; }
          out = 0;
        }
        continue;
      }
      out = 0;
      cur.sum += sm[i]; cur.cnt++;
    }
    close(n);
    // median pitch per segment and merge near-duplicates
    for (const s of segs) {
      const a = [];
      for (let i = s.i0; i < s.i1; i++) if (tr.voiced[i]) a.push(tr.midi[i]);
      const L = a.length;
      s.midi = median(a.slice(Math.floor(L * 0.2), Math.max(Math.floor(L * 0.2) + 1, Math.floor(L * 0.9))));
    }
    const merged = [];
    for (const s of segs) {
      const p = merged[merged.length - 1];
      if (p && Math.abs(p.midi - s.midi) < 0.35 && (s.i0 - p.i1) * hop < 0.1) {
        p.i1 = s.i1;
      } else merged.push({ ...s });
    }
    return merged;
  }

  // Needleman–Wunsch alignment of sung segments to target notes.
  function align(segs, targets) {
    const n = segs.length, m = targets.length;
    const gapT = 1.2, gapS = 0.8;
    const D = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
    const B = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
    for (let i = 1; i <= n; i++) { D[i][0] = i * gapS; B[i][0] = 1; }
    for (let j = 1; j <= m; j++) { D[0][j] = j * gapT; B[0][j] = 2; }
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const c = Math.min(Math.abs(segs[i - 1].midi - targets[j - 1]), 3);
        const a = D[i - 1][j - 1] + c, b = D[i - 1][j] + gapS, d = D[i][j - 1] + gapT;
        if (a <= b && a <= d) { D[i][j] = a; B[i][j] = 0; }
        else if (b <= d) { D[i][j] = b; B[i][j] = 1; }
        else { D[i][j] = d; B[i][j] = 2; }
      }
    }
    const map = new Array(m).fill(-1);
    let i = n, j = m;
    while (i > 0 || j > 0) {
      const b = B[i][j];
      if (i > 0 && j > 0 && b === 0) {
        if (Math.abs(segs[i - 1].midi - targets[j - 1]) < 2.5) map[j - 1] = i - 1;
        i--; j--;
      } else if (i > 0 && (j === 0 || b === 1)) i--;
      else j--;
    }
    return map;
  }

  // Find the time shift (s) that best lines up a live take with its targets.
  function bestShift(tr, notes, lo = -0.05, hi = 0.4) {
    let best = 0, bestScore = -1;
    for (let sh = lo; sh <= hi + 1e-9; sh += 0.02) {
      let score = 0;
      for (const nt of notes) {
        const a = frameAt(tr, nt.t0 + sh), b = frameAt(tr, nt.t1 + sh);
        for (let i = a; i < b; i++) if (tr.voiced[i] && Math.abs(tr.midi[i] - nt.midi) < 0.5) score++;
      }
      if (score > bestScore) { bestScore = score; best = sh; }
    }
    return best;
  }

  // Compact pitch trace for storage: 20 ms steps, midi*10 rounded, 0 = unvoiced.
  function compactTrace(tr, step = 0.02) {
    const k = Math.max(1, Math.round(step / tr.hop));
    const data = [];
    for (let i = 0; i < tr.n; i += k) data.push(tr.voiced[i] ? Math.round(tr.midi[i] * 10) : 0);
    return { t0: tr.n ? tr.t[0] : 0, step: k * tr.hop, data };
  }

  return { median, mean, std, percentile, decimate, makeYin, liveFrame, track, frameAt, analyzeNote, segment, align, bestShift, compactTrace, hzToMidi, midiToHz, harmonics, vibratoOf };
})();
if (typeof module !== 'undefined') module.exports = DSP;
