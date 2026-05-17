# EnderJones New Blog

Astro-based personal blog / research portfolio.

Current direction: editorial notebook / research archive homepage, posts archive, post detail, worklog,
tags, and about pages.

## Development

This project is Docker-first to avoid polluting the local Node.js environment.

Start the dev server:

```sh
docker compose up -d site
```

Open:

```txt
http://localhost:4321
```

View logs:

```sh
docker compose logs -f site
```

Run build and type check:

```sh
docker compose run --rm site npm run build
```

Audit migrated content against the working old blog:

```sh
docker compose run --rm site npm run audit:old-blog
```

Run the full local release gate:

```sh
docker compose run --rm site npm run release:check
```

Stop the dev server:

```sh
docker compose down
```

Remove Docker dependency/cache volumes if you want a clean reinstall:

```sh
docker compose down -v
```

## Deployment

The site is static Astro output and is ready for Cloudflare Pages or GitHub Pages.

Cloudflare Pages settings:

```txt
Production branch: main
Build command: npm run build
Build output directory: dist
Node version: 22.16.0
```

GitHub Pages settings:

```txt
Source: GitHub Actions
Artifact directory: dist
Custom domain: enderjones.com
```

Pushes to `main` run `.github/workflows/build.yml`, build the Astro site, upload `dist`, and deploy it to GitHub Pages. Pull requests only build and validate.

The built artifact includes `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, and Google site verification.

## Comments

Comments use Giscus with GitHub Discussions and stay opt-in per post.

- Site config lives in `src/data/site.yml` under `comments.giscus`.
- A post shows comments only when its frontmatter has `comments: true`.
- Worklogs do not accept comments.
- Before publishing a commented post, confirm the Giscus GitHub app is installed for `Ender-Jones/personal_blog_astro`.

## Notes

- Dependencies live in Docker named volumes, not in a normal project `node_modules/`.
- Node is pinned to 22.16.0 for local, GitHub, and Cloudflare builds.
- `reference/` is read-only design/content reference.
- Homepage code lives in `src/pages/index.astro` and `src/components/home/`.
- Post math is rendered statically with `remark-math`, `rehype-katex`, and KaTeX CSS.
- Markdown admonitions use `:::info`, `:::tip`, `:::note`, `:::warning`, and `:::danger`.
- Homepage Marginalia reads only post frontmatter; quote-style entries use `marginalia.quote.lines` with optional `author`, `work`, and `year`.
- `npm run build` validates source content, type checks Astro, builds static output, then verifies the deployable `dist/` artifact.
- Source validation blocks unsupported Kramdown attributes, inline styles, bad images, broken internal links, empty public thread blocks, invalid Marginalia, worklog comments, missing Giscus config for enabled comments, missing tag metadata, runtime API calls, and unsupported `draft:` frontmatter`.
- The Markdown pipeline preserves supported Chirpy/Kramdown migration semantics for prompt blocks and image layout attributes such as `.w-50`, `.w-75`, `.left`, `.right`, `width`, and `height`.
- Artifact verification checks required deploy files, generated routes, sitemap/robots, Homepage Marginalia output, Giscus output rules, and runtime API calls in built HTML/JS.
- Unfinished writing belongs in root `drafts/`, not `src/content`; no `draft: true` publishing path is used.
- The working old blog reference is `/Users/ender/Documents/Git/Ender-Jones.github.io`; this new site targets the same final domain.
- Active runtime images live under `public/img/`; `public/assets/img/` is kept for favicons and migrated inline post images.
