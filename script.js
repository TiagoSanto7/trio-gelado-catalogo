// ===== CONSTANTES =====
const WHATSAPP_NUMBER = '5565000000000'; // Substituir pelo número real da Trio Gelados

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #ddd6fe, #7c3aed)',
  'linear-gradient(135deg, #fde68a, #d97706)',
  'linear-gradient(135deg, #fecdd3, #e11d48)',
  'linear-gradient(135deg, #c4b5fd, #5b21b6)',
  'linear-gradient(135deg, #fed7aa, #c2410c)',
  'linear-gradient(135deg, #fbcfe8, #be185d)',
];

// ===== ESTADO =====
let products = [];
let cart = [];          // [{ id, nome, preco, emoji, qty }]
let activeCategory = 'Todos';
let deliveryMode = 'delivery'; // 'delivery' | 'pickup'

// ===== REFS DOM =====
const productGrid   = document.getElementById('product-grid');
const filtersEl     = document.getElementById('filters');
const cartBtn       = document.getElementById('cart-btn');
const overlay       = document.getElementById('overlay');
const bottomSheet   = document.getElementById('bottom-sheet');
const cartItemsEl   = document.getElementById('cart-items');
const cartTotalEl   = document.getElementById('cart-total');
const addressInput  = document.getElementById('address-input');
const pickupMsg     = document.getElementById('pickup-msg');
const whatsappBtn   = document.getElementById('whatsapp-btn');
const btnDelivery   = document.getElementById('btn-delivery');
const btnPickup     = document.getElementById('btn-pickup');

// ===== INIT =====
async function init() {
  const res = await fetch('data/products.json');
  products = await res.json();
  renderFilters();
  renderProducts();
}

// ===== FILTROS =====
function renderFilters() {
  const categories = ['Todos', ...new Set(products.map(p => p.categoria))];
  filtersEl.innerHTML = categories.map(cat => `
    <button
      class="filter-chip ${cat === activeCategory ? 'active' : ''}"
      onclick="setCategory('${cat}')"
    >${cat}</button>
  `).join('');
}

function setCategory(cat) {
  activeCategory = cat;
  renderFilters();
  renderProducts();
}

// ===== PRODUTOS =====
function renderProducts() {
  const filtered = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.categoria === activeCategory);

  productGrid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div
        class="product-card__image"
        style="background: ${CARD_GRADIENTS[p.id % CARD_GRADIENTS.length]}"
      >
        <span class="product-card__emoji">${p.emoji}</span>
      </div>
      <div class="product-card__info">
        <span class="product-card__name">${p.nome}</span>
        <span class="product-card__price">R$ ${formatPrice(p.preco)}</span>
      </div>
      <button class="product-card__btn" onclick="addToCart(${p.id})">
        + Adicionar
      </button>
    </div>
  `).join('');
}

// ===== UTILITÁRIO =====
function formatPrice(value) {
  return value.toFixed(2).replace('.', ',');
}

// ===== BOOTSTRAP =====
document.addEventListener('DOMContentLoaded', init);
