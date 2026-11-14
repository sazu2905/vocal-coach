# Woodshed — jazz vocal practice

Woodshed is a practice room for jazz singers that runs entirely in the browser. It listens while you sing, measures how each note landed, and tracks how you're improving over weeks and months. It installs as an app (PWA) and works offline after the first visit.

## Features

- **Live pitch analysis.** Your pitch is drawn over the target notes as you sing. You can also upload a recording instead.
- **Note-by-note analysis.** For each note: pitch error in cents, the chord tone it landed on, how long it took to settle, scoops, vibrato rate/width/onset, and rough breathiness and brightness measures.
- **Exercises built around jazz harmony.** Scales and arpeggios, ii–V–I guide tones, extensions, blues and bebop lines, and vibrato drills (pulses, straight ↔ vibrato, low-note bloom). Each comes with piano-and-bass accompaniment and moves through keys within your range.
- **Standards practice.** Chord changes for common standards, with swing, ballad, bossa or even-8ths accompaniment, any key, any tempo, and a chord chart that follows along. A builder lets you edit the changes or write your own progressions.
- **Your own melody and lyrics.** Add them from a lead sheet you own, either by importing MIDI or typing the notes. Woodshed can then play the melody and score you against it.
- **Free sing.** Sing over a drone or a looping progression, switching chords by hand as you go.
- **Progress and Over time views.** Tendencies by chord tone and by range, tempo tracking per exercise, trend charts, a "what seems to be helping" estimate, and hover suggestions for what to practice next.
- **Taste learning.** Tag notes 👍/👎 and upload reference singers to see what separates the sound you like from the sound you make.

## Your data

Everything stays in your browser on your device, in IndexedDB. Nothing is uploaded anywhere, and recordings are not stored; only the analysis is kept.

Use **Progress → Your data → Download backup file** to save everything to a `.json` file, and **Restore from backup file** to load it into another browser or device. Restoring merges takes with what's already there. Browsers can clear site data, so back up now and then.

## Run it

It's a static site with no build step needed to serve it.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Live microphone input requires HTTPS or `localhost`. Opening `index.html` straight from the file system works in Chrome, but offline/install support needs a real server.

### Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The app is served at `https://<user>.github.io/<repo>/`. All paths are relative, so any repo name works.

## Develop

The site is a single generated `index.html` plus a service worker. Edit the files in `src/`, then rebuild:

```bash
python3 build.py
```

| File | What it holds |
|---|---|
| `src/index.html` | Page template (CSS and scripts are inlined by the build) |
| `src/style.css` | Styles |
| `src/dsp.js` | Pitch tracking (YIN), note segmentation, alignment, per-note voice analysis |
| `src/app.js` | Exercises, audio engine and synth, storage, practice/review/progress UI |
| `src/standards.js` | Standards (chord changes), accompaniment generator, melody/lyrics, tempo tracking |
| `src/builder.js` | Chord-progression builder and free-sing progressions |
| `src/trends.js` | Over-time charts, effect estimates, practice suggestions, tooltips |
| `src/sw.template.js` | Service worker template (`build.py` stamps a version into `sw.js`) |
| `manifest.webmanifest`, `icons/` | PWA manifest and icons |

`build.py` regenerates `index.html` and `sw.js`. The version string changes on every build, so installed copies pick up updates and offer a reload.

## Content note

Woodshed ships **chord changes only**. It doesn't include melodies or lyrics for any song. The changes follow common fake-book versions, which vary from source to source, so use the builder to match the version you know. Any melodies or lyrics you add are stored only in your own browser.

## Caveats

The measurements are practice aids, not a voice teacher. Breathiness and brightness depend heavily on your microphone and vowel. If singing hurts, or hoarseness lasts more than a day, stop and see a professional.

## License

MIT. See [LICENSE](LICENSE).
