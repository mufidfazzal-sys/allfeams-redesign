/**
 * ALLFEAMS™ - Executive Admin Dashboard Logic
 * File: admin/admin.js
 */

const AdminApp = (function() {
  // Initial Sample Orders
  const DEFAULT_ORDERS = [
    {
      id: "ALF-9482",
      customer: "Eleanor Vance",
      email: "eleanor.v@gmail.com",
      phone: "+1 (512) 849-2104",
      items: [
        { name: "Advanced Flora+ Vaginal Support", qty: 2, price: 34.95 }
      ],
      total: 69.90,
      date: "Today, 14:22",
      paymentStatus: "Paid",
      paymentMethod: "Apple Pay",
      fulfillmentStatus: "Unfulfilled",
      discreetBox: true,
      address: "742 Evergreen Terrace, Austin, TX 78701",
      tracking: ""
    },
    {
      id: "ALF-9481",
      customer: "Maya Patel",
      email: "maya.patel@outlook.com",
      phone: "+1 (206) 714-9923",
      items: [
        { name: "90-Day Reset Bundle (3 Bottles - Flora+)", qty: 1, price: 74.85 }
      ],
      total: 74.85,
      date: "Today, 11:05",
      paymentStatus: "Paid",
      paymentMethod: "Visa ending in 4242",
      fulfillmentStatus: "Discreet Packaged",
      discreetBox: true,
      address: "1208 Pine St, Seattle, WA 98101",
      tracking: "USPS-94001118992231"
    },
    {
      id: "ALF-9480",
      customer: "Sarah Jenkins",
      email: "sarah.j@icloud.com",
      phone: "+1 (305) 554-1928",
      items: [
        { name: "FlatFeams Daily Craving & Debloat", qty: 1, price: 34.95 },
        { name: "Harmony+ Ovarian Support Capsules", qty: 1, price: 34.95 }
      ],
      total: 62.91, // with 10% HARMONY10
      date: "Yesterday, 19:40",
      paymentStatus: "Paid",
      paymentMethod: "Shop Pay",
      fulfillmentStatus: "Shipped",
      discreetBox: true,
      address: "450 Ocean Dr, Miami Beach, FL 33139",
      tracking: "FEDEX-78291049281"
    },
    {
      id: "ALF-9479",
      customer: "Clara Beauchamp",
      email: "clara.b@yahoo.com",
      phone: "+1 (415) 890-4412",
      items: [
        { name: "Ultimate Balance Bundle (6 Bottles)", qty: 1, price: 131.70 }
      ],
      total: 131.70,
      date: "Yesterday, 15:10",
      paymentStatus: "Paid",
      paymentMethod: "Mastercard ending in 8112",
      fulfillmentStatus: "Shipped",
      discreetBox: true,
      address: "880 Market St, San Francisco, CA 94102",
      tracking: "DHL-4819203912"
    },
    {
      id: "ALF-9478",
      customer: "Diana Rossi",
      email: "diana.rossi@gmail.com",
      phone: "+1 (619) 332-9011",
      items: [
        { name: "Advanced Flora+ Vaginal Support", qty: 1, price: 34.95 }
      ],
      total: 34.95,
      date: "17 Nov 2026",
      paymentStatus: "Paid",
      paymentMethod: "Google Pay",
      fulfillmentStatus: "Delivered",
      discreetBox: true,
      address: "210 Coronado Ave, San Diego, CA 92118",
      tracking: "USPS-94001118991104"
    }
  ];

  const DEFAULT_PROMOS = [
    { code: "HARMONY10", discountPercent: 10, type: "Percentage", usageCount: 148, active: true },
    { code: "RESET20", discountPercent: 20, type: "VIP Tier", usageCount: 42, active: true },
    { code: "FREESHIP", discountPercent: 0, type: "Free Shipping", usageCount: 312, active: true }
  ];

  let orders = [];
  let promos = [];
  let currentTab = 'overview';
  let currentCmsPage = 'home';
  let cmsDraft = null;
  let memoryAuthed = false;

  function isSessionAuthed() {
    if (memoryAuthed) return true;
    try {
      return sessionStorage.getItem('allfeams_admin_logged') === 'true';
    } catch (e) {
      return false;
    }
  }

  function setSessionAuthed(val) {
    memoryAuthed = !!val;
    try {
      if (val) {
        sessionStorage.setItem('allfeams_admin_logged', 'true');
      } else {
        sessionStorage.removeItem('allfeams_admin_logged');
      }
    } catch (e) {}
  }

  function init() {
    loadData();
    if (window.CMSEngine) {
      cmsDraft = CMSEngine.getContent();
      CMSEngine.apply();
      window.addEventListener('cmsPublishedLoaded', (e) => {
        if (e && e.detail) {
          cmsDraft = e.detail;
          renderProductsTable();
          renderReviewsTable();
          renderCmsEditor();
        }
      });
    }
    checkAuth();
    setupNavigation();
    renderOverview();
    renderOrdersTable();
    renderProductsTable();
    renderPromosTable();
    renderReviewsTable();
    renderCmsEditor();
  }

  function loadData() {
    try {
      const savedOrders = localStorage.getItem('allfeams_admin_orders');
      orders = savedOrders ? JSON.parse(savedOrders) : DEFAULT_ORDERS;

      const savedPromos = localStorage.getItem('allfeams_admin_promos');
      promos = savedPromos ? JSON.parse(savedPromos) : DEFAULT_PROMOS;
    } catch (e) {
      orders = DEFAULT_ORDERS;
      promos = DEFAULT_PROMOS;
    }
  }

  function saveOrders() {
    try {
      localStorage.setItem('allfeams_admin_orders', JSON.stringify(orders));
    } catch (e) {}
  }

  function savePromos() {
    try {
      localStorage.setItem('allfeams_admin_promos', JSON.stringify(promos));
    } catch (e) {}
  }

  // Authentication check
  function checkAuth() {
    const isAuthed = isSessionAuthed();
    const lockScreen = document.getElementById('admin-lock-screen');
    const mainDashboard = document.getElementById('admin-main-dashboard');

    if (isAuthed) {
      if (lockScreen) lockScreen.classList.add('hidden');
      if (mainDashboard) mainDashboard.classList.remove('hidden');
      if (window.safeCreateIcons) window.safeCreateIcons();
    } else {
      if (lockScreen) lockScreen.classList.remove('hidden');
      if (mainDashboard) mainDashboard.classList.add('hidden');
    }
  }

  function login(pin) {
    const cleanPin = (pin || '').trim().toLowerCase();
    if (cleanPin === '8888' || cleanPin === 'admin' || !cleanPin) {
      setSessionAuthed(true);
      checkAuth();
      return true;
    } else {
      alert('Incorrect security passcode. (Default: 8888)');
      return false;
    }
  }

  function logout() {
    setSessionAuthed(false);
    checkAuth();
  }

  // Navigation Tabs Switcher
  function setupNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        switchTab(target);
      });
    });
  }

  function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      if (b.getAttribute('data-tab') === tabId) {
        b.classList.add('bg-gold-500/15', 'text-gold-400', 'border-gold-500');
        b.classList.remove('text-sand-400', 'border-transparent');
      } else {
        b.classList.remove('bg-gold-500/15', 'text-gold-400', 'border-gold-500');
        b.classList.add('text-sand-400', 'border-transparent');
      }
    });

    document.querySelectorAll('.admin-tab-content').forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });

    if (window.safeCreateIcons) window.safeCreateIcons();
  }

  // Overview Tab Calculations
  function renderOverview() {
    const totalRev = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderVal = orders.length > 0 ? (totalRev / orders.length) : 0;
    const pendingOrdersCount = orders.filter(o => o.fulfillmentStatus === 'Unfulfilled' || o.fulfillmentStatus === 'Discreet Packaged').length;

    const revEl = document.getElementById('stat-total-revenue');
    const ordersEl = document.getElementById('stat-total-orders');
    const aovEl = document.getElementById('stat-aov');
    const pendingEl = document.getElementById('stat-pending-orders');

    if (revEl) revEl.textContent = `$${totalRev.toFixed(2)}`;
    if (ordersEl) ordersEl.textContent = orders.length.toString();
    if (aovEl) aovEl.textContent = `$${avgOrderVal.toFixed(2)}`;
    if (pendingEl) pendingEl.textContent = pendingOrdersCount.toString();

    // Render Recent Orders in Overview
    const recentTable = document.getElementById('overview-recent-orders');
    if (recentTable) {
      recentTable.innerHTML = orders.slice(0, 4).map(o => `
        <tr class="border-b border-sand-300/10 hover:bg-white/[0.02] transition">
          <td class="py-3 px-4 text-xs font-mono font-bold text-gold-400">${o.id}</td>
          <td class="py-3 px-4 text-xs text-white">${o.customer}</td>
          <td class="py-3 px-4 text-xs text-sand-300 truncate max-w-[200px]">${o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</td>
          <td class="py-3 px-4 text-xs font-bold text-white">$${o.total.toFixed(2)}</td>
          <td class="py-3 px-4">
            <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(o.fulfillmentStatus)}">
              ${o.fulfillmentStatus}
            </span>
          </td>
          <td class="py-3 px-4 text-right">
            <button onclick="AdminApp.viewOrder('${o.id}')" class="text-xs text-gold-400 hover:text-white underline">Inspect</button>
          </td>
        </tr>
      `).join('');
    }
  }

  function getStatusBadgeClass(status) {
    if (status === 'Delivered') return 'badge-paid';
    if (status === 'Shipped') return 'badge-shipped';
    if (status === 'Discreet Packaged') return 'badge-discreet';
    return 'badge-pending';
  }

  // Orders Tab
  function renderOrdersTable(filterQuery = '', filterStatus = 'all') {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;

    let filtered = orders;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.fulfillmentStatus.toLowerCase().includes(filterStatus.toLowerCase()));
    }
    if (filterQuery.trim() !== '') {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customer.toLowerCase().includes(q) || 
        o.email.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-sand-400 text-xs">No orders matching criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(o => `
      <tr class="border-b border-sand-300/10 hover:bg-white/[0.02] transition">
        <td class="py-3 px-4 text-xs font-mono font-bold text-gold-400">${o.id}</td>
        <td class="py-3 px-4">
          <div class="text-xs font-semibold text-white">${o.customer}</div>
          <div class="text-[10px] text-sand-400">${o.email}</div>
        </td>
        <td class="py-3 px-4 text-xs text-sand-300">
          ${o.items.map(i => `<span class="block">${i.qty}x ${i.name}</span>`).join('')}
        </td>
        <td class="py-3 px-4 text-xs font-bold text-white">$${o.total.toFixed(2)}</td>
        <td class="py-3 px-4">
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(o.fulfillmentStatus)}">
            ${o.fulfillmentStatus}
          </span>
          ${o.discreetBox ? '<span class="text-[9px] block text-gold-500 mt-1">✓ 100% Plain Box</span>' : ''}
        </td>
        <td class="py-3 px-4 text-xs text-sand-400 font-mono">
          ${o.tracking || '<span class="text-sand-500 italic">No tracking yet</span>'}
        </td>
        <td class="py-3 px-4 text-right space-x-2">
          <button onclick="AdminApp.viewOrder('${o.id}')" class="px-2.5 py-1 bg-noir-800 hover:bg-gold-500 hover:text-noir-900 text-sand-200 rounded text-xs transition">Details</button>
          <button onclick="AdminApp.markShipped('${o.id}')" class="px-2.5 py-1 bg-gold-500/20 hover:bg-gold-500 hover:text-noir-900 text-gold-300 rounded text-xs transition">Ship</button>
        </td>
      </tr>
    `).join('');
  }

  function markShipped(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    const tracking = prompt(`Enter tracking number for ${orderId}:`, `USPS-9400${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    if (tracking !== null) {
      o.fulfillmentStatus = 'Shipped';
      o.tracking = tracking;
      saveOrders();
      renderOrdersTable();
      renderOverview();
      alert(`Order ${orderId} marked as Shipped with tracking: ${tracking}`);
    }
  }

  function viewOrder(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;

    const modal = document.getElementById('order-detail-modal');
    const content = document.getElementById('order-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="space-y-4 text-left">
        <div class="flex justify-between border-b border-sand-300/20 pb-3">
          <div>
            <h3 class="text-base font-bold text-white">Order ${o.id}</h3>
            <p class="text-xs text-sand-400">${o.date} &bull; Paid via ${o.paymentMethod}</p>
          </div>
          <span class="text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(o.fulfillmentStatus)} h-fit">
            ${o.fulfillmentStatus}
          </span>
        </div>

        <div class="bg-noir-900/60 p-3.5 rounded-xl border border-sand-300/10">
          <h4 class="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Shipping Information (Discreet Packaging)</h4>
          <p class="text-xs text-white font-medium">${o.customer}</p>
          <p class="text-xs text-sand-300">${o.address}</p>
          <p class="text-xs text-sand-400">${o.email} &bull; ${o.phone}</p>
        </div>

        <div class="border border-sand-300/10 rounded-xl overflow-hidden">
          <table class="w-full text-xs text-left">
            <thead class="bg-noir-900 text-sand-400">
              <tr>
                <th class="p-2.5">Item</th>
                <th class="p-2.5">Qty</th>
                <th class="p-2.5 text-right">Price</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand-300/10 text-white">
              ${o.items.map(i => `
                <tr>
                  <td class="p-2.5">${i.name}</td>
                  <td class="p-2.5">${i.qty}</td>
                  <td class="p-2.5 text-right font-bold">$${(i.price * i.qty).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center text-sm font-bold text-white border-t border-sand-300/20 pt-3">
          <span>Total Paid</span>
          <span class="text-gold-400 text-base">$${o.total.toFixed(2)} USD</span>
        </div>

        <div class="pt-2 flex gap-3">
          <button onclick="AdminApp.printPackingSlip('${o.id}')" class="flex-1 py-2.5 bg-noir-800 hover:bg-noir-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition">
            Print Discreet Packing Slip
          </button>
          <button onclick="AdminApp.markShipped('${o.id}')" class="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-noir-900 rounded-lg text-xs font-bold uppercase tracking-wider transition">
            Update Tracking
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.safeCreateIcons) window.safeCreateIcons();
  }

  function closeOrderModal() {
    const modal = document.getElementById('order-detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  function printPackingSlip(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${o.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; }
            .box-notice { border: 2px dashed #000; padding: 12px; margin-bottom: 24px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="box-notice">
            🔒 DISCREET SHIPMENT PROTOCOL: Enclose in plain kraft carton. Do NOT print product names on outer label.
          </div>
          <h2>ALLFEAMS™ FULFILLMENT PACKING SLIP</h2>
          <p><strong>Order:</strong> ${o.id} &bull; <strong>Date:</strong> ${o.date}</p>
          <p><strong>Ship To:</strong><br>${o.customer}<br>${o.address}<br>${o.phone}</p>
          <table>
            <thead><tr><th>Product Formulation</th><th>Quantity</th></tr></thead>
            <tbody>
              ${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td></tr>`).join('')}
            </tbody>
          </table>
          <p style="margin-top: 40px; font-size: 11px; color: #666;">Verified by ALLFEAMS Quality Assurance. cGMP Certified.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  // Products Tab
  function renderProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody || typeof ALLFEAMS_PRODUCTS === 'undefined') return;

    const list = Object.values(ALLFEAMS_PRODUCTS);
    tableBody.innerHTML = list.map(p => `
      <tr class="border-b border-sand-300/10 hover:bg-white/[0.02] transition">
        <td class="py-3 px-4">
          <div class="flex items-center space-x-3">
            <img src="../${p.image}" alt="${p.name}" class="w-12 h-12 object-cover rounded-xl bg-noir-800 border border-sand-300/10">
            <div>
              <p class="text-xs font-bold text-white">${p.fullName}</p>
              <p class="text-[10px] text-gold-500">${p.category}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 text-xs font-mono font-bold text-white">$${p.price.toFixed(2)}</td>
        <td class="py-3 px-4 text-xs font-mono line-through text-sand-500">$${p.originalPrice.toFixed(2)}</td>
        <td class="py-3 px-4">
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full badge-paid">
            In Stock (450+)
          </span>
        </td>
        <td class="py-3 px-4 text-xs text-sand-300">${p.rating}★ (${p.reviewCount})</td>
        <td class="py-3 px-4 text-right">
          <button onclick="AdminApp.editProductPrice('${p.id}')" class="px-3 py-1 bg-noir-800 hover:bg-gold-500 hover:text-noir-900 text-xs text-sand-200 rounded transition">
            Edit Price
          </button>
        </td>
      </tr>
    `).join('');
  }

  function editProductPrice(id) {
    const p = ALLFEAMS_PRODUCTS[id];
    if (!p) return;
    const newPrice = prompt(`Enter new retail price for ${p.fullName} (USD):`, p.price.toString());
    if (newPrice && !isNaN(parseFloat(newPrice))) {
      const parsed = parseFloat(newPrice);
      p.price = parsed;
      if (cmsDraft && cmsDraft.products && cmsDraft.products[id]) {
        cmsDraft.products[id].price = parsed;
        if (window.CMSEngine) {
          CMSEngine.saveContent(cmsDraft);
          CMSEngine.apply();
        }
      }
      renderProductsTable();
      if (currentCmsPage === 'collection') renderCmsEditor();
      alert(`Updated price for ${p.fullName} to $${p.price.toFixed(2)}`);
    }
  }

  // Promos Tab
  function renderPromosTable() {
    const tableBody = document.getElementById('promos-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = promos.map((promo, idx) => `
      <tr class="border-b border-sand-300/10 hover:bg-white/[0.02] transition">
        <td class="py-3 px-4 text-xs font-mono font-bold text-gold-400">${promo.code}</td>
        <td class="py-3 px-4 text-xs text-white">${promo.discountPercent}% Off</td>
        <td class="py-3 px-4 text-xs text-sand-300">${promo.type}</td>
        <td class="py-3 px-4 text-xs font-mono text-sand-400">${promo.usageCount} times</td>
        <td class="py-3 px-4">
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${promo.active ? 'badge-paid' : 'badge-pending'}">
            ${promo.active ? 'Active' : 'Disabled'}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="AdminApp.togglePromo(${idx})" class="px-2.5 py-1 text-xs text-sand-300 hover:text-white underline">
            ${promo.active ? 'Disable' : 'Enable'}
          </button>
          <button onclick="AdminApp.deletePromo(${idx})" class="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 ml-2">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  function togglePromo(index) {
    if (promos[index]) {
      promos[index].active = !promos[index].active;
      savePromos();
      renderPromosTable();
    }
  }

  function deletePromo(index) {
    if (confirm(`Delete promo code ${promos[index].code}?`)) {
      promos.splice(index, 1);
      savePromos();
      renderPromosTable();
    }
  }

  function createPromo() {
    const code = prompt("Enter new promo code (e.g. VIP25):");
    if (!code) return;
    const discount = prompt("Enter discount percentage (e.g. 25 for 25%):", "20");
    if (discount && !isNaN(parseInt(discount))) {
      promos.push({
        code: code.trim().toUpperCase(),
        discountPercent: parseInt(discount),
        type: "Custom Campaign",
        usageCount: 0,
        active: true
      });
      savePromos();
      renderPromosTable();
      alert(`Promo code ${code.toUpperCase()} created successfully!`);
    }
  }

  // Reviews Tab
  function renderReviewsTable() {
    const tableBody = document.getElementById('reviews-table-body');
    if (!tableBody) return;
    const list = (cmsDraft && Array.isArray(cmsDraft.reviewsList))
      ? cmsDraft.reviewsList
      : (typeof ALLFEAMS_REVIEWS !== 'undefined' ? ALLFEAMS_REVIEWS : []);

    tableBody.innerHTML = list.map((r, idx) => `
      <tr class="border-b border-sand-300/10 hover:bg-white/[0.02] transition">
        <td class="py-3 px-4">
          <span class="text-xs font-bold text-white block">${escapeHtml(r.author)}, ${escapeHtml(r.age)}</span>
          <span class="text-[10px] text-sand-400">${escapeHtml(r.location)}</span>
        </td>
        <td class="py-3 px-4 text-xs text-gold-500 font-semibold">${r.rating}★ (${escapeHtml((r.tag || '').toUpperCase())})</td>
        <td class="py-3 px-4 text-xs text-sand-200 italic max-w-sm">"${escapeHtml(r.quote)}"</td>
        <td class="py-3 px-4 text-xs text-gold-400">${escapeHtml(r.productUsed)}</td>
        <td class="py-3 px-4 text-right space-x-2">
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full badge-paid">Published</span>
          <button type="button" onclick="AdminApp.switchTab('cms'); AdminApp.selectCmsPage('reviews');" class="text-xs text-gold-400 hover:text-white underline ml-2">Edit in CMS</button>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // UNIVERSAL MULTI-PAGE CMS EDITOR
  // =========================================================================
  const CMS_PAGE_URLS = {
    home: '../index.html',
    collection: '../collection.html',
    matcher: '../formula-matcher.html',
    stories: '../stories.html',
    science: '../science.html',
    reviews: '../reviews.html',
    faq: '../faq.html',
    global: '../index.html'
  };

  const CMS_SECTIONS = {
    home: [
      {
        title: 'Hero Section (Bagian Atas Home)',
        fields: [
          { path: 'home.heroBadgeRating', label: 'Badge Rating' },
          { path: 'home.heroBadgeCount', label: 'Badge Jumlah Pelanggan' },
          { path: 'home.heroHeadlineHtml', label: 'Headline Utama (Bisa HTML)', type: 'textarea' },
          { path: 'home.heroSubtitleHtml', label: 'Subheadline Hero (Bisa HTML)', type: 'textarea' },
          { path: 'home.heroPrimaryCta', label: 'Tombol CTA Utama' },
          { path: 'home.heroSecondaryCta', label: 'Tombol CTA Kedua' }
        ]
      },
      {
        title: 'Hero Product Card Showcase',
        fields: [
          { path: 'home.heroCardBadge', label: 'Badge Kartu Produk' },
          { path: 'home.heroCardTag', label: 'Tag Kanan Atas' },
          { path: 'home.heroCardImage', label: 'Path Gambar Produk Hero' },
          { path: 'home.heroStatPercent', label: 'Angka Statistik (%)' },
          { path: 'home.heroStatLabel', label: 'Label Statistik' },
          { path: 'home.heroStatSub', label: 'Sublabel Statistik' },
          { path: 'home.heroCardTitle', label: 'Judul Produk Hero' },
          { path: 'home.heroCardSubtitle', label: 'Subjudul Produk Hero' }
        ]
      },
      {
        title: 'Spotlight, Banner & Manifesto Home',
        fields: [
          { path: 'home.spotlightEyebrow', label: 'Eyebrow Koleksi' },
          { path: 'home.spotlightTitle', label: 'Judul Koleksi Utama' },
          { path: 'home.spotlightSubtitle', label: 'Subjudul Koleksi', type: 'textarea' },
          { path: 'home.bannerEyebrow', label: 'Eyebrow Banner Konsultasi' },
          { path: 'home.bannerTitle', label: 'Judul Banner Konsultasi' },
          { path: 'home.bannerDesc', label: 'Deskripsi Banner Konsultasi', type: 'textarea' },
          { path: 'home.bannerCta', label: 'Tombol Banner Konsultasi' },
          { path: 'home.manifestoEyebrow', label: 'Eyebrow Manifesto' },
          { path: 'home.manifestoTitle', label: 'Judul Manifesto' },
          { path: 'home.manifestoDesc', label: 'Deskripsi Manifesto', type: 'textarea' },
          { path: 'home.stat1Val', label: 'Statistik 1 Angka' },
          { path: 'home.stat1Label', label: 'Statistik 1 Label' },
          { path: 'home.stat2Val', label: 'Statistik 2 Angka' },
          { path: 'home.stat2Label', label: 'Statistik 2 Label' },
          { path: 'home.stat3Val', label: 'Statistik 3 Angka' },
          { path: 'home.stat3Label', label: 'Statistik 3 Label' }
        ]
      },
      {
        title: 'Testimoni & Jaminan Privasi Home',
        fields: [
          { path: 'home.testimonialRating', label: 'Rating Testimoni' },
          { path: 'home.testimonialTitle', label: 'Judul Kutipan Testimoni' },
          { path: 'home.testimonialQuote', label: 'Isi Kutipan Testimoni', type: 'textarea' },
          { path: 'home.testimonialAuthor', label: 'Nama & Kota Penulis' },
          { path: 'home.testimonialProduct', label: 'Produk yang Digunakan' },
          { path: 'home.shippingTitle', label: 'Judul Kartu Pengiriman Rahasia' },
          { path: 'home.shippingDesc', label: 'Deskripsi Pengiriman Rahasia', type: 'textarea' },
          { path: 'home.guaranteeTitle', label: 'Judul Kartu Garansi 60 Hari' },
          { path: 'home.guaranteeDesc', label: 'Deskripsi Garansi 60 Hari', type: 'textarea' }
        ]
      }
    ],
    collection: [
      {
        title: 'Header Halaman Collection & Bundle',
        fields: [
          { path: 'collection.heroBadge', label: 'Badge Header' },
          { path: 'collection.heroTitle', label: 'Judul Halaman Collection' },
          { path: 'collection.heroSubtitle', label: 'Subjudul Collection', type: 'textarea' },
          { path: 'collection.bundleBadge', label: 'Badge Section Bundle' },
          { path: 'collection.bundleTitle', label: 'Judul Section Bundle' },
          { path: 'collection.bundleDesc', label: 'Deskripsi Bundle', type: 'textarea' },
          { path: 'collection.bundleImage', label: 'Path Gambar Bundle' }
        ]
      },
      {
        title: 'Produk 1: Advanced Flora+',
        fields: [
          { path: 'products.flora.name', label: 'Nama Singkat' },
          { path: 'products.flora.fullName', label: 'Nama Lengkap' },
          { path: 'products.flora.category', label: 'Kategori' },
          { path: 'products.flora.subtitle', label: 'Subjudul Klinis' },
          { path: 'products.flora.description', label: 'Deskripsi Produk', type: 'textarea' },
          { path: 'products.flora.price', label: 'Harga Jual (USD)', type: 'number' },
          { path: 'products.flora.originalPrice', label: 'Harga Coret (USD)', type: 'number' },
          { path: 'products.flora.image', label: 'Path Gambar Utama' }
        ]
      },
      {
        title: 'Produk 2: Harmony+ Ovarian',
        fields: [
          { path: 'products.harmony.name', label: 'Nama Singkat' },
          { path: 'products.harmony.fullName', label: 'Nama Lengkap' },
          { path: 'products.harmony.category', label: 'Kategori' },
          { path: 'products.harmony.subtitle', label: 'Subjudul Klinis' },
          { path: 'products.harmony.description', label: 'Deskripsi Produk', type: 'textarea' },
          { path: 'products.harmony.price', label: 'Harga Jual (USD)', type: 'number' },
          { path: 'products.harmony.originalPrice', label: 'Harga Coret (USD)', type: 'number' },
          { path: 'products.harmony.image', label: 'Path Gambar Utama' }
        ]
      },
      {
        title: 'Produk 3: FlatFeams Daily',
        fields: [
          { path: 'products.flatfemme.name', label: 'Nama Singkat' },
          { path: 'products.flatfemme.fullName', label: 'Nama Lengkap' },
          { path: 'products.flatfemme.category', label: 'Kategori' },
          { path: 'products.flatfemme.subtitle', label: 'Subjudul Klinis' },
          { path: 'products.flatfemme.description', label: 'Deskripsi Produk', type: 'textarea' },
          { path: 'products.flatfemme.price', label: 'Harga Jual (USD)', type: 'number' },
          { path: 'products.flatfemme.originalPrice', label: 'Harga Coret (USD)', type: 'number' },
          { path: 'products.flatfemme.image', label: 'Path Gambar Utama' }
        ]
      },
      {
        title: 'Produk 4: Moisture Max',
        fields: [
          { path: 'products.moisture.name', label: 'Nama Singkat' },
          { path: 'products.moisture.fullName', label: 'Nama Lengkap' },
          { path: 'products.moisture.category', label: 'Kategori' },
          { path: 'products.moisture.subtitle', label: 'Subjudul Klinis' },
          { path: 'products.moisture.description', label: 'Deskripsi Produk', type: 'textarea' },
          { path: 'products.moisture.price', label: 'Harga Jual (USD)', type: 'number' },
          { path: 'products.moisture.originalPrice', label: 'Harga Coret (USD)', type: 'number' },
          { path: 'products.moisture.image', label: 'Path Gambar Utama' }
        ]
      }
    ],
    matcher: [
      {
        title: 'Header & Tab Formula Matcher',
        fields: [
          { path: 'matcher.heroBadge', label: 'Badge Header' },
          { path: 'matcher.heroTitle', label: 'Judul Utama' },
          { path: 'matcher.heroSubtitle', label: 'Subjudul', type: 'textarea' },
          { path: 'matcher.tabFloraTitle', label: 'Tab 1 (Flora+) Judul' },
          { path: 'matcher.tabFloraDesc', label: 'Tab 1 Deskripsi' },
          { path: 'matcher.tabHarmonyTitle', label: 'Tab 2 (Harmony+) Judul' },
          { path: 'matcher.tabHarmonyDesc', label: 'Tab 2 Deskripsi' },
          { path: 'matcher.tabFlatTitle', label: 'Tab 3 (FlatFeams) Judul' },
          { path: 'matcher.tabFlatDesc', label: 'Tab 3 Deskripsi' },
          { path: 'matcher.tabMoistureTitle', label: 'Tab 4 (Moisture Max) Judul' },
          { path: 'matcher.tabMoistureDesc', label: 'Tab 4 Deskripsi' },
          { path: 'matcher.pillar1Title', label: 'Pilar 1 Judul' },
          { path: 'matcher.pillar1Desc', label: 'Pilar 1 Deskripsi', type: 'textarea' },
          { path: 'matcher.pillar2Title', label: 'Pilar 2 Judul' },
          { path: 'matcher.pillar2Desc', label: 'Pilar 2 Deskripsi', type: 'textarea' },
          { path: 'matcher.pillar3Title', label: 'Pilar 3 Judul' },
          { path: 'matcher.pillar3Desc', label: 'Pilar 3 Deskripsi', type: 'textarea' }
        ]
      }
    ],
    stories: [
      {
        title: 'Header Halaman Watch Stories',
        fields: [
          { path: 'stories.heroBadge', label: 'Badge Header' },
          { path: 'stories.heroTitle', label: 'Judul Utama' },
          { path: 'stories.heroSubtitle', label: 'Subjudul', type: 'textarea' }
        ]
      },
      {
        title: 'Video Portrait 1 (Flora+)',
        fields: [
          { path: 'stories.s1Badge', label: 'Label Badge' },
          { path: 'stories.s1Title', label: 'Judul Story 1' },
          { path: 'stories.s1Desc', label: 'Deskripsi Story 1', type: 'textarea' },
          { path: 'stories.s1Video', label: 'Path / URL Video MP4' },
          { path: 'stories.s1Poster', label: 'Path / URL Poster Gambar' }
        ]
      },
      {
        title: 'Video Portrait 2 (Harmony+)',
        fields: [
          { path: 'stories.s2Badge', label: 'Label Badge' },
          { path: 'stories.s2Title', label: 'Judul Story 2' },
          { path: 'stories.s2Desc', label: 'Deskripsi Story 2', type: 'textarea' },
          { path: 'stories.s2Video', label: 'Path / URL Video MP4' },
          { path: 'stories.s2Poster', label: 'Path / URL Poster Gambar' }
        ]
      },
      {
        title: 'Video Portrait 3 (FlatFeams)',
        fields: [
          { path: 'stories.s3Badge', label: 'Label Badge' },
          { path: 'stories.s3Title', label: 'Judul Story 3' },
          { path: 'stories.s3Desc', label: 'Deskripsi Story 3', type: 'textarea' },
          { path: 'stories.s3Video', label: 'Path / URL Video MP4' },
          { path: 'stories.s3Poster', label: 'Path / URL Poster Gambar' }
        ]
      },
      {
        title: 'Video Landscape Explainer (Tab Flora+, Harmony+, FlatFeams)',
        fields: [
          { path: 'stories.expFloraTag', label: 'Flora+ Tag' },
          { path: 'stories.expFloraTitle', label: 'Flora+ Landscape Judul' },
          { path: 'stories.expFloraDesc', label: 'Flora+ Landscape Deskripsi', type: 'textarea' },
          { path: 'stories.expFloraVideo', label: 'Flora+ Landscape Video MP4' },
          { path: 'stories.expFloraPoster', label: 'Flora+ Landscape Poster' },
          { path: 'stories.expHarmonyTag', label: 'Harmony+ Tag' },
          { path: 'stories.expHarmonyTitle', label: 'Harmony+ Landscape Judul' },
          { path: 'stories.expHarmonyDesc', label: 'Harmony+ Landscape Deskripsi', type: 'textarea' },
          { path: 'stories.expHarmonyVideo', label: 'Harmony+ Landscape Video MP4' },
          { path: 'stories.expHarmonyPoster', label: 'Harmony+ Landscape Poster' },
          { path: 'stories.expFlatTag', label: 'FlatFeams Tag' },
          { path: 'stories.expFlatTitle', label: 'FlatFeams Landscape Judul' },
          { path: 'stories.expFlatDesc', label: 'FlatFeams Landscape Deskripsi', type: 'textarea' },
          { path: 'stories.expFlatVideo', label: 'FlatFeams Landscape Video MP4' },
          { path: 'stories.expFlatPoster', label: 'FlatFeams Landscape Poster' }
        ]
      }
    ],
    science: [
      {
        title: 'Header & Penjelasan Ilmiah',
        fields: [
          { path: 'science.heroBadge', label: 'Badge Header' },
          { path: 'science.heroTitle', label: 'Judul Utama' },
          { path: 'science.heroSubtitle', label: 'Subjudul', type: 'textarea' },
          { path: 'science.pillar1Eyebrow', label: 'Eyebrow Pilar 1' },
          { path: 'science.pillar1Title', label: 'Judul Pilar 1' },
          { path: 'science.pillar1Desc', label: 'Paragraf Pilar 1', type: 'textarea' },
          { path: 'science.pillar1Callout', label: 'Kotak Callout Inside-Out', type: 'textarea' }
        ]
      },
      {
        title: 'Timeline Pemulihan & Hasil Uji Klinis',
        fields: [
          { path: 'science.timelineTitle', label: 'Judul Timeline' },
          { path: 'science.t1Title', label: 'Tahap 1 Judul' },
          { path: 'science.t1Desc', label: 'Tahap 1 Deskripsi', type: 'textarea' },
          { path: 'science.t2Title', label: 'Tahap 2 Judul' },
          { path: 'science.t2Desc', label: 'Tahap 2 Deskripsi', type: 'textarea' },
          { path: 'science.t3Title', label: 'Tahap 3 Judul' },
          { path: 'science.t3Desc', label: 'Tahap 3 Deskripsi', type: 'textarea' },
          { path: 'science.studyTitle', label: 'Judul Studi Klinis' },
          { path: 'science.studySubtitle', label: 'Subjudul Studi Klinis' },
          { path: 'science.studyBadge', label: 'Badge Sertifikasi Lab' },
          { path: 'science.m1Val', label: 'Metrik 1 Nilai' },
          { path: 'science.m1Title', label: 'Metrik 1 Judul' },
          { path: 'science.m1Desc', label: 'Metrik 1 Deskripsi' },
          { path: 'science.m2Val', label: 'Metrik 2 Nilai' },
          { path: 'science.m2Title', label: 'Metrik 2 Judul' },
          { path: 'science.m2Desc', label: 'Metrik 2 Deskripsi' },
          { path: 'science.m3Val', label: 'Metrik 3 Nilai' },
          { path: 'science.m3Title', label: 'Metrik 3 Judul' },
          { path: 'science.m3Desc', label: 'Metrik 3 Deskripsi' },
          { path: 'science.m4Val', label: 'Metrik 4 Nilai' },
          { path: 'science.m4Title', label: 'Metrik 4 Judul' },
          { path: 'science.m4Desc', label: 'Metrik 4 Deskripsi' },
          { path: 'science.formulationsEyebrow', label: 'Eyebrow Section Formulasi' },
          { path: 'science.formulationsTitle', label: 'Judul Section Formulasi' },
          { path: 'science.formulationsDesc', label: 'Deskripsi Section Formulasi', type: 'textarea' }
        ]
      }
    ],
    reviews: [
      {
        title: 'Header, Metrik & CTA Halaman Reviews',
        fields: [
          { path: 'reviews.heroBadge', label: 'Badge Header' },
          { path: 'reviews.heroTitle', label: 'Judul Utama' },
          { path: 'reviews.heroSubtitle', label: 'Subjudul', type: 'textarea' },
          { path: 'reviews.metric1Val', label: 'Metrik 1 Nilai' },
          { path: 'reviews.metric1Label', label: 'Metrik 1 Label' },
          { path: 'reviews.metric2Val', label: 'Metrik 2 Nilai' },
          { path: 'reviews.metric2Label', label: 'Metrik 2 Label' },
          { path: 'reviews.metric3Val', label: 'Metrik 3 Nilai' },
          { path: 'reviews.metric3Label', label: 'Metrik 3 Label' },
          { path: 'reviews.metric4Val', label: 'Metrik 4 Nilai' },
          { path: 'reviews.metric4Label', label: 'Metrik 4 Label' },
          { path: 'reviews.ctaTitle', label: 'Judul CTA Bawah' },
          { path: 'reviews.ctaDesc', label: 'Deskripsi CTA Bawah', type: 'textarea' }
        ]
      }
    ],
    faq: [
      {
        title: 'Header, Privasi Kemasan & Kontak FAQ',
        fields: [
          { path: 'faq.heroBadge', label: 'Badge Header' },
          { path: 'faq.heroTitle', label: 'Judul Utama' },
          { path: 'faq.heroSubtitle', label: 'Subjudul', type: 'textarea' },
          { path: 'faq.privacyBadge', label: 'Badge Privasi' },
          { path: 'faq.privacyTitle', label: 'Judul Standar Kemasan' },
          { path: 'faq.privacyDesc', label: 'Deskripsi Kemasan', type: 'textarea' },
          { path: 'faq.boxCardTitle', label: 'Judul Kartu Kotak Pengiriman' },
          { path: 'faq.boxCardDesc', label: 'Deskripsi Kartu Pengiriman', type: 'textarea' },
          { path: 'faq.boxCardImage', label: 'Path Gambar Kartu Pengiriman' },
          { path: 'faq.accordionTitle', label: 'Judul Daftar Pertanyaan (FAQ)' },
          { path: 'faq.contactTitle', label: 'Judul Bagian Kontak' },
          { path: 'faq.contactDesc', label: 'Deskripsi Bagian Kontak', type: 'textarea' },
          { path: 'faq.contactUrl', label: 'URL Tombol Contact Care Team' },
          { path: 'faq.trackUrl', label: 'URL Tombol Track Order' }
        ]
      }
    ],
    global: [
      {
        title: 'Top Announcement Ticker & Footer (Berlaku di Semua Halaman)',
        fields: [
          { path: 'global.tickerLeft', label: 'Teks Kiri Top Bar' },
          { path: 'global.tickerCenter', label: 'Teks Tengah Top Bar', type: 'textarea' },
          { path: 'global.footerNewsletterEyebrow', label: 'Footer Newsletter Eyebrow' },
          { path: 'global.footerNewsletterTitle', label: 'Footer Newsletter Judul' },
          { path: 'global.footerNewsletterDesc', label: 'Footer Newsletter Deskripsi', type: 'textarea' },
          { path: 'global.footerBrandDesc', label: 'Footer Deskripsi Brand', type: 'textarea' },
          { path: 'global.footerBadgeText', label: 'Footer Badge Sertifikasi' },
          { path: 'global.footerCopyright', label: 'Footer Copyright' },
          { path: 'global.footerTagline', label: 'Footer Tagline Bawah' }
        ]
      }
    ]
  };

  function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getNested(obj, pathStr) {
    return pathStr.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
  }

  function setNested(obj, pathStr, val) {
    const parts = pathStr.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function selectCmsPage(pageKey) {
    collectCmsInputsIntoDraft();
    currentCmsPage = pageKey;
    document.querySelectorAll('.cms-page-pill').forEach(btn => {
      if (btn.getAttribute('data-cms-page') === pageKey) {
        btn.classList.add('bg-gold-500', 'text-noir-950');
        btn.classList.remove('bg-noir-850', 'text-sand-300', 'border', 'border-sand-300/10');
      } else {
        btn.classList.remove('bg-gold-500', 'text-noir-950');
        btn.classList.add('bg-noir-850', 'text-sand-300', 'border', 'border-sand-300/10');
      }
    });
    renderCmsEditor();
  }

  function collectCmsInputsIntoDraft() {
    if (!cmsDraft) return;
    document.querySelectorAll('[data-cms-input]').forEach(el => {
      const path = el.getAttribute('data-cms-input');
      const isNum = el.getAttribute('type') === 'number';
      const val = isNum ? (parseFloat(el.value) || 0) : el.value;
      setNested(cmsDraft, path, val);
    });
  }

  function renderCmsEditor() {
    const container = document.getElementById('cms-editor-body');
    if (!container || !cmsDraft) return;

    const sections = CMS_SECTIONS[currentCmsPage] || [];
    let html = sections.map(sec => `
      <div class="admin-card p-6 rounded-3xl space-y-4">
        <h3 class="text-base font-serif font-bold text-white border-b border-sand-300/10 pb-3">${escapeHtml(sec.title)}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${sec.fields.map(f => {
            const val = getNested(cmsDraft, f.path);
            const fullSpan = f.type === 'textarea' ? 'md:col-span-2' : '';
            if (f.type === 'textarea') {
              return `
                <div class="${fullSpan}">
                  <label class="block text-[11px] font-mono uppercase text-sand-400 mb-1.5">${escapeHtml(f.label)}</label>
                  <textarea rows="3" data-cms-input="${escapeHtml(f.path)}" class="w-full bg-noir-950/90 border border-sand-300/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500">${escapeHtml(val)}</textarea>
                </div>
              `;
            }
            const inputType = f.type === 'number' ? 'number' : 'text';
            const stepAttr = f.type === 'number' ? 'step="0.01"' : '';
            return `
              <div class="${fullSpan}">
                <label class="block text-[11px] font-mono uppercase text-sand-400 mb-1.5">${escapeHtml(f.label)}</label>
                <input type="${inputType}" ${stepAttr} data-cms-input="${escapeHtml(f.path)}" value="${escapeHtml(val)}" class="w-full bg-noir-950/90 border border-sand-300/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500">
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Dynamic Reviews Editor when on 'reviews'
    if (currentCmsPage === 'reviews') {
      const list = Array.isArray(cmsDraft.reviewsList) ? cmsDraft.reviewsList : [];
      html += `
        <div class="admin-card p-6 rounded-3xl space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-sand-300/10 pb-3">
            <div>
              <h3 class="text-base font-serif font-bold text-white">Daftar Testimoni Pelanggan (${list.length})</h3>
              <p class="text-[11px] text-sand-400">Tambah, edit, atau hapus testimoni yang tampil di halaman Reviews.</p>
            </div>
            <button type="button" onclick="AdminApp.addCmsReview()" class="px-3.5 py-2 bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Tambah Review</span>
            </button>
          </div>
          <div class="space-y-4">
            ${list.map((r, idx) => `
              <div class="p-4 rounded-2xl bg-noir-950/80 border border-sand-300/10 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono text-gold-400 font-bold">Review #${idx + 1}</span>
                  <button type="button" onclick="AdminApp.deleteCmsReview(${idx})" class="text-xs text-rose-400 hover:text-rose-300">Hapus</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Nama Penulis</label>
                    <input type="text" data-cms-input="reviewsList.${idx}.author" value="${escapeHtml(r.author)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Usia</label>
                    <input type="number" data-cms-input="reviewsList.${idx}.age" value="${escapeHtml(r.age)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Kota / Lokasi</label>
                    <input type="text" data-cms-input="reviewsList.${idx}.location" value="${escapeHtml(r.location)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Kategori (odor/dryness/cycle/bloat)</label>
                    <input type="text" data-cms-input="reviewsList.${idx}.tag" value="${escapeHtml(r.tag)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Rating (1–5)</label>
                    <input type="number" min="1" max="5" data-cms-input="reviewsList.${idx}.rating" value="${escapeHtml(r.rating || 5)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Produk yang Dipakai</label>
                    <input type="text" data-cms-input="reviewsList.${idx}.productUsed" value="${escapeHtml(r.productUsed)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Judul Review</label>
                    <input type="text" data-cms-input="reviewsList.${idx}.title" value="${escapeHtml(r.title)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Gambar Botol (Opsional)</label>
                    <input type="text" data-cms-input="reviewsList.${idx}.image" value="${escapeHtml(r.image || '')}" placeholder="assets/Advanced.jpg" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                  </div>
                  <div class="sm:col-span-3">
                    <label class="block text-[10px] font-mono text-sand-400 mb-1">Isi Testimoni</label>
                    <textarea rows="2" data-cms-input="reviewsList.${idx}.quote" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">${escapeHtml(r.quote)}</textarea>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Dynamic FAQ Editor when on 'faq'
    if (currentCmsPage === 'faq') {
      const faqs = Array.isArray(cmsDraft.faqItems) ? cmsDraft.faqItems : [];
      html += `
        <div class="admin-card p-6 rounded-3xl space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-sand-300/10 pb-3">
            <div>
              <h3 class="text-base font-serif font-bold text-white">Daftar Tanya Jawab FAQ (${faqs.length})</h3>
              <p class="text-[11px] text-sand-400">Tambah, ubah, atau hapus pertanyaan dan jawaban pada halaman FAQ.</p>
            </div>
            <button type="button" onclick="AdminApp.addCmsFaq()" class="px-3.5 py-2 bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Tambah FAQ</span>
            </button>
          </div>
          <div class="space-y-4">
            ${faqs.map((item, idx) => `
              <div class="p-4 rounded-2xl bg-noir-950/80 border border-sand-300/10 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono text-gold-400 font-bold">FAQ #${idx + 1}</span>
                  <button type="button" onclick="AdminApp.deleteCmsFaq(${idx})" class="text-xs text-rose-400 hover:text-rose-300">Hapus</button>
                </div>
                <div>
                  <label class="block text-[10px] font-mono text-sand-400 mb-1">Pertanyaan</label>
                  <input type="text" data-cms-input="faqItems.${idx}.question" value="${escapeHtml(item.question)}" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">
                </div>
                <div>
                  <label class="block text-[10px] font-mono text-sand-400 mb-1">Jawaban</label>
                  <textarea rows="3" data-cms-input="faqItems.${idx}.answer" class="w-full bg-noir-900 border border-sand-300/15 rounded-lg px-3 py-2 text-xs text-white">${escapeHtml(item.answer)}</textarea>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    if (window.safeCreateIcons) window.safeCreateIcons();
  }

  function showCmsBanner(msg) {
    const banner = document.getElementById('cms-save-banner');
    const textEl = document.getElementById('cms-save-banner-text');
    if (textEl) textEl.textContent = msg;
    if (banner) {
      banner.classList.remove('hidden');
      setTimeout(() => banner.classList.add('hidden'), 6000);
    }
  }

  function saveCmsForm() {
    collectCmsInputsIntoDraft();
    if (window.CMSEngine) {
      CMSEngine.saveContent(cmsDraft);
      CMSEngine.apply();
    }
    renderProductsTable();
    renderReviewsTable();
    showCmsBanner('Semua perubahan halaman tersimpan! Klik "Lihat Halaman" untuk mengecek tampilan.');
  }

  function previewActiveCmsPage() {
    saveCmsForm();
    const url = CMS_PAGE_URLS[currentCmsPage] || '../index.html';
    window.open(url, '_blank');
  }

  function addCmsReview() {
    collectCmsInputsIntoDraft();
    if (!Array.isArray(cmsDraft.reviewsList)) cmsDraft.reviewsList = [];
    cmsDraft.reviewsList.unshift({
      id: Date.now(),
      tag: 'odor',
      title: 'Pelanggan Baru Sangat Puas',
      quote: 'Tulis testimoni pelanggan di sini...',
      author: 'Nama Pelanggan',
      age: 30,
      location: 'Jakarta, ID',
      productUsed: 'Flora+ Gummies',
      verified: true,
      rating: 5
    });
    renderCmsEditor();
  }

  function deleteCmsReview(idx) {
    collectCmsInputsIntoDraft();
    if (!confirm('Hapus review ini?')) return;
    cmsDraft.reviewsList.splice(idx, 1);
    saveCmsForm();
    renderCmsEditor();
  }

  function addCmsFaq() {
    collectCmsInputsIntoDraft();
    if (!Array.isArray(cmsDraft.faqItems)) cmsDraft.faqItems = [];
    cmsDraft.faqItems.push({
      question: 'Pertanyaan baru?',
      answer: 'Jawaban lengkap untuk pertanyaan ini...'
    });
    renderCmsEditor();
  }

  function deleteCmsFaq(idx) {
    collectCmsInputsIntoDraft();
    if (!confirm('Hapus pertanyaan FAQ ini?')) return;
    cmsDraft.faqItems.splice(idx, 1);
    saveCmsForm();
    renderCmsEditor();
  }

  function resetCmsPage() {
    if (!confirm(`Kembalikan konten halaman "${currentCmsPage}" ke pengaturan awal?`)) return;
    const defaults = JSON.parse(JSON.stringify(window.ALLFEAMS_CMS_DEFAULTS || {}));
    if (currentCmsPage === 'reviews') {
      cmsDraft.reviews = defaults.reviews;
      if (typeof ALLFEAMS_REVIEWS !== 'undefined') {
        cmsDraft.reviewsList = JSON.parse(JSON.stringify(ALLFEAMS_REVIEWS));
      }
    } else if (currentCmsPage === 'faq') {
      cmsDraft.faq = defaults.faq;
      cmsDraft.faqItems = defaults.faqItems;
    } else if (currentCmsPage === 'collection') {
      cmsDraft.collection = defaults.collection;
      if (window.CMSEngine) {
        CMSEngine.resetContent();
        const fresh = CMSEngine.getContent();
        cmsDraft.products = fresh.products;
      }
    } else if (defaults[currentCmsPage]) {
      cmsDraft[currentCmsPage] = defaults[currentCmsPage];
    }
    if (window.CMSEngine) {
      CMSEngine.saveContent(cmsDraft);
      CMSEngine.apply();
    }
    renderCmsEditor();
    showCmsBanner(`Halaman "${currentCmsPage}" dikembalikan ke default.`);
  }

  function exportCmsJson() {
    collectCmsInputsIntoDraft();
    const blob = new Blob([JSON.stringify(cmsDraft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cms-content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importCmsJson(event) {
    const file = event && event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        cmsDraft = parsed;
        if (window.CMSEngine) {
          CMSEngine.saveContent(cmsDraft);
          CMSEngine.apply();
        }
        renderCmsEditor();
        renderProductsTable();
        renderReviewsTable();
        showCmsBanner('File JSON berhasil di-import dan disimpan!');
      } catch (err) {
        alert('Format JSON tidak valid: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function togglePublishPanel() {
    const panel = document.getElementById('cms-publish-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    const tokInput = document.getElementById('cms-github-token');
    try {
      const savedTok = localStorage.getItem('allfeams_gh_token');
      if (tokInput && savedTok && !tokInput.value) tokInput.value = savedTok;
    } catch (e) {}
  }

  async function publishCmsToGithub() {
    saveCmsForm();
    const tokInput = document.getElementById('cms-github-token');
    const token = tokInput ? tokInput.value.trim() : '';
    if (!token) {
      alert('Masukkan GitHub Personal Access Token (scope: repo) terlebih dahulu.');
      return;
    }
    try {
      localStorage.setItem('allfeams_gh_token', token);
    } catch (e) {}

    const apiUrl = 'https://api.github.com/repos/mufidfazzal-sys/allfeams-redesign/contents/data/cms-content.json';
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    };

    try {
      let sha = undefined;
      const getRes = await fetch(apiUrl, { headers });
      if (getRes.ok) {
        const existing = await getRes.json();
        sha = existing.sha;
      }

      const jsonStr = JSON.stringify(cmsDraft, null, 2);
      const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'CMS update from ALLFEAMS Admin Dashboard',
          content: b64,
          sha: sha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errData = await putRes.json().catch(() => ({}));
        throw new Error(errData.message || ('HTTP ' + putRes.status));
      }

      showCmsBanner('Berhasil dipublish ke GitHub! Vercel akan otomatis deploy perubahan untuk semua pengunjung dalam ~30 detik.');
    } catch (err) {
      alert('Gagal publish ke GitHub: ' + err.message);
    }
  }

  // Export Orders CSV
  function exportOrdersCsv() {
    const headers = ["Order ID", "Date", "Customer", "Email", "Phone", "Total (USD)", "Status", "Tracking", "Address"];
    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${o.date}"`,
      `"${o.customer}"`,
      `"${o.email}"`,
      `"${o.phone}"`,
      o.total.toFixed(2),
      `"${o.fulfillmentStatus}"`,
      `"${o.tracking || 'N/A'}"`,
      `"${o.address}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `allfeams_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    init,
    login,
    logout,
    switchTab,
    markShipped,
    viewOrder,
    closeOrderModal,
    printPackingSlip,
    editProductPrice,
    renderOrdersTable,
    createPromo,
    togglePromo,
    deletePromo,
    exportOrdersCsv,
    selectCmsPage,
    saveCmsForm,
    previewActiveCmsPage,
    addCmsReview,
    deleteCmsReview,
    addCmsFaq,
    deleteCmsFaq,
    resetCmsPage,
    exportCmsJson,
    importCmsJson,
    togglePublishPanel,
    publishCmsToGithub
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
