import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ selectedMeals, removeFromCart, updateQuantity, personalization }) => {
  const navigate = useNavigate();
  const calculateSubtotal = () => {
    return selectedMeals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.08; // 8% tax
    const delivery = selectedMeals.length > 0 ? 5.99 : 0;
    return subtotal + tax + delivery;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const delivery = selectedMeals.length > 0 ? 5.99 : 0;
  const total = calculateTotal();

  return (
    <div className="cart-card">
      <h2>Your Order</h2>
      
      {selectedMeals.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p className="hint">Add meals from the menu to get started!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {selectedMeals.map(meal => (
              <div key={meal.id} className="cart-item">
                <div className="cart-item-header">
                  <span className="cart-item-image">{meal.image}</span>
                  <div className="cart-item-info">
                    <h4>{meal.name}</h4>
                    <p className="cart-item-portion">{meal.portionSize} portion</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(meal.id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
                <div className="cart-item-footer">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(meal.id, meal.quantity - 1)}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity">{meal.quantity}</span>
                    <button
                      onClick={() => updateQuantity(meal.id, meal.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-price">
                    ${(meal.price * meal.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({selectedMeals.reduce((sum, m) => sum + m.quantity, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-notes">
            <p><strong>Meal Plan:</strong> {personalization.mealPlan}</p>
            <p><strong>Portion Size:</strong> {personalization.portionSize}</p>
            {personalization.dietaryPreferences.length > 0 && (
              <p><strong>Preferences:</strong> {personalization.dietaryPreferences.join(', ')}</p>
            )}
            {personalization.allergies.length > 0 && (
              <p><strong>Allergies Avoided:</strong> {personalization.allergies.join(', ')}</p>
            )}
          </div>

          <button 
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
