/**
 * KisanX AI - Analytics Module
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNotifications();
  renderAnalyticsSummary();
  initCharts();
});

function renderAnalyticsSummary() {
  animateStat('totalRevenue', 251900, true);
  animateStat('totalExpenses', 98500, true);
  animateStat('netProfit', 153400, true);
  animateStat('totalSales', 17);
}

function initCharts() {
  initRevenueChart();
  initCropPerformanceChart();
  initExpenseChart();
  initMarketTrendChart();
}

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const chartDefaults = {
  font: { family: 'Inter', size: 12 },
  gridColor: 'rgba(0,0,0,0.04)',
  tickColor: '#9CA3AF',
};

// ======= MONTHLY REVENUE =======
function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: [38000, 52000, 61000, 78000, 95000, 125000],
          backgroundColor: 'rgba(34,197,94,0.8)',
          borderColor: '#22C55E',
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Expenses (₹)',
          data: [12000, 18000, 22000, 28000, 35000, 42000],
          backgroundColor: 'rgba(239,68,68,0.7)',
          borderColor: '#EF4444',
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: chartDefaults.font, padding: 16 } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: chartDefaults.font } },
        y: {
          grid: { color: chartDefaults.gridColor },
          ticks: { font: chartDefaults.font, callback: v => '₹' + (v / 1000) + 'K' }
        }
      }
    }
  });
}

// ======= CROP PERFORMANCE =======
function initCropPerformanceChart() {
  const ctx = document.getElementById('cropPerformanceChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tomato', 'Onion', 'Wheat', 'Soybean', 'Cotton'],
      datasets: [{
        data: [50400, 48000, 37500, 32000, 84000],
        backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'],
        borderWidth: 3,
        borderColor: 'var(--card-bg)',
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font: chartDefaults.font, padding: 12, usePointStyle: true } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')}` } }
      },
      cutout: '60%',
    }
  });
}

// ======= EXPENSES VS REVENUE =======
function initExpenseChart() {
  const ctx = document.getElementById('expenseChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          data: [38000, 52000, 61000, 78000, 95000, 125000],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34,197,94,0.06)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#22C55E',
        },
        {
          label: 'Expenses',
          data: [12000, 18000, 22000, 28000, 35000, 42000],
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239,68,68,0.04)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#EF4444',
        },
        {
          label: 'Net Profit',
          data: [26000, 34000, 39000, 50000, 60000, 83000],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.04)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          borderDash: [5, 3],
          pointBackgroundColor: '#3B82F6',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: chartDefaults.font, padding: 16 } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: chartDefaults.font } },
        y: {
          grid: { color: chartDefaults.gridColor },
          ticks: { font: chartDefaults.font, callback: v => '₹' + (v / 1000) + 'K' }
        }
      }
    }
  });
}

// ======= MARKET PRICE TREND =======
function initMarketTrendChart() {
  const ctx = document.getElementById('marketTrendChart');
  if (!ctx) return;

  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [
        {
          label: 'Tomato (₹/Q)',
          data: [2100, 2300, 2450, 2582, 2620, 2700, 2800],
          borderColor: '#EF4444',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#EF4444',
        },
        {
          label: 'Onion (₹/Q)',
          data: [2200, 2000, 1900, 1800, 1750, 1650, 1600],
          borderColor: '#8B5CF6',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#8B5CF6',
        },
        {
          label: 'Wheat (₹/Q)',
          data: [2200, 2250, 2300, 2350, 2400, 2450, 2500],
          borderColor: '#F59E0B',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#F59E0B',
        },
        {
          label: 'Soybean (₹/Q)',
          data: [3400, 3500, 3600, 3750, 3800, 3900, 4000],
          borderColor: '#22C55E',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#22C55E',
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: chartDefaults.font, padding: 12, usePointStyle: true } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: chartDefaults.font } },
        y: {
          grid: { color: chartDefaults.gridColor },
          ticks: { font: chartDefaults.font, callback: v => '₹' + v.toLocaleString('en-IN') }
        }
      }
    }
  });
}

function exportReport() {
  const report = {
    generated: new Date().toLocaleString('en-IN'),
    farmer: getUser()?.name || 'Ramesh Patil',
    location: 'Nashik, Maharashtra',
    period: 'May - October 2026',
    summary: {
      totalRevenue: 251900,
      totalExpenses: 98500,
      netProfit: 153400,
      totalSales: 17,
    },
    crops: [
      { name: 'Tomato', revenue: 50400 },
      { name: 'Onion', revenue: 48000 },
      { name: 'Wheat', revenue: 37500 },
      { name: 'Soybean', revenue: 32000 },
      { name: 'Cotton', revenue: 84000 },
    ]
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'KisanX-Analytics-Report.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📊 Analytics report downloaded!', 'success');
}

function changeChartPeriod(period) {
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  showToast(`Showing ${period === '6m' ? '6 Month' : period === '3m' ? '3 Month' : '1 Month'} data`, 'info');
}
