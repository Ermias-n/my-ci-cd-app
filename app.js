const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// OpenWeatherMap API configuration
const API_KEY = process.env.WEATHER_API_KEY || "demo_key"; // We'll set this as environment variable
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Weather endpoint
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    // For demo purposes - in production, you'd use a real API key
    if (API_KEY === "demo_key") {
      // Return mock data for demonstration
      const mockData = {
        city: city,
        country: "Country",
        temperature: Math.random() * 30 + 5, // Random temp between 5-35°C
        humidity: Math.random() * 50 + 30, // Random humidity between 30-80%
        description: [
          "Clear sky",
          "Few clouds",
          "Scattered clouds",
          "Light rain",
        ][Math.floor(Math.random() * 4)],
        windSpeed: (Math.random() * 10).toFixed(1),
      };
      return res.json(mockData);
    }

    // Real API call (when API key is provided)
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      res.status(404).json({ error: "City not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Weather Dashboard",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Weather Dashboard running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
