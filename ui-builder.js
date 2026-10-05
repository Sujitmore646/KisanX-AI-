/**
 * KisanX AI - Shared Sidebar/Navbar HTML Builder
 * Injected by each dashboard page
 */

function buildSidebar(activePage) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', href: 'dashboard.html', badge: null },
    { id: 'agri-hub', label: 'AI Agri Hub', icon: 'bi-stars', href: 'agri-hub.html', badge: 'AI' },
    { id: 'crops', label: 'My Crops', icon: 'bi-flower2', href: 'crops.html', badge: null },
    { id: 'market', label: 'Market Prices', icon: 'bi-graph-up-arrow', href: 'market.html', badge: null },
    { id: 'buyers', label: 'Find Buyers', icon: 'bi-people-fill', href: 'buyers.html', badge: null },
    { id: 'transport', label: 'Transport', icon: 'bi-truck', href: 'transport.html', badge: null },
    { id: 'orders', label: 'Orders', icon: 'bi-box-seam-fill', href: 'orders.html', badge: '3' },
    { id: 'analytics', label: 'Analytics', icon: 'bi-bar-chart-line-fill', href: 'analytics.html', badge: null },
    { id: 'assistant', label: 'AI Assistant', icon: 'bi-robot', href: 'assistant.html', badge: null },
  ];

  const profileItems = [
    { id: 'profile', label: 'Profile', icon: 'bi-person-circle', href: '#', onclick: 'openProfile()' },
  ];

  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-brand-icon">🌱</div>
          <span>Kisan<span style="color:var(--green-agri)">X AI</span></span>
        </div>
        <button class="sidebar-toggle" onclick="closeSidebar()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="sidebar-farmer-info">
        <div class="farmer-avatar">R</div>
        <div>
          <div class="farmer-name">Ramesh Patil</div>
          <div class="farmer-location">📍 Nashik, Maharashtra</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-label">Main Menu</div>
        ${navItems.map(item => `
          <a href="${item.href}" class="sidebar-link ${item.id === activePage ? 'active' : ''}">
            <i class="bi ${item.icon}"></i>
            <span data-i18n="${item.id}">${item.label}</span>
            ${item.badge ? `<span class="sidebar-link-badge">${item.badge}</span>` : ''}
          </a>`).join('')}

        <div class="sidebar-section-label" style="margin-top:0.75rem">Account</div>
        <a href="#" class="sidebar-link" onclick="openProfile()">
          <i class="bi bi-person-circle"></i>
          <span>Profile</span>
        </a>
        <button class="sidebar-link logout" onclick="logout()">
          <i class="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.35);text-align:center">
          KisanX AI v1.0 | AITHON 2.0 🏆
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>`;

  return sidebarHTML;
}

function buildTopNavbar(pageTitle, pageSubtitle) {
  return `
    <nav class="top-navbar">
      <div class="d-flex align-items-center gap-3">
        <button class="nav-icon-btn d-lg-none" onclick="toggleSidebar()" aria-label="Toggle menu">
          <i class="bi bi-list"></i>
        </button>
        <div class="page-title-area">
          <h4>${pageTitle}</h4>
          <p>${pageSubtitle || '📍 Nashik, Maharashtra'}</p>
        </div>
      </div>
      <div class="top-nav-actions">
        <!-- Language Selector -->
        <div class="lang-selector d-none d-md-flex">
          <button class="lang-btn active" data-lang="en">EN</button>
          <button class="lang-btn" data-lang="hi">हि</button>
          <button class="lang-btn" data-lang="mr">म</button>
        </div>

        <!-- Dark Mode Toggle -->
        <button class="nav-icon-btn dark-mode-toggle" title="Toggle Dark Mode">
          <i class="bi bi-moon-fill dark-mode-icon"></i>
        </button>

        <!-- Notifications -->
        <div class="position-relative">
          <button class="nav-icon-btn" id="notifToggle" onclick="toggleNotifDropdown()">
            <i class="bi bi-bell-fill"></i>
            <div class="notif-dot"></div>
          </button>
          <div id="notifDropdown" class="notif-dropdown dropdown-menu dropdown-menu-end" style="display:none;position:absolute;right:0;top:50px">
            <div class="notif-header">
              <div style="font-weight:700;font-size:0.9rem;color:var(--text-dark)">🔔 Notifications</div>
              <button style="font-size:0.75rem;color:var(--green-agri);background:none;border:none;cursor:pointer" onclick="markAllRead()">Mark all read</button>
            </div>
            <div id="notifList"></div>
          </div>
        </div>

        <!-- Profile -->
        <div class="d-flex align-items-center gap-2" style="cursor:pointer" onclick="openProfile()">
          <div style="width:36px;height:36px;border-radius:10px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-weight:700;color:#FFFFFF;font-size:0.9rem" class="navbar-user-avatar">R</div>
          <div class="d-none d-md-block">
            <div style="font-weight:700;font-size:0.85rem;color:var(--text-dark)" class="navbar-user-name">Ramesh Patil</div>
            <div style="font-size:0.7rem;color:var(--text-light)" class="navbar-user-location">Nashik, MH</div>
          </div>
        </div>

        <!-- Top Nav Logout Button -->
        <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3 py-1.5 ms-1" onclick="logout()" title="Logout" style="font-weight:700;font-size:0.8rem">
          <i class="bi bi-box-arrow-right"></i> <span class="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </nav>`;
}

