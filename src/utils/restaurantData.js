const DEFAULT_COST_BUCKET = "all";

export const DEFAULT_RESTAURANT_FILTERS = {
  query: "",
  cuisine: "all",
  minRating: 0,
  costBucket: DEFAULT_COST_BUCKET,
  sortBy: "relevance",
};

export const COST_BUCKET_OPTIONS = [
  { value: "all", label: "Any budget" },
  { value: "budget", label: "Budget friendly" },
  { value: "mid", label: "Mid range" },
  { value: "premium", label: "Premium" },
];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Best match" },
  { value: "rating", label: "Top rated" },
  { value: "costLowToHigh", label: "Cost: Low to High" },
  { value: "delivery", label: "Fast delivery" },
];

export const MIN_RATING_OPTIONS = [
  { value: 0, label: "All ratings" },
  { value: 4, label: "4.0+" },
  { value: 4.3, label: "4.3+" },
  { value: 4.5, label: "4.5+" },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseNumericValue = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const match = String(value || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const parseCostForTwoValue = (info = {}) => {
  const directValue = parseNumericValue(info.costForTwo);
  if (directValue > 0) {
    return directValue;
  }

  const messageValue = parseNumericValue(info.costForTwoMessage || info.costForTwoString);
  return messageValue > 0 ? messageValue : 0;
};

const parseRatingCount = (info = {}) => parseNumericValue(info.totalRatingsString || info.ratingCountV2);

const getDeliveryTime = (info = {}) => {
  const numericDeliveryTime = parseNumericValue(info?.sla?.deliveryTime);
  if (numericDeliveryTime > 0) {
    return numericDeliveryTime;
  }

  return parseNumericValue(info?.slaString);
};

const isRestaurantCandidate = (item) => {
  const info = item?.info || item;
  return Boolean(
    info &&
      (info.id || info.name) &&
      (Array.isArray(info.cuisines) || info.avgRating || info.sla || info.costForTwo)
  );
};

const findRestaurantArrays = (value, results = [], seen = new WeakSet()) => {
  if (!value || typeof value !== "object") {
    return results;
  }

  if (seen.has(value)) {
    return results;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isRestaurantCandidate)) {
      results.push(value);
      return results;
    }

    value.forEach((entry) => findRestaurantArrays(entry, results, seen));
    return results;
  }

  Object.values(value).forEach((entry) => findRestaurantArrays(entry, results, seen));
  return results;
};

const normalizeRestaurant = (restaurant, index) => {
  const info = restaurant?.info || restaurant || {};
  const cuisines = Array.isArray(info.cuisines)
    ? info.cuisines.filter(Boolean)
    : [];
  const avgRating = parseNumericValue(info.avgRating || info.avgRatingString);
  const costForTwoValue = parseCostForTwoValue(info);
  const deliveryTime = getDeliveryTime(info);
  const ratingCount = parseRatingCount(info);
  const areaName = info.areaName || info.locality || "Area unavailable";

  const searchIndex = normalizeText([
    info.name,
    cuisines.join(" "),
    areaName,
    info.locality,
  ].join(" "));

  return {
    id: String(info.id || restaurant?.id || `restaurant-${index}`),
    name: info.name || "Unnamed restaurant",
    imageId: info.cloudinaryImageId || "",
    cuisines,
    avgRating,
    avgRatingLabel: avgRating > 0 ? `${avgRating.toFixed(1)} stars` : "New",
    ratingCount,
    costForTwoLabel: info.costForTwo || info.costForTwoMessage || "Cost unavailable",
    costForTwoValue,
    deliveryTime,
    deliveryTimeLabel: deliveryTime > 0 ? `${deliveryTime} mins` : "Time unavailable",
    areaName,
    locality: info.locality || "",
    searchIndex,
    source: restaurant,
  };
};

const dedupeRestaurants = (restaurants) => {
  const byId = new Map();

  restaurants.forEach((restaurant, index) => {
    const normalizedRestaurant = normalizeRestaurant(restaurant, index);
    if (!byId.has(normalizedRestaurant.id)) {
      byId.set(normalizedRestaurant.id, normalizedRestaurant);
    }
  });

  return Array.from(byId.values());
};

