import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = ({ selectedMeals = [], personalization = {}, onOrderComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: 'text',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
    // Food Allergies
    allergies: [],
    allergySeverity: '',
    crossContamination: false,
    otherAllergies: '',
    // Dietary Restrictions & Preferences
    eatingStyle: 'no-specific-diet',
    avoids: [],
    // Food Dislikes & Preferences
    foodDislikes: '',
    texturePreference: '',
    spiceLevel: 'trust-chef',
    // Religious or Cultural
    religiousDietary: 'no',
    religiousNotes: '',
    // Medical
    medicalNeeds: '',
    medicalIngredients: '',
    // Substitutions
    allowSubstitutions: true,
    // Additional Notes
    additionalNotes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateSubtotal = () => {
    if (!selectedMeals || selectedMeals.length === 0) return 0;
    return selectedMeals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.08;
    const delivery = (selectedMeals && selectedMeals.length > 0) ? 5.99 : 0;
    return subtotal + tax + delivery;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const delivery = (selectedMeals && selectedMeals.length > 0) ? 5.99 : 0;
  const total = calculateTotal();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'crossContamination') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (name === 'allowSubstitutions') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle allergy/avoid checkboxes
        const field = name.startsWith('allergy_') ? 'allergies' : 'avoids';
        const itemName = name.replace('allergy_', '').replace('avoid_', '');
        setFormData(prev => ({
          ...prev,
          [field]: checked
            ? [...prev[field], itemName]
            : prev[field].filter(item => item !== itemName)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Zip code is invalid';
    }
    if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!selectedMeals || selectedMeals.length === 0) {
      alert('Your cart is empty. Please add meals before checkout.');
      navigate('/');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const orderInfo = {
        orderNumber: `ORD-${Date.now()}`,
        customerInfo: formData,
        meals: selectedMeals,
        personalization,
        subtotal,
        tax,
        delivery,
        total,
        orderDate: new Date().toISOString()
      };

      onOrderComplete(orderInfo);
      setIsSubmitting(false);
      navigate('/confirmation');
    }, 1500);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-form-section">
          <h1>Checkout</h1>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Contact Method *</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="text"
                      checked={formData.preferredContact === 'text'}
                      onChange={handleChange}
                    />
                    <span>Text</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleChange}
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleChange}
                    />
                    <span>Phone Call</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Food Allergies Section */}
            <div className="form-section">
              <h2>Food Allergies</h2>
              <div className="form-group">
                <label>Select all that apply:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {['No known allergies', 'Dairy', 'Eggs', 'Gluten / Wheat', 'Soy', 'Peanuts', 'Tree nuts (almond, walnut, cashew, etc.)', 'Shellfish', 'Fish', 'Sesame'].map(allergy => (
                    <label key={allergy} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={`allergy_${allergy.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                        checked={allergy === 'No known allergies' 
                          ? formData.allergies.length === 0 || formData.allergies.includes('no known allergies')
                          : formData.allergies.includes(allergy)}
                        onChange={(e) => {
                          if (allergy === 'No known allergies') {
                            setFormData(prev => ({ ...prev, allergies: e.target.checked ? ['No known allergies'] : [] }));
                          } else {
                            handleChange(e);
                          }
                        }}
                      />
                      <span className="text-sm">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.allergies.length > 0 && !formData.allergies.includes('No known allergies') && (
                <>
                  <div className="form-group mt-4">
                    <label htmlFor="otherAllergies">Other Allergies (please list):</label>
                    <input
                      type="text"
                      id="otherAllergies"
                      name="otherAllergies"
                      value={formData.otherAllergies}
                      onChange={handleChange}
                      placeholder="List any other allergies..."
                    />
                  </div>

                  <div className="form-group mt-4">
                    <label>How severe are your allergies? *</label>
                    <div className="flex gap-4 mt-2">
                      {['Mild', 'Moderate', 'Severe / Anaphylactic'].map(severity => (
                        <label key={severity} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="allergySeverity"
                            value={severity.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                            checked={formData.allergySeverity === severity.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                            onChange={handleChange}
                          />
                          <span>{severity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="crossContamination"
                        checked={formData.crossContamination}
                        onChange={handleChange}
                      />
                      <span>Do you require strict cross-contamination precautions? *</span>
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Dietary Restrictions & Preferences */}
            <div className="form-section">
              <h2>Dietary Restrictions & Preferences</h2>
              <div className="form-group">
                <label htmlFor="eatingStyle">Which best describes your eating style? *</label>
                <select
                  id="eatingStyle"
                  name="eatingStyle"
                  value={formData.eatingStyle}
                  onChange={handleChange}
                  className="mt-2"
                >
                  <option value="no-specific-diet">No specific diet</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="halal">Halal</option>
                  <option value="kosher">Kosher (note: kitchen not certified kosher)</option>
                  <option value="low-carb-keto">Low-carb / Keto</option>
                  <option value="high-protein">High-protein</option>
                  <option value="low-sodium">Low-sodium</option>
                  <option value="anti-inflammatory">Anti-inflammatory</option>
                  <option value="lactose-free">Lactose-free</option>
                  <option value="gluten-free">Gluten-free</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group mt-4">
                <label>Do you avoid any of the following?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {['Beef', 'Pork', 'Chicken', 'Turkey', 'Fish', 'Shellfish', 'Eggs', 'Cheese', 'Caffeine'].map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={`avoid_${item.toLowerCase()}`}
                        checked={formData.avoids.includes(item)}
                        onChange={handleChange}
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="form-group mt-2">
                  <input
                    type="text"
                    placeholder="Other (please list)"
                    className="mt-2"
                    onChange={(e) => {
                      if (e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          avoids: [...prev.avoids.filter(a => !a.startsWith('Other:')), `Other: ${e.target.value}`]
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Food Dislikes & Preferences */}
            <div className="form-section">
              <h2>Food Dislikes & Preferences</h2>
              <div className="form-group">
                <label htmlFor="foodDislikes">Are there foods you strongly dislike or prefer not to receive?</label>
                <textarea
                  id="foodDislikes"
                  name="foodDislikes"
                  value={formData.foodDislikes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="List any foods you dislike..."
                />
              </div>

              <div className="form-group mt-4">
                <label>Texture preferences:</label>
                <div className="flex gap-4 mt-2">
                  {['Prefer crispy', 'Prefer soft', 'Sensitive to mixed textures', 'No preferences'].map(texture => (
                    <label key={texture} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="texturePreference"
                        value={texture.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                        checked={formData.texturePreference === texture.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                        onChange={handleChange}
                      />
                      <span className="text-sm">{texture}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group mt-4">
                <label>Spice level:</label>
                <div className="flex gap-4 mt-2">
                  {['Mild only', 'Medium', 'Spicy', 'I trust the chef'].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="spiceLevel"
                        value={level.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                        checked={formData.spiceLevel === level.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                        onChange={handleChange}
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Religious or Cultural Dietary Rules */}
            <div className="form-section">
              <h2>Religious or Cultural Dietary Rules</h2>
              <div className="form-group">
                <label htmlFor="religiousDietary">Do you follow any religious, cultural, or ethical guidelines with your food?</label>
                <select
                  id="religiousDietary"
                  name="religiousDietary"
                  value={formData.religiousDietary}
                  onChange={handleChange}
                  className="mt-2"
                >
                  <option value="no">No</option>
                  <option value="halal">Halal</option>
                  <option value="kosher-style">Kosher-style</option>
                  <option value="no-pork">No pork</option>
                  <option value="no-beef">No beef</option>
                  <option value="fasting-days">Fasting days / restrictions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group mt-4">
                <label htmlFor="religiousNotes">Anything else I should know to respect your beliefs and preferences?</label>
                <textarea
                  id="religiousNotes"
                  name="religiousNotes"
                  value={formData.religiousNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Additional notes about religious or cultural dietary needs..."
                />
              </div>
            </div>

            {/* Medical or Health Considerations */}
            <div className="form-section">
              <h2>Medical or Health Considerations</h2>
              <div className="form-group">
                <label htmlFor="medicalNeeds">Do you have medical dietary needs I should be aware of?</label>
                <textarea
                  id="medicalNeeds"
                  name="medicalNeeds"
                  value={formData.medicalNeeds}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe any medical dietary needs..."
                />
              </div>

              <div className="form-group mt-4">
                <label htmlFor="medicalIngredients">Are there ingredients you must avoid for medical reasons?</label>
                <textarea
                  id="medicalIngredients"
                  name="medicalIngredients"
                  value={formData.medicalIngredients}
                  onChange={handleChange}
                  rows="2"
                  placeholder="List ingredients to avoid for medical reasons..."
                />
              </div>
            </div>

            {/* Substitutions */}
            <div className="form-section">
              <h2>Substitutions</h2>
              <div className="form-group">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowSubstitutions"
                    checked={formData.allowSubstitutions}
                    onChange={handleChange}
                  />
                  <span>Are you open to chef-selected substitutions if an ingredient is unavailable?</span>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-section">
              <h2>Additional Notes</h2>
              <div className="form-group">
                <label htmlFor="additionalNotes">Is there anything else you'd like Honey by Jasmine to know about your meals?</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional information, preferences, or special requests..."
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Delivery Address</h2>
              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    maxLength="2"
                    placeholder="CA"
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="12345"
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Delivery Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryDate">Delivery Date *</label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className={errors.deliveryDate ? 'error' : ''}
                  />
                  {errors.deliveryDate && <span className="error-message">{errors.deliveryDate}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="deliveryTime">Preferred Time *</label>
                  <select
                    id="deliveryTime"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className={errors.deliveryTime ? 'error' : ''}
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 8 PM)</option>
                  </select>
                  {errors.deliveryTime && <span className="error-message">{errors.deliveryTime}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special delivery instructions or notes..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Back to Menu
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {(selectedMeals || []).map(meal => (
              <div key={meal.id} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-image">{meal.image}</span>
                  <div>
                    <div className="summary-item-name">{meal.name}</div>
                    <div className="summary-item-details">
                      {meal.portionSize} • Qty: {meal.quantity}
                    </div>
                  </div>
                </div>
                <div className="summary-item-price">
                  ${(meal.price * meal.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal ({(selectedMeals || []).reduce((sum, m) => sum + m.quantity, 0)} items)</span>
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

          <div className="order-notes-summary">
            <p><strong>Meal Plan:</strong> {personalization?.mealPlan || 'N/A'}</p>
            <p><strong>Portion Size:</strong> {personalization?.portionSize || 'N/A'}</p>
            {personalization?.dietaryPreferences && personalization.dietaryPreferences.length > 0 && (
              <p><strong>Preferences:</strong> {personalization.dietaryPreferences.join(', ')}</p>
            )}
            {personalization?.allergies && personalization.allergies.length > 0 && (
              <p><strong>Allergies Avoided:</strong> {personalization.allergies.join(', ')}</p>
            )}
          </div>

          {/* Join The Honey List CTA */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">
              Want first access to weekly menus and special offers?
            </p>
            <button
              type="button"
              onClick={() => navigate('/#email-signup')}
              className="w-full bg-[#1a4d2e] hover:bg-[#2d5016] text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm"
            >
              Join The Honey List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

