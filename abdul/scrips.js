// ================================
// ABDUL CLOTH CATALOGUE
// ================================

// Business information
const business = {
    "business name": "abdul cloth",
    "logo": "https://i.postimg.cc/Ls2nPqQ2/algotred-logo-extracted.png",
    "tagline": "Elegant Abayas for Every Occasion",
    "description": "men, women, children clothes",
    "phone": "8147371302",
    "whatsapp": "8147371302",
    "whatsapp business": "9014217821",
    "instagram": "hshs",
    "facebook": "hshh",
    "tiktok": "sheh",
    "telegram": "eheh",
    "youtube": "hehe",
    "x": "AbdulDJA",
    "location": "Katsina",
    "google maps": "hagsg",
    "delivery": "we deliver in katsina, kaduna, kano, lagos",
    "opening hours": "24/7",
    "payment method": "bank, crypto, cash",
    "currency": "Naira, Dollar, Riyal",
    "order instruction": "send order on whatsapp or Facebook",
    "contact message": "i want your order"
};


// Products
const products = [
    {
        "product name": "Children Mini Abaya",
        "category": "Abaya",
        "price": "4000",
        "old price": "3900",
        "description": "",
        "colour": "red,yellow",
        "sizes": "3",
        "material": "nidah",
        "available": "yes",
        "stock": "24",
        "featured": "yes",
        "new arrival": "yes",
        "video": "",
        "img1": "https://i.postimg.cc/CLvg7Rxb/images-(1).jpg",
        "img2": "",
        "img3": "",
        "img4": ""
    },

    {
        "product name": "TTT Abaya",
        "category": "Abaya",
        "price": "4000",
        "old price": "3800",
        "description": "",
        "colour": "yellow,black",
        "sizes": "6",
        "material": "chiffon",
        "available": "yes",
        "stock": "5",
        "featured": "yes",
        "new arrival": "no",
        "video": "",
        "img1": "https://i.postimg.cc/XqQTsP47/images-(3).jpg",
        "img2": "",
        "img3": "",
        "img4": ""
    },

    {
        "product name": "Baby Khimar",
        "category": "Khimar",
        "price": "5000",
        "old price": "6000",
        "description": "",
        "colour": "red,white",
        "sizes": "8",
        "material": "cotton",
        "available": "yes",
        "stock": "2",
        "featured": "no",
        "new arrival": "yes",
        "video": "",
        "img1": "https://i.postimg.cc/CLvg7Rxb/images-(1).jpg",
        "img2": "",
        "img3": "",
        "img4": ""
    },

    {
        "product name": "Adult Khimar",
        "category": "Khimar",
        "price": "3500",
        "old price": "3000",
        "description": "",
        "colour": "black,red,white",
        "sizes": "7",
        "material": "nylon",
        "available": "yes",
        "stock": "7",
        "featured": "yes",
        "new arrival": "no",
        "video": "",
        "img1": "https://i.postimg.cc/cC4ztcwt/images-(2).jpg",
        "img2": "",
        "img3": "",
        "img4": ""
    },

    {
        "product name": "Children Socks",
        "category": "Socks",
        "price": "1500",
        "old price": "1000",
        "description": "",
        "colour": "black,purple,white",
        "sizes": "7",
        "material": "nylon",
        "available": "yes",
        "stock": "10",
        "featured": "no",
        "new arrival": "no",
        "video": "",
        "img1": "https://i.postimg.cc/02j38c9W/images-(5).jpg",
        "img2": "",
        "img3": "",
        "img4": ""
    },

    {
        "product name": "Adult Abaya",
        "category": "Abaya",
        "price": "2000",
        "old price": "2000",
        "description": "",
        "colour": "red",
        "sizes": "9",
        "material": "cotton",
        "available": "no",
        "stock": "30",
        "featured": "no",
        "new arrival": "yes",
        "video": "",
        "img1": "https://i.postimg.cc/rp1ZhH96/images-(4).jpg",
        "img2": "",
        "img3": "",
        "img4": ""
    }
];


// ================================
// HELPERS
// ================================

function clean(value) {
    return String(value || "").trim();
}


function formatPrice(value) {
    const number = Number(String(value).replace(/[^0-9.]/g, ""));

    if (Number.isNaN(number)) {
        return value;
    }

    return "₦" + number.toLocaleString("en-NG");
}


function isYes(value) {
    return clean(value).toLowerCase() === "yes";
}


