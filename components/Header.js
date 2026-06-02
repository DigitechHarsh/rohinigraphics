'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuActive(false);

  return (
    <header id="header">
      <div className="container nav-wrapper">
        <Link href="/" className="logo" onClick={closeMenu}>
          <img src="/logo/1.png" alt="Rohini Graphics Logo" style={{ height: '50px', width: 'auto' }} />
        </Link>
        
        {/* Navigation Menu Links */}
        <ul className={`nav-menu ${menuActive ? 'active' : ''}`} id="nav-menu">
          <li>
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className={`nav-link ${pathname.startsWith('/products') ? 'active' : ''}`} onClick={closeMenu}>
              Services &amp; Products
            </Link>
          </li>
          <li>
            <Link href="/projects" className={`nav-link ${pathname.startsWith('/projects') ? 'active' : ''}`} onClick={closeMenu}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`} onClick={closeMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`} onClick={closeMenu}>
              Contact &amp; Quote
            </Link>
          </li>
        </ul>
        
        {/* Header Actions */}
        <div className="nav-actions">
          <Link href="/contact" className="btn btn-primary" onClick={closeMenu}>
            <span>Get Free Quote</span>
            <i className="fa-solid fa-paper-plane"></i>
          </Link>
          <button className="menu-btn" id="menu-btn" aria-label="Toggle Mobile Menu" onClick={() => setMenuActive(!menuActive)}>
            <i className={`fa-solid ${menuActive ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
