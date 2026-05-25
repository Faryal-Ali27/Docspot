import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-logo-desc">
            <Link to="/" className="navbar-logo" style={{ marginBottom: '16px' }}>
              <HeartPulse size={24} />
              <span>DocSpot</span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              A premium, ultra-modern Clinic Appointment Booking System designed to connect patients with top medical specialists seamlessly. Experience healthcare elevated.
            </p>
          </div>
          
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link to="/book">Cardiology Care</Link></li>
              <li><Link to="/book">Pediatrics Unit</Link></li>
              <li><Link to="/book">Dermatology Clinic</Link></li>
              <li><Link to="/book">Neurological Studies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/book">Book Now</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-links" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '8px' }}>🏥 100 Medical Plaza, Suite 400</li>
              <li style={{ marginBottom: '8px' }}>📞 +1 (800) 555-DOCS</li>
              <li style={{ marginBottom: '8px' }}>✉️ contact@docspot.health</li>
              <li style={{ marginBottom: '8px' }}>⏰ Mon - Fri: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DocSpot Clinic. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
