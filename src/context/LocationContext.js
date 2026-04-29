import { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const POPULAR_LOCATIONS = [
  { name: "Delhi", lat: 28.5822513, lng: 77.3334716 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
];

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      try {
        setSelectedLocation(JSON.parse(savedLocation));
      } catch {
        // If parsing fails, default to Delhi
        setSelectedLocation(POPULAR_LOCATIONS[0]);
      }
    } else {
      // Default to Delhi
      setSelectedLocation(POPULAR_LOCATIONS[0]);
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  const changeLocation = (location) => {
    setSelectedLocation(location);
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, changeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
