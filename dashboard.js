/**
 * KisanX AI - Dashboard Module
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initDashboard();
  renderNotifications();
  updateNotifBadge();
  startWeatherWidget();
  renderRecentActivity();
  renderTopCrops();
});

function initDashboard() {
  updateNavbarUser();
  const user = getUser();

  // Set welcome message
  const welcomeEl = document.getElementById('welcomeMsg');
  if (welcomeEl && user) {
    welcomeEl.textContent = `Welcome back, ${user.name || 'Farmer'} 👋`;
  }

  const locEl = document.getElementById('locationMsg');
  if (locEl && user) {
    locEl.textContent = `📍 ${user.location || 'Nashik, Maharashtra'}`;
  }

  // Animate stats
  animateStat('statCrops', 5);
  animateStat('statRevenue', 125000, true);
  animateStat('statOrders', 3);
  animateStat('statProfit', 53000, true);
}

function animateStat(id, target, isCurrency = false) {
  const el = document.getElementById(id);
  if (!el) return;

  let current = 0;
  const increment = target / 40;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = isCurrency ? formatCurrency(Math.floor(current)) : Math.floor(current).toLocaleString('en-IN');
    if (current >= target) clearInterval(timer);
  }, 30);
}

function startWeatherWidget() {
  const weather = AIEngine.getWeather();
  const w = weather.current;

  const weatherEl = document.getElementById('weatherWidget');
  if (!weatherEl) return;

  weatherEl.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <div style="font-size:2.5rem">${w.icon}</div>
      <div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--text-dark)">${w.temp}°C</div>
        <div style="font-size:0.8rem;color:var(--text-light)">${w.condition}</div>
        <div style="font-size:0.8rem;color:#3B82F6;font-weight:600">Rain ${w.rainfall}%</div>
      </div>
      <div style="border-left:1px solid var(--border);padding-left:1rem;margin-left:0.5rem">
        <div style="font-size:0.75rem;color:var(--text-light)">💧 Humidity</div>
        <div style="font-weight:700;font-size:0.9rem">${w.humidity}%</div>
        <div style="font-size:0.75rem;color:var(--text-light);margin-top:0.25rem">💨 Wind</div>
        <div style="font-weight:700;font-size:0.9rem">${w.wind} km/h</div>
      </div>
    </div>
    <div class="mt-3 p-2 rounded" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);font-size:0.8rem;color:#1D4ED8">
      💡 ${weather.advice}
    </div>
  `;
}

function renderRecentActivity() {
  const container = document.getElementById('recentActivity');
  if (!container) return;

  const activities = [
    { icon: '🌱', text: 'Added new crop: Tomato (2 Acres)', time: '2 hr ago', color: 'var(--green-agri)' },
    { icon: '💰', text: 'Tomato price updated: ₹2,800/Quintal', time: '4 hr ago', color: '#F59E0B' },
    { icon: '📦', text: 'New buyer request from Ravi Sharma', time: '6 hr ago', color: '#3B82F6' },
    { icon: '🚚', text: 'Transport booked for tomorrow (5AM)', time: '8 hr ago', color: '#8B5CF6' },
    { icon: '🤖', text: 'AI Disease Detection completed', time: '1 day ago', color: '#EC4899' },
  ];

  container.innerHTML = activities.map(a => `
    <div class="d-flex align-items-center gap-3 py-2" style="border-bottom:1px solid var(--border)">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${a.icon}</div>
      <div style="flex:1">
        <div style="font-size:0.85rem;font-weight:600;color:var(--text-dark)">${a.text}</div>
        <div style="font-size:0.75rem;color:var(--text-light)">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function renderTopCrops() {
  const container = document.getElementById('topCropsWidget');
  if (!container) return;

  const stored = loadFromStorage('crops');
  const crops = stored || [
    { name: 'Tomato', icon: '🍅', area: '2 Acres', health: 'Healthy', harvestDays: 25 },
    { name: 'Onion', icon: '🧅', area: '3 Acres', health: 'Good', harvestDays: 45 },
    { name: 'Wheat', icon: '🌾', area: '5 Acres', health: 'Healthy', harvestDays: 60 },
  ];

  container.innerHTML = crops.slice(0, 4).map(c => `
    <div class="d-flex align-items-center gap-3 py-2" style="border-bottom:1px solid var(--border)">
      <div style="font-size:1.5rem">${c.icon}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:0.9rem;color:var(--text-dark)">${c.name}</div>
        <div style="font-size:0.75rem;color:var(--text-light)">${c.area}</div>
      </div>
      <div class="crop-health-badge ${getHealthClass(c.health)}">${c.health}</div>
      <div style="text-align:right">
        <div style="font-size:0.75rem;color:var(--text-light)">Harvest in</div>
        <div style="font-weight:700;font-size:0.85rem;color:var(--green-agri)">${c.harvestDays}d</div>
      </div>
    </div>
  `).join('');
}

function getHealthClass(health) {
  const map = { 'Healthy': 'health-healthy', 'Good': 'health-good', 'Needs Attention': 'health-attention', 'Poor': 'health-poor' };
  return map[health] || 'health-good';
}

// Quick action handlers
function quickAction(action) {
  const routes = {
    addCrop: () => { window.location.href = 'crops.html'; setTimeout(() => showModal('addCropModal'), 500); },
    aiAdvisor: () => window.location.href = 'agri-hub.html#advisor',
    fertiliser: () => window.location.href = 'agri-hub.html#fertiliser',
    disease: () => window.location.href = 'agri-hub.html#disease',
    market: () => window.location.href = 'market.html',
    buyer: () => window.location.href = 'buyers.html',
    transport: () => window.location.href = 'transport.html',
    askAI: () => window.location.href = 'assistant.html',
  };
  if (routes[action]) routes[action]();
}

// Market price mini chart (dashboard)
function initDashboardChart() {
  const ctx = document.getElementById('dashboardChart');
  if (!ctx) return;

  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: [45000, 62000, 58000, 78000, 95000, 125000],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34,197,94,0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22C55E',
          pointRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => '₹' + ctx.raw.toLocaleString('en-IN'),
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 11 } } },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            color: '#6B7280',
            font: { size: 11 },
            callback: v => '₹' + (v / 1000) + 'K',
          }
        }
      }
    }
  });
}

// Initialize chart if dashboard page
window.addEventListener('load', () => {
  if (document.getElementById('dashboardChart')) {
    initDashboardChart();
  }
});
