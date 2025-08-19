import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("New York");
  const [fadeKey, setFadeKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather(city);
  }, []);

  async function fetchWeather(cityName) {
    if (!cityName) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${import.meta.env.VITE_WEATHER_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "Unable to find weather for that location.");
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setWeather(null);
    } finally {
      setFadeKey((prev) => prev + 1);
      setLoading(false);
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setFadeKey((prev) => prev + 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getWeatherBg = () => {
    const condition = weather?.weather?.[0]?.main || "";
    switch (condition) {
      case "Clear":
        return "bg-sunny";
      case "Clouds":
        return "bg-cloudy";
      case "Rain":
        return "bg-rainy";
      case "Snow":
        return "bg-snowy";
      default:
        return "bg-default";
    }
  };

  return (
    <div className={`app-container ${theme} ${getWeatherBg()}`}>
      <header className="app-header">
        <h1>Weather App</h1>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit" disabled={!city.trim() || loading}>
          {loading ? "Loading…" : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <main key={fadeKey} className="fade-in">
        {weather && !error && (
          <>
            <h2>{weather.name}</h2>
            <p>{Math.round(weather.main.temp)}°C</p>
            <p>{weather.weather[0].description}</p>
          </>
        )}
      </main>
    </div>
  );
}
