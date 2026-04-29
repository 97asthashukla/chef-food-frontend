import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { buildRestaurantListUrl } from "../utils/constant";
import {
  DEFAULT_RESTAURANT_FILTERS,
  filterAndRankRestaurants,
  getCuisineOptions,
  normalizeRestaurantListResponse,
} from "../utils/restaurantData";
import { useDebouncedValue } from "./useDebouncedValue";

const RESTAURANT_CACHE = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10000;

const initialState = {
  restaurants: [],
  visibleRestaurants: [],
  filters: DEFAULT_RESTAURANT_FILTERS,
  loading: true,
  error: "",
  cache: {
    isCached: false,
    updatedAt: null,
    size: 0,
  },
};

const directoryReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        restaurants: action.payload.restaurants,
        loading: false,
        error: "",
        cache: action.payload.cache,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        restaurants: [],
        visibleRestaurants: [],
        loading: false,
        error: action.payload,
        cache: {
          ...state.cache,
          isCached: false,
        },
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case "RESET_FILTERS":
      return {
        ...state,
        filters: DEFAULT_RESTAURANT_FILTERS,
      };
    case "APPLY_RESULTS":
      return {
        ...state,
        visibleRestaurants: action.payload,
      };
    default:
      return state;
  }
};

const getLocationCacheKey = (location) => `${location.lat}:${location.lng}`;

const getCachedRestaurants = (cacheKey) => {
  const entry = RESTAURANT_CACHE.get(cacheKey);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    RESTAURANT_CACHE.delete(cacheKey);
    return null;
  }

  return entry;
};

const getFriendlyFetchError = (error) => {
  if (error?.name === "AbortError") {
    return "The request took too long and was cancelled. Please try again.";
  }

  return error?.message || "Unable to load restaurants right now. Please try again.";
};

export const useRestaurantDirectory = (selectedLocation) => {
  const [state, dispatch] = useReducer(directoryReducer, initialState);
  const [refreshToken, setRefreshToken] = useState(0);
  const forceRefreshRef = useRef(false);
  const debouncedQuery = useDebouncedValue(state.filters.query, 300);

  useEffect(() => {
    dispatch({
      type: "APPLY_RESULTS",
      payload: filterAndRankRestaurants(state.restaurants, {
        ...state.filters,
        query: debouncedQuery,
      }),
    });
  }, [
    debouncedQuery,
    state.filters.costBucket,
    state.filters.cuisine,
    state.filters.minRating,
    state.filters.sortBy,
    state.restaurants,
  ]);

  useEffect(() => {
    if (!selectedLocation) {
      return undefined;
    }

    // Cache by location so switching back to a city does not always trigger a fresh proxy round-trip.
    const cacheKey = getLocationCacheKey(selectedLocation);
    const cachedEntry = forceRefreshRef.current ? null : getCachedRestaurants(cacheKey);

    if (cachedEntry) {
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          restaurants: cachedEntry.restaurants,
          cache: {
            isCached: true,
            updatedAt: cachedEntry.timestamp,
            size: RESTAURANT_CACHE.size,
          },
        },
      });

      return undefined;
    }

    const controller = new AbortController();
    // Abort stale requests when location changes so slower responses cannot overwrite newer state.
    dispatch({ type: "FETCH_START" });
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const loadRestaurants = async () => {
      try {
        const response = await fetch(buildRestaurantListUrl(selectedLocation.lat, selectedLocation.lng), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Restaurant request failed (${response.status})`);
        }

        const payload = await response.json();
        const restaurants = normalizeRestaurantListResponse(payload);

        if (!restaurants.length) {
          throw new Error("No restaurants are available for this location right now.");
        }

        RESTAURANT_CACHE.set(cacheKey, {
          restaurants,
          timestamp: Date.now(),
        });

        if (!controller.signal.aborted) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              restaurants,
              cache: {
                isCached: false,
                updatedAt: Date.now(),
                size: RESTAURANT_CACHE.size,
              },
            },
          });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({
          type: "FETCH_ERROR",
          payload: getFriendlyFetchError(error),
        });
      } finally {
        window.clearTimeout(timeoutId);
        forceRefreshRef.current = false;
      }
    };

    loadRestaurants();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [refreshToken, selectedLocation]);

  const availableCuisines = useMemo(() => getCuisineOptions(state.restaurants), [state.restaurants]);

  return {
    ...state,
    availableCuisines,
    isSearchPending: state.filters.query !== debouncedQuery,
    setQuery: (query) => dispatch({ type: "SET_FILTERS", payload: { query } }),
    updateFilters: (filters) => dispatch({ type: "SET_FILTERS", payload: filters }),
    resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    retry: () => {
      if (!selectedLocation) {
        return;
      }

      RESTAURANT_CACHE.delete(getLocationCacheKey(selectedLocation));
      forceRefreshRef.current = true;
      setRefreshToken((current) => current + 1);
    },
  };
};