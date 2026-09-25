/* =========================================================
   SENDare STOREFRONT
   Google Sheets powered storefront
========================================================= */


/* =========================================================
   GOOGLE SHEET
========================================================= */

const SHEET_ID =
    "1cvN-hRamw4PBn0HjX3xz8mMl53yl0WoiTtuAOqAMrUY";

const BUSINESS_SHEET_URL =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0&headers=0`;

const PRODUCTS_SHEET_URL =
    `https://opensheet.elk.sh/${SHEET_ID}/Products`;


/* =========================================================
   APP STATE
========================================================= */

let business = {};
let products = [];

let currentProducts = [];
let currentProductIndex = null;


/* =========================================================
   SAFE HELPERS
========================================================= */

function clean(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}


function lower(value) {
    return clean(value).toLowerCase();
}


function isYes(value) {
    const valueLower = lower(value);

    return [
        "yes",
        "ye",
        "y",
        "true",
        "1"
    ].includes(valueLower);
}


function hasValue(value) {
    return clean(value) !== "";
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function parseGVizBusinessResponse(text) {

    const match =
        text.match(
            /google\.visualization\.Query\.setResponse\((.*)\);?\s*$/
        );

    if (!match) {
        throw new Error(
            "Invalid Business sheet response."
        );
    }

    const data =
        JSON.parse(match[1]);

    const rows =
        data?.table?.rows || [];

    return rows.map(row => ({
        field:
            clean(row?.c?.[0]?.v),
        value:
            clean(row?.c?.[2]?.v)
    }));
}


/* =========================================================
   SHEET LOADING
========================================================= */

async function loadSheetData() {

    showPageLoader();

    try {

        const responses = await Promise.all([
            fetch(BUSINESS_SHEET_URL),
            fetch(PRODUCTS_SHEET_URL)
        ]);

        if (!responses[0].ok) {
            throw new Error(
                "Business sheet could not be loaded."
            );
        }

        if (!responses[1].ok) {
            throw new Error(
                "Products sheet could not be loaded."
            );
        }


        const businessText =
            await responses[0].text();

        const businessRows =
            parseGVizBusinessResponse(
                businessText
            );

        const productRows =
            await responses[1].json();


        business =
            parseBusinessSheet(businessRows);

        products =
            parseProductsSheet(productRows);


        loadBusiness();

        loadSocialLinks();

        loadCategories();

        setupSearch();

        setupSorting();

        renderProducts();

        setupRetry();

        hideProductError();

        hidePageLoader();


    } catch (error) {

        console.error(
            "Sendare sheet error:",
            error
        );

        showProductError();

        hidePageLoader();
    }
}


/* =========================================================
   BUSINESS SHEET PARSER
=========================================================

   Expected physical sheet:

   A = field
   B = blank
   C = value

   We also support the simpler:

   A = field
   B = value

   This makes the template more tolerant.
========================================================= */

function parseBusinessSheet(rows) {

    const result = {};

    if (!Array.isArray(rows)) {
        return result;
    }


    rows.forEach(row => {

        if (!row || typeof row !== "object") {
            return;
        }


        const keys =
            Object.keys(row);


        let field = "";
        let value = "";


        /*
           First try exact field header.
        */

        const fieldKey =
            keys.find(
                key =>
                    lower(key) === "field"
            );


        if (fieldKey) {

            field =
                clean(row[fieldKey]);

        }


        /*
           Find value.

           Prefer an actual "value" column.
           If there isn't one, look for the
           non-empty column after field.
        */

        const valueKey =
            keys.find(
                key =>
                    lower(key) === "value"
            );


        if (valueKey) {

            value =
                clean(row[valueKey]);

        }


        /*
           Support A / blank B / C structure.

           OpenSheet can represent the blank
           header differently, so inspect the
           remaining columns.
        */

        if (!value) {

            const possibleValues =
                keys
                    .filter(
                        key =>
                            key !== fieldKey
                    )
                    .map(
                        key =>
                            clean(row[key])
                    )
                    .filter(Boolean);


            if (possibleValues.length) {

                value =
                    possibleValues[
                        possibleValues.length - 1
                    ];
            }
        }


        if (field) {

            result[
                lower(field)
            ] = value;
        }

    });


    return result;
}


/* =========================================================
   PRODUCTS SHEET PARSER
========================================================= */

function parseProductsSheet(rows) {

    if (!Array.isArray(rows)) {
        return [];
    }


    return rows
        .filter(row => row && typeof row === "object")
        .map(row => {

            const product = {};

            Object.keys(row).forEach(key => {

                const normalizedKey =
                    lower(key);

                product[normalizedKey] =
                    clean(row[key]);

            });


            return product;

        })
        .filter(product =>
            hasValue(
                product["product name"]
            )
        );
}


/* =========================================================
   BUSINESS INFORMATION
========================================================= */

function loadBusiness() {

    const businessName =
        business["business name"] ||
        "Store";

    const logo =
        business["logo"];

    const tagline =
        business["tagline"];

    const description =
        business["description"];

    const location =
        business["location"];

    const delivery =
        business["delivery"];

    const openingHours =
        business["opening hours"];

    const paymentMethod =
        business["payment method"];

    const contactMessage =
        business["contact message"];

    const orderInstruction =
        business["order instruction"];

    const phone =
        business["phone"];


    document.title =
        `${businessName} | Store`;


    setText(
        "header-business-name",
        businessName
    );

    setText(
        "header-tagline",
        tagline
    );


    setText(
        "hero-business-name",
        businessName
    );

    setText(
        "hero-tagline",
        tagline
    );

    setText(
        "hero-description",
        description
    );


    setText(
        "about-business-name",
        businessName
    );

    setText(
        "about-description",
        description
    );


    setText(
        "footer-business-name",
        businessName
    );

    setText(
        "footer-business-name-bottom",
        businessName
    );

    setText(
        "footer-tagline",
        tagline
    );


    setText(
        "quick-location",
        location
    );

    setText(
        "quick-delivery",
        delivery
    );

    setText(
        "quick-hours",
        openingHours
    );

    setText(
        "quick-payment",
        paymentMethod
    );


    setText(
        "detail-location",
        location
    );

    setText(
        "detail-delivery",
        delivery
    );

    setText(
        "detail-payment",
        paymentMethod
    );

    setText(
        "detail-hours",
        openingHours
    );


    setText(
        "contact-message",
        contactMessage ||
        "We'd love to hear from you."
    );


    setText(
        "modal-order-instruction",
        orderInstruction
    );


    setText(
        "contact-phone-number",
        phone
    );


    setYear();


    /*
       Only show sections whose data exists.
    */

    toggleInfoCard(
        "location",
        location
    );

    toggleInfoCard(
        "delivery",
        delivery
    );

    toggleInfoCard(
        "hours",
        openingHours
    );

    toggleInfoCard(
        "payment",
        paymentMethod
    );


    toggleElement(
        "location-card",
        location
    );

    toggleElement(
        "delivery-card",
        delivery
    );

    toggleElement(
        "payment-card",
        paymentMethod
    );

    toggleElement(
        "hours-card",
        openingHours
    );


    /*
       Logo
    */

    if (isValidImageURL(logo)) {

        setImage(
            "header-logo",
            logo,
            businessName
        );

        setImage(
            "about-logo",
            logo,
            businessName
        );

        setImage(
            "footer-logo",
            logo,
            businessName
        );


        showElement(
            "about-logo"
        );

        hideElement(
            "about-placeholder"
        );


        /*
           Use logo as subtle hero background.
        */

        const hero =
            document.getElementById("hero");

        if (hero) {

            hero.style.backgroundImage =
                `
                linear-gradient(
                    90deg,
                    rgba(0,0,0,.72),
                    rgba(0,0,0,.38),
                    rgba(0,0,0,.20)
                ),
                url("${safeURL(logo)}")
                `;
        }

    } else {

        hideElement(
            "header-logo"
        );

        hideElement(
            "about-logo"
        );

        hideElement(
            "footer-logo"
        );

        showElement(
            "about-placeholder"
        );
    }


    /*
       Phone
    */

    const phoneLink =
        document.getElementById(
            "contact-phone"
        );

    if (phoneLink && phone) {

        phoneLink.href =
            `tel:${phone}`;

        phoneLink.hidden = false;
    }


    /*
       Google Maps
    */

    const maps =
        business["google maps"];

    const mapsLink =
        document.getElementById(
            "google-maps-link"
        );

    if (
        mapsLink &&
        isValidURL(maps)
    ) {

        mapsLink.href =
            maps;

        mapsLink.hidden = false;
    }


    /*
       WhatsApp
    */

    setupWhatsApp();
}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp() {

    const whatsapp =
        business["whatsapp business"] ||
        business["whatsapp"] ||
        business["phone"];


    if (!whatsapp) {
        return;
    }


    const url =
        createWhatsAppLink(
            whatsapp
        );


    setLink(
        "header-whatsapp",
        url
    );

    setLink(
        "hero-whatsapp",
        url
    );

    setLink(
        "contact-whatsapp",
        url
    );


    showElement(
        "header-whatsapp"
    );

    showElement(
        "hero-whatsapp"
    );

    showElement(
        "contact-whatsapp"
    );
}


function createWhatsAppLink(
    number,
    message = ""
) {

    let phone =
        clean(number).replace(
            /\D/g,
            ""
        );


    /*
       Nigerian local number:
       08012345678
       →
       2348012345678
    */

    if (
        phone.startsWith("0") &&
        phone.length >= 10
    ) {

        phone =
            "234" +
            phone.substring(1);
    }


    /*
       10 digit Nigerian number
    */

    else if (
        phone.length === 10
    ) {

        phone =
            "234" +
            phone;
    }


    return (
        `https://wa.me/${phone}` +
        `?text=${encodeURIComponent(message)}`
    );
}


/* =========================================================
   SOCIAL LINKS
========================================================= */

function loadSocialLinks() {

    const platforms = [
        "instagram",
        "facebook",
        "tiktok",
        "telegram",
        "youtube",
        "x"
    ];


    const socialContainer =
        document.getElementById(
            "social-links"
        );

    const footerContainer =
        document.getElementById(
            "footer-socials"
        );


    if (socialContainer) {
        socialContainer.innerHTML = "";
    }

    if (footerContainer) {
        footerContainer.innerHTML = "";
    }


    platforms.forEach(platform => {

        const value =
            business[platform];


        if (!hasValue(value)) {
            return;
        }


        /*
           Placeholder values such as
           "hshs" should not become broken
           external links.
        */

        if (!isValidURL(value)) {
            return;
        }


        const label =
            platform === "x"
                ? "X"
                : capitalize(platform);


        if (socialContainer) {

            socialContainer.innerHTML += `
                <a
                    class="social-link"
                    href="${safeURL(value)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(label)}
                </a>
            `;
        }


        if (footerContainer) {

            footerContainer.innerHTML += `
                <a
                    href="${safeURL(value)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(label)}
                </a>
            `;
        }

    });
}


/* =========================================================
   CATEGORIES
========================================================= */

function loadCategories() {

    const container =
        document.getElementById(
            "category-filters"
        );


    if (!container) {
        return;
    }


    const categories =
        [
            ...new Set(
                products
                    .map(
                        product =>
                            clean(
                                product["category"]
                            )
                    )
                    .filter(Boolean)
            )
        ];


    container.innerHTML = "";


    addCategoryButton(
        container,
        "all",
        "All",
        true
    );


    categories.forEach(category => {

        addCategoryButton(
            container,
            category,
            category,
            false
        );

    });


    container
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderProducts(
                        button.dataset.category
                    );
                }
            );

        });
}


