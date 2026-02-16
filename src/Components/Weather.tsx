import React, { useRef, useState, useEffect } from "react";
import humidity from "../Assets/humidity.png";
import wind from "../Assets/wind.png";
import "./Weather.css";
import SearchIcon from "@mui/icons-material/Search";

interface WeatherResponse {
  location: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    icon: string;
  };
  pm25?: number;
}

interface ForecastDay {
  date: string;
  min: number;
  max: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
}

interface Props {
  weatherData: WeatherResponse | null;
  defaultCity: WeatherResponse | null;
  onSearch: (city: string) => void;
  forecast: ForecastDay[];
  defaultForecast: ForecastDay[];
  hourly: HourlyForecast[];
  defaultHourly: HourlyForecast[];
}

function Weather({
  weatherData,
  defaultCity,
  onSearch,
  forecast,
  defaultForecast,
  hourly,
  defaultHourly,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      onSearch(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  const getAQIInfo = (pm25?: number) => {
    if (!pm25) return { label: "N/A", color: "#bdc3c7" };
    if (pm25 <= 30) return { label: "Good", color: "#2ecc71" };
    if (pm25 <= 60) return { label: "Satisfactory", color: "#f1c40f" };
    if (pm25 <= 90) return { label: "Moderate", color: "#e67e22" };
    if (pm25 <= 120) return { label: "Poor", color: "#e74c3c" };
    if (pm25 <= 250) return { label: "Very Poor", color: "#8e44ad" };
    return { label: "Severe", color: "#7f0000" };
  };

  const activeCity = weatherData || defaultCity;
  const activeHourly = weatherData ? hourly : defaultHourly;
  const activeForecast = weatherData ? forecast : defaultForecast;

  return (
    <div className="weather-page">
      {/* Background Default City */}
      {defaultCity && (
        <div className="default-background">
          <div className="bg-top">
            <div>
              <h1 className="bg-temp">{defaultCity.main.temp}°C</h1>
              <h2 className="bg-city">{defaultCity.location}</h2>
            </div>
            <img src={defaultCity.weather.icon} alt="weather" className="bg-icon" />
          </div>

          <div className="bg-details">
            <div className="bg-col">
              <img src={humidity} alt="humidity" />
              <span>{defaultCity.main.humidity}%</span>
            </div>

            <div className="bg-col">
              <div
                className="aqi-dot"
                style={{ backgroundColor: getAQIInfo(defaultCity.pm25).color }}
              />
              <span>
                {defaultCity.pm25} ({getAQIInfo(defaultCity.pm25).label})
              </span>
            </div>

            <div className="bg-col">
              <img src={wind} alt="wind" />
              <span>{defaultCity.wind.speed} km/h</span>
            </div>
          </div>
        </div>
      )}

      <div className="weather">
        {/* Date & Time */}
        <div className="date-time">
          <p>{currentTime.toLocaleDateString()}</p>
          <p>{currentTime.toLocaleTimeString()}</p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search city"
            className="search-input"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <SearchIcon />
          </button>
        </div>

        {activeCity && (
          <>
            {/* Weather Icon */}
            <img src={activeCity.weather.icon} alt="weather" className="weather-icon" />

            {/* Temperature */}
            <p className="temperature">{activeCity.main.temp}°C</p>

            {/* City */}
            <p className="location">{activeCity.location}</p>

            {/* Hourly Temperature Scroll */}
            {activeHourly.length > 0 && (
              <div className="hourly-section">
                <div className="hourly-container">
                  {activeHourly.map((hour, index) => {
                    const date = new Date(hour.time);
                    const formattedTime = date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      hour12: true,
                    });
                    return (
                      <div key={index} className="hourly-card">
                        <p>{formattedTime}</p>
                        <p>{hour.temperature}°C</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weather Extra Data */}
            <div className="weathers-data">
              <div className="col">
                <img src={humidity} alt="humidity" />
                <div>
                  <p>{activeCity.main.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>

              <div className="col">
                <div
                  className="aqi-dot"
                  style={{ backgroundColor: getAQIInfo(activeCity.pm25).color }}
                />
                <div>
                  <p>{activeCity.pm25}</p>
                  <span>{getAQIInfo(activeCity.pm25).label}</span>
                </div>
              </div>

              <div className="col">
                <img src={wind} alt="wind" />
                <div>
                  <p>{activeCity.wind.speed} km/h</p>
                  <span>Wind speed</span>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            {activeForecast.length > 0 && (
              <div className="forecast-section">
                <h3>7-Day Forecast</h3>
                <div className="forecast-container">
                  {activeForecast.map((day, index) => (
                    <div key={index} className="forecast-card">
                      <p>
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p>Min: {day.min}°C</p>
                      <p>Max: {day.max}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Weather;