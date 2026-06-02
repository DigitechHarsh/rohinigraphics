/* app.js - SPA Router, State Management, and Admin Panel Controller */

// --- 1. Product Database & Catalog Schema ---
const PRODUCTS_DATA = [
  {
    id: 'led-letter',
    title: 'LED Letter Signage',
    category: 'led',
    desc: 'Premium illuminated lettering using high-efficiency, weather-resistant LEDs. Available in front-lit, back-lit, and edge-glow styling.',
    features: ['IP67 Waterproof LEDs', '12V Low Voltage', 'Acrylic & Aluminum Housing'],
    icon: 'fa-lightbulb'
  },
  {
    id: 'ss-letter',
    title: 'SS Metal Letters',
    category: 'ss',
    desc: 'High-end architectural Grade 304 Stainless Steel letters. Polished to a mirror finish or brushed gold chrome plating.',
    features: ['Rust Resistant', 'Premium Mirror/Brushed Finish', 'Hidden Stud Mounts'],
    icon: 'fa-cube'
  },
  {
    id: 'trapped-letter',
    title: 'Taped / Channeled Letters',
    category: 'led',
    desc: 'Side-taped metal channel letters with glowing acrylic faces. Combines high strength with sleek modern outlines.',
    features: ['Vibrant Neon Colors', 'Side Trim Finishes', 'Double LED Density'],
    icon: 'fa-border-none'
  },
  {
    id: 'acrylic-letter',
    title: 'Acrylic Glowing Letters',
    category: 'signage',
    desc: 'Heavy-duty colored acrylic sheets laser-cut to absolute perfection, producing solid block side-glow illumination.',
    features: ['High UV Protection', '100% Cast Acrylic', 'Uniform Light Diffusion'],
    icon: 'fa-palette'
  },
  {
    id: 'marquee-letter',
    title: 'Retro Marquee Bulbs',
    category: 'signage',
    desc: 'Vintage carnival-style marquee signs fitted with glowing retro Edison bulbs or warm LED spherical indicator lamps.',
    features: ['Industrial Iron Structure', 'Shatterproof Bulbs', 'Charming Retro Appeal'],
    icon: 'fa-circle-dot'
  },
  {
    id: 'hanger-sign',
    title: 'Double-Sided Hanger Sign',
    category: 'signage',
    desc: 'Glowing double-sided projection signs hanging gracefully from heavy-gauge iron brackets. Extremely popular for street view.',
    features: ['Double-Sided Visibility', 'Heavy Duty Wall Bracket', 'Energy Saving Panels'],
    icon: 'fa-anchor'
  },
  {
    id: 'lollipop-sign',
    title: 'Circular Lollipop Sign',
    category: 'signage',
    desc: 'Iconic wall-mount circular protruding signs (like Burger King / Coffee Shop signs). Vacuum-formed acrylic dome faces.',
    features: ['Vacuum Formed Domes', 'Internal LED Grid', 'Wind Pressure Tolerant'],
    icon: 'fa-circle'
  },
  {
    id: 'safety-sign',
    title: 'Safety Signs & Cones',
    category: 'signage',
    desc: 'Reflective road markers, traffic signs, industrial hazard warnings, and high-visibility traffic cones/barricades.',
    features: ['High-Reflective Microprismatic', 'Weatherproof PVC', 'GeM Portal Standard'],
    icon: 'fa-triangle-exclamation'
  },
  {
    id: 'acrylic-nameplate',
    title: 'Acrylic Name Plates',
    category: 'other',
    desc: 'Designer nameplates for houses, villas, and executive cabins. Embedded with stainless steel mirror-stud spacing.',
    features: ['Laser Engraved Detail', 'Steel Stud Stand-offs', 'Wood & Glass Textures'],
    icon: 'fa-address-card'
  },
  {
    id: 'led-clipon',
    title: 'LED Clip-On Board',
    category: 'publicity',
    desc: 'Ultra-thin, anodized aluminum frames with snap-open borders. Ideal for quick-change menus, movie posters, and maps.',
    features: ['12mm Ultra Slim', 'Snap Open Edges', 'Uniform LGP Diffuser'],
    icon: 'fa-magnifying-glass-plus'
  },
  {
    id: 'led-fabrics',
    title: 'Tension Fabric Lightbox',
    category: 'publicity',
    desc: 'Sleek aluminum profile frames utilizing silicone-edge tension graphics (SEG). Offers a borderless visual presentation.',
    features: ['Silicone Edge SEG', 'Borderless Look', 'Washable Fabric Graphic'],
    icon: 'fa-panorama'
  },
  {
    id: 'promo-canopy',
    title: 'Promotional Canopy Tent',
    category: 'publicity',
    desc: 'Heavy-duty collapsible red marketing canopy tents. Custom printed with your company name, logo, and contacts.',
    features: ['Collapsible Steel Frame', 'Waterproof Polyester', 'Includes Carry Bag'],
    icon: 'fa-tent'
  },
  {
    id: 'promo-table',
    title: 'Promotional PVC Counter',
    category: 'publicity',
    desc: 'Lightweight, highly portable PVC promotional desks with header banners. Perfect for brand activation events.',
    features: ['Sets Up in 2 Minutes', 'Sturdy Internal Shelving', 'Full-Wrap Branding'],
    icon: 'fa-table'
  },
  {
    id: 'rollup-standee',
    title: 'Roll-Up Banner Standee',
    category: 'publicity',
    desc: 'Classic portable marketing standees with spring-loaded roll-up aluminum bases and high-grade non-tear banner sheets.',
    features: ['Eco-Solvent Print', 'Anodized Aluminum Stand', 'Instant Setup Design'],
    icon: 'fa-image'
  },
  {
    id: 'sunpack-sheet',
    title: 'Sunpack Sheet Printing',
    category: 'other',
    desc: 'Fluted sunpack sheet prints for cost-effective local street-level advertisements, real estate notices, and cable ads.',
    features: ['Extremely Low Cost', 'Lightweight Corrugated PVC', 'High Outdoor Endurance'],
    icon: 'fa-newspaper'
  },
  {
    id: 'flex-printing',
    title: 'High-Res Flex Printing',
    category: 'other',
    desc: 'Grand-format industrial vinyl flex banner printing. Heavy-duty blackback flex, backlit media, and star flex options.',
    features: ['Starmedia High-Gloss', 'Eyelet Metal Rings', 'Solvent & Latex Printing'],
    icon: 'fa-print'
  },
  {
    id: 'laser-cutting',
    title: 'Precision Laser Cutting',
    category: 'other',
    desc: 'Precision laser profiling for metal, wood, acrylic sheets, and composite plates. Flawless cutting tolerance.',
    features: ['CNC Cutting Accuracy', 'Acrylic/SS/MS Sheets', 'Complex Vector Designs'],
    icon: 'fa-scissors'
  },
  {
    id: 'acp-elevation',
    title: 'ACP Elevation Cladding',
    category: 'structural',
    desc: 'Commercial building elevation cladding using Aluminum Composite Panels. Resistant to weathering, fading, and fire.',
    features: ['Fire Retardant Panels', 'Modern Structural Cladding', 'Rustproof Framing'],
    icon: 'fa-building'
  },
  {
    id: 'structure-fab',
    title: 'Banner Structure Fabrication',
    category: 'structural',
    desc: 'Heavy structural iron framing, welding, and erection of giant banners, hoardings, rooftop signboards, and pillars.',
    features: ['Heavy Gauge Iron Channels', 'Certified Welders', 'Wind-load Engineering'],
    icon: 'fa-gavel'
  },
  {
    id: 'other-printing',
    title: 'Commercial Business Branding',
    category: 'other',
    desc: 'Full-suite printing: Mug printing, business cards, challan books, envelopes, letter pads, tags, customized box printing.',
    features: ['Offset & Digital Prints', 'Quality Paper Stock', 'Brand Styling Consistency'],
    icon: 'fa-briefcase'
  }
];

