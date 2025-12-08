import React, { useMemo } from 'react';
import './Menu.css';
import MealCard from './MealCard';

// Actual meals from THE BALANCED BITE menu - matching the 11 images
const meals = [
  {
    id: 1,
    name: 'Pan-seared Salmon over Farro',
    description: 'Pan-seared salmon served over farro with a butternut squash. A hearty, nutritious meal that\'s both satisfying and delicious.',
    price: 12,
    calories: 450,
    protein: 35,
    tags: ['High-Protein', 'Gluten-Free'],
    allergens: ['Fish'],
    image: '/images/meals/Pan-seared salmon over farro with a butternut squash.png'
  },
  {
    id: 2,
    name: 'Vegetarian Mediterranean Powerbowl',
    description: 'A vibrant bowl packed with Mediterranean flavors - chickpeas, roasted vegetables, olives, and fresh herbs over quinoa.',
    price: 12,
    calories: 420,
    protein: 18,
    tags: ['Vegetarian', 'Plant-Based', 'Gluten-Free'],
    allergens: [],
    image: '/images/meals/Vegetarian Mediterranean Powerbowl.png'
  },
  {
    id: 3,
    name: 'Levantine Chickpea & Pomegranate Fattoush',
    description: 'A vibrant Middle Eastern salad with chickpeas, fresh pomegranate seeds, herbs, and crispy bread. Fresh, flavorful, and plant-based.',
    price: 12,
    calories: 420,
    protein: 15,
    tags: ['Vegetarian', 'Plant-Based', 'Vegan'],
    allergens: [],
    image: '/images/meals/Levantine Chickpea & Pomegranate Fattoush.png'
  },
  {
    id: 4,
    name: 'Chicken Bacon Alfredo',
    description: 'Creamy alfredo pasta with tender chicken and crispy bacon. A comforting, indulgent meal that hits all the right notes.',
    price: 12,
    calories: 410,
    protein: 32,
    tags: ['High-Protein'],
    allergens: ['Wheat', 'Dairy'],
    image: '/images/meals/Chicken Bacon Alfredo.png'
  },
  {
    id: 5,
    name: 'Herb-Crusted Salmon with Garlic Spinach Cream',
    description: 'Perfectly seared salmon with a crispy herb crust, served over creamy garlic spinach. Elegant and full of flavor.',
    price: 12,
    calories: 480,
    protein: 38,
    tags: ['High-Protein', 'Gluten-Free'],
    allergens: ['Fish', 'Dairy'],
    image: '/images/meals/Herb-Crusted Salmon with Garlic Spinach Cream.jpeg'
  },
  {
    id: 6,
    name: 'Grilled Ribeye over Caesar Salad',
    description: 'Tender grilled ribeye steak served over a classic Caesar salad with homemade croutons. A protein-packed, satisfying meal.',
    price: 12,
    calories: 460,
    protein: 42,
    tags: ['High-Protein'],
    allergens: ['Dairy', 'Eggs'],
    image: '/images/meals/Grilled ribeye over a Caesar salad with homemade croutons.png'
  },
  {
    id: 7,
    name: 'Spinach-Artichoke Topped Salmon',
    description: 'Tender salmon fillet topped with creamy spinach-artichoke dip, served alongside perfectly sautéed green beans.',
    price: 12,
    calories: 470,
    protein: 36,
    tags: ['High-Protein', 'Gluten-Free'],
    allergens: ['Fish', 'Dairy'],
    image: '/images/meals/Spinach-Artichoke topped salmon with sautéed green beans.png'
  },
  {
    id: 8,
    name: 'Golden Mac and Cheese',
    description: 'Creamy, golden macaroni and cheese with a perfectly crispy top. The ultimate comfort food, made with love.',
    price: 12,
    calories: 520,
    protein: 20,
    tags: ['Vegetarian'],
    allergens: ['Wheat', 'Dairy', 'Eggs'],
    image: '/images/meals/Golden Mac and cheese.png'
  },
  {
    id: 9,
    name: 'Italian Grinder Salad',
    description: 'All the flavors of your favorite Italian grinder in a fresh, deconstructed salad. Salami, provolone, peppers, and Italian dressing.',
    price: 12,
    calories: 440,
    protein: 28,
    tags: ['High-Protein'],
    allergens: ['Dairy'],
    image: '/images/meals/Grinder Salad Italian.png'
  },
  {
    id: 10,
    name: 'Hot Honey Bacon Egg & Cheese',
    description: 'A breakfast favorite elevated with crispy bacon, perfectly cooked eggs, melted cheese, and a drizzle of spicy hot honey.',
    price: 12,
    calories: 390,
    protein: 24,
    tags: ['High-Protein'],
    allergens: ['Eggs', 'Dairy'],
    image: '/images/meals/Hot honey bacon egg and cheese.png'
  },
  {
    id: 11,
    name: 'Bruschetta Dip',
    description: 'Fresh tomatoes, basil, garlic, and mozzarella in a creamy dip. Perfect for sharing or enjoying as a light meal with bread.',
    price: 12,
    calories: 320,
    protein: 12,
    tags: ['Vegetarian'],
    allergens: ['Dairy'],
    image: '/images/meals/Bruschetta Dip.png'
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
