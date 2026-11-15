import type { ImageMetadata } from "astro";

import roll1 from "../assets/img/roll-1.webp";
import roll2 from "../assets/img/roll-2.webp";
import roll3 from "../assets/img/roll-3.webp";
import roll4 from "../assets/img/roll-4.webp";
import roll5 from "../assets/img/roll-5.webp";
import roll6 from "../assets/img/roll-6.webp";
import roll7 from "../assets/img/roll-7.webp";

export interface Category {
  id: string;
  name: string;
  /** Texto decorativo en japonés */
  jp: string;
  blurb: string;
  /** Se muestra como lista compacta (sin foto) */
  compact?: boolean;
}

export interface Product {
  id: string;
  cat: Category["id"];
  name: string;
  price: number;
  desc?: string;
  img?: ImageMetadata;
  tag?: string;
}

export const CATEGORIES: Category[] = [
  { id: "clasicos",   name: "Clásicos",   jp: "クラシック", blurb: "Los de siempre: esponjosos y con mucha canela." },
  { id: "especiales", name: "Especiales", jp: "スペシャル", blurb: "Rellenos y toppings para darse un gustito." },
  { id: "boxes",      name: "Boxes",      jp: "ボックス",   blurb: "Para compartir (o no, no juzgamos)." },
  { id: "extras",     name: "Extras",     jp: "おまけ",     blurb: "Sumale un toque más a tu pedido.", compact: true },
];

// Productos de muestra: cambiá nombres, precios e imágenes cuando tengas los reales.
// Para usar otra foto: guardala en src/assets/img/, importala arriba y ponela en `img`.
export const PRODUCTS: Product[] = [
  { id: "clasico",   cat: "clasicos",   name: "Roll Clásico",           price: 3200, img: roll1, tag: "favorito ♡",
    desc: "Masa brioche, canela, azúcar mascabo y glaseado de queso crema." },
  { id: "ddl",       cat: "clasicos",   name: "Roll de Dulce de Leche", price: 3600, img: roll2,
    desc: "Relleno de canela con un baño generoso de dulce de leche." },
  { id: "naked",     cat: "clasicos",   name: "Roll Naked",             price: 2900, img: roll3,
    desc: "Sin glaseado, para quienes aman la canela bien pura." },

  { id: "choco",     cat: "especiales", name: "Roll Choco Avellanas",   price: 3900, img: roll4, tag: "nuevo ✧",
    desc: "Relleno de crema de avellanas y chocolate, con avellanas tostadas." },
  { id: "redvelvet", cat: "especiales", name: "Roll Red Velvet",        price: 3900, img: roll5,
    desc: "Masa red velvet con frosting de queso crema bien cremoso." },
  { id: "pistacho",  cat: "especiales", name: "Roll Pistacho",          price: 4500, img: roll6, tag: "edición limitada",
    desc: "Crema de pistacho casera y pistachos picados por arriba." },

  { id: "box4",      cat: "boxes",      name: "Box Mini ×4",            price: 11500, img: roll7, tag: "ideal regalo",
    desc: "4 rolls clásicos en cajita kawaii con moñito." },
  { id: "box6",      cat: "boxes",      name: "Box Party ×6",           price: 18900, img: roll6, tag: "para compartir",
    desc: "6 rolls, elegí hasta 3 sabores (contanos en las notas)." },
  { id: "box12",     cat: "boxes",      name: "Box Chibi ×12",          price: 35000, img: roll1,
    desc: "12 rolls surtidos para cumples, juntadas y maratones de anime." },

  { id: "x-glaseado", cat: "extras", name: "Glaseado extra",            price: 600 },
  { id: "x-ddl",      cat: "extras", name: "Pote de dulce de leche",    price: 900 },
  { id: "x-nueces",   cat: "extras", name: "Nueces caramelizadas",      price: 800 },
  { id: "x-tarjeta",  cat: "extras", name: "Tarjetita con dedicatoria", price: 500 },
];

/** Datos mínimos que necesita el carrito en el navegador */
export interface ClientProduct {
  id: string;
  name: string;
  price: number;
  thumb: string | null;
}
