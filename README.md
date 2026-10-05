# Jaxon Doolittle, Technical Consulting

Single-page static site. Plain HTML, CSS and vanilla JS: no framework, no build step. Open `index.html` directly or serve the repo root from GitHub Pages.

Live at **https://jaxondoolittle.com/** (GitHub Pages from `main`, custom domain set by `CNAME`).

```
index.html        page markup and copy
styles.css        "Aurora glass" design system
main.js           nav, reveals, count-ups, contact form, adaptive quality, particle field
404.html          not-found page, fully self-contained so it works at any URL depth
assets/           favicon.svg, apple-touch-icon.png, og-image.png, Capability_Statement_Doolittle.pdf
robots.txt        crawler rules
sitemap.xml       one-page sitemap
.nojekyll         tells GitHub Pages to serve files as-is
CNAME             custom domain for GitHub Pages (added on GitHub, keep it)
```

The contact form posts to Formspree (form `meaodvov`, formspree.io dashboard) and lands in Gmail.

## Referral network

The section under the hero chips reads "Referral resource for SBIR support programs in N states" and shows a US map. Both are set at the top of `main.js`:

- `REFERRAL_STATE_COUNT`: the N in the headline (also update the fallback number in `index.html`, shown when JavaScript is off).
- `MAP_STATES`: postal codes of the states highlighted on the map. Only add a state once its program has agreed to the state being shown. If the map shows fewer states than the headline counts, a small caption says so.

Programs are never named on the site. The map outlines come from the U.S. Census Bureau's 2017 cartographic boundary files (public domain), via the `us-atlas` package, converted to static SVG paths inline in `index.html`.

## Still to do

- [ ] **Headshot (optional).** Save a square photo of at least 600px as `assets/headshot.webp` and swap it in where the `[PLACEHOLDER: headshot]` comment sits in the About section. Until then the "JD" initials show.
- [ ] **Enforce HTTPS.** Settings → Pages → tick "Enforce HTTPS" once GitHub has issued the certificate for jaxondoolittle.com.
- [ ] **Writing section.** Not in v1 (spec 3.9). Add it only after rereading the article for University of Michigan specifics.
