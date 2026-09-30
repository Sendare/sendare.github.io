/* =====================================================
   data.js  -  SAME FILE FOR EVERY CUSTOMER SITE
   Fetches a shop from Supabase and returns clean data.
   Site designs must only use what loadShop() returns.
   ===================================================== */

const SUPABASE_URL = "https://kjmepzrjpimilomppkzf.supabase.co";
const SUPABASE_KEY = "sb_publishable_1T7EDz9itLkW9QIv3N4uQA_ut0k4nP7";  


async function sb(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY },
  });
  if (!res.ok) throw new Error(`Supabase error ${res.status}`);
  return res.json();
}

function cleanBusiness(b) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name || "",
    logo: b.logo_url || "",
    tagline: b.tagline || "",
    description: b.description || "",
    phone: b.phone || "",
    whatsapp: (b.whatsapp || b.phone || "").replace(/\D/g, ""),
    location: b.location || "",
    delivery: b.delivery || "",
    openingHours: b.opening_hours || "",
    paymentMethods: b.payment_methods || "",
    currency: b.currency || "",
    orderInstruction: b.order_instruction || "",
    contactMessage: b.contact_message || "",
    socials: b.socials || {},
    settings: b.settings || {},
  };
}

function cleanProduct(p) {
  const price = p.price == null ? null : Number(p.price);
  const oldPrice = p.old_price == null ? null : Number(p.old_price);
  const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const onSale = oldPrice != null && price != null && oldPrice > price;
  return {
    id: p.id,
    name: p.name || "",
    category: p.category || "",
    price,
    oldPrice,
    onSale,
    discountPercent: onSale ? Math.round((1 - price / oldPrice) * 100) : 0,
    description: p.description || "",
    available: p.is_available !== false && (p.stock == null || p.stock > 0),
    stock: p.stock,
    featured: !!p.is_featured,
    isNew: !!p.is_new,
    video: p.video_url || "",
    images,
    image: images[0] || "",
    attributes: p.attributes || {}, // e.g. { colour: "Red", sizes: ["40","41"] }
    sortOrder: p.sort_order || 0,
  };
}

/**
 * loadShop("oum-hidaya") returns:
 * { business, fields, products, categories }
 * Throws if the shop is not found or the network fails.
 */
async function loadShop(slug) {
  const s = encodeURIComponent(slug);
  const businesses = await sb(`businesses?slug=eq.${s}&select=*`);
  if (!businesses.length) throw new Error("Shop not found");
  const biz = businesses[0];

  const [fields, products] = await Promise.all([
    sb(`business_fields?business_id=eq.${biz.id}&select=key,label,type,options,sort_order&order=sort_order`),
    sb(`products?business_id=eq.${biz.id}&select=*&order=sort_order,created_at.desc`),
  ]);

  const cleaned = products.map(cleanProduct);
  const categories = [...new Set(cleaned.map((p) => p.category).filter(Boolean))];

  return {
    business: cleanBusiness(biz),
    fields, // [{key,label,type,options}] labels for attributes
    products: cleaned,
    categories,
  };
}

/* Helper: build the WhatsApp order link from cart items
   cart = [{ name, price, qty, options: "Red, 41" }]                */
function buildWhatsAppLink(business, cart, customerName, note) {
  const money = (n) => Number(n).toLocaleString("en-NG");
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const lines = cart.map(
    (i) => `- ${i.qty} x ${i.name}${i.options ? " (" + i.options + ")" : ""} = ${money(i.price * i.qty)}`
  );
  const text = [
    business.contactMessage || "New order",
    "",
    ...lines,
    "",
    `Total: ${money(total)} ${business.currency}`,
    customerName ? `Name: ${customerName}` : "",
    note ? `Note: ${note}` : "",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
}
