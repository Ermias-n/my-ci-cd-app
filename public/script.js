function searchCity(city) {
  document.getElementById("cityInput").value = city;
  getWeather();
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Show loading state
  const weatherCard = document.getElementById("weatherCard");
  const errorMessage = document.getElementById("errorMessage");
  weatherCard.classList.add("hidden");
  errorMessage.classList.add("hidden");

  try {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update UI with weather data
    document.getElementById(
      "cityName"
    ).textContent = `${data.city}, ${data.country}`;
    document.getElementById("temperature").textContent = Math.round(
      data.temperature
    );
    document.getElementById("humidity").textContent = data.humidity;
    document.getElementById("description").textContent = data.description;
    document.getElementById("windSpeed").textContent = data.windSpeed;

    // Set weather icon
    const weatherIcon = document.getElementById("weatherIcon");
    weatherIcon.textContent = getWeatherIcon(data.description);

    // Show weather card
    weatherCard.classList.remove("hidden");
  } catch (error) {
    errorMessage.classList.remove("hidden");
    console.error("Error fetching weather:", error);
  }
}

function getWeatherIcon(description) {
  const desc = description.toLowerCase();
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("thunderstorm")) return "⛈️";
  if (desc.includes("drizzle")) return "🌦️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  return "🌈";
}

// Allow Enter key to trigger search
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});