// --- 2. Initial Seed Data (Inquiries Database) ---
const MOCK_INQUIRIES = [
  {
    id: 'INQ-8802',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36h ago
    name: 'Dr. Amit Shah',
    phone: '98250 12345',
    email: 'amit.shah@nirmalhospital.com',
    product: 'Safety Signs',
    budget: '50K - 1.5L',
    priority: 'High',
    message: 'Need standard NABH emergency exits, stair glow-in-dark boards, and external entry panels for Nirmal Hospital Expansion.',
    status: 'Pending',
    notes: 'Awaiting urgent site visit confirmation for hospital parameters.'
  },
  {
    id: 'INQ-7541',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24h ago
    name: 'Sneha Mehta (Owner)',
    phone: '91733 99887',
    email: 'contact@kekizsurat.com',
    product: 'Lollipop Signs',
    budget: '10K - 50K',
    priority: 'Normal',
    message: 'Need a circular LED Lollipop hanging sign with Kekiz brand styling and warm golden backing SS letters for new shop front.',
    status: 'Contacted',
    notes: 'Sent quote estimate via WhatsApp. Client liked the SS gold finish.'
  },
  {
    id: 'INQ-9630',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    name: 'Puma Procurement India',
    phone: '97110 54321',
    email: 'retail.support@puma.in',
    product: 'ACP Facade',
    budget: 'Above 5L',
    priority: 'High',
    message: 'Requesting rates for full ACP cladding (approx 1200 sqft elevation) + large red neon backlit acrylic Puma cat logo.',
    status: 'Pending',
    notes: 'High value corporate inquiry. Escalate to Amar Kumar immediately.'
  },
  {
    id: 'INQ-3012',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    name: 'Rajesh Patil',
    phone: '98980 44332',
    email: 'rajesh@patilbuilders.com',
    product: 'Large Printing',
    budget: '10K - 50K',
    priority: 'Medium',
    message: 'Required 50 rollup standees and 500 sunpack sheets for political/construction marketing around Gopipura, Surat.',
    status: 'Completed',
    notes: 'Printed, fitted, and successfully delivered to Patil Builders office. Payment cleared.'
  },
  {
    id: 'INQ-2209',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    name: 'Aarav Sharma',
    phone: '90333 11223',
    email: 'aarav.sharma@gmail.com',
    product: 'Acrylic Name Plates',
    budget: 'Under 10K',
    priority: 'Low',
    message: 'Need a premium glowing acrylic name plate for my new villa apartment. Size: 18x12 inches with steel mirror spacing studs.',
    status: 'Pending',
    notes: ''
  }
];

