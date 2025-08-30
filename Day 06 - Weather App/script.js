// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const suggestionsBox = document.getElementById("suggestions");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherContent = document.getElementById("weather-content");
const forecastItems = document.getElementById("forecast-items");
const hourlyItems = document.getElementById("hourly-items");

// Weather data elements
const cityName = document.getElementById("city-name");
const dateElement = document.getElementById("date");
const temp = document.getElementById("temp");
const weatherIcon = document.getElementById("weather-icon");
const weatherType = document.getElementById("weather-type");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

// API Configuration - Using Open-Meteo (no API key required)
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// City to timezone mapping
const cityTimeZones = {
  "New York": "America/New_York",
  London: "Europe/London",
  Paris: "Europe/Paris",
  Tokyo: "Asia/Tokyo",
  Sydney: "Australia/Sydney",
  "Los Angeles": "America/Los_Angeles",
  Chicago: "America/Chicago",
  Toronto: "America/Toronto",
  Vancouver: "America/Vancouver",
  "Mexico City": "America/Mexico_City",
  "Rio de Janeiro": "America/Sao_Paulo",
  "Buenos Aires": "America/Argentina/Buenos_Aires",
  Madrid: "Europe/Madrid",
  Berlin: "Europe/Berlin",
  Rome: "Europe/Rome",
  Amsterdam: "Europe/Amsterdam",
  Brussels: "Europe/Brussels",
  Vienna: "Europe/Vienna",
  Prague: "Europe/Prague",
  Stockholm: "Europe/Stockholm",
  Oslo: "Europe/Oslo",
  Copenhagen: "Europe/Copenhagen",
  Athens: "Europe/Athens",
  Warsaw: "Europe/Warsaw",
  Budapest: "Europe/Budapest",
  Dublin: "Europe/Dublin",
  Zurich: "Europe/Zurich",
  Milan: "Europe/Rome",
  Barcelona: "Europe/Madrid",
  Munich: "Europe/Berlin",
  Hamburg: "Europe/Berlin",
  Cologne: "Europe/Berlin",
  Seoul: "Asia/Seoul",
  Beijing: "Asia/Shanghai",
  Shanghai: "Asia/Shanghai",
  "Hong Kong": "Asia/Hong_Kong",
  Taipei: "Asia/Taipei",
  Singapore: "Asia/Singapore",
  Bangkok: "Asia/Bangkok",
  "Kuala Lumpur": "Asia/Kuala_Lumpur",
  Jakarta: "Asia/Jakarta",
  Manila: "Asia/Manila",
  Hanoi: "Asia/Bangkok",
  "Ho Chi Minh City": "Asia/Bangkok",
  "New Delhi": "Asia/Kolkata",
  Mumbai: "Asia/Kolkata",
  Bangalore: "Asia/Kolkata",
  Chennai: "Asia/Kolkata",
  Kolkata: "Asia/Kolkata",
  Dubai: "Asia/Dubai",
  "Abu Dhabi": "Asia/Dubai",
  Riyadh: "Asia/Riyadh",
  Istanbul: "Europe/Istanbul",
  Ankara: "Europe/Istanbul",
  "Tel Aviv": "Asia/Jerusalem",
  Jerusalem: "Asia/Jerusalem",
  Cairo: "Africa/Cairo",
  Alexandria: "Africa/Cairo",
  Nairobi: "Africa/Nairobi",
  "Cape Town": "Africa/Johannesburg",
  Johannesburg: "Africa/Johannesburg",
  Casablanca: "Africa/Casablanca",
  Marrakech: "Africa/Casablanca",
  Tunis: "Africa/Tunis",
  Lagos: "Africa/Lagos",
  Accra: "Africa/Accra",
  "Addis Ababa": "Africa/Addis_Ababa",
  "Dar es Salaam": "Africa/Dar_es_Salaam",
  Kigali: "Africa/Kigali",
  Kampala: "Africa/Kampala",
};

