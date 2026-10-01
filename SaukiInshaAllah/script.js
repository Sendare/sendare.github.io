/* =========================================================
   SAUKI INSHA ALLAH — Storefront
   Reads from Supabase via loadShop() in /data.js
========================================================= */


/* =========================================================
   CONFIG
========================================================= */
const SHOP_SLUG = "sauki-insha-allah";
const CART_KEY  = `${SHOP_SLUG}.cart.v1`;


/* =========================================================
   STATE
========================================================= */
let BUSINESS   = null;   // shop.business
let FIELDS     = [];     // shop.fields
let PRODUCTS   = [];     // shop.products
let CATEGORIES = [];     // shop.categories

let CART = [];           // [{key, id, name, price, image, qty, options}]

let VIEW = {
    category: "all",
    search: "",
    sort: "recommended"
};

let MODAL = {
    product: null,
    selections: {},
    images: [],
    activeIndex: 0
};

let HISTORY = { modal: false, cart: false };
let lastFocused = null;
let toastTimer = null;


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
   SMALL HELPERS
========================================================= */
const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function esc(v) {
    return String(v == null ? "" : v)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function hasValue(v) {
    return v !== null && v !== undefined && String(v).trim() !== "";
}

function currencySymbol() {
    const cur = String(BUSINESS?.currency || "naira").toLowerCase();
    const map = {
        naira: "₦", ngn: "₦",
        dollar: "$", usd: "$",
        pound: "£", gbp: "£",
        euro: "€", eur: "€",
        cedi: "₵", ghs: "₵",
        rand: "R", zar: "R"
    };
    return map[cur] || "";
}

function money(n) {
    const num = Number(n || 0);
    return currencySymbol() + num.toLocaleString("en-NG");
}

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
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
        <rect width="600" height="750" fill="#f5ecdb"/>
        <g transform="translate(300 375)" fill="none" stroke="#c48c3a" stroke-width="1.4">
            <path d="M0 -55 L55 0 L0 55 L-55 0 Z"/>
            <path d="M0 -28 L28 0 L0 28 L-28 0 Z"/>
            <circle cx="0" cy="0" r="3" fill="#c48c3a"/>
        </g>
        <text x="300" y="475" text-anchor="middle" fill="#968a9e" font-family="Georgia" font-size="12" letter-spacing="4">NO IMAGE</text>
    </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function productImage(p) {
    if (p.image) return p.image;
    if (p.images && p.images.length) return p.images[0];
    return placeholderImage();
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
        CATEGORIES
