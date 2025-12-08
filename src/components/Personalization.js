import React from 'react';
import './Personalization.css';

const Personalization = ({ personalization, updatePersonalization }) => {
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Gluten-Free',
    'Dairy-Free',
    'High-Protein'
  ];

  const allergyOptions = [
    'Peanuts',
    'Tree Nuts',
    'Shellfish',
    'Fish',
    'Eggs',
    'Soy',
    'Wheat',
    'Sesame',
    'Dairy',
    'Sulfites'
  ];

  const togglePreference = (pref) => {
    const current = personalization.dietaryPreferences;
    const updated = current.includes(pref)
      ? current.filter(p => p !== pref)
      : [...current, pref];
    updatePersonalization({ dietaryPreferences: updated });
  };

  const toggleAllergy = (allergy) => {
    const current = personalization.allergies;
    const updated = current.includes(allergy)
      ? current.filter(a => a !== allergy)
      : [...current, allergy];
    updatePersonalization({ allergies: updated });
  };

  return (
    <div className="personalization-card">
      <h2>Customize Your Meals</h2>
      
      <div className="section">
        <h3>Dietary Preferences</h3>
        <div className="option-grid">
          {dietaryOptions.map(option => (
            <button
              key={option}
              className={`option-btn ${personalization.dietaryPreferences.includes(option) ? 'active' : ''}`}
              onClick={() => togglePreference(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Allergies & Restrictions</h3>
        <div className="option-grid">
          {allergyOptions.map(allergy => (
            <button
              key={allergy}
              className={`option-btn allergy ${personalization.allergies.includes(allergy) ? 'active' : ''}`}
              onClick={() => toggleAllergy(allergy)}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Portion Size</h3>
        <div className="radio-group">
          {['Small', 'Regular', 'Large'].map(size => (
            <label key={size} className="radio-label">
              <input
                type="radio"
                name="portionSize"
                value={size.toLowerCase()}
                checked={personalization.portionSize === size.toLowerCase()}
                onChange={(e) => updatePersonalization({ portionSize: e.target.value })}
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Meal Plan</h3>
        <div className="radio-group">
          {['Weekly', 'Bi-Weekly', 'Monthly'].map(plan => (
            <label key={plan} className="radio-label">
              <input
                type="radio"
                name="mealPlan"
                value={plan.toLowerCase()}
                checked={personalization.mealPlan === plan.toLowerCase()}
                onChange={(e) => updatePersonalization({ mealPlan: e.target.value })}
              />
              <span>{plan}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Personalization;
