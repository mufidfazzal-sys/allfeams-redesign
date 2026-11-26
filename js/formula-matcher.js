/**
 * ALLFEAMS™ - Interactive Feminine Formula Matcher Module
 * File: js/formula-matcher.js
 * 
 * Drives the 1-click concern switcher and dynamic clinical recommendation display
 * with gentle, empathetic female self-care aesthetic.
 */

const FormulaMatcher = (function() {
  let activeKey = 'flora';

  function init() {
    switchTab('flora');

    window.addEventListener('currencyChanged', () => {
      renderCard(activeKey);
    });
  }

  function switchTab(key) {
    if (!ALLFEAMS_PRODUCTS[key]) return;
    activeKey = key;

    // Toggle active classes on tabs
    document.querySelectorAll('.formula-tab').forEach(b => {
      b.classList.remove('border-rosefemme-500', 'bg-rosefemme-50', 'shadow-md', 'ring-2', 'ring-rosefemme-300/40');
      b.classList.add('border-sand-300', 'bg-white');
    });

    const activeBtn = document.getElementById(`tab-${key}`);
    if (activeBtn) {
      activeBtn.classList.remove('border-sand-300', 'bg-white');
      activeBtn.classList.add('border-rosefemme-500', 'bg-rosefemme-50', 'shadow-md', 'ring-2', 'ring-rosefemme-300/40');
    }

    renderCard(key);
  }

  function renderCard(key) {
    const f = ALLFEAMS_PRODUCTS[key];
    const container = document.getElementById('formula-result-card');
    if (!container || !f) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Visual Column -->
        <div class="lg:col-span-5 bg-gradient-to-b from-white to-rosefemme-50/60 rounded-3xl p-6 text-center border border-rosefemme-200/80 relative shadow-sm">
          <span class="absolute top-3 left-3 bg-rosefemme-100 text-rosefemme-800 border border-rosefemme-200 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-xs">
            🌸 ${f.badge}
          </span>
          <img src="${f.image}" alt="${f.fullName}" title="Click to enlarge view" class="w-56 h-56 object-contain mx-auto filter drop-shadow-xl my-4 transform hover:scale-105 transition-transform duration-500 cursor-zoom-in" onclick="if (window.ImageLightbox) ImageLightbox.openImage('${f.image}', '${f.fullName}')">
          <p class="text-[10px] text-rosefemme-600 font-mono mb-2">🔍 Click bottle to inspect details</p>
          <div class="flex items-center justify-center space-x-1.5 text-gold-500 text-xs font-semibold">
            <span class="text-rosefemme-800">4.9★</span>
            <span class="text-sand-400">&bull;</span>
            <span class="text-noir-600">${f.reviewCount.toLocaleString()} Verified Women</span>
          </div>
        </div>

        <!-- Description & Action Column -->
        <div class="lg:col-span-7 space-y-4 text-left">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rosefemme-100/70 text-rosefemme-800 text-[11px] font-semibold tracking-wider">
            <span>✨ Your Matched Daily Ritual</span>
          </div>
          <h3 class="font-serif text-3xl font-bold text-noir-900">${f.fullName}</h3>
          <p class="text-xs sm:text-sm text-noir-600 font-light leading-relaxed">${f.subtitle}</p>

          <div class="space-y-2.5 pt-2 border-t border-rosefemme-200/60">
            ${f.benefits.map(b => `
              <div class="flex items-start gap-2.5 text-xs text-noir-800">
                <div class="w-4 h-4 rounded-full bg-rosefemme-100 text-rosefemme-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i data-lucide="check" class="w-3 h-3 stroke-[3]"></i>
                </div>
                <span class="leading-relaxed">${b}</span>
              </div>
            `).join('')}
          </div>

          <div class="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <div>
              <span class="text-2xl font-bold text-noir-900 price-display" data-usd="${f.price}">
                ${CurrencyEngine.format(f.price)}
              </span>
              <span class="text-xs text-noir-500 line-through ml-1.5 original-price-display" data-usd="${f.originalPrice}">
                ${CurrencyEngine.format(f.originalPrice)}
              </span>
              <span class="block text-[10px] text-emerald-700 font-semibold mt-0.5">Free Discreet Shipping Eligible</span>
            </div>
            
            <button onclick="CartModule.addItem('${f.id}', '${f.fullName}', ${f.price}, '${f.image}')" class="btn-rosegold w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Add Matched Ritual to Bag</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.safeCreateIcons) window.safeCreateIcons();
    if (window.ImageLightbox) window.ImageLightbox.init();
  }

  return {
    init,
    switchTab
  };
})();
