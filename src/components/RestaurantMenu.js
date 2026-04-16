import "../RestaurantMenuBody.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CDN_URL, FALLBACK_IMAGE, MENU_URL } from "../utils/constant";


export const RestaurantMenu = () => {
  const [restaurantMenu, setRestaurantMenu] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const response = await fetch(`${MENU_URL}${id}`);
      const resData = await response.json();
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
  console.log(restaurantInfo,"flkasjlalks")

  const regularCards =
    cards.find((card) => card?.groupedCard?.cardGroupMap?.REGULAR?.cards)?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

  const menuCategories = regularCards
    .map((categoryCard) => categoryCard?.card?.card)
    .filter(
      (category) =>
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
                        <button className="add-btn">Add to cart</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
