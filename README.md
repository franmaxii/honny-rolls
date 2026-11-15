# Chibi Rolls · Menú

Menú kawaii con carrito que arma el pedido y lo manda por WhatsApp.
Astro (sitio estático) + Cloudflare Pages (sin adapter).

## Comandos

| Comando           | Qué hace                                                   |
| ----------------- | ---------------------------------------------------------- |
| `npm install`     | Instala dependencias                                        |
| `npm run dev`     | Servidor de desarrollo en `http://localhost:4321`           |
| `npm run build`   | Genera el sitio en `dist/`                                  |
| `npm run preview` | Build + lo sirve como Cloudflare Pages (`:8788`)            |
| `npm run deploy`  | Build + deploy a Cloudflare Pages                           |
| `npm run check`   | Chequeo de tipos                                            |

## Qué editar

- **Número de WhatsApp, nombre y crédito:** `src/data/config.ts`
- **Productos, precios, categorías y fotos:** `src/data/menu.ts`
  (las fotos van en `src/assets/img/`; Astro las optimiza solo)
- **Colores:** variables al principio de `src/styles/global.css`

## Deploy en Cloudflare Pages

**Desde la terminal (Direct Upload)**

```sh
npx wrangler login                                                   # una sola vez
npx wrangler pages project create chibi-rolls --production-branch main   # una sola vez
npm run deploy
```

Queda publicado en `https://chibi-rolls.pages.dev`, o con un sufijo si ese nombre ya está usado.
El nombre del proyecto sale de `name` en `wrangler.jsonc`.

**Desde GitHub (deploy automático en cada push)**

En el dashboard: *Workers & Pages → Create → Pages → Import an existing Git repository*, elegí el repo y usá:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

> Un proyecto de Pages creado por Direct Upload no se puede pasar después a Git:
> elegí una de las dos formas desde el principio.

Para usar un dominio propio: *Workers & Pages → chibi-rolls → Custom domains*.