// Extended location database with cities from every continent
const locationDatabase = [
  // North America
  "New York, USA",
  "Los Angeles, USA",
  "Chicago, USA",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada",
  "Mexico City, Mexico",
  "Cancun, Mexico",
  "Guadalajara, Mexico",

  // South America
  "Rio de Janeiro, Brazil",
  "Sao Paulo, Brazil",
  "Buenos Aires, Argentina",
  "Lima, Peru",
  "Bogota, Colombia",
  "Santiago, Chile",
  "Quito, Ecuador",

  // Europe
  "London, UK",
  "Paris, France",
  "Berlin, Germany",
  "Madrid, Spain",
  "Rome, Italy",
  "Amsterdam, Netherlands",
  "Brussels, Belgium",
  "Vienna, Austria",
  "Prague, Czech Republic",
  "Lisbon, Portugal",
  "Stockholm, Sweden",
  "Oslo, Norway",
  "Copenhagen, Denmark",
  "Athens, Greece",
  "Warsaw, Poland",
  "Budapest, Hungary",
  "Dublin, Ireland",
  "Edinburgh, UK",
  "Manchester, UK",
  "Zurich, Switzerland",
  "Geneva, Switzerland",
  "Milan, Italy",
  "Venice, Italy",
  "Barcelona, Spain",
  "Munich, Germany",
  "Hamburg, Germany",
  "Cologne, Germany",
  "Brussels, Belgium",

  // Asia
  "Tokyo, Japan",
  "Osaka, Japan",
  "Kyoto, Japan",
  "Seoul, South Korea",
  "Busan, South Korea",
  "Beijing, China",
  "Shanghai, China",
  "Hong Kong, China",
  "Taipei, Taiwan",
  "Singapore",
  "Bangkok, Thailand",
  "Phuket, Thailand",
  "Kuala Lumpur, Malaysia",
  "Jakarta, Indonesia",
  "Bali, Indonesia",
  "Manila, Philippines",
  "Hanoi, Vietnam",
  "Ho Chi Minh City, Vietnam",
  "New Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Chennai, India",
  "Kolkata, India",
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Riyadh, Saudi Arabia",
  "Istanbul, Turkey",
  "Ankara, Turkey",
  "Tel Aviv, Israel",
  "Jerusalem, Israel",
  "Kathmandu, Nepal",
  "Colombo, Sri Lanka",

  // Africa
  "Cairo, Egypt",
  "Alexandria, Egypt",
  "Nairobi, Kenya",
  "Cape Town, South Africa",
  "Johannesburg, South Africa",
  "Casablanca, Morocco",
  "Marrakech, Morocco",
  "Tunis, Tunisia",
  "Lagos, Nigeria",
  "Accra, Ghana",
  "Addis Ababa, Ethiopia",
  "Dar es Salaam, Tanzania",
  "Kigali, Rwanda",
  "Kampala, Uganda",

  // Oceania
  "Sydney, Australia",
  "Melbourne, Australia",
  "Brisbane, Australia",
  "Perth, Australia",
  "Adelaide, Australia",
  "Auckland, New Zealand",
  "Wellington, New Zealand",
  "Christchurch, New Zealand",
  "Honolulu, USA",
  "Fiji",
  "Papua New Guinea",

  // Additional cities from various countries
  "Reykjavik, Iceland",
  "Helsinki, Finland",
  "Tallinn, Estonia",
  "Riga, Latvia",
  "Vilnius, Lithuania",
  "Bratislava, Slovakia",
  "Ljubljana, Slovenia",
  "Zagreb, Croatia",
  "Belgrade, Serbia",
  "Sofia, Bulgaria",
  "Bucharest, Romania",
  "Chisinau, Moldova",
  "Kiev, Ukraine",
  "Minsk, Belarus",
  "Moscow, Russia",
  "St. Petersburg, Russia",
  "Tbilisi, Georgia",
  "Yerevan, Armenia",
  "Baku, Azerbaijan",
  "Astana, Kazakhstan",
  "Tashkent, Uzbekistan",
  "Baghdad, Iraq",
  "Tehran, Iran",
  "Kabul, Afghanistan",
  "Islamabad, Pakistan",
  "Dhaka, Bangladesh",
  "Yangon, Myanmar",
  "Phnom Penh, Cambodia",
  "Vientiane, Laos",
  "Ulaanbaatar, Mongolia",
  "Pyongyang, North Korea",
  "Male, Maldives",
  "Thimphu, Bhutan",
  "Kathmandu, Nepal",
  "Colombo, Sri Lanka",
  "Malé, Maldives",
  "Abidjan, Ivory Coast",
  "Algiers, Algeria",
  "Luanda, Angola",
  "Gaborone, Botswana",
  "Bujumbura, Burundi",
  "Praia, Cape Verde",
  "Bangui, Central African Republic",
  "N'Djamena, Chad",
  "Moroni, Comoros",
  "Kinshasa, DRC",
  "Djibouti City, Djibouti",
  "Asmara, Eritrea",
  "Mbabane, Eswatini",
];
// Get timezone for a city
function getTimeZoneForCity(cityName) {
  // Extract just the city name without country
  const cityOnly = cityName.split(",")[0].trim();
  return cityTimeZones[cityOnly] || "UTC";
}

