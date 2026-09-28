/* =========================================================
   SENDARe — Art Deco Storefront
========================================================= */


/* =========================
   CONFIG
========================= */
const SHEET_ID =
    "1cvN-hRamw4PBn0HjX3xz8mMl53yl0WoiTtuAOqAMrUY";

const BUSINESS_SHEET_URL =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0&headers=0`;

const PRODUCTS_SHEET_URL =
    `https://opensheet.elk.sh/${SHEET_ID}/Products`;

const CART_STORAGE_KEY = "sendare.cart.v1";


/* =========================
   STATE
========================= */
let business = {};
let products = [];
let currentProducts = [];
let cart = [];

// history layer tracking — 'modal' | 'cart' | null
let historyLayer = null;
let modalCloseTimer = null;
let isModalOpen = false;
let isCartOpen = false;


/* =========================================================
   ICONS — inline SVG (no emoji)
========================================================= */
const ICONS = {
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.1-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.4-3-1.4-4.7 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.5 8.7-8.1 8.7z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.2-1.5 1.5-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.7v8h3.5z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.7 4.3 18.9 19c-.2 1-.8 1.2-1.6.7l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.4-.3-.1-.5-.6-.2L7.6 13.5 3.3 12c-1-.3-1-1 .2-1.4L20 4.1c.8-.3 1.5.2 1.7 1.2z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.3 3h-2.9v12.1c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3c.3 0 .6 0 .9.1v-3c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V9.3c1 .8 2.3 1.3 3.7 1.4V7.8c-1.9-.2-3.4-1.6-3.7-3.5-.1-.4-.1-.9-.1-1.3z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.2 3h3.1l-6.8 7.8L21.5 21h-6.3l-4.9-6.4L4.6 21H1.5l7.3-8.3L1.9 3h6.4l4.4 5.8L17.2 3zm-1.1 16.1h1.7L7.9 4.8H6L16.1 19.1z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z"/></svg>`,
    sms: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.9 7L4 20l1-4.7A8 8 0 1 1 21 12z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
};


