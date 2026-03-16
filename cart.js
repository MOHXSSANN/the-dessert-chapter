// ─── The Dessert Chapter — Cart System ───────────────────────────────────────
// Stored in localStorage as: { items: [{ id, name, price, qty, note }] }

const CART_KEY = 'tdc_cart';

// Product catalogue — server-side copy in api/create-payment.js MUST match
const CATALOGUE = {
  // ── Brownies (single serve) ───────────────────────────────────────────────
  'brownie-classic-nutella':  { name: 'Brownie – Classic Nutella',  price: 3.50, minQty: 1 },
  'brownie-rv-nutella':       { name: 'Brownie – Red Velvet Nutella',price: 3.50, minQty: 1 },
  'brownie-biscoff-single':   { name: 'Brownie – Biscoff',          price: 3.50, minQty: 1 },
  'brownie-pistachio-single': { name: 'Brownie – Pistachio',        price: 3.50, minQty: 1 },
  // ── Brownie trays ────────────────────────────────────────────────────────
  'brownie-tray-classic-nutella': { name: 'Brownie Party Tray – Classic Nutella', price: 50.00, minQty: 1 },
  'brownie-tray-rv':              { name: 'Brownie Party Tray – Red Velvet',      price: 55.00, minQty: 1 },
  'brownie-tray-biscoff':         { name: 'Brownie Party Tray – Biscoff',         price: 60.00, minQty: 1 },
  'brownie-tray-pistachio':       { name: 'Brownie Party Tray – Pistachio',       price: 60.00, minQty: 1 },
  // ── Brownie mini tubs ────────────────────────────────────────────────────
  'brownie-tub-classic-nutella':  { name: 'Brownie Tub – Classic Nutella', price: 5.00, minQty: 12 },
  'brownie-tub-rv':               { name: 'Brownie Tub – Red Velvet',      price: 5.00, minQty: 12 },
  'brownie-tub-biscoff':          { name: 'Brownie Tub – Biscoff',         price: 5.50, minQty: 12 },
  'brownie-tub-pistachio':        { name: 'Brownie Tub – Pistachio',       price: 5.50, minQty: 12 },
  // ── Milk cake shots ──────────────────────────────────────────────────────
  'milk-cake-shot-saffron':    { name: 'Milk Cake Shot – Saffron',    price: 5.00, minQty: 6 },
  'milk-cake-shot-strawberry': { name: 'Milk Cake Shot – Strawberry', price: 5.00, minQty: 6 },
  'milk-cake-shot-coconut':    { name: 'Milk Cake Shot – Coconut',    price: 5.00, minQty: 6 },
  'milk-cake-shot-biscoff':    { name: 'Milk Cake Shot – Biscoff',    price: 5.00, minQty: 6 },
  // ── Milk cake bento tubs ─────────────────────────────────────────────────
  'milk-cake-tub-saffron':    { name: 'Milk Cake Bento – Saffron',    price: 8.50, minQty: 6 },
  'milk-cake-tub-biscoff':    { name: 'Milk Cake Bento – Biscoff',    price: 8.50, minQty: 6 },
  'milk-cake-tub-coconut':    { name: 'Milk Cake Bento – Coconut',    price: 8.50, minQty: 6 },
  'milk-cake-tub-strawberry': { name: 'Milk Cake Bento – Strawberry', price: 8.50, minQty: 6 },
  // ── Milk cake trays ──────────────────────────────────────────────────────
  'milk-cake-tray-saffron':    { name: 'Milk Cake Tray – Saffron',    price: 65.00, minQty: 1 },
  'milk-cake-tray-biscoff':    { name: 'Milk Cake Tray – Biscoff',    price: 65.00, minQty: 1 },
  'milk-cake-tray-coconut':    { name: 'Milk Cake Tray – Coconut',    price: 65.00, minQty: 1 },
  'milk-cake-tray-strawberry': { name: 'Milk Cake Tray – Strawberry', price: 65.00, minQty: 1 },
  // ── Cinnamon buns ────────────────────────────────────────────────────────
  'cream-bun-classic': { name: 'Cinnamon Bun – Classic',      price: 6.50, minQty: 6 },
  'cream-bun-chai':    { name: 'Cinnamon Bun – Chai Caramel', price: 7.50, minQty: 6 },
  'cream-bun-biscoff': { name: 'Cinnamon Bun – Biscoff',      price: 8.50, minQty: 6 },
  // ── Cupcakes ─────────────────────────────────────────────────────────────
  'cupcake-vanilla':   { name: 'Cupcake – Vanilla',    price: 2.50, minQty: 6 },
  'cupcake-choco':     { name: 'Cupcake – Chocolate',  price: 2.50, minQty: 6 },
  'cupcake-redvelvet': { name: 'Cupcake – Red Velvet', price: 2.50, minQty: 6 },
  // ── Caramel sauces ───────────────────────────────────────────────────────
  'caramel-sauce-classic-small':       { name: 'Classic Caramel Sauce (Small)',       price: 5.00,  minQty: 1 },
  'caramel-sauce-classic-large':       { name: 'Classic Caramel Sauce (Large)',       price: 10.00, minQty: 1 },
  'caramel-sauce-chai-small':          { name: 'Chai Caramel Sauce (Small)',          price: 5.00,  minQty: 1 },
  'caramel-sauce-chai-large':          { name: 'Chai Caramel Sauce (Large)',          price: 10.00, minQty: 1 },
  'caramel-sauce-butterscotch-small':  { name: 'Butterscotch Caramel Sauce (Small)',  price: 5.00,  minQty: 1 },
  'caramel-sauce-butterscotch-large':  { name: 'Butterscotch Caramel Sauce (Large)', price: 10.00, minQty: 1 },
  // ── Red Velvet Tubs ──────────────────────────────────────────────────────
  'red-velvet-tub': { name: 'Red Velvet Tub', price: 8.50, minQty: 6 },
  // ── Legacy SKUs (kept for safety) ────────────────────────────────────────
  'brownie-regular':    { name: 'Brownie (Regular)',              price: 3.50,  minQty: 1 },
  'brownie-nutella-rv': { name: 'Brownie (Nutella / Red Velvet)', price: 3.50,  minQty: 1 },
  'brownie-biscoff':    { name: 'Brownie (Biscoff / Pistachio)',  price: 3.50,  minQty: 1 },
  'brownie-box-6':      { name: 'Brownie Box (6 pcs)',            price: 8.50,  minQty: 1 },
  'cream-bun-regular':  { name: 'Cream Bun (Regular)',            price: 6.50,  minQty: 1 },
  'cream-bun-nutella':  { name: 'Cream Bun (Nutella)',            price: 7.50,  minQty: 1 },
  'milk-cake-bento':    { name: 'Milk Cake Bento Box',            price: 8.50,  minQty: 6 },
  'milk-cake-half':     { name: 'Milk Cake (Half Sheet)',         price: 65.00, minQty: 1 },
  'cream-bento-cup':    { name: 'Cream Bento Cup',                price: 8.50,  minQty: 6 },
};

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; }
  catch { return { items: [] }; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1, note = '') {
  const product = CATALOGUE[productId];
  if (!product) return;
  const cart = getCart();
  const existing = cart.items.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
    if (note) existing.note = note;
  } else {
    cart.items.push({ id: productId, name: product.name, price: product.price, qty, note });
  }
  saveCart(cart);
  showCartToast(product.name, qty);
}

