/**
 * KisanX AI - Orders Module
 */

let ordersData = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadOrders();
  renderNotifications();
});

function loadOrders() {
  const stored = loadFromStorage('orders');
  if (stored && stored.length > 0) {
    ordersData = stored;
  } else {
    ordersData = getDefaultOrders();
    saveToStorage('orders', ordersData);
  }
  renderOrders();
}

function getDefaultOrders() {
  return [
    {
      id: 'KX-2026-001', crop: 'Tomato', icon: '🍅', quantity: '50 Quintal', buyer: 'Ravi Sharma Traders',
      amount: 142500, date: '2026-10-01', deliveryDate: '2026-10-08',
      status: 'in_transit', paymentStatus: 'Partial',
      timeline: [
        { step: 'Order Placed', done: true, time: 'Oct 1, 9:00 AM' },
        { step: 'Buyer Confirmed', done: true, time: 'Oct 1, 2:00 PM' },
        { step: 'Transport Booked', done: true, time: 'Oct 2, 10:00 AM' },
        { step: 'In Transit', done: true, active: true, time: 'Oct 4, 6:00 AM' },
        { step: 'Delivered', done: false, time: 'Expected Oct 8' },
      ]
    },
    {
      id: 'KX-2026-002', crop: 'Onion', icon: '🧅', quantity: '30 Quintal', buyer: 'Pune Agro Mart',
      amount: 51000, date: '2026-09-25', deliveryDate: '2026-09-30',
      status: 'delivered', paymentStatus: 'Paid',
      timeline: [
        { step: 'Order Placed', done: true, time: 'Sep 25, 10:00 AM' },
        { step: 'Buyer Confirmed', done: true, time: 'Sep 25, 3:00 PM' },
        { step: 'Transport Booked', done: true, time: 'Sep 26, 11:00 AM' },
        { step: 'In Transit', done: true, time: 'Sep 28, 7:00 AM' },
        { step: 'Delivered', done: true, time: 'Sep 30, 2:00 PM' },
      ]
    },
    {
      id: 'KX-2026-003', crop: 'Wheat', icon: '🌾', quantity: '100 Quintal', buyer: 'National Food Corp',
      amount: 250000, date: '2026-10-03', deliveryDate: '2026-10-15',
      status: 'confirmed', paymentStatus: 'Pending',
      timeline: [
        { step: 'Order Placed', done: true, time: 'Oct 3, 11:00 AM' },
        { step: 'Buyer Confirmed', done: true, time: 'Oct 3, 5:00 PM' },
        { step: 'Transport Booked', done: false, time: 'Scheduled' },
        { step: 'In Transit', done: false, time: 'TBD' },
        { step: 'Delivered', done: false, time: 'Expected Oct 15' },
      ]
    },
    {
      id: 'KX-2026-004', crop: 'Cotton', icon: '🌿', quantity: '80 Quintal', buyer: 'Mumbai Fresh Exports',
      amount: 560000, date: '2026-10-04', deliveryDate: '2026-10-12',
      status: 'pending', paymentStatus: 'Pending',
      timeline: [
        { step: 'Order Placed', done: true, time: 'Oct 4, 9:00 AM' },
        { step: 'Buyer Confirmed', done: false, time: 'Awaiting' },
        { step: 'Transport Booked', done: false, time: 'TBD' },
        { step: 'In Transit', done: false, time: 'TBD' },
        { step: 'Delivered', done: false, time: 'Expected Oct 12' },
      ]
    },
  ];
}

