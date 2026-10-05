/**
 * KisanX AI - Transport Module
 */

let vehiclesData = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadVehicles();
  renderNotifications();
  initTransportForm();
});

function loadVehicles() {
  fetch('../data/vehicles.json')
    .then(r => r.json())
    .then(data => {
      vehiclesData = data;
      renderVehicles(data);
    })
    .catch(() => {
      vehiclesData = getDefaultVehicles();
      renderVehicles(vehiclesData);
    });
}

function getDefaultVehicles() {
  return [
    { id: 1, type: 'Mini Truck', icon: '🚛', capacity: '2 Tonnes', capacityTon: 2, available: true, rating: 4.7, driver: 'Sunil Patil', phone: '+91 98234 11111', costPerKm: 12, baseCost: 500, estimatedCost: 1500, distance: '12 km', plateNumber: 'MH-15-AB-1234', features: ['GPS Tracking', 'Refrigerated', 'Insurance'] },
    { id: 2, type: 'Medium Truck', icon: '🚚', capacity: '5 Tonnes', capacityTon: 5, available: true, rating: 4.5, driver: 'Ramesh Jadhav', phone: '+91 87654 22222', costPerKm: 18, baseCost: 800, estimatedCost: 2800, distance: '12 km', plateNumber: 'MH-15-CD-5678', features: ['GPS Tracking', 'Loading Help', 'Insurance'] },
    { id: 3, type: 'Large Truck', icon: '🚛', capacity: '10 Tonnes', capacityTon: 10, available: false, rating: 4.9, driver: 'Vijay Kumar', phone: '+91 77777 33333', costPerKm: 25, baseCost: 1200, estimatedCost: 4200, distance: '12 km', plateNumber: 'MH-15-EF-9012', features: ['GPS Tracking', 'Loading Help', 'Refrigerated', 'Insurance'] },
    { id: 4, type: 'Tractor Trolley', icon: '🚜', capacity: '3 Tonnes', capacityTon: 3, available: true, rating: 4.2, driver: 'Balaji Shinde', phone: '+91 99001 44444', costPerKm: 8, baseCost: 300, estimatedCost: 900, distance: '12 km', plateNumber: 'MH-15-GH-3456', features: ['GPS Tracking', 'Local Routes'] },
    { id: 5, type: 'Refrigerated Van', icon: '🚐', capacity: '1.5 Tonnes', capacityTon: 1.5, available: true, rating: 4.8, driver: 'Pradeep More', phone: '+91 88888 55555', costPerKm: 20, baseCost: 600, estimatedCost: 2400, distance: '12 km', plateNumber: 'MH-15-IJ-7890', features: ['GPS Tracking', 'Refrigerated', 'Temperature Control', 'Insurance'] },
  ];
}

function renderVehicles(vehicles) {
  const container = document.getElementById('vehiclesGrid');
  if (!container) return;

  container.innerHTML = vehicles.map(v => vehicleCardHTML(v)).join('');
}

