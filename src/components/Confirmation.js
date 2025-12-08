import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Confirmation.css';

const Confirmation = ({ orderData }) => {
  const navigate = useNavigate();

  if (!orderData) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-content">
          <h1>No Order Found</h1>
          <p>It looks like you haven't placed an order yet.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeSlot) => {
    const times = {
      morning: '9 AM - 12 PM',
      afternoon: '12 PM - 4 PM',
      evening: '4 PM - 8 PM'
    };
    return times[timeSlot] || timeSlot;
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your order! We've received your order and will start preparing your meals.
        </p>

        <div className="order-details-card">
          <h2>Order Details</h2>
          
          <div className="detail-section">
            <h3>Order Information</h3>
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{orderData.orderNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{formatDate(orderData.orderDate)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Delivery Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">
                {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{orderData.customerInfo.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{orderData.customerInfo.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">
                {orderData.customerInfo.address}, {orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Delivery Date:</span>
              <span className="detail-value">
                {formatDate(orderData.customerInfo.deliveryDate)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Delivery Time:</span>
              <span className="detail-value">
                {formatTime(orderData.customerInfo.deliveryTime)}
              </span>
            </div>
            {orderData.customerInfo.specialInstructions && (
              <div className="detail-row">
                <span className="detail-label">Special Instructions:</span>
                <span className="detail-value">{orderData.customerInfo.specialInstructions}</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {orderData.meals.map(meal => (
                <div key={meal.id} className="order-item">
                  <span className="order-item-image">{meal.image}</span>
                  <div className="order-item-info">
                    <div className="order-item-name">{meal.name}</div>
                    <div className="order-item-details">
                      {meal.portionSize} portion • Quantity: {meal.quantity}
                    </div>
                  </div>
                  <div className="order-item-price">
                    ${(meal.price * meal.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>${orderData.delivery.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse More Meals
          </button>
        </div>

        <div className="confirmation-footer">
          <p>You will receive an email confirmation shortly at <strong>{orderData.customerInfo.email}</strong></p>
          <p className="support-text">
            Questions? Contact us at <strong>support@freshmealprep.com</strong> or call <strong>(555) 123-4567</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

