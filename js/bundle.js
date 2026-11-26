/**
 * ALLFEAMS™ - Bundle & Save Module
 * File: js/bundle.js
 * 
 * Manages formula selection for bundles and multi-bottle discounts.
 */

const BundleModule = (function() {
  let selectedFormula = {
    key: 'flora',
    name: 'Flora+ (Vaginal Flora & Odor)',
    image: 'assets/Advanced.jpg'
  };

  function selectFormula(key) {
    const prod = ALLFEAMS_PRODUCTS[key];
    if (!prod) return;

    selectedFormula.key = key;
    selectedFormula.name = prod.fullName;
    selectedFormula.image = prod.image;

    document.querySelectorAll('.bundle-formula-btn').forEach(btn => {
      btn.classList.remove('bg-gold-500', 'text-noir-900');
      btn.classList.add('text-sand-300');
    });

    const activeBtn = document.getElementById(`b-form-${key}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-gold-500', 'text-noir-900');
      activeBtn.classList.remove('text-sand-300');
    }

    UIInteractions.showToast('Formula Selected', `Bundle configured for ${prod.name}`);
  }

  function addTier(tierKey) {
    const tier = ALLFEAMS_BUNDLES[tierKey];
    if (!tier) return;
    CartModule.addBundle(tier.bottles, tier.totalUsd, selectedFormula);
  }

  return {
    selectFormula,
    addTier
  };
})();
