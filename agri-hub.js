/**
 * KisanX AI - AI Agri Hub Module
 * Features: Crop Advisor, Fertiliser, Disease Detection, Weather, AI Chat
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNotifications();
  initCropAdvisor();
  initFertiliserAdvisor();
  initDiseaseDetection();
  initWeatherIntelligence();
  initHubLangSelector();

  // Handle hash-based tab
  const hash = window.location.hash;
  if (hash) {
    const tab = document.querySelector(`[data-hub-tab="${hash.replace('#', '')}"]`);
    if (tab) tab.click();
  }
});

// ======= CROP ADVISOR =======
function initCropAdvisor() {
  const form = document.getElementById('cropAdvisorForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = {
      location: document.getElementById('advisorLocation').value,
      soil: document.getElementById('advisorSoil').value,
      season: document.getElementById('advisorSeason').value,
      water: document.getElementById('advisorWater').value,
      farmSize: document.getElementById('advisorFarmSize').value,
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = `<div class="kisan-spinner me-2"></div> ${t('loading')}`;
    btn.disabled = true;

    showLoader('cropAdvisorResult', 'AI is analyzing your farm conditions...');

    setTimeout(() => {
      const result = AIEngine.cropRecommendation(params);
      renderCropAdvisorResult(result);
      btn.innerHTML = `<i class="bi bi-stars"></i> ${t('getRecommendation')}`;
      btn.disabled = false;
    }, 2200);
  });
}

function renderCropAdvisorResult(result) {
  const container = document.getElementById('cropAdvisorResult');
  if (!container) return;

  container.innerHTML = `
    <div class="ai-result-box animate-fadeInUp">
      <div class="ai-result-title">
        <i class="bi bi-stars text-warning"></i>
        AI Crop Recommendation
        <span class="ai-demo-badge ms-auto">🤖 AI Demo</span>
      </div>
      
      <div class="text-center py-3 mb-3" style="background:var(--green-light);border-radius:12px">
        <div style="font-size:3rem">${result.icon}</div>
        <div style="font-size:1.5rem;font-weight:900;color:var(--green-dark)">${result.crop}</div>
        <div style="font-size:0.85rem;color:var(--text-light)">Best crop for your conditions</div>
        <div class="mt-2">
          <div class="progress mx-auto" style="height:10px;width:200px;border-radius:10px;background:rgba(34,197,94,0.15)">
            <div class="progress-bar progress-bar-green" style="width:${result.suitability}%;border-radius:10px" role="progressbar"></div>
          </div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--green-dark);margin-top:0.25rem">${result.suitability}% Suitability</div>
        </div>
      </div>
      
      <div class="ai-metric">
        <span class="ai-metric-label">📍 Location</span>
        <span class="ai-metric-value">${result.location}</span>
      </div>
      <div class="ai-metric">
        <span class="ai-metric-label">🌱 Season</span>
        <span class="ai-metric-value">${result.season}</span>
      </div>
      <div class="ai-metric">
        <span class="ai-metric-label">📊 Expected Yield</span>
        <span class="ai-metric-value">${result.yield}</span>
      </div>
      <div class="ai-metric">
        <span class="ai-metric-label">💧 Water Requirement</span>
        <span class="ai-metric-value">${result.water}</span>
      </div>
      <div class="ai-metric">
        <span class="ai-metric-label">⏱ Duration</span>
        <span class="ai-metric-value">${result.duration}</span>
      </div>
      <div class="ai-metric">
        <span class="ai-metric-label">💰 Expected Profit</span>
        <span class="ai-metric-value text-green">${result.profit}</span>
      </div>
      
      <div class="mt-3 p-2 rounded-2" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2)">
        <div style="font-size:0.8rem;font-weight:700;color:#1D4ED8">💡 Alternative crops:</div>
        <div class="d-flex gap-2 flex-wrap mt-1">
          ${result.alternatives.map(a => `<span class="badge-green">${a}</span>`).join('')}
        </div>
      </div>
    </div>`;
}

// ======= FERTILISER ADVISOR =======
function initFertiliserAdvisor() {
  const form = document.getElementById('fertiliserForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = {
      crop: document.getElementById('fertCrop').value,
      soil: document.getElementById('fertSoil').value,
      stage: document.getElementById('fertStage').value,
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = `<div class="kisan-spinner me-2"></div> Analysing...`;
    btn.disabled = true;

    showLoader('fertiliserResult', 'Analysing fertiliser requirements...');

    setTimeout(() => {
      const result = AIEngine.fertiliserRecommendation(params);
      renderFertiliserResult(result);
      btn.innerHTML = `<i class="bi bi-flask"></i> Analyse Fertiliser Needs`;
      btn.disabled = false;
    }, 1800);
  });
}

function renderFertiliserResult(result) {
  const container = document.getElementById('fertiliserResult');
  if (!container) return;

  const levelColor = { 'Low': '#22C55E', 'Medium': '#F59E0B', 'High': '#EF4444', 'Very High': '#DC2626' };
  const levelWidth = { 'Low': 30, 'Medium': 55, 'High': 80, 'Very High': 95 };

  function npkBar(label, level) {
    return `
      <div class="mb-3">
        <div class="d-flex justify-content-between mb-1">
          <span style="font-size:0.875rem;font-weight:600;color:var(--text-dark)">${label}</span>
          <span style="font-size:0.875rem;font-weight:700;color:${levelColor[level] || '#22C55E'}">${level}</span>
        </div>
        <div class="progress" style="height:10px;border-radius:10px;background:var(--bg-light)">
          <div class="progress-bar" style="width:${levelWidth[level] || 50}%;border-radius:10px;background:${levelColor[level] || '#22C55E'}"></div>
        </div>
      </div>`;
  }

  container.innerHTML = `
    <div class="ai-result-box animate-fadeInUp">
      <div class="ai-result-title">
        <i class="bi bi-flask-fill text-warning"></i>
        Fertiliser Recommendation for ${result.crop}
        <span class="ai-demo-badge ms-auto">🤖 AI Demo</span>
      </div>
      
      <div class="mb-3">
        ${npkBar('Nitrogen (N)', result.N)}
        ${npkBar('Phosphorus (P)', result.P)}
        ${npkBar('Potassium (K)', result.K)}
      </div>
      
      <div class="p-3 rounded-3 mb-3" style="background:var(--green-light);border:1px solid rgba(34,197,94,0.3)">
        <div style="font-size:0.75rem;font-weight:700;color:var(--green-dark);text-transform:uppercase">Primary Recommendation</div>
        <div style="font-size:1.2rem;font-weight:900;color:var(--green-dark)">${result.primary}</div>
        <div style="font-size:0.85rem;color:var(--text-mid)">${result.stage} stage | ${result.crop}</div>
      </div>
      
      <div class="ai-metric">
        <span class="ai-metric-label">📅 Application Timing</span>
        <span class="ai-metric-value">${result.schedule}</span>
      </div>
      <div class="ai-metric">
        <span class="ai-metric-label">⚠️ Safety</span>
        <span class="ai-metric-value" style="color:#D97706">${result.safety}</span>
      </div>
      
      <div class="mt-3">
        <div style="font-size:0.8rem;font-weight:700;color:var(--text-dark)">💊 Micronutrients:</div>
        <div class="d-flex gap-2 flex-wrap mt-1">
          ${result.micronutrients.map(m => `<span class="badge-green">${m}</span>`).join('')}
        </div>
      </div>
    </div>`;
}

// ======= DISEASE DETECTION =======
function initDiseaseDetection() {
  const uploadArea = document.getElementById('imageUploadArea');
  const fileInput = document.getElementById('leafImage');

  if (!uploadArea || !fileInput) return;

  uploadArea.addEventListener('click', () => fileInput.click());

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--green-agri)';
    uploadArea.style.background = 'rgba(34,197,94,0.05)';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  });
}

function handleImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    showToast('Please upload a valid image (JPG, PNG, WEBP)', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image must be smaller than 5MB', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const uploadArea = document.getElementById('imageUploadArea');
    uploadArea.innerHTML = `
      <img src="${e.target.result}" style="max-width:100%;max-height:220px;object-fit:contain;border-radius:10px" />
      <div class="mt-2" style="font-size:0.8rem;color:var(--text-light)">
        ${file.name} (${(file.size / 1024).toFixed(1)} KB)
      </div>`;

    document.getElementById('analyzeBtn').disabled = false;
    document.getElementById('analyzeBtn').classList.add('btn-kisan-primary');
  };
  reader.readAsDataURL(file);
}

function analyzeDisease() {
  const fileInput = document.getElementById('leafImage');
  const file = fileInput?.files[0];
  const btn = document.getElementById('analyzeBtn');

  btn.innerHTML = `<div class="kisan-spinner me-2"></div> AI Scanning...`;
  btn.disabled = true;

  showLoader('diseaseResult', 'AI is scanning your crop image...');

  setTimeout(() => {
    const result = AIEngine.detectDisease(file?.name || 'leaf.jpg');
    renderDiseaseResult(result);
    btn.innerHTML = `<i class="bi bi-search"></i> Analyze Crop`;
    btn.disabled = false;
  }, 3000);
}

function renderDiseaseResult(result) {
  const container = document.getElementById('diseaseResult');
  if (!container) return;

  const isHealthy = result.name === 'Healthy Plant';
  const severityColor = isHealthy ? '#22C55E' : result.confidence > 90 ? '#EF4444' : '#F59E0B';

  container.innerHTML = `
    <div class="ai-result-box animate-fadeInUp">
      <div class="ai-result-title">
        <i class="bi bi-bug-fill" style="color:${severityColor}"></i>
        Disease Analysis Result
        <span class="ai-demo-badge ms-auto">🤖 AI Demo</span>
      </div>
      
      <div class="text-center py-3 mb-3" style="background:${isHealthy ? 'var(--green-light)' : '#FEF2F2'};border-radius:12px">
        <div style="font-size:2rem">${isHealthy ? '✅' : '⚠️'}</div>
        <div style="font-size:1.3rem;font-weight:900;color:${severityColor}">${result.name}</div>
        <div style="font-size:0.85rem;color:var(--text-light)">Pathogen: ${result.pathogen}</div>
        
        <div class="confidence-bar px-4 mt-2">
          <div class="d-flex justify-content-between mb-1">
            <span style="font-size:0.75rem;color:var(--text-light)">Confidence</span>
            <span style="font-size:0.875rem;font-weight:700;color:${severityColor}">${result.confidence}%</span>
          </div>
          <div class="progress" style="height:10px;border-radius:10px;background:rgba(0,0,0,0.08)">
            <div class="progress-bar progress-bar-animated" style="width:${result.confidence}%;border-radius:10px;background:${severityColor}"></div>
          </div>
        </div>
      </div>
      
      <div class="row g-2">
        <div class="col-12">
          <div class="p-3 rounded-3" style="background:var(--bg-light);border:1px solid var(--border)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-dark);margin-bottom:0.5rem">🔬 SYMPTOMS</div>
            ${result.symptoms.map(s => `<div style="font-size:0.85rem;color:var(--text-mid);padding:2px 0">• ${s}</div>`).join('')}
          </div>
        </div>
        <div class="col-12">
          <div class="p-3 rounded-3" style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15)">
            <div style="font-size:0.75rem;font-weight:700;color:#DC2626;margin-bottom:0.5rem">💊 MANAGEMENT</div>
            ${result.management.map(m => `<div style="font-size:0.85rem;color:var(--text-mid);padding:2px 0">• ${m}</div>`).join('')}
          </div>
        </div>
        <div class="col-12">
          <div class="p-3 rounded-3" style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.15)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--green-dark);margin-bottom:0.5rem">🛡️ PREVENTION</div>
            ${result.prevention.map(p => `<div style="font-size:0.85rem;color:var(--text-mid);padding:2px 0">• ${p}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

// ======= WEATHER INTELLIGENCE =======
function initWeatherIntelligence() {
  const container = document.getElementById('weatherIntelligence');
  if (!container) return;

  const weather = AIEngine.getWeather();
  renderWeatherUI(weather, container);
}

function renderWeatherUI(weather, container) {
  const w = weather.current;
  container.innerHTML = `
    <div class="row g-3">
      <div class="col-lg-4 col-md-6">
        <div class="weather-current-widget">
          <div style="font-size:3rem">${w.icon}</div>
          <div class="weather-temp-big">${w.temp}°C</div>
          <div style="opacity:0.85;font-size:0.95rem;margin-top:0.25rem">${w.condition}</div>
          <div style="margin-top:0.5rem;font-size:0.85rem;opacity:0.75">📍 Nashik, Maharashtra</div>
          <div class="row g-2 mt-2">
            <div class="col-4 text-center">
              <div style="opacity:0.7;font-size:0.7rem">HUMIDITY</div>
              <div style="font-weight:700">${w.humidity}%</div>
            </div>
            <div class="col-4 text-center">
              <div style="opacity:0.7;font-size:0.7rem">WIND</div>
              <div style="font-weight:700">${w.wind} km/h</div>
            </div>
            <div class="col-4 text-center">
              <div style="opacity:0.7;font-size:0.7rem">RAIN</div>
              <div style="font-weight:700">${w.rainfall}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-8 col-md-6">
        <div class="kisan-card h-100">
          <div class="kisan-card-header">
            <span class="kisan-card-title">📅 7-Day Forecast</span>
          </div>
          <div class="row g-2">
            ${weather.forecast.map(day => `
              <div class="col">
                <div class="weather-day-card">
                  <div class="weather-day">${day.day}</div>
                  <div class="weather-icon-big">${day.icon}</div>
                  <div class="weather-temp">${day.temp}°</div>
                  <div class="weather-rain">💧${day.rain}%</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      
      <div class="col-12">
        <div class="ai-result-box">
          <div class="ai-result-title">
            <i class="bi bi-lightbulb-fill text-warning"></i>
            AI Weather Advisory
            <span class="ai-demo-badge ms-auto">🤖 AI Demo</span>
          </div>
          <p style="color:var(--text-mid);font-size:0.9rem;margin:0">${weather.advice}</p>
          
          <div class="row g-2 mt-2">
            <div class="col-md-4">
              <div class="p-2 rounded-2" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15)">
                <div style="font-size:0.75rem;font-weight:700;color:#1D4ED8">🌧 IRRIGATION</div>
                <div style="font-size:0.8rem;color:var(--text-mid)">Delay irrigation 2 days - Rain expected</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-2 rounded-2" style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.15)">
                <div style="font-size:0.75rem;font-weight:700;color:var(--green-dark)">🌡 TEMPERATURE</div>
                <div style="font-size:0.8rem;color:var(--text-mid)">Optimal for Tomato & Onion growth</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-2 rounded-2" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15)">
                <div style="font-size:0.75rem;font-weight:700;color:#D97706">⚠️ FUNGAL RISK</div>
                <div style="font-size:0.8rem;color:var(--text-mid)">High humidity - Apply fungicide preventively</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function initHubLangSelector() {
  // Handled by app.js initLangSelector
}

// Hub tab switching
function switchHubTab(tab) {
  document.querySelectorAll('.hub-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('[data-hub-tab]').forEach(btn => btn.classList.remove('active'));

  const content = document.getElementById(`hub-${tab}`);
  if (content) content.style.display = 'block';

  const btn = document.querySelector(`[data-hub-tab="${tab}"]`);
  if (btn) btn.classList.add('active');

  window.location.hash = tab;
}
