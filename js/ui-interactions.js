/**
 * ALLFEAMS™ - UI Interactions & Animations
 * File: js/ui-interactions.js
 * 
 * Handles mobile drawer, sticky bottom buy bar, FAQ accordion,
 * toast notifications, and review filtering.
 */

const UIInteractions = (function() {
  function init() {
    setupMobileNav();
    setupStickyBar();
    setupStickyHeader();
    setupEscapeKey();
    setupReviews();
  }

  function setupMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-mobile-nav');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (nav) nav.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileNav);
    }

    if (nav) {
      nav.addEventListener('click', (e) => {
        if (e.target === nav) closeMobileNav();
      });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function closeMobileNav() {
    const nav = document.getElementById('mobile-nav');
    if (nav) nav.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function setupStickyBar() {
    const bar = document.getElementById('mobile-sticky-bar');
    const footer = document.querySelector('footer');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      let nearFooter = false;

      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // Hide bar when footer enters viewport so it never cuts off or obstructs footer
        if (footerRect.top <= window.innerHeight + 10) {
          nearFooter = true;
        }
      }

      if (scrollY > 350 && !nearFooter) {
        bar.classList.remove('translate-y-full');
      } else {
        bar.classList.add('translate-y-full');
      }
    }, { passive: true });
  }

  function setupStickyHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    function checkHeader() {
      if (window.scrollY > 20) {
        header.classList.add('is-pinned');
      } else {
        header.classList.remove('is-pinned');
      }
    }

    window.addEventListener('scroll', checkHeader, { passive: true });
    checkHeader();
  }

  function setupEscapeKey() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (window.SearchModal) SearchModal.close();
        if (window.CartModule) CartModule.closeDrawer();
        if (window.ImageLightbox) ImageLightbox.close();
        closeMobileNav();
      }
    });
  }

  function setupReviews() {
    // Reviews are filterable via filterReviews(category, btn)
  }

  function filterReviews(category, buttonElement) {
    const cards = document.querySelectorAll('.review-card');
    const buttons = document.querySelectorAll('.review-btn');

    buttons.forEach(b => {
      b.classList.remove('bg-rosefemme-700', 'text-white', 'shadow-sm', 'bg-noir-900', 'text-sand-100');
      b.classList.add('bg-white', 'text-noir-800');
    });

    if (buttonElement) {
      buttonElement.classList.remove('bg-white', 'text-noir-800');
      buttonElement.classList.add('bg-rosefemme-700', 'text-white', 'shadow-sm');
    }

    cards.forEach(card => {
      if (category === 'all' || card.classList.contains(`rev-${category}`)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function toggleFaq(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('svg') || btn.querySelector('i');
    if (!content) return;
    const isHidden = content.classList.contains('hidden');

    document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('#faq-accordion i, #faq-accordion svg, .faq-chevron').forEach(i => i.classList.remove('rotate-180'));

    if (isHidden) {
      content.classList.remove('hidden');
      if (icon) icon.classList.add('rotate-180');
    }
  }

  function showToast(title, desc) {
    let toast = document.getElementById('toast-notification');
    let toastTitle = document.getElementById('toast-title');
    let toastDesc = document.getElementById('toast-desc');

    if (!toast) {
      const toastHTML = `
        <div id="toast-notification" class="fixed top-24 right-5 z-50 bg-[#221614] text-sand-100 px-5 py-3.5 rounded-2xl shadow-2xl border border-rosefemme-400/50 transform translate-x-32 opacity-0 pointer-events-none transition-all duration-300 flex items-center space-x-3">
          <div class="w-7 h-7 rounded-full bg-gradient-to-r from-rosefemme-500 to-gold-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">✓</div>
          <div>
            <p id="toast-title" class="text-xs font-bold text-white">Added to Bag</p>
            <p id="toast-desc" class="text-[11px] text-rosefemme-200">Your selection has been updated.</p>
          </div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', toastHTML);
      toast = document.getElementById('toast-notification');
      toastTitle = document.getElementById('toast-title');
      toastDesc = document.getElementById('toast-desc');
    }

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    toast.classList.remove('translate-x-32', 'opacity-0', 'pointer-events-none');
    setTimeout(() => {
      if (toast) toast.classList.add('translate-x-32', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  function handleNewsletter(e) {
    e.preventDefault();
    const successEl = document.getElementById('newsletter-success');
    const form = document.getElementById('newsletter-form');
    if (successEl) successEl.classList.remove('hidden');
    if (form) form.classList.add('hidden');
    showToast('Subscribed!', 'Your 10% promo code is HARMONY10');
  }

  return {
    init,
    closeMobileNav,
    filterReviews,
    toggleFaq,
    showToast,
    handleNewsletter
  };
})();
