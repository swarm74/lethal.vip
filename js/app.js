// js/app.js
// Uses SellAuth EMBED checkout modal (no redirect)

// =========================
// SELLAUTH EMBED CONFIG
// =========================
const SELLAUTH_SHOP_ID = 204248; // your shop id

// =========================
// DATA
// =========================
const products = [
  {
    id: 1,
    title: "Rust NFA's",
    chips: ["RAGE READY", "ACCOUNT"],
    group: "rust",

    // SellAuth mapping
    sellAuth: { shopId: SELLAUTH_SHOP_ID, productId: 570678 },

    options: [
      { name: "0–100 Hours",     desc: "∞ In Stock", price: 2.99, variantId: 880485 },
      { name: "100–500 Hours",   desc: "∞ In Stock", price: 3.99, variantId: 880486 },
      { name: "500–1000 Hours",  desc: "∞ In Stock", price: 4.99, variantId: 880487 },
      { name: "1000–1500 Hours", desc: "∞ In Stock", price: 5.99, variantId: 880488 },
      { name: "1500–2000 Hours", desc: "∞ In Stock", price: 6.99, variantId: 880489 },
      { name: "2000–5000 Hours", desc: "∞ In Stock", price: 7.99, variantId: 880490 },
    ],

    tag: "RAGE READY",
    frontTop: "Loader",
    icon: "⚡",
    short: "NFA ACCOUNTS",
    meta: "Instant delivery • Support"
  },

  // ✅ Opti Basic (you provided)
  {
    id: 2,
    title: "PC Optimizer (Basic)",
    chips: ["FPS BOOST", "BASIC"],
    group: "all",

    sellAuth: { shopId: SELLAUTH_SHOP_ID, productId: 566993 },

    options: [
      { name: "Basic", desc: "∞ In Stock", price: 25.00, variantId: 874454 },
    ],

    tag: "FPS BOOST",
    frontTop: "Tool",
    icon: "⬚",
    short: "OPTIMIZER BASIC",
    meta: "Boost FPS • Lower latency"
  },

  // ✅ Opti Pro (you provided)
  {
    id: 3,
    title: "In Depth 1 on 1 Optimization",
    chips: ["FPS BOOST", "PRO"],
    group: "all",

    sellAuth: { shopId: SELLAUTH_SHOP_ID, productId: 566983 },

    options: [
      { name: "Pro", desc: "∞ In Stock", price: 40.00, variantId: 874414 },
    ],

    tag: "FPS BOOST",
    frontTop: "Tool",
    icon: "⬚",
    short: "OPTIMIZER PRO",
    meta: "Advanced tuning • Priority support"
  },
];

// Demo reviews (keep or replace)
const reviews = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  stars: 5,
  date: "8/21/2025",
  text: i % 3 === 0 ? "Feedback left with no message" : "Fast support, setup was smooth.",
  name: i % 2 ? `user_${100 + i}` : "Customer",
  meta: i % 2 ? "Discord Member" : "Verified Purchase",
}));

