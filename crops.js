/**
 * KisanX AI - Crops Module
 */

let cropsData = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadCrops();
  renderCrops();
  renderNotifications();
  initAddCropModal();
  initCropSearch();
});

function loadCrops() {
  const stored = loadFromStorage('crops');
  if (stored && stored.length > 0) {
    cropsData = stored;
  } else {
    // Default crops
    cropsData = [
      { id: 1, name: 'Tomato', icon: '🍅', area: '2', areaUnit: 'Acres', plantingDate: '2026-08-01', soilType: 'Loamy', stage: 'Flowering', health: 'Healthy', harvestDays: 25, expectedYield: '18 Tonnes', estimatedRevenue: 50400, waterReq: 'Medium' },
      { id: 2, name: 'Onion', icon: '🧅', area: '3', areaUnit: 'Acres', plantingDate: '2026-07-15', soilType: 'Sandy Loam', stage: 'Bulbing', health: 'Good', harvestDays: 45, expectedYield: '24 Tonnes', estimatedRevenue: 48000, waterReq: 'Low' },
      { id: 3, name: 'Wheat', icon: '🌾', area: '5', areaUnit: 'Acres', plantingDate: '2026-06-01', soilType: 'Clayey', stage: 'Grain Filling', health: 'Healthy', harvestDays: 60, expectedYield: '15 Tonnes', estimatedRevenue: 37500, waterReq: 'Medium' },
      { id: 4, name: 'Soybean', icon: '🫘', area: '4', areaUnit: 'Acres', plantingDate: '2026-07-01', soilType: 'Loamy', stage: 'Vegetative', health: 'Needs Attention', harvestDays: 90, expectedYield: '8 Tonnes', estimatedRevenue: 32000, waterReq: 'Medium' },
      { id: 5, name: 'Cotton', icon: '🌿', area: '6', areaUnit: 'Acres', plantingDate: '2026-05-15', soilType: 'Black', stage: 'Boll Formation', health: 'Healthy', harvestDays: 120, expectedYield: '12 Tonnes', estimatedRevenue: 84000, waterReq: 'High' },
    ];
    saveToStorage('crops', cropsData);
  }
}

function renderCrops(filter = 'all') {
  const container = document.getElementById('cropsGrid');
  const countEl = document.getElementById('cropCount');
  if (!container) return;

  let filtered = cropsData;
  if (filter === 'healthy') filtered = cropsData.filter(c => c.health === 'Healthy' || c.health === 'Good');
  if (filter === 'attention') filtered = cropsData.filter(c => c.health === 'Needs Attention' || c.health === 'Poor');

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <div class="empty-state-icon">🌱</div>
          <h5>No crops found</h5>
          <p class="text-muted">Add your first crop to get started</p>
          <button class="btn-kisan-primary" onclick="showModal('addCropModal')">
            <i class="bi bi-plus-circle"></i> Add Crop
          </button>
        </div>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(crop => cropCardHTML(crop)).join('');
}

