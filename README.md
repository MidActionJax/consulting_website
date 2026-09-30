# Jaxon Doolittle, Technical Consulting

Single-page static site. Plain HTML, CSS and vanilla JS: no framework, no build step. Open `index.html` directly or serve the repo root from GitHub Pages.

Live at **https://midactionjax.github.io/consulting_website/** once Pages is on (Settings → Pages → Deploy from branch → `main` / root).

```
index.html        page markup and copy
styles.css        "Aurora glass" design system
main.js           nav, reveals, count-ups, copy button, particle field
404.html          not-found page, fully self-contained so it works at any URL depth
assets/           favicon.svg, apple-touch-icon.png, og-image.png
robots.txt        crawler rules (only read when the site sits at a domain root)
sitemap.xml       one-page sitemap
.nojekyll         tells GitHub Pages to serve files as-is
```

## Still to do

- [ ] **Add `assets/Capability_Statement_Doolittle.pdf`.** Until it exists, the three "Download one pager" buttons hide themselves. Upload the file and they appear automatically, with no code change.
- [ ] **Headshot (optional).** Save a square photo of at least 600px as `assets/headshot.webp` and swap it in where the `[PLACEHOLDER: headshot]` comment sits in the About section. Until then the "JD" initials show.
- [ ] **Custom domain.** When it's bought, replace `https://midactionjax.github.io/consulting_website/` with `https://DOMAIN/` in `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `sitemap.xml` and `robots.txt`, add a `CNAME` file containing the domain, and turn on "Enforce HTTPS" under Settings → Pages. `404.html` needs no change.
- [ ] **Writing section.** Not in v1 (spec 3.9). Add it only after rereading the article for University of Michigan specifics.
- [ ] **Expert reviewer line.** Commented out in the About section. Uncomment it once it's confirmed in writing.
