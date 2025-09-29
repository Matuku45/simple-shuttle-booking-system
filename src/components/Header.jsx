import React from 'react';
import logo from './imgs/logo.jpg';

const Header = ({ onAboutClick, onSignUpClick, onSignInClick }) => {
  const headerStyle = {
    width: '100%',
    backgroundColor: '#1d4ed8',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.2s',
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: '#1d4ed8',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '12px',
    textDecoration: 'none',
    fontSize: '1rem',
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="Logo" style={{ height: '44px', borderRadius: '8px', background: '#fff', padding: '2px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: '1px' }}>Shuttle Booking Pro</span>
        </div>
        <nav style={navStyle}>
          <a href="/" style={navLinkStyle}>Home</a>
          <a href="#" style={navLinkStyle} onClick={e => { e.preventDefault(); onAboutClick(); }}>About</a>
          <a href="/contact" style={navLinkStyle}>Contact</a>
          <a href="/support" style={navLinkStyle}>Support</a>
          <a
            href="#"
            style={buttonStyle}
            onClick={e => {
              e.preventDefault();
              if (onSignUpClick) onSignUpClick();
            }}
          >
            Create Account
          </a>
          <a
            href="#"
            style={buttonStyle}
            onClick={e => {
              e.preventDefault();
              if (onSignInClick) onSignInClick();
            }}
          >
            Sign In
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;