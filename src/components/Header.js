import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount }) => {
  const navigate = useNavigate();
  
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h1>🍽️ Fresh Meal Prep</h1>
          <p>Customized meals, delivered fresh</p>
        </div>
        <div className="cart-badge" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </div>
    </header>
  );
};

export default Header;
