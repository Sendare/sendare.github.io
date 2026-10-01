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
        CATEGORIES = Array.isArray(shop.categories) ? shop.categories : [];

        loadCartFromStorage();
        renderAll();
        bindEvents();

        hideLoader();
        $("#app").hidden = false;

    } catch (err) {
        console.error("[Sauki] loadShop failed:", err);
        hideLoader();
        showOffline();
    }
}


/* =========================================================
   RENDER EVERYTHING
========================================================= */
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
    const name    = BUSINESS.name || "Shop";
    const tagline = BUSINESS.tagline || "";
    const logo    = BUSINESS.logo || "";

    document.title = name;

    $("#header-name").textContent    = name;
    $("#header-tagline").textContent = tagline;
    $("#footer-name").textContent    = name;
    $("#footer-name-2").textContent  = name;
    $("#footer-tagline").textContent = tagline;
    $("#year").textContent           = new Date().getFullYear();

    if (isValidUrl(logo)) {
        const img = $("#header-logo");
        img.src = logo;
        img.alt = name;
        img.hidden = false;
        img.onerror = () => { img.hidden = true; showFallbackMark(); };
        $("#header-fallback").textContent = "";
    } else {
        showFallbackMark();
    }

    function showFallbackMark() {
        $("#header-logo").hidden = true;
        $("#header-fallback").textContent = initials(name);
    }
}


