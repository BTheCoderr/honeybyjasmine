import React from 'react';
import Menu from './Menu';
import Personalization from './Personalization';
import Cart from './Cart';

const Home = ({
  selectedMeals,
  personalization,
  addToCart,
  removeFromCart,
  updateQuantity,
  updatePersonalization
}) => {
  return (
    <div className="main-container">
      <div className="content-wrapper">
        <Personalization
          personalization={personalization}
          updatePersonalization={updatePersonalization}
        />
        <Menu
          personalization={personalization}
          addToCart={addToCart}
        />
      </div>
      <Cart
        selectedMeals={selectedMeals}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        personalization={personalization}
      />
    </div>
  );
};

export default Home;

