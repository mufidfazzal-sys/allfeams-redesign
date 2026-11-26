/**
 * ALLFEAMS™ - Luxury Search Modal Module
 * File: js/search-modal.js
 * 
 * Provides instant live search across all formulas, symptoms, and benefits.
 */

const SearchModal = (function() {
  function init() {
    const desktopBtn = document.getElementById('search-desktop-btn');
    const mobileBtn = document.getElementById('search-mobile-btn');
    const closeBtn = document.getElementById('close-search-btn');
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');

    if (desktopBtn) desktopBtn.addEventListener('click', open);
    if (mobileBtn) mobileBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        search(e.target.value);
      });
    }
  }

  function open() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    if (!modal) return;

    modal.classList.remove('hidden');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
    search('');
  }

  function close() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.add('hidden');
  }

  function setQuery(term) {
    const input = document.getElementById('search-input');
    if (input) {
      input.value = term;
      search(term);
    }
  }

  function search(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    const q = (query || '').toLowerCase().trim();
    const productList = Object.values(ALLFEAMS_PRODUCTS);

    const filtered = q === '' 
      ? productList 
      : productList.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.fullName.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) || 
          p.searchTags.toLowerCase().includes(q)
        );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-8 text-noir-500 text-xs">
          No formulas found matching "${query}". Try searching "odor", "pcos", or "bloat".
        </div>
      `;
    } else {
      resultsContainer.innerHTML = filtered.map(p => `
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-sand-50 hover:bg-sand-100 border border-sand-200 transition">
          <div class="flex items-center space-x-3 min-w-0">
            <img src="${p.image}" alt="${p.fullName}" class="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-sand-200 flex-shrink-0">
            <div class="truncate">
              <h4 class="text-xs font-bold text-noir-900 truncate">${p.fullName}</h4>
              <p class="text-[11px] text-noir-600 truncate">${p.subtitle}</p>
              <p class="text-xs font-semibold text-gold-700 mt-0.5">${CurrencyEngine.format(p.price)}</p>
            </div>
          </div>
          <button onclick="CartModule.addItem('${p.id}', '${p.fullName}', ${p.price}, '${p.image}'); SearchModal.close();" class="ml-3 px-3.5 py-1.5 bg-noir-900 hover:bg-gold-600 text-sand-100 rounded-full text-[11px] font-semibold uppercase tracking-wider transition flex-shrink-0">
            Add
          </button>
        </div>
      `).join('');
    }

    if (window.safeCreateIcons) window.safeCreateIcons();
  }

  return {
    init,
    open,
    close,
    setQuery
  };
})();
