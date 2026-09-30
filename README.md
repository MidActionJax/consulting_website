# Jaxon Doolittle, Technical Consulting

Single-page static site. Plain HTML, CSS and vanilla JS: no framework, no build step. Open `index.html` directly or serve the repo root from GitHub Pages.

Live at **https://jaxondoolittle.com/** (GitHub Pages from `main`, custom domain set by `CNAME`).

```
index.html        page markup and copy
styles.css        "Aurora glass" design system
main.js           nav, reveals, count-ups, contact form, adaptive quality, particle field
networks.js       "Trusted by" panel under the hero, built from a list of programs
404.html          not-found page, fully self-contained so it works at any URL depth
assets/           favicon.svg, apple-touch-icon.png, og-image.png, Capability_Statement_Doolittle.pdf
robots.txt        crawler rules
sitemap.xml       one-page sitemap
.nojekyll         tells GitHub Pages to serve files as-is
CNAME             custom domain for GitHub Pages (added on GitHub, keep it)
```

The contact form posts to Formspree (form `meaodvov`, formspree.io dashboard) and lands in Gmail.

## Trusted by

Edit the `PROGRAM_NETWORKS` list at the top of `networks.js` and set an entry's `confirmed` to `true` to show it in the panel under the hero. One confirmed program shows as a featured card, two sit side by side, and three or more become a carousel. Each entry has `org`, `state` (two-letter code), `role` and a one-line `detail`. Optional: `featured: true` puts it first, opens the carousel on it and pins a badge under the headline once the carousel is active; `chip` adds a highlighted hero chip; `about` adds a line to the About credentials. All of these disappear if the entry is switched off. Only do that once the program has confirmed the role in writing **and** agreed to being named on the site. With every entry `false`, the section does not appear at all.

## Still to do

- [ ] **Headshot (optional).** Save a square photo of at least 600px as `assets/headshot.webp` and swap it in where the `[PLACEHOLDER: headshot]` comment sits in the About section. Until then the "JD" initials show.
- [ ] **Enforce HTTPS.** Settings → Pages → tick "Enforce HTTPS" once GitHub has issued the certificate for jaxondoolittle.com.
- [ ] **Writing section.** Not in v1 (spec 3.9). Add it only after rereading the article for University of Michigan specifics.