function renderOrders(filter = 'all') {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  let filtered = ordersData;
  if (filter !== 'all') {
    filtered = ordersData.filter(o => o.status === filter);
  }

  // Update counts
  ['all', 'pending', 'confirmed', 'in_transit', 'delivered'].forEach(s => {
    const el = document.getElementById(`count-${s}`);
    if (el) {
      const count = s === 'all' ? ordersData.length : ordersData.filter(o => o.status === s).length;
      el.textContent = count;
    }
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h5>No orders found</h5>
        <p class="text-muted">Orders matching this status will appear here</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(order => orderCardHTML(order)).join('');
}

function orderCardHTML(order) {
  const statusConfig = {
    pending: { label: 'Pending', class: 'status-pending', icon: '⏳' },
    confirmed: { label: 'Confirmed', class: 'status-confirmed', icon: '✅' },
    in_transit: { label: 'In Transit', class: 'status-transit', icon: '🚛' },
    delivered: { label: 'Delivered', class: 'status-delivered', icon: '✓' },
  };

  const paymentConfig = {
    Paid: 'badge bg-success',
    Partial: 'badge bg-warning text-dark',
    Pending: 'badge bg-secondary',
  };

  const s = statusConfig[order.status] || statusConfig.pending;

  return `
    <div class="kisan-card mb-3">
      <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
        <div class="d-flex align-items-center gap-3">
          <div style="font-size:2rem">${order.icon}</div>
          <div>
            <div style="font-weight:800;font-size:1.05rem;color:var(--text-dark)">${order.crop}</div>
            <div style="font-size:0.8rem;color:var(--text-light)">Order: <strong>${order.id}</strong></div>
            <div style="font-size:0.8rem;color:var(--text-light)">Buyer: ${order.buyer}</div>
          </div>
        </div>
        <div class="text-end">
          <span class="order-status-badge ${s.class}">${s.icon} ${s.label}</span>
          <div style="font-size:1.3rem;font-weight:900;color:var(--green-dark);margin-top:0.5rem">${formatCurrency(order.amount)}</div>
          <div>
            <span class="${paymentConfig[order.paymentStatus] || 'badge bg-secondary'}" style="font-size:0.7rem">${order.paymentStatus}</span>
          </div>
        </div>
      </div>
      
      <div class="row g-3 mb-3">
        <div class="col-sm-3">
          <div style="font-size:0.75rem;color:var(--text-light)">Quantity</div>
          <div style="font-weight:700">${order.quantity}</div>
        </div>
        <div class="col-sm-3">
          <div style="font-size:0.75rem;color:var(--text-light)">Order Date</div>
          <div style="font-weight:700">${formatDate(order.date)}</div>
        </div>
        <div class="col-sm-3">
          <div style="font-size:0.75rem;color:var(--text-light)">Delivery Date</div>
          <div style="font-weight:700">${formatDate(order.deliveryDate)}</div>
        </div>
        <div class="col-sm-3">
          <div style="font-size:0.75rem;color:var(--text-light)">Price/Quintal</div>
          <div style="font-weight:700">${formatCurrency(Math.round(order.amount / parseInt(order.quantity)))}</div>
        </div>
      </div>
      
      <!-- Timeline -->
      <div class="order-timeline-strip d-flex align-items-center gap-2 mb-3 flex-wrap">
        ${order.timeline.map((t, i) => `
          <div class="d-flex align-items-center gap-2">
            <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="width:28px;height:28px;border-radius:50%;background:${t.done ? 'var(--green-agri)' : 'var(--bg-light)'};border:2px solid ${t.done ? 'var(--green-agri)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:${t.done ? '#FFFFFF' : 'var(--text-light)'}">
                ${t.done ? '✓' : (i + 1)}
              </div>
              <div style="font-size:0.65rem;color:${t.done ? 'var(--green-agri)' : 'var(--text-light)'};font-weight:600;text-align:center;max-width:60px;line-height:1.2">${t.step}</div>
            </div>
            ${i < order.timeline.length - 1 ? `<div style="height:2px;width:20px;background:${t.done ? 'var(--green-agri)' : 'var(--border)'}"></div>` : ''}
          </div>`).join('')}
      </div>
      
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn-kisan-outline py-1 px-3" style="font-size:0.8rem" onclick="viewOrderDetail('${order.id}')">
          <i class="bi bi-eye"></i> Details
        </button>
        ${order.status === 'in_transit' ? `
          <button class="btn-kisan-primary py-1 px-3" style="font-size:0.8rem" onclick="trackOrder('${order.id}')">
            <i class="bi bi-geo-alt"></i> Track
          </button>` : ''}
        ${order.status === 'delivered' && order.paymentStatus !== 'Paid' ? `
          <button class="btn-kisan-primary py-1 px-3" style="font-size:0.8rem;background:linear-gradient(135deg,#F59E0B,#D97706)" onclick="showToast('Payment request sent!','success')">
            <i class="bi bi-cash"></i> Request Payment
          </button>` : ''}
        <button class="btn-kisan-outline py-1 px-3" style="font-size:0.8rem;border-color:#EF4444;color:#EF4444" onclick="cancelOrder('${order.id}')">
          Cancel
        </button>
      </div>
    </div>`;
}

function filterOrders(status) {
  document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderOrders(status);
}

function viewOrderDetail(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (!order) return;
  showToast(`Order ${orderId}: ${order.crop} | ${order.quantity} | ${formatCurrency(order.amount)}`, 'info', 5000);
}

function trackOrder(orderId) {
  showToast(`🚛 Tracking Order ${orderId}... Vehicle is 35 km away from destination`, 'info', 5000);
}

function cancelOrder(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (!order) return;
  if (order.status === 'delivered') {
    showToast('Cannot cancel a delivered order', 'error');
    return;
  }
  if (!confirm(`Cancel order ${orderId}?`)) return;

  order.status = 'pending';
  showToast(`Order ${orderId} cancellation request submitted`, 'warning');
  renderOrders();
}

function createNewOrder() {
  showModal('newOrderModal');
}

function submitNewOrder() {
  const crop = document.getElementById('newOrderCrop').value;
  const qty = document.getElementById('newOrderQty').value;
  const buyer = document.getElementById('newOrderBuyer').value;
  const price = document.getElementById('newOrderPrice').value;

  if (!crop || !qty || !buyer || !price) {
    showToast('Please fill all fields', 'error');
    return;
  }

  const crops = { Tomato: '🍅', Onion: '🧅', Wheat: '🌾', Soybean: '🫘', Cotton: '🌿', Potato: '🥔' };
  const newOrder = {
    id: `KX-2026-${String(ordersData.length + 10).padStart(3, '0')}`,
    crop, icon: crops[crop] || '🌿',
    quantity: qty + ' Quintal',
    buyer, amount: parseFloat(qty) * parseFloat(price),
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    status: 'pending', paymentStatus: 'Pending',
    timeline: [
      { step: 'Order Placed', done: true, time: new Date().toLocaleString('en-IN') },
      { step: 'Buyer Confirmed', done: false, time: 'Awaiting' },
      { step: 'Transport Booked', done: false, time: 'TBD' },
      { step: 'In Transit', done: false, time: 'TBD' },
      { step: 'Delivered', done: false, time: 'TBD' },
    ]
  };

  ordersData.unshift(newOrder);
  saveToStorage('orders', ordersData);
  hideModal('newOrderModal');
  renderOrders();
  showToast(`✅ New order ${newOrder.id} created!`, 'success');
}
