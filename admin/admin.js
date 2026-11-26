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

  function init() {
    loadData();
    checkAuth();
    setupNavigation();
    renderOverview();
    renderOrdersTable();
    renderProductsTable();
    renderPromosTable();
    renderReviewsTable();
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
    const isAuthed = sessionStorage.getItem('allfeams_admin_logged');
    const lockScreen = document.getElementById('admin-lock-screen');
    const mainDashboard = document.getElementById('admin-main-dashboard');

    if (isAuthed === 'true') {
      if (lockScreen) lockScreen.classList.add('hidden');
      if (mainDashboard) mainDashboard.classList.remove('hidden');
    } else {
      if (lockScreen) lockScreen.classList.remove('hidden');
      if (mainDashboard) mainDashboard.classList.add('hidden');
    }
  }

  function login(pin) {
    if (pin === '8888' || pin === 'admin' || !pin) {
      sessionStorage.setItem('allfeams_admin_logged', 'true');
      checkAuth();
      return true;
    } else {
      alert('Incorrect security passcode. (Default: 8888)');
      return false;
    }
  }

  function logout() {
    sessionStorage.removeItem('allfeams_admin_logged');
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
      p.price = parseFloat(newPrice);
      renderProductsTable();
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
    if (!tableBody || typeof ALLFEAMS_REVIEWS === 'undefined') return;

    tableBody.innerHTML = ALLFEAMS_REVIEWS.map(r => `
      <tr class="border-b border-sand-300/10 hover:bg-white/[0.02] transition">
        <td class="py-3 px-4">
          <span class="text-xs font-bold text-white block">${r.author}, ${r.age}</span>
          <span class="text-[10px] text-sand-400">${r.location}</span>
        </td>
        <td class="py-3 px-4 text-xs text-gold-500 font-semibold">${r.rating}★ (${r.tag.toUpperCase()})</td>
        <td class="py-3 px-4 text-xs text-sand-200 italic max-w-sm">"${r.quote}"</td>
        <td class="py-3 px-4 text-xs text-gold-400">${r.productUsed}</td>
        <td class="py-3 px-4 text-right">
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full badge-paid">Published</span>
        </td>
      </tr>
    `).join('');
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
    exportOrdersCsv
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
