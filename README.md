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

Stop the dev server:

```sh
docker compose down
```

Remove Docker dependency/cache volumes if you want a clean reinstall:

```sh
docker compose down -v
```

## Notes

- Dependencies live in Docker named volumes, not in a normal project `node_modules/`.
- `reference/` is read-only design/content reference.
- Homepage code lives in `src/pages/index.astro` and `src/components/home/`.
- Post math is rendered statically with `remark-math`, `rehype-katex`, and KaTeX CSS.
- Active runtime images live under `public/img/`; `public/assets/img/` is kept for favicons and migrated inline post images.
