import { STORE, formatPrice as fmt } from "../data/config";
import type { ClientProduct } from "../data/menu";

type Cart = Record<string, number>;
type Action = "add" | "inc" | "dec";

const CART_KEY = "chibi-rolls:cart:v1";
const FORM_KEY = "chibi-rolls:form:v1";
const MAX_QTY = 99;

const ADD_MSGS = [
  "¡Agregado! (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
  "¡Al carrito! (◕ᴗ◕✿)",
  "¡Qué rico! (っ˘ڡ˘ς)",
  "¡Buena elección! ٩(◕‿◕)۶",
];

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const icon = (id: string) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// localStorage puede no existir (modo privado, bloqueado): el carrito funciona igual, solo no se recuerda
const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignorar */
    }
  },
};

export function initCart() {
  const dataEl = $("#cart-products");
  const PRODUCTS: ClientProduct[] = dataEl?.textContent ? JSON.parse(dataEl.textContent) : [];
  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

  const els = {
    cartBtn: $<HTMLButtonElement>("#cartBtn")!,
    cartCount: $("#cartCount")!,
    drawer: $("#cart")!,
    close: $<HTMLButtonElement>(".drawer__close")!,
    list: $<HTMLUListElement>("#cartList")!,
    empty: $("#cartEmpty")!,
    form: $<HTMLFormElement>("#checkout")!,
    foot: $("#cartFoot")!,
    total: $("#cartTotal")!,
    sub: $("#cartSub")!,
    note: $("#cartNote")!,
    mascot: $("#mascot")!,
    fab: $<HTMLButtonElement>("#fab")!,
    fabCount: $("#fabCount")!,
    fabTotal: $("#fabTotal")!,
    toast: $("#toast")!,
    addressField: $("#addressField")!,
    menu: $("#menuSections"),
  };

  /* ---------- Estado ---------- */
  let cart: Cart = sanitize(storage.get<unknown>(CART_KEY, {}));

  function sanitize(obj: unknown): Cart {
    const clean: Cart = {};
    if (obj && typeof obj === "object") {
      for (const [id, qty] of Object.entries(obj)) {
        if (byId.has(id) && Number.isInteger(qty) && qty > 0) clean[id] = Math.min(qty, MAX_QTY);
      }
    }
    return clean;
  }

  const items = () => PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const total = () => items().reduce((sum, i) => sum + i.qty * i.price, 0);

  function setQty(id: string, qty: number) {
    const next = Math.max(0, Math.min(MAX_QTY, qty));
    if (next === 0) delete cart[id];
    else cart[id] = next;
    storage.set(CART_KEY, cart);
  }

  /* ---------- Render ---------- */
  // El botón "Agregar" tiene que coincidir con src/components/AddButton.astro
  function qtyControl(p: ClientProduct) {
    const q = cart[p.id] || 0;
    const name = esc(p.name);
    if (!q) {
      return `<button class="add-btn" type="button" data-action="add" data-id="${p.id}" aria-label="Agregar ${name} al carrito">${icon("i-plus")}<span>Agregar</span></button>`;
    }
    return `<div class="stepper" role="group" aria-label="Cantidad de ${name}">
        <button type="button" data-action="dec" data-id="${p.id}" aria-label="Quitar un ${name}">${icon("i-minus")}</button>
        <output aria-live="polite">${q}</output>
        <button type="button" data-action="inc" data-id="${p.id}" aria-label="Sumar un ${name}">${icon("i-plus")}</button>
      </div>`;
  }

  function syncProduct(id: string) {
    const p = byId.get(id);
    if (!p) return;
    $$(`[data-qty="${id}"]`).forEach((el) => (el.innerHTML = qtyControl(p)));
    $$(`[data-card="${id}"]`).forEach((el) => el.classList.toggle("in-cart", !!cart[id]));
  }

  function lineTpl(i: ClientProduct & { qty: number }) {
    const name = esc(i.name);
    const thumb = i.thumb
      ? `<img class="line__img" src="${esc(i.thumb)}" alt="" width="56" height="56" loading="lazy">`
      : `<span class="line__img line__img--swirl">${icon("i-swirl")}</span>`;
    return `<li class="line">
        ${thumb}
        <div class="line__info">
          <span class="line__name">${name}</span>
          <span class="line__unit">${fmt(i.price)} c/u</span>
        </div>
        <div class="stepper" role="group" aria-label="Cantidad de ${name}">
          <button type="button" data-action="dec" data-id="${i.id}" aria-label="Quitar un ${name}">${icon("i-minus")}</button>
          <output>${i.qty}</output>
          <button type="button" data-action="inc" data-id="${i.id}" aria-label="Sumar un ${name}">${icon("i-plus")}</button>
        </div>
        <span class="line__sub">${fmt(i.qty * i.price)}</span>
      </li>`;
  }

  function renderCart() {
    const n = count();
    const has = n > 0;

    els.cartCount.textContent = n > 99 ? "99+" : String(n);
    els.cartBtn.classList.toggle("has-items", has);
    els.cartBtn.setAttribute(
      "aria-label",
      has ? `Abrir carrito, ${plural(n, "producto", "productos")}` : "Abrir carrito, vacío"
    );

    els.list.innerHTML = items().map(lineTpl).join("");
    els.empty.hidden = has;
    els.list.hidden = !has;
    els.form.hidden = !has;
    els.foot.hidden = !has;
    els.total.textContent = fmt(total());

    els.sub.textContent = has ? `${plural(n, "cosita rica", "cositas ricas")} ♡` : "Está vacío… por ahora";
    els.mascot.dataset.mood = !has ? "sad" : n >= 6 ? "love" : "happy";

    els.fabCount.textContent = plural(n, "producto", "productos");
    els.fabTotal.textContent = fmt(total());
    updateFab();
  }

  function updateFab() {
    const show = count() > 0 && !els.drawer.classList.contains("is-open");
    els.fab.classList.toggle("is-visible", show);
    els.fab.tabIndex = show ? 0 : -1;
    els.fab.setAttribute("aria-hidden", String(!show));
    els.fab.setAttribute("aria-label", `Ver carrito: ${els.fabCount.textContent}, total ${els.fabTotal.textContent}`);
    document.body.classList.toggle("has-fab", show);
  }

  /* ---------- Feedback kawaii ---------- */
  let toastTimer: number | undefined;
  function toast(msg: string) {
    els.toast.textContent = msg;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
  }

  function replayClass(el: Element, cls: string) {
    el.classList.remove(cls);
    void (el as HTMLElement).offsetWidth; // reinicia la animación
    el.classList.add(cls);
  }

  function plusOne(from: Element) {
    const r = from.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "plus-one";
    s.setAttribute("aria-hidden", "true");
    s.textContent = "+1 ♡";
    s.style.left = `${r.left + r.width / 2}px`;
    s.style.top = `${r.top - 6}px`;
    document.body.appendChild(s);
    s.addEventListener("animationend", () => s.remove(), { once: true });
    window.setTimeout(() => s.remove(), 1500);
  }

  let addMsgIdx = 0;

  /* ---------- Agregar / sumar / restar ---------- */
  document.addEventListener("click", (e) => {
    const btn = (e.target as Element).closest<HTMLElement>("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action as Action;
    const id = btn.dataset.id ?? "";
    if (!byId.has(id)) return;

    const scope = btn.closest<HTMLElement>("[data-scope]")?.dataset.scope ?? "menu";
    const prev = cart[id] || 0;
    setQty(id, action === "dec" ? prev - 1 : prev + 1);
    const now = cart[id] || 0;

    if (now > prev) {
      plusOne(btn);
      replayClass(els.cartBtn, "bump");
      replayClass(els.fab, "bump");
      replayClass(els.mascot, "wiggle");
      if (prev === 0) toast(ADD_MSGS[addMsgIdx++ % ADD_MSGS.length]);
    }

    syncProduct(id);
    renderCart();
    restoreFocus(scope, id, action, now);
  });

  // Al re-renderizar, devolvemos el foco al botón equivalente (teclado / lectores de pantalla)
  function restoreFocus(scope: string, id: string, action: Action, qty: number) {
    const root: ParentNode = (scope === "cart" ? els.list : els.menu) ?? document;
    let target: HTMLElement | null = null;
    if (qty > 0) {
      target = $(`[data-id="${id}"][data-action="${action === "add" ? "inc" : action}"]`, root);
    } else if (scope === "menu") {
      target = $(`[data-id="${id}"][data-action="add"]`, root);
    }
    if (!target && scope === "cart") target = $("[data-action]", els.list) ?? els.close;
    target?.focus({ preventScroll: true });
  }

  /* ---------- Abrir / cerrar ---------- */
  let lastFocus: HTMLElement | null = null;
  const outside = () =>
    [$("main"), $("#topbar"), $("#footer"), els.fab].filter((el): el is HTMLElement => !!el);

  function openCart() {
    lastFocus = document.activeElement as HTMLElement | null;
    els.drawer.classList.add("is-open");
    els.drawer.setAttribute("aria-hidden", "false");
    els.cartBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    outside().forEach((el) => (el.inert = true));
    updateFab();
    window.setTimeout(() => els.close.focus({ preventScroll: true }), 60);
  }

  function closeCart() {
    els.drawer.classList.remove("is-open");
    els.drawer.setAttribute("aria-hidden", "true");
    els.cartBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    outside().forEach((el) => (el.inert = false));
    updateFab();
    const back = lastFocus && document.contains(lastFocus) && lastFocus !== els.fab ? lastFocus : els.cartBtn;
    back.focus({ preventScroll: true });
  }

  els.cartBtn.addEventListener("click", openCart);
  els.fab.addEventListener("click", openCart);
  els.drawer.addEventListener("click", (e) => {
    const closer = (e.target as Element).closest<HTMLElement>("[data-close]");
    if (!closer) return;
    closeCart();
    const goto = closer.dataset.goto;
    if (goto) $(goto)?.scrollIntoView({ behavior: "smooth" });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && els.drawer.classList.contains("is-open")) closeCart();
  });

  $("#clearBtn")?.addEventListener("click", () => {
    if (!confirm("¿Vaciar el carrito? (｡•́︿•̀｡)")) return;
    const ids = Object.keys(cart);
    cart = {};
    storage.set(CART_KEY, cart);
    ids.forEach(syncProduct);
    renderCart();
    els.close.focus();
  });

  /* ---------- Formulario ---------- */
  const form = els.form;
  const field = <T extends HTMLElement>(name: string) => form.elements.namedItem(name) as T;
  const nameInput = field<HTMLInputElement>("name");
  const addrInput = field<HTMLInputElement>("address");

  interface SavedForm {
    name?: string;
    address?: string;
    delivery?: string;
    pay?: string;
  }

  function restoreForm() {
    const saved = storage.get<SavedForm>(FORM_KEY, {});
    if (typeof saved.name === "string") nameInput.value = saved.name;
    if (typeof saved.address === "string") addrInput.value = saved.address;
    for (const key of ["delivery", "pay"] as const) {
      const val = saved[key];
      if (typeof val !== "string") continue;
      const radio = $<HTMLInputElement>(`input[name="${key}"][value="${CSS.escape(val)}"]`, form);
      if (radio) radio.checked = true;
    }
    toggleAddress();
  }

  function saveForm() {
    const fd = new FormData(form);
    storage.set(FORM_KEY, {
      name: fd.get("name") ?? "",
      address: fd.get("address") ?? "",
      delivery: fd.get("delivery"),
      pay: fd.get("pay"),
    });
  }

  function toggleAddress() {
    const envio = new FormData(form).get("delivery") === "envio";
    els.addressField.hidden = !envio;
    els.note.textContent = envio
      ? "El costo de envío se coordina por WhatsApp."
      : "Te pasamos la dirección de retiro por WhatsApp.";
  }

  form.addEventListener("change", (e) => {
    if ((e.target as HTMLInputElement).name === "delivery") toggleAddress();
    saveForm();
  });
  form.addEventListener("input", (e) => {
    (e.target as Element).closest(".field")?.classList.remove("has-error");
    saveForm();
  });

  function setError(input: HTMLInputElement, on: boolean) {
    const wrap = input.closest(".field");
    wrap?.classList.toggle("has-error", on);
    input.setAttribute("aria-invalid", String(on));
    const err = wrap ? $(".field__error", wrap) : null;
    if (on && err) input.setAttribute("aria-describedby", err.id);
    else input.removeAttribute("aria-describedby");
  }

  interface Order {
    name: string;
    delivery: string;
    address: string;
    pay: string;
    notes: string;
  }

  function buildMessage(o: Order) {
    const lines = [`¡Hola ${STORE.name}! ♡ Quiero hacer este pedido:`, ""];
    for (const i of items()) lines.push(`• ${i.qty} × ${i.name} — ${fmt(i.qty * i.price)}`);
    lines.push("", `*Total: ${fmt(total())}*`, "");
    lines.push(`*Nombre:* ${o.name}`);
    lines.push(`*Entrega:* ${o.delivery === "envio" ? "Envío a domicilio" : "Retiro"}`);
    if (o.delivery === "envio") lines.push(`*Dirección:* ${o.address}`);
    lines.push(`*Pago:* ${o.pay}`);
    if (o.notes) lines.push(`*Notas:* ${o.notes}`);
    lines.push("", "¡Gracias! ✧");
    return lines.join("\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!count()) return;

    const fd = new FormData(form);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const order: Order = {
      name: str("name"),
      delivery: str("delivery"),
      address: str("address"),
      pay: str("pay"),
      notes: str("notes"),
    };

    const badName = !order.name;
    const badAddr = order.delivery === "envio" && !order.address;
    setError(nameInput, badName);
    setError(addrInput, badAddr);
    if (badName || badAddr) {
      (badName ? nameInput : addrInput).focus();
      toast("¡Ups! Falta completar un dato (・・;)");
      return;
    }

    const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(buildMessage(order))}`;
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
    toast("¡Abriendo WhatsApp! ✧ ٩(◕‿◕)۶");
  });

  /* ---------- Categoría activa en la barra de pills ---------- */
  function setupCatNav() {
    const pills = $$<HTMLAnchorElement>(".pill");
    if (!pills.length || !("IntersectionObserver" in window)) return;
    const setActive = (id: string) => {
      for (const p of pills) {
        const on = p.dataset.cat === id;
        p.classList.toggle("is-active", on);
        if (on) {
          p.setAttribute("aria-current", "true");
          const nav = p.parentElement!;
          nav.scrollTo({ left: p.offsetLeft - (nav.clientWidth - p.clientWidth) / 2, behavior: "smooth" });
        } else {
          p.removeAttribute("aria-current");
        }
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id.replace("cat-", ""));
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    $$(".cat").forEach((s) => io.observe(s));
  }

  /* ---------- Init ---------- */
  Object.keys(cart).forEach(syncProduct);
  restoreForm();
  renderCart();
  setupCatNav();
}
