import React, { useEffect, useState } from "react";
import Weather from "../Components/Weather";
import cloudy from '../Assets/cloudy.png';
import cloudymix from '../Assets/cloudymix.png';
import heavyrain from '../Assets/heavyrain.png';
import sun from '../Assets/sun.png';
import rainyday from '../Assets/rainyday.png';

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
  pm25?: number;   // ✅ Added AQI
}

function WeatherLogic() {
  const [defaultCity, setDefaultCity] = useState<WeatherResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  const allIcons: { [key: string]: string } = {
    "01d": sun,
    "01n": sun,
    "02d": cloudymix,
    "02n": cloudymix,
    "03d": cloudy,
    "03n": cloudy,
    "04d": cloudy,
    "04n": cloudy,
    "09d": heavyrain,
    "09n": heavyrain,
    "10d": rainyday,
    "10n": rainyday,
    "11d": heavyrain,
    "11n": heavyrain,
    "13d": cloudymix,
    "13n": cloudymix,
  };

  // 🔥 Fetch AQI using lat & lon
  const fetchAQI = async (lat: number, lon: number) => {
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_ID}`;
    const response = await fetch(aqiUrl);
    const data = await response.json();
    return data.list[0].components.pm2_5;
  };

  const search = async (city: string) => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_ID}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "City not found");
        return;
      }

      const iconCode = data.weather[0].icon;
      const icon = allIcons[iconCode] || sun;

      // ✅ Get AQI
      const aqi = await fetchAQI(data.coord.lat, data.coord.lon);

      setWeatherData({
        location: data.name,
        main: {
          temp: Math.floor(data.main.temp),
          humidity: data.main.humidity,
        },
        wind: {
          speed: data.wind.speed,
        },
        weather: {
          icon: icon,
        },
        pm25: aqi
      });

    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  const fetchDefaultCity = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=New Delhi&appid=${process.env.REACT_APP_ID}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      const iconCode = data.weather[0].icon;
      const icon = allIcons[iconCode] || sun;

      // ✅ Get AQI
      const aqi = await fetchAQI(data.coord.lat, data.coord.lon);

      setDefaultCity({
        location: data.name,
        main: {
          temp: Math.floor(data.main.temp),
          humidity: data.main.humidity,
        },
        wind: {
          speed: data.wind.speed,
        },
        weather: {
          icon: icon,
        },
        pm25: aqi,   // ✅ store AQI
      });

    } catch (error) {
      console.log("Error loading default city:", error);
    }
  };

  useEffect(() => {
    fetchDefaultCity();
    search("Mumbai");
  }, []);

  return (
    <Weather
      weatherData={weatherData}
      defaultCity={defaultCity}
      onSearch={search}
    />
  );
}

export default WeatherLogic;
