import React, { useMemo } from 'react';
import './Menu.css';
import MealCard from './MealCard';

const Menu = ({ personalization, addToCart }) => {
  const meals = [
    {
      id: 1,
      name: 'Grilled Chicken & Quinoa Bowl',
      description: 'Tender grilled chicken with quinoa, roasted vegetables, and tahini dressing',
      price: 12.99,
      calories: 520,
      protein: 45,
      tags: ['High-Protein', 'Gluten-Free'],
      allergens: ['Dairy'],
      image: '🍗'
    },
    {
      id: 2,
      name: 'Mediterranean Salmon',
      description: 'Herb-crusted salmon with couscous, Greek salad, and lemon vinaigrette',
      price: 14.99,
      calories: 580,
      protein: 38,
      tags: ['High-Protein'],
      allergens: ['Fish'],
      image: '🐟'
    },
    {
      id: 3,
      name: 'Vegan Buddha Bowl',
      description: 'Chickpeas, sweet potato, kale, avocado, and quinoa with tahini dressing',
      price: 11.99,
      calories: 450,
      protein: 18,
      tags: ['Vegan', 'Vegetarian', 'Gluten-Free'],
      allergens: [],
      image: '🥗'
    },
    {
      id: 4,
      name: 'Keto Beef Stir-Fry',
      description: 'Grass-fed beef with broccoli, bell peppers, and cauliflower rice',
      price: 13.99,
      calories: 420,
      protein: 42,
      tags: ['Keto', 'Low-Carb', 'High-Protein'],
      allergens: ['Soy'],
      image: '🥩'
    },
    {
      id: 5,
      name: 'Turkey & Sweet Potato',
      description: 'Lean ground turkey with roasted sweet potato, green beans, and cranberry sauce',
      price: 12.49,
      calories: 480,
      protein: 40,
      tags: ['High-Protein', 'Gluten-Free'],
      allergens: [],
      image: '🦃'
    },
    {
      id: 6,
      name: 'Paleo Power Bowl',
      description: 'Grilled chicken, sweet potato, Brussels sprouts, and avocado with olive oil',
      price: 13.49,
      calories: 510,
      protein: 44,
      tags: ['Paleo', 'Gluten-Free', 'Dairy-Free', 'High-Protein'],
      allergens: [],
      image: '💪'
    },
    {
      id: 7,
      name: 'Vegetarian Pasta Primavera',
      description: 'Whole wheat pasta with seasonal vegetables, marinara, and parmesan',
      price: 10.99,
      calories: 490,
      protein: 20,
      tags: ['Vegetarian'],
      allergens: ['Wheat', 'Dairy', 'Eggs'],
      image: '🍝'
    },
    {
      id: 8,
      name: 'Asian Tofu Bowl',
      description: 'Crispy tofu with brown rice, edamame, carrots, and ginger soy sauce',
      price: 11.49,
      calories: 440,
      protein: 22,
      tags: ['Vegan', 'Vegetarian'],
      allergens: ['Soy'],
      image: '🥢'
    }
  ];

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
        <h2>Our Menu</h2>
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
