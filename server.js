const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

const LOCATION_QUERY = "lat=28.5822513&lng=77.3334716";

app.use(cors());

app.get("/api/restaurants/list", async (_req, res) => {
  try {
    const targetUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?${LOCATION_QUERY}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
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
    const targetUrl = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&${LOCATION_QUERY}&restaurantId=${restaurantId}`;
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
