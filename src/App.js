import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Confirmation from './components/Confirmation';
import './App.css';

// Order Page Component
const OrderPage = () => {
  const navigate = useNavigate();
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [personalization] = useState({
    mealPlan: 'Weekly',
    portionSize: 'Regular',
    dietaryPreferences: [],
    allergies: []
  });

  const addToCart = (meal) => {
    const existingMeal = selectedMeals.find(m => m.id === meal.id);
    if (existingMeal) {
      setSelectedMeals(selectedMeals.map(m => 
        m.id === meal.id ? { ...m, quantity: m.quantity + 1 } : m
      ));
    } else {
      setSelectedMeals([...selectedMeals, { ...meal, quantity: 1, portionSize: 'Regular' }]);
    }
  };

  const removeFromCart = (mealId) => {
    setSelectedMeals(selectedMeals.filter(m => m.id !== mealId));
  };

  const updateQuantity = (mealId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
    } else {
      setSelectedMeals(selectedMeals.map(m => 
        m.id === mealId ? { ...m, quantity } : m
      ));
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/hero/Feminine Logo Designs for Premium Honey Brand.svg" 
                alt="THE BALANCED BITE - honey by Jasmine"
                className="h-12 sm:h-16 w-auto"
                onError={(e) => {
                  // Fallback to PNG if SVG fails
                  if (e.target.src.includes('.svg')) {
                    e.target.src = '/images/hero/Feminine Logo Designs for Premium Honey Brand.png';
                  } else if (e.target.src.includes('.png')) {
                    // Fallback to JPG if PNG fails
                    e.target.src = '/images/hero/Feminine Logo Designs for Premium Honey Brand.jpg';
                  }
                }}
              />
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-[#1a4d2e] hover:text-[#2d5016] transition-colors font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-[#1a4d2e] mb-8">Order Your Meals</h1>
            <Menu personalization={personalization} addToCart={addToCart} />
          </div>
          <div className="lg:col-span-1">
            <Cart
              selectedMeals={selectedMeals}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              personalization={personalization}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [orderData, setOrderData] = useState(null);

  const handleOrderComplete = (orderInfo) => {
    setOrderData(orderInfo);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route 
          path="/checkout" 
          element={
            <Checkout 
              selectedMeals={[]}
              personalization={{}}
              onOrderComplete={handleOrderComplete}
            />
          } 
        />
        <Route 
          path="/confirmation" 
          element={<Confirmation orderData={orderData} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