function buildBottomNav(activePage) {
  const items = [
    { id: 'dashboard', icon: 'bi-grid-1x2-fill', label: 'Home', href: 'dashboard.html' },
    { id: 'agri-hub', icon: 'bi-stars', label: 'AI Hub', href: 'agri-hub.html' },
    { id: 'market', icon: 'bi-graph-up-arrow', label: 'Market', href: 'market.html' },
    { id: 'orders', icon: 'bi-box-seam-fill', label: 'Orders', href: 'orders.html' },
    { id: 'profile', icon: 'bi-person-circle', label: 'Profile', href: '#', onclick: 'openProfile()' },
  ];

  return `
    <nav class="bottom-nav">
      <div class="bottom-nav-items">
        ${items.map(item => `
          <a href="${item.href}" class="bottom-nav-item ${item.id === activePage ? 'active' : ''}" ${item.onclick ? `onclick="${item.onclick}"` : ''}>
            <i class="bi ${item.icon}"></i>
            <span>${item.label}</span>
          </a>`).join('')}
      </div>
    </nav>`;
}

function toggleNotifDropdown() {
  const dropdown = document.getElementById('notifDropdown');
  if (!dropdown) return;
  const isHidden = dropdown.style.display === 'none';
  dropdown.style.display = isHidden ? 'block' : 'none';

  // Close on outside click
  if (isHidden) {
    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!document.getElementById('notifToggle').contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.style.display = 'none';
          document.removeEventListener('click', handler);
        }
      });
    }, 100);
  }
}

function openProfile() {
  showModal('profileModal');
  loadProfileData();
}

function loadProfileData() {
  const user = getUser() || {};
  const profile = loadFromStorage('profile') || {};

  const data = { ...user, ...profile };

  const fields = {
    profileName: data.name || 'Ramesh Patil',
    profileMobile: data.mobile || '9876543210',
    profileLocation: data.location || 'Nashik, Maharashtra',
    profileFarmSize: data.farmSize || '10 Acres',
    profileLanguage: data.language || 'en',
  };

  for (const [id, value] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  const nameDisplay = document.getElementById('profileNameDisplay');
  if (nameDisplay) nameDisplay.textContent = data.name || 'Ramesh Patil';

  const roleDisplay = document.getElementById('profileRoleDisplay');
  if (roleDisplay) roleDisplay.textContent = data.role ? `👨‍🌾 ${data.role.charAt(0).toUpperCase() + data.role.slice(1)}` : '👨‍🌾 Farmer';
}

function saveProfile() {
  const name = document.getElementById('profileName').value;
  const mobile = document.getElementById('profileMobile').value;
  const location = document.getElementById('profileLocation').value;
  const farmSize = document.getElementById('profileFarmSize').value;
  const language = document.getElementById('profileLanguage').value;

  if (!name || !mobile) {
    showToast('Name and mobile are required', 'error');
    return;
  }

  const profile = { name, mobile, location, farmSize, language };
  saveToStorage('profile', profile);

  // Update user in storage
  const user = getUser() || {};
  const updated = { ...user, ...profile };
  localStorage.setItem('kisan_user', JSON.stringify(updated));
  KisanApp.user = updated;

  setLanguage(language);
  updateNavbarUser();
  hideModal('profileModal');
  showToast('✅ Profile updated successfully!', 'success');
}

// Build and inject Profile Modal HTML
function buildProfileModal() {
  return `
    <div class="modal fade" id="profileModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" style="border-radius:20px;border:1px solid var(--border);background:var(--card-bg)">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title" style="font-weight:800;color:var(--text-dark)">My Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="profile-avatar-lg mx-auto mb-3">👨‍🌾</div>
              <div id="profileNameDisplay" style="font-size:1.3rem;font-weight:800;color:var(--text-dark)">Ramesh Patil</div>
              <div id="profileRoleDisplay" style="font-size:0.9rem;color:var(--text-light)">👨‍🌾 Farmer</div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" style="font-weight:600;font-size:0.875rem;color:var(--text-dark)">Full Name</label>
                <input type="text" id="profileName" class="form-control form-control-kisan" placeholder="Your name">
              </div>
              <div class="col-md-6">
                <label class="form-label" style="font-weight:600;font-size:0.875rem;color:var(--text-dark)">Mobile Number</label>
                <input type="tel" id="profileMobile" class="form-control form-control-kisan" placeholder="10-digit mobile">
              </div>
              <div class="col-md-6">
                <label class="form-label" style="font-weight:600;font-size:0.875rem;color:var(--text-dark)">Location</label>
                <input type="text" id="profileLocation" class="form-control form-control-kisan" placeholder="City, State">
              </div>
              <div class="col-md-6">
                <label class="form-label" style="font-weight:600;font-size:0.875rem;color:var(--text-dark)">Farm Size</label>
                <input type="text" id="profileFarmSize" class="form-control form-control-kisan" placeholder="e.g. 10 Acres">
              </div>
              <div class="col-md-6">
                <label class="form-label" style="font-weight:600;font-size:0.875rem;color:var(--text-dark)">Preferred Language</label>
                <select id="profileLanguage" class="form-select form-control-kisan">
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label" style="font-weight:600;font-size:0.875rem;color:var(--text-dark)">Primary Crops</label>
                <input type="text" class="form-control form-control-kisan" value="Tomato, Onion, Wheat" placeholder="Your crops">
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button class="btn-kisan-outline py-2 px-4" data-bs-dismiss="modal">Cancel</button>
            <button class="btn-kisan-primary py-2 px-4" onclick="saveProfile()">
              <i class="bi bi-check2-circle"></i> Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>`;
}
