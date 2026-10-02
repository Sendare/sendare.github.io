/* =========================================================
   SAUKI INSHA ALLAH — Storefront
========================================================= */

const SHOP_SLUG = "sauki-insha-allah";
const CART_KEY  = `${SHOP_SLUG}.cart.v1`;

const CARD_IMAGE_LIMIT = 5;
const AUTOSLIDE_MS = 3000;
const USER_PAUSE_MS = 5000;

let BUSINESS   = null;
let FIELDS     = [];
let PRODUCTS   = [];
let CATEGORIES = [];

let CART = [];

let VIEW = { category: "all", search: "", sort: "recommended" };

/* Single source of truth for which layer is on top of history */
let HISTORY_LAYER = null;   // null | "modal" | "cart"

let LAST_FOCUS = null;
let TOAST_TIMER = null;

/* Per-card carousel state */
const CARD_STATE = new Map();   // productId -> { index, pausedUntil, images }
let CARD_TIMER = null;
let VISIBLE_CARDS = new Set();


/* =========================================================
   ICONS
========================================================= */
const ICONS = {
    whatsapp:  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.1-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.4-3-1.4-4.7 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.5 8.7-8.1 8.7z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>`,
    facebook:  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.2-1.5 1.5-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.7v8h3.5z"/></svg>`,
    tiktok:    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.3 3h-2.9v12.1c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3c.3 0 .6 0 .9.1v-3c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V9.3c1 .8 2.3 1.3 3.7 1.4V7.8c-1.9-.2-3.4-1.6-3.7-3.5-.1-.4-.1-.9-.1-1.3z"/></svg>`,
    telegram:  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.7 4.3 18.9 19c-.2 1-.8 1.2-1.6.7l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.4-.3-.1-.5-.6-.2L7.6 13.5 3.3 12c-1-.3-1-1 .2-1.4L20 4.1c.8-.3 1.5.2 1.7 1.2z"/></svg>`,
    youtube:   `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2c-.2-.9-1-1.6-1.9-1.8C18 5 12 5 12 5s-6 0-7.7.4c-.9.2-1.7.9-1.9 1.8C2 9 2 12 2 12s0 3 .4 4.8c.2.9 1 1.6 1.9 1.8C6 19 12 19 12 19s6 0 7.7-.4c.9-.2 1.7-.9 1.9-1.8.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15V9l5.2 3-5.2 3z"/></svg>`,
    x:         `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.2 3h3.1l-6.8 7.8L21.5 21h-6.3l-4.9-6.4L4.6 21H1.5l7.3-8.3L1.9 3h6.4l4.4 5.8L17.2 3zm-1.1 16.1h1.7L7.9 4.8H6L16.1 19.1z"/></svg>`,
    phone:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z"/></svg>`,
    mail:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>`,
    pin:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>`,
    truck:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>`,
    clock:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    card:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="1"/><path d="M2.5 10h19"/></svg>`,
    plus:      `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
    arrowUp:   `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`
};


/* =========================================================
   HELPERS
========================================================= */
const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function esc(v) {
    return String(v == null ? "" : v)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function hasValue(v) { return v !== null && v !== undefined && String(v).trim() !== ""; }

function currencySymbol() {
    const cur = String(BUSINESS?.currency || "naira").toLowerCase();
    const map = { naira: "₦", ngn: "₦", dollar: "$", usd: "$",
                  pound: "£", gbp: "£", euro: "€", eur: "€",
                  cedi: "₵", ghs: "₵", rand: "R", zar: "R" };
    return map[cur] || "";
}
function money(n) { return currencySymbol() + Number(n || 0).toLocaleString("en-NG"); }

function isValidUrl(v) {
    if (!hasValue(v)) return false;
    try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch { return false; }
}

function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "✦";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function placeholderImage() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="#f5ecdb"/><g transform="translate(300 375)" fill="none" stroke="#c48c3a" stroke-width="1.4"><path d="M0 -55 L55 0 L0 55 L-55 0 Z"/><path d="M0 -28 L28 0 L0 28 L-28 0 Z"/><circle cx="0" cy="0" r="3" fill="#c48c3a"/></g><text x="300" y="475" text-anchor="middle" fill="#968a9e" font-family="Georgia" font-size="12" letter-spacing="4">NO IMAGE</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


/* =========================================================
   BOOT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    $("#retry-btn").addEventListener("click", boot);
    boot();
});

async function boot() {
    hideOffline();
    showLoader();

    try {
        const shop = await loadShop(SHOP_SLUG);

        BUSINESS   = shop.business || {};
        FIELDS     = Array.isArray(shop.fields) ? shop.fields : [];
        PRODUCTS   = Array.isArray(shop.products) ? shop.products : [];
        CATEGORIES = Array.isArray(shop.categories) ? shop.categories : [];

        /* Prepare randomized image order for each product (fresh on every page load) */
        PRODUCTS.forEach(p => {
            const raw = (p.images && p.images.length)
                ? p.images.filter(isValidUrl)
                : (isValidUrl(p.image) ? [p.image] : []);
            p._images = raw.length ? shuffle(raw) : [placeholderImage()];
        });

        loadCartFromStorage();
        renderAll();
        bindEvents();
        startCardTimer();

        hideLoader();
        $("#app").hidden = false;

    } catch (err) {
        console.error("[Sauki] loadShop failed:", err);
        hideLoader();
        showOffline();
    }
}

function renderAll() {
    renderBusiness();
    renderHero();
    renderFilters();
    renderProducts();
    renderInfoSections();
    renderContact();
    renderFooter();
    renderCart();
}


/* =========================================================
   BUSINESS / HEADER
========================================================= */
function renderBusiness() {
    const name = BUSINESS.name || "Shop";
    const tagline = BUSINESS.tagline || "";
    const logo = BUSINESS.logo || "";

    document.title = name;

    $("#header-name").textContent    = name;
    $("#header-tagline").textContent = tagline;
    $("#footer-name").textContent    = name;
    $("#footer-name-2").textContent  = name;
    $("#footer-tagline").textContent = tagline;
    $("#year").textContent           = new Date().getFullYear();

    if (isValidUrl(logo)) {
        const img = $("#header-logo");
        img.src = logo; img.alt = name; img.hidden = false;
        img.onerror = () => { img.hidden = true; showFallback(); };
        $("#header-fallback").textContent = "";
    } else showFallback();

    function showFallback() {
        $("#header-logo").hidden = true;
        $("#header-fallback").textContent = initials(name);
    }
}


/* =========================================================
   HERO
========================================================= */
function renderHero() {
    const name = BUSINESS.name || "";
    const tagline = BUSINESS.tagline || "";
    const desc = BUSINESS.description || "";
    const location = BUSINESS.location || "";
    const logo = BUSINESS.logo || "";

    $("#hero-name").textContent    = name;
    $("#hero-tagline").textContent = tagline;
    $("#hero-tagline").hidden      = !hasValue(tagline);
    $("#hero-desc").textContent    = desc;
    $("#hero-desc").hidden         = !hasValue(desc);
    $("#hero-eyebrow").textContent = location ? `Est. — ${location}` : "Fashion Boutique";

    if (hasValue(BUSINESS.whatsapp)) {
        const wa = $("#hero-whatsapp");
        wa.href = `https://wa.me/${BUSINESS.whatsapp}`;
        wa.hidden = false;
    }

    const bg = $("#hero-logo-bg");
    if (bg) {
        if (isValidUrl(logo)) {
            bg.style.backgroundImage = `url("${logo}")`;
            bg.hidden = false;
        } else bg.hidden = true;
    }

    if (isValidUrl(logo)) {
        const img = $("#hero-logo");
        img.src = logo; img.alt = name; img.hidden = false;
        img.onerror = () => { img.hidden = true; $("#hero-monogram").textContent = initials(name); };
        $("#hero-monogram").textContent = "";
    } else {
        $("#hero-logo").hidden = true;
        $("#hero-monogram").textContent = initials(name);
    }
}