// =========================
// HELPERS
// =========================
function $(id) {
  return document.getElementById(id);
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(n) {
  return `$${Number(n).toFixed(2)}`;
}

// =========================
// PRODUCT CARD (no-image)
// =========================
function productCardHTML(p) {
  return `
    <div class="productCard" data-product-id="${p.id}">
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>

      <div class="pcTag">${escapeHTML(p.tag || "")}</div>

      <div class="box3d">
        <div class="boxFront boxFront--noimg">
          <div class="frontTop">${escapeHTML(p.frontTop || "")}</div>

          <div class="noImgCenter">
            <div class="noImgIcon">${escapeHTML(p.icon || "◆")}</div>
            <div class="noImgName">${escapeHTML(p.short || p.title)}</div>
            <div class="noImgMeta">${escapeHTML(p.meta || "Instant delivery • 24/7 support")}</div>
          </div>
        </div>
      </div>

      <div class="pcBottom">
        <div class="pcTitle">${escapeHTML(p.title)}</div>
        <div class="pcPrice">${escapeHTML("SELECT OPTIONS")}</div>
      </div>
    </div>
  `;
}

function renderProducts(filter = "all") {
  const grid = $("productGrid");
  if (!grid) return;

  const list = filter === "all" ? products : products.filter((p) => p.group === filter);
  grid.innerHTML = list.map(productCardHTML).join("");
  attachProductClicks();
}

// =========================
// REVIEWS
// =========================
function renderReviews() {
  const grid = $("reviewsGrid");
  if (!grid) return;

  grid.innerHTML = reviews
    .map(
      (r) => `
    <div class="reviewCard">
      <div class="reviewTop">
        <div class="stars">${"★".repeat(r.stars)}</div>
        <div class="reviewDate">${escapeHTML(r.date)}</div>
      </div>
      <div class="reviewText">${escapeHTML(r.text)}</div>
      <div class="reviewBottom">
        <div class="avatar"></div>
        <div>
          <div class="userName">${escapeHTML(r.name)}</div>
          <div class="userMeta">${escapeHTML(r.meta)}</div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// =========================
// FILTER PILLS
// =========================
function setupFilters() {
  const pills = document.querySelectorAll(".pill");
  pills.forEach((btn) => {
    btn.addEventListener("click", () => {
      pills.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(btn.dataset.filter);
    });
  });
}

// =========================
// SELLAUTH EMBED CHECKOUT
// =========================
function openSellAuthCheckout({ shopId, productId, variantId, quantity }) {
  if (!window.sellAuthEmbed || typeof window.sellAuthEmbed.checkout !== "function") {
    alert("SellAuth embed is not loaded. Add this in <head>:\n<script src=\"https://sellauth.com/assets/js/sellauth-embed-2.js\"></script>");
    return;
  }

  window.sellAuthEmbed.checkout(null, {
    cart: [
      {
        productId: Number(productId),
        variantId: Number(variantId),
        quantity: Number(quantity || 1),
      },
    ],
    shopId: Number(shopId),
    modal: true,
  });
}

// =========================
// PRODUCT MODAL (right panel)
// requires modal HTML in index.html with IDs:
// #pModal, #pModalTitle, #pModalChips, #pModalList, #pModalClose
// =========================
const modal = $("pModal");
const modalTitle = $("pModalTitle");
const modalChips = $("pModalChips");
const modalList = $("pModalList");
const modalClose = $("pModalClose");

function openProductModal(product) {
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (modalTitle) modalTitle.textContent = product.title || "Product";

  if (modalChips) {
    modalChips.innerHTML = (product.chips || [])
      .map((c, i) => {
        const cls = i === 0 ? "pChip pChip--accent" : "pChip";
        return `<span class="${cls}">${escapeHTML(c)}</span>`;
      })
      .join("");
  }

  if (modalList) {
    modalList.innerHTML = (product.options || [])
      .map(
        (opt) => `
        <div class="pOption">
          <div class="pOption__left">
            <div class="pOption__name">${escapeHTML(opt.name)}</div>
            <div class="pOption__desc">${escapeHTML(opt.desc || "")}</div>
          </div>

          <div class="pOption__right">
            <div class="pOption__price">${formatMoney(opt.price)}</div>
            <button class="pBuy"
              data-buy="${product.id}"
              data-variant="${opt.variantId || ""}"
            >BUY</button>
          </div>
        </div>
      `
      )
      .join("");
  }
}

function closeProductModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function attachProductClicks() {
  document.querySelectorAll("[data-product-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.productId);
      const product = products.find((p) => p.id === id);
      if (product) openProductModal(product);
    });
  });
}

// Close handlers
if (modalClose) modalClose.addEventListener("click", closeProductModal);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeProductModal();
  });

  // BUY handler -> SellAuth embed modal
  modal.addEventListener("click", (e) => {
    const btn = e.target.closest?.(".pBuy");
    if (!btn) return;

    const pid = Number(btn.dataset.buy);
    const variantId = btn.dataset.variant;

    const p = products.find((x) => x.id === pid);
    if (!p) return;

    if (!variantId) {
      alert("Missing variantId for this option.");
      return;
    }

    if (!p.sellAuth?.shopId || !p.sellAuth?.productId) {
      alert("Missing SellAuth product/shop mapping for this product.");
      return;
    }

    openSellAuthCheckout({
      shopId: p.sellAuth.shopId,
      productId: p.sellAuth.productId,
      variantId: variantId,
      quantity: 1
    });
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("open")) closeProductModal();
});

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = $("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderProducts("all");
  renderReviews();
  setupFilters();
});
