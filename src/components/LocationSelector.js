import { useContext, useState } from "react";
import { LocationContext, POPULAR_LOCATIONS } from "../context/LocationContext";

export const LocationSelector = () => {
  const { selectedLocation, changeLocation } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!selectedLocation) return null;

  return (
    <div className="location-selector-wrapper">
      <button
        className="location-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select a different location"
      >
        📍 {selectedLocation.name}
      </button>
      {isOpen && (
        <div className="location-dropdown">
          {POPULAR_LOCATIONS.map((location) => (
            <button
              key={location.name}
              className={`location-option ${
                selectedLocation.name === location.name ? "active" : ""
              }`}
              onClick={() => {
                changeLocation(location);
                setIsOpen(false);
              }}
            >
              {location.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