function createWhatsAppLink(number, productName = "") {
    const phone = clean(number).replace(/\D/g, "");

    let message = business["contact message"] || "Hello, I want to place an order.";

    if (productName) {
        message += `\n\nProduct: ${productName}`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


// ================================
// BUSINESS INFORMATION
// ================================

function loadBusiness() {

    document.getElementById("business-name").textContent =
        business["business name"];

    document.getElementById("business-tagline").textContent =
        business["tagline"];

    document.getElementById("business-logo").src =
        business["logo"];

    document.getElementById("footer-logo").src =
        business["logo"];

    document.getElementById("footer-business-name").textContent =
        business["business name"];

    document.getElementById("footer-name").textContent =
        business["business name"];

    document.getElementById("footer-tagline").textContent =
        business["tagline"];

    document.getElementById("hero-title").innerHTML =
        "Elegant Clothing<br>For Every Occasion";

    document.getElementById("business-description").textContent =
        business["description"];

    document.getElementById("business-location").textContent =
        business["location"];

    document.getElementById("business-delivery").textContent =
        business["delivery"];

    document.getElementById("business-hours").textContent =
        business["opening hours"];

    document.getElementById("about-title").textContent =
        business["business name"];

    document.getElementById("about-description").textContent =
        business["description"];

    document.getElementById("order-instruction").textContent =
        business["order instruction"];

    const whatsappLink =
        createWhatsAppLink(business["whatsapp"]);

    document.getElementById("hero-whatsapp").href =
        whatsappLink;

    document.getElementById("about-whatsapp").href =
        whatsappLink;

    document.getElementById("contact-whatsapp").href =
        whatsappLink;

    document.getElementById("contact-phone").href =
        `tel:${business["phone"]}`;

    document.getElementById("contact-map").href =
        business["google maps"];

    document.getElementById("current-year").textContent =
        new Date().getFullYear();
}


// ================================
// SOCIAL LINKS
// ================================

function loadSocialLinks() {

    const socialNav =
        document.getElementById("social-nav");

    const footerSocial =
        document.getElementById("footer-social");

    const platforms = [
        ["WhatsApp", business["whatsapp"], number => createWhatsAppLink(number)],
        ["WhatsApp Business", business["whatsapp business"], number => createWhatsAppLink(number)],
        ["Instagram", business["instagram"], value => value],
        ["Facebook", business["facebook"], value => value],
        ["TikTok", business["tiktok"], value => value],
        ["Telegram", business["telegram"], value => value],
        ["YouTube", business["youtube"], value => value],
        ["X", business["x"], value => value]
    ];

    platforms.forEach(([name, value, createLink]) => {

        if (!clean(value)) {
            return;
        }

        const link = document.createElement("a");

        link.href = createLink(value);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = name;

        socialNav.appendChild(link);

        const footerLink = link.cloneNode(true);

        footerSocial.appendChild(footerLink);
    });
}


// ================================
// CATEGORIES
// ================================

function loadCategories() {

    const categoryList =
        document.getElementById("category-list");

    const categoryFilter =
        document.getElementById("category-filter");

    const categories = [
        ...new Set(
            products
                .map(product => clean(product.category))
                .filter(Boolean)
        )
    ];

    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.className = "category-btn";
        button.textContent = category;

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            categoryFilter.value = category;

            renderProducts(category);
        });

        categoryList.appendChild(button);


        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


// ================================
// PRODUCT IMAGES
// ================================

function getProductImages(product) {

    return [
        product.img1,
        product.img2,
        product.img3,
        product.img4
    ].filter(image => clean(image));
}


// ================================
// PRODUCT CARD
// ================================

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className = "product-card";

    const images =
        getProductImages(product);

    const mainImage =
        images[0] || "https://via.placeholder.com/600x750?text=No+Image";

    const discount =
        Number(product["old price"]) > Number(product.price);

    let badges = "";

    if (isYes(product["new arrival"])) {
        badges += `<span class="badge new">NEW</span>`;
    }

    if (isYes(product.featured)) {
        badges += `<span class="badge">FEATURED</span>`;
    }

    if (discount) {
        badges += `<span class="badge discount">SALE</span>`;
    }

    if (!isYes(product.available)) {
        badges += `<span class="badge out">OUT OF STOCK</span>`;
    }

    card.innerHTML = `
        <div class="product-image-wrap">

            <img
                class="product-image"
                src="${mainImage}"
                alt="${product["product name"]}"
                loading="lazy"
            >

            <div class="product-badges">
                ${badges}
            </div>

        </div>

        <div class="product-info">

            <div class="product-category">
                ${product.category}
            </div>

            <h3 class="product-name">
                ${product["product name"]}
            </h3>

            ${
                product.description
                    ? `<p class="product-description">
                        ${product.description}
                       </p>`
                    : ""
            }

            <div class="product-price">

                <strong class="current-price">
                    ${formatPrice(product.price)}
                </strong>

                ${
                    discount
                        ? `<del class="old-price">
                            ${formatPrice(product["old price"])}
                           </del>`
                        : ""
                }

            </div>

            <div class="product-meta">

                ${
                    product.colour
                        ? `<span class="meta-item">
                            ${product.colour}
                           </span>`
                        : ""
                }

                ${
                    product.sizes
                        ? `<span class="meta-item">
                            Size: ${product.sizes}
                           </span>`
                        : ""
                }

            </div>

            <button class="btn btn-primary view-product">
                View Product
            </button>

        </div>
    `;

    card
        .querySelector(".view-product")
        .addEventListener("click", () => {
            openProduct(product);
        });

    return card;
}