function addCategoryButton(
    container,
    value,
    label,
    active
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";

    button.className =
        active
            ? "category-btn active"
            : "category-btn";


    button.dataset.category =
        value;


    button.textContent =
        label;


    container.appendChild(
        button
    );
}


/* =========================================================
   PRODUCT IMAGES
========================================================= */

function getProductImages(product) {

    return [
        product["img1"],
        product["img2"],
        product["img3"],
        product["img4"]
    ]
        .map(clean)
        .filter(isValidImageURL);
}


/* =========================================================
   PRODUCT PRICE
========================================================= */

function getCurrency() {

    const currency =
        business["currency"];


    if (!currency) {
        return "₦";
    }


    const first =
        currency
            .split(",")[0]
            .trim()
            .toLowerCase();


    const symbols = {

        "naira": "₦",
        "ngn": "₦",

        "dollar": "$",
        "usd": "$",

        "riy​al": "﷼",
        "riyal": "﷼",
        "sar": "﷼"

    };


    return (
        symbols[first] ||
        first ||
        "₦"
    );
}


function formatPrice(value) {

    const raw =
        clean(value);


    if (!raw) {
        return "";
    }


    const number =
        Number(
            raw.replace(
                /,/g,
                ""
            )
        );


    if (
        Number.isNaN(number)
    ) {

        return escapeHTML(
            raw
        );
    }


    return (
        `${getCurrency()}` +
        `${number.toLocaleString()}`
    );
}


