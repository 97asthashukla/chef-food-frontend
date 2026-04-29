import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

export const Checkout = () => {
  const { cartItems, getTotalPrice, restaurantInfo, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    paymentMethod: 'cod' // Default to Cash on Delivery
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')}>Go Shopping</button>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalPrice() + getTotalPrice() * 0.05;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || 
        !formData.state || !formData.zipcode) {
      alert('Please fill in all fields');
      return;
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}`;

    // Order details
    const orderDetails = {
      orderId,
      customerInfo: formData,
      restaurantName: restaurantInfo?.name,
      items: cartItems,
      subtotal: getTotalPrice(),
      tax: getTotalPrice() * 0.05,
      total: totalAmount,
      paymentMethod: formData.paymentMethod,
      orderTime: new Date().toLocaleString(),
      status: 'Confirmed'
    };

    // Store order in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear cart and show success
    clearCart();
    setOrderPlaced(true);

    // Show success message
    setTimeout(() => {
      alert(`Order Placed Successfully!\nOrder ID: ${orderId}\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nPayment Method: ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Delivery Address Section */}
          <div className="checkout-section">
            <h2 className="section-title">Delivery Address</h2>
            <form className="address-form" onSubmit={handlePlaceOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your delivery address"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder="Enter zip code"
                    required
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <h2 className="section-title" style={{ marginTop: '40px' }}>Payment Method</h2>
              
              <div className="payment-methods">
                <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => handlePaymentMethodChange('cod')}
                  />
                  <span className="payment-label">
                    <strong>💵 Cash on Delivery</strong>
                    <small>Pay when you receive your order</small>
                  </span>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'online' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={() => handlePaymentMethodChange('online')}
                  />
                  <span className="payment-label">
                    <strong>💳 Online Payment</strong>
                    <small>Pay securely with card/UPI</small>
                  </span>
                </label>
              </div>

              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h2 className="section-title">Order Summary</h2>
              
              {restaurantInfo && (
                <div className="restaurant-info-summary">
                  <h3>{restaurantInfo.name}</h3>
                </div>
              )}

              <div className="summary-items">
                {cartItems.map(item => {
                  const price = item.price ?? item.defaultPrice;
                  return (
                    <div className="summary-item" key={item.id}>
                      <span className="item-name">{item.name} x {item.quantity}</span>
                      <span className="item-amount">₹ {((price / 100) * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-details">
                <div className="detail-row">
                  <span>Subtotal</span>
                  <span>₹ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span>Delivery Fee</span>
                  <span>₹ 0</span>
                </div>
                <div className="detail-row">
                  <span>Taxes & Charges (5%)</span>
                  <span>₹ {(getTotalPrice() * 0.05).toFixed(2)}</span>
                </div>
                <div className="detail-row total">
                  <strong>Total Amount</strong>
                  <strong>₹ {totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              <div className="payment-info">
                {formData.paymentMethod === 'cod' ? (
                  <p className="cod-message">
                    ✓ You'll pay <strong>₹ {totalAmount.toFixed(2)}</strong> at the time of delivery
                  </p>
                ) : (
                  <p className="online-message">
                    Proceed with secure online payment
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