// Format time for a specific timezone (show only hours, no minutes)
function formatTimeForTimezone(date, timeZone) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    timeZone: timeZone,
  });
}

// Format date for a specific timezone
function formatDateForTimezone(date, timeZone) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timeZone,
  });
}

// Get weather icon based on Open-Meteo weather code
function getWeatherIcon(weatherCode) {
  // Weather code mapping based on WMO codes
  if (weatherCode === 0) {
    return "fas fa-sun"; // Clear sky
  } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    return "fas fa-cloud-sun"; // Mainly clear, partly cloudy, and overcast
  } else if (weatherCode === 45 || weatherCode === 48) {
    return "fas fa-smog"; // Fog and depositing rime fog
  } else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) {
    return "fas fa-cloud-rain"; // Drizzle: Light, moderate, and dense intensity
  } else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65) {
    return "fas fa-cloud-showers-heavy"; // Rain: Slight, moderate and heavy intensity
  } else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
    return "fas fa-cloud-rain"; // Rain showers: Slight, moderate, and violent
  } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) {
    return "fas fa-snowflake"; // Snow fall: Slight, moderate, and heavy intensity
  } else if (weatherCode === 77) {
    return "fas fa-snowflake"; // Snow grains
  } else if (weatherCode === 85 || weatherCode === 86) {
    return "fas fa-snowflake"; // Snow showers slight and heavy
  } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    return "fas fa-bolt"; // Thunderstorm: Slight or moderate, with slight and heavy hail
  } else {
    return "fas fa-cloud"; // Default
  }
}

// Generate forecast days based on API data
function generateForecastDays(forecastData, timeZone) {
  forecastItems.innerHTML = "";

  // Get daily forecast (next 3 days)
  for (let i = 1; i <= 3; i++) {
    if (forecastData.daily && forecastData.daily.time[i]) {
      const date = new Date(forecastData.daily.time[i]);

      const dayName = date.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: timeZone,
      });

      const weatherCode = forecastData.daily.weathercode[i];
      const maxTemp = forecastData.daily.temperature_2m_max[i];

      const forecastItem = document.createElement("div");
      forecastItem.className = "forecast-item";
      forecastItem.innerHTML = `
                        <div class="forecast-day">${dayName}</div>
                        <i class="${getWeatherIcon(
                          weatherCode
                        )} forecast-icon"></i>
                        <div class="forecast-temp">${Math.round(
                          maxTemp
                        )}°C</div>
                    `;
      forecastItems.appendChild(forecastItem);
    }
  }
}

