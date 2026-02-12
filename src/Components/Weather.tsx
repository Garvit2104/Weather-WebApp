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

interface Props {
  weatherData: WeatherResponse | null;
  defaultCity: WeatherResponse | null;
  onSearch: (city: string) => void;
}

function Weather({ weatherData, defaultCity, onSearch }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (inputRef.current) {
      onSearch(inputRef.current.value);
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

  return (
    <div className="weather-page">
      {defaultCity && (
        <div className="default-background">
          <div className="bg-top">
            <div>
              <h1 className="bg-temp">{defaultCity.main.temp}°C</h1>
              <h2 className="bg-city">{defaultCity.location}</h2>
            </div>

            <img
              src={defaultCity.weather.icon}
              alt="weather"
              className="bg-icon"
            />
          </div>

          <div className="bg-details">
            <div className="bg-col">
              <img src={humidity} alt="humidity" />
              <span>{defaultCity.main.humidity}%</span>
            </div>

            {/* ✅ AQI */}
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
        {" "}
        {/* ✅ Date & Time */}
        <div className="date-time">
          <p>{currentTime.toLocaleDateString()}</p>
          <p>{currentTime.toLocaleTimeString()}</p>
        </div>
        {/* ✅ Search */}
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
        {/* ✅ Searched City Data */}
        {weatherData && (
          <>
            <img
              src={weatherData.weather.icon}
              alt="weather"
              className="weather-icon"
            />
            <p className="temperature">{weatherData.main.temp}°C</p>
            <p className="location">{weatherData.location}</p>

            <div className="weathers-data">
              <div className="col">
                <img src={humidity} alt="humidity" />
                <div>
                  <p>{weatherData.main.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>

              <div className="col">
                <div
                  className="aqi-dot"
                  style={{
                    backgroundColor: getAQIInfo(weatherData.pm25).color,
                  }}
                />
                <div>
                  <p>{weatherData.pm25}</p>
                  <span>{getAQIInfo(weatherData.pm25).label}</span>
                </div>
              </div>

              <div className="col">
                <img src={wind} alt="wind" />
                <div>
                  <p>{weatherData.wind.speed} km/h</p>
                  <span>Wind speed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Weather;