/* =========================================================
   HELPERS
========================================================= */
function clean(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function lower(value) { return clean(value).toLowerCase(); }

function hasValue(value) { return clean(value) !== ""; }

function isYes(value) {
    const v = lower(value);
    // includes "ye" per request (typo tolerance)
    return ["yes", "ye", "y", "true", "1"].includes(v);
}

/**
 * FIX #1 — blank "available" means available (opt-out not opt-in)
 */
function isAvailable(product) {
    const raw = clean(product["available"]);
    if (!raw) return true;
    return isYes(raw);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function capitalize(value) {
    const t = clean(value);
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}


/* =========================================================
   URL VALIDATORS
========================================================= */
function isValidURL(value) {
    const raw = clean(value);
    if (!raw) return false;
    try {
        const url = new URL(raw);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * FIX #6 — allow data: URIs (used by placeholder SVG) so
 * safeURL no longer neutralises the placeholder.
 */
function isValidImageURL(value) {
    const raw = clean(value);
    if (!raw) return false;
    if (raw.startsWith("data:image/")) return true;
    return isValidURL(raw);
}

function safeURL(value) {
    const raw = clean(value);
    if (!isValidURL(raw)) return "";
    return raw;
}

function safeImageSrc(value) {
    const raw = clean(value);
    if (!raw) return createPlaceholderImage();
    if (raw.startsWith("data:image/")) return raw;
    return isValidURL(raw) ? raw : createPlaceholderImage();
}


/* =========================================================
   PLACEHOLDER IMAGE (local SVG — no network)
========================================================= */
function createPlaceholderImage() {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
            <rect width="600" height="750" fill="#e8dcc0"/>
            <rect x="24" y="24" width="552" height="702" fill="none" stroke="#b08647" stroke-width="1" opacity="0.5"/>
            <rect x="34" y="34" width="532" height="682" fill="none" stroke="#b08647" stroke-width="0.5" opacity="0.4"/>
            <g transform="translate(300 375)">
                <polygon points="0,-24 24,0 0,24 -24,0" fill="none" stroke="#b08647" stroke-width="1.4"/>
                <polygon points="0,-14 14,0 0,14 -14,0" fill="none" stroke="#b08647" stroke-width="0.8" opacity="0.6"/>
                <line x1="-70" y1="0" x2="-30" y2="0" stroke="#b08647" stroke-width="1"/>
                <line x1="30" y1="0" x2="70" y2="0" stroke="#b08647" stroke-width="1"/>
            </g>
            <text x="300" y="455" text-anchor="middle" fill="#8a6531" font-family="Georgia" font-size="13" letter-spacing="6">NO IMAGE</text>
        </svg>
    `;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}


/* =========================================================
   BUSINESS SHEET PARSER
========================================================= */
function parseGVizBusinessResponse(text) {
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?\s*$/);
    if (!match) throw new Error("Invalid Business sheet response.");

    const data = JSON.parse(match[1]);
    const rows = data?.table?.rows || [];

    return rows.map(row => ({
        field: clean(row?.c?.[0]?.v),
        value: clean(row?.c?.[2]?.v)
    }));
}

/**
 * FIX #15 — parseBusinessSheet simplified.
 * The gviz parser already returns {field, value}, so no
 * fallback branch hunting is needed.
 */
function parseBusinessSheet(rows) {
    const result = {};
    if (!Array.isArray(rows)) return result;

    rows.forEach(row => {
        if (!row || typeof row !== "object") return;
        const field = clean(row.field);
        const value = clean(row.value);
        if (field) result[lower(field)] = value;
    });

    return result;
}


/* =========================================================
   PRODUCTS SHEET PARSER
========================================================= */
function parseProductsSheet(rows) {
    if (!Array.isArray(rows)) return [];

    return rows
        .filter(row => row && typeof row === "object")
        .map(row => {
            const product = {};
            Object.keys(row).forEach(key => {
                product[lower(key)] = clean(row[key]);
            });
            return product;
        })
        .filter(product => hasValue(product["product name"]));
}


/* =========================================================
   LOAD SHEET DATA
========================================================= */
async function loadSheetData() {
    showPageLoader();

    try {
        const [bizRes, prodRes] = await Promise.all([
            fetch(BUSINESS_SHEET_URL),
            fetch(PRODUCTS_SHEET_URL)
        ]);

        if (!bizRes.ok) throw new Error("Business sheet could not be loaded.");
        if (!prodRes.ok) throw new Error("Products sheet could not be loaded.");

        const businessText = await bizRes.text();
        const businessRows = parseGVizBusinessResponse(businessText);
        const productRows = await prodRes.json();

        business = parseBusinessSheet(businessRows);
        products = parseProductsSheet(productRows);

        loadBusiness();
        loadSocialLinks();
        loadCategories();
        renderProducts();

        hideProductError();
        hidePageLoader();

    } catch (error) {
        console.error("Sendare sheet error:", error);
        showProductError();
        hidePageLoader();
    }
}


/* =========================================================
   BUSINESS INFORMATION
========================================================= */
function loadBusiness() {
    const businessName = business["business name"] || "Store";
    const logo = business["logo"];
    const tagline = business["tagline"];
    const description = business["description"];
    const location = business["location"];
    const delivery = business["delivery"];
    const openingHours = business["opening hours"];
    const paymentMethod = business["payment method"];
    const contactMessage = business["contact message"];
    const orderInstruction = business["order instruction"];
    const phone = business["phone"];

    document.title = `${businessName} — Store`;

    setText("header-business-name", businessName);
    setText("header-tagline", tagline);
    setText("hero-business-name", businessName);
    setText("hero-tagline", tagline);
    setText("hero-description", description);
    setText("about-business-name", businessName);
    setText("about-description", description);
    setText("footer-business-name", businessName);
    setText("footer-business-name-bottom", businessName);
    setText("footer-tagline", tagline);
    setText("quick-location", location);
    setText("quick-delivery", delivery);
    setText("quick-hours", openingHours);
    setText("quick-payment", paymentMethod);
    setText("detail-location", location);
    setText("detail-delivery", delivery);
    setText("detail-payment", paymentMethod);
    setText("detail-hours", openingHours);
    setText("contact-message", contactMessage || "We would be delighted to hear from you.");
    setText("modal-order-instruction", orderInstruction);

    setYear();

    toggleInfoCard("location", location);
    toggleInfoCard("delivery", delivery);
    toggleInfoCard("hours", openingHours);
    toggleInfoCard("payment", paymentMethod);

    toggleElement("location-card", location);
    toggleElement("delivery-card", delivery);
    toggleElement("payment-card", paymentMethod);
    toggleElement("hours-card", openingHours);

    // Logo
    if (isValidImageURL(logo)) {
        setImage("header-logo", logo, businessName);
        setImage("about-logo", logo, businessName);
        setImage("footer-logo", logo, businessName);

        showElement("about-logo");
        hideElement("about-placeholder");

        const hero = document.getElementById("hero");
        if (hero) {
            hero.style.backgroundImage =
                `linear-gradient(180deg, rgba(20,16,8,.82), rgba(20,16,8,.6)), url("${safeURL(logo)}")`;
            hero.style.backgroundSize = "cover";
            hero.style.backgroundPosition = "center";
        }
    } else {
        hideElement("header-logo");
        hideElement("about-logo");
        hideElement("footer-logo");
        showElement("about-placeholder");
    }

    // Phone
    const phoneLink = document.getElementById("contact-phone");
    if (phoneLink && phone) {
        phoneLink.href = `tel:${phone}`;
        phoneLink.hidden = false;
    }

    // Google Maps
    const maps = business["google maps"];
    const mapsLink = document.getElementById("google-maps-link");
    if (mapsLink && isValidURL(maps)) {
        mapsLink.href = maps;
        mapsLink.hidden = false;
    }

    // Contact actions + WhatsApp order button
    buildContactActions();
}


/* =========================================================
   CONTACT ACTIONS — multi-platform
========================================================= */
function buildContactActions() {
    const container = document.getElementById("contact-actions");
    if (!container) return;

    container.innerHTML = "";

    const platforms = [
        { key: "whatsapp business", alt: ["whatsapp"], label: "WhatsApp",     icon: ICONS.whatsapp,  kind: "chat" },
        { key: "instagram",                                  label: "Instagram",   icon: ICONS.instagram, kind: "link" },
        { key: "facebook",                                   label: "Facebook",    icon: ICONS.facebook,  kind: "link" },
        { key: "telegram",                                   label: "Telegram",    icon: ICONS.telegram,  kind: "link" },
        { key: "tiktok",                                     label: "TikTok",      icon: ICONS.tiktok,    kind: "link" },
        { key: "x",                                          label: "X",           icon: ICONS.x,         kind: "link" }
    ];

    let hasWhatsapp = false;

    platforms.forEach(platform => {
        let raw = business[platform.key];
        if (!raw && platform.alt) {
            for (const alt of platform.alt) {
                if (business[alt]) { raw = business[alt]; break; }
            }
        }
        if (!hasValue(raw)) return;

        // WhatsApp — build wa.me link
        if (platform.kind === "chat") {
            const url = createWhatsAppLink(raw);
            if (!url) return;
            hasWhatsapp = true;

            container.innerHTML += `
                <a class="contact-action" href="${url}" target="_blank" rel="noopener noreferrer">
                    ${platform.icon}
                    <span class="action-platform">
                        <small>Chat on</small>
                        <strong>${escapeHTML(platform.label)}</strong>
                    </span>
                </a>
            `;
            return;
        }

        // Others — require valid URL
        if (!isValidURL(raw)) return;

        container.innerHTML += `
            <a class="contact-action" href="${safeURL(raw)}" target="_blank" rel="noopener noreferrer">
                ${platform.icon}
                <span class="action-platform">
                    <small>Follow on</small>
                    <strong>${escapeHTML(platform.label)}</strong>
                </span>
            </a>
        `;
    });

    // Phone
    const phone = business["phone"];
    if (hasValue(phone)) {
        container.innerHTML += `
            <a class="contact-action" href="tel:${escapeHTML(phone)}">
                ${ICONS.phone}
                <span class="action-platform">
                    <small>Call us on</small>
                    <strong>${escapeHTML(phone)}</strong>
                </span>
            </a>
        `;
    }

    // Email
    const email = business["email"];
    if (hasValue(email) && email.includes("@")) {
        container.innerHTML += `
            <a class="contact-action" href="mailto:${escapeHTML(email)}">
                ${ICONS.mail}
                <span class="action-platform">
                    <small>Write to</small>
                    <strong>${escapeHTML(email)}</strong>
                </span>
            </a>
        `;
    }

    // Show WhatsApp order button in header/modal/hero only if we have WhatsApp
    if (hasWhatsapp) {
        const wa = business["whatsapp business"] || business["whatsapp"] || business["phone"];
        const url = createWhatsAppLink(wa);
        setLink("header-whatsapp", url);
        setLink("hero-whatsapp", url);
        showElement("header-whatsapp");
        showElement("hero-whatsapp");
    }
}


/* =========================================================
   WHATSAPP
========================================================= */
function createWhatsAppLink(number, message = "") {
    let phone = clean(number).replace(/\D/g, "");
    if (!phone) return "";

    // +234 style default. If a full country code is present, keep it.
    if (phone.startsWith("0") && phone.length >= 10) {
        phone = "234" + phone.substring(1);
    } else if (phone.length === 10) {
        phone = "234" + phone;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


/* =========================================================
   SOCIAL LINKS
========================================================= */
function loadSocialLinks() {
    const container = document.getElementById("social-links");
    const footerContainer = document.getElementById("footer-socials");

    if (container) container.innerHTML = "";
    if (footerContainer) footerContainer.innerHTML = "";

    const platforms = [
        { key: "instagram", label: "Instagram", icon: ICONS.instagram },
        { key: "facebook",  label: "Facebook",  icon: ICONS.facebook  },
        { key: "tiktok",    label: "TikTok",    icon: ICONS.tiktok    },
        { key: "telegram",  label: "Telegram",  icon: ICONS.telegram  },
        { key: "youtube",   label: "YouTube",   icon: null            },
        { key: "x",         label: "X",         icon: ICONS.x         }
    ];

    platforms.forEach(platform => {
        const value = business[platform.key];
        if (!hasValue(value)) return;
        if (!isValidURL(value)) return;

        const icon = platform.icon || "";

        if (container) {
            container.innerHTML += `
                <a class="social-link" href="${safeURL(value)}" target="_blank" rel="noopener noreferrer">
                    ${icon}
                    <span>${escapeHTML(platform.label)}</span>
                </a>
            `;
        }

        if (footerContainer) {
            footerContainer.innerHTML += `
                <a href="${safeURL(value)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(platform.label)}">
                    ${icon || escapeHTML(platform.label)}
                </a>
            `;
        }
    });
}


/* =========================================================
   CATEGORIES — FIX #13 (dedupe case-insensitively)
========================================================= */
function loadCategories() {
    const container = document.getElementById("category-filters");
    if (!container) return;

    const seen = new Map();
    products.forEach(product => {
        const raw = clean(product["category"]);
        if (!raw) return;
        const key = lower(raw);
        if (!seen.has(key)) seen.set(key, raw);
    });

    const categories = Array.from(seen.values());

    container.innerHTML = "";

    addCategoryButton(container, "all", "All", true);

    categories.forEach(category => {
        addCategoryButton(container, category, category, false);
    });

    container.querySelectorAll(".category-btn").forEach(button => {
        button.addEventListener("click", () => {
            container.querySelectorAll(".category-btn")
                .forEach(item => item.classList.remove("active"));

            button.classList.add("active");
            renderProducts(button.dataset.category);
        });
    });
}

function addCategoryButton(container, value, label, active) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = active ? "category-btn active" : "category-btn";
    button.dataset.category = value;
    button.textContent = label;
    container.appendChild(button);
}


/* =========================================================
   PRODUCT IMAGES / PRICE
========================================================= */
function getProductImages(product) {
    return [
        product["img1"],
        product["img2"],
        product["img3"],
        product["img4"]
    ].map(clean).filter(isValidImageURL);
}


/* FIX #9 — clean currency key map */
function getCurrency() {
    const currency = business["currency"];
    if (!currency) return "₦";

    const first = currency.split(",")[0].trim().toLowerCase();

    const symbols = {
        "naira": "₦",
        "ngn": "₦",
        "dollar": "$",
        "usd": "$",
        "pound": "£",
        "gbp": "£",
        "euro": "€",
        "eur": "€",
        "riyal": "﷼",
        "sar": "﷼",
        "dirham": "د.إ",
        "aed": "د.إ"
    };

    return symbols[first] || first || "₦";
}


/**
 * FIX #8 — formatPrice returns raw value (no escaping).
 * Escaping happens at render sites.
 */
function formatPrice(value) {
    const raw = clean(value);
    if (!raw) return "";

    const number = Number(raw.replace(/,/g, ""));
    if (Number.isNaN(number)) return raw;

    return `${getCurrency()}${number.toLocaleString()}`;
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */
function renderProducts(category = "all") {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    const searchInput = document.getElementById("product-search");
    const search = lower(searchInput ? searchInput.value : "");

    currentProducts = products.filter(product => {
        const productCategory = lower(product["category"]);
        const name = lower(product["product name"]);
        const description = lower(product["description"]);

        const matchesCategory = category === "all" || productCategory === lower(category);
        const matchesSearch = !search ||
            name.includes(search) ||
            description.includes(search) ||
            productCategory.includes(search);

        return matchesCategory && matchesSearch;
    });

    // FIX #7 — re-apply current sort after filtering
    const sortSelect = document.getElementById("sort-products");
    if (sortSelect && sortSelect.value !== "default") {
        applySort(currentProducts, sortSelect.value);
    }

    updateProductCount(currentProducts.length);

    if (!currentProducts.length) {
        grid.innerHTML = "";
        showElement("products-empty");
        return;
    }

    hideElement("products-empty");
    paintGrid(currentProducts);
}


/* FIX #5 — single paint function used by both paths */
function paintGrid(list) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    grid.innerHTML = list.map((p, i) => createProductCard(p, i)).join("");

    grid.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => {
            img.src = createPlaceholderImage();
        }, { once: true });
    });
}


/* =========================================================
   PRODUCT CARD
========================================================= */
function createProductCard(product, displayIndex) {
    const images = getProductImages(product);
    const image = images[0] || createPlaceholderImage();
    const name = product["product name"] || "Product";
    const category = product["category"];
    const price = product["price"];
    const oldPrice = product["old price"];
    const available = isAvailable(product);
    const featured = isYes(product["featured"]);
    const newArrival = isYes(product["new arrival"]);

    let badges = "";
    if (featured) badges += `<span class="product-badge">Featured</span>`;
    if (newArrival) badges += `<span class="product-badge">New</span>`;
    if (!available) badges += `<span class="product-badge unavailable">Unavailable</span>`;

    let oldPriceHTML = "";
    const numericPrice = numericValue(price);
    const numericOldPrice = numericValue(oldPrice);

    if (oldPrice && numericOldPrice > numericPrice && numericPrice > 0) {
        oldPriceHTML = `<del>${escapeHTML(formatPrice(oldPrice))}</del>`;
    }

    const inCart = isInCart(product);

    return `
        <article class="product-card" data-product-index="${displayIndex}">
            <div class="product-image">
                <img src="${safeImageSrc(image)}" alt="${escapeHTML(name)}" loading="lazy" decoding="async">
                <div class="product-badges">${badges}</div>
            </div>

            <div class="product-content">
                <div class="product-category">${escapeHTML(category || "")}</div>
                <h3>${escapeHTML(name)}</h3>

                <div class="product-price">
                    <strong>${escapeHTML(formatPrice(price))}</strong>
                    ${oldPriceHTML}
                </div>

                <div class="product-actions">
                    <button class="view-product" type="button" data-open-product="${displayIndex}">
                        View
                    </button>
                    <button class="add-to-cart ${inCart ? "added" : ""}" type="button"
                            data-add-cart="${displayIndex}"
                            aria-label="Add ${escapeHTML(name)} to cart">
                        ${inCart ? ICONS.check : ICONS.plus}
                    </button>
                </div>
            </div>
        </article>
    `;
}


function updateProductCount(count) {
    const element = document.getElementById("product-count");
    if (!element) return;
    element.textContent = `${count} ${count === 1 ? "Item" : "Items"}`;
}


/* =========================================================
   PRODUCT MODAL — FIX #4, #18 (timer + scroll reset)
========================================================= */
function openProduct(displayIndex) {
    const product = currentProducts[Number(displayIndex)];
    if (!product) return;

    const modal = document.getElementById("product-modal");
    if (!modal) return;

    clearTimeout(modalCloseTimer);

    const images = getProductImages(product);
    const name = product["product name"] || "Product";

    setText("modal-title", name);
    setText("modal-category", product["category"]);
    setText("modal-price", formatPrice(product["price"]));

    // Old price
    const oldPrice = clean(product["old price"]);
    const oldPriceElement = document.getElementById("modal-old-price");
    const currentNum = numericValue(product["price"]);
    const prevNum = numericValue(oldPrice);

    if (oldPriceElement && oldPrice && prevNum > currentNum && currentNum > 0) {
        oldPriceElement.textContent = formatPrice(oldPrice);
        oldPriceElement.hidden = false;
    } else if (oldPriceElement) {
        oldPriceElement.textContent = "";
        oldPriceElement.hidden = true;
    }

    // FIX #8 — textContent un-escapes; pass raw value, not escaped
    setText("modal-description", product["description"]);
    setText("modal-colour", product["colour"]);
    setText("modal-sizes", product["sizes"]);
    setText("modal-material", product["material"]);

    toggleModalDetail("colour", product["colour"]);
    toggleModalDetail("sizes", product["sizes"]);
    toggleModalDetail("material", product["material"]);

    // Stock
    const available = isAvailable(product);
    const stock = product["stock"];
    const stockText = available
        ? (stock ? `In stock — ${stock}` : "Available")
        : "Currently unavailable";
    setText("modal-stock", stockText);
    toggleModalDetail("stock", true);

    // Badges
    const badges = document.getElementById("modal-badges");
    if (badges) {
        badges.innerHTML = "";
        if (isYes(product["featured"])) badges.innerHTML += `<span class="modal-badge">Featured</span>`;
        if (isYes(product["new arrival"])) badges.innerHTML += `<span class="modal-badge">New Arrival</span>`;
        if (!available) badges.innerHTML += `<span class="modal-badge">Unavailable</span>`;
    }

    // Main image
    setModalMainImage(images[0] || createPlaceholderImage(), name);

    // Thumbnails
    renderModalThumbnails(images, name);

    // Add to Cart
    const addCartBtn = document.getElementById("modal-add-cart");
    if (addCartBtn) {
        addCartBtn.disabled = false;
        addCartBtn.dataset.productIndex = String(displayIndex);
    }

    // WhatsApp order
    const whatsapp = business["whatsapp business"] || business["whatsapp"] || business["phone"];
    const orderButton = document.getElementById("modal-whatsapp");

    if (orderButton) {
        if (whatsapp && available) {
            const message = `Hello, I would like to order: ${name}`;
            orderButton.href = createWhatsAppLink(whatsapp, message);
            orderButton.hidden = false;
        } else {
            orderButton.hidden = true;
        }
    }

    // FIX #18 — reset scroll
    const container = modal.querySelector(".modal-container");
    if (container) container.scrollTop = 0;

    modal.hidden = false;
    isModalOpen = true;
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => modal.classList.add("active"));

    // FIX #7 (history) — push a state so phone back closes modal
    if (historyLayer !== "modal") {
        history.pushState({ layer: "modal" }, "");
        historyLayer = "modal";
    }
}


function closeProduct() {
    if (!isModalOpen) return;
    if (historyLayer === "modal") {
        history.back();
    } else {
        closeProductInternal();
    }
}


function closeProductInternal() {
    const modal = document.getElementById("product-modal");
    if (!modal) return;

    modal.classList.remove("active");
    isModalOpen = false;
    document.body.classList.remove("modal-open");
    historyLayer = null;

    clearTimeout(modalCloseTimer);
    modalCloseTimer = setTimeout(() => {
        modal.hidden = true;
    }, 320);
}


function setModalMainImage(src, alt) {
    const image = document.getElementById("modal-main-image");
    const loader = document.getElementById("modal-image-loader");
    if (!image) return;

    if (loader) loader.classList.remove("loaded");

    image.onload = () => { if (loader) loader.classList.add("loaded"); };
    image.onerror = () => {
        image.src = createPlaceholderImage();
        if (loader) loader.classList.add("loaded");
    };

    image.alt = alt || "Product";
    image.src = safeImageSrc(src);
}


function renderModalThumbnails(images, productName) {
    const container = document.getElementById("modal-thumbnails");
    if (!container) return;

    container.innerHTML = "";
    if (images.length <= 1) return;

    images.forEach((image, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = index === 0 ? "product-thumbnail active" : "product-thumbnail";
        button.setAttribute("aria-label", `View image ${index + 1}`);

        const img = document.createElement("img");
        img.src = safeImageSrc(image);
        img.alt = `${productName || "Product"} image ${index + 1}`;
        img.loading = "lazy";
        img.decoding = "async";

        img.addEventListener("error", () => {
            img.src = createPlaceholderImage();
        }, { once: true });

        button.appendChild(img);

        button.addEventListener("click", () => {
            container.querySelectorAll(".product-thumbnail")
                .forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            setModalMainImage(image, productName);
        });

        container.appendChild(button);
    });
}


/* =========================================================
   SEARCH & SORT
========================================================= */
function setupSearch() {
    const input = document.getElementById("product-search");
    if (!input || input.dataset.bound) return;
    input.dataset.bound = "true";

    input.addEventListener("input", () => {
        const activeButton = document.querySelector(".category-btn.active");
        const category = activeButton ? activeButton.dataset.category : "all";
        renderProducts(category);
    });
}


function setupSorting() {
    const select = document.getElementById("sort-products");
    if (!select || select.dataset.bound) return;
    select.dataset.bound = "true";

    select.addEventListener("change", () => {
        applySort(currentProducts, select.value);
        paintGrid(currentProducts);
    });
}


function applySort(list, sort) {
    if (sort === "price-low") {
        list.sort((a, b) => numericValue(a["price"]) - numericValue(b["price"]));
    } else if (sort === "price-high") {
        list.sort((a, b) => numericValue(b["price"]) - numericValue(a["price"]));
    } else if (sort === "new") {
        list.sort((a, b) =>
            Number(isYes(b["new arrival"])) - Number(isYes(a["new arrival"]))
        );
    }
    return list;
}


function numericValue(value) {
    const number = Number(clean(value).replace(/,/g, ""));
    return Number.isNaN(number) ? 0 : number;
}


/* =========================================================
   CART
========================================================= */
function cartKey(product) {
    return lower(product["product name"]) + "::" + lower(product["price"]);
}


function loadCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch {
        cart = [];
    }
}


function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch { /* silent */ }
}


function isInCart(product) {
    const key = cartKey(product);
    return cart.some(item => item.key === key);
}


function addToCart(product, quantity = 1) {
    const key = cartKey(product);
    const existing = cart.find(item => item.key === key);
    const images = getProductImages(product);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            key,
            name: product["product name"] || "Product",
            price: product["price"] || "",
            image: images[0] || "",
            quantity
        });
    }

    saveCart();
    updateCartUI();
}


function removeFromCart(key) {
    cart = cart.filter(item => item.key !== key);
    saveCart();
    updateCartUI();
}


function setCartQuantity(key, quantity) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
        removeFromCart(key);
        return;
    }
    saveCart();
    updateCartUI();
}


function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}


function getCartTotal() {
    return cart.reduce((sum, item) => sum + numericValue(item.price) * item.quantity, 0);
}


function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}


function updateCartUI() {
    const countBadge = document.getElementById("cart-count");
    const container = document.getElementById("cart-items");
    const emptyState = document.getElementById("cart-empty");
    const totalEl = document.getElementById("cart-total");

    const count = getCartCount();

    if (countBadge) {
        if (count > 0) {
            countBadge.textContent = String(count);
            countBadge.hidden = false;
        } else {
            countBadge.hidden = true;
        }
    }

    if (!container) return;

    if (!cart.length) {
        container.innerHTML = "";
        if (emptyState) emptyState.hidden = false;
    } else {
        if (emptyState) emptyState.hidden = true;
        container.innerHTML = cart.map(createCartItemHTML).join("");

        container.querySelectorAll("[data-qty-inc]").forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.dataset.qtyInc;
                const item = cart.find(i => i.key === key);
                if (item) setCartQuantity(key, item.quantity + 1);
            });
        });

        container.querySelectorAll("[data-qty-dec]").forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.dataset.qtyDec;
                const item = cart.find(i => i.key === key);
                if (item) setCartQuantity(key, item.quantity - 1);
            });
        });

        container.querySelectorAll("[data-qty-remove]").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(btn.dataset.qtyRemove));
        });
    }

    if (totalEl) {
        totalEl.textContent = cart.length ? formatPrice(String(getCartTotal())) : "—";
    }

    // Refresh product cards' add-to-cart state
    document.querySelectorAll("[data-add-cart]").forEach(btn => {
        const idx = Number(btn.dataset.addCart);
        const product = currentProducts[idx];
        if (!product) return;
        const inCart = isInCart(product);
        btn.classList.toggle("added", inCart);
        btn.innerHTML = inCart ? ICONS.check : ICONS.plus;
    });
}


function createCartItemHTML(item) {
    const img = item.image ? safeImageSrc(item.image) : createPlaceholderImage();
    const subtotal = numericValue(item.price) * item.quantity;

    return `
        <div class="cart-item">
            <img class="cart-item-image" src="${img}" alt="${escapeHTML(item.name)}" loading="lazy">

            <div class="cart-item-info">
                <h4>${escapeHTML(item.name)}</h4>
                <div class="cart-item-price">${escapeHTML(formatPrice(item.price))}</div>

                <div class="cart-item-qty">
                    <button type="button" data-qty-dec="${escapeHTML(item.key)}" aria-label="Decrease">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-qty-inc="${escapeHTML(item.key)}" aria-label="Increase">+</button>
                </div>
            </div>

            <div class="cart-item-side">
                <div class="cart-item-subtotal">${escapeHTML(formatPrice(String(subtotal)))}</div>
                <button class="cart-item-remove" type="button" data-qty-remove="${escapeHTML(item.key)}">
                    Remove
                </button>
            </div>
        </div>
    `;
}


/* =========================================================
   CART DRAWER — with history support
========================================================= */
function openCart() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;

    updateCartUI();
    drawer.hidden = false;
    isCartOpen = true;
    document.body.classList.add("cart-open");

    requestAnimationFrame(() => drawer.classList.add("active"));

    if (historyLayer !== "cart") {
        history.pushState({ layer: "cart" }, "");
        historyLayer = "cart";
    }
}


function closeCart() {
    if (!isCartOpen) return;
    if (historyLayer === "cart") {
        history.back();
    } else {
        closeCartInternal();
    }
}


function closeCartInternal() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;

    drawer.classList.remove("active");
    isCartOpen = false;
    document.body.classList.remove("cart-open");
    historyLayer = null;

    setTimeout(() => { drawer.hidden = true; }, 320);
}


/* =========================================================
   CART SEND MENU
========================================================= */
function buildSendMenu() {
    const container = document.getElementById("cart-send-options");
    if (!container) return;

    const options = [];

    const whatsapp = business["whatsapp business"] || business["whatsapp"] || business["phone"];
    if (hasValue(whatsapp)) {
        options.push({
            key: "whatsapp",
            label: "WhatsApp",
            icon: ICONS.whatsapp,
            action: () => sendOrderVia("whatsapp")
        });
    }

    const telegram = business["telegram"];
    if (isValidURL(telegram)) {
        options.push({
            key: "telegram",
            label: "Telegram",
            icon: ICONS.telegram,
            action: () => sendOrderVia("telegram")
        });
    }

    const email = business["email"];
    if (hasValue(email) && email.includes("@")) {
        options.push({
            key: "email",
            label: "Email",
            icon: ICONS.mail,
            action: () => sendOrderVia("email")
        });
    }

    if (hasValue(business["phone"])) {
        options.push({
            key: "sms",
            label: "SMS",
            icon: ICONS.sms,
            action: () => sendOrderVia("sms")
        });
    }

    container.innerHTML = "";

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cart-send-option";
        btn.innerHTML = `${opt.icon}<span>${escapeHTML(opt.label)}</span>`;
        btn.addEventListener("click", opt.action);
        container.appendChild(btn);
    });

    if (!options.length) {
        container.innerHTML = `<p class="cart-empty-hint">No contact method available.</p>`;
    }
}


function buildOrderMessage() {
    const businessName = business["business name"] || "Store";
    const name = clean(document.getElementById("cart-name")?.value);
    const note = clean(document.getElementById("cart-note")?.value);

    let msg = `*New Order — ${businessName}*\n\n`;

    cart.forEach((item, i) => {
        const lineTotal = numericValue(item.price) * item.quantity;
        msg += `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(String(lineTotal))}\n`;
    });

    msg += `\n*Subtotal:* ${formatPrice(String(getCartTotal()))}`;

    if (name) msg += `\n\n*Name:* ${name}`;
    if (note) msg += `\n*Note:* ${note}`;

    return msg;
}


function sendOrderVia(channel) {
    const message = buildOrderMessage();
    const encoded = encodeURIComponent(message);

    if (channel === "whatsapp") {
        const num = business["whatsapp business"] || business["whatsapp"] || business["phone"];
        const url = createWhatsAppLink(num, message);
        if (url) window.open(url, "_blank");
        return;
    }

    if (channel === "telegram") {
        // Telegram doesn't support prefilled text to arbitrary users,
        // so open the business profile link.
        const tg = business["telegram"];
        if (isValidURL(tg)) window.open(tg, "_blank");
        return;
    }

    if (channel === "email") {
        const email = business["email"];
        const subject = encodeURIComponent(`New Order — ${business["business name"] || "Store"}`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${encoded}`;
        return;
    }

    if (channel === "sms") {
        const phone = business["phone"];
        // Some platforms use "?body=", others use "&body=" — "?body=" works widely.
        window.location.href = `sms:${phone}?body=${encoded}`;
    }
}


/* =========================================================
   EVENT DELEGATION
========================================================= */
document.addEventListener("click", event => {
    // Open product
    const openBtn = event.target.closest("[data-open-product]");
    if (openBtn) {
        openProduct(openBtn.dataset.openProduct);
        return;
    }

    // Add to cart (card)
    const addBtn = event.target.closest("[data-add-cart]");
    if (addBtn) {
        const idx = Number(addBtn.dataset.addCart);
        const product = currentProducts[idx];
        if (!product) return;
        if (!isAvailable(product)) return;

        addToCart(product, 1);

        // Quick visual feedback
        addBtn.classList.add("added");
        addBtn.innerHTML = ICONS.check;
        setTimeout(() => updateCartUI(), 900);
        return;
    }

    // Modal backdrop
    if (event.target.classList.contains("modal-backdrop")) {
        closeProduct();
        return;
    }

    // Cart backdrop
    if (event.target.classList.contains("cart-backdrop")) {
        closeCart();
        return;
    }
});


/* =========================================================
   HISTORY (phone back button)
========================================================= */
window.addEventListener("popstate", () => {
    if (historyLayer === "modal" || isModalOpen) {
        closeProductInternal();
        return;
    }
    if (historyLayer === "cart" || isCartOpen) {
        closeCartInternal();
        return;
    }
    historyLayer = null;
});


/* =========================================================
   MOBILE MENU
========================================================= */
function setupMobileMenu() {
    const button = document.getElementById("menu-btn");
    const nav = document.getElementById("main-nav");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
        const active = nav.classList.toggle("active");
        button.setAttribute("aria-expanded", String(active));
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            button.setAttribute("aria-expanded", "false");
        });
    });
}


