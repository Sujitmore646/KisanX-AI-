/**
 * KisanX AI - Core Application Module
 * Handles: Auth, Theme, Language, Notifications, Toast, Shared Utils
 */

// ======= GLOBAL APP STATE =======
const KisanApp = {
  version: '1.0.0',
  name: 'KisanX AI',
  location: 'Nashik, Maharashtra',
  currency: '₹',
  language: 'en',
  darkMode: false,
  user: null,
};

// ======= TRANSLATIONS =======
const translations = {
  en: {
    dashboard: 'Dashboard',
    aiHub: 'AI Agri Hub',
    myCrops: 'My Crops',
    market: 'Market Prices',
    buyers: 'Find Buyers',
    transport: 'Transport',
    orders: 'Orders',
    analytics: 'Analytics',
    assistant: 'AI Assistant',
    profile: 'Profile',
    logout: 'Logout',
    welcome: 'Welcome, Farmer',
    addCrop: 'Add Crop',
    aiAdvisor: 'AI Crop Advisor',
    fertiliser: 'Fertiliser Advice',
    disease: 'Disease Detection',
    marketPrices: 'Market Prices',
    findBuyer: 'Find Buyer',
    bookTransport: 'Book Transport',
    askAI: 'Ask AI',
    getRecommendation: 'Get AI Recommendation',
    loading: 'Analyzing...',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    aiHub: 'AI कृषि हब',
    myCrops: 'मेरी फसलें',
    market: 'बाजार भाव',
    buyers: 'खरीदार खोजें',
    transport: 'परिवहन',
    orders: 'ऑर्डर',
    analytics: 'विश्लेषण',
    assistant: 'AI सहायक',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    welcome: 'स्वागत, किसान',
    addCrop: 'फसल जोड़ें',
    aiAdvisor: 'AI फसल सलाहकार',
    fertiliser: 'उर्वरक सलाह',
    disease: 'रोग पहचान',
    marketPrices: 'बाजार भाव',
    findBuyer: 'खरीदार खोजें',
    bookTransport: 'परिवहन बुक',
    askAI: 'AI से पूछें',
    getRecommendation: 'AI अनुशंसा पाएं',
    loading: 'विश्लेषण हो रहा है...',
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    aiHub: 'AI कृषी हब',
    myCrops: 'माझी पिके',
    market: 'बाजारभाव',
    buyers: 'खरेदीदार शोधा',
    transport: 'वाहतूक',
    orders: 'ऑर्डर',
    analytics: 'विश्लेषण',
    assistant: 'AI सहाय्यक',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    welcome: 'स्वागत, शेतकरी',
    addCrop: 'पीक जोडा',
    aiAdvisor: 'AI पीक सल्लागार',
    fertiliser: 'खत सल्ला',
    disease: 'रोग ओळख',
    marketPrices: 'बाजारभाव',
    findBuyer: 'खरेदीदार शोधा',
    bookTransport: 'वाहतूक बुक करा',
    askAI: 'AI ला विचारा',
    getRecommendation: 'AI शिफारस मिळवा',
    loading: 'विश्लेषण होत आहे...',
  }
};

// ======= INIT =======
document.addEventListener('DOMContentLoaded', () => {
  loadAppPreferences();
  initDarkModeToggle();
  initLangSelector();
  initNavScroll();
  setupSidebarOverlay();
  updateNavbarUser();
});

function loadAppPreferences() {
  // Dark mode
  const darkMode = localStorage.getItem('kisan_darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
    KisanApp.darkMode = true;
    updateDarkModeIcon(true);
  }

  // Language
  const lang = localStorage.getItem('kisan_lang') || 'en';
  KisanApp.language = lang;
  applyLanguage(lang);

  // User
  const user = localStorage.getItem('kisan_user');
  if (user) {
    KisanApp.user = JSON.parse(user);
  }
}

// ======= DARK MODE =======
function initDarkModeToggle() {
  const toggles = document.querySelectorAll('.dark-mode-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', toggleDarkMode);
  });
}

