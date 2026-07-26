# FifthStar Client Portal (MVP · demo-first)

> Zero-server client dashboard. A signed merchant opens a private link and sees, in one
> quiet view: **① review replies** · **② website status + change requests** · **③ billing & renewal**.
> No apps, no login walls, no backend.

## Design principles (from BOS §10 + DL v1.0)
- **Zero-server**: static HTML + `fetch('./data.json')`. Each merchant = one folder with a `data.json`. Token = folder name (read-only, no auth backend).
- **All-dark shell + brand gold constant**: reuses `../assets/base.css`. Per-merchant `--accent` carries the 20% personality (set in `data.json → merchant.accent`).
- **Three views** (BOS §10): review reply calendar · website preview + change requests · billing & renewal.
- **"Pay when happy" preserved**: Portal only *shows* status; payment still goes through PayPal invoice email (no in-portal checkout yet).
- **PII-safe**: sample data only. Real client folders live under `customer-system/<slug>/` (gitignored) and their `data.json` is generated from the same template — never committed with real PII.

## Files
```
client-portal/
├── index.html              ← portal entry (pick a business)
├── portal.css              ← dashboard layout extension (base.css tokens)
├── portal.js               ← renderer: fetch ./data.json → three views
├── delhi-wala/
│   ├── index.html          ← merchant dashboard (accent amber)
│   └── data.json           ← sample data (sample:true)
└── mcEwan-fraser/
    ├── index.html          ← merchant dashboard (accent slate)
    └── data.json           ← sample data (sample:true)
```

## Why demo-first (not full build)
BOS §11 ("70/30 validation") explicitly says **don't build Client Portal full features yet** —
0 customers = nothing to show. This MVP is built from the **two real showcase clients**
(Delhi Wala, McEwan Fraser) so it doubles as:
1. a **sales asset** — show a prospect exactly what they get after signing; and
2. the **production template** — when a real merchant onboards, copy `<slug>/` + swap `data.json`.

## Onboard a real client (steps)
1. `cp -r delhi-wala <real-slug>` (or reuse mcEwan-fraser shell).
2. Edit `<real-slug>/data.json`: set `sample:false`, real `merchant`/`subscription`/`reviewCalendar`/`website`/`insights`.
3. Keep `<real-slug>/` **out of the public repo** — `customer-system/` is already gitignored; the generated portal should mirror that (don't `git add` real client folders).
4. Hand the merchant the link `thefifthstar.site/client-portal/<real-slug>/` (optionally a signed URL later).
5. Sync the whole `client-portal/` tree to `thefifthstar-live/` (same manual deploy as other pages).

## Deploy
Manual, like the rest of FifthStar (BOS deploy §4.5): cp `client-portal/` → `thefifthstar-live/client-portal/` → add specified files → commit → push (sandbox-off). Internal links already use explicit `index.html` where needed; `portal.js`/`portal.css` shared via `../`.

## Known limits (MVP, intentional)
- No write-back (merchant can't submit change requests in-portal yet — uses mailto).
- No auth/signing beyond folder token (fine for 0–early customers; add signed URL if needed).
- Sample data is hand-written, not wired to `customer-system/` yet.
