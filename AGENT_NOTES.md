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
| Build system | Eleventy (11ty) v3 — runs `npx eleventy` to generate `_site/` |
| Templating | Nunjucks (`.njk`) — shared layout, head, header, footer partials |
| Fonts | Google Fonts (Roboto, Saira, Saira Semi Condensed) via CDN |
| Icons | Font Awesome 4.7 via cdnjs CDN |
| Design system | Custom Material Design 3–inspired CSS (`css/material3-theme.css`) |

---

## File Structure

```
KlausUSA.com/
├── .eleventy.js            # Eleventy build config (passthrough copies, htmlTemplateEngine: njk)
├── _includes/
│   ├── layout.njk          # Master layout: head + header + content + footer + scripts
│   ├── head.njk            # <head> boilerplate (title, description, CSS links)
│   ├── header.njk          # Top app bar + mobile nav drawer (navActive conditional)
│   └── footer.njk          # Footer with social links, contact, copyright
├── _data/
│   └── eleventyComputed.js # Sets permalink to /filename.html (flat output, no subdirs)
├── _site/                  # Build output — SFTP this directory to web server (gitignored)
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
├── package.json            # npm scripts: build (eleventy), dev (eleventy --serve)
├── node_modules/           # (gitignored)
├── KlausUSA style guidelines color chart.pdf
├── AGENT_NOTES.md          # This file
└── .gitignore
```

---

## Key Design Decisions

- **Eleventy (11ty) SSG** — all 21 pages use Nunjucks `{% extends "layout.njk" %}` template inheritance. Shared head/header/footer live in `_includes/`. Build runs in under 1 second; output in `_site/`.
- **Deployment: manual SFTP** — run `npm run build` to generate `_site/`, then SFTP the entire `_site/` directory to the remote web server. The `_site/` directory is gitignored. No server-side processing needed.
- **Flat HTML output** — `_data/eleventyComputed.js` sets `permalink` so all pages output as `_site/filename.html` (not `_site/filename/index.html`). This preserves all existing internal links (e.g. `href="FAQ.html"`) without any URL changes.
- **Front matter flags for page-specific scripts** — pages set `videoHover: true`, `projectLoader: true`, or `projectsLoader: true` in YAML front matter; the layout conditionally injects the appropriate script blocks. Pages needing unique HTML (modals) use `{% block afterContent %}`.
- **Active nav highlighting** — each page sets `navActive: <key>` in front matter (e.g. `about`, `products`, `faq`). `header.njk` applies `m3-navigation__link--active` / `m3-navigation-drawer__link--active` via Nunjucks conditionals.
- **Material Design 3–inspired** — the color system and component tokens are custom-built in `css/material3-theme.css` using CSS variables (`--md-sys-color-*`), NOT the official MDC Web library.
- **CSV-driven projects** — adding a new project case study only requires creating a folder under `projects/` with `project.csv`, `header.jpg`, and `carousel/images.txt`, then adding a `<name>.html` page (copy from `tenThousand.html`).
- **All assets tracked in git** — including videos (MP4) and docs (PDF, DWG, ZIP). No `.gitignore` rules for binary assets.

## Development Workflow

```bash
# Install dependencies (first time only)
npm install

# Local development with live reload
npm run dev       # serves at http://localhost:8080

# Build for deployment
npm run build     # outputs to _site/

# Deploy
# SFTP the contents of _site/ to the web server root
```

---

## Known Issues / Open Items

- [ ] **`<a href="#">` placeholder** in footer (`_includes/footer.njk`) — one image link (clipboard-image-1.png) is unfinished.
- [ ] **Video filename mismatch** — `trendvario6300.html` references `TrendVario4300.mp4` (old naming). Confirm this is intentional or a stale reference.
- [ ] **No CI/CD or deployment config** in repo — deployment process is manual SFTP.
- [ ] **MultiBaseG63/U10 header images** — original pages referenced `multiBaseG63HeaderImage.png` / `multiBaseU10HeaderImage.png` which don't exist in assets. Updated to use actual tracked filenames (`G63HeaderImage.jpg`, `MultibaseHeaderU10.jpg`).
- [ ] **ParkBoard datasheet link** — original referenced `ParkBoard Datasheet.pdf` (with space); corrected to `ParkBoardPQ.pdf` (the actual tracked filename).

---

## Content / Contact Info

- **Phone:** +1.925.284.2092
- **Email:** sales@KlausUSA.com
- **Parts store:** Square Online — `my-site-103786-100042.square.site`
- **Corporate:** us.multiparking.com
- **Social:** Facebook, X (Twitter), YouTube, LinkedIn, Instagram

---

## Change Log

### v1.2.0 — 2026-03-24
- Implemented Eleventy (11ty) v3 static site generator with Nunjucks templating
- Created `_includes/layout.njk`, `head.njk`, `header.njk`, `footer.njk` — eliminating ~3,500 lines of duplicated HTML across all pages
- Converted all 21 HTML pages to Eleventy templates using `{% extends "layout.njk" %}` with YAML front matter
- Active nav link highlighting driven by `navActive` front matter variable (no JS needed)
- Page-specific scripts (`videoHover`, `projectLoader`, `projectsLoader`) handled via layout conditionals — no inline script duplication
- Unique page elements (modals on `index.html` and `company.html`) placed in `{% block afterContent %}` / `{% block extraScripts %}`
- Added `package.json` with `npm run build` and `npm run dev` scripts
- Added `_data/eleventyComputed.js` for flat `.html` output (no subdirectory pretty URLs)
- Updated `.gitignore` to exclude `node_modules/` and `_site/`
- Fixed broken asset references: `multiBaseG63HeaderImage.png` → `G63HeaderImage.jpg`, `multiBaseU10HeaderImage.png` → `MultibaseHeaderU10.jpg`, `ParkBoard Datasheet.pdf` → `ParkBoardPQ.pdf`
- Deployment workflow unchanged: run `npm run build`, SFTP `_site/` to web server

### v1.1.0 — 2026-03-24
- Deleted `Energy Chain.html` (orphaned page, no internal links pointing to it)
- Deleted `js/system-config.js` (unfinished parking configurator, never wired into any HTML page)
- Deleted `css/system-config.css` (styles for the above unused configurator)
- Confirmed all assets (95 files across `assets/img/`, `assets/docs/`, `assets/videos/`) are fully tracked in git — no missing assets issue
- Created `AGENT_NOTES.md` (this file)

### v1.0.0 — Initial release
- KlausSite2026 static site: full product catalog, project case studies, service/company/FAQ pages