/* =========================================================
   HERO
========================================================= */
function renderHero() {
    const name    = BUSINESS.name || "";
    const tagline = BUSINESS.tagline || "";
    const desc    = BUSINESS.description || "";
    const location = BUSINESS.location || "";
    const logo    = BUSINESS.logo || "";

    $("#hero-name").textContent    = name;
    $("#hero-tagline").textContent = tagline;
    $("#hero-tagline").hidden      = !hasValue(tagline);
    $("#hero-desc").textContent    = desc;
    $("#hero-desc").hidden         = !hasValue(desc);

    const eyebrow = location ? `Est. — ${location}` : "Fashion Boutique";
    $("#hero-eyebrow").textContent = eyebrow;

    // WhatsApp chat link
    if (hasValue(BUSINESS.whatsapp)) {
        const wa = $("#hero-whatsapp");
        wa.href = `https://wa.me/${BUSINESS.whatsapp}`;
        wa.hidden = false;
    }

    // Hero panel: logo, or monogram
    if (isValidUrl(logo)) {
        const img = $("#hero-logo");
        img.src = logo;
        img.alt = name;
        img.hidden = false;
        img.onerror = () => { img.hidden = true; };
        $("#hero-monogram").textContent = "";
    } else {
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

    chips.forEach((chip, i) => {
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

    // Show skeleton on first paint
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

    // Image error fallback
    $$("img", grid).forEach(img => {
        img.addEventListener("error", () => {
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

    // Clone before sorting
    list = list.slice();

    if (VIEW.sort === "price-low") {
        list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (VIEW.sort === "price-high") {
        list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (VIEW.sort === "new") {
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    } else {
        list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return list;
}


function productCardHTML(p) {
    const img = productImage(p);
    const name = p.name || "Product";
    const cat = p.category || "";
    const available = p.available !== false;

    // Badges
    const badges = [];
    if (!available)         badges.push(`<span class="badge out">Sold out</span>`);
    if (p.onSale)           badges.push(`<span class="badge sale">−${p.discountPercent}%</span>`);
    if (p.featured && available) badges.push(`<span class="badge feat">Featured</span>`);
    if (p.isNew && available)    badges.push(`<span class="badge new">New in</span>`);

    // Price
    const priceHTML = `
        <span class="price">${esc(money(p.price))}</span>
        ${p.onSale && p.oldPrice ? `<del class="price-old">${esc(money(p.oldPrice))}</del>` : ""}
    `;

    const quickDisabled = available ? "" : "disabled";

    return `
        <article class="card" data-product-id="${esc(p.id)}" tabindex="0" role="button" aria-label="${esc(name)}">
            <div class="card-media">
                <img src="${esc(img)}" alt="${esc(name)}" loading="lazy" decoding="async">
                <div class="card-badges">${badges.join("")}</div>
                <button class="card-quick" type="button" data-quick-add="${esc(p.id)}" aria-label="Add ${esc(name)} to cart" ${quickDisabled}>
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
   INFO SECTIONS
========================================================= */
function renderInfoSections() {
    const container = $("#info-grid");
    container.innerHTML = "";

    const cards = [];

    if (hasValue(BUSINESS.location)) {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.location)}`;
        cards.push({
            icon: ICONS.pin,
            label: "Location",
            value: BUSINESS.location,
            link: { href: mapUrl, text: "Open in Maps", external: true }
        });
    }

    if (hasValue(BUSINESS.delivery)) {
        cards.push({
            icon: ICONS.truck,
            label: "Delivery",
            value: BUSINESS.delivery
        });
    }

    if (hasValue(BUSINESS.openingHours)) {
        cards.push({
            icon: ICONS.clock,
            label: "Opening Hours",
            value: BUSINESS.openingHours
        });
    }

    if (hasValue(BUSINESS.paymentMethods)) {
        cards.push({
            icon: ICONS.card,
            label: "Payment",
            value: BUSINESS.paymentMethods
        });
    }

    if (!cards.length) {
        $(".info").hidden = true;
        return;
    }

    $(".info").hidden = false;

    cards.forEach(card => {
        const el = document.createElement("article");
        el.className = "info-card";
        el.innerHTML = `
            <span class="info-mark">${card.icon}</span>
            <span class="info-label">${esc(card.label)}</span>
            <p class="info-value">${esc(card.value)}</p>
            ${card.link ? `
                <a class="info-link" href="${esc(card.link.href)}"
                   ${card.link.external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
                    ${esc(card.link.text)} ${ICONS.arrowUp}
                </a>` : ""}
        `;
        container.appendChild(el);
    });
}


/* =========================================================
   CONTACT
========================================================= */
function renderContact() {
    const container = $("#contact-actions");
    container.innerHTML = "";

    const actions = [];

    if (hasValue(BUSINESS.whatsapp)) {
        actions.push({
            label: "WhatsApp",
            icon: ICONS.whatsapp,
            href: `https://wa.me/${BUSINESS.whatsapp}`,
            external: true
        });
    }

    if (hasValue(BUSINESS.phone)) {
        actions.push({
            label: BUSINESS.phone,
            icon: ICONS.phone,
            href: `tel:${BUSINESS.phone}`
        });
    }

    // Socials
    const socials = BUSINESS.socials || {};
    Object.keys(socials).forEach(key => {
        const url = socials[key];
        if (!isValidUrl(url)) return;

        actions.push({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: ICONS[key] || ICONS.mail,
            href: url,
            external: true
        });
    });

    if (!actions.length) {
        $(".contact").hidden = true;
        return;
    }

    $(".contact").hidden = false;
    $("#contact-message").textContent =
        BUSINESS.contactMessage || "We'd love to hear from you.";

    actions.forEach(a => {
        const el = document.createElement("a");
        el.className = "contact-action";
        el.href = a.href;
        if (a.external) {
            el.target = "_blank";
            el.rel = "noopener noreferrer";
        }
        el.innerHTML = `${a.icon}<span>${esc(a.label)}</span>`;
        container.appendChild(el);
    });
}


/* =========================================================
   FOOTER
========================================================= */
function renderFooter() {
    const container = $("#footer-socials");
    container.innerHTML = "";

    const socials = BUSINESS.socials || {};
    Object.keys(socials).forEach(key => {
        const url = socials[key];
        if (!isValidUrl(url)) return;
        const icon = ICONS[key] || ICONS.mail;

        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", key);
        a.innerHTML = icon;
        container.appendChild(a);
    });
}


/* =========================================================
   PRODUCT MODAL
========================================================= */
function openModal(product) {
    if (!product) return;

    MODAL.product = product;
    MODAL.selections = {};
    MODAL.images = (product.images && product.images.length)
        ? product.images.slice()
        : (product.image ? [product.image] : [placeholderImage()]);
    MODAL.activeIndex = 0;

    renderModalContent();

    const modal = $("#product-modal");
    modal.hidden = false;
    document.body.classList.add("modal-open");

    lastFocused = document.activeElement;

    requestAnimationFrame(() => modal.classList.add("active"));

    if (!HISTORY.modal) {
        history.pushState({ layer: "modal" }, "");
        HISTORY.modal = true;
    }

    // Focus close for accessibility
    setTimeout(() => $("#modal-close").focus(), 120);
}


function renderModalContent() {
    const p = MODAL.product;
    if (!p) return;

    const name = p.name || "Product";
    const available = p.available !== false;

    // Gallery
    const galleryMain = $("#gallery-main-img");
    galleryMain.src = MODAL.images[0];
    galleryMain.alt = name;
    galleryMain.onerror = () => { galleryMain.src = placeholderImage(); };

    const thumbs = $("#gallery-thumbs");
    thumbs.innerHTML = "";
    if (MODAL.images.length > 1) {
        MODAL.images.forEach((img, i) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "gallery-thumb" + (i === 0 ? " active" : "");
            btn.setAttribute("aria-label", `Image ${i + 1}`);
            btn.innerHTML = `<img src="${esc(img)}" alt="">`;
            btn.querySelector("img").onerror = e => { e.target.src = placeholderImage(); };
            btn.addEventListener("click", () => {
                MODAL.activeIndex = i;
                galleryMain.src = img;
                $$(".gallery-thumb", thumbs).forEach((t, j) => {
                    t.classList.toggle("active", j === i);
                });
            });
            thumbs.appendChild(btn);
        });
        thumbs.hidden = false;
    } else {
        thumbs.hidden = true;
    }

    // Header info
    $("#modal-category").textContent = p.category || "";
    $("#modal-category").hidden = !hasValue(p.category);
    $("#modal-title").textContent = name;

    $("#modal-price").textContent = money(p.price);

    const oldPrice = $("#modal-old-price");
    if (p.onSale && p.oldPrice) {
        oldPrice.textContent = money(p.oldPrice);
        oldPrice.hidden = false;
    } else {
        oldPrice.hidden = true;
    }

    const discount = $("#modal-discount");
    if (p.onSale && p.discountPercent) {
        discount.textContent = `−${p.discountPercent}%`;
        discount.hidden = false;
    } else {
        discount.hidden = true;
    }

    // Badges
    const badgesEl = $("#modal-badges");
    const badges = [];
    if (!available)  badges.push(`<span class="badge out">Sold out</span>`);
    if (p.featured && available) badges.push(`<span class="badge feat">Featured</span>`);
    if (p.isNew && available)    badges.push(`<span class="badge new">New in</span>`);
    badgesEl.innerHTML = badges.join("");

    // Description
    const desc = $("#modal-description");
    desc.textContent = p.description || "";
    desc.hidden = !hasValue(p.description);

    // Dynamic fields
    renderModalFields(p);

    // Add button state
    updateModalAddButton();
}


function renderModalFields(product) {
    const container = $("#modal-fields");
    container.innerHTML = "";

    FIELDS.forEach(field => {
        const val = product.attributes ? product.attributes[field.key] : null;
        if (val == null || val === "") return;
        if (Array.isArray(val) && !val.length) return;

        if (Array.isArray(val)) {
            // Choices required before add to cart
            const el = document.createElement("div");
            el.className = "field-choices";
            el.dataset.fieldKey = field.key;
            el.innerHTML = `
                <span class="field-label">${esc(field.label || field.key)}</span>
                <div class="choices">
                    ${val.map(opt => `
                        <button type="button" class="choice" data-choice="${esc(opt)}" data-field-key="${esc(field.key)}">
                            ${esc(opt)}
                        </button>
                    `).join("")}
                </div>
            `;
            container.appendChild(el);
        } else {
            // Static detail row
            const el = document.createElement("div");
            el.className = "field-row";
            el.innerHTML = `
                <span class="field-label">${esc(field.label || field.key)}</span>
                <span class="field-value">${esc(String(val))}</span>
            `;
            container.appendChild(el);
        }
    });

    // Listen for choice clicks
    container.addEventListener("click", handleChoiceClick);
}


function handleChoiceClick(e) {
    const btn = e.target.closest(".choice");
    if (!btn) return;

    const key = btn.dataset.fieldKey;
    const value = btn.dataset.choice;

    MODAL.selections[key] = value;

    // Update selected state in this group
    const group = btn.closest(".field-choices");
    $$(".choice", group).forEach(c => {
        c.classList.toggle("selected", c === btn);
    });

    updateModalAddButton();
}


function requiredFieldsFor(product) {
    return FIELDS.filter(f => {
        const val = product.attributes ? product.attributes[f.key] : null;
        return Array.isArray(val) && val.length > 0;
    });
}


function updateModalAddButton() {
    const p = MODAL.product;
    if (!p) return;

    const btn = $("#modal-add");
    const hint = $("#modal-hint");
    const available = p.available !== false;

    if (!available) {
        btn.disabled = true;
        btn.textContent = "Sold out";
        hint.textContent = "This piece is currently unavailable.";
        return;
    }

    const required = requiredFieldsFor(p);
    const missing = required.filter(f => !MODAL.selections[f.key]);

    if (missing.length) {
        btn.disabled = true;
        btn.textContent = "Choose options";
        hint.textContent = `Please pick: ${missing.map(f => f.label || f.key).join(", ")}`;
        return;
    }

    btn.disabled = false;
    btn.textContent = "Add to cart";
    hint.textContent = "";
}


function buildOptionsString(product, selections) {
    return FIELDS
        .map(f => {
            const val = product.attributes ? product.attributes[f.key] : null;
            if (val == null || val === "") return null;
            if (Array.isArray(val)) return selections[f.key] || null;
            return String(val);
        })
        .filter(v => v != null && v !== "")
        .join(", ");
}


function closeModal() {
    if (!HISTORY.modal) {
        closeModalInternal();
        return;
    }
    history.back();
}


function closeModalInternal() {
    const modal = $("#product-modal");
    if (!modal || modal.hidden) return;

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    HISTORY.modal = false;
    MODAL.product = null;
    MODAL.selections = {};

    setTimeout(() => { modal.hidden = true; }, 320);

    if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
        lastFocused = null;
    }
}


/* =========================================================
   CART
========================================================= */
function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        CART = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(CART)) CART = [];
    } catch {
        CART = [];
    }
}


function saveCartToStorage() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(CART));
    } catch { /* silent */ }
}


function cartKeyFor(product, options) {
    return `${product.id}::${options || ""}`;
}


function addToCart(product, options) {
    if (!product || product.available === false) return;

    const key = cartKeyFor(product, options);
    const existing = CART.find(i => i.key === key);

    if (existing) {
        existing.qty += 1;
    } else {
        CART.push({
            key,
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            image: productImage(product),
            qty: 1,
            options: options || ""
        });
    }

    saveCartToStorage();
    renderCart();
}


function removeFromCart(key) {
    CART = CART.filter(i => i.key !== key);
    saveCartToStorage();
    renderCart();
}


function changeQty(key, delta) {
    const item = CART.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(key);
        return;
    }
    saveCartToStorage();
    renderCart();
}


function cartTotal() {
    return CART.reduce((sum, i) => sum + i.price * i.qty, 0);
}


function cartCount() {
    return CART.reduce((sum, i) => sum + i.qty, 0);
}


function renderCart() {
    const itemsEl = $("#cart-items");
    const emptyEl = $("#cart-empty");
    const footerEl = $("#cart-footer");
    const countEl = $("#cart-count");
    const totalEl = $("#cart-total");

    const count = cartCount();
    if (count > 0) {
        countEl.textContent = String(count);
        countEl.hidden = false;
    } else {
        countEl.hidden = true;
    }

    if (!CART.length) {
        itemsEl.innerHTML = "";
        itemsEl.hidden = true;
        emptyEl.hidden = false;
        footerEl.hidden = true;
        return;
    }

    itemsEl.hidden = false;
    emptyEl.hidden = true;
    footerEl.hidden = false;

    itemsEl.innerHTML = CART.map(item => `
        <div class="cart-item">
            <img class="cart-item-img" src="${esc(item.image)}" alt="" loading="lazy"
                 onerror="this.src='${placeholderImage()}'">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${esc(item.name)}</h4>
                ${item.options ? `<span class="cart-item-options">${esc(item.options)}</span>` : ""}
                <span class="cart-item-price">${esc(money(item.price))} each</span>
                <div class="qty">
                    <button type="button" data-qty-dec="${esc(item.key)}" aria-label="Decrease">−</button>
                    <span>${item.qty}</span>
                    <button type="button" data-qty-inc="${esc(item.key)}" aria-label="Increase">+</button>
                </div>
            </div>
            <div class="cart-item-side">
                <span class="cart-item-subtotal">${esc(money(item.price * item.qty))}</span>
                <button type="button" class="cart-item-remove" data-remove="${esc(item.key)}">Remove</button>
            </div>
        </div>
    `).join("");

    totalEl.textContent = money(cartTotal());

    // Hint about whatsapp availability
    const hint = $("#cart-hint");
    if (!BUSINESS.whatsapp) {
        $("#cart-send").disabled = true;
        hint.textContent = "Sending is unavailable — no WhatsApp number set.";
    } else {
        $("#cart-send").disabled = false;
        hint.textContent = BUSINESS.orderInstruction || "";
    }
}


function openCart() {
    const drawer = $("#cart-drawer");
    if (!drawer) return;

    renderCart();
    drawer.hidden = false;
    document.body.classList.add("cart-open");

    lastFocused = document.activeElement;

    requestAnimationFrame(() => drawer.classList.add("active"));

    if (!HISTORY.cart) {
        history.pushState({ layer: "cart" }, "");
        HISTORY.cart = true;
    }

    setTimeout(() => $("#cart-close").focus(), 120);
}


function closeCart() {
    if (!HISTORY.cart) {
        closeCartInternal();
        return;
    }
    history.back();
}


function closeCartInternal() {
    const drawer = $("#cart-drawer");
    if (!drawer || drawer.hidden) return;

    drawer.classList.remove("active");
    document.body.classList.remove("cart-open");
    HISTORY.cart = false;

    setTimeout(() => { drawer.hidden = true; }, 320);

    if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
        lastFocused = null;
    }
}


