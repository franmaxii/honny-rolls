// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// Mochiy Pop One es una fuente japonesa enorme: le pedimos a Google solo los caracteres
// que usamos (latín con acentos + el japonés de la cinta). Si agregás texto en japonés
// con esta fuente, sumá esos caracteres acá.
/** @param {number} from @param {number} to */
const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i));
const MOCHIY_GLYPHS = [
  ...range(0x20, 0x7e), // ASCII
  ...range(0xa1, 0xff), // ¡¿áéíóúñü×…
  ..."シナモンロールかわいいあれ？♡…",
];

// https://astro.build/config
export default defineConfig({
  // Cuando tengas el dominio final, ponelo acá (mejora las previews al compartir el link):
  // site: "https://chibirolls.com",

  // Fuentes servidas desde el mismo sitio (sin pedirle nada a Google en cada visita)
  fonts: [
    {
      name: "Mochiy Pop One",
      cssVariable: "--font-mochiy",
      provider: fontProviders.google(),
      weights: [400],
      styles: ["normal"],
      fallbacks: ["system-ui", "sans-serif"],
      options: { experimental: { glyphs: MOCHIY_GLYPHS } },
    },
    {
      name: "Nunito",
      cssVariable: "--font-nunito",
      provider: fontProviders.google(),
      weights: [600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
