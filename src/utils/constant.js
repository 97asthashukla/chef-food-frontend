export const CDN_URL = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660"

export const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeVpeqdR9OxtpTOdBuyf7npN4dQ5BWRQWhOcsRMxVxojE9Eaf2mXDl_KM&s"

// Use your own backend proxy to avoid third-party payload limits.
const API_BASE_DEV = "http://localhost:5000";
const API_BASE_PROD = "https://chef-food-proxy.onrender.com";

const API_BASE =
	typeof window !== "undefined" && window.location.hostname.includes("github.io")
		? API_BASE_PROD
		: API_BASE_DEV;

// Build URLs with dynamic location parameters
export const buildRestaurantListUrl = (lat, lng) => {
	const locationQuery = `lat=${lat}&lng=${lng}`;
	const restaurantListPath = API_BASE === API_BASE_PROD ? "/api/restaurants" : "/api/restaurants/list";
	return `${API_BASE}${restaurantListPath}?${locationQuery}`;
};

export const buildMenuUrl = (restaurantId, lat, lng) => {
	const locationQuery = `lat=${lat}&lng=${lng}`;
	return `${API_BASE}/api/menu/${restaurantId}?${locationQuery}`;
};

// Legacy exports (keeping for backwards compatibility)
export const RESTAURANT_LIST_URL = buildRestaurantListUrl(28.5822513, 77.3334716);
export const MENU_URL = (restaurantId) => buildMenuUrl(restaurantId, 28.5822513, 77.3334716);

export const FALLBACK_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";
