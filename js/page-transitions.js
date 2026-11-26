/**
 * ALLFEAMS™ - Glitch-Free Luxury Smooth Page Transitions
 * File: js/page-transitions.js
 * 
 * Delivers silky-smooth page transitions without flickering, FOUC, or layout glitch.
 * Pinned header remains 100% still and steady throughout.
 */

const PageTransitions = (function() {
  let veil = null;
  let progressBar = null;
  let isNavigating = false;

  function getCurrentPageName() {
    const raw = window.location.pathname.split('/').pop() || 'index.html';
    return raw.split('#')[0] || 'index.html';
  }

  function init() {
    createVeilDOM();
    highlightActiveNav();
    handleIncomingPage();
    bindNavigationLinks();
    handleBackForwardCache();
  }

  function createVeilDOM() {
    // 1. Shimmer Progress Bar
    if (!document.getElementById('allfeams-veil-bar')) {
      const bar = document.createElement('div');
      bar.id = 'allfeams-veil-bar';
      document.body.appendChild(bar);
      progressBar = bar;
    } else {
      progressBar = document.getElementById('allfeams-veil-bar');
    }

    // 2. Ultra-Soft Silk Curtain (Only used for smooth exit dissolve)
    if (!document.getElementById('allfeams-veil')) {
      const veilEl = document.createElement('div');
      veilEl.id = 'allfeams-veil';
      veilEl.setAttribute('aria-hidden', 'true');
      veilEl.innerHTML = [
        '<div class="veil-brand-card">',
        '  <div class="veil-emblem">',
        '    <span class="veil-emblem-icon">🌸</span>',
        '  </div>',
        '  <h2 class="veil-brand-title">ALLFEAMS</h2>',
        '  <p class="veil-brand-subtitle">The Inside-Out Balance</p>',
        '</div>'
      ].join('');
      document.body.appendChild(veilEl);
      veil = veilEl;
    } else {
      veil = document.getElementById('allfeams-veil');
    }
  }

  function highlightActiveNav() {
    const current = getCurrentPageName();

    // 1. Desktop Nav
    const desktopNav = document.querySelector('nav.hidden.lg\\:flex') || document.querySelector('header nav');
    if (desktopNav) {
      const links = desktopNav.querySelectorAll('a[href]');
      links.forEach(function(a) {
        const href = (a.getAttribute('href') || '').split('#')[0];
        const isCurrent = href === current || (current === 'index.html' && (href === '' || href === '/' || href === 'index.html'));
        
        if (isCurrent) {
          a.classList.add('nav-active-pill', 'text-rosefemme-700', 'font-semibold');
          a.classList.remove('text-noir-800');
        } else {
          a.classList.remove('nav-active-pill', 'text-rosefemme-700', 'font-semibold');
          a.classList.add('text-noir-800');
        }
      });
    }

    // 2. Mobile Nav
    const mobileNav = document.querySelector('#mobile-nav nav') || document.querySelector('#mobile-nav');
    if (mobileNav) {
      const mLinks = mobileNav.querySelectorAll('a[href]');
      mLinks.forEach(function(a) {
        const href = (a.getAttribute('href') || '').split('#')[0];
        const isCurrent = href === current || (current === 'index.html' && (href === '' || href === '/' || href === 'index.html'));

        if (isCurrent) {
          a.classList.add('text-rosefemme-800', 'font-semibold', 'bg-rosefemme-100/70', 'border-l-4', 'border-l-rosefemme-600', 'pl-3', 'rounded-r-xl');
          a.classList.remove('text-noir-800');
        }
      });
    }
  }

  function handleIncomingPage() {
    // If arriving from a transition, finish progress bar gracefully
    var wasTransitioning = false;
    try {
      wasTransitioning = sessionStorage.getItem('allfeams_page_trans') === '1';
      if (wasTransitioning) {
        sessionStorage.removeItem('allfeams_page_trans');
      }
    } catch (err) {}

    if (wasTransitioning && progressBar) {
      progressBar.style.opacity = '1';
      progressBar.style.width = '100%';
      setTimeout(function() {
        progressBar.style.opacity = '0';
        setTimeout(function() {
          progressBar.style.width = '0%';
        }, 220);
      }, 120);
    }
  }

  function bindNavigationLinks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore external, special schemes, anchors, or new tabs
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href === '#' ||
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      const current = getCurrentPageName();
      const parts = href.split('#');
      const targetPath = parts[0];
      const targetHash = parts[1];

      // If clicking same-page anchor (e.g. #flora on collection.html)
      if (href.startsWith('#') || (targetPath === current && targetHash)) {
        if (targetHash) {
          const targetEl = document.getElementById(targetHash);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            try {
              history.pushState(null, '', '#' + targetHash);
            } catch (err) {}
          }
        }
        return;
      }

      // If linking to an internal HTML page
      if (targetPath.endsWith('.html') || targetPath === '' || targetPath === '/') {
        e.preventDefault();
        navigateTo(href);
      }
    });
  }

  function navigateTo(url) {
    if (isNavigating) return;
    isNavigating = true;

    // 1. Close mobile drawer if open
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
      mobileNav.classList.add('hidden');
    }

    // 2. Start progress bar smoothly
    if (progressBar) {
      progressBar.style.opacity = '1';
      progressBar.style.width = '85%';
    }

    // 3. Soft silk exit dissolve (smooth, no glitch, no blur lag)
    if (veil) {
      veil.classList.add('is-active');
    }

    // 4. Mark transition state for destination page
    try {
      sessionStorage.setItem('allfeams_page_trans', '1');
    } catch (err) {}

    // 5. Navigate after brief silky dissolve (200ms)
    setTimeout(function() {
      if (progressBar) progressBar.style.width = '100%';
      window.location.href = url;
    }, 200);
  }

  function handleBackForwardCache() {
    window.addEventListener('pageshow', function(event) {
      isNavigating = false;
      if (veil) veil.classList.remove('is-active');
      if (progressBar) {
        progressBar.style.opacity = '0';
        progressBar.style.width = '0%';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init: init,
    navigateTo: navigateTo
  };
})();

window.PageTransitions = PageTransitions;