function toggleDarkMode() {
  KisanApp.darkMode = !KisanApp.darkMode;
  document.body.classList.toggle('dark-mode', KisanApp.darkMode);
  localStorage.setItem('kisan_darkMode', KisanApp.darkMode);
  updateDarkModeIcon(KisanApp.darkMode);
  showToast(KisanApp.darkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
}

function updateDarkModeIcon(isDark) {
  const icons = document.querySelectorAll('.dark-mode-icon');
  icons.forEach(icon => {
    icon.className = isDark ? 'bi bi-sun-fill dark-mode-icon' : 'bi bi-moon-fill dark-mode-icon';
  });
}

// ======= LANGUAGE =======
function initLangSelector() {
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Set active
  const currentLang = KisanApp.language;
  buttons.forEach(btn => {
    if (btn.dataset.lang === currentLang) btn.classList.add('active');
  });
}

function setLanguage(lang) {
  KisanApp.language = lang;
  localStorage.setItem('kisan_lang', lang);
  applyLanguage(lang);
  showToast(`🌐 Language changed`, 'success');
}

function applyLanguage(lang) {
  const t = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
}

function t(key) {
  const lang = KisanApp.language || 'en';
  return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

// ======= AUTH =======
function isLoggedIn() {
  return localStorage.getItem('kisan_loggedIn') === 'true';
}

function getUser() {
  const u = localStorage.getItem('kisan_user');
  return u ? JSON.parse(u) : null;
}

function login(identifier, password, role) {
  if (!identifier || identifier.length < 3) return { success: false, msg: 'Enter valid Email ID or Mobile number' };
  if (!password || password.length < 4) return { success: false, msg: 'Password must be at least 4 characters' };

  let userName = role === 'farmer' ? 'Ramesh Patil' : role === 'buyer' ? 'Ravi Sharma' : 'Sunil More';
  if (identifier.includes('farmer')) {
    role = 'farmer';
    userName = 'Ramesh Patil (Farmer)';
  } else if (identifier.includes('buyer')) {
    role = 'buyer';
    userName = 'Ravi Sharma (Trader)';
  } else if (identifier.includes('transporter')) {
    role = 'transporter';
    userName = 'Sunil More (Logistics)';
  }

  const user = {
    mobile: identifier.includes('@') ? (role === 'farmer' ? '9876543210' : role === 'buyer' ? '9823456789' : '9812345678') : identifier,
    email: identifier.includes('@') ? identifier : `${role}@kisanx.ai`,
    role: role || 'farmer',
    name: userName,
    location: 'Nashik, Maharashtra',
    farmSize: '10 Acres',
    language: 'en',
    avatar: role === 'farmer' ? '👨‍🌾' : role === 'buyer' ? '🏪' : '🚛',
  };

  localStorage.setItem('kisan_loggedIn', 'true');
  localStorage.setItem('kisan_user', JSON.stringify(user));
  KisanApp.user = user;
  return { success: true, user };
}

function logout() {
  localStorage.removeItem('kisan_loggedIn');
  localStorage.removeItem('kisan_user');
  KisanApp.user = null;
  window.location.href = 'index.html';
}

function requireAuth() {
  if (!isLoggedIn()) {
    showToast('Please login to continue', 'warning');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    return false;
  }
  return true;
}

// ======= NAVBAR UPDATE =======
function updateNavAuth() {
  const loggedIn = isLoggedIn();
  const loggedOutEls = document.querySelectorAll('.auth-logged-out');
  const loggedInEls = document.querySelectorAll('.auth-logged-in');

  loggedOutEls.forEach(el => {
    if (loggedIn) el.classList.add('d-none');
    else el.classList.remove('d-none');
  });

  loggedInEls.forEach(el => {
    if (loggedIn) el.classList.remove('d-none');
    else el.classList.add('d-none');
  });
}

function updateNavbarUser() {
  updateNavAuth();
  const user = getUser();
  if (!user) return;

  const nameEls = document.querySelectorAll('.navbar-user-name');
  nameEls.forEach(el => el.textContent = user.name || 'Farmer');

  const locEls = document.querySelectorAll('.navbar-user-location');
  locEls.forEach(el => el.textContent = user.location || KisanApp.location);

  const avatarEls = document.querySelectorAll('.navbar-user-avatar');
  avatarEls.forEach(el => el.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'R');

  // Farmer info in sidebar
  const farmerName = document.querySelector('.farmer-name');
  if (farmerName) farmerName.textContent = user.name;

  const farmerLoc = document.querySelector('.farmer-location');
  if (farmerLoc) farmerLoc.textContent = '📍 ' + (user.location || KisanApp.location);

  const farmerAvatar = document.querySelector('.farmer-avatar');
  if (farmerAvatar) farmerAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'R';
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
});

// ======= SIDEBAR =======
function setupSidebarOverlay() {
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// ======= NAVBAR SCROLL =======
function initNavScroll() {
  const nav = document.querySelector('.landing-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ======= TOAST NOTIFICATIONS =======
function showToast(message, type = 'success', duration = 3500) {
  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const colors = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning text-dark',
    info: 'bg-primary',
  };

  toast.className = `toast show align-items-center border-0 mb-2 ${colors[type] || 'bg-success'} text-white`;
  toast.style.cssText = `min-width:280px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);animation:slideInRight 0.4s ease`;
  toast.innerHTML = `
    <div class="d-flex align-items-center p-3 gap-2">
      <span style="font-size:1.1rem">${icons[type] || '✅'}</span>
      <span style="font-size:0.9rem;font-weight:500;flex:1">${message}</span>
      <button type="button" class="btn-close btn-close-white ms-2" onclick="this.closest('.toast').remove()"></button>
    </div>`;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

function getOrCreateToastContainer() {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem';
    document.body.appendChild(c);
  }
  return c;
}

// ======= MODAL UTILS =======
function showModal(id) {
  const modal = new bootstrap.Modal(document.getElementById(id));
  modal.show();
}

function hideModal(id) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(id));
  if (modal) modal.hide();
}

// ======= FORMATTING =======
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function formatNumber(n) {
  return Number(n).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function daysSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

function daysUntilHarvest(plantingDate, totalDays) {
  const planting = new Date(plantingDate);
  const harvest = new Date(planting.getTime() + totalDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = Math.max(0, Math.floor((harvest - now) / (1000 * 60 * 60 * 24)));
  return remaining;
}

// ======= LOCAL STORAGE HELPERS =======
function saveToStorage(key, data) {
  localStorage.setItem('kisan_' + key, JSON.stringify(data));
}

function loadFromStorage(key) {
  const data = localStorage.getItem('kisan_' + key);
  return data ? JSON.parse(data) : null;
}

function removeFromStorage(key) {
  localStorage.removeItem('kisan_' + key);
}

// ======= LOADER =======
function showLoader(elementId, text = 'Analyzing...') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = `<div class="text-center py-4">
    <div class="kisan-spinner mb-3"></div>
    <p class="text-muted mb-0" style="font-size:0.9rem">${text}</p>
  </div>`;
}

// ======= AI SIMULATION ENGINE =======
const AIEngine = {
  cropRecommendation(params) {
    const recommendations = {
      'loamy': { crop: 'Tomato', icon: '🍅', suitability: 92, yield: '18-22 Tonnes/Acre', water: 'Medium', profit: '₹45,000-55,000/Acre', duration: '90-120 Days' },
      'sandy loam': { crop: 'Onion', icon: '🧅', suitability: 88, yield: '15-18 Tonnes/Acre', water: 'Low-Medium', profit: '₹30,000-40,000/Acre', duration: '120-130 Days' },
      'clayey': { crop: 'Wheat', icon: '🌾', suitability: 85, yield: '3-4 Tonnes/Acre', water: 'Medium', profit: '₹25,000-35,000/Acre', duration: '120-150 Days' },
      'black': { crop: 'Cotton', icon: '🌿', suitability: 94, yield: '8-12 Quintals/Acre', water: 'High', profit: '₹50,000-70,000/Acre', duration: '160-200 Days' },
      'red': { crop: 'Soybean', icon: '🫘', suitability: 87, yield: '2-3 Tonnes/Acre', water: 'Medium', profit: '₹30,000-40,000/Acre', duration: '90-110 Days' },
    };
    const soil = (params.soil || 'loamy').toLowerCase();
    const rec = recommendations[soil] || recommendations['loamy'];
    return {
      ...rec,
      location: params.location || 'Nashik, Maharashtra',
      season: params.season || 'Kharif',
      alternatives: ['Tomato', 'Onion', 'Chili'].filter(c => c !== rec.crop),
    };
  },

  fertiliserRecommendation(params) {
    const { crop, stage } = params;
    const recommendations = {
      'Tomato': { N: 'High', P: 'Medium', K: 'High', primary: 'NPK 10:26:26', schedule: 'Apply at transplanting', safety: 'Wear gloves and mask during application' },
      'Onion': { N: 'Medium', P: 'High', K: 'Medium', primary: 'DAP + MOP', schedule: 'Split dose: 50% at sowing, 50% at 30 days', safety: 'Do not apply during rain' },
      'Wheat': { N: 'High', P: 'High', K: 'Low', primary: 'Urea + DAP', schedule: 'Apply before sowing and at tillering', safety: 'Keep away from children' },
      'Soybean': { N: 'Low', P: 'High', K: 'Medium', primary: 'SSP + MOP', schedule: 'Basal dose at sowing', safety: 'Store in cool dry place' },
      'Cotton': { N: 'High', P: 'Medium', K: 'High', primary: 'NPK 19:19:19', schedule: 'Split 3 doses over 90 days', safety: 'Wash hands after handling' },
      'Potato': { N: 'High', P: 'High', K: 'Very High', primary: 'NPK 12:32:16', schedule: 'Apply before planting and at hilling', safety: 'Avoid contact with skin' },
    };
    const rec = recommendations[crop] || recommendations['Tomato'];
    return {
      ...rec,
      crop: crop || 'Tomato',
      stage: stage || 'Vegetative',
      micronutrients: ['Zinc Sulphate (2g/L spray)', 'Boron (1g/L spray)'],
    };
  },

  detectDisease(filename) {
    const diseases = [
      { name: 'Early Blight', confidence: 94, pathogen: 'Alternaria solani', symptoms: ['Brown spots with concentric rings', 'Yellowing of lower leaves', 'Dark lesions on stem'], management: ['Apply Mancozeb 75% WP @ 2.5g/L water', 'Remove infected plant parts', 'Maintain proper spacing'], prevention: ['Use resistant varieties', 'Crop rotation', 'Avoid overhead irrigation'] },
      { name: 'Powdery Mildew', confidence: 87, pathogen: 'Erysiphe sp.', symptoms: ['White powdery coating on leaves', 'Leaf curling', 'Stunted growth'], management: ['Spray sulfur 80% WP @ 3g/L', 'Remove infected parts', 'Improve air circulation'], prevention: ['Use resistant varieties', 'Balanced fertilization', 'Avoid excess nitrogen'] },
      { name: 'Leaf Curl Virus', confidence: 89, pathogen: 'Tomato Leaf Curl Virus', symptoms: ['Upward or downward curling', 'Yellowing and stunting', 'Reduced fruit set'], management: ['Remove infected plants', 'Control whitefly vectors', 'Use imidacloprid spray'], prevention: ['Use virus-free seedlings', 'Yellow sticky traps', 'Neem oil spray'] },
      { name: 'Healthy Plant', confidence: 98, pathogen: 'None detected', symptoms: ['No disease symptoms detected', 'Leaves appear healthy', 'Normal growth pattern'], management: ['Continue regular monitoring', 'Maintain proper nutrition', 'Ensure adequate water supply'], prevention: ['Regular inspection', 'Balanced fertilization', 'Good agricultural practices'] },
    ];
    const selected = diseases[Math.floor(Math.random() * diseases.length)];
    return selected;
  },

  getWeather() {
    const days = ['Today', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const icons = ['⛅', '🌧', '⛅', '☀️', '🌦', '☀️', '⛅'];
    const temps = [28, 26, 27, 31, 29, 30, 28];
    const rains = [40, 80, 35, 10, 60, 5, 30];

    return {
      current: { temp: 28, humidity: 72, rainfall: 40, wind: 14, condition: 'Partly Cloudy', icon: '⛅' },
      forecast: days.map((d, i) => ({ day: d, icon: icons[i], temp: temps[i], rain: rains[i] })),
      advice: 'Rain expected tomorrow. Consider delaying irrigation and applying fungicide before rain.',
    };
  },

  askQuestion(question) {
    const q = question.toLowerCase();
    const responses = {
      'fertiliser': 'For most vegetable crops, a balanced NPK fertilizer (19:19:19) is recommended. Apply in split doses for better absorption. Consult your soil test report for precise quantities.',
      'fertilizer': 'For most vegetable crops, a balanced NPK fertilizer (19:19:19) is recommended. Apply in split doses for better absorption. Consult your soil test report for precise quantities.',
      'disease': 'Common diseases in Maharashtra include Early Blight, Powdery Mildew, and Fusarium Wilt. Use certified seeds, practice crop rotation, and apply recommended fungicides for management.',
      'water': 'Most crops in Nashik region require 400-600mm of water per season. Use drip irrigation for 40% water savings. Avoid waterlogging which causes root rot.',
      'price': 'Current Tomato prices in Nashik APMC: ₹2,800/Quintal. Prices are higher in Mumbai (₹2,900). Consider selling when prices are above ₹2,500 for good returns.',
      'tomato': 'Tomatoes grow best in temperatures between 20-30°C. Use disease-resistant varieties like Arka Vikas or Pusa Ruby. Apply calcium nitrate to prevent blossom end rot.',
      'onion': 'Onions require well-drained loamy soil. Maintain 10x10cm spacing. Apply potassium fertilizer during bulb formation. Harvest when 50% of tops fall.',
      'wheat': 'Wheat grows well in cool weather (15-20°C). Use certified seeds for 20% higher yield. Apply first dose of nitrogen at sowing and second at first irrigation.',
      'weather': 'Current weather in Nashik: 28°C, Humidity 72%, Rain probability 40%. Rain expected tomorrow - consider harvesting mature crops today.',
      'irrigation': 'Drip irrigation saves 40-60% water compared to flood irrigation. For tomatoes, apply 4-6 liters per plant per day. Adjust based on weather and crop stage.',
      'pest': 'Common pests include thrips, whitefly, and fruit borer. Use integrated pest management: pheromone traps, neem-based sprays, and chemical pesticides as last resort.',
      'soil': 'Soil health is crucial. Test soil every 2 years. Maintain pH 6.0-7.5 for most crops. Add organic matter (FYM 20-30 tonnes/ha) to improve soil structure.',
      'loan': 'Kisan Credit Card offers loans up to ₹3 lakh at subsidized interest rates. Contact your nearest cooperative bank or NABARD for agricultural loans.',
      'market': 'Best markets near Nashik: Nashik APMC (5km), Lasalgaon APMC (55km). Mumbai wholesale market offers best prices but transportation costs are higher.',
      'sell': 'Best time to sell tomatoes is when price exceeds ₹2,500/quintal. Monitor prices daily on KisanX AI market module. Connect with verified buyers for better rates.',
      'organic': 'Organic farming premium can fetch 20-30% higher prices. Start with reduced chemical input, add vermicompost, and get organic certification for premium markets.',
    };

    for (const [key, resp] of Object.entries(responses)) {
      if (q.includes(key)) return resp;
    }

    return 'That is a great question! Based on the current agri data for Nashik region, I recommend consulting with your local Krishi Vigyan Kendra (KVK) for personalized advice. You can also use our AI Crop Advisor tool for specific crop recommendations. 🌱';
  },
};

// ======= LOGIN MODAL =======
function initLoginModal() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginMobile').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    const isEmail = identifier.includes('@');
    const isMobile = /^[6-9]\d{9}$/.test(identifier) || /^\d{10}$/.test(identifier);

    if (!isEmail && !isMobile) {
      showToast('Please enter a valid Email ID (e.g. farmer@kisanx.ai) or 10-digit mobile number', 'error');
      return;
    }

    if (password.length < 4) {
      showToast('Password must be at least 4 characters', 'error');
      return;
    }

    const btn = loginForm.querySelector('.btn-login-submit');
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<div class="kisan-spinner me-2"></div> Logging in...`;
    btn.disabled = true;

    setTimeout(() => {
      const result = login(identifier, password, role);
      if (result.success) {
        showToast(`Welcome back! 🌱 Logged in as ${role.toUpperCase()}`, 'success');
        setTimeout(() => {
          if (role === 'buyer') window.location.href = 'buyers.html';
          else if (role === 'transporter') window.location.href = 'transport.html';
          else window.location.href = 'dashboard.html';
        }, 600);
      } else {
        showToast(result.msg, 'error');
        btn.innerHTML = origHtml;
        btn.disabled = false;
      }
    }, 600);
  });

  // Register link
  const registerLink = document.getElementById('registerLink');
  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Registration: Select any demo account card below for 1-click login!', 'info');
    });
  }
}

// Global Demo Helpers
window.fillDemoCredentials = function(role, email, password) {
  const input = document.getElementById('loginMobile');
  const pass = document.getElementById('loginPassword');
  const roleSelect = document.getElementById('loginRole');
  if (input) input.value = email;
  if (pass) pass.value = password;
  if (roleSelect) roleSelect.value = role;
  showToast(`Filled credentials for ${role.toUpperCase()} demo`, 'info');
};

window.quickDemoLogin = function(role, email, password) {
  window.fillDemoCredentials(role, email, password);
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const btn = loginForm.querySelector('.btn-login-submit');
    if (btn) btn.click();
  }
};

// ======= NOTIFICATIONS =======
const notifications = [
  { id: 1, icon: '🌧', title: 'Weather Alert', text: 'Rain expected tomorrow in Nashik region. Plan harvest accordingly.', time: '5 min ago', unread: true },
  { id: 2, icon: '💰', title: 'Market Alert', text: 'Tomato prices increased by 8% at Nashik APMC today.', time: '1 hr ago', unread: true },
  { id: 3, icon: '🌱', title: 'Crop Advisory', text: 'Your Soybean crop may require irrigation. Last watered 5 days ago.', time: '2 hr ago', unread: true },
  { id: 4, icon: '📦', title: 'Buyer Request', text: 'Ravi Sharma Traders interested in 50 Quintal Tomato.', time: '3 hr ago', unread: false },
  { id: 5, icon: '🚚', title: 'Transport Update', text: 'Your transport booking for tomorrow has been confirmed.', time: '5 hr ago', unread: false },
];

function renderNotifications() {
  const container = document.getElementById('notifList');
  if (!container) return;

  container.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markNotifRead(${n.id})">
      <div class="notif-icon">${n.icon}</div>
      <div>
        <div class="notif-title">${n.title}${n.unread ? '<span class="ms-2 badge rounded-pill bg-danger" style="font-size:0.6rem">New</span>' : ''}</div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');

  updateNotifBadge();
}

function updateNotifBadge() {
  const count = notifications.filter(n => n.unread).length;
  const dots = document.querySelectorAll('.notif-dot');
  dots.forEach(dot => {
    dot.style.display = count > 0 ? 'block' : 'none';
  });

  const badges = document.querySelectorAll('.notif-count-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function markNotifRead(id) {
  const n = notifications.find(n => n.id === id);
  if (n) n.unread = false;
  renderNotifications();
}

function markAllRead() {
  notifications.forEach(n => n.unread = false);
  renderNotifications();
  showToast('All notifications marked as read', 'info');
}

// ======= SCROLL TO SECTION =======
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ======= NAVIGATE =======
function navigateTo(page) {
  if (!isLoggedIn() && page !== 'index.html') {
    showToast('Please login first', 'warning');
    return;
  }
  window.location.href = page;
}