// ================================
// RENDER PRODUCTS
// ================================

function renderProducts(category = "all") {

    const grid =
        document.getElementById("products-grid");

    const emptyState =
        document.getElementById("empty-state");

    const sort =
        document.getElementById("sort-products").value;

    let filtered = [...products];

    if (category !== "all") {

        filtered =
            filtered.filter(product =>
                clean(product.category).toLowerCase() ===
                clean(category).toLowerCase()
            );
    }

    if (sort === "low-high") {

        filtered.sort(
            (a, b) =>
                Number(a.price) - Number(b.price)
        );
    }

    if (sort === "high-low") {

        filtered.sort(
            (a, b) =>
                Number(b.price) - Number(a.price)
        );
    }

    grid.innerHTML = "";

    if (!filtered.length) {

        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    filtered.forEach(product => {

        grid.appendChild(
            createProductCard(product)
        );
    });
}


// ================================
// PRODUCT MODAL
// ================================

function openProduct(product) {

    const modal =
        document.getElementById("product-modal");

    const mainImage =
        document.getElementById("modal-main-image");

    const thumbnails =
        document.getElementById("modal-thumbnails");

    const images =
        getProductImages(product);

    mainImage.src =
        images[0] ||
        "https://via.placeholder.com/600x750?text=No+Image";

    mainImage.alt =
        product["product name"];

    document.getElementById("modal-category").textContent =
        product.category;

    document.getElementById("modal-product-name").textContent =
        product["product name"];

    document.getElementById("modal-price").textContent =
        formatPrice(product.price);

    const oldPrice =
        document.getElementById("modal-old-price");

    if (
        Number(product["old price"]) >
        Number(product.price)
    ) {

        oldPrice.textContent =
            formatPrice(product["old price"]);

        oldPrice.style.display = "inline";
    } else {

        oldPrice.style.display = "none";
    }

    document.getElementById("modal-description").textContent =
        product.description ||
        "Contact us for more information about this product.";

    thumbnails.innerHTML = "";

    images.forEach((image, index) => {

        const thumbnail =
            document.createElement("img");

        thumbnail.src = image;
        thumbnail.alt = `${product["product name"]} image ${index + 1}`;

        if (index === 0) {
            thumbnail.classList.add("active");
        }

        thumbnail.addEventListener("click", () => {

            mainImage.src = image;

            thumbnails
                .querySelectorAll("img")
                .forEach(img =>
                    img.classList.remove("active")
                );

            thumbnail.classList.add("active");
        });

        thumbnails.appendChild(thumbnail);
    });


    const properties =
        document.getElementById("modal-properties");

    properties.innerHTML = "";

    const fields = [
        ["Colour", product.colour],
        ["Sizes", product.sizes],
        ["Material", product.material],
        ["Availability", product.available],
        ["Stock", product.stock]
    ];

    fields.forEach(([label, value]) => {

        if (!clean(value)) {
            return;
        }

        const property =
            document.createElement("div");

        property.className = "property";

        property.innerHTML = `
            <span>${label}</span>
            <span>${value}</span>
        `;

        properties.appendChild(property);
    });


    const orderButton =
        document.getElementById("modal-order");

    orderButton.href =
        createWhatsAppLink(
            business["whatsapp"],
            product["product name"]
        );

    orderButton.target = "_blank";

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}


// ================================
// CLOSE MODAL
// ================================

function closeProduct() {

    document
        .getElementById("product-modal")
        .classList.remove("active");

    document.body.classList.remove("modal-open");
}


document
    .getElementById("modal-close")
    .addEventListener("click", closeProduct);


document
    .getElementById("modal-overlay")
    .addEventListener("click", closeProduct);


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeProduct();
    }
});


// ================================
// FILTER EVENTS
// ================================

document
    .getElementById("category-filter")
    .addEventListener("change", event => {

        renderProducts(event.target.value);

        document
            .querySelectorAll(".category-btn")
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.textContent === event.target.value
                );
            });
    });


document
    .getElementById("sort-products")
    .addEventListener("change", () => {

        renderProducts(
            document.getElementById("category-filter").value
        );
    });


// ================================
// START APP
// ================================

loadBusiness();

loadSocialLinks();

loadCategories();

renderProducts();