/* =========================================================
   FILTER CHIPS
========================================================= */
function renderFilters() {
    const container = $("#filters");
    container.innerHTML = "";

    const chips = [{ value: "all", label: "All" }]
        .concat(CATEGORIES.map(c => ({ value: c, label: c })));

    chips.forEach(chip => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip" + (VIEW.category === chip.value ? " active" : "");
        btn.dataset.category = chip.value;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", String(VIEW.category === chip.value));
        btn.textContent = chip.label;
        btn.addEventListener("click", () => {
            VIEW.category = chip.value;
            renderFilters();
            renderProducts();
        });
        container.appendChild(btn);
    });
}


/* =========================================================
   PRODUCTS
========================================================= */
function renderProducts() {
    const grid = $("#grid");
    if (!grid) return;

    if (!grid.dataset.rendered) {
        grid.innerHTML = Array.from({ length: 4 }).map(() => `
            <article class="skeleton">
                <div class="sk-img"></div>
                <div class="sk-line"></div>
                <div class="sk-line short"></div>
            </article>
        `).join("");
    }

    const list = filterProducts();

    /* Tear down old carousels */
    CARD_STATE.clear();
    VISIBLE_CARDS.clear();

    if (!list.length) {
        grid.innerHTML = "";
        $("#empty").hidden = false;
        $("#product-count").textContent = "0 items";
        return;
    }

    $("#empty").hidden = true;
    $("#product-count").textContent =
        `${list.length} ${list.length === 1 ? "item" : "items"}`;

    grid.innerHTML = list.map(productCardHTML).join("");
    grid.dataset.rendered = "1";

    /* Init carousels + observers */
    list.forEach(p => initCardCarousel(p));

    /* Broken image fallbacks */
    $$("img", grid).forEach(img => {
        img.addEventListener("error", () => {
            if (img.dataset.fallback) return;
            img.dataset.fallback = "1";
            img.src = placeholderImage();
        }, { once: true });
    });
}

