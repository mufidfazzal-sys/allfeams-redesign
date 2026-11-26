/**
 * ALLFEAMS™ - Live Client-Side & Published JSON CMS Engine
 * File: js/cms-engine.js
 *
 * Applies admin-edited page content, product catalog updates,
 * video/image paths, reviews, and FAQs across all 7 pages.
 */

const CMSEngine = (function() {
  const STORAGE_KEY = 'allfeams_cms_content';

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function mergeContent(base, override) {
    if (!override || typeof override !== 'object') return base;
    const result = Array.isArray(base) ? [...base] : { ...base };
    Object.keys(override).forEach(key => {
      const val = override[key];
      if (val === null || val === undefined) return;
      if (Array.isArray(val)) {
        result[key] = deepClone(val);
      } else if (typeof val === 'object' && typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
        result[key] = mergeContent(base[key], val);
      } else {
        result[key] = val;
      }
    });
    return result;
  }

  function getSavedOverride() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function getContent() {
    const defaults = deepClone(window.ALLFEAMS_CMS_DEFAULTS || {});
    if (!defaults.products && typeof ALLFEAMS_PRODUCTS !== 'undefined') {
      defaults.products = {
        flora: deepClone(ALLFEAMS_PRODUCTS.flora),
        harmony: deepClone(ALLFEAMS_PRODUCTS.harmony),
        flatfemme: deepClone(ALLFEAMS_PRODUCTS.flatfemme),
        moisture: deepClone(ALLFEAMS_PRODUCTS.moisture)
      };
    }
    if (!defaults.reviewsList && typeof ALLFEAMS_REVIEWS !== 'undefined') {
      defaults.reviewsList = deepClone(ALLFEAMS_REVIEWS);
    }
    const saved = getSavedOverride();
    return saved ? mergeContent(defaults, saved) : defaults;
  }

  function saveContent(contentObj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contentObj));
      return true;
    } catch (e) {
      return false;
    }
  }

  function resetContent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function resolvePath(obj, pathStr) {
    if (!obj || !pathStr) return undefined;
    return pathStr.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function syncGlobalData(cms) {
    if (cms.products && typeof ALLFEAMS_PRODUCTS !== 'undefined') {
      ['flora', 'harmony', 'flatfemme', 'moisture'].forEach(key => {
        if (cms.products[key] && ALLFEAMS_PRODUCTS[key]) {
          Object.assign(ALLFEAMS_PRODUCTS[key], cms.products[key]);
          ALLFEAMS_PRODUCTS[key].price = parseFloat(ALLFEAMS_PRODUCTS[key].price) || 34.95;
          ALLFEAMS_PRODUCTS[key].originalPrice = parseFloat(ALLFEAMS_PRODUCTS[key].originalPrice) || 49.95;
        }
      });
      ALLFEAMS_PRODUCTS.flatfeams = ALLFEAMS_PRODUCTS.flatfemme;
    }

    if (Array.isArray(cms.reviewsList) && typeof ALLFEAMS_REVIEWS !== 'undefined') {
      ALLFEAMS_REVIEWS.length = 0;
      cms.reviewsList.forEach(item => ALLFEAMS_REVIEWS.push(item));
    }
  }

  function applyDomBindings(cms) {
    // 1. Plain text bindings
    document.querySelectorAll('[data-cms]').forEach(el => {
      const val = resolvePath(cms, el.getAttribute('data-cms'));
      if (val !== undefined && val !== null) {
        el.textContent = val;
      }
    });

    // 2. HTML bindings (for formatted headlines/paragraphs)
    document.querySelectorAll('[data-cms-html]').forEach(el => {
      const val = resolvePath(cms, el.getAttribute('data-cms-html'));
      if (val !== undefined && val !== null) {
        el.innerHTML = val;
      }
    });

    // 3. Src bindings (images & videos)
    document.querySelectorAll('[data-cms-src]').forEach(el => {
      const val = resolvePath(cms, el.getAttribute('data-cms-src'));
      if (val) {
        const current = el.getAttribute('src');
        if (current !== val) {
          el.setAttribute('src', val);
          if (el.tagName === 'VIDEO' && typeof el.load === 'function') {
            el.load();
          }
        }
      }
    });

    // 4. Poster bindings for videos
    document.querySelectorAll('[data-cms-poster]').forEach(el => {
      const val = resolvePath(cms, el.getAttribute('data-cms-poster'));
      if (val) {
        el.setAttribute('poster', val);
      }
    });

    // 5. Href bindings for links
    document.querySelectorAll('[data-cms-href]').forEach(el => {
      const val = resolvePath(cms, el.getAttribute('data-cms-href'));
      if (val) {
        el.setAttribute('href', val);
      }
    });

    // 6. Product field bindings (e.g. data-cms-product="flora.price" or data-cms-product="flora.name")
    document.querySelectorAll('[data-cms-product]').forEach(el => {
      const key = el.getAttribute('data-cms-product');
      const val = resolvePath(cms.products, key);
      if (val === undefined || val === null) return;

      if (el.tagName === 'IMG') {
        if (val) el.setAttribute('src', val);
      } else if (el.classList.contains('price-display') || el.classList.contains('original-price-display')) {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          el.setAttribute('data-usd', num.toFixed(2));
          if (typeof CurrencyEngine !== 'undefined' && typeof CurrencyEngine.format === 'function') {
            el.textContent = CurrencyEngine.format(num);
          } else {
            el.textContent = `$${num.toFixed(2)}`;
          }
        }
      } else {
        el.textContent = val;
      }
    });

    // 7. Dynamic Reviews container (reviews.html)
    renderDynamicReviews(cms);

    // 8. Dynamic FAQ Accordion container (faq.html)
    renderDynamicFaqs(cms);

    // 9. Update Stories Landscape Explainers map if present
    if (typeof window.LANDSCAPE_EXPLAINERS === 'object' && cms.stories) {
      window.LANDSCAPE_EXPLAINERS.flora = {
        src: cms.stories.expFloraVideo,
        poster: cms.stories.expFloraPoster,
        tag: cms.stories.expFloraTag,
        title: cms.stories.expFloraTitle,
        desc: cms.stories.expFloraDesc
      };
      window.LANDSCAPE_EXPLAINERS.harmony = {
        src: cms.stories.expHarmonyVideo,
        poster: cms.stories.expHarmonyPoster,
        tag: cms.stories.expHarmonyTag,
        title: cms.stories.expHarmonyTitle,
        desc: cms.stories.expHarmonyDesc
      };
      window.LANDSCAPE_EXPLAINERS.flatfeams = {
        src: cms.stories.expFlatVideo,
        poster: cms.stories.expFlatPoster,
        tag: cms.stories.expFlatTag,
        title: cms.stories.expFlatTitle,
        desc: cms.stories.expFlatDesc
      };
    }

    // Re-apply currency formatting after prices update
    if (typeof CurrencyEngine !== 'undefined' && typeof CurrencyEngine.updateDom === 'function') {
      CurrencyEngine.updateDom();
    }
    if (window.safeCreateIcons) window.safeCreateIcons();
  }

  function renderDynamicReviews(cms) {
    const container = document.getElementById('reviews-container');
    if (!container || !Array.isArray(cms.reviewsList)) return;

    container.innerHTML = cms.reviewsList.map(r => {
      const tag = (r.tag || 'odor').toLowerCase();
      const stars = '★'.repeat(Math.max(1, Math.min(5, parseInt(r.rating || 5, 10))));
      const imgMap = {
        odor: 'assets/Advanced.jpg',
        dryness: 'assets/Advanced.jpg',
        bloat: 'assets/Flatfeams.jpg',
        cycle: 'assets/Harmony+.jpg'
      };
      const thumb = r.image || imgMap[tag] || 'assets/Advanced.jpg';
      const titleText = escapeHtml(String(r.title || 'Verified Review').replace(/^"+|"+$/g, ''));
      const quoteText = escapeHtml(String(r.quote || '').replace(/^"+|"+$/g, ''));

      return `
        <div class="review-card rev-${escapeHtml(tag)} bg-white rounded-3xl p-8 border border-rosefemme-200/80 shadow-md feminine-glow flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex text-gold-500">${stars}</div>
              <span class="text-[10px] bg-rosefemme-100 text-rosefemme-800 font-semibold px-2.5 py-0.5 rounded-full border border-rosefemme-200">
                ${r.verified === false ? 'Customer' : 'Verified Woman'}
              </span>
            </div>
            <h3 class="font-serif text-xl font-bold text-noir-900 mb-2">"${titleText}"</h3>
            <p class="text-xs text-noir-700 leading-relaxed font-light mb-6">"${quoteText}"</p>
          </div>
          <div class="border-t border-rosefemme-100 pt-4 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-3">
              <img src="${escapeHtml(thumb)}" alt="${escapeHtml(r.productUsed || 'ALLFEAMS')}" class="w-10 h-10 object-contain rounded-lg bg-rosefemme-50 p-1 border border-rosefemme-200 cursor-zoom-in" title="Click to enlarge bottle">
              <div>
                <p class="font-semibold text-noir-900">${escapeHtml(r.author)}${r.age ? `, ${escapeHtml(r.age)}` : ''}</p>
                <p class="text-[10px] text-rosefemme-700">Used: ${escapeHtml(r.productUsed)}</p>
              </div>
            </div>
            <span class="text-[10px] text-noir-400">${escapeHtml(r.location || '')}</span>
          </div>
        </div>
      `;
    }).join('');

    if (window.ImageLightbox && typeof window.ImageLightbox.init === 'function') {
      window.ImageLightbox.init();
    }
  }

  function renderDynamicFaqs(cms) {
    const listContainer = document.getElementById('faq-items-list');
    if (!listContainer || !Array.isArray(cms.faqItems)) return;

    listContainer.innerHTML = cms.faqItems.map(item => `
      <div class="border border-rosefemme-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <button class="w-full text-left p-6 font-semibold text-xs sm:text-sm text-noir-900 flex items-center justify-between focus:outline-none" onclick="toggleFaq(this)">
          <span>${escapeHtml(item.question)}</span>
          <i data-lucide="chevron-down" class="w-4 h-4 text-rosefemme-700 transition-transform"></i>
        </button>
        <div class="faq-content hidden px-6 pb-6 text-xs sm:text-sm text-noir-600 font-light leading-relaxed border-t border-rosefemme-100 pt-4">
          ${escapeHtml(item.answer)}
        </div>
      </div>
    `).join('');
  }

  function apply() {
    const cms = getContent();
    syncGlobalData(cms);
    applyDomBindings(cms);
    return cms;
  }

  function fetchPublishedIfNoLocalOverride() {
    if (getSavedOverride()) return;
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;
    const isInAdmin = window.location.pathname.indexOf('/admin') !== -1;
    const jsonUrl = isInAdmin ? '../data/cms-content.json' : 'data/cms-content.json';
    fetch(jsonUrl, { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then(published => {
        if (!published) return;
        const merged = mergeContent(getContent(), published);
        syncGlobalData(merged);
        applyDomBindings(merged);
        if (typeof FormulaMatcher !== 'undefined' && document.getElementById('formula-result-card')) {
          FormulaMatcher.init();
        }
        window.dispatchEvent(new CustomEvent('cmsPublishedLoaded', { detail: merged }));
      })
      .catch(() => {});
  }

  return {
    STORAGE_KEY,
    getContent,
    saveContent,
    resetContent,
    apply,
    fetchPublishedIfNoLocalOverride
  };
})();

window.CMSEngine = CMSEngine;

document.addEventListener('DOMContentLoaded', () => {
  CMSEngine.apply();
  CMSEngine.fetchPublishedIfNoLocalOverride();
});
