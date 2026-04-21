export const CDN_URL = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660"

export const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeVpeqdR9OxtpTOdBuyf7npN4dQ5BWRQWhOcsRMxVxojE9Eaf2mXDl_KM&s"

// Swiggy API endpoints with CORS proxy
const CORS_PROXY = "https://corsproxy.io/?";
const LOCATION_QUERY = "lat=28.5822513&lng=77.3334716";

export const RESTAURANT_LIST_URL = `${CORS_PROXY}https://www.swiggy.com/dapi/restaurants/list/v5?${LOCATION_QUERY}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`

export const MENU_URL = (restaurantId) => `${CORS_PROXY}https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&${LOCATION_QUERY}&restaurantId=${restaurantId}`

export const FALLBACK_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";