function filterProducts() {
    const q = VIEW.search.trim().toLowerCase();
    let list = PRODUCTS.filter(p => {
        if (VIEW.category !== "all" && p.category !== VIEW.category) return false;
        if (!q) return true;
        const hay = `${p.name} ${p.category} ${p.description || ""}`.toLowerCase();
        return hay.includes(q);
    });

    list = list.slice();

    if (VIEW.sort === "price-low") list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (VIEW.sort === "price-high") list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    else if (VIEW.sort === "new") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    else list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return list;
}

function productCardHTML(p) {
    const name = p.name || "Product";
    const cat = p.category || "";
    const available = p.available !== false;
    const images = p._images.slice(0, CARD_IMAGE_LIMIT);

    const badges = [];
    if (!available) badges.push(`<span class="badge out">Sold out</span>`);
    if (p.onSale)   badges.push(`<span class="badge sale">−${p.discountPercent}%</span>`);
    if (p.featured && available) badges.push(`<span class="badge feat">Featured</span>`);
    if (p.isNew && available)    badges.push(`<span class="badge new">New in</span>`);

    const priceHTML = `
        <span class="price">${esc(money(p.price))}</span>
        ${p.onSale && p.oldPrice ? `<del class="price-old">${esc(money(p.oldPrice))}</del>` : ""}
    `;

    const slidesHTML = images.map((img, i) => `
        <img class="card-slide" src="${esc(img)}" alt="${esc(name)}"
             ${i === 0 ? "" : 'loading="lazy"'} decoding="async">
    `).join("");

    const dotsHTML = images.map((_, i) =>
        `<span class="${i === 0 ? "active" : ""}"></span>`
    ).join("");

    return `
        <article class="card" data-product-id="${esc(p.id)}" tabindex="0" role="button" aria-label="${esc(name)}">
            <div class="card-media">
                <div class="card-carousel" data-card-carousel="${esc(p.id)}">
                    <div class="card-track">${slidesHTML}</div>
                    ${images.length > 1 ? `<div class="card-dots">${dotsHTML}</div>` : ""}
                </div>
                <div class="card-badges">${badges.join("")}</div>
                <button class="card-quick" type="button" data-quick-add="${esc(p.id)}"
                        aria-label="Add ${esc(name)} to cart" ${available ? "" : "disabled"}>
                    ${ICONS.plus}
                </button>
            </div>
            <div class="card-body">
                <span class="card-cat">${esc(cat)}</span>
                <h3 class="card-name">${esc(name)}</h3>
                <div class="card-price">${priceHTML}</div>
            </div>
        </article>
    `;
}


