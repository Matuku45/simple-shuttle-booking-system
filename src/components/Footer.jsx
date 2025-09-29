import React from 'react';

// ===== Footer Component =====
const Footer = () => {
  const footerStyle = {
    width: '100%',
    backgroundColor: '#111827', // gray-900
    color: '#d1d5db', // gray-300
    padding: '32px 16px',
    marginTop: '40px',
    fontSize: '0.875rem',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  };

  const sectionTitle = {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
  };

  const linkStyle = {
    display: 'block',
    color: '#d1d5db',
    textDecoration: 'none',
    marginBottom: '4px',
  };

  const socialStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  };

  const bottomText = {
    textAlign: 'center',
    marginTop: '24px',
    color: '#9ca3af',
    fontSize: '0.75rem',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div>
          <h3 style={sectionTitle}>Useful Links</h3>
          <a href="/" style={linkStyle}>Home</a>
          <a href="/about" style={linkStyle}>About Us</a>
          <a href="/contact" style={linkStyle}>Contact</a>
          <a href="/support" style={linkStyle}>Support</a>
        </div>
        <div>
          <h3 style={sectionTitle}>Pricing</h3>
          <a href="/pricing" style={linkStyle}>Basic Plan</a>
          <a href="/pricing" style={linkStyle}>Advanced Plan</a>
        </div>
        <div>
          <h3 style={sectionTitle}>Booking Solutions</h3>
          <a href="/" style={linkStyle}>Airport Shuttle</a>
          <a href="/" style={linkStyle}>Hotel Transfer</a>
          <a href="/" style={linkStyle}>Limo Transfer</a>
        </div>
        <div>
          <h3 style={sectionTitle}>Customer Care</h3>
          <a href="/privacy" style={linkStyle}>Privacy</a>
          <a href="/terms" style={linkStyle}>Terms</a>
          <a href="/faq" style={linkStyle}>FAQs</a>
        </div>
        <div>
          <h3 style={sectionTitle}>Get in Touch</h3>
          <p>Shuttle Booking Pro</p>
          <p>+61 3 9001 6384</p>
          <p>support@shuttlebooking.com</p>
          <div style={socialStyle}>
            <a href="/" style={linkStyle}>Facebook</a>
            <a href="/" style={linkStyle}>Twitter</a>
            <a href="/" style={linkStyle}>Instagram</a>
          </div>
        </div>
      </div>
      <div style={bottomText}>
        &copy; {new Date().getFullYear()} Shuttle Booking System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
