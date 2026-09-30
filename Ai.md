# Data contract for building a shop site

Paste this into the AI when asking it to design a customer site.

## Rules
- Plain HTML/CSS/JS only. Design (HTML/CSS/UI) is unique for this customer.
- Include `<script src="data.js"></script>` BEFORE your own script. Do NOT edit or rewrite data.js.
- Get all data with `const shop = await loadShop("SLUG")`. Do not call Supabase or Google Sheets directly.
- Build the WhatsApp order link with `buildWhatsAppLink(shop.business, cart, customerName, note)`.
- Any field may be empty. Hide sections when their data is empty (no socials, no video, etc.).
- Show a loading state, and an "offline / try again" state if loadShop throws.
- Unavailable products (`available: false`) should show as "Sold out" and cannot be added to cart.
- `attributes` differ per product. Loop over `shop.fields` (in order) and show a value only if `product.attributes[field.key]` exists. Use `field.label` as the label. Arrays (like sizes) should be shown as choices the customer can pick before adding to cart.

## What loadShop returns

```json
{
  "business": {
    "id": "uuid", "slug": "oum-hidaya",
    "name": "Oum Hidaya Collections",
    "logo": "https://...jpg",
    "tagline": "Quality Style Affordable",
    "description": "Cloth, Kitchen, Bed accessories",
    "phone": "2348144176298",
    "whatsapp": "2348144176298",
    "location": "Kofar Dawanau, Kano",
    "delivery": "Home delivery everywhere in Nigeria",
    "openingHours": "24/7",
    "paymentMethods": "bank, cash",
    "currency": "Naira",
    "orderInstruction": "send order on whatsapp",
    "contactMessage": "i want this item",
    "socials": { "instagram": "https://...", "tiktok": "https://..." },
    "settings": {}
  },
  "fields": [
    { "key": "colour", "label": "Colour", "type": "text", "options": [] },
    { "key": "sizes", "label": "Sizes", "type": "text", "options": [] }
  ],
  "categories": ["Shoes", "Bags"],
  "products": [
    {
      "id": "uuid",
      "name": "Red Mantis",
      "category": "Shoes",
      "price": 20000,
      "oldPrice": 22000,
      "onSale": true,
      "discountPercent": 9,
      "description": "",
      "available": true,
      "stock": null,
      "featured": true,
      "isNew": true,
      "video": "",
      "images": ["https://...jpg"],
      "image": "https://...jpg",
      "attributes": { "colour": "Red" },
      "sortOrder": 0
    }
  ]
}
```

## Cart item shape (for buildWhatsAppLink)
`{ name, price, qty, options }` where `options` is a short text like "Red, 41".
