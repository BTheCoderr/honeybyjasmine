import React from 'react';
import './MealCard.css';

const MealCard = ({ meal, price, portionSize, addToCart }) => {
  const handleAddToCart = () => {
    addToCart({
      ...meal,
      price: parseFloat(price),
      portionSize
    });
  };

  return (
    <div className="meal-card">
      <div className="meal-image">{meal.image}</div>
      <div className="meal-content">
        <div className="meal-header">
          <h3>{meal.name}</h3>
          <div className="meal-price">${price}</div>
        </div>
        <p className="meal-description">{meal.description}</p>
        
        <div className="meal-info">
          <div className="info-item">
            <span className="info-label">Calories:</span>
            <span className="info-value">{meal.calories}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Protein:</span>
            <span className="info-value">{meal.protein}g</span>
          </div>
          <div className="info-item">
            <span className="info-label">Portion:</span>
            <span className="info-value">{portionSize}</span>
          </div>
        </div>

        {meal.tags.length > 0 && (
          <div className="meal-tags">
            {meal.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {meal.allergens.length > 0 && (
          <div className="allergen-warning">
            <span className="warning-icon">⚠️</span>
            <span>Contains: {meal.allergens.join(', ')}</span>
          </div>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MealCard;