function vehicleCardHTML(vehicle) {
  const stars = '★'.repeat(Math.floor(vehicle.rating));
  return `
    <div class="col-xl-4 col-lg-6 col-md-6 mb-4">
      <div class="vehicle-card ${!vehicle.available ? 'unavailable' : ''}">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <span style="font-size:1.8rem">${vehicle.icon}</span>
            <div>
              <div style="font-weight:700;color:var(--text-dark)">${vehicle.type}</div>
              <div style="font-size:0.75rem;color:var(--text-light)">${vehicle.plateNumber}</div>
            </div>
          </div>
          <span class="${vehicle.available ? 'badge bg-success' : 'badge bg-secondary'}" style="font-size:0.7rem">
            ${vehicle.available ? '✅ Available' : '❌ Booked'}
          </span>
        </div>
        
        <div class="row g-2 mb-3">
          <div class="col-6">
            <div class="p-2 rounded-2" style="background:var(--bg-light);text-align:center;border:1px solid var(--border)">
              <div style="font-size:0.7rem;color:var(--text-light)">CAPACITY</div>
              <div style="font-weight:700;font-size:0.95rem;color:var(--text-dark)">${vehicle.capacity}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-2 rounded-2" style="background:var(--bg-light);text-align:center;border:1px solid var(--border)">
              <div style="font-size:0.7rem;color:var(--text-light)">EST. COST</div>
              <div style="font-weight:700;font-size:0.95rem;color:var(--green-dark)">${formatCurrency(vehicle.estimatedCost)}</div>
            </div>
          </div>
        </div>
        
        <div class="crop-info-row">
          <span class="crop-info-label">👤 Driver</span>
          <span class="crop-info-value">${vehicle.driver}</span>
        </div>
        <div class="crop-info-row">
          <span class="crop-info-label">⭐ Rating</span>
          <span class="rating-stars">${stars} ${vehicle.rating}</span>
        </div>
        <div class="crop-info-row" style="border:none">
          <span class="crop-info-label">⚡ Features</span>
          <div class="d-flex gap-1 flex-wrap">
            ${vehicle.features.slice(0, 2).map(f => `<span class="badge-green" style="font-size:0.65rem">${f}</span>`).join('')}
          </div>
        </div>
        
        <div class="d-flex gap-2 mt-3">
          <button class="btn-kisan-primary flex-fill justify-content-center" 
            onclick="bookVehicle(${vehicle.id})" 
            ${!vehicle.available ? 'disabled' : ''}
            style="flex:1;${!vehicle.available ? 'opacity:0.5;cursor:not-allowed' : ''}">
            <i class="bi bi-calendar-check"></i> Book Now
          </button>
          <button class="btn-kisan-outline py-2 px-3" onclick="viewRoute(${vehicle.id})">
            <i class="bi bi-map"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function initTransportForm() {
  const form = document.getElementById('transportSearchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const crop = document.getElementById('transCrop').value;
    const qty = parseFloat(document.getElementById('transQty').value);
    const pickup = document.getElementById('transPickup').value;
    const dest = document.getElementById('transDest').value;
    const date = document.getElementById('transDate').value;

    if (!crop || !qty || !pickup || !dest || !date) {
      showToast('Please fill all fields', 'error');
      return;
    }

    if (qty <= 0) {
      showToast('Quantity must be positive', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = `<div class="kisan-spinner me-2"></div> Searching...`;
    btn.disabled = true;

    // Calculate route distance (mock)
    const mockDist = Math.floor(Math.random() * 100) + 20;

    setTimeout(() => {
      // Filter vehicles by required capacity
      const suitable = vehiclesData.filter(v => v.available && v.capacityTon >= qty / 10);
      const updated = suitable.map(v => ({
        ...v,
        estimatedCost: v.baseCost + (mockDist * v.costPerKm),
        distance: mockDist + ' km'
      }));

      renderVehicles(updated.length > 0 ? updated : vehiclesData);
      btn.innerHTML = `<i class="bi bi-search"></i> Search Transport`;
      btn.disabled = false;

      showToast(`Found ${suitable.length} suitable vehicle(s) for your route`, 'success');
      document.getElementById('vehiclesSection').scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  });
}

function bookVehicle(id) {
  const vehicle = vehiclesData.find(v => v.id === id);
  if (!vehicle || !vehicle.available) return;

  const crop = document.getElementById('transCrop')?.value || 'Tomato';
  const dest = document.getElementById('transDest')?.value || 'Nashik APMC';
  const date = document.getElementById('transDate')?.value || new Date().toLocaleDateString('en-IN');

  // Save booking to localStorage
  const bookings = loadFromStorage('transportBookings') || [];
  const booking = {
    id: Date.now(),
    vehicleId: id,
    vehicleType: vehicle.type,
    driver: vehicle.driver,
    crop, dest, date,
    cost: vehicle.estimatedCost,
    status: 'Confirmed',
    timestamp: new Date().toISOString(),
  };
  bookings.push(booking);
  saveToStorage('transportBookings', bookings);

  // Show success
  const successEl = document.getElementById('bookingSuccess');
  if (successEl) {
    successEl.innerHTML = `
      <div class="alert alert-success d-flex align-items-center gap-3 animate-fadeInUp" style="border-radius:12px;border:none;box-shadow:0 4px 16px rgba(34,197,94,0.2)">
        <div style="font-size:2rem">✅</div>
        <div>
          <div style="font-weight:700;font-size:1rem">Transport Booked Successfully!</div>
          <div style="font-size:0.875rem">${vehicle.type} with ${vehicle.driver} confirmed for ${formatDate(date)}</div>
          <div style="font-size:0.8rem;color:#15803D">Estimated Cost: ${formatCurrency(vehicle.estimatedCost)} | Vehicle: ${vehicle.plateNumber}</div>
        </div>
      </div>`;
    successEl.style.display = 'block';
    successEl.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { successEl.style.display = 'none'; }, 7000);
  }

  showToast(`🚛 ${vehicle.type} booked with ${vehicle.driver}!`, 'success');
}

function viewRoute(id) {
  const vehicle = vehiclesData.find(v => v.id === id);
  if (!vehicle) return;

  const pickup = document.getElementById('transPickup')?.value || 'Nashik Farm';
  const dest = document.getElementById('transDest')?.value || 'Nashik APMC';

  showToast(`Route: ${pickup} → ${dest} | ${vehicle.type} | Driver: ${vehicle.driver}`, 'info', 5000);
}

function filterVehiclesByType(type) {
  document.querySelectorAll('.vehicle-filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  if (type === 'all') {
    renderVehicles(vehiclesData);
  } else {
    const filtered = vehiclesData.filter(v => v.type.toLowerCase().includes(type.toLowerCase()));
    renderVehicles(filtered);
  }
}
