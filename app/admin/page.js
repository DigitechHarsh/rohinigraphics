'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // Data State
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalNotes, setModalNotes] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Toast notifications state
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Authenticate from Session on load
  useEffect(() => {
    const logged = sessionStorage.getItem('admin_logged') === 'true';
    if (logged) {
      setIsAuthenticated(true);
      fetchInquiries();
    }
  }, []);

  // Sync / Filter inquiries reactive hook
  useEffect(() => {
    if (!inquiries.length) {
      setFilteredInquiries([]);
      return;
    }

    const filtered = inquiries.filter(inq => {
      // 1. Text search match
      const textMatch = 
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.phone.includes(searchQuery) ||
        inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.inquiryId.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Product match
      const productMatch = filterProduct === 'all' || inq.product.startsWith(filterProduct) || inq.product.includes(filterProduct);

      // 3. Status match
      const statusMatch = filterStatus === 'all' || inq.status === filterStatus;

      // 4. Priority match
      const priorityMatch = filterPriority === 'all' || inq.priority === filterPriority;

      return textMatch && productMatch && statusMatch && priorityMatch;
    });

    setFilteredInquiries(filtered);
  }, [inquiries, searchQuery, filterProduct, filterStatus, filterPriority]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch from Serverless MongoDB API
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inquiries');
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
      } else {
        showNotification(`Database error: ${data.error}`, 'error');
      }
    } catch (err) {
      showNotification(`Connection error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    // Check PIN. (Default: admin123)
    if (pin === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_logged', 'true');
      setPinError(false);
      setPin('');
      showNotification('Verify & Authenticated successfully!', 'success');
      fetchInquiries();
    } else {
      setPinError(true);
      setPin('');
      showNotification('Incorrect Access Security PIN!', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_logged');
    showNotification('Logged out successfully.', 'info');
  };

  // Save admin PATCH edits (Status & Notes) to MongoDB Atlas
  const handleSaveEdits = async (inqId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: modalStatus,
          notes: modalNotes
        })
      });

      const data = await response.json();

      if (data.success) {
        showNotification(`Inquiry ${inqId} successfully updated in Atlas!`, 'success');
        
        // Local state update
        setInquiries(prev => prev.map(item => item.inquiryId === inqId ? data.data : item));
        
        // Close modal
        setActiveInquiry(null);
      } else {
        showNotification(`Failed to save edits: ${data.error}`, 'error');
      }
    } catch (err) {
      showNotification(`Connection error: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Details Modal and populate state
  const openDetails = (inq) => {
    setActiveInquiry(inq);
    setModalStatus(inq.status);
    setModalNotes(inq.notes || '');
  };

  // Export Mongoose Documents to local CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      showNotification('No data available to export!', 'error');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Reference ID,Date/Time,Customer Name,Phone Number,Email Address,Product Interest,Priority,Status,Estimated Budget,Details,Admin Notes\n";

    inquiries.forEach(i => {
      const cleanMessage = i.message.replace(/"/g, '""').replace(/\n/g, ' ');
      const cleanNotes = (i.notes || '').replace(/"/g, '""').replace(/\n/g, ' ');
      
      const row = [
        i.inquiryId,
        new Date(i.createdAt).toLocaleString(),
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

    showNotification('CSV database exported successfully!', 'success');
  };

  // Metric calculation variables
  const countTotal = inquiries.length;
  const countPending = inquiries.filter(i => i.status === 'Pending').length;
  const countContacted = inquiries.filter(i => i.status === 'Contacted').length;
  const countCompleted = inquiries.filter(i => i.status === 'Completed').length;

  // Chart Data Processing
  const productDistribution = inquiries.reduce((acc, inq) => {
    const prod = inq.product.split(' (')[0]; // Simplify name
    acc[prod] = (acc[prod] || 0) + 1;
    return acc;
  }, {});

  const productChartData = Object.keys(productDistribution).map(key => ({
    name: key,
    count: productDistribution[key]
  }));

  const statusChartData = [
    { name: 'Pending', value: countPending, color: '#f59e0b' },
    { name: 'Contacted', value: countContacted, color: '#3b82f6' },
    { name: 'Completed', value: countCompleted, color: '#10b981' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="container admin-section">
        <div className="admin-gate-card">
          <div className="admin-gate-icon">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h3 className="admin-gate-title">Admin Access Secured</h3>
          <p className="admin-gate-desc">Enter the Admin Secret Security PIN key to manage customer inquiries and database parameters.</p>
          
          {pinError && (
            <div className="admin-gate-error" style={{ display: 'block' }}>
              <i className="fa-solid fa-triangle-exclamation"></i> Incorrect Security PIN! Hint: Use <strong>admin123</strong>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' }}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={8}
                autoFocus
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <span>Verify & Authenticate</span>
              <i className="fa-solid fa-shield-halved"></i>
            </button>
          </form>
        </div>

        {/* Built-in React Toaster System */}
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>
              <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-wrapper" style={{ padding: '2rem 4rem', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="admin-dashboard">
        
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2>Executive Analytics Dashboard</h2>
            <p>Review metrics, track status, and export client signboard inquiries fetched directly from MongoDB Atlas.</p>
          </div>
          
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={handleExportCSV}>
              <i className="fa-solid fa-file-csv"></i> Export CSV
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
        
        {/* Metrics Row */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-details">
              <h4>Total Inquiries</h4>
              <p>{countTotal}</p>
            </div>
            <div className="metric-icon metric-1">
              <i className="fa-solid fa-inbox"></i>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-details">
              <h4>Pending Review</h4>
              <p>{countPending}</p>
            </div>
            <div className="metric-icon metric-2">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-details">
              <h4>Contacted</h4>
              <p>{countContacted}</p>
            </div>
            <div className="metric-icon metric-3">
              <i className="fa-solid fa-square-phone"></i>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-details">
              <h4>Completed</h4>
              <p>{countCompleted}</p>
            </div>
            <div className="metric-icon metric-4">
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Inquiries by Product</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={productChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} angle={-25} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <Tooltip cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="var(--brand-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Lead Status Distribution</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              {statusChartData.map((status, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: status.color }}></span>
                  {status.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Submissions Panel */}
        <div className="inquiries-panel">
          <div className="panel-controls">
            {/* Search Bar */}
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, detail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="filter-controls-group">
              <select
                className="dashboard-select"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
              >
                <option value="all">All Products</option>
                <option value="LED Letters">LED Letters</option>
                <option value="SS Metal Letters">SS Metal Letters</option>
                <option value="Acrylic Letters">Acrylic Signboards</option>
                <option value="ACP Facade">ACP Elevation Cladding</option>
                <option value="Safety Signs">Safety Signs</option>
                <option value="Publicity Services">Publicity Services</option>
              </select>
              
              <select
                className="dashboard-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Completed">Completed</option>
              </select>
              
              <select
                className="dashboard-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          {/* Inquiries List Table */}
          <div className="table-wrapper">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--brand-color)', marginBottom: '1rem' }}></i>
                <h4>Connecting to MongoDB Atlas Cluster...</h4>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="table-empty-state" style={{ display: 'block' }}>
                <div className="table-empty-state-icon"><i className="fa-solid fa-folder-open"></i></div>
                <h4>No Inquiries Found</h4>
                <p style={{ fontSize: '0.875rem' }}>Adjust your filter fields, perform a new search, or click "Seed Atlas Data".</p>
              </div>
            ) : (
              <table className="inquiries-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Product Area</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map(inq => {
                    const dateFormatted = new Date(inq.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    });

                    // Priority badges
                    let priorityClass = 'badge-priority-normal';
                    if (inq.priority === 'High') priorityClass = 'badge-priority-high';
                    else if (inq.priority === 'Medium') priorityClass = 'badge-priority-medium';
                    else if (inq.priority === 'Low') priorityClass = 'badge-priority-low';

                    // Status badges
                    let statusClass = 'badge-pending';
                    if (inq.status === 'Contacted') statusClass = 'badge-contacted';
                    else if (inq.status === 'Completed') statusClass = 'badge-completed';

                    return (
                      <tr key={inq._id}>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dateFormatted}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{inq.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inq.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{inq.product}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget: {inq.budget}</div>
                        </td>
                        <td><span className={`badge ${priorityClass}`}>{inq.priority}</span></td>
                        <td><span className={`badge ${statusClass}`}>{inq.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="table-action-btn" onClick={() => openDetails(inq)} title="View Customer Details">
                            <i className="fa-solid fa-circle-info"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup Overlay for Inquiry Details & Admin Actions */}
      {activeInquiry && (
        <div className="modal-overlay active">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-address-card" style={{ color: 'var(--brand-color)' }}></i> Customer Details
              </h3>
              <button className="modal-close" onClick={() => setActiveInquiry(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem' }}>
                <div className="detail-row">
                  <span className="detail-label">Reference ID</span>
                  <span className="detail-value" style={{ color: 'var(--brand-color)', fontWeight: 700 }}>{activeInquiry.inquiryId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Submitted On</span>
                  <span className="detail-value">{new Date(activeInquiry.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Client Name</span>
                  <span className="detail-value">{activeInquiry.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone Call / WhatsApp</span>
                  <span className="detail-value">
                    <a href={`tel:${activeInquiry.phone}`} style={{ color: 'inherit' }}>
                      <i className="fa-solid fa-phone" style={{ color: 'var(--brand-color)', marginRight: '4px' }}></i>{activeInquiry.phone}
                    </a>
                  </span>
                </div>
                <div className="detail-row" style={{ gridColumn: 'span 2' }}>
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">
                    <a href={`mailto:${activeInquiry.email}`} style={{ color: 'inherit' }}>
                      <i className="fa-solid fa-envelope" style={{ color: 'var(--brand-color)', marginRight: '4px' }}></i>{activeInquiry.email}
                    </a>
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem' }}>
                <div className="detail-row">
                  <span className="detail-label">Signboard Interest</span>
                  <span className="detail-value" style={{ fontSize: '0.95rem' }}>{activeInquiry.product}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Inquiry Priority</span>
                  <span className="detail-value">{activeInquiry.priority}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Est. Budget Area</span>
                  <span className="detail-value">{activeInquiry.budget}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Requirement Brief</span>
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}>{activeInquiry.message}</div>
              </div>

              {/* Admin Status & persistence notes section */}
              <div style={{ background: 'rgba(255, 87, 34, 0.05)', border: '1px solid rgba(255, 87, 34, 0.15)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-user-gear"></i> Admin Internal Controls (Atlas Cluster)
                </h4>
                
                <div className="form-grid" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Update Inquiry Status</label>
                    <select
                      className="form-select"
                      style={{ background: 'var(--bg-secondary)' }}
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Contacted">Contacted Customer</option>
                      <option value="Completed">Completed Order / Closed</option>
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Internal Follow-up Notes</label>
                    <textarea
                      className="form-textarea"
                      style={{ background: 'var(--bg-secondary)', minHeight: '80px' }}
                      placeholder="Add details from WhatsApp conversations, pricing quotes sent, site measurement values..."
                      value={modalNotes}
                      onChange={(e) => setModalNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSaveEdits(activeInquiry.inquiryId)}
                  disabled={actionLoading}
                  style={{ alignSelf: 'flex-start', padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
                >
                  <i className="fa-solid fa-floppy-disk"></i> {actionLoading ? 'Saving...' : 'Save Administrative Edits'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Built-in React Toaster System */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
