/**
 * ALLFEAMS™ - Shopping Bag & Drawer Module
 * File: js/cart.js
 * 
 * Manages shopping bag items, quantity changes, free shipping calculations,
 * promo code validation, and drawer slide animations.
 */

const CartModule = (function() {
  let cart = [];
  let appliedDiscountPercent = 0;

  function init() {
    loadCart();
    setupEventListeners();
    renderUI();

    // Re-render when currency changes
    window.addEventListener('currencyChanged', () => {
      renderUI();
    });
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem('allfeams_cart');
      if (saved) {
        cart = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage access note:', e);
    }

    // Default starter item if empty
    if (cart.length === 0) {
      cart = [
        {
          id: 'flora',
          name: 'Flora+ Advanced Vaginal Support',
          price: 34.95,
          qty: 1,
          image: 'assets/Advanced.jpg'
        }
      ];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('allfeams_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  function setupEventListeners() {
    const openBtn = document.getElementById('open-cart-btn');
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-drawer-overlay');

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDrawer();
      });
    }
  }

  function openDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;

    overlay.classList.remove('hidden');
    setTimeout(() => {
      drawer.classList.remove('translate-x-full');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;

    drawer.classList.add('translate-x-full');
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  function addItem(id, name, price, image) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1, image });
    }
    saveCart();
    renderUI();
    UIInteractions.showToast('Added to Bag', `${name} has been added.`);
    openDrawer();
  }

  function addBundle(bottles, totalBundlePrice, formulaObj) {
    const formula = formulaObj || {
      key: 'flora',
      name: 'Flora+ (Vaginal Flora & Odor)',
      image: 'assets/Advanced.jpg'
    };

    const id = `bundle-${formula.key}-${bottles}`;
    const bundleName = `${formula.name} (${bottles} Bottles)`;
    const existing = cart.find(i => i.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id,
        name: bundleName,
        price: totalBundlePrice,
        qty: 1,
        image: formula.image
      });
    }
    saveCart();
    renderUI();
    UIInteractions.showToast('Bundle Added', `${bundleName} added to your bag.`);
    openDrawer();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderUI();
  }

  function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderUI();
  }

  function applyPromo(code) {
    const msg = document.getElementById('promo-message');
    const cleanCode = (code || '').trim().toUpperCase();

    if (cleanCode === 'HARMONY10') {
      appliedDiscountPercent = 10;
      if (msg) {
        msg.className = "text-[11px] text-emerald-700 block font-medium";
        msg.textContent = "✓ 10% Subscriber discount applied!";
      }
      renderUI();
      return true;
    } else if (cleanCode) {
      if (msg) {
        msg.className = "text-[11px] text-red-500 block font-medium";
        msg.textContent = "Invalid discount code. Try HARMONY10";
      }
      return false;
    }
  }

  function renderUI() {
    const container = document.getElementById('cart-items-container');
    const counter = document.getElementById('cart-counter');
    const drawerCount = document.getElementById('drawer-item-count');
    const subtotalEl = document.getElementById('drawer-subtotal');
    const totalEl = document.getElementById('drawer-total');
    const discountRow = document.getElementById('drawer-discount-row');
    const discountEl = document.getElementById('drawer-discount');
    const shippingProgressText = document.getElementById('shipping-progress-text');
    const shippingProgressBar = document.getElementById('shipping-progress-bar');
    const shippingProgressPercent = document.getElementById('shipping-progress-percent');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotalUsd = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountUsd = subtotalUsd * (appliedDiscountPercent / 100);
    const finalUsd = Math.max(0, subtotalUsd - discountUsd);

    if (counter) counter.textContent = totalItems;
    if (drawerCount) drawerCount.textContent = totalItems;
    if (subtotalEl) subtotalEl.textContent = CurrencyEngine.format(subtotalUsd);
    if (totalEl) totalEl.textContent = `${CurrencyEngine.format(finalUsd)} ${CurrencyEngine.getCurrent()}`;

    if (appliedDiscountPercent > 0) {
      if (discountRow) discountRow.classList.remove('hidden');
      if (discountEl) discountEl.textContent = `- ${CurrencyEngine.format(discountUsd)}`;
    } else {
      if (discountRow) discountRow.classList.add('hidden');
    }

    // Free shipping threshold ($50 USD equivalent)
    if (subtotalUsd >= 50) {
      if (shippingProgressText) shippingProgressText.textContent = "🎉 Complimentary Discreet Shipping Unlocked!";
      if (shippingProgressBar) {
        shippingProgressBar.style.width = "100%";
        shippingProgressBar.className = "bg-emerald-600 h-2 rounded-full transition-all duration-500";
      }
      if (shippingProgressPercent) shippingProgressPercent.textContent = "100%";
    } else {
      const remaining = (50 - subtotalUsd);
      const percent = Math.min(100, Math.round((subtotalUsd / 50) * 100));
      if (shippingProgressText) shippingProgressText.textContent = `Add ${CurrencyEngine.format(remaining)} for Free Discreet Shipping`;
      if (shippingProgressBar) {
        shippingProgressBar.style.width = `${percent}%`;
        shippingProgressBar.className = "bg-gold-500 h-2 rounded-full transition-all duration-500";
      }
      if (shippingProgressPercent) shippingProgressPercent.textContent = `${percent}%`;
    }

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-noir-600">
          <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-sand-400 mb-3"></i>
          <p class="font-serif text-xl font-bold text-noir-900">Your bag is empty</p>
          <p class="text-xs mt-1">Discover your formula and elevate your feminine balance.</p>
          <a href="collection.html" onclick="CartModule.closeDrawer()" class="inline-block mt-4 px-6 py-2.5 bg-noir-900 text-sand-100 rounded-full text-xs font-semibold uppercase tracking-widest">
            Shop The Collection
          </a>
        </div>
      `;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="flex items-center space-x-4 bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain rounded-xl bg-sand-50 p-1 flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-noir-900 truncate">${item.name}</h4>
            <p class="text-xs text-gold-700 font-semibold mt-0.5">${CurrencyEngine.format(item.price)}</p>
            
            <div class="flex items-center space-x-3 mt-2">
              <div class="flex items-center border border-sand-300 rounded-lg bg-sand-50">
                <button onclick="CartModule.changeQty('${item.id}', -1)" class="px-2 py-0.5 text-xs text-noir-700 hover:text-noir-900">-</button>
                <span class="px-2 py-0.5 text-xs font-semibold text-noir-900">${item.qty}</span>
                <button onclick="CartModule.changeQty('${item.id}', 1)" class="px-2 py-0.5 text-xs text-noir-700 hover:text-noir-900">+</button>
              </div>
              <button onclick="CartModule.removeItem('${item.id}')" class="text-[10px] text-red-500 hover:underline">Remove</button>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-noir-900">${CurrencyEngine.format(item.price * item.qty)}</span>
          </div>
        </div>
      `).join('');
    }

    if (window.safeCreateIcons) window.safeCreateIcons();
  }

  function proceedCheckout() {
    window.location.href = "https://allfeams.com/collections/all";
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    addItem,
    addBundle,
    changeQty,
    removeItem,
    applyPromo,
    renderUI,
    proceedCheckout
  };
})();
