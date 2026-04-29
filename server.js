const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Default location (Delhi) for backwards compatibility
const DEFAULT_LOCATION = "lat=28.5822513&lng=77.3334716";

app.use(cors());

// Helper function to extract and validate location params
const getLocationQuery = (query) => {
  const { lat, lng } = query;
  if (lat && lng) {
    return `lat=${lat}&lng=${lng}`;
  }
  return DEFAULT_LOCATION;
};

app.get("/api/restaurants/list", async (req, res) => {
  try {
    const locationQuery = getLocationQuery(req.query);
    const targetUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?${locationQuery}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
    const response = await fetch(targetUrl, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "application/json,text/plain,*/*",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to fetch restaurants" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Restaurant API error", detail: error.message });
  }
});

app.get("/api/menu/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const locationQuery = getLocationQuery(req.query);
    const targetUrl = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&${locationQuery}&restaurantId=${restaurantId}`;
    const response = await fetch(targetUrl, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "application/json,text/plain,*/*",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to fetch menu" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Menu API error", detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy API running on http://localhost:${PORT}`);
});
