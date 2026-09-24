const SHEET_ID = "1cvN-hRamw4PBn0HjX3xz8mMl53yl0WoiTtuAOqAMrUY";

const businessSheetURL =
    `https://opensheet.elk.sh/${SHEET_ID}/Business`;

const productsSheetURL =
    `https://opensheet.elk.sh/${SHEET_ID}/Products`;

let business = {};
let products = [];


// ===============================
// LOAD GOOGLE SHEET DATA
// ===============================

async function loadSheetData() {
    try {
        const [businessResponse, productsResponse] = await Promise.all([
            fetch(businessSheetURL),
            fetch(productsSheetURL)
        ]);

        if (!businessResponse.ok || !productsResponse.ok) {
            throw new Error("Unable to fetch Google Sheet");
        }

        const businessData = await businessResponse.json();
        const productsData = await productsResponse.json();

        // Convert Business tab:
        // field | value
        // into:
        // business[field] = value

        business = {};

        businessData.forEach(row => {
            const field = (row.field || "").trim().toLowerCase();
            const value = row.value || "";

            if (field) {
                business[field] = value;
            }
        });

        // Products tab
        products = productsData.map(product => {
            const cleanedProduct = {};

            Object.keys(product).forEach(key => {
                cleanedProduct[key.trim().toLowerCase()] =
                    product[key] || "";
            });

            return cleanedProduct;
        });

        loadBusiness();
        loadSocialLinks();
        loadCategories();
        renderProducts();

    } catch (error) {
        console.error("Sheet loading error:", error);

        const productGrid = document.getElementById("product-grid");

        if (productGrid) {
            productGrid.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load products</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
}


// ===============================
// BUSINESS INFORMATION
// ===============================

function loadBusiness() {

    const businessName =
        business["business name"] || "Business";

    const logo =
        business["logo"];

    const tagline =
        business["tagline"] || "";

    const description =
        business["description"] || "";

    const phone =
        business["phone"] || "";

    const location =
        business["location"] || "";

    const delivery =
        business["delivery"] || "";

    const openingHours =
        business["opening hours"] || "";

    const paymentMethod =
        business["payment method"] || "";

    const orderInstruction =
        business["order instruction"] || "";

    // Page title
    document.title = businessName;

    // Business name
    document.querySelectorAll("[data-business-name]").forEach(element => {
        element.textContent = businessName;
    });

    // Tagline
    document.querySelectorAll("[data-tagline]").forEach(element => {
        element.textContent = tagline;
    });

    // Description
    document.querySelectorAll("[data-description]").forEach(element => {
        element.textContent = description;
    });

    // Logo
    document.querySelectorAll("[data-logo]").forEach(element => {

        if (logo) {
            element.src = logo;
            element.alt = businessName;
        }
    });

    // Phone
    document.querySelectorAll("[data-phone]").forEach(element => {
        element.textContent = phone;
    });

    // Location
    document.querySelectorAll("[data-location]").forEach(element => {
        element.textContent = location;
    });

    // Delivery
    document.querySelectorAll("[data-delivery]").forEach(element => {
        element.textContent = delivery;
    });

    // Opening hours
    document.querySelectorAll("[data-opening-hours]").forEach(element => {
        element.textContent = openingHours;
    });

    // Payment method
    document.querySelectorAll("[data-payment-method]").forEach(element => {
        element.textContent = paymentMethod;
    });

    // Order instruction
    document.querySelectorAll("[data-order-instruction]").forEach(element => {
        element.textContent = orderInstruction;
    });

    // Hero background
    const hero = document.querySelector(".hero");

    if (hero && logo) {
        hero.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("${logo}")`;
    }
}


// ===============================
// SOCIAL LINKS
// ===============================

function loadSocialLinks() {

    const socialFields = [
        "instagram",
        "facebook",
        "tiktok",
        "telegram",
        "youtube",
        "x"
    ];

    socialFields.forEach(platform => {

        const value = business[platform];

        if (!value) return;

        document.querySelectorAll(
            `[data-social="${platform}"]`
        ).forEach(link => {

            link.href = value;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
    });

    // WhatsApp
    const whatsapp =
        business["whatsapp business"] ||
        business["whatsapp"] ||
        business["phone"];

    if (whatsapp) {

        const whatsappURL =
            createWhatsAppLink(whatsapp);

        document.querySelectorAll("[data-whatsapp]").forEach(link => {
            link.href = whatsappURL;
            link.target = "_blank";
        });
    }

    // Google Maps
    if (business["google maps"]) {

        document.querySelectorAll("[data-google-maps]").forEach(link => {
            link.href = business["google maps"];
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
    }
}


// ===============================
// WHATSAPP
// ===============================

function createWhatsAppLink(number, message = "") {

    let phone = String(number).replace(/\D/g, "");

    // Nigerian local number:
    // 08147371302 → 2348147371302

    if (phone.startsWith("0")) {
        phone = "234" + phone.substring(1);
    }

    // 8147371302 → 2348147371302
    else if (phone.length === 10) {
        phone = "234" + phone;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


// ===============================
// CATEGORIES
// ===============================

function loadCategories() {

    const categories = [
        ...new Set(
            products
                .map(product => product["category"])
                .filter(Boolean)
        )
    ];

    const categoryContainer =
        document.getElementById("category-filters");

    if (!categoryContainer) return;

    categoryContainer.innerHTML = `
        <button class="category-btn active" data-category="all">
            All
        </button>
    `;

    categories.forEach(category => {

        categoryContainer.innerHTML += `
            <button
                class="category-btn"
                data-category="${escapeHTML(category)}"
            >
                ${escapeHTML(category)}
            </button>
        `;
    });

    categoryContainer
        .querySelectorAll(".category-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                categoryContainer
                    .querySelectorAll(".category-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                renderProducts(
                    button.dataset.category
                );
            });
        });
}


// ===============================
// PRODUCT IMAGES
// ===============================

function getProductImages(product) {

    return [
        product["img1"],
        product["img2"],
        product["img3"],
        product["img4"]
    ].filter(Boolean);
}


// ===============================
// PRICE
// ===============================

function formatPrice(price) {

    if (!price) return "";

    const currency =
        business["currency"] || "Naira";

    const value =
        Number(String(price).replace(/,/g, ""));

    if (Number.isNaN(value)) {
        return `${currency} ${price}`;
    }

    return `${currency} ${value.toLocaleString()}`;
}


// ===============================
// PRODUCT CARD
// ===============================

function createProductCard(product, index) {

    const images =
        getProductImages(product);

    const image =
        images[0] ||
        "https://via.placeholder.com/600x700?text=No+Image";

    const name =
        product["product name"] || "Product";

    const price =
        product["price"];

    const oldPrice =
        product["old price"];

    const available =
        String(product["available"]).toLowerCase() === "yes";

    const featured =
        String(product["featured"]).toLowerCase() === "yes";

    const newArrival =
        String(product["new arrival"]).toLowerCase() === "yes";

    let badges = "";

    if (featured) {
        badges += `<span class="product-badge">Featured</span>`;
    }

    if (newArrival) {
        badges += `<span class="product-badge">New</span>`;
    }

    if (!available) {
        badges += `<span class="product-badge">Unavailable</span>`;
    }

    let oldPriceHTML = "";

    if (
        oldPrice &&
        Number(oldPrice) > Number(price)
    ) {
        oldPriceHTML =
            `<del>${formatPrice(oldPrice)}</del>`;
    }

    return `
        <article
            class="product-card"
            data-product-index="${index}"
        >

            <div class="product-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                >

                <div class="product-badges">
                    ${badges}
                </div>

            </div>

            <div class="product-content">

                <div class="product-category">
                    ${escapeHTML(product["category"] || "")}
                </div>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <div class="product-price">

                    <strong>
                        ${formatPrice(price)}
                    </strong>

                    ${oldPriceHTML}

                </div>

                <button
                    class="view-product"
                    onclick="openProduct(${index})"
                >
                    View Product
                </button>

            </div>

        </article>
    `;
}


// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts(category = "all") {

    const productGrid =
        document.getElementById("product-grid");

    if (!productGrid) return;

    let filteredProducts = [...products];

    if (category !== "all") {

        filteredProducts =
            filteredProducts.filter(product =>
                String(product["category"])
                    .toLowerCase() ===
                String(category).toLowerCase()
            );
    }

    if (!filteredProducts.length) {

        productGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>There are no products in this category.</p>
            </div>
        `;

        return;
    }

    productGrid.innerHTML =
        filteredProducts
            .map(product => {

                const originalIndex =
                    products.indexOf(product);

                return createProductCard(
                    product,
                    originalIndex
                );
            })
            .join("");

    // Sort control
    const sortSelect =
        document.getElementById("sort-products");

    if (sortSelect) {

        sortSelect.onchange = () => {

            const value =
                sortSelect.value;

            let sorted =
                [...filteredProducts];

            if (value === "price-low") {

                sorted.sort(
                    (a, b) =>
                        Number(a["price"]) -
                        Number(b["price"])
                );
            }

            if (value === "price-high") {

                sorted.sort(
                    (a, b) =>
                        Number(b["price"]) -
                        Number(a["price"])
                );
            }

            if (value === "new") {

                sorted.sort(
                    (a, b) =>
                        isYes(b["new arrival"]) -
                        isYes(a["new arrival"])
                );
            }

            productGrid.innerHTML =
                sorted
                    .map(product =>
                        createProductCard(
                            product,
                            products.indexOf(product)
                        )
                    )
                    .join("");
        };
    }
}


// ===============================
// PRODUCT MODAL
// ===============================

function openProduct(index) {

    const product =
        products[index];

    if (!product) return;

    const modal =
        document.getElementById("product-modal");

    if (!modal) return;

    const images =
        getProductImages(product);

    const mainImage =
        document.getElementById("modal-main-image");

    const thumbnails =
        document.getElementById("modal-thumbnails");

    const name =
        document.getElementById("modal-title");

    const price =
        document.getElementById("modal-price");

    const oldPrice =
        document.getElementById("modal-old-price");

    const description =
        document.getElementById("modal-description");

    const category =
        document.getElementById("modal-category");

    const colour =
        document.getElementById("modal-colour");

    const sizes =
        document.getElementById("modal-sizes");

    const material =
        document.getElementById("modal-material");

    const stock =
        document.getElementById("modal-stock");

    // Main information

    if (name) {
        name.textContent =
            product["product name"] || "";
    }

    if (price) {
        price.textContent =
            formatPrice(product["price"]);
    }

    if (oldPrice) {

        if (
            product["old price"] &&
            Number(product["old price"]) >
            Number(product["price"])
        ) {
            oldPrice.textContent =
                formatPrice(product["old price"]);
        } else {
            oldPrice.textContent = "";
        }
    }

    if (description) {
        description.textContent =
            product["description"] || "";
    }

    if (category) {
        category.textContent =
            product["category"] || "";
    }

    if (colour) {
        colour.textContent =
            product["colour"] || "";
    }

    if (sizes) {
        sizes.textContent =
            product["sizes"] || "";
    }

    if (material) {
        material.textContent =
            product["material"] || "";
    }

    if (stock) {

        const available =
            isYes(product["available"]);

        stock.textContent =
            available
                ? `In stock: ${product["stock"] || ""}`
                : "Currently unavailable";
    }

    // Main image

    if (mainImage) {

        mainImage.src =
            images[0] ||
            "https://via.placeholder.com/600x700?text=No+Image";

        mainImage.alt =
            product["product name"] || "Product";
    }

    // Thumbnails

    if (thumbnails) {

        thumbnails.innerHTML = "";

        images.forEach((image, imageIndex) => {

            const thumbnail =
                document.createElement("img");

            thumbnail.src = image;
            thumbnail.alt =
                `${product["product name"] || "Product"} ${imageIndex + 1}`;

            thumbnail.addEventListener("click", () => {

                if (mainImage) {
                    mainImage.src = image;
                }
            });

            thumbnails.appendChild(thumbnail);
        });
    }

    // WhatsApp order button

    const orderButton =
        document.getElementById("modal-whatsapp");

    if (orderButton) {

        const whatsapp =
            business["whatsapp business"] ||
            business["whatsapp"] ||
            business["phone"];

        if (whatsapp) {

            const message =
                `Hello, I want to order ${product["product name"]}`;

            orderButton.href =
                createWhatsAppLink(
                    whatsapp,
                    message
                );

            orderButton.target = "_blank";
        }
    }

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}


// ===============================
// CLOSE MODAL
// ===============================

function closeProduct() {

    const modal =
        document.getElementById("product-modal");

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");
}


// Close when clicking outside modal

document.addEventListener("click", event => {

    const modal =
        document.getElementById("product-modal");

    if (
        modal &&
        event.target === modal
    ) {
        closeProduct();
    }
});


// ESC key

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeProduct();
    }
});


// ===============================
// MOBILE MENU
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const menuButton =
        document.getElementById("menu-btn");

    const nav =
        document.querySelector(".nav-links");

    if (menuButton && nav) {

        menuButton.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    // Load everything from Google Sheets
    loadSheetData();
});


// ===============================
// HELPERS
// ===============================

function isYes(value) {

    return String(value)
        .trim()
        .toLowerCase() === "yes";
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