/* =========================================================
   MODAL CLOSE BUTTON (FIX — the × works now)
========================================================= */
function setupModalClose() {
    const closeButton = document.getElementById("modal-close");
    if (closeButton) {
        closeButton.addEventListener("click", closeProduct);
    }

    const cartCloseButton = document.getElementById("cart-close");
    if (cartCloseButton) {
        cartCloseButton.addEventListener("click", closeCart);
    }
}


/* =========================================================
   CART BUTTONS
========================================================= */
function setupCartButtons() {
    const headerBtn = document.getElementById("header-cart-btn");
    const heroBtn = document.getElementById("hero-cart-btn");

    if (headerBtn) headerBtn.addEventListener("click", openCart);
    if (heroBtn) heroBtn.addEventListener("click", openCart);

    const addCartFromModal = document.getElementById("modal-add-cart");
    if (addCartFromModal) {
        addCartFromModal.addEventListener("click", () => {
            const idx = Number(addCartFromModal.dataset.productIndex);
            const product = currentProducts[idx];
            if (!product) return;
            addToCart(product, 1);
            closeProduct();
            openCart();
        });
    }

    const sendBtn = document.getElementById("cart-send");
    const sendMenu = document.getElementById("cart-send-menu");

    if (sendBtn && sendMenu) {
        sendBtn.addEventListener("click", () => {
            if (!cart.length) return;
            buildSendMenu();
            sendMenu.hidden = !sendMenu.hidden;
        });
    }

    const clearBtn = document.getElementById("cart-clear");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (!cart.length) return;
            if (confirm("Clear all items from your order?")) {
                clearCart();
                if (sendMenu) sendMenu.hidden = true;
            }
        });
    }
}


