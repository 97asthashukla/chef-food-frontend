import { useContext } from "react";
import { CDN_URL, FALLBACK_IMAGE } from "../utils/constant";
import { LocationContext } from "../context/LocationContext";
import { Shimmer } from "./Shimmer";
import { Link } from "react-router-dom";
import { useRestaurantDirectory } from "../hooks/useRestaurantDirectory";
import {
  COST_BUCKET_OPTIONS,
  MIN_RATING_OPTIONS,
  SORT_OPTIONS,
} from "../utils/restaurantData";

const ResCard = ({restData}) => {
  const {
    id,
    name,
    imageId,
    cuisines,
    avgRatingLabel,
    costForTwoLabel,
    deliveryTimeLabel,
    areaName,
  } = restData;

    return(
  <div className="res-card">
    <Link to={`/restaurant/${id}`}>
    <img
      className="res-logo"
      alt="res-logo"
      src={imageId ? `${CDN_URL}/${imageId}` : FALLBACK_IMAGE}
    />
    <h3 className="res-name">{name}</h3>
    <h4 className="res-cuisines">{cuisines.join(", ") || "Cuisine details unavailable"}</h4>
    <h4 className="res-area">{areaName}</h4>
    <h4 className="res-cost">{costForTwoLabel}</h4>
    <h4 className="res-rating">{avgRatingLabel}</h4>
    <h4 className="res-time">{deliveryTimeLabel}</h4>
    </Link>
  </div>
)};


export const Body = () => {
    const { selectedLocation } = useContext(LocationContext);
  // The page consumes normalized restaurant objects now, so the UI no longer depends on Swiggy's nested card shape.
    const {
      availableCuisines,
      cache,
      error,
      filters,
      isSearchPending,
      loading,
      resetFilters,
      restaurants,
      retry,
      setQuery,
      updateFilters,
      visibleRestaurants,
    } = useRestaurantDirectory(selectedLocation);

    const handleFilterChange = (event) => {
      const { name, value } = event.target;
      updateFilters({
        [name]: name === "minRating" ? Number(value) : value,
      });
    };

    if(loading) return <Shimmer/>

     if(error) {
      return (
        <div className="body">
          <div className="filter error-actions">
            <button className="filter-btn" onClick={retry}>Retry</button>
          </div>
          <h3>{error}</h3>
        </div>
      );
     }
    return(
  <div className="body">
    <div className="filter">
        <div className="search search-panel">
            <input
              type="text"
              value={filters.query}
              placeholder="Search restaurants, cuisines, or area"
              onChange={(event)=>setQuery(event.target.value)}
            />
            <button onClick={() => setQuery("")} disabled={!filters.query}>
              Clear
            </button>
        </div>
        <div className="filter-controls">
          <select name="cuisine" value={filters.cuisine} onChange={handleFilterChange}>
            <option value="all">All cuisines</option>
            {availableCuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
          <select name="minRating" value={filters.minRating} onChange={handleFilterChange}>
            {MIN_RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select name="costBucket" value={filters.costBucket} onChange={handleFilterChange}>
            {COST_BUCKET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button className="filter-btn" onClick={resetFilters}>Reset filters</button>
        </div>
    </div>
    <div className="directory-status">
      <p>
        Showing {visibleRestaurants.length} of {restaurants.length} restaurants
        {selectedLocation ? ` near ${selectedLocation.name}` : ""}.
      </p>
      <div className="directory-meta">
        {isSearchPending ? <span className="directory-badge">Updating search...</span> : null}
        {cache.isCached ? <span className="directory-badge">Loaded from cache</span> : null}
      </div>
    </div>
    <div className="res-container">
       {visibleRestaurants.length === 0 ? (
        <div className="empty-state">
          <h3>No restaurants matched these filters.</h3>
          <p>Try clearing the search, changing cuisine, or lowering the minimum rating.</p>
          <button className="filter-btn" onClick={resetFilters}>Show all restaurants</button>
        </div>
       ) : visibleRestaurants.map(rest=>
        <ResCard key={rest.id}
          restData={rest}
        />
        )}
    </div>
  </div>
)};

