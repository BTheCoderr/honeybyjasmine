import React, { useMemo } from 'react';
import './Menu.css';
import MealCard from './MealCard';

// Actual meals from THE BALANCED BITE menu - This Week's Menu
const meals = [
  {
    id: 1,
    name: 'Tuscan Salmon & Creamed Spinach',
    description: 'Crispy salmon with creamy garlic spinach. A perfectly balanced meal that\'s both elegant and satisfying.',
    price: 12,
    calories: 480,
    protein: 38,
    tags: ['High-Protein', 'Gluten-Free'],
    allergens: ['Fish', 'Dairy'],
    image: '/images/meals/Herb-Crusted Salmon with Garlic Spinach Cream.jpeg'
  },
  {
    id: 2,
    name: 'Mediterranean Chopped Steak Salad',
    description: 'Garlic-herb steak strips with vegetables, feta & oregano dressing. Fresh, flavorful, and protein-packed.',
    price: 12,
    calories: 460,
    protein: 42,
    tags: ['High-Protein'],
    allergens: ['Dairy'],
    image: '/images/meals/mediterraneanChoppedSteakSalad.jpeg'
  },
  {
    id: 3,
    name: 'Roasted Vegetable Pesto Orzo',
    description: 'Orzo, zucchini, peppers & tomatoes with basil pesto. A vibrant, plant-based meal that\'s both hearty and delicious.',
    price: 12,
    calories: 420,
    protein: 18,
    tags: ['Vegetarian', 'Plant-Based'],
    allergens: [],
    image: '/images/meals/Vegetarian Mediterranean Powerbowl.png'
  }
];

const Menu = ({ personalization, addToCart }) => {
  const filteredMeals = useMemo(() => {
    let filtered = [...meals];

    // Filter by dietary preferences
    if (personalization.dietaryPreferences.length > 0) {
      filtered = filtered.filter(meal => {
        return personalization.dietaryPreferences.some(pref =>
          meal.tags.includes(pref)
        );
      });
    }

    // Filter out meals with selected allergies
    if (personalization.allergies.length > 0) {
      filtered = filtered.filter(meal => {
        return !personalization.allergies.some(allergy =>
          meal.allergens.includes(allergy)
        );
      });
    }

    return filtered;
  }, [personalization.dietaryPreferences, personalization.allergies]);

  const getPortionPrice = (basePrice) => {
    const multipliers = {
      small: 0.85,
      regular: 1,
      large: 1.25
    };
    return (basePrice * multipliers[personalization.portionSize]).toFixed(2);
  };

  return (
    <div className="menu-section">
      <div className="menu-header">
        <h2>This Week's Menu</h2>
        <p className="menu-subtitle">
          {filteredMeals.length} {filteredMeals.length === 1 ? 'meal' : 'meals'} available
          {personalization.dietaryPreferences.length > 0 && ' • Filtered by your preferences'}
        </p>
      </div>

      {filteredMeals.length === 0 ? (
        <div className="no-meals">
          <p>No meals match your current filters.</p>
          <p className="hint">Try adjusting your dietary preferences or allergies.</p>
        </div>
      ) : (
        <div className="meals-grid">
          {filteredMeals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              price={getPortionPrice(meal.price)}
              portionSize={personalization.portionSize}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
