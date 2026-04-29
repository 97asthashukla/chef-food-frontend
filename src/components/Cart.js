import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';
import { CDN_URL, FALLBACK_IMAGE } from '../utils/constant';

export const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, restaurantInfo, clearCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        <h1 className="cart-title">Your Cart</h1>
        
        {restaurantInfo && (
          <div className="restaurant-badge">
            <strong>Restaurant:</strong> {restaurantInfo.name}
          </div>
        )}

        <div className="cart-items-list">
          {cartItems.map(item => {
            const imageUrl = item.imageId ? `${CDN_URL}/${item.imageId}` : FALLBACK_IMAGE;
            const price = item.price ?? item.defaultPrice;
            const isVeg = item.isVeg === 1 || item?.itemAttribute?.vegClassifier === "VEG";

            return (
              <div className="cart-item" key={item.id}>
                <img src={imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <span className={`veg-badge-small ${isVeg ? 'veg' : 'non-veg'}`}>
                      {isVeg ? 'V' : 'N'}
                    </span>
                  </div>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">₹ {(price / 100).toFixed(2)}</div>
                </div>
                
                <div className="cart-item-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ₹ {((price / 100) * item.quantity).toFixed(2)}
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹ {getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹ 0</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Charges</span>
            <span>₹ {(getTotalPrice() * 0.05).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹ {(getTotalPrice() + getTotalPrice() * 0.05).toFixed(2)}</span>
          </div>
        </div>

        <div className="cart-actions">
          <Link to="/" className="continue-shopping-btn">
            ← Continue Shopping
          </Link>
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};
