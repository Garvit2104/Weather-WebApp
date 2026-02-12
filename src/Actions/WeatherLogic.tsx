import React, { useEffect, useState } from "react";
import Weather from "../Components/Weather";

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

function WeatherLogic() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  const search = async (city: string) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_ID}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("Error in loading Data");
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return <Weather weatherData={weatherData} onSearch={search} />;
}

export default WeatherLogic;