/* =========================================================
   RETRY (FIX #2 — bound before load, idempotent)
========================================================= */
function setupRetry() {
    const button = document.getElementById("retry-products");
    if (!button || button.dataset.bound) return;

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
        hideProductError();
        loadSheetData();
    });
}


function showProductError() {
    const grid = document.getElementById("product-grid");
    if (grid) grid.innerHTML = "";
    showElement("products-error");
}


function hideProductError() {
    hideElement("products-error");
}


/* =========================================================
   PAGE LOADER
========================================================= */
function showPageLoader() {
    const loader = document.getElementById("page-loader");
    if (loader) loader.classList.remove("loaded");
}


function hidePageLoader() {
    const loader = document.getElementById("page-loader");
    if (loader) loader.classList.add("loaded");
}


/* =========================================================
   DOM HELPERS
========================================================= */
function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = clean(value);
}


function setLink(id, url) {
    const element = document.getElementById(id);
    if (!element) return;
    element.href = url;
}


function setImage(id, src, alt) {
    const image = document.getElementById(id);
    if (!image) return;
    image.src = safeImageSrc(src);
    image.alt = alt || "Business";
}


function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.hidden = false;
}


function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.hidden = true;
}


function toggleElement(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.hidden = !hasValue(value);
}


function toggleInfoCard(type, value) {
    const card = document.querySelector(`[data-info-card="${type}"]`);
    if (!card) return;
    card.hidden = !hasValue(value);
}


function toggleModalDetail(type, value) {
    const element = document.querySelector(`[data-detail="${type}"]`);
    if (!element) return;
    element.hidden = !hasValue(value);
}


function setYear() {
    const year = document.getElementById("footer-year");
    if (year) year.textContent = new Date().getFullYear();
}


/* =========================================================
   KEYBOARD
========================================================= */
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (isModalOpen) closeProduct();
        else if (isCartOpen) closeCart();
    }
});


/* =========================================================
   START APPLICATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    // Bind UI listeners once, before any network work.
    setupMobileMenu();
    setupModalClose();
    setupCartButtons();
    setupSearch();
    setupSorting();
    setupRetry();

    // Restore persisted cart
    loadCart();
    updateCartUI();

    // Kick off the network load.
    loadSheetData();
});
