import "../RestaurantMenuBody.css";
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CDN_URL, FALLBACK_IMAGE, buildMenuUrl } from "../utils/constant";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import { FilterContext } from "../context/FilterContext";


export const RestaurantMenu = () => {
  const [restaurantMenu, setRestaurantMenu] = useState(null);
  const { id } = useParams();
  const { selectedLocation } = useContext(LocationContext);
  const { foodTypeFilter } = useContext(FilterContext);
  const { addToCart, updateQuantity, cartItems, getTotalPrice } = useContext(CartContext);

  useEffect(() => {
    if (selectedLocation) {
      fetchData();
    }
  }, [id, selectedLocation]);

  async function fetchData() {
    try {
      const url = buildMenuUrl(id, selectedLocation.lat, selectedLocation.lng);
      const response = await fetch(url);
      if (response.ok) {
        const resData = await response.json();
        setRestaurantMenu(resData);
        return;
      }

      // Fallback: relay Swiggy menu through r.jina.ai when backend proxy fails in production.
      const swiggyMenuUrl = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&restaurantId=${id}`;
      const relayUrl = `https://r.jina.ai/http://${swiggyMenuUrl.replace("https://", "")}`;
      const relayResponse = await fetch(relayUrl);

      if (!relayResponse.ok) {
        throw new Error("Both proxy and relay menu fetch failed");
      }

      const relayText = await relayResponse.text();
      const jsonStart = relayText.indexOf("{");
      if (jsonStart === -1) {
        throw new Error("Relay response did not contain JSON");
      }

      const resData = JSON.parse(relayText.slice(jsonStart));
      setRestaurantMenu(resData);
    } catch (error) {
      setRestaurantMenu({ data: { cards: [] } });
    }
  }

  const cards = restaurantMenu?.data?.cards || [];

  const restaurantCard = cards.find((card) =>
    card?.card?.card?.["@type"]?.includes("swiggy.presentation.food.v2.Restaurant")
  );
  const restaurantInfo = restaurantCard?.card?.card?.info || {};

  const regularCards =
    cards.find((card) => card?.groupedCard?.cardGroupMap?.REGULAR?.cards)?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

  // Helper function to check if item matches food type filter
  const matchesFoodTypeFilter = (item) => {
    const isVeg = item.isVeg === 1 || item?.itemAttribute?.vegClassifier === "VEG";
    
    if (foodTypeFilter === "veg") {
      return isVeg;
    }
    if (foodTypeFilter === "nonVeg") {
      return !isVeg;
    }
    return true; // "all" shows everything
  };

  const menuCategories = regularCards
    .map((categoryCard) => {
      const category = categoryCard?.card?.card;
      if (!category?.title || !Array.isArray(category?.itemCards)) {
        return null;
      }
      
      // Filter items based on food type filter
      const filteredItems = category.itemCards.filter((itemCard) => {
        const itemInfo = itemCard?.card?.info || {};
        return matchesFoodTypeFilter(itemInfo);
      });
      
      return {
        ...category,
        itemCards: filteredItems
      };
    })
    .filter(
      (category) =>
        category &&
        category?.title &&
        Array.isArray(category?.itemCards) &&
        category.itemCards.length > 0
    );

  if (!restaurantMenu) {
    return <h1>Loading...</h1>;
  }

  const {
    name,
    costForTwoMessage,
    avgRating,
    cuisines = [],
    totalRatingsString,
    sla,
  } = restaurantInfo;

  const formatPrice = (value) => {
    if (!value) {
      return "0";
    }

    return (value / 100).toFixed(0);
  };

  const cartQuantityMap = cartItems.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  return (
    <div className="restaurant-menu-body">
      <div className="menu-header">
        <h1 className="restaurant-name">{name || "Restaurant"}</h1>
        <div className="restaurant-info">
          <div className="info-item">
            <span className="rating">{avgRating || "-"}</span>
            <span className="rating-count">{totalRatingsString || "No ratings"}</span>
          </div>
          <div className="info-item">
            <span className="cost">{costForTwoMessage || "Cost unavailable"}</span>
          </div>
          <div className="info-item">
            <span className="cuisines">{cuisines.join(", ") || "Cuisines unavailable"}</span>
          </div>
          <div className="info-item">
            <span className="delivery-time">{sla?.slaString || "Delivery time unavailable"}</span>
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary-card">
          <div className="cart-info">
            <div className="cart-item-count">
              <span className="count-label">Items in Cart</span>
              <span className="count-value">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="cart-divider"></div>
            <div className="cart-total">
              <span className="total-label">Total Amount</span>
              <span className="total-value">₹ {(getTotalPrice() + getTotalPrice() * 0.05).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/cart" className="view-cart-btn">
            View Cart
          </Link>
        </div>
      )}

      {menuCategories.length === 0 ? (
        <div className="menu-category">
          <h2 className="category-title">No menu available</h2>
        </div>
      ) : (
        menuCategories.map((category) => (
          <div className="menu-category" key={category.title}>
            <h2 className="category-title">
              {category.title} ({category.itemCards.length})
            </h2>
            <div className="menu-items">
              {category.itemCards.map((itemCard) => {
                const itemInfo = itemCard?.card?.info || {};
                const imageUrl = itemInfo.imageId ? `${CDN_URL}/${itemInfo.imageId}` : FALLBACK_IMAGE;
                const isVeg = itemInfo.isVeg === 1 || itemInfo?.itemAttribute?.vegClassifier === "VEG";
                const rating = itemInfo?.ratings?.aggregatedRating?.rating || "-";
                const ratingCount = itemInfo?.ratings?.aggregatedRating?.ratingCountV2 || 0;

                return (
                  <div className="menu-item" key={itemInfo.id || itemInfo.name}>
                    <div className="item-image-container">
                      <img src={imageUrl} alt={itemInfo.name || "Menu Item"} className="item-image" />
                      {isVeg ? (
                        <span className="veg-badge">V</span>
                      ) : (
                        <span className="veg-badge non-veg">N</span>
                      )}
                      {itemInfo.isBestseller ? <span className="item-badge">Bestseller</span> : null}
                    </div>
                    <div className="item-content">
                      <h3 className="item-name">{itemInfo.name || "Unnamed Item"}</h3>
                      <p className="item-description">
                        {itemInfo.description || "No description available"}
                      </p>
                      <div className="item-footer">
                        <span className="item-price">
Rs {formatPrice(itemInfo.price ?? itemInfo.defaultPrice)}
                        </span>
                        <div className="item-rating">
                          <span className="star">*</span>
                          <span className="rating-value">{rating}</span>
                          <span className="rating-count-item">({ratingCount})</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        {cartQuantityMap[itemInfo.id] ? (
                          <div className="quantity-selector">
                            <button 
                              className="qty-decrease-btn"
                              onClick={() => {
                                const currentQty = cartQuantityMap[itemInfo.id] || 0;
                                updateQuantity(itemInfo.id, currentQty - 1);
                              }}
                            >
                              −
                            </button>
                            <span className="qty-display">{cartQuantityMap[itemInfo.id]}</span>
                            <button 
                              className="qty-increase-btn"
                              onClick={() => {
                                addToCart(itemInfo, {
                                  id: id,
                                  name: name,
                                  cuisines: cuisines,
                                  avgRating: avgRating
                                });
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="add-btn"
                            onClick={() => {
                              addToCart(itemInfo, {
                                id: id,
                                name: name,
                                cuisines: cuisines,
                                avgRating: avgRating
                              });
                            }}
                          >
                            Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      
      {cartItems.length > 0 && (
        <div className="floating-cart-button">
          <Link to="/cart" className="floating-cart-link">
            <div className="floating-cart-content">
              <span className="floating-cart-icon">🛒</span>
              <div className="floating-cart-text">
                <span className="floating-cart-items">{cartItems.reduce((total, item) => total + item.quantity, 0)} items</span>
                <span className="floating-cart-amount">₹ {(getTotalPrice() + getTotalPrice() * 0.05).toFixed(2)}</span>
              </div>
            </div>
            <span className="floating-cart-arrow">→</span>
          </Link>
        </div>
      )}
    </div>
  );
};
