# KlausUSA.com — Agent Notes

This file is maintained by the AI coding agent to track site details, decisions, and change history.

---

## Site Overview

**Client:** Klaus Multiparking Inc. (US entity, Berkeley, CA)  
**Purpose:** Static multi-page marketing website for automated/mechanical parking systems  
**Repo:** `git@github.com:IM2MikeJones/KlausUSA.com.git`  
**Branch:** `main`  
**Deployed as:** Static files (no build step required)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Languages | HTML5, vanilla CSS, vanilla JavaScript (ES6+) |
| Build system | None — pure static files |
| Fonts | Google Fonts (Roboto, Saira, Saira Semi Condensed) via CDN |
| Icons | Font Awesome 4.7 via cdnjs CDN |
| Design system | Custom Material Design 3–inspired CSS (`css/material3-theme.css`) |

---

## File Structure

```
KlausUSA.com/
├── index.html              # Home page
├── products.html           # Product family grid
├── service.html            # Service / support
├── company.html            # Company info (anchor: #environment)
├── projects.html           # Projects listing (CSV-driven)
├── FAQ.html                # FAQ accordion
├── trendvario.html         # TrendVario product family hub
├── trendvario6100.html     # TrendVario 6100 detail
├── trendvario6200.html     # TrendVario 6200 detail
├── trendvario6300.html     # TrendVario 6300 detail (inline video-hover JS)
├── MultiBase.html          # MultiBase product family hub
├── MultiBase2072i.html     # MultiBase 2072i detail
├── MultiBase2078i.html     # MultiBase 2078i detail
├── MultiBaseG63.html       # MultiBase G63 detail
├── MultiBaseU10.html       # MultiBase U10 detail
├── MultiBaseU20.html       # MultiBase U20 detail
├── parkboardPQ.html        # ParkBoard PQ detail
├── SpaceVarioCP61.html     # SpaceVario CP61 detail
├── tenThousand.html        # Project case study: Ten Thousand LA
├── TheBrady.html           # Project case study: The Brady
├── TheRockwell.html        # Project case study: The Rockwell
├── css/
│   └── material3-theme.css # Main theme, layout, all component styles (~2900+ lines)
├── js/
│   ├── material3-components.js  # Shared UI: nav drawer, dropdowns, modals, accordions
│   ├── projects-loader.js       # Fetches/renders project listing cards from CSVs
│   └── project-loader.js        # Individual case study page: CSV + carousel loader
├── assets/
│   ├── img/                # All site images (JPG, PNG, SVG, GIF, WebP)
│   ├── docs/               # Downloadable PDFs, DWG, ZIP, DOC files
│   └── videos/             # MP4 product videos
├── projects/
│   ├── tenThousand/        # project.csv, header.jpg, carousel/
│   ├── TheBrady/           # project.csv, header.jpg, carousel/
│   └── TheRockwell/        # project.csv, header.jpg, carousel/
├── KlausUSA style guidelines color chart.pdf
├── AGENT_NOTES.md          # This file
└── .gitignore
```

---

## Key Design Decisions

- **No templating engine** — header/footer HTML is duplicated across every page. Any site-wide nav/footer changes require editing all ~20 HTML files.
- **Material Design 3–inspired** — the color system and component tokens are custom-built in `css/material3-theme.css` using CSS variables (`--md-sys-color-*`), NOT the official MDC Web library.
- **CSV-driven projects** — adding a new project case study only requires creating a folder under `projects/` with `project.csv`, `header.jpg`, and `carousel/images.txt`, then adding the folder name to `projects-loader.js` and creating a `<name>.html` page.
- **All assets tracked in git** — including videos (MP4) and docs (PDF, DWG, ZIP). No `.gitignore` rules for binary assets.

---

## Known Issues / Open Items

- [ ] **`<a href="#">` placeholder** in footer — one image link is unfinished.
- [ ] **Video filename mismatch** — `trendvario6300.html` references `TrendVario4300.mp4` (old naming). Confirm this is intentional or a stale reference.
- [ ] **Header/footer duplication** — consider a templating approach (e.g. JS includes, or a static site generator) if maintenance becomes burdensome.
- [ ] **No CI/CD or deployment config** in repo — deployment process is manual.

---

## Content / Contact Info

- **Phone:** +1.925.284.2092
- **Email:** sales@KlausUSA.com
- **Parts store:** Square Online — `my-site-103786-100042.square.site`
- **Corporate:** us.multiparking.com
- **Social:** Facebook, X (Twitter), YouTube, LinkedIn, Instagram

---

## Change Log

### v1.1.0 — 2026-03-24
- Deleted `Energy Chain.html` (orphaned page, no internal links pointing to it)
- Deleted `js/system-config.js` (unfinished parking configurator, never wired into any HTML page)
- Deleted `css/system-config.css` (styles for the above unused configurator)
- Confirmed all assets (95 files across `assets/img/`, `assets/docs/`, `assets/videos/`) are fully tracked in git — no missing assets issue
- Created `AGENT_NOTES.md` (this file)

### v1.0.0 — Initial release
- KlausSite2026 static site: full product catalog, project case studies, service/company/FAQ pages
