/**
 * KisanX AI - Market Prices Module
 */

let marketData = [];
let selectedCropIndex = 0;
let priceChart = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadMarketData();
  renderNotifications();
});

function loadMarketData() {
  fetch('../data/market.json')
    .then(r => r.json())
    .then(data => {
      marketData = data.crops;
      renderPriceCards();
      renderPriceChart(0);
      renderMarketTable(0);
    })
    .catch(() => {
      // Fallback inline data
      marketData = [
        { id: 1, name: 'Tomato', icon: '🍅', currentPrice: 2800, previousPrice: 2582, unit: 'Quintal', change: 8.4, trend: 'up', bestMarket: 'Nashik APMC', markets: [{ name: 'Nashik APMC', price: 2800, distance: '5 km', trend: 'up' }, { name: 'Pune Market', price: 2750, distance: '185 km', trend: 'up' }, { name: 'Mumbai Yard', price: 2900, distance: '165 km', trend: 'up' }], priceHistory: [2100, 2300, 2450, 2582, 2620, 2700, 2800] },
        { id: 2, name: 'Onion', icon: '🧅', currentPrice: 1600, previousPrice: 1800, unit: 'Quintal', change: -11.1, trend: 'down', bestMarket: 'Lasalgaon APMC', markets: [{ name: 'Lasalgaon APMC', price: 1600, distance: '55 km', trend: 'down' }, { name: 'Nashik APMC', price: 1550, distance: '5 km', trend: 'down' }], priceHistory: [2200, 2000, 1900, 1800, 1750, 1650, 1600] },
        { id: 3, name: 'Potato', icon: '🥔', currentPrice: 1200, previousPrice: 1100, unit: 'Quintal', change: 9.1, trend: 'up', bestMarket: 'Nashik APMC', markets: [{ name: 'Nashik APMC', price: 1200, distance: '5 km', trend: 'up' }, { name: 'Pune Market', price: 1180, distance: '185 km', trend: 'up' }], priceHistory: [900, 950, 1000, 1100, 1050, 1100, 1200] },
        { id: 4, name: 'Wheat', icon: '🌾', currentPrice: 2500, previousPrice: 2450, unit: 'Quintal', change: 2.0, trend: 'up', bestMarket: 'Nashik APMC', markets: [{ name: 'Nashik APMC', price: 2500, distance: '5 km', trend: 'stable' }], priceHistory: [2200, 2250, 2300, 2350, 2400, 2450, 2500] },
        { id: 5, name: 'Soybean', icon: '🫘', currentPrice: 4000, previousPrice: 3800, unit: 'Quintal', change: 5.3, trend: 'up', bestMarket: 'Nashik APMC', markets: [{ name: 'Nashik APMC', price: 4000, distance: '5 km', trend: 'up' }], priceHistory: [3400, 3500, 3600, 3750, 3800, 3900, 4000] },
        { id: 6, name: 'Cotton', icon: '🌿', currentPrice: 7000, previousPrice: 6800, unit: 'Quintal', change: 2.9, trend: 'up', bestMarket: 'Nashik APMC', markets: [{ name: 'Nashik APMC', price: 7000, distance: '5 km', trend: 'up' }], priceHistory: [6200, 6300, 6500, 6600, 6700, 6800, 7000] },
      ];
      renderPriceCards();
      renderPriceChart(0);
      renderMarketTable(0);
    });
}

function renderPriceCards() {
  const container = document.getElementById('priceCardList');
  if (!container) return;

  container.innerHTML = marketData.map((crop, i) => `
    <div class="price-card ${i === 0 ? 'active' : ''} mb-2" onclick="selectCrop(${i})" id="priceCard${i}">
      <div class="price-crop-icon">${crop.icon}</div>
      <div style="flex:1">
        <div class="price-crop-name">${crop.name}</div>
        <div class="price-value">${formatCurrency(crop.currentPrice)}/${crop.unit}</div>
      </div>
      <div style="text-align:right">
        <div class="${crop.trend === 'up' ? 'price-change-up' : 'price-change-down'}">
          ${crop.trend === 'up' ? '↑' : '↓'} ${Math.abs(crop.change)}%
        </div>
        <div style="font-size:0.7rem;color:var(--text-light)">${crop.bestMarket}</div>
      </div>
    </div>`).join('');
}

