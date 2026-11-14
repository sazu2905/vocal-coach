#!/usr/bin/env python3
"""Build Woodshed into a single index.html (plus a versioned sw.js) at the repo root.

Usage:  python3 build.py
"""
import hashlib
import pathlib

root = pathlib.Path(__file__).resolve().parent
src = root / "src"

app = (src / "app.js").read_text(encoding="utf-8")
app = app.replace("/*__STD__*/", (src / "standards.js").read_text(encoding="utf-8"))
app = app.replace("/*__BUILDER__*/", (src / "builder.js").read_text(encoding="utf-8"))
app = app.replace("/*__TRENDS__*/", (src / "trends.js").read_text(encoding="utf-8"))

html = (src / "index.html").read_text(encoding="utf-8")
html = html.replace("/*__CSS__*/", (src / "style.css").read_text(encoding="utf-8"))
html = html.replace("/*__DSP__*/", (src / "dsp.js").read_text(encoding="utf-8"))
html = html.replace("/*__APP__*/", app)
(root / "index.html").write_text(html, encoding="utf-8")

version = hashlib.sha256(html.encode("utf-8")).hexdigest()[:12]
sw = (src / "sw.template.js").read_text(encoding="utf-8").replace("__VERSION__", version)
(root / "sw.js").write_text(sw, encoding="utf-8")
print(f"index.html: {len(html):,} bytes · sw.js version {version}")
