import type { ImageMetadata } from "astro";

import clasico from "../assets/img/clasico.webp";
import nutella from "../assets/img/nutella.webp";
import berry from "../assets/img/berry.webp";
import pistacho from "../assets/img/pistacho.webp";
import noir from "../assets/img/noir.webp";
import pinky from "../assets/img/pinky.webp";
import chimi from "../assets/img/chimi.webp";
import boxClasicos from "../assets/img/box-clasicos.webp";
import boxMix from "../assets/img/box-mix.webp";
import boxEspeciales from "../assets/img/box-especiales.webp";

export interface Category {
  id: string;
  name: string;
  /** Texto decorativo en japonés */
  jp: string;
  blurb: string;
  /** Los productos vienen de a pares (×4 / ×6): en escritorio cada par va en una columna */
  pairs?: boolean;
}

export interface Product {
  id: string;
  cat: Category["id"];
  name: string;
  price: number;
  desc?: string;
  /** Sin foto se muestra una ilustración de rollito */
  img?: ImageMetadata;
  tag?: string;
}

export const CATEGORIES: Category[] = [
  { id: "clasicos",   name: "Clásicos",   jp: "クラシック", blurb: "Los de siempre, con mucha canela." },
  { id: "especiales", name: "Especiales", jp: "スペシャル", blurb: "Para darse un gustito." },
  { id: "salados",    name: "Salados",    jp: "セイボリー", blurb: "Para los que prefieren algo saladito." },
  { id: "boxes",      name: "Boxes",      jp: "ボックス",   blurb: "Elegí los sabores y contanos cuáles en las notas del pedido.", pairs: true },
];

// Para cambiar una foto: guardala en src/assets/img/, importala arriba y ponela en `img`.
export const PRODUCTS: Product[] = [
  { id: "clasico",   cat: "clasicos",   name: "Roll Clásico",          price: 4500, img: clasico,
    desc: "Canela y glaseado cremoso. El de siempre." },
  { id: "ddl",       cat: "clasicos",   name: "Roll Dulce de Leche",   price: 4500,
    desc: "Con un baño de dulce de leche." },
  { id: "naked",     cat: "clasicos",   name: "Roll Naked",            price: 3800,
    desc: "Sin glaseado, pura canela." },

  { id: "nuty-love",   cat: "especiales", name: "Nuty Love",   price: 5000, img: nutella,
    desc: "Roll de Nutella con hilos de chocolate." },
  { id: "berry-dream", cat: "especiales", name: "Berry Dream", price: 5000, img: berry,
    desc: "Frutos rojos y crema por arriba." },
  { id: "green-crush", cat: "especiales", name: "Green Crush", price: 5000, img: pistacho,
    desc: "Crema de pistacho y chocolate blanco." },
  { id: "the-noir",    cat: "especiales", name: "The Noir",    price: 5000, img: noir,
    desc: "Crema, Oreo triturada y una galletita arriba." },
  { id: "pinky-roll",  cat: "especiales", name: "Pinky Roll",  price: 5000, img: pinky,
    desc: "Glaseado rosa con hilos de crema." },

  { id: "chimi-roll",  cat: "salados",    name: "Chimi Roll",  price: 5000, img: chimi,
    desc: "Relleno de jamón y queso." },

  { id: "box-clasicos-4",   cat: "boxes", name: "Box Clásicos ×4",   price: 16500, img: boxClasicos,
    desc: "4 rolls clásicos a elección." },
  { id: "box-clasicos-6",   cat: "boxes", name: "Box Clásicos ×6",   price: 25500, img: boxClasicos,
    desc: "6 rolls clásicos a elección." },
  { id: "box-mix-4",        cat: "boxes", name: "Box Mix ×4",        price: 17500, img: boxMix, tag: "2 + 2",
    desc: "2 especiales y 2 clásicos." },
  { id: "box-mix-6",        cat: "boxes", name: "Box Mix ×6",        price: 27500, img: boxMix, tag: "3 + 3",
    desc: "3 especiales y 3 clásicos." },
  { id: "box-especiales-4", cat: "boxes", name: "Box Especiales ×4", price: 18500, img: boxEspeciales,
    desc: "4 rolls especiales a elección." },
  { id: "box-especiales-6", cat: "boxes", name: "Box Especiales ×6", price: 28500, img: boxEspeciales,
    desc: "6 rolls especiales a elección." },
];

/** Datos mínimos que necesita el carrito en el navegador */
export interface ClientProduct {
  id: string;
  name: string;
  price: number;
  thumb: string | null;
}
