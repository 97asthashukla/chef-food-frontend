const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Default location (Delhi) for backwards compatibility
const DEFAULT_LOCATION = "lat=28.5822513&lng=77.3334716";

app.use(cors());

app.get("/", (_req, res) => {
  res.send("✅ Swiggy Proxy API is working");
});

// Helper function to extract and validate location params
const getLocationQuery = (query) => {
  const { lat, lng } = query;
  if (lat && lng) {
    return `lat=${lat}&lng=${lng}`;
  }
  return DEFAULT_LOCATION;
};

// Full browser-like headers to prevent Swiggy from blocking data center IPs
const BROWSER_HEADERS = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
  "accept-encoding": "gzip, deflate, br",
  "referer": "https://www.swiggy.com/",
  "origin": "https://www.swiggy.com",
  "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "connection": "keep-alive",
};

app.get("/api/restaurants/list", async (req, res) => {
  try {
    const locationQuery = getLocationQuery(req.query);
    const targetUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?${locationQuery}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
    const response = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return res.status(response.status).json({ message: "Failed to fetch restaurants", status: response.status, detail: errText.substring(0, 200) });
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
      headers: BROWSER_HEADERS,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return res.status(response.status).json({ message: "Failed to fetch menu", status: response.status, detail: errText.substring(0, 200) });
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