/* =========================================================
   CARD CAROUSELS — auto-advance + touch swipe + intersection
========================================================= */
function initCardCarousel(product) {
    const carousel = $(`[data-card-carousel="${CSS.escape(String(product.id))}"]`);
    if (!carousel) return;

    const track = carousel.querySelector(".card-track");
    const dots  = carousel.querySelectorAll(".card-dots span");
    const count = track.children.length;
    if (count < 1) return;

    CARD_STATE.set(String(product.id), {
        index: 0,
        count,
        track,
        dots,
        pausedUntil: 0
    });

    /* IntersectionObserver — only autoplay when visible */
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = String(product.id);
                if (entry.isIntersecting) VISIBLE_CARDS.add(id);
                else VISIBLE_CARDS.delete(id);
            });
        }, { threshold: 0.4 });
        io.observe(carousel);
    } else {
        VISIBLE_CARDS.add(String(product.id));
    }

    /* Touch swipe (delegated via pointer events — works for mouse too) */
    let startX = 0, startY = 0, active = false;

    carousel.addEventListener("pointerdown", e => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        startX = e.clientX;
        startY = e.clientY;
        active = true;
    });

    carousel.addEventListener("pointerup", e => {
        if (!active) return;
        active = false;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        /* Ignore if vertical scroll intent */
        if (Math.abs(dy) > Math.abs(dx)) return;

        if (Math.abs(dx) > 40) {
            const state = CARD_STATE.get(String(product.id));
            if (!state) return;
            if (dx < 0) advanceCard(product.id, +1);
            else        advanceCard(product.id, -1);
            state.pausedUntil = Date.now() + USER_PAUSE_MS;
            e.preventDefault();
        }
    });

    carousel.addEventListener("pointercancel", () => { active = false; });
}

function advanceCard(productId, dir) {
    const state = CARD_STATE.get(String(productId));
    if (!state) return;
    let next = state.index + dir;
    if (next < 0) next = state.count - 1;
    if (next >= state.count) next = 0;
    setCardIndex(productId, next);
}

