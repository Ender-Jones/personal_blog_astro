# EnderJones New Blog

Astro-based personal blog / research portfolio.

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
- The current page is only a Phase 1 scaffold; the Bento homepage implementation has not started yet.

