# Jaxon Doolittle, Technical Consulting

Single-page static site. Plain HTML, CSS and vanilla JS: no framework, no build step. Open `index.html` directly or deploy the repo root to GitHub Pages as is.

```
index.html      page markup and copy
styles.css      "Aurora glass" design system
main.js         nav, reveals, count-ups, copy button, particle field
404.html        not-found page (uses root-relative paths)
assets/         favicon.svg, og-image.png, Capability_Statement_Doolittle.pdf
```

## Still to do before launch

- [ ] **Add `assets/Capability_Statement_Doolittle.pdf`.** The three "Download one pager" links point here. The file was not in the repo.
- [ ] **Headshot (optional).** Save a square photo of at least 600px as `assets/headshot.webp` and swap it in where the `[PLACEHOLDER: headshot]` comment sits in the About section. Until then the "JD" initials show.
- [ ] **Domain.** Once it's bought: uncomment the canonical tag in `<head>`, switch the `og:image` and `twitter:image` URLs to absolute `https://DOMAIN/assets/og-image.png`, and add a `CNAME` file.
- [ ] **Writing section.** Not included in v1 (spec 3.9). Add it only after rereading the article for University of Michigan specifics.
- [ ] **Expert reviewer line.** It's commented out in the About section. Uncomment it only once it's confirmed in writing.

## Deploy (GitHub Pages)

Settings → Pages → Deploy from branch → `main` / root. If the site is served from a project subpath (`username.github.io/repo/`) rather than a custom domain, change the `/` prefixes in `404.html` to `/repo/`.