/* =========================================================
   SEND ORDER (buildWhatsAppLink)
========================================================= */
function sendOrder() {
    if (!CART.length) return;
    if (!BUSINESS.whatsapp) return;

    const name = $("#cart-name").value.trim();
    const note = $("#cart-note").value.trim();

    const cartForLink = CART.map(i => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        options: i.options || ""
    }));

    const url = buildWhatsAppLink(BUSINESS, cartForLink, name, note);
    window.open(url, "_blank");
}


/* =========================================================
   EVENTS
========================================================= */
function bindEvents() {
    // Search
    const search = $("#search-input");
    let searchTimer = null;
    search.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            VIEW.search = search.value;
            renderProducts();
        }, 140);
    });

    // Sort
    $("#sort-select").addEventListener("change", e => {
        VIEW.sort = e.target.value;
        renderProducts();
    });

    // Header cart button
    $("#cart-btn").addEventListener("click", openCart);
    $("#cart-close").addEventListener("click", closeCart);

    // Modal close
    $("#modal-close").addEventListener("click", closeModal);
    $("[data-close-modal]").addEventListener("click", closeModal);
    $("[data-close-cart]").addEventListener("click", closeCart);

    // Modal add to cart
    $("#modal-add").addEventListener("click", () => {
        const p = MODAL.product;
        if (!p || p.available === false) return;
        const required = requiredFieldsFor(p);
        const missing = required.filter(f => !MODAL.selections[f.key]);
        if (missing.length) return;

        const options = buildOptionsString(p, MODAL.selections);
        addToCart(p, options);
        closeModal();
        setTimeout(openCart, 200);
    });

    // Send order
    $("#cart-send").addEventListener("click", sendOrder);

    // Global click delegation
    document.addEventListener("click", handleDocumentClick);

    // Keyboard
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (HISTORY.modal) closeModal();
            else if (HISTORY.cart) closeCart();
        }
    });

    // History / phone back button
    window.addEventListener("popstate", () => {
        if (HISTORY.modal) { closeModalInternal(); return; }
        if (HISTORY.cart)  { closeCartInternal();  return; }
    });
}


