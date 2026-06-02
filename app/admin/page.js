'use client';

import { useState, useEffect } from 'react';
import DashboardTab from '../../components/admin/DashboardTab';
import ProductsTab from '../../components/admin/ProductsTab';
import ProjectsTab from '../../components/admin/ProjectsTab';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Toast State
  const [toast, setToast] = useState(null);

  // Authenticate from Session on load
  useEffect(() => {
    const logged = sessionStorage.getItem('admin_logged') === 'true';
    if (logged) {
      setIsAuthenticated(true);
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
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
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)', paddingTop: '80px' }}>
      
      {/* Sidebar Navigation */}
      <div className="admin-sidebar" style={{ width: '260px', background: 'var(--bg-primary)', borderRight: '1px solid var(--border-glass)', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: '80px', height: 'calc(100vh - 80px)' }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Control</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid transparent', cursor: 'pointer', background: activeTab === 'dashboard' ? 'var(--brand-glow)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--brand-color)' : 'var(--text-secondary)', transition: 'all 0.3s ease', fontWeight: activeTab === 'dashboard' ? '600' : '500', borderColor: activeTab === 'dashboard' ? 'rgba(255, 87, 34, 0.2)' : 'transparent' }}
          >
            <i className="fa-solid fa-chart-pie" style={{ fontSize: '1.25rem' }}></i> Dashboard Analytics
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid transparent', cursor: 'pointer', background: activeTab === 'products' ? 'var(--brand-glow)' : 'transparent', color: activeTab === 'products' ? 'var(--brand-color)' : 'var(--text-secondary)', transition: 'all 0.3s ease', fontWeight: activeTab === 'products' ? '600' : '500', borderColor: activeTab === 'products' ? 'rgba(255, 87, 34, 0.2)' : 'transparent' }}
          >
            <i className="fa-solid fa-box-open" style={{ fontSize: '1.25rem' }}></i> Manage Products
          </button>
          
          <button 
            onClick={() => setActiveTab('projects')}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid transparent', cursor: 'pointer', background: activeTab === 'projects' ? 'var(--brand-glow)' : 'transparent', color: activeTab === 'projects' ? 'var(--brand-color)' : 'var(--text-secondary)', transition: 'all 0.3s ease', fontWeight: activeTab === 'projects' ? '600' : '500', borderColor: activeTab === 'projects' ? 'rgba(255, 87, 34, 0.2)' : 'transparent' }}
          >
            <i className="fa-solid fa-images" style={{ fontSize: '1.25rem' }}></i> Manage Projects
          </button>
        </nav>
        
        <div style={{ padding: '0 1rem' }}>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Secure Logout
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="admin-content" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'projects' && <ProjectsTab />}
      </div>

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