function cropCardHTML(crop) {
  const healthClass = getHealthClass(crop.health);
  const progress = Math.max(5, Math.min(95, Math.round((1 - crop.harvestDays / 150) * 100)));

  return `
    <div class="col-xl-4 col-lg-6 col-md-6 mb-4" id="cropCard${crop.id}">
      <div class="crop-card">
        <div class="crop-card-header">
          <div class="crop-emoji">${crop.icon}</div>
          <div>
            <div class="crop-name">${crop.name}</div>
            <div class="crop-area">${crop.area} ${crop.areaUnit || 'Acres'}</div>
          </div>
          <div class="ms-auto">
            <span class="crop-health-badge ${healthClass}">${crop.health}</span>
          </div>
        </div>
        <div class="crop-card-body">
          <div class="crop-info-row">
            <span class="crop-info-label">Growth Stage</span>
            <span class="crop-info-value">${crop.stage}</span>
          </div>
          <div class="crop-info-row">
            <span class="crop-info-label">Soil Type</span>
            <span class="crop-info-value">${crop.soilType}</span>
          </div>
          <div class="crop-info-row">
            <span class="crop-info-label">Planted</span>
            <span class="crop-info-value">${formatDate(crop.plantingDate)}</span>
          </div>
          <div class="crop-info-row">
            <span class="crop-info-label">Expected Yield</span>
            <span class="crop-info-value">${crop.expectedYield}</span>
          </div>
          <div class="crop-info-row">
            <span class="crop-info-label">Est. Revenue</span>
            <span class="crop-info-value text-green">${formatCurrency(crop.estimatedRevenue)}</span>
          </div>
          <div class="harvest-progress mt-3">
            <div class="d-flex justify-content-between mb-1">
              <span style="font-size:0.78rem;color:var(--text-light)">Harvest Progress</span>
              <span style="font-size:0.78rem;font-weight:700;color:var(--green-agri)">${crop.harvestDays} days left</span>
            </div>
            <div class="progress" style="height:8px;border-radius:8px;background:var(--bg-light)">
              <div class="progress-bar progress-bar-green" role="progressbar" style="width:${progress}%;border-radius:8px"></div>
            </div>
          </div>
          <div class="d-flex gap-2 mt-3">
            <button class="btn-kisan-outline flex-1 py-2" onclick="viewCropDetail(${crop.id})" style="flex:1;justify-content:center">
              <i class="bi bi-eye"></i> View
            </button>
            <button class="btn-kisan-outline flex-1 py-2" onclick="editCrop(${crop.id})" style="flex:1;justify-content:center;border-color:#F59E0B;color:#F59E0B">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn-kisan-outline flex-1 py-2" onclick="deleteCrop(${crop.id})" style="flex:1;justify-content:center;border-color:#EF4444;color:#EF4444">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function initAddCropModal() {
  const form = document.getElementById('addCropForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cropName').value;
    const area = document.getElementById('cropArea').value;
    const plantingDate = document.getElementById('plantingDate').value;
    const soilType = document.getElementById('cropSoil').value;
    const stage = document.getElementById('cropStage').value;

    if (!name || !area || !plantingDate || !soilType || !stage) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (parseFloat(area) <= 0) {
      showToast('Farm area must be positive', 'error');
      return;
    }

    const icons = { Tomato: '🍅', Onion: '🧅', Wheat: '🌾', Soybean: '🫘', Cotton: '🌿', Potato: '🥔', Chili: '🌶️', Maize: '🌽', Rice: '🌾', Sugarcane: '🎋' };
    const icon = icons[name] || '🌿';

    const newCrop = {
      id: Date.now(),
      name, icon,
      area, areaUnit: 'Acres',
      plantingDate, soilType, stage,
      health: 'Healthy',
      harvestDays: Math.floor(Math.random() * 80) + 30,
      expectedYield: `${Math.floor(Math.random() * 15) + 8} Tonnes`,
      estimatedRevenue: Math.floor(Math.random() * 50000) + 25000,
      waterReq: 'Medium',
    };

    cropsData.push(newCrop);
    saveToStorage('crops', cropsData);
    renderCrops();
    hideModal('addCropModal');
    form.reset();
    showToast(`✅ ${name} crop added successfully!`, 'success');
  });
}

function deleteCrop(id) {
  if (!confirm('Delete this crop?')) return;
  cropsData = cropsData.filter(c => c.id !== id);
  saveToStorage('crops', cropsData);
  const card = document.getElementById('cropCard' + id);
  if (card) {
    card.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => renderCrops(), 300);
  }
  showToast('Crop deleted', 'info');
}

function editCrop(id) {
  const crop = cropsData.find(c => c.id === id);
  if (!crop) return;

  document.getElementById('cropName').value = crop.name;
  document.getElementById('cropArea').value = crop.area;
  document.getElementById('plantingDate').value = crop.plantingDate;
  document.getElementById('cropSoil').value = crop.soilType;
  document.getElementById('cropStage').value = crop.stage;

  const form = document.getElementById('addCropForm');
  form.dataset.editId = id;

  document.getElementById('addCropModalLabel').textContent = 'Edit Crop';
  showModal('addCropModal');
}

function viewCropDetail(id) {
  const crop = cropsData.find(c => c.id === id);
  if (!crop) return;

  const modal = document.getElementById('cropDetailModal');
  if (!modal) return;

  modal.querySelector('.modal-title').textContent = `${crop.icon} ${crop.name} Details`;
  document.getElementById('cropDetailContent').innerHTML = `
    <div class="row g-3">
      <div class="col-6">
        <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-light);font-weight:600;text-transform:uppercase">Area</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--text-dark)">${crop.area} Acres</div>
        </div>
      </div>
      <div class="col-6">
        <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-light);font-weight:600;text-transform:uppercase">Health</div>
          <div><span class="crop-health-badge mt-1 d-inline-block ${getHealthClass(crop.health)}">${crop.health}</span></div>
        </div>
      </div>
      <div class="col-6">
        <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-light);font-weight:600;text-transform:uppercase">Stage</div>
          <div style="font-size:1rem;font-weight:700;color:var(--text-dark)">${crop.stage}</div>
        </div>
      </div>
      <div class="col-6">
        <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-light);font-weight:600;text-transform:uppercase">Harvest In</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--green-agri)">${crop.harvestDays} Days</div>
        </div>
      </div>
      <div class="col-12">
        <div class="p-3 rounded-3" style="background:var(--green-light);border:1px solid rgba(34,197,94,0.2)">
          <div style="font-size:0.75rem;color:var(--green-dark);font-weight:700;text-transform:uppercase">Estimated Revenue</div>
          <div style="font-size:1.5rem;font-weight:900;color:var(--green-dark)">${formatCurrency(crop.estimatedRevenue)}</div>
          <div style="font-size:0.8rem;color:var(--text-light)">Expected Yield: ${crop.expectedYield}</div>
        </div>
      </div>
      <div class="col-12">
        <div class="d-flex gap-2 flex-wrap">
          <div class="badge-green">🌱 ${crop.soilType} Soil</div>
          <div class="badge-green">💧 ${crop.waterReq} Water</div>
          <div class="badge-green">📅 Planted ${formatDate(crop.plantingDate)}</div>
        </div>
      </div>
    </div>`;

  showModal('cropDetailModal');
}

function initCropSearch() {
  const searchInput = document.getElementById('cropSearch');
  if (!searchInput) return;
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    if (q === '') {
      renderCrops();
      return;
    }
    const container = document.getElementById('cropsGrid');
    const filtered = cropsData.filter(c => c.name.toLowerCase().includes(q) || c.stage.toLowerCase().includes(q));
    container.innerHTML = filtered.map(c => cropCardHTML(c)).join('');
  });
}

function filterCrops(filter) {
  document.querySelectorAll('.crop-filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderCrops(filter);
}