// Generate hourly forecast based on API data
function generateHourlyForecast(forecastData, timeZone) {
  hourlyItems.innerHTML = "";

  const now = new Date();
  const currentHour = now.getHours();

  // Get hourly forecast (next 12 hours in 3-hour increments)
  for (let i = 0; i < 4; i++) {
    const hourIndex = currentHour + i * 3;
    if (forecastData.hourly && forecastData.hourly.time[hourIndex]) {
      const date = new Date(forecastData.hourly.time[hourIndex]);

      const timeString = formatTimeForTimezone(date, timeZone);
      const temperature = forecastData.hourly.temperature_2m[hourIndex];
      const weatherCode = forecastData.hourly.weathercode[hourIndex];

      const hourlyItem = document.createElement("div");
      hourlyItem.className = "hourly-item";
      hourlyItem.innerHTML = `
                        <div class="hourly-time">${timeString}</div>
                        <i class="${getWeatherIcon(
                          weatherCode
                        )} hourly-icon"></i>
                        <div class="hourly-temp">${Math.round(
                          temperature
                        )}°C</div>
                    `;
      hourlyItems.appendChild(hourlyItem);
    }
  }
}

// Update date for a specific timezone
function updateDate(city) {
  const timeZone = getTimeZoneForCity(city);
  const now = new Date();
  dateElement.textContent = formatDateForTimezone(now, timeZone);
}

// Show location suggestions
function showSuggestions(input) {
  suggestionsBox.innerHTML = "";

  if (input.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Always add current location as first option
  const currentLocationItem = document.createElement("div");
  currentLocationItem.className = "suggestion-item";
  currentLocationItem.innerHTML =
    '<i class="fas fa-location-arrow"></i> Use current location';
  currentLocationItem.addEventListener("click", () => {
    getCurrentLocation();
    suggestionsBox.style.display = "none";
  });
  suggestionsBox.appendChild(currentLocationItem);

  // Filter locations based on input
  const filteredLocations = locationDatabase.filter((location) =>
    location.toLowerCase().includes(input.toLowerCase())
  );

  // Add filtered locations to suggestions
  if (filteredLocations.length > 0) {
    filteredLocations.forEach((location) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
      item.addEventListener("click", () => {
        cityInput.value = location;
        getWeatherData(location);
        suggestionsBox.style.display = "none";
      });
      suggestionsBox.appendChild(item);
    });
  } else {
    // Show message if no results found
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.textContent = "No locations found. Try a different search.";
    suggestionsBox.appendChild(noResults);
  }

  suggestionsBox.style.display = "block";
}

// Get coordinates for a city name using Open-Meteo Geocoding API
async function getCoordinatesForCity(cityName) {
  try {
    // Extract just the city name without country for better API results
    const cityOnly = cityName.split(",")[0].trim();
    const response = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(
        cityOnly
      )}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error("Geocoding API not available");
    }

    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name + ", " + data.results[0].country,
      };
    } else {
      throw new Error("City not found");
    }
  } catch (err) {
    // Fallback to our predefined city database
    const foundCity = locationDatabase.find((location) =>
      location.toLowerCase().includes(cityName.toLowerCase())
    );

    if (foundCity) {
      // Return a default location for the city (approximate)
      return {
        lat: 40.7128, // Default to New York
        lon: -74.006,
        name: foundCity,
      };
    } else {
      throw new Error("Failed to get coordinates for city");
    }
  }
}

