
window.switchProductAngle = function(thumbEl, mainImgId) {
  const main = document.getElementById(mainImgId);
  if (!main || !thumbEl) return;
  main.src = thumbEl.src;
  main.alt = thumbEl.alt;
  const parent = thumbEl.parentElement;
  if (parent) {
    parent.querySelectorAll("img").forEach(img => {
      img.classList.remove("border-rosefemme-600", "ring-2", "ring-rosefemme-400", "shadow-md");
      img.classList.add("border-rosefemme-200");
    });
    thumbEl.classList.remove("border-rosefemme-200");
    thumbEl.classList.add("border-rosefemme-600", "ring-2", "ring-rosefemme-400", "shadow-md");
  }
};


window.toggleVideoMute = function(vidId, btn) {
  const vid = document.getElementById(vidId);
  if (!vid) return;
  vid.muted = !vid.muted;
  if (btn) {
    if (vid.muted) {
      btn.innerHTML = '<i data-lucide="volume-x" class="w-4 h-4"></i>';
    } else {
      btn.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4 text-rosefemme-300"></i>';
    }
  }
  if (window.safeCreateIcons) window.safeCreateIcons();
};

window.switchMainImage = function(thumbEl, mainImgId) {
  const main = document.getElementById(mainImgId);
  if (main && thumbEl) {
    main.src = thumbEl.src;
    main.alt = thumbEl.alt;
  }
};

/**
 * ALLFEAMS™ - Main Application Entrypoint
 * File: js/main.js
 * 
 * Initializes all modular components and provides backward-compatible
 * global helper wrappers for inline HTML event handlers.
 */

// Global Safe Icon Creator
window.safeCreateIcons = function() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn('Lucide icon render notice:', e);
    }
  }
};

// Global helper wrappers for backward compatibility with inline onclick handlers
window.quickAddProduct = function(id, name, price, image) {
  const prod = (typeof ALLFEAMS_PRODUCTS !== 'undefined' && ALLFEAMS_PRODUCTS[id]) ? ALLFEAMS_PRODUCTS[id] : null;
  const finalName = prod ? prod.fullName : name;
  const finalPrice = prod ? prod.price : price;
  const finalImage = prod ? prod.image : image;
  CartModule.addItem(id, finalName, finalPrice, finalImage);
};

window.switchFormula = function(key) {
  FormulaMatcher.switchTab(key);
};

window.setBundleFormula = function(key) {
  BundleModule.selectFormula(key);
};

window.addBundleToCart = function(bottles) {
  if (bottles === 1) BundleModule.addTier('tier1');
  else if (bottles === 3) BundleModule.addTier('tier2');
  else if (bottles === 6) BundleModule.addTier('tier3');
};

window.handleReviewFilter = function(category, btn) {
  UIInteractions.filterReviews(category, btn);
};

window.toggleFaq = function(btn) {
  UIInteractions.toggleFaq(btn);
};

window.setSearchQuery = function(term) {
  SearchModal.setQuery(term);
};

window.handleNewsletterSubmit = function(e) {
  UIInteractions.handleNewsletter(e);
};

window.handleCheckout = function() {
  CartModule.proceedCheckout();
};

window.applyPromoCode = function() {
  const codeInput = document.getElementById('promo-input');
  if (codeInput) {
    CartModule.applyPromo(codeInput.value);
  }
};

window.openProductZoom = function(src, alt) {
  if (window.ImageLightbox) {
    ImageLightbox.openImage(src, alt);
  }
};

// DOM Content Loaded Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  if (window.CMSEngine) {
    CMSEngine.apply();
  }
  safeCreateIcons();
  CurrencyEngine.init();
  CartModule.init();
  FormulaMatcher.init();
  SearchModal.init();
  UIInteractions.init();
  if (window.ImageLightbox) {
    ImageLightbox.init();
  }
  if (window.PageTransitions) {
    PageTransitions.init();
  }
});
