'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function CatalogContent() {
  const [servicesData, setServicesData] = useState({
    'Manufacturing Services': {},
    'Publicity Services': {}
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeMainTab, setActiveMainTab] = useState('Manufacturing Services');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServicesData(data);
        
        // Set initial subtab
        const mfgKeys = Object.keys(data['Manufacturing Services']);
        if (mfgKeys.length > 0) {
          setActiveSubTab(mfgKeys[0]);
        }
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load services data', err);
        setIsLoading(false);
      });
  }, []);

  const handleMainTabChange = (tabName) => {
    setActiveMainTab(tabName);
    // Switch to first sub-tab of the new main tab automatically
    const subTabs = Object.keys(servicesData[tabName] || {});
    if (subTabs.length > 0) {
      setActiveSubTab(subTabs[0]);
    } else {
      setActiveSubTab('');
    }
  };

  const currentSubTabs = Object.keys(servicesData[activeMainTab] || {});
  const currentImages = servicesData[activeMainTab]?.[activeSubTab] || [];

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Capabilities</span>
          <h2 className="section-title">Our Services & Products</h2>
          <p className="section-desc">Browse through our exhaustive catalog of custom sign board manufacturing and business publicity materials.</p>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--brand-color)' }}></i>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading portfolio...</p>
          </div>
        ) : (
          <>
            {/* Level 1: Main Category Filtering Tabs */}
            <div className="filter-tabs" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
              {['Manufacturing Services', 'Publicity Services'].map(tab => (
                <button
                  key={tab}
                  className={`filter-btn ${activeMainTab === tab ? 'active' : ''}`}
                  onClick={() => handleMainTabChange(tab)}
                  style={activeMainTab === tab ? { padding: '0.8rem 2rem', fontSize: '1.1rem' } : { padding: '0.8rem 2rem', fontSize: '1.1rem' }}
                >
                  {tab === 'Manufacturing Services' ? <i className="fa-solid fa-industry" style={{ marginRight: '8px' }}></i> : <i className="fa-solid fa-bullhorn" style={{ marginRight: '8px' }}></i>}
                  {tab}
                </button>
              ))}
            </div>

            {/* Level 2: Sub-category Tabs based on Folders */}
            {currentSubTabs.length > 0 && (
              <div className="filter-tabs" style={{ marginBottom: '3rem', flexWrap: 'wrap' }}>
                {currentSubTabs.map(subTab => (
                  <button
                    key={subTab}
                    className={`filter-btn ${activeSubTab === subTab ? 'active' : ''}`}
                    onClick={() => setActiveSubTab(subTab)}
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem', background: activeSubTab === subTab ? 'var(--brand-color)' : 'transparent', border: `1px solid ${activeSubTab === subTab ? 'var(--brand-color)' : 'var(--border-glass)'}` }}
                  >
                    {subTab}
                  </button>
                ))}
              </div>
            )}
            
            {/* Gallery Grid */}
            <div className="gallery-grid animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {currentImages.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem' }}>
                  No images found in this folder. Add some images to <strong>public/{activeMainTab}/{activeSubTab}</strong>.
                </div>
              ) : (
                currentImages.map((imgPath, idx) => (
                  <div 
                    key={idx} 
                    className="gallery-item"
                    onClick={() => setLightboxImage(imgPath)}
                    style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.querySelector('.gallery-img').style.transform = 'scale(1.08)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.querySelector('.gallery-img').style.transform = 'scale(1)';
                    }}
                  >
                    <div className="gallery-img-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                      <img
                        src={imgPath}
                        className="gallery-img"
                        alt={`${activeSubTab} sample ${idx + 1}`}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />
                      <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'var(--transition-smooth)', color: '#fff' }}>
                        <i className="fa-solid fa-magnifying-glass-plus" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                        <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>View Full</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <div className={`modal-overlay ${lightboxImage ? 'active' : ''}`} onClick={() => setLightboxImage(null)}>
        {lightboxImage && (
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <img src={lightboxImage} alt={activeSubTab} className="lightbox-img" />
            <div className="lightbox-caption">{activeSubTab}</div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href={`/contact?interest=${encodeURIComponent(activeSubTab)}`} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }} onClick={() => setLightboxImage(null)}>
                Inquire About This <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="section" style={{ textAlign: 'center', paddingTop: '200px' }}>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
