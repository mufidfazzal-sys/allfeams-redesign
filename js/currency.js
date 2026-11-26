/**
 * ALLFEAMS™ - Multi-Currency Engine
 * File: js/currency.js
 * 
 * Edit exchange rates or add new currencies (e.g. AUD, SGD, CAD) here.
 */

const CurrencyEngine = (function() {
  const rates = {
    USD: { rate: 1.0, symbol: '$', suffix: '', decimals: 2 },
    IDR: { rate: 15850, symbol: 'Rp ', suffix: '', decimals: 0 },
    EUR: { rate: 0.95, symbol: '€', suffix: '', decimals: 2 },
    GBP: { rate: 0.80, symbol: '£', suffix: '', decimals: 2 }
  };

  let currentCurrency = localStorage.getItem('allfeams_currency') || 'USD';

  function init() {
    const select = document.getElementById('currency-select');
    if (select) {
      select.value = currentCurrency;
      select.addEventListener('change', (e) => {
        setCurrency(e.target.value);
      });
    }
    updateAllPrices();
  }

  function setCurrency(newCurrency) {
    if (!rates[newCurrency]) return;
    currentCurrency = newCurrency;
    localStorage.setItem('allfeams_currency', currentCurrency);
    updateAllPrices();
    
    // Dispatch event so cart drawer and formula card update
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: currentCurrency } }));
  }

  function format(usdAmount) {
    const config = rates[currentCurrency] || rates.USD;
    const converted = usdAmount * config.rate;
    if (config.decimals === 0) {
      return `${config.symbol}${Math.round(converted).toLocaleString('id-ID')}${config.suffix}`;
    } else {
      return `${config.symbol}${converted.toFixed(config.decimals)}${config.suffix}`;
    }
  }

  function updateAllPrices() {
    document.querySelectorAll('.price-display').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-usd'));
      if (!isNaN(usd)) {
        el.textContent = format(usd);
      }
    });

    document.querySelectorAll('.original-price-display').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-usd'));
      if (!isNaN(usd)) {
        el.textContent = format(usd);
      }
    });
  }

  function getCurrent() {
    return currentCurrency;
  }

  return {
    init,
    format,
    setCurrency,
    getCurrent,
    updateAllPrices
  };
})();