function setCardIndex(productId, index) {
    const state = CARD_STATE.get(String(productId));
    if (!state) return;
    state.index = index;
    state.track.style.transform = `translateX(${-index * 100}%)`;
    state.dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function startCardTimer() {
    if (CARD_TIMER) return;
    CARD_TIMER = setInterval(() => {
        const now = Date.now();
        VISIBLE_CARDS.forEach(id => {
            const state = CARD_STATE.get(id);
            if (!state || state.count < 2) return;
            if (now < state.pausedUntil) return;
            /* Don't autoplay while modal is open */
            if (HISTORY_LAYER === "modal") return;
            advanceCard(id, +1);
        });
    }, AUTOSLIDE_MS);
}


/* =========================================================
   INFO / CONTACT / FOOTER
========================================================= */
function renderInfoSections() {
    const container = $("#info-grid");
    container.innerHTML = "";

    const cards = [];

    if (hasValue(BUSINESS.location)) {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.location)}`;
        cards.push({ icon: ICONS.pin, label: "Location", value: BUSINESS.location,
                     link: { href: mapUrl, text: "Open in Maps" } });
    }
    if (hasValue(BUSINESS.delivery))     cards.push({ icon: ICONS.truck, label: "Delivery", value: BUSINESS.delivery });
    if (hasValue(BUSINESS.openingHours)) cards.push({ icon: ICONS.clock, label: "Opening Hours", value: BUSINESS.openingHours });
    if (hasValue(BUSINESS.paymentMethods)) cards.push({ icon: ICONS.card, label: "Payment", value: BUSINESS.paymentMethods });

    if (!cards.length) { $(".info").hidden = true; return; }
    $(".info").hidden = false;

    cards.forEach(card => {
        const el = document.createElement("article");
        el.className = "info-card";
        el.innerHTML = `
            <span class="info-mark">${card.icon}</span>
            <span class="info-label">${esc(card.label)}</span>
            <p class="info-value">${esc(card.value)}</p>
            ${card.link ? `<a class="info-link" href="${esc(card.link.href)}" target="_blank" rel="noopener noreferrer">${esc(card.link.text)} ${ICONS.arrowUp}</a>` : ""}
        `;
        container.appendChild(el);
    });
}

function splitPhones(raw) {
    if (!hasValue(raw)) return [];
    return String(raw).split(/[\s,;\/|]+|\n+/).map(s => s.trim()).filter(Boolean);
}

function renderContact() {
    const container = $("#contact-actions");
    container.innerHTML = "";

    const actions = [];

    if (hasValue(BUSINESS.whatsapp)) {
        actions.push({ label: "WhatsApp", icon: ICONS.whatsapp,
                       href: `https://wa.me/${BUSINESS.whatsapp}`, external: true });
    }

    splitPhones(BUSINESS.phone).forEach(num => {
        actions.push({ label: num, icon: ICONS.phone,
                       href: `tel:${num.replace(/\s+/g, "")}` });
    });

    const socials = BUSINESS.socials || {};
    Object.keys(socials).forEach(key => {
        const url = socials[key];
        if (!isValidUrl(url)) return;
        actions.push({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: ICONS[key] || ICONS.mail,
            href: url, external: true
        });
    });

    if (!actions.length) { $(".contact").hidden = true; return; }
    $(".contact").hidden = false;
    $("#contact-message").textContent =
        BUSINESS.contactMessage || "We'd love to hear from you.";

    actions.forEach(a => {
        const el = document.createElement("a");
        el.className = "contact-action";
        el.href = a.href;
        if (a.external) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
        el.innerHTML = `${a.icon}<span>${esc(a.label)}</span>`;
        container.appendChild(el);
    });
}

function renderFooter() {
    const container = $("#footer-socials");
    container.innerHTML = "";
    const socials = BUSINESS.socials || {};
    Object.keys(socials).forEach(key => {
        const url = socials[key];
        if (!isValidUrl(url)) return;
        const a = document.createElement("a");
        a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", key);
        a.innerHTML = ICONS[key] || ICONS.mail;
        container.appendChild(a);
    });
}


/* =========================================================
   PRODUCT MODAL — main gallery + collage
========================================================= */
let MODAL_PRODUCT = null;
let MODAL_IMAGES = [];
let MODAL_INDEX = 0;
let MODAL_SELECTIONS = {};

function openModal(product) {
    if (!product) return;

    MODAL_PRODUCT = product;
    MODAL_IMAGES = product._images.slice();
    MODAL_INDEX = 0;
    MODAL_SELECTIONS = {};

    renderModalContent();

    const modal = $("#product-modal");
    modal.hidden = false;
    document.body.classList.add("modal-open");
    LAST_FOCUS = document.activeElement;

    requestAnimationFrame(() => modal.classList.add("active"));

    if (HISTORY_LAYER !== "modal") {
        history.pushState({ layer: "modal" }, "");
        HISTORY_LAYER = "modal";
    }

    setTimeout(() => $("#modal-close").focus(), 120);
}

