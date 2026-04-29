import { createContext, useState } from "react";

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");

  const changeFoodTypeFilter = (filterType) => {
    setFoodTypeFilter(filterType);
  };

  return (
    <FilterContext.Provider value={{ foodTypeFilter, changeFoodTypeFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
