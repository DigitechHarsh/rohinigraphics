import Link from 'next/link';
import TiltWrapper from '@/components/TiltWrapper';

export default function Home() {
  return (
    <>
      {/* 1. Full-Bleed Hero Section */}
      <div className="hero-full">
        <div className="hero-full-content">
          <div className="hero-tag animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Premium Manufacturing Unit
          </div>
          <h1 className="hero-full-title animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Elevating Brands With <span>Premium Signages</span>
          </h1>
          <p className="hero-full-desc animate-fade-up" style={{ animationDelay: '0.3s' }}>
            We design, manufacture, and install state-of-the-art glowing sign boards, custom steel fabrication, and breathtaking business display panels.
          </p>
          <div className="hero-full-actions animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/contact" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Request a Quote <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
      
      {/* 2. Authority Stats Strip */}
      <div className="stats-strip">
        <div className="container stats-grid animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="stat-box">
            <h3>16+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-box">
            <h3>500+</h3>
            <p>Corporate Clients</p>
          </div>
          <div className="stat-box">
            <h3>100%</h3>
            <p>In-House Production</p>
          </div>
        </div>
      </div>

      {/* 3. Visual Services Showcase (Bento Box) */}
      <div className="section">
        <div className="container">
          <div className="section-header animate-fade-up">
            <span className="section-subtitle">Our Expertise</span>
            <h2 className="section-title">Manufacturing Capabilities</h2>
          </div>
          
          <div className="services-bento">
            <TiltWrapper className="bento-item large animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <img src="/images/led_letters.png" alt="LED Letters" className="bento-bg" />
              <div className="bento-overlay">
                <div className="bento-content">
                  <h3>LED Glowing Letters</h3>
                  <p>Energy-efficient, waterproof, and visually stunning 3D lettering for premium storefronts.</p>
                  <Link href="/products?filter=led" className="bento-btn">View Gallery <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            </TiltWrapper>
            
            <TiltWrapper className="bento-item animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <img src="/images/ss_chrome.png" alt="SS Letters" className="bento-bg" />
              <div className="bento-overlay">
                <div className="bento-content">
                  <h3>SS Chrome Letters</h3>
                  <p>Sleek, rust-proof stainless steel finishes.</p>
                  <Link href="/products?filter=ss" className="bento-btn">View Gallery <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            </TiltWrapper>
            
            <TiltWrapper className="bento-item animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <img src="/images/structure_fab.png" alt="Metal Structures" className="bento-bg" />
              <div className="bento-overlay">
                <div className="bento-content">
                  <h3>Heavy Fabrication</h3>
                  <p>Robust metal framing and structural signage.</p>
                  <Link href="/products?filter=structural" className="bento-btn">View Gallery <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            </TiltWrapper>
          </div>
        </div>
      </div>
      
      {/* 4. NABH Certification */}
      <div className="section" style={{ background: 'var(--bg-secondary)', padding: '5rem 0 2.5rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">NABH Based Sign Board</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/NABH/1.png" 
              alt="NABH Certified Healthcare Facades" 
              className="cert-img"
              style={{ width: '100%', maxWidth: '800px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', transition: 'transform 0.3s ease' }} 
            />
          </div>
        </div>
      </div>

      {/* 5. Satisfied Customers */}
      <div className="section" style={{ background: 'var(--bg-primary)', padding: '2.5rem 0 5rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Our Satisfied Customers</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/Satisfied Customer/1.png" 
              alt="Over 500+ Satisfied Customers" 
              className="cert-img"
              style={{ width: '100%', maxWidth: '1000px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', transition: 'transform 0.3s ease' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
