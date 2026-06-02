'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function ProjectsContent() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects data', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Real-World Installations</span>
          <h2 className="section-title">Our Completed Projects</h2>
          <p className="section-desc">Take a look at some of our proudest accomplishments and on-site signage installations delivered across the region.</p>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--brand-color)' }}></i>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading projects...</p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="gallery-grid animate-fade-up" style={{ animationDelay: '0.2s', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {images.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem' }}>
                  No projects found.
                </div>
              ) : (
                images.map((imgPath, idx) => (
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
                        alt={`Project ${idx + 1}`}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />
                      <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'var(--transition-smooth)', color: '#fff' }}>
                        <i className="fa-solid fa-expand" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                        <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>View Image</span>
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
            <img src={lightboxImage} alt="Full screen project view" className="lightbox-img" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }} onClick={() => setLightboxImage(null)}>
                Inquire About a Similar Project <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="section" style={{ textAlign: 'center', paddingTop: '200px' }}>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
