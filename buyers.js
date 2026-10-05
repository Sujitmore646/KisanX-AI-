/**
 * KisanX AI - Buyers Module
 */

let buyersData = [];
let filteredBuyers = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadBuyers();
  renderNotifications();
  initBuyerFilters();
});

function loadBuyers() {
  fetch('../data/buyers.json')
    .then(r => r.json())
    .then(data => {
      buyersData = data;
      filteredBuyers = data;
      renderBuyers(data);
    })
    .catch(() => {
      buyersData = getDefaultBuyers();
      filteredBuyers = buyersData;
      renderBuyers(buyersData);
    });
}

function getDefaultBuyers() {
  return [
    { id: 1, name: 'Ravi Sharma Traders', type: 'Wholesaler', verified: true, crops: ['Tomato', 'Onion', 'Potato'], requiredQty: '50 Quintal', offeredPrice: 2850, unit: 'Quintal', location: 'Nashik, Maharashtra', distance: '8 km', rating: 4.8, reviews: 142, avatar: 'RT', color: '#22C55E' },
    { id: 2, name: 'Mumbai Fresh Exports', type: 'Exporter', verified: true, crops: ['Tomato', 'Cotton', 'Soybean'], requiredQty: '200 Quintal', offeredPrice: 2950, unit: 'Quintal', location: 'Mumbai, Maharashtra', distance: '165 km', rating: 4.6, reviews: 89, avatar: 'MF', color: '#3B82F6' },
    { id: 3, name: 'Pune Agro Mart', type: 'Retailer', verified: true, crops: ['Onion', 'Potato', 'Wheat'], requiredQty: '30 Quintal', offeredPrice: 1700, unit: 'Quintal', location: 'Pune, Maharashtra', distance: '185 km', rating: 4.3, reviews: 67, avatar: 'PA', color: '#F59E0B' },
    { id: 4, name: 'National Food Corp', type: 'Processing Unit', verified: true, crops: ['Wheat', 'Soybean', 'Cotton'], requiredQty: '500 Quintal', offeredPrice: 4100, unit: 'Quintal', location: 'Aurangabad, Maharashtra', distance: '180 km', rating: 4.9, reviews: 213, avatar: 'NF', color: '#8B5CF6' },
    { id: 5, name: 'Suresh Brothers Traders', type: 'Wholesaler', verified: false, crops: ['Tomato', 'Onion'], requiredQty: '25 Quintal', offeredPrice: 2700, unit: 'Quintal', location: 'Nasik Road, Maharashtra', distance: '12 km', rating: 3.9, reviews: 28, avatar: 'SB', color: '#EF4444' },
    { id: 6, name: 'AgroLink Direct', type: 'Online Platform', verified: true, crops: ['Tomato', 'Onion', 'Potato', 'Wheat', 'Soybean', 'Cotton'], requiredQty: 'Any', offeredPrice: 2900, unit: 'Quintal', location: 'Pan Maharashtra', distance: 'Online', rating: 4.7, reviews: 445, avatar: 'AL', color: '#14532D' },
  ];
}

