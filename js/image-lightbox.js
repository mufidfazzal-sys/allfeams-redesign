/**
 * ALLFEAMS™ - Luxury Product Image Zoom & Lightbox (Bulletproof Visibility)
 * File: js/image-lightbox.js
 */

const ImageLightbox = (function() {
  let modal = null;
  let imgEl = null;
  let titleEl = null;
  let subtitleEl = null;
  let priceBadgeEl = null;
  let addBtnEl = null;
  let prevBtn = null;
  let nextBtn = null;
  let counterEl = null;

  let currentGallery = [];
  let currentIndex = 0;
  let isZoomed = false;

  const productMeta = {
    'flora': {
      title: 'Advanced Flora+ Vaginal Support',
      subtitle: 'Targeted Probiotics & Cranberry PACs for Complete Odor & pH Balance',
      price: 34.95,
      id: 'flora',
      defaultImg: 'assets/Advanced.jpg'
    },
    'harmony': {
      title: 'Harmony+ Ovarian Support',
      subtitle: '40:1 Myo & D-Chiro Inositol for Hormonal Rhythm & Cycle Predictability',
      price: 34.95,
      id: 'harmony',
      defaultImg: 'assets/Harmony+.jpg'
    },
    'flatfeams': {
      title: 'FlatFeams Daily Digestive Bloat Support',
      subtitle: 'Botanical Digestive Enzymes & Dandelion Root for Overnight Flat Tummy',
      price: 34.95,
      id: 'flatfemme',
      defaultImg: 'assets/Flatfeams.jpg'
    },
    'bundles': {
      title: 'ALLFEAMS™ Curated 3-Pack Ritual',
      subtitle: 'Flora+ • Harmony+ • FlatFeams Inside-Out Transformation System',
      price: 84.95,
      id: 'bundle-trio',
      defaultImg: 'assets/all-variants.jpg'
    }
  };

  function init() {
    createModalDOM();
    bindZoomableImages();
    setupKeyboard();
  }

  function createModalDOM() {
    if (document.getElementById('allfeams-lightbox')) {
      modal = document.getElementById('allfeams-lightbox');
      imgEl = document.getElementById('lightbox-image');
      titleEl = document.getElementById('lightbox-title');
      subtitleEl = document.getElementById('lightbox-subtitle');
      priceBadgeEl = document.getElementById('lightbox-price');
      addBtnEl = document.getElementById('lightbox-add-btn');
      prevBtn = document.getElementById('lightbox-prev-btn');
      nextBtn = document.getElementById('lightbox-next-btn');
      counterEl = document.getElementById('lightbox-counter');
      return;
    }

    const modalHTML = [
      '<div id="allfeams-lightbox" style="display: none; position: fixed; inset: 0; z-index: 99999; background: rgba(18, 12, 11, 0.94); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); align-items: center; justify-content: center; padding: 16px;" role="dialog" aria-modal="true" aria-label="Product Image Zoom">',
      '  <div id="lightbox-card" style="position: relative; max-width: 900px; width: 100%; max-height: 92vh; background: #1C1413; border-radius: 24px; border: 1px solid rgba(210, 158, 145, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.85); overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">',
      '    <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #241817; border-bottom: 1px solid rgba(210, 158, 145, 0.25);">',
      '      <div style="display: flex; align-items: center; gap: 8px;">',
      '        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #C07C6E;"></span>',
      '        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #E4BFB5; font-family: monospace;">ALLFEAMS™ High-Res Zoom</span>',
      '        <span id="lightbox-counter" style="font-size: 10px; color: #AA6557; margin-left: 6px; font-family: monospace;"></span>',
      '      </div>',
      '      <button id="lightbox-close-btn" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(210, 158, 145, 0.3); border-radius: 9999px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: #E4BFB5; cursor: pointer; transition: background 0.2s;" aria-label="Close Image Zoom">',
      '        <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
      '      </button>',
      '    </div>',
      '    <div style="position: relative; flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; min-height: 280px; max-height: 68vh; background: #140E0D; overflow: hidden;">',
      '      <button id="lightbox-prev-btn" style="display: none; position: absolute; left: 16px; z-index: 10; width: 42px; height: 42px; border-radius: 9999px; background: rgba(29, 21, 20, 0.85); border: 1px solid rgba(210, 158, 145, 0.4); color: white; cursor: pointer; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);" aria-label="Previous Image">',
      '        <svg style="width: 20px; height: 20px; margin: auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>',
      '      </button>',
      '      <img id="lightbox-image" src="" alt="Product Detail" style="max-height: 62vh; max-width: 84vw; width: auto; height: auto; object-fit: contain; border-radius: 14px; box-shadow: 0 15px 35px rgba(0,0,0,0.6); cursor: zoom-in; transition: transform 0.3s ease; display: block; margin: 0 auto;">',
      '      <button id="lightbox-next-btn" style="display: none; position: absolute; right: 16px; z-index: 10; width: 42px; height: 42px; border-radius: 9999px; background: rgba(29, 21, 20, 0.85); border: 1px solid rgba(210, 158, 145, 0.4); color: white; cursor: pointer; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);" aria-label="Next Image">',
      '        <svg style="width: 20px; height: 20px; margin: auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>',
      '      </button>',
      '      <div id="lightbox-zoom-hint" style="position: absolute; bottom: 12px; right: 16px; background: rgba(0,0,0,0.65); border: 1px solid rgba(210, 158, 145, 0.3); color: #E4BFB5; font-size: 10px; padding: 4px 10px; border-radius: 9999px; pointer-events: none; display: flex; align-items: center; gap: 4px;">',
      '        <span>🔍 Klik gambar untuk zoom 140%</span>',
      '      </div>',
      '    </div>',
      '    <div style="padding: 14px 20px; background: #221716; border-top: 1px solid rgba(210, 158, 145, 0.25); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">',
      '      <div style="text-align: left;">',
      '        <div style="display: flex; align-items: center; gap: 8px;">',
      '          <h4 id="lightbox-title" style="font-family: Cormorant Garamond, Georgia, serif; font-size: 18px; font-weight: bold; color: #FFFFFF; margin: 0;">Product Formula</h4>',
      '          <span id="lightbox-price" style="font-size: 11px; font-weight: 600; background: rgba(143, 78, 65, 0.6); color: #F9ECE8; border: 1px solid #8F4E41; padding: 2px 8px; border-radius: 9999px;">$34.95</span>',
      '        </div>',
      '        <p id="lightbox-subtitle" style="font-size: 11px; color: #E4BFB5; margin: 2px 0 0 0; font-weight: 300;">Doctor Formulated • 100% Hormone-Free</p>',
      '      </div>',
      '      <div>',
      '        <button id="lightbox-add-btn" class="btn-rosegold" style="padding: 8px 22px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; border: none; display: flex; align-items: center; gap: 6px;">',
      '          <span>Add to Bag</span>',
      '        </button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    modal = document.getElementById('allfeams-lightbox');
    imgEl = document.getElementById('lightbox-image');
    titleEl = document.getElementById('lightbox-title');
    subtitleEl = document.getElementById('lightbox-subtitle');
    priceBadgeEl = document.getElementById('lightbox-price');
    addBtnEl = document.getElementById('lightbox-add-btn');
    prevBtn = document.getElementById('lightbox-prev-btn');
    nextBtn = document.getElementById('lightbox-next-btn');
    counterEl = document.getElementById('lightbox-counter');

    document.getElementById('lightbox-close-btn').addEventListener('click', close);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) close();
    });

    imgEl.addEventListener('click', toggleZoom);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
  }

  function bindZoomableImages() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      const src = img.getAttribute('src') || '';
      if (src.includes('logo') || src.includes('icon') || img.classList.contains('no-zoom')) {
        return;
      }

      const srcLower = src.toLowerCase();
      const isProductImg = srcLower.includes('advanced') ||
                           srcLower.includes('harmony') ||
                           srcLower.includes('flatfeam') ||
                           srcLower.includes('all-variant') ||
                           srcLower.includes('all varian') ||
                           srcLower.includes('wa ') ||
                           img.hasAttribute('data-zoomable') ||
                           img.classList.contains('product-image');

      if (isProductImg) {
        img.classList.add('cursor-zoom-in');
        if (!img.getAttribute('title')) {
          img.setAttribute('title', 'Klik untuk memperbesar gambar');
        }
        
        if (!img.hasAttribute('data-lightbox-bound')) {
          img.setAttribute('data-lightbox-bound', 'true');
          img.addEventListener('click', function(e) {
            // If image is inside a thumbnail strip, let thumbnail handler work too
            if (img.classList.contains('cursor-pointer') && img.hasAttribute('onclick')) {
              // thumbnail handler handles on-page swap
            } else {
              e.stopPropagation();
              buildAndOpenGallery(img);
            }
          });
        }
      }
    });
  }

  function buildAndOpenGallery(clickedImg) {
    const clickedSrc = clickedImg.getAttribute('src');
    const container = clickedImg.closest('section') || clickedImg.closest('.grid') || clickedImg.closest('main') || document;
    
    const relatedImgs = Array.from(container.querySelectorAll('img')).filter(function(img) {
      const s = (img.getAttribute('src') || '').toLowerCase();
      return s.includes('advanced') || s.includes('harmony') || s.includes('flatfeam') || s.includes('varian');
    });

    if (relatedImgs.length > 1) {
      currentGallery = relatedImgs.map(function(img) {
        return {
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt') || 'ALLFEAMS™ Product View'
        };
      });
      currentIndex = currentGallery.findIndex(function(item) {
        return item.src === clickedSrc;
      });
      if (currentIndex === -1) currentIndex = 0;
    } else {
      currentGallery = [{
        src: clickedSrc,
        alt: clickedImg.getAttribute('alt') || 'ALLFEAMS™ Product View'
      }];
      currentIndex = 0;
    }

    renderCurrentSlide();
    open();
  }

  function renderCurrentSlide() {
    if (!currentGallery[currentIndex]) return;
    const item = currentGallery[currentIndex];

    isZoomed = false;
    imgEl.style.transform = 'scale(1)';
    imgEl.style.cursor = 'zoom-in';

    imgEl.src = item.src;
    imgEl.alt = item.alt;

    const srcLower = item.src.toLowerCase();
    let detectedKey = 'flora';
    if (srcLower.includes('harmony')) detectedKey = 'harmony';
    else if (srcLower.includes('flatfeam')) detectedKey = 'flatfeams';
    else if (srcLower.includes('all-variant') || srcLower.includes('all varian')) detectedKey = 'bundles';

    const meta = productMeta[detectedKey] || productMeta.flora;
    titleEl.textContent = item.alt && item.alt.length > 5 ? item.alt : meta.title;
    subtitleEl.textContent = meta.subtitle;
    priceBadgeEl.textContent = '$' + meta.price.toFixed(2);

    addBtnEl.onclick = function() {
      if (typeof quickAddProduct === 'function') {
        quickAddProduct(meta.id, meta.title, meta.price, meta.defaultImg);
      } else if (window.CartModule && typeof CartModule.addItem === 'function') {
        CartModule.addItem(meta.id, meta.title, meta.price, meta.defaultImg);
      }
      close();
    };

    if (currentGallery.length > 1) {
      counterEl.textContent = '(' + (currentIndex + 1) + '/' + currentGallery.length + ')';
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      counterEl.textContent = '';
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  function prevImage() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    renderCurrentSlide();
  }

  function nextImage() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    renderCurrentSlide();
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    if (isZoomed) {
      imgEl.style.transform = 'scale(1.4)';
      imgEl.style.cursor = 'zoom-out';
    } else {
      imgEl.style.transform = 'scale(1)';
      imgEl.style.cursor = 'zoom-in';
    }
  }

  function open() {
    if (!modal) createModalDOM();
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    isZoomed = false;
    if (imgEl) imgEl.style.transform = 'scale(1)';
  }

  function setupKeyboard() {
    window.addEventListener('keydown', function(e) {
      if (!modal || modal.style.display === 'none') return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init: init,
    openImage: function(src, alt) {
      currentGallery = [{ src: src, alt: alt || 'ALLFEAMS™ Product View' }];
      currentIndex = 0;
      renderCurrentSlide();
      open();
    },
    close: close
  };
})();

// Expose globally
window.ImageLightbox = ImageLightbox;
window.openLightbox = function(src, alt) {
  if (window.ImageLightbox && window.ImageLightbox.openImage) {
    window.ImageLightbox.openImage(src, alt);
  }
};
