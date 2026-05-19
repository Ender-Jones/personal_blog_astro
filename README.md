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

The old blog audit is strict when `OLD_BLOG_DIR` is available. In isolated containers it skips if the old repo is not mounted; set `AUDIT_OLD_BLOG_REQUIRED=1` to make missing old content fail.

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

The site is static Astro output. GitHub Actions is only the release gate; production and staging run on Cloudflare Pages.

Cloudflare Pages settings:

```txt
Production branch: main
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Node version: 22.16.0
```

Cloudflare project:

- Production URL: `https://enderjones.com`
- Cloudflare Pages project: `personal-blog-astro`
- GitHub repo: `Ender-Jones/personal_blog_astro`
- Old Jekyll repo/project should stay archived, not deleted.

Cloudflare dashboard setup for a fresh project:

1. Open Workers & Pages.
2. Select Create application.
3. Choose Pages, then Import an existing Git repository.
4. Connect GitHub and select `Ender-Jones/personal_blog_astro`.
   Do not select `Ender-Jones/Ender-Jones.github.io`; that is the old site.
5. Set the project name, for example `enderjones-new-blog`.
6. Set the production branch to `main`.
7. Select the Astro preset, or fill the build settings manually:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave blank
8. Set `NODE_VERSION=22.16.0` for both Production and Preview if Cloudflare asks for an environment variable. The repo also has `.node-version`.
9. Select Save and Deploy.
10. Use the generated `*.pages.dev` URL for staging checks before attaching a custom domain.

Use the Cloudflare Pages `*.pages.dev` deployment as staging. Do not use the GitHub project Pages URL as preview because this site is built for the root path and final domain.

Only move `enderjones.com` after the `*.pages.dev` staging site passes checks. Keep the old Cloudflare Pages project for historical deployments and analytics context.

Pushes to `main` run `.github/workflows/build.yml` and validate the Astro build. Cloudflare Pages performs the actual deploy.

The built artifact includes `_headers`, `robots.txt`, `sitemap.xml`, and Google site verification.

## Comments

Comments use Giscus with GitHub Discussions and are enabled by default for posts.

- Site config lives in `src/data/site.yml` under `comments.giscus`.
- Set `comments: false` in a post frontmatter to disable comments for that post.
- Worklogs do not accept comments.
- The repo/category ids point to `Ender-Jones/personal_blog_astro` and the `General` Discussions category; Giscus app authorization has been confirmed on the Cloudflare preview deployment.

## Notes

- Dependencies live in Docker named volumes, not in a normal project `node_modules/`.
- Node is pinned to 22.16.0 for local, GitHub, and Cloudflare builds.
- Homepage code lives in `src/pages/index.astro` and `src/components/home/`.
- Post math is rendered statically with `remark-math`, `rehype-katex`, and KaTeX CSS.
- Rich post content uses MDX components from `src/components/content/`, including `Figure`, `Epigraph`, `Callout`, and `Poem`.
- Homepage Marginalia reads only post frontmatter; quote-style entries use `marginalia.quote.lines` with optional `author`, `work`, and `year`.
- `npm run build` validates source content, type checks Astro, builds static output, then verifies the deployable `dist/` artifact.
- Build and audit scripts share helpers from `scripts/lib/content-utils.mjs`; keep validation helper logic centralized there.
- Source validation blocks Kramdown attr-lists, remark directive callouts, inline styles, bad images, broken internal links, empty public thread blocks, invalid Marginalia, worklog comments, missing Giscus config for enabled comments, missing tag metadata, runtime API calls, and unsupported `draft:` frontmatter.
- Old post layout semantics have been migrated into explicit MDX content components; new posts should use components instead of Chirpy/Kramdown image or prompt syntax.
- Artifact verification checks required deploy files, generated routes, sitemap/robots, Homepage Marginalia output, Giscus output rules, and runtime API calls in built HTML/JS.
- Unfinished writing belongs in root `drafts/`, not `src/content`; no `draft: true` publishing path is used.
- The working old blog is `/Users/ender/Documents/Git/Ender-Jones.github.io`; use `OLD_BLOG_DIR` if it lives elsewhere.
- Active runtime images live under `public/img/`; `public/assets/img/` is kept only for favicons and migrated inline post images still referenced by MDX.