function renderBuyers(buyers) {
  const container = document.getElementById('buyersGrid');
  const countEl = document.getElementById('buyerCount');
  if (!container) return;
  if (countEl) countEl.textContent = buyers.length;

  if (buyers.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <div class="empty-state-icon">🤝</div>
          <h5>No buyers found</h5>
          <p class="text-muted">Try adjusting your filters</p>
        </div>
      </div>`;
    return;
  }

  container.innerHTML = buyers.map(buyer => buyerCardHTML(buyer)).join('');
}

function buyerCardHTML(buyer) {
  const stars = '★'.repeat(Math.floor(buyer.rating)) + (buyer.rating % 1 >= 0.5 ? '½' : '');

  return `
    <div class="col-xl-4 col-lg-6 col-md-6 mb-4">
      <div class="buyer-card">
        <div class="d-flex align-items-start gap-3 mb-3">
          <div class="buyer-avatar" style="background:${buyer.color}">${buyer.avatar}</div>
          <div style="flex:1">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="buyer-name">${buyer.name}</span>
              ${buyer.verified ? `<span class="verified-badge"><i class="bi bi-patch-check-fill"></i> Verified</span>` : '<span class="badge bg-secondary" style="font-size:0.65rem">Unverified</span>'}
            </div>
            <div class="buyer-type">${buyer.type}</div>
            <div class="rating-stars">${stars} <span style="color:var(--text-light);font-size:0.8rem">(${buyer.reviews} reviews)</span></div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="crop-info-row">
          <span class="crop-info-label">🌾 Crops Needed</span>
          <div class="d-flex gap-1 flex-wrap">
            ${buyer.crops.slice(0, 3).map(c => `<span class="badge-green" style="font-size:0.7rem">${c}</span>`).join('')}
          </div>
        </div>
        <div class="crop-info-row">
          <span class="crop-info-label">📦 Required Qty</span>
          <span class="crop-info-value">${buyer.requiredQty}</span>
        </div>
        <div class="crop-info-row">
          <span class="crop-info-label">💰 Offered Price</span>
          <span class="crop-info-value text-green">${formatCurrency(buyer.offeredPrice)}/${buyer.unit}</span>
        </div>
        <div class="crop-info-row">
          <span class="crop-info-label">📍 Location</span>
          <span class="crop-info-value">${buyer.location}</span>
        </div>
        <div class="crop-info-row" style="border:none">
          <span class="crop-info-label">📏 Distance</span>
          <span class="crop-info-value">${buyer.distance}</span>
        </div>
        
        <div class="d-flex gap-2 mt-3">
          <button class="btn-kisan-primary flex-fill justify-content-center" onclick="viewBuyerDetail(${buyer.id})" style="flex:1">
            <i class="bi bi-eye"></i> Details
          </button>
          <button class="btn-kisan-outline flex-fill justify-content-center" onclick="sendOffer(${buyer.id})" style="flex:1">
            <i class="bi bi-send"></i> Send Offer
          </button>
        </div>
      </div>
    </div>`;
}

function initBuyerFilters() {
  const form = document.getElementById('buyerFilterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const crop = document.getElementById('filterCrop').value;
    const qty = document.getElementById('filterQty').value;
    const price = document.getElementById('filterPrice').value;

    let results = buyersData;

    if (crop) {
      results = results.filter(b => b.crops.some(c => c.toLowerCase().includes(crop.toLowerCase())));
    }

    if (price) {
      results = results.filter(b => b.offeredPrice >= parseFloat(price));
    }

    filteredBuyers = results;
    renderBuyers(results);

    if (results.length === 0) showToast('No buyers match your criteria', 'info');
    else showToast(`Found ${results.length} matching buyer(s)`, 'success');
  });
}

function viewBuyerDetail(id) {
  const buyer = buyersData.find(b => b.id === id);
  if (!buyer) return;

  const modal = document.getElementById('buyerDetailModal');
  if (!modal) return;

  document.getElementById('buyerDetailContent').innerHTML = `
    <div class="text-center mb-4">
      <div class="buyer-avatar mx-auto mb-2" style="width:70px;height:70px;border-radius:18px;font-size:1.5rem;background:${buyer.color}">${buyer.avatar}</div>
      <h5 style="color:var(--text-dark)">${buyer.name}</h5>
      <div class="d-flex justify-content-center align-items-center gap-2">
        <span class="buyer-type">${buyer.type}</span>
        ${buyer.verified ? '<span class="verified-badge"><i class="bi bi-patch-check-fill"></i> Verified</span>' : ''}
      </div>
      <div class="rating-stars mt-1">${'★'.repeat(Math.floor(buyer.rating))} ${buyer.rating} (${buyer.reviews} reviews)</div>
    </div>
    
    <div class="row g-2 mb-3">
      <div class="col-6">
        <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
          <div style="font-size:0.7rem;color:var(--text-light);font-weight:700;text-transform:uppercase">Offered Price</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--green-dark)">${formatCurrency(buyer.offeredPrice)}/${buyer.unit}</div>
        </div>
      </div>
      <div class="col-6">
        <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
          <div style="font-size:0.7rem;color:var(--text-light);font-weight:700;text-transform:uppercase">Required Qty</div>
          <div style="font-size:1.1rem;font-weight:800;color:var(--text-dark)">${buyer.requiredQty}</div>
        </div>
      </div>
    </div>
    
    <div class="ai-metric"><span class="ai-metric-label">📍 Location</span><span class="ai-metric-value">${buyer.location}</span></div>
    <div class="ai-metric"><span class="ai-metric-label">📏 Distance</span><span class="ai-metric-value">${buyer.distance}</span></div>
    <div class="ai-metric"><span class="ai-metric-label">📞 Phone</span><span class="ai-metric-value">+91 98XXX XXXXX</span></div>
    
    <div class="mt-3">
      <div style="font-size:0.8rem;font-weight:700;color:var(--text-dark)">Crops Accepted:</div>
      <div class="d-flex gap-2 flex-wrap mt-1">
        ${buyer.crops.map(c => `<span class="badge-green">${c}</span>`).join('')}
      </div>
    </div>
    
    <div class="d-flex gap-2 mt-4">
      <button class="btn-kisan-primary flex-fill justify-content-center" onclick="sendOffer(${buyer.id})" style="flex:1">
        <i class="bi bi-send"></i> Send Offer
      </button>
      <button class="btn-kisan-outline flex-fill justify-content-center" onclick="showToast('Calling ${buyer.name}...', 'info')" style="flex:1">
        <i class="bi bi-telephone"></i> Call
      </button>
    </div>`;

  showModal('buyerDetailModal');
}

function sendOffer(id) {
  const buyer = buyersData.find(b => b.id === id);
  if (!buyer) return;

  const modal = document.getElementById('sendOfferModal');
  if (modal) {
    document.getElementById('offerBuyerName').textContent = buyer.name;
    document.getElementById('offerSuggestedPrice').value = buyer.offeredPrice;
    document.getElementById('sendOfferForm').dataset.buyerId = id;
    showModal('sendOfferModal');
  } else {
    showToast(`Offer sent to ${buyer.name}!`, 'success');
  }
}

function submitOffer() {
  const form = document.getElementById('sendOfferForm');
  const crop = document.getElementById('offerCrop').value;
  const qty = document.getElementById('offerQty').value;
  const price = document.getElementById('offerSuggestedPrice').value;

  if (!crop || !qty || !price) {
    showToast('Please fill all fields', 'error');
    return;
  }

  if (parseFloat(qty) <= 0 || parseFloat(price) <= 0) {
    showToast('Quantity and price must be positive', 'error');
    return;
  }

  hideModal('sendOfferModal');
  showToast(`✅ Offer sent successfully! Buyer will respond within 24 hours.`, 'success');
}

function sortBuyers(by) {
  let sorted = [...filteredBuyers];
  if (by === 'price') sorted.sort((a, b) => b.offeredPrice - a.offeredPrice);
  if (by === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  if (by === 'distance') sorted.sort((a, b) => {
    const da = parseFloat(a.distance) || 9999;
    const db = parseFloat(b.distance) || 9999;
    return da - db;
  });
  renderBuyers(sorted);
}