function selectCrop(index) {
  selectedCropIndex = index;
  document.querySelectorAll('.price-card').forEach((c, i) => {
    c.classList.toggle('active', i === index);
  });
  renderPriceChart(index);
  renderMarketTable(index);
  renderPriceDetail(index);
}

function renderPriceDetail(index) {
  const crop = marketData[index];
  const detailEl = document.getElementById('priceDetailHeader');
  if (!detailEl || !crop) return;

  const isUp = crop.trend === 'up';
  detailEl.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <div style="font-size:2.5rem">${crop.icon}</div>
      <div>
        <div style="font-size:1.3rem;font-weight:800;color:var(--text-dark)">${crop.name}</div>
        <div style="font-size:0.85rem;color:var(--text-light)">Best Market: ${crop.bestMarket}</div>
      </div>
      <div class="ms-auto text-end">
        <div style="font-size:1.8rem;font-weight:900;color:var(--green-dark)">${formatCurrency(crop.currentPrice)}</div>
        <div style="font-size:0.85rem;color:${isUp ? '#22C55E' : '#EF4444'};font-weight:700">
          ${isUp ? '↑' : '↓'} ${Math.abs(crop.change)}% from last week
        </div>
        <div style="font-size:0.8rem;color:var(--text-light)">Prev: ${formatCurrency(crop.previousPrice)}/${crop.unit}</div>
      </div>
    </div>`;
}

function renderPriceChart(index) {
  const ctx = document.getElementById('marketPriceChart');
  if (!ctx) return;

  const crop = marketData[index];
  if (!crop) return;

  const labels = ['4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', '1 Week Ago', '3 Days Ago', 'Yesterday', 'Today'];

  if (priceChart) priceChart.destroy();

  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${crop.name} Price (₹/${crop.unit})`,
        data: crop.priceHistory,
        borderColor: crop.trend === 'up' ? '#22C55E' : '#EF4444',
        backgroundColor: crop.trend === 'up' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: crop.trend === 'up' ? '#22C55E' : '#EF4444',
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'var(--card-bg)',
          titleColor: 'var(--text-dark)',
          bodyColor: 'var(--text-mid)',
          borderColor: 'var(--border)',
          borderWidth: 1,
          callbacks: {
            label: ctx => `₹${ctx.raw.toLocaleString('en-IN')}/${crop.unit}`,
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 11 } } },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: {
            color: '#6B7280',
            font: { size: 11 },
            callback: v => '₹' + v.toLocaleString('en-IN'),
          }
        }
      }
    }
  });

  renderPriceDetail(index);
}

function renderMarketTable(index) {
  const container = document.getElementById('marketTable');
  if (!container) return;

  const crop = marketData[index];
  if (!crop || !crop.markets) return;

  const trendIcon = { up: '↑', down: '↓', stable: '→' };
  const trendClass = { up: 'price-change-up', down: 'price-change-down', stable: 'text-muted' };

  container.innerHTML = `
    <table class="kisan-table w-100">
      <thead>
        <tr>
          <th>Market</th>
          <th>Price (₹/Quintal)</th>
          <th>Distance</th>
          <th>Trend</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${crop.markets.map(m => `
          <tr>
            <td><div style="font-weight:600">${m.name}</div></td>
            <td><div style="font-weight:800;color:var(--green-dark)">${formatCurrency(m.price)}</div></td>
            <td><span class="badge-green">${m.distance}</span></td>
            <td><span class="${trendClass[m.trend]}">${trendIcon[m.trend]} ${m.trend}</span></td>
            <td>
              <button class="btn-kisan-outline py-1 px-3" style="font-size:0.8rem" onclick="showToast('${m.name} details loaded', 'info')">
                View
              </button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function refreshPrices() {
  const btn = document.querySelector('.refresh-prices-btn');
  if (btn) {
    btn.innerHTML = `<div class="kisan-spinner me-2"></div> Refreshing...`;
    btn.disabled = true;
  }
  setTimeout(() => {
    renderPriceCards();
    renderPriceChart(selectedCropIndex);
    renderMarketTable(selectedCropIndex);
    if (btn) { btn.innerHTML = `<i class="bi bi-arrow-clockwise"></i> Refresh Prices`; btn.disabled = false; }
    showToast('Market prices refreshed', 'success');
  }, 1500);
}
