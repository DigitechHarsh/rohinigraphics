export default function About() {
  return (
    <div className="section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <span className="section-subtitle">Who We Are</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <img src="/logo/18years.jpeg" alt="18 Years" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
            <h2 className="section-title" style={{ marginBottom: 0 }}>Celebrating 18 Years Since 2008</h2>
          </div>
          <p className="section-desc" style={{ marginTop: '0.5rem' }}>Rohini Graphics is Surat's premier design-to-build sign manufacturer. We combine engineering excellence, modern technology, and visual design mastery.</p>
        </div>
        
        <div className="about-grid animate-fade-up" style={{ marginTop: '0' }}>
          {/* Left: Owner Card and Profile */}
          <div className="about-visual">
            <div style={{ background: 'radial-gradient(circle at top right, var(--brand-glow) 0%, transparent 60%)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <i className="fa-solid fa-quote-left" style={{ fontSize: '2rem', color: 'var(--brand-color)', marginBottom: '1rem', display: 'block' }}></i>
              <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                "We believe that a premium signboard is the silent ambassador of your brand. Since 2008, our mission has been to combine art and technology to deliver visual solutions of exceptional elegance and durability."
              </p>
              
              <div className="owner-card">
                <img 
                  src="/images/owner_amarkumar.png" 
                  alt="Amarkumar Lavne - Founder of Rohini Graphics" 
                  className="owner-img"
                />
                <div className="owner-info">
                  <h4>Amarkumar Lavne</h4>
                  <p>Founder &amp; Owner, Rohini Graphics</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Vision, Mission, and Features */}
          <div className="about-content">
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--brand-color)' }}>About Us</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Founded by a visionary creative professional in the year 2008, Rohini Graphics is a confluence of vastly experienced people in manufacturing, product development, quality control, distribution, and sales of high-quality Sign Boards and Graphics Design services. Our senior most members of the management are pioneers in this industry in India and have worked for nearly two decades in this sector.
            </p>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              All the knowledge is incorporated to give you products and visual identity solutions of exceptional quality.
            </p>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              We manufacture products with the art of advanced technology to give great quality and long-lasting products. Our sign boards and display systems are low in maintenance and tough enough to withstand demanding outdoor environments. Our brand is a perfect amalgamation of Elegance, Durability, Strength, Colours, Shades, Finish, and Style.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase' }}>
                  <i className="fa-solid fa-eye" style={{ color: 'var(--brand-color)' }}></i> Vision:
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  With continuous improvements in quality and creative innovation, we want to be the top-of-the-mind Graphics Design and Sign Board manufacturer for Builders, Architects, Corporate Brands, Interior Designers, Retailers, and Contractors.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase' }}>
                  <i className="fa-solid fa-bullseye" style={{ color: 'var(--brand-color)' }}></i> Mission:
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  To be a pioneer in marking durable and high-quality signages and brand identities. We want our creative designs and manufactured products to set a benchmark for the segment in which we operate.
                </p>
              </div>
            </div>
            
            <div className="about-features">
              <div className="about-feature-item">
                <div className="about-feature-icon"><i className="fa-solid fa-microchip"></i></div>
                <div className="about-feature-text">
                  <h4>Advanced Technology</h4>
                  <p>State-of-the-art fiber lasers and precision bending.</p>
                </div>
              </div>
              <div className="about-feature-item">
                <div className="about-feature-icon"><i className="fa-solid fa-award"></i></div>
                <div className="about-feature-text">
                  <h4>Premium Grade Materials</h4>
                  <p>Heavy duty metals, weather-proof LEDs, high-transmittance acrylics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
