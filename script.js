// ===== CONSTANTES =====
const WHATSAPP_NUMBER = '5566992058707'; // Substituir pelo número real da Trio Gelados
const CART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><rect x="6" y="5" width="12" height="17" rx="1.5" fill="#D4B896" stroke="#9C7A45" stroke-width="1.2"/><rect x="6" y="5" width="12" height="2.5" rx="1" fill="#C4A47C" stroke="#9C7A45" stroke-width="1.2"/><path d="M9 5 Q9 1 12 1 Q15 1 15 5" fill="none" stroke="#9C7A45" stroke-width="1.8" stroke-linecap="round"/><rect x="8" y="9.5" width="8" height="10" rx="0.5" fill="none" stroke="#B89060" stroke-width="0.7" stroke-dasharray="1.5 1.5"/></svg>';

// ===== ESTADO =====
let products = [];
let cart = [];          // [{ id, nome, preco, foto, qty }]
let activeCategory = 'Todos';
let deliveryMode = 'delivery'; // 'delivery' | 'pickup'
let paymentMethod = 'pix';    // 'pix' | 'card' | 'cash'

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
const whatsappBtn      = document.getElementById('whatsapp-btn');
const whatsappBtnLabel = document.getElementById('whatsapp-btn-label');
const btnDelivery   = document.getElementById('btn-delivery');
const btnPickup     = document.getElementById('btn-pickup');
const btnPix        = document.getElementById('btn-pix');
const btnCard       = document.getElementById('btn-card');
const btnCash       = document.getElementById('btn-cash');

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
      <div class="product-card__image">
        <img src="data/${p.foto}" alt="${p.nome}" loading="lazy" />
      </div>
      <div class="product-card__info">
        <span class="product-card__name">${p.nome}</span>
        <span class="product-card__desc">${p.descricao}</span>
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

// ===== BOTTOM SHEET =====
function openBottomSheet() {
  renderBottomSheet();
  overlay.classList.add('visible');
  bottomSheet.classList.add('open');
}

function closeBottomSheet() {
  overlay.classList.remove('visible');
  bottomSheet.classList.remove('open');
}

function renderBottomSheet() {
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item__thumb" src="data/${item.foto}" alt="${item.nome}" />
      <span class="cart-item__name">${item.nome}</span>
      <button class="cart-item__remove" onclick="removeFromCart(${item.id})" aria-label="Remover item"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>
      <div class="cart-item__controls">
        <button onclick="updateCartQty(${item.id}, -1)" aria-label="Diminuir">−</button>
        <span>${item.qty}</span>
        <button onclick="updateCartQty(${item.id}, 1)" aria-label="Aumentar">+</button>
      </div>
      <span class="cart-item__subtotal">R$ ${formatPrice(item.preco * item.qty)}</span>
    </div>
  `).join('');

  cartTotalEl.textContent = `Total: R$ ${formatPrice(getTotal())}`;
  whatsappBtnLabel.textContent = `Confirmar via WhatsApp — R$ ${formatPrice(getTotal())}`;
}

function setDeliveryMode(mode) {
  deliveryMode = mode;
  btnDelivery.classList.toggle('active', mode === 'delivery');
  btnPickup.classList.toggle('active', mode === 'pickup');
  addressInput.style.display  = mode === 'delivery' ? 'block' : 'none';
  pickupMsg.style.display     = mode === 'pickup'   ? 'block' : 'none';
}

function setPaymentMethod(method) {
  paymentMethod = method;
  btnPix.classList.toggle('active',  method === 'pix');
  btnCard.classList.toggle('active', method === 'card');
  btnCash.classList.toggle('active', method === 'cash');
}

// ===== CARRINHO =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, nome: product.nome, preco: product.preco, foto: product.foto, qty: 1 });
  }
  updateCartButton();
}

function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartButton();
  if (typeof renderBottomSheet === 'function') renderBottomSheet();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartButton();
  if (cart.length > 0) renderBottomSheet();
}

function getTotal() {
  return cart.reduce((sum, c) => sum + c.preco * c.qty, 0);
}

function getItemCount() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

function updateCartButton() {
  const count = getItemCount();
  if (count > 0) {
    cartBtn.style.display = 'block';
    cartBtn.innerHTML = `${CART_SVG} Ver pedido (${count}) — R$ ${formatPrice(getTotal())}`;
  } else {
    cartBtn.style.display = 'none';
    if (typeof closeBottomSheet === 'function') closeBottomSheet();
  }
}

// ===== WHATSAPP =====
function buildWhatsAppMessage() {
  const lines = cart.map(c =>
    `• 🍦 ${c.nome} x${c.qty} — R$ ${formatPrice(c.preco * c.qty)}`
  ).join('\n');

  const totalLine = `*Total: R$ ${formatPrice(getTotal())}*`;

  const deliveryLine = deliveryMode === 'delivery'
    ? `📍 *Entrega:* ${addressInput.value.trim()}`
    : `🏪 *Retirada no local*`;

  const PAYMENT_LABELS = { pix: 'Pix', card: 'Cartão', cash: 'Dinheiro' };
  const paymentLine = `*Pagamento:* ${PAYMENT_LABELS[paymentMethod]}`;

  return `❤️❤️❤️ *Pedido Trio Gelado*\n\n${lines}\n\n${totalLine}\n\n${deliveryLine}\n${paymentLine}`;
}

function confirmOrder() {
  if (deliveryMode === 'delivery' && !addressInput.value.trim()) {
    addressInput.classList.add('error');
    addressInput.placeholder = 'Informe o endereço para continuar';
    addressInput.focus();
    return;
  }
  addressInput.classList.remove('error');

  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ===== EVENT LISTENERS =====
cartBtn.addEventListener('click', openBottomSheet);
overlay.addEventListener('click', closeBottomSheet);
btnDelivery.addEventListener('click', () => setDeliveryMode('delivery'));
btnPickup.addEventListener('click', () => setDeliveryMode('pickup'));
btnPix.addEventListener('click',  () => setPaymentMethod('pix'));
btnCard.addEventListener('click', () => setPaymentMethod('card'));
btnCash.addEventListener('click', () => setPaymentMethod('cash'));
whatsappBtn.addEventListener('click', confirmOrder);

// ===== BOOTSTRAP =====
document.addEventListener('DOMContentLoaded', init);