function renderModalContent() {
    const p = MODAL_PRODUCT;
    if (!p) return;

    const name = p.name || "Product";
    const available = p.available !== false;

    /* Build gallery track once */
    const track = $("#gallery-track");
    track.innerHTML = MODAL_IMAGES.map((img, i) => `
        <img src="${esc(img)}" alt="${esc(name)} photo ${i + 1}"
             ${i === 0 ? "" : 'loading="lazy"'} decoding="async">
    `).join("");
    track.style.transform = "translateX(0)";

    /* Dots */
    const dotsEl = $("#gallery-dots");
    if (MODAL_IMAGES.length > 1) {
        dotsEl.innerHTML = MODAL_IMAGES.map((_, i) =>
            `<span class="${i === 0 ? "active" : ""}"></span>`
        ).join("");
        dotsEl.hidden = false;
    } else {
        dotsEl.innerHTML = "";
        dotsEl.hidden = true;
    }

    /* Nav arrows only if more than 1 image */
    $("#gallery-prev").hidden = MODAL_IMAGES.length <= 1;
    $("#gallery-next").hidden = MODAL_IMAGES.length <= 1;

    /* Collage — every image, current highlighted */
    renderCollage();

    /* Header info */
    $("#modal-category").textContent = p.category || "";
    $("#modal-category").hidden = !hasValue(p.category);
    $("#modal-title").textContent = name;
    $("#modal-price").textContent = money(p.price);

    const oldPrice = $("#modal-old-price");
    if (p.onSale && p.oldPrice) {
        oldPrice.textContent = money(p.oldPrice);
        oldPrice.hidden = false;
    } else oldPrice.hidden = true;

    const discount = $("#modal-discount");
    if (p.onSale && p.discountPercent) {
        discount.textContent = `−${p.discountPercent}%`;
        discount.hidden = false;
    } else discount.hidden = true;

    const badges = [];
    if (!available) badges.push(`<span class="badge out">Sold out</span>`);
    if (p.featured && available) badges.push(`<span class="badge feat">Featured</span>`);
    if (p.isNew && available)    badges.push(`<span class="badge new">New in</span>`);
    $("#modal-badges").innerHTML = badges.join("");

    const desc = $("#modal-description");
    desc.textContent = p.description || "";
    desc.hidden = !hasValue(p.description);

    renderModalFields(p);
    updateModalAddButton();
}

function renderCollage() {
    const wrap = $("#gallery-collage");
    if (!wrap) return;
    wrap.innerHTML = MODAL_IMAGES.map((img, i) => `
        <button type="button"
                class="collage-thumb ${i === MODAL_INDEX ? "active" : ""}"
                data-collage-index="${i}"
                aria-label="View photo ${i + 1}">
            <img src="${esc(img)}" alt="" loading="lazy" decoding="async">
        </button>
    `).join("");
}

function goToImage(index) {
    if (index < 0) index = MODAL_IMAGES.length - 1;
    if (index >= MODAL_IMAGES.length) index = 0;
    MODAL_INDEX = index;
    $("#gallery-track").style.transform = `translateX(${-index * 100}%)`;
    $$("#gallery-dots span").forEach((d, i) => d.classList.toggle("active", i === index));
    $$(".collage-thumb", $("#gallery-collage")).forEach((t, i) =>
        t.classList.toggle("active", i === index));
}

function renderModalFields(product) {
    const container = $("#modal-fields");
    container.innerHTML = "";

    FIELDS.forEach(field => {
        const val = product.attributes ? product.attributes[field.key] : null;
        if (val == null || val === "") return;
        if (Array.isArray(val) && !val.length) return;

        if (Array.isArray(val)) {
            const el = document.createElement("div");
            el.className = "field-choices";
            el.dataset.fieldKey = field.key;
            el.innerHTML = `
                <span class="field-label">${esc(field.label || field.key)}</span>
                <div class="choices">
                    ${val.map(opt => `
                        <button type="button" class="choice"
                                data-choice="${esc(opt)}"
                                data-field-key="${esc(field.key)}">
                            ${esc(opt)}
                        </button>
                    `).join("")}
                </div>
            `;
            container.appendChild(el);
        } else {
            const el = document.createElement("div");
            el.className = "field-row";
            el.innerHTML = `
                <span class="field-label">${esc(field.label || field.key)}</span>
                <span class="field-value">${esc(String(val))}</span>
            `;
            container.appendChild(el);
        }
    });
}

function requiredFieldsFor(product) {
    return FIELDS.filter(f => {
        const val = product.attributes ? product.attributes[f.key] : null;
        return Array.isArray(val) && val.length > 0;
    });
}

function updateModalAddButton() {
    const p = MODAL_PRODUCT;
    if (!p) return;
    const btn = $("#modal-add");
    const hint = $("#modal
