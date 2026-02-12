import React, { useEffect, useState } from "react";
import Weather from "../Components/Weather";
import cloudy from '../Assets/cloudy.png';
import cloudymix from '../Assets/cloudymix.png';
import heavyrain from '../Assets/heavyrain.png';
import humidity from '../Assets/humidity.png';
import sun from '../Assets/sun.png';
import wind from '../Assets/wind.png';
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
  weather:{
    icon: string;
  }
}


function WeatherLogic() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  const allIcons = {
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
  const search = async (city: string) => {
    if(city === ""){
      alert("Please enter a city name");
      return;  
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_ID}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();
        if(!response.ok){
          alert("City not found");
          return;
        }
        const icon: string | undefined = allIcons[data.weather[0].icon as keyof typeof allIcons];
        setWeatherData({
          location: data.name,
          main: {
            humidity: data.main.humidity,
            temp: Math.floor(data.main.temp),
          },
          wind: {
            speed: data.wind.speed,
          },
          weather: {
            icon: icon
          }
        });
    } catch (error) {
      console.log("Error in loading Data");
    }
  };

  useEffect(() => {
    search("New Delhi"); 
  }, []);

  return <Weather weatherData={weatherData} onSearch={search} />;
}

export default WeatherLogic;