function removeFromCart(productId) {
  const cart = getCart();
  cart.items = cart.items.filter(i => i.id !== productId);
  saveCart(cart);
}

function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.items.find(i => i.id === productId);
  if (item) { qty > 0 ? (item.qty = qty) : removeFromCart(productId); }
  saveCart(cart);
}

function clearCart() {
  saveCart({ items: [] });
}

function cartTotal() {
  return getCart().items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartCount() {
  return getCart().items.reduce((sum, i) => sum + i.qty, 0);
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showCartToast(name, qty) {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.innerHTML = `
    <span style="font-size:1.1rem;">🛒</span>
    <span><strong>${qty}× ${name}</strong> added to cart</span>
    <a href="checkout.html" style="color:#C4973A;font-weight:700;text-decoration:none;margin-left:8px;">View Cart →</a>`;
  Object.assign(toast.style, {
    position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)',
    background:'#1C0608', color:'#FDF9F6', padding:'14px 22px',
    borderRadius:'100px', display:'flex', alignItems:'center', gap:'10px',
    fontFamily:'\'DM Sans\',sans-serif', fontSize:'0.88rem', zIndex:'9999',
    boxShadow:'0 8px 32px rgba(28,6,8,0.4)', whiteSpace:'nowrap',
    animation:'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
  });
  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 3200);
}

// Inject cart icon into nav on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // Inject cart icon into desktop nav
  const desktopNav = document.getElementById('desktop-nav');
  if (desktopNav) {
    const cartLink = document.createElement('a');
    cartLink.href = 'checkout.html';
    cartLink.style.cssText = 'position:relative;display:flex;align-items:center;gap:6px;color:rgba(255,255,255,0.88);text-decoration:none;padding:8px 16px;border:1px solid rgba(255,255,255,0.25);border-radius:100px;font-family:\'DM Sans\',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.04em;transition:background 0.2s,border-color 0.2s;';
    cartLink.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Cart<span class="cart-badge" style="display:none;position:absolute;top:-6px;right:-6px;background:#B8232F;color:#fff;border-radius:50%;width:18px;height:18px;font-size:0.65rem;font-weight:700;align-items:center;justify-content:center;">0</span>`;
    cartLink.id = 'nav-cart-btn';
    cartLink.addEventListener('mouseover', () => { cartLink.style.background = 'rgba(255,255,255,0.1)'; });
    cartLink.addEventListener('mouseout', () => { cartLink.style.background = ''; });
    desktopNav.appendChild(cartLink);

    // Update cart button color when nav scrolls (matches updateNav() on each page)
    const navbar = document.getElementById('navbar');
    if (navbar) {
      function syncCartLinkColor() {
        const scrolled = navbar.classList.contains('nav-scrolled');
        cartLink.style.color = scrolled ? '#1C0608' : 'rgba(255,255,255,0.88)';
        cartLink.style.borderColor = scrolled ? 'rgba(28,6,8,0.25)' : 'rgba(255,255,255,0.25)';
      }
      new MutationObserver(syncCartLinkColor).observe(navbar, { attributes: true, attributeFilter: ['class'] });
      syncCartLinkColor(); // apply immediately on load
    }
  }
  updateCartBadge();
});

// Export for inline scripts
window.TDC = { addToCart, removeFromCart, updateQty, clearCart, getCart, cartTotal, cartCount, CATALOGUE };
