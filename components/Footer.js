import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            <img src="/logo/1.png" alt="Rohini Graphics Logo" style={{ height: '40px', width: 'auto' }} />
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Surat's leading designer and manufacturer of state-of-the-art glowing sign boards, custom steel fabrication, and public display panels. Empowering brands since 2008.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://wa.me/919727968268" className="theme-toggle" style={{ width: '36px', height: '36px' }} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#" className="theme-toggle" style={{ width: '36px', height: '36px' }}>
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="theme-toggle" style={{ width: '36px', height: '36px' }}>
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="footer-title">Navigation</h4>
          <div className="footer-links">
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/products" className="footer-link">Services &amp; Products</Link>
            <Link href="/projects" className="footer-link">Projects Portfolio</Link>
            <Link href="/about" className="footer-link">About Us</Link>
            <Link href="/contact" className="footer-link">Request Quote</Link>
          </div>
        </div>
        
        <div>
          <h4 className="footer-title">Categories</h4>
          <div className="footer-links">
            <Link href="/products?filter=manufacturing" className="footer-link">Manufacturing Services</Link>
            <Link href="/products?filter=publicity" className="footer-link">Publicity Services</Link>
          </div>
        </div>
        
        <div>
          <h4 className="footer-title">Quick Information</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-clock" style={{ color: 'var(--brand-color)', marginRight: '8px' }}></i>
            Mon - Sat: 9:30 AM - 8:30 PM
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-mobile-screen-button" style={{ color: 'var(--brand-color)', marginRight: '8px' }}></i>
            +91 97279 68268
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-envelope" style={{ color: 'var(--brand-color)', marginRight: '8px' }}></i>
            rohini.graphic08@gmail.com
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-building-circle-check" style={{ color: 'var(--brand-color)', marginRight: '8px' }}></i>
            Govt. MSME Regd. | GeM Supplier
          </p>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>&copy; {currentYear} Rohini Graphics. All Rights Reserved. Surat, Gujarat, India.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Made by <strong style={{ color: 'var(--brand-color)' }}>DigitechHarsh</strong>
        </p>
      </div>
    </footer>
  );
}