/* =========================================================
   PRODUCT RENDERING
========================================================= */

function renderProducts(
    category = "all"
) {

    const grid =
        document.getElementById(
            "product-grid"
        );


    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById(
            "product-search"
        );


    const search =
        lower(
            searchInput
                ? searchInput.value
                : ""
        );


    currentProducts =
        products.filter(product => {

            const productCategory =
                lower(
                    product["category"]
                );


            const name =
                lower(
                    product["product name"]
                );


            const description =
                lower(
                    product["description"]
                );


            const matchesCategory =
                category === "all" ||
                productCategory ===
                    lower(category);


            const matchesSearch =
                !search ||
                name.includes(search) ||
                description.includes(search) ||
                productCategory.includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );
        });


    updateProductCount(
        currentProducts.length
    );


    if (!currentProducts.length) {

        grid.innerHTML = "";

        showElement(
            "products-empty"
        );

        return;
    }


    hideElement(
        "products-empty"
    );


    grid.innerHTML =
        currentProducts
            .map(
                (
                    product,
                    index
                ) =>
                    createProductCard(
                        product,
                        index
                    )
            )
            .join("");


    /*
       Lazy image error handling.
    */

    grid
        .querySelectorAll(
            "img"
        )
        .forEach(
            img => {

                img.addEventListener(
                    "error",
                    () => {

                        img.src =
                            createPlaceholderImage();

                    },
                    {
                        once: true
                    }
                );

            }
        );
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(
    product,
    displayIndex
) {

    const images =
        getProductImages(
            product
        );


    const image =
        images[0] ||
        createPlaceholderImage();


    const name =
        product["product name"] ||
        "Product";


    const category =
        product["category"];


    const price =
        product["price"];


    const oldPrice =
        product["old price"];


    const available =
        isYes(
            product["available"]
        );


    const featured =
        isYes(
            product["featured"]
        );


    const newArrival =
        isYes(
            product["new arrival"]
        );


    let badges = "";


    if (featured) {

        badges += `
            <span class="product-badge">
                Featured
            </span>
        `;
    }


    if (newArrival) {

        badges += `
            <span class="product-badge">
                New
            </span>
        `;
    }


    if (!available) {

        badges += `
            <span class="product-badge">
                Unavailable
            </span>
        `;
    }


    let oldPriceHTML = "";


    const numericPrice =
        Number(
            clean(price)
                .replace(/,/g, "")
        );


    const numericOldPrice =
        Number(
            clean(oldPrice)
                .replace(/,/g, "")
        );


    if (
        oldPrice &&
        !Number.isNaN(
            numericOldPrice
        ) &&
        !Number.isNaN(
            numericPrice
        ) &&
        numericOldPrice >
            numericPrice
    ) {

        oldPriceHTML = `
            <del>
                ${formatPrice(oldPrice)}
            </del>
        `;
    }


    /*
       Store the actual product in a
       safe state array rather than putting
       product data directly into onclick.
    */

    return `
        <article
            class="product-card"
            data-product-index="${displayIndex}"
        >

            <div class="product-image">

                <img
                    src="${safeURL(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    decoding="async"
                >

                <div class="product-badges">
                    ${badges}
                </div>

            </div>


            <div class="product-content">

                <div class="product-category">
                    ${escapeHTML(
                        category || ""
                    )}
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
                    type="button"
                    data-open-product="${displayIndex}"
                >
                    View Product
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   PRODUCT COUNT
========================================================= */

function updateProductCount(
    count
) {

    const element =
        document.getElementById(
            "product-count"
        );


    if (!element) {
        return;
    }


    element.textContent =
        `${count} ${
            count === 1
                ? "product"
                : "products"
        }`;
}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProduct(
    displayIndex
) {

    const product =
        currentProducts[
            Number(displayIndex)
        ];


    if (!product) {
        return;
    }


    currentProductIndex =
        Number(displayIndex);


    const modal =
        document.getElementById(
            "product-modal"
        );


    if (!modal) {
        return;
    }


    const images =
        getProductImages(
            product
        );


    setText(
        "modal-title",
        product["product name"]
    );


    setText(
        "modal-category",
        product["category"]
    );


    setText(
        "modal-price",
        formatPrice(
            product["price"]
        )
    );


    const oldPrice =
        clean(
            product["old price"]
        );


    const currentPrice =
        Number(
            clean(
                product["price"]
            ).replace(/,/g, "")
        );


    const previousPrice =
        Number(
            oldPrice.replace(
                /,/g,
                ""
            )
        );


    const oldPriceElement =
        document.getElementById(
            "modal-old-price"
        );


    if (
        oldPriceElement &&
        oldPrice &&
        !Number.isNaN(
            previousPrice
        ) &&
        !Number.isNaN(
            currentPrice
        ) &&
        previousPrice >
            currentPrice
    ) {

        oldPriceElement.textContent =
            formatPrice(
                oldPrice
            );

        oldPriceElement.hidden =
            false;

    } else if (oldPriceElement) {

        oldPriceElement.textContent =
            "";

        oldPriceElement.hidden =
            true;
    }


    setText(
        "modal-description",
        product["description"]
    );


    setText(
        "modal-colour",
        product["colour"]
    );


    setText(
        "modal-sizes",
        product["sizes"]
    );


    setText(
        "modal-material",
        product["material"]
    );


    /*
       Show/hide individual details.
    */

    toggleModalDetail(
        "colour",
        product["colour"]
    );

    toggleModalDetail(
        "sizes",
        product["sizes"]
    );

    toggleModalDetail(
        "material",
        product["material"]
    );


    /*
       Stock
    */

    const available =
        isYes(
            product["available"]
        );


    const stock =
        product["stock"];


    const stockText =
        available
            ? (
                stock
                    ? `In stock: ${stock}`
                    : "Available"
            )
            : "Currently unavailable";


    setText(
        "modal-stock",
        stockText
    );


    toggleModalDetail(
        "stock",
        true
    );


    /*
       Badges
    */

    const badges =
        document.getElementById(
            "modal-badges"
        );


    if (badges) {

        badges.innerHTML = "";


        if (
            isYes(
                product["featured"]
            )
        ) {

            badges.innerHTML += `
                <span class="modal-badge">
                    Featured
                </span>
            `;
        }


        if (
            isYes(
                product["new arrival"]
            )
        ) {

            badges.innerHTML += `
                <span class="modal-badge">
                    New Arrival
                </span>
            `;
        }


        if (!available) {

            badges.innerHTML += `
                <span class="modal-badge">
                    Unavailable
                </span>
            `;
        }
    }


    /*
       Main image
    */

    setModalMainImage(
        images[0] ||
        createPlaceholderImage(),
        product["product name"]
    );


    /*
       Thumbnails
    */

    renderModalThumbnails(
        images,
        product["product name"]
    );


    /*
       WhatsApp order
    */

    const whatsapp =
        business["whatsapp business"] ||
        business["whatsapp"] ||
        business["phone"];


    const orderButton =
        document.getElementById(
            "modal-whatsapp"
        );


    if (
        orderButton &&
        whatsapp &&
        available
    ) {

        const message =
            `Hello, I want to order ${product["product name"]}`;


        orderButton.href =
            createWhatsAppLink(
                whatsapp,
                message
            );


        orderButton.hidden =
            false;

    } else if (orderButton) {

        orderButton.hidden =
            true;
    }


    modal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "active"
            );
        }
    );
}


function closeProduct() {

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );


    setTimeout(
        () => {

            modal.hidden =
                true;

        },
        300
    );
}


/* =========================================================
   MODAL MAIN IMAGE
========================================================= */

function setModalMainImage(
    src,
    alt
) {

    const image =
        document.getElementById(
            "modal-main-image"
        );


    const loader =
        document.getElementById(
            "modal-image-loader"
        );


    if (!image) {
        return;
    }


    if (loader) {

        loader.classList.remove(
            "loaded"
        );
    }


    image.onload = () => {

        if (loader) {

            loader.classList.add(
                "loaded"
            );
        }
    };


    image.onerror = () => {

        image.src =
            createPlaceholderImage();


        if (loader) {

            loader.classList.add(
                "loaded"
            );
        }
    };


    image.alt =
        alt || "Product";


    image.src =
        src;
}


/* =========================================================
   MODAL THUMBNAILS
========================================================= */

function renderModalThumbnails(
    images,
    productName
) {

    const container =
        document.getElementById(
            "modal-thumbnails"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    /*
       No thumbnails needed for a product
       with zero/one image.
    */

    if (images.length <= 1) {
        return;
    }


    images.forEach(
        (
            image,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                index === 0
                    ? "product-thumbnail active"
                    : "product-thumbnail";


            button.setAttribute(
                "aria-label",
                `View image ${index + 1}`
            );


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image;

            img.alt =
                `${productName || "Product"} image ${index + 1}`;

            img.loading =
                "lazy";

            img.decoding =
                "async";


            img.addEventListener(
                "error",
                () => {

                    img.src =
                        createPlaceholderImage();
                },
                {
                    once: true
                }
            );


            button.appendChild(
                img
            );


            button.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".product-thumbnail"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    setModalMainImage(
                        image,
                        productName
                    );
                }
            );


            container.appendChild(
                button
            );

        }
    );
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "product-search"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            const activeButton =
                document.querySelector(
                    ".category-btn.active"
                );


            const category =
                activeButton
                    ? activeButton.dataset.category
                    : "all";


            renderProducts(
                category
            );
        }
    );
}


/* =========================================================
   SORTING
========================================================= */

function setupSorting() {

    const select =
        document.getElementById(
            "sort-products"
        );


    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        () => {

            sortCurrentProducts(
                select.value
            );
        }
    );
}


function sortCurrentProducts(
    sort
) {

    const grid =
        document.getElementById(
            "product-grid"
        );


    if (!grid) {
        return;
    }


    let sorted =
        [...currentProducts];


    if (sort === "price-low") {

        sorted.sort(
            (a, b) =>
                numericValue(
                    a["price"]
                ) -
                numericValue(
                    b["price"]
                )
        );
    }


    if (sort === "price-high") {

        sorted.sort(
            (a, b) =>
                numericValue(
                    b["price"]
                ) -
                numericValue(
                    a["price"]
                )
        );
    }


    if (sort === "new") {

        sorted.sort(
            (a, b) =>
                Number(
                    isYes(
                        b["new arrival"]
                    )
                ) -
                Number(
                    isYes(
                        a["new arrival"]
                    )
                )
        );
    }


    currentProducts =
        sorted;


    grid.innerHTML =
        sorted
            .map(
                (
                    product,
                    index
                ) =>
                    createProductCard(
                        product,
                        index
                    )
            )
            .join("");
}


function numericValue(
    value
) {

    const number =
        Number(
            clean(value)
                .replace(
                    /,/g,
                    ""
                )
        );


    return Number.isNaN(
        number
    )
        ? 0
        : number;
}


/* =========================================================
   EVENT DELEGATION
========================================================= */

document.addEventListener(
    "click",
    event => {

        const productButton =
            event.target.closest(
                "[data-open-product]"
            );


        if (productButton) {

            openProduct(
                productButton.dataset
                    .openProduct
            );

            return;
        }


        /*
           Close modal when clicking
           the backdrop.
        */

        if (
            event.target.classList
                .contains(
                    "modal-backdrop"
                )
        ) {

            closeProduct();
        }

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "menu-btn"
        );


    const nav =
        document.getElementById(
            "main-nav"
        );


    if (!button || !nav) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const active =
                nav.classList.toggle(
                    "active"
                );


            button.setAttribute(
                "aria-expanded",
                String(active)
            );
        }
    );


    nav.querySelectorAll(
        "a"
    ).forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "active"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );

        }
    );
}


/* =========================================================
   RETRY
========================================================= */

function setupRetry() {

    const button =
        document.getElementById(
            "retry-products"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            hideProductError();

            loadSheetData();
        }
    );
}


function showProductError() {

    const grid =
        document.getElementById(
            "product-grid"
        );


    if (grid) {
        grid.innerHTML = "";
    }


    showElement(
        "products-error"
    );
}


function hideProductError() {

    hideElement(
        "products-error"
    );
}


/* =========================================================
   PAGE LOADER
========================================================= */

function showPageLoader() {

    const loader =
        document.getElementById(
            "page-loader"
        );


    if (!loader) {
        return;
    }


    loader.classList.remove(
        "loaded"
    );
}


function hidePageLoader() {

    const loader =
        document.getElementById(
            "page-loader"
        );


    if (!loader) {
        return;
    }


    loader.classList.add(
        "loaded"
    );
}


/* =========================================================
   DOM HELPERS
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        clean(value);
}


function setLink(
    id,
    url
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.href =
        url;
}


function setImage(
    id,
    src,
    alt
) {

    const image =
        document.getElementById(
            id
        );


    if (!image) {
        return;
    }


    image.src =
        src;


    image.alt =
        alt || "Business";
}


function showElement(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.hidden =
            false;
    }
}


function hideElement(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.hidden =
            true;
    }
}


function toggleElement(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.hidden =
        !hasValue(value);
}


function toggleInfoCard(
    type,
    value
) {

    const card =
        document.querySelector(
            `[data-info-card="${type}"]`
        );


    if (!card) {
        return;
    }


    card.hidden =
        !hasValue(value);
}


function toggleModalDetail(
    type,
    value
) {

    const element =
        document.querySelector(
            `[data-detail="${type}"]`
        );


    if (!element) {
        return;
    }


    element.hidden =
        !hasValue(value);
}


function setYear() {

    const year =
        document.getElementById(
            "footer-year"
        );


    if (year) {

        year.textContent =
            new Date()
                .getFullYear();
    }
}


/* =========================================================
   URL / IMAGE HELPERS
========================================================= */

function isValidURL(
    value
) {

    const raw =
        clean(value);


    if (!raw) {
        return false;
    }


    try {

        const url =
            new URL(raw);


        return (
            url.protocol ===
                "http:" ||
            url.protocol ===
                "https:"
        );

    } catch {

        return false;
    }
}


function isValidImageURL(
    value
) {

    return isValidURL(
        value
    );
}


function safeURL(
    value
) {

    const raw =
        clean(value);


    return isValidURL(raw)
        ? raw
        : "";
}


function createPlaceholderImage() {

    /*
       Small SVG generated locally.

       No external request.
       Therefore a missing image doesn't
       create another network request.
    */

    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="750"
            viewBox="0 0 600 750"
        >

            <rect
                width="600"
                height="750"
                fill="#efede8"
            />

            <text
                x="300"
                y="375"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#aaa69e"
                font-family="Arial"
                font-size="24"
            >
                No image
            </text>

        </svg>
    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );
}


/* =========================================================
   TEXT HELPERS
========================================================= */

function capitalize(
    value
) {

    const text =
        clean(value);


    if (!text) {
        return "";
    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}


/* =========================================================
   CLOSE / KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeProduct();
        }

    }
);


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupMobileMenu();

        setYear();

        loadSheetData();

    }
);
