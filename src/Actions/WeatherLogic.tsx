import React, { useEffect, useState } from "react";
import Weather from "../Components/Weather";
import cloudy from "../Assets/cloudy.png";
import cloudymix from "../Assets/cloudymix.png";
import heavyrain from "../Assets/heavyrain.png";
import sun from "../Assets/sun.png";
import rainyday from "../Assets/rainyday.png";

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

function WeatherLogic() {
  const [defaultCity, setDefaultCity] =
    useState<WeatherResponse | null>(null);
  const [weatherData, setWeatherData] =
    useState<WeatherResponse | null>(null);

  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [defaultForecast, setDefaultForecast] =
    useState<ForecastDay[]>([]);

  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [defaultHourly, setDefaultHourly] =
    useState<HourlyForecast[]>([]);

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

  // ✅ Fetch AQI
  const fetchAQI = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_ID}`;
    const response = await fetch(url);
    const data = await response.json();
    return data?.list?.[0]?.components?.pm2_5 || 0;
  };

  // ✅ Fetch Forecast (7 Day + Hourly)
  const fetchForecast = async (lat: number, lon: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&forecast_days=7&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily || !data.hourly) {
      return { dailyData: [], hourlyData: [] };
    }

    // 7 Day Forecast
    const dailyData: ForecastDay[] = data.daily.time.map(
      (date: string, index: number) => ({
        date,
        min: Math.floor(data.daily.temperature_2m_min[index]),
        max: Math.floor(data.daily.temperature_2m_max[index]),
      })
    );

    // Hourly Forecast (first 12 hours)
    const hourlyData: HourlyForecast[] = data.hourly.time
      .map((time: string, index: number) => ({
        time,
        temperature: Math.floor(data.hourly.temperature_2m[index]),
      }))
      .slice(0, 12);

    return { dailyData, hourlyData };
  };

  // ✅ Search City
  const search = async (city: string) => {
    if (!city.trim()) {
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

      const lat = data.coord.lat;
      const lon = data.coord.lon;

      const aqi = await fetchAQI(lat, lon);
      const { dailyData, hourlyData } =
        await fetchForecast(lat, lon);

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
          icon,
        },
        pm25: aqi,
      });

      setForecast(dailyData);
      setHourly(hourlyData);

    } catch (error) {
      console.log("Search error:", error);
    }
  };

  // ✅ Default City Load
  const fetchDefaultCity = async () => {
    try {
      const city = "New Delhi";

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_ID}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      const iconCode = data.weather[0].icon;
      const icon = allIcons[iconCode] || sun;

      const lat = data.coord.lat;
      const lon = data.coord.lon;

      const aqi = await fetchAQI(lat, lon);
      const { dailyData, hourlyData } =
        await fetchForecast(lat, lon);

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
          icon,
        },
        pm25: aqi,
      });

      setDefaultForecast(dailyData);
      setDefaultHourly(hourlyData);

    } catch (error) {
      console.log("Default city error:", error);
    }
  };

  useEffect(() => {
    fetchDefaultCity();
    search("Mumbai"); // Optional initial search
  }, []);

  return (
    <Weather
      weatherData={weatherData}
      defaultCity={defaultCity}
      onSearch={search}
      forecast={forecast}
      defaultForecast={defaultForecast}
      hourly={hourly}
      defaultHourly={defaultHourly}
    />
  );
}

export default WeatherLogic;