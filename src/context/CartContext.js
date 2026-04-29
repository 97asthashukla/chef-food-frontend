import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  const addToCart = (item, restaurantData) => {
    // If switching restaurants, clear cart
    if (restaurantInfo && restaurantInfo.id !== restaurantData.id) {
      setCartItems([
        { ...item, quantity: 1, itemId: item.id }
      ]);
      setRestaurantInfo(restaurantData);
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1, itemId: item.id }]);
    }

    if (!restaurantInfo) {
      setRestaurantInfo(restaurantData);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantInfo(null);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price ?? item.defaultPrice;
      return total + (price / 100 * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      restaurantInfo,
      setRestaurantInfo
    }}>
      {children}
    </CartContext.Provider>
  );
};
