# zalog.alters.si

Bouldering guide for Zalog near Ljubljana: wall photos with the problems
drawn on, names, grades and notes. Live at
[zalog.alters.si](https://zalog.alters.si). Static [Astro](https://astro.build)
site, in Slovene.

```sh
npm ci
npm run dev   # http://localhost:4321
```

- `src/walls.ts`: all walls and problems, the parking and quarry coordinates.
  Each problem's `line` is a few points from start to finish in the photo's
  viewBox (750×1000 for portrait photos, 1000×750 for landscape).
- `src/topo.ts`: draws the lines as SVG over the photo (smoothed curve, start
  bar, arrow, number badge, colour by grade). Used on the page and for the JPGs.
- `src/photos/`: one clean photo per wall (no lines drawn in), named after the
  wall (`Ne bor` → `ne-bor.jpg`). `src/photos/okolica/`: walls without lines yet,
  not on the page.
- `src/pages/topo/[slug].jpg.ts`: renders each wall as a JPG for the
  "Shrani sliko" button (lines composited with sharp, layout with Satori).
- Filters (search, grade range, ticked/projects, variants) and the ✓/☆ list run
  in the page script in `index.astro`. Ticks are kept in localStorage.
- `public/sw.js`: service worker. The build fills in the list of files, so one
  visit saves the whole guide for offline use.
- `public/manifest.webmanifest`: lets phones install it as an app.

"Shrani PDF" is the browser's print dialog; the print styles are in
`index.astro`.

## Delivery

GitHub mirrors `main` to GitLab, GitLab CI builds the image (tag = short
commit SHA) and publishes the chart in `chart/` (version `0.1.<pipeline>`).
Deploy: bump the chart version in the homelab repo.