export const normalizeRestaurantListResponse = (payload) => {
  // Swiggy list cards move around frequently, so normalize once here instead of scattering deep optional chaining in the UI.
  const arrays = findRestaurantArrays(payload);
  const flattened = arrays.flat();
  return dedupeRestaurants(flattened);
};

export const getCuisineOptions = (restaurants) => {
  const cuisines = new Set();

  restaurants.forEach((restaurant) => {
    restaurant.cuisines.forEach((cuisine) => cuisines.add(cuisine));
  });

  return Array.from(cuisines).sort((left, right) => left.localeCompare(right));
};

const getCostBucket = (costForTwoValue) => {
  if (costForTwoValue <= 0) {
    return DEFAULT_COST_BUCKET;
  }

  if (costForTwoValue <= 300) {
    return "budget";
  }

  if (costForTwoValue <= 600) {
    return "mid";
  }

  return "premium";
};

const matchesQuery = (restaurant, queryTokens) => {
  if (queryTokens.length === 0) {
    return true;
  }

  return queryTokens.every((token) => restaurant.searchIndex.includes(token));
};

const computeRestaurantScore = (restaurant, queryTokens) => {
  const normalizedName = normalizeText(restaurant.name);
  const normalizedArea = normalizeText(`${restaurant.areaName} ${restaurant.locality}`);
  const normalizedCuisines = restaurant.cuisines.map(normalizeText);

  const queryScore = queryTokens.length === 0
    ? 12
    : queryTokens.reduce((score, token) => {
        if (normalizedName === token) {
          return score + 28;
        }

        if (normalizedName.startsWith(token)) {
          return score + 18;
        }

        if (normalizedName.includes(token)) {
          return score + 12;
        }

        if (normalizedCuisines.some((cuisine) => cuisine.includes(token))) {
          return score + 10;
        }

        if (normalizedArea.includes(token)) {
          return score + 4;
        }

        return score + 1;
      }, 0);

  // Ranking combines text relevance with quality and affordability so results are not name-only matches.
  const ratingScore = clamp(restaurant.avgRating / 5, 0, 1) * 35;
  const confidenceScore = clamp(Math.log10(restaurant.ratingCount + 1) / 3, 0, 1) * 10;
  const costScore = restaurant.costForTwoValue > 0
    ? clamp(1 - restaurant.costForTwoValue / 1200, 0, 1) * 14
    : 5;
  const deliveryScore = restaurant.deliveryTime > 0
    ? clamp(1 - restaurant.deliveryTime / 60, 0, 1) * 10
    : 3;

  return Number((queryScore + ratingScore + confidenceScore + costScore + deliveryScore).toFixed(2));
};

export const filterAndRankRestaurants = (restaurants, filters) => {
  const queryTokens = normalizeText(filters.query).split(" ").filter(Boolean);

  const filtered = restaurants.filter((restaurant) => {
    const matchesCuisine =
      filters.cuisine === "all" ||
      restaurant.cuisines.some((cuisine) => cuisine.toLowerCase() === filters.cuisine.toLowerCase());
    const matchesRating = restaurant.avgRating >= Number(filters.minRating || 0);
    const matchesCost =
      filters.costBucket === DEFAULT_COST_BUCKET ||
      getCostBucket(restaurant.costForTwoValue) === filters.costBucket;

    return matchesQuery(restaurant, queryTokens) && matchesCuisine && matchesRating && matchesCost;
  });

  const scoredRestaurants = filtered.map((restaurant) => ({
    ...restaurant,
    score: computeRestaurantScore(restaurant, queryTokens),
  }));

  return scoredRestaurants.sort((left, right) => {
    switch (filters.sortBy) {
      case "rating":
        return right.avgRating - left.avgRating || right.score - left.score;
      case "costLowToHigh":
        return left.costForTwoValue - right.costForTwoValue || right.score - left.score;
      case "delivery":
        return left.deliveryTime - right.deliveryTime || right.score - left.score;
      case "relevance":
      default:
        return right.score - left.score || right.avgRating - left.avgRating || left.deliveryTime - right.deliveryTime;
    }
  });
};