function handleDocumentClick(e) {
    // Quick-add button on card
    const quick = e.target.closest("[data-quick-add]");
    if (quick) {
        e.stopPropagation();
        const id = quick.dataset.quickAdd;
        const product = PRODUCTS.find(p => String(p.id) === String(id));
        if (!product || product.available === false) return;

        const required = requiredFieldsFor(product);
        if (required.length) {
            openModal(product);
            return;
        }

        addToCart(product, "");
        showToast("Added to cart");
        return;
    }

    // Card body click opens modal
    const card = e.target.closest(".card");
    if (card) {
        const id = card.dataset.productId;
        const product = PRODUCTS.find(p => String(p.id) === String(id));
        if (product) openModal(product);
        return;
    }

    // Cart quantity controls
    const inc = e.target.closest("[data-qty-inc]");
    if (inc) {
        changeQty(inc.dataset.qtyInc, 1);
        return;
    }
    const dec = e.target.closest("[data-qty-dec]");
    if (dec) {
        changeQty(dec.dataset.qtyDec, -1);
        return;
    }
    const rem = e.target.closest("[data-remove]");
    if (rem) {
        removeFromCart(rem.dataset.remove);
        return;
    }
}


/* =========================================================
   TOAST
========================================================= */
function showToast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("show"));

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => { el.hidden = true; }, 320);
    }, 1800);
}


/* =========================================================
   LOADER / OFFLINE
========================================================= */
function showLoader() {
    const l = $("#loader");
    if (l) l.classList.remove("done");
}


function hideLoader() {
    const l = $("#loader");
    if (l) l.classList.add("done");
}


function showOffline() {
    const o = $("#offline");
    if (o) o.hidden = false;
}


function hideOffline() {
    const o = $("#offline");
    if (o) o.hidden = true;
}