// --- 3. App Core State Management ---
class AppEngine {
  constructor() {
    this.inquiries = [];
    this.isAdminAuthenticated = false;
    this.initDatabase();
    this.initEventListeners();
    this.handleRouting();
    this.renderProducts('all');
  }

  // Set up localStorage Database
  initDatabase() {
    const localData = localStorage.getItem('rohini_inquiries');
    if (!localData) {
      this.inquiries = [...MOCK_INQUIRIES];
      localStorage.setItem('rohini_inquiries', JSON.stringify(this.inquiries));
    } else {
      this.inquiries = JSON.parse(localData);
    }
    
    // Auth status from session
    this.isAdminAuthenticated = sessionStorage.getItem('admin_logged') === 'true';
  }

  saveDatabase() {
    localStorage.setItem('rohini_inquiries', JSON.stringify(this.inquiries));
    this.updateAdminDashboard();
  }

  // --- Router & Views ---
  handleRouting() {
    const hash = window.location.hash || '#/home';
    const views = document.querySelectorAll('.spa-view');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Close mobile menu on navigate
    document.getElementById('nav-menu').classList.remove('active');

    // Parse parameters
    const [path, queryString] = hash.split('?');
    
    views.forEach(view => {
      view.style.display = 'none';
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path === '#/home') {
      document.getElementById('home-view').style.display = 'block';
      document.getElementById('link-home').classList.add('active');
    } else if (path === '#/products') {
      document.getElementById('products-view').style.display = 'block';
      document.getElementById('link-products').classList.add('active');
      
      // Handle URL parameters for filtering
      let targetFilter = 'all';
      if (queryString) {
        const params = new URLSearchParams(queryString);
        targetFilter = params.get('filter') || 'all';
      }
      
      // Update filter tabs UI
      const tabs = document.querySelectorAll('.filter-btn');
      tabs.forEach(tab => {
        if (tab.dataset.filter === targetFilter) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      this.renderProducts(targetFilter);
    } else if (path === '#/about') {
      document.getElementById('about-view').style.display = 'block';
      document.getElementById('link-about').classList.add('active');
    } else if (path === '#/contact') {
      document.getElementById('contact-view').style.display = 'block';
      document.getElementById('link-contact').classList.add('active');
      
      // Pre-fill product if clicked from card
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const prefill = params.get('interest');
        if (prefill) {
          document.getElementById('form-product').value = prefill;
        }
      }
    } else if (path === '#/admin') {
      document.getElementById('admin-view').style.display = 'block';
      document.getElementById('link-admin').classList.add('active');
      this.renderAdminView();
    } else {
      // Fallback
      document.getElementById('home-view').style.display = 'block';
      document.getElementById('link-home').classList.add('active');
    }
  }

  // --- Dynamic Products Catalog Renderer ---
  renderProducts(categoryFilter = 'all') {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    const filtered = categoryFilter === 'all' 
      ? PRODUCTS_DATA 
      : PRODUCTS_DATA.filter(p => p.category === categoryFilter);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: span 3; text-align:center; padding: 4rem 1rem;">No products found in this category.</div>`;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      // Generates elegant fallback SVGs for rich visuals representing exact sign boards
      card.innerHTML = `
        <div class="product-img-wrapper">
          <div style="width:100%; height:100%; background: linear-gradient(135deg, #111827 0%, #1e293b 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 2rem; color:var(--brand-color); text-align:center;">
            <i class="fa-solid ${p.icon}" style="font-size: 3.5rem; filter: drop-shadow(0 0 12px var(--brand-glow)); margin-bottom: 1rem;"></i>
            <span style="font-family:'Outfit', sans-serif; font-size: 0.8rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.1em;">ROHINI MFG UNIT</span>
          </div>
          <span class="product-tag">${p.category.toUpperCase()}</span>
        </div>
        <div class="product-info">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <ul style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom: 1.25rem;">
            ${p.features.map(f => `<li style="font-size:0.75rem; background:rgba(255,87,34,0.08); border:1px solid rgba(255,87,34,0.1); padding:0.2rem 0.5rem; border-radius:4px; color:var(--text-secondary);"><i class="fa-solid fa-check" style="color:var(--brand-color); margin-right:4px;"></i>${f}</li>`).join('')}
          </ul>
          <div class="product-cta">
            <a href="#/contact?interest=${encodeURIComponent(p.title)}" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size:0.8rem; border-radius: var(--radius-sm);">
              <span>Inquire Now</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // --- Form Submission Logic ---
  handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const email = document.getElementById('form-email').value.trim() || 'Not Provided';
    const product = document.getElementById('form-product').value;
    const budget = document.getElementById('form-budget').value;
    const priority = document.getElementById('form-priority').value;
    const message = document.getElementById('form-message').value.trim();

    if (!name || !phone || !product || !message) {
      this.showToast('Please fill out all required fields!', 'error');
      return;
    }

    const newInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      name,
      phone,
      email,
      product,
      budget,
      priority,
      message,
      status: 'Pending',
      notes: ''
    };

    this.inquiries.unshift(newInquiry);
    this.saveDatabase();
    
    // Reset Form & Show Success Toast
    document.getElementById('quote-form').reset();
    this.showToast(`Thank You, ${name}! Your inquiry has been submitted. Reference: ${newInquiry.id}`, 'success');
    
    // Redirect to home/success state
    setTimeout(() => {
      window.location.hash = '#/home';
    }, 1500);
  }

  // --- Admin Logic & Auth Controllers ---
  renderAdminView() {
    const gate = document.getElementById('admin-gate');
    const dashboard = document.getElementById('admin-dashboard');
    
    if (this.isAdminAuthenticated) {
      gate.style.display = 'none';
      dashboard.style.display = 'flex';
      this.updateAdminDashboard();
    } else {
      gate.style.display = 'block';
      dashboard.style.display = 'none';
      document.getElementById('admin-pin').focus();
    }
  }

  verifyAdminLogin() {
    const pin = document.getElementById('admin-pin').value;
    const errorMsg = document.getElementById('admin-gate-error');
    
    if (pin === 'admin123') {
      this.isAdminAuthenticated = true;
      sessionStorage.setItem('admin_logged', 'true');
      errorMsg.style.display = 'none';
      document.getElementById('admin-pin').value = '';
      this.showToast('Authentication Successful!', 'success');
      this.renderAdminView();
    } else {
      errorMsg.style.display = 'block';
      document.getElementById('admin-pin').value = '';
      document.getElementById('admin-pin').focus();
      this.showToast('Incorrect PIN Code!', 'error');
    }
  }

  adminLogout() {
    this.isAdminAuthenticated = false;
    sessionStorage.removeItem('admin_logged');
    this.showToast('Logged out successfully.', 'info');
    this.renderAdminView();
  }

  // Dynamic Dashboard Stats, Table Rendering, Filters
  updateAdminDashboard() {
    if (!this.isAdminAuthenticated) return;

    // 1. Calculate and update metrics counts
    const total = this.inquiries.length;
    const pending = this.inquiries.filter(i => i.status === 'Pending').length;
    const contacted = this.inquiries.filter(i => i.status === 'Contacted').length;
    const completed = this.inquiries.filter(i => i.status === 'Completed').length;

    document.getElementById('metric-total').innerText = total;
    document.getElementById('metric-pending').innerText = pending;
    document.getElementById('metric-contacted').innerText = contacted;
    document.getElementById('metric-completed').innerText = completed;

    // 2. Fetch filters
    const searchVal = document.getElementById('admin-search').value.toLowerCase();
    const productFilter = document.getElementById('admin-filter-product').value;
    const statusFilter = document.getElementById('admin-filter-status').value;
    const priorityFilter = document.getElementById('admin-filter-priority').value;

    // 3. Filter entries
    const filtered = this.inquiries.filter(inq => {
      // Search match
      const textMatch = inq.name.toLowerCase().includes(searchVal) || 
                        inq.email.toLowerCase().includes(searchVal) || 
                        inq.phone.includes(searchVal) || 
                        inq.message.toLowerCase().includes(searchVal) ||
                        inq.id.toLowerCase().includes(searchVal);
      
      // Category match
      const productMatch = productFilter === 'all' || inq.product.startsWith(productFilter) || inq.product.includes(productFilter);
      
      // Status match
      const statusMatch = statusFilter === 'all' || inq.status === statusFilter;
      
      // Priority match
      const priorityMatch = priorityFilter === 'all' || inq.priority === priorityFilter;

      return textMatch && productMatch && statusMatch && priorityMatch;
    });

    // 4. Render Rows
    const tbody = document.getElementById('inquiries-table-body');
    const emptyState = document.getElementById('table-empty-state');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(inq => {
      const tr = document.createElement('tr');
      
      const dateFormatted = new Date(inq.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });

      // Priority color badges
      let priorityClass = 'badge-priority-normal';
      if (inq.priority === 'High') priorityClass = 'badge-priority-high';
      else if (inq.priority === 'Medium') priorityClass = 'badge-priority-medium';
      else if (inq.priority === 'Low') priorityClass = 'badge-priority-low';

      // Status color badges
      let statusClass = 'badge-pending';
      if (inq.status === 'Contacted') statusClass = 'badge-contacted';
      else if (inq.status === 'Completed') statusClass = 'badge-completed';

      tr.innerHTML = `
        <td style="font-size:0.85rem; color:var(--text-muted);">${dateFormatted}</td>
        <td>
          <div style="font-weight:600;">${inq.name}</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">${inq.phone}</div>
        </td>
        <td>
          <div style="font-weight:500; font-size:0.9rem;">${inq.product}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Budget: ${inq.budget}</div>
        </td>
        <td><span class="badge ${priorityClass}">${inq.priority}</span></td>
        <td><span class="badge ${statusClass}">${inq.status}</span></td>
        <td style="text-align: right;">
          <button class="table-action-btn" onclick="app.showInquiryDetails('${inq.id}')" title="View Customer Details">
            <i class="fa-solid fa-circle-info"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // View customer details in popup modal
  showInquiryDetails(id) {
    const inq = this.inquiries.find(i => i.id === id);
    if (!inq) return;

    const modal = document.getElementById('inquiry-modal');
    const modalContent = document.getElementById('modal-body-content');

    const dateFormatted = new Date(inq.timestamp).toLocaleString('en-IN', {
      dateStyle: 'long', timeStyle: 'short'
    });

    modalContent.innerHTML = `
      <div style="display:grid; grid-template-cols:1fr 1fr; gap:1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom:1.5rem;">
        <div class="detail-row">
          <span class="detail-label">Reference ID</span>
          <span class="detail-value" style="color:var(--brand-color); font-weight:700;">${inq.id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted On</span>
          <span class="detail-value">${dateFormatted}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Client Name</span>
          <span class="detail-value">${inq.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone Call / WhatsApp</span>
          <span class="detail-value"><a href="tel:${inq.phone}" style="color:inherit;"><i class="fa-solid fa-phone" style="color:var(--brand-color); margin-right:4px;"></i>${inq.phone}</a></span>
        </div>
        <div class="detail-row" style="grid-column: span 2;">
          <span class="detail-label">Email Address</span>
          <span class="detail-value"><a href="mailto:${inq.email}" style="color:inherit;"><i class="fa-solid fa-envelope" style="color:var(--brand-color); margin-right:4px;"></i>${inq.email}</a></span>
        </div>
      </div>

      <div style="display:grid; grid-template-cols: repeat(3, 1fr); gap:1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom:1.5rem;">
        <div class="detail-row">
          <span class="detail-label">Signboard Interest</span>
          <span class="detail-value" style="font-size:0.95rem;">${inq.product}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Inquiry Priority</span>
          <span class="detail-value">${inq.priority}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Est. Budget Area</span>
          <span class="detail-value">${inq.budget}</span>
        </div>
      </div>

      <div class="detail-row">
        <span class="detail-label">Requirement Brief</span>
        <div style="background:var(--bg-primary); padding:1rem; border-radius: var(--radius-sm); border:1px solid var(--border-glass); white-space: pre-wrap; font-size:0.9rem; line-height:1.6;">${inq.message}</div>
      </div>

      <!-- Admin Status & persistence notes section -->
      <div style="background: rgba(255, 87, 34, 0.05); border: 1px solid rgba(255, 87, 34, 0.15); padding:1.5rem; border-radius:var(--radius-md); display:flex; flex-direction:column; gap:1.25rem; margin-top:0.5rem;">
        <h4 style="font-size:0.9rem; color:var(--brand-color); display:flex; align-items:center; gap:0.5rem;"><i class="fa-solid fa-user-gear"></i> Admin Internal Controls</h4>
        
        <div class="form-grid" style="grid-template-cols: 1fr; margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">Update Inquiry Status</label>
            <select id="modal-status-select" class="form-select" style="background:var(--bg-secondary);">
              <option value="Pending" ${inq.status === 'Pending' ? 'selected' : ''}>Pending Review</option>
              <option value="Contacted" ${inq.status === 'Contacted' ? 'selected' : ''}>Contacted Customer</option>
              <option value="Completed" ${inq.status === 'Completed' ? 'selected' : ''}>Completed Order / Closed</option>
            </select>
          </div>
          
          <div class="form-group" style="margin-top:0.5rem;">
            <label class="form-label">Internal Follow-up Notes</label>
            <textarea id="modal-notes-area" class="form-textarea" style="background:var(--bg-secondary); min-height:80px;" placeholder="Add details from WhatsApp conversations, pricing quotes sent, site measurement values...">${inq.notes || ''}</textarea>
          </div>
        </div>

        <button type="button" class="btn btn-primary" onclick="app.saveInquiryAdminEdits('${inq.id}')" style="align-self: flex-start; padding: 0.6rem 1.25rem; font-size:0.875rem;">
          <i class="fa-solid fa-floppy-disk"></i> Save Administrative Edits
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  closeDetailsModal() {
    document.getElementById('inquiry-modal').classList.remove('active');
  }

  saveInquiryAdminEdits(id) {
    const inq = this.inquiries.find(i => i.id === id);
    if (!inq) return;

    const status = document.getElementById('modal-status-select').value;
    const notes = document.getElementById('modal-notes-area').value.trim();

    inq.status = status;
    inq.notes = notes;

    this.saveDatabase();
    this.closeDetailsModal();
    this.showToast(`Inquiry ${id} updated successfully!`, 'success');
  }

  // Export database to neat CSV download
  exportToCSV() {
    if (this.inquiries.length === 0) {
      this.showToast('No inquiry data available to export!', 'error');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Reference ID,Date/Time,Customer Name,Phone Number,Email Address,Product Interest,Priority,Status,Estimated Budget,Details,Admin Notes\n";

    this.inquiries.forEach(i => {
      const cleanMessage = i.message.replace(/"/g, '""').replace(/\n/g, ' ');
      const cleanNotes = (i.notes || '').replace(/"/g, '""').replace(/\n/g, ' ');
      
      const row = [
        i.id,
        new Date(i.timestamp).toLocaleString(),
        `"${i.name}"`,
        `"${i.phone}"`,
        `"${i.email}"`,
        `"${i.product}"`,
        i.priority,
        i.status,
        `"${i.budget}"`,
        `"${cleanMessage}"`,
        `"${cleanNotes}"`
      ].join(",");
      
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rohini_Graphics_Inquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('CSV database exported successfully!', 'success');
  }

  // Refill database with default mock inquiries for presentation
  seedDatabase() {
    this.inquiries = [...MOCK_INQUIRIES];
    this.saveDatabase();
    this.showToast('Inquiry database seeded successfully!', 'success');
  }

  // --- Theme Swapper Controller ---
  toggleTheme() {
    const htmlTag = document.documentElement;
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('rohini_theme', newTheme);

    const themeIcon = document.getElementById('theme-icon');
    if (newTheme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
      this.showToast('Switched to Light Mode', 'info');
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      this.showToast('Switched to Dark Mode', 'info');
    }
  }

  // Initializing saved theme setting
  loadStoredTheme() {
    const storedTheme = localStorage.getItem('rohini_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    const themeIcon = document.getElementById('theme-icon');
    if (storedTheme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // --- Dynamic Toast Notification popups ---
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';
    else if (type === 'info') icon = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span style="font-size:0.875rem; font-weight:500;">${message}</span>
    `;

    container.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 4000);
  }

  // --- Core Event Listeners Setup ---
  initEventListeners() {
    // Hash Routing Trigger
    window.addEventListener('hashchange', () => this.handleRouting());
    
    // Theme switch
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Front-end Quote Form Submit
    document.getElementById('quote-form').addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Admin login verify
    document.getElementById('admin-login-btn').addEventListener('click', () => this.verifyAdminLogin());
    document.getElementById('admin-pin').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.verifyAdminLogin();
    });

    // Admin logout
    document.getElementById('admin-logout-btn').addEventListener('click', () => this.adminLogout());

    // Admin database seed & CSV export
    document.getElementById('admin-seed-btn').addEventListener('click', () => this.seedDatabase());
    document.getElementById('admin-export-btn').addEventListener('click', () => this.exportToCSV());

    // Admin filters and Search
    document.getElementById('admin-search').addEventListener('input', () => this.updateAdminDashboard());
    document.getElementById('admin-filter-product').addEventListener('change', () => this.updateAdminDashboard());
    document.getElementById('admin-filter-status').addEventListener('change', () => this.updateAdminDashboard());
    document.getElementById('admin-filter-priority').addEventListener('change', () => this.updateAdminDashboard());

    // Product Category Filter Buttons (Products View Page)
    document.getElementById('filter-tabs').addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        const tabs = document.querySelectorAll('.filter-btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        this.renderProducts(filter);
      }
    });

    // Modal Close
    document.getElementById('modal-close-btn').addEventListener('click', () => this.closeDetailsModal());
    document.getElementById('inquiry-modal').addEventListener('click', (e) => {
      if (e.target.id === 'inquiry-modal') this.closeDetailsModal();
    });

    // Preload system theme setting
    this.loadStoredTheme();
  }
}

// Initializing the SPA engine upon loading
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new AppEngine();
});