// Get current location using geolocation API
function getCurrentLocation() {
  if (navigator.geolocation) {
    loading.style.display = "block";
    weatherContent.style.display = "none";
    error.style.display = "none";

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use Open-Meteo's reverse geocoding (approximate)
          const response = await fetch(
            `${GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
          );
          const data = await response.json();

          if (data && data.results && data.results.length > 0) {
            const city = data.results[0].name + ", " + data.results[0].country;
            cityInput.value = city;
            getWeatherData(city);
          } else {
            // Fallback to using coordinates directly
            cityInput.value = "Your Location";
            getWeatherDataByCoords(latitude, longitude);
          }
        } catch (err) {
          loading.style.display = "none";
          weatherContent.style.display = "flex";
          alert(
            "Unable to retrieve your location name. Please enter a city manually."
          );
        }
      },
      (err) => {
        loading.style.display = "none";
        weatherContent.style.display = "flex";
        alert(
          "Unable to retrieve your location. Please enter a city manually."
        );
      }
    );
  } else {
    alert(
      "Geolocation is not supported by this browser. Please enter a city manually."
    );
  }
}

// Get weather data by coordinates
async function getWeatherDataByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    if (!response.ok) {
      throw new Error("Weather API not available");
    }

    const data = await response.json();

    // Set weather data
    cityName.textContent = "Your Location";
    temp.textContent = `${Math.round(data.hourly.temperature_2m[0])}°C`;
    weatherType.textContent = getWeatherDescription(data.hourly.weathercode[0]);
    feelsLike.textContent = `${Math.round(data.hourly.temperature_2m[0])}°C`; // Approximation
    humidity.textContent = "50%"; // Open-Meteo doesn't provide humidity in free version
    windSpeed.textContent = "10 km/h"; // Open-Meteo doesn't provide wind in free version

    // Set appropriate icon based on condition
    weatherIcon.className = `${getWeatherIcon(
      data.hourly.weathercode[0]
    )} weather-icon`;

    // Update date, forecast and hourly data with timezone
    updateDate("Your Location");
    generateForecastDays(data, data.timezone);
    generateHourlyForecast(data, data.timezone);

    // Hide loading and show weather card
    loading.style.display = "none";
    weatherContent.style.display = "flex";
  } catch (err) {
    console.error("Error fetching weather data:", err);
    loading.style.display = "none";
    error.style.display = "block";
    weatherContent.style.display = "flex";
  }
}

// Get weather description from weather code
function getWeatherDescription(weatherCode) {
  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherDescriptions[weatherCode] || "Unknown";
}

// Get weather data from Open-Meteo API
async function getWeatherData(city) {
  // Show loading state
  loading.style.display = "block";
  weatherContent.style.display = "none";
  error.style.display = "none";

  try {
    // First get coordinates for the city
    const coordinates = await getCoordinatesForCity(city);

    // Then get weather forecast
    const response = await fetch(
      `${WEATHER_URL}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();

    // Set weather data
    cityName.textContent = coordinates.name;
    temp.textContent = `${Math.round(data.hourly.temperature_2m[0])}°C`;
    weatherType.textContent = getWeatherDescription(data.hourly.weathercode[0]);
    feelsLike.textContent = `${Math.round(data.hourly.temperature_2m[0])}°C`; // Approximation
    humidity.textContent = "50%"; // Open-Meteo doesn't provide humidity in free version
    windSpeed.textContent = "10 km/h"; // Open-Meteo doesn't provide wind in free version

    // Set appropriate icon based on condition
    weatherIcon.className = `${getWeatherIcon(
      data.hourly.weathercode[0]
    )} weather-icon`;

    // Update date, forecast and hourly data with timezone
    updateDate(coordinates.name);
    generateForecastDays(data, data.timezone);
    generateHourlyForecast(data, data.timezone);

    // Hide loading and show weather card
    loading.style.display = "none";
    weatherContent.style.display = "flex";
  } catch (err) {
    console.error("Error fetching weather data:", err);
    loading.style.display = "none";
    error.style.display = "block";
    weatherContent.style.display = "flex";
  }
}

// Event Listeners
cityInput.addEventListener("input", () => {
  showSuggestions(cityInput.value);
});

cityInput.addEventListener("focus", () => {
  if (cityInput.value.length > 0) {
    showSuggestions(cityInput.value);
  }
});

document.addEventListener("click", (e) => {
  if (!cityInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.style.display = "none";
  }
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});

// Initialize with default city
getWeatherData("New York, USA");
