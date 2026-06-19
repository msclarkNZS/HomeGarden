# Glenbrook Garden Manager

A self-contained web app for planning and tracking a home vegetable garden,
orchard and berry patch. It runs entirely in the browser — your garden is saved
on your device (IndexedDB), and the only network calls are the live weather and
the place-search lookup (both free, key-less, from Open-Meteo).

It's a PWA: open the site once, then "Add to Home Screen" on a phone or tablet to
get an app icon and a full-screen, app-like experience. One codebase serves
phone, tablet and desktop — the layout adapts to the screen.

---

## Option A — just publish it (no tools needed)

The `dist/` folder is the finished website. Upload its **contents** to any static
host and you're live. Good free options:

- **Netlify Drop** — go to app.netlify.com/drop and drag the `dist` folder onto the page.
- **Cloudflare Pages / Vercel** — create a project, upload `dist` (or connect a repo).
- **GitHub Pages** — push `dist` to a repo's Pages branch.

Use a **stable URL** and always deploy future versions to that **same URL** — that's
what keeps your saved garden between updates (browser storage is tied to the web
address, not the code).

> HTTPS is required for the install-to-home-screen / service-worker features. All
> the hosts above serve HTTPS automatically.

## Publishing with GitHub Pages

This project includes a workflow that builds and deploys automatically.

**Recommended — automatic build on push (`.github/workflows/deploy.yml`):**

1. Create a repo (or use your existing one) and push these project files to the
   `main` branch — the whole folder, not just `dist`.
2. In the repo: **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
3. Done. Every push to `main` rebuilds and republishes. Your site lives at
   `https://<your-username>.github.io/<repo-name>/`.

The build sets relative paths, so it works from that project sub-URL without any
config changes. HTTPS (needed for the install-to-home-screen / offline features)
is automatic.

**Or — publish the prebuilt folder only (no Actions):** push just the *contents*
of `dist/` to a branch, then Settings → Pages → Source = "Deploy from a branch"
and pick that branch. You'd repeat the upload each time you change the app, which
is why the workflow above is easier long-term.

> Keep the same repo/URL for future updates — that's what preserves your saved
> garden between versions.

## Option B — make changes, then rebuild

You need Node.js 18+ installed.

```bash
npm install      # first time only
npm run dev      # local preview at http://localhost:5173 while editing
npm run build    # writes the deployable site to dist/
```

Then publish `dist/` as in Option A. Almost all of the app lives in one file:
`src/GardenManager.jsx`.

---

## Will updating wipe my beds?

No — as long as you:

1. Deploy to the **same URL** each time, and
2. Keep the data-migration discipline: the app loads saved data through a
   `normalize()` function and a versioned key (`glenbrook-garden:v2`). If you ever
   change the *shape* of the saved data, teach `normalize()` how to read the old
   shape so existing gardens upgrade cleanly instead of being lost.

## The real safety net: backup files

Open **Settings (the gear, top-right) → Backup & restore**:

- **Download backup** saves your entire garden — beds, plantings, plans, photos and
  settings — as one `.json` file.
- **Restore from file** loads one back in (on any device, any version).

This is your protection against a cleared browser, a new phone, a botched update,
or wanting the same garden in two places. Take a backup now and then, and
especially before deploying a new version.

## Moving to automatic multi-device sync (later)

Manual backup/restore covers "don't lose it" and "move it between devices". If you
later want the garden to sync automatically across phone/tablet/computer, that's a
future upgrade: point the storage layer at a small cloud store (e.g. Supabase or
Firebase). The storage functions are isolated near the top of `GardenManager.jsx`
(`rawGet` / `rawSet`), so that change is contained to one place.

---

## What's where

```
garden-app/
  index.html              app shell (mobile viewport, full-page styles)
  vite.config.js          build + PWA (service worker, manifest, icons)
  package.json
  public/
    icon.svg, icon-*.png   app icons
  src/
    main.jsx              entry point
    GardenManager.jsx     the whole app
  dist/                   ← built, deployable site (publish this)
```
