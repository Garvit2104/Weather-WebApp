import React, { useEffect, useState, useRef} from 'react';
import cloudy from '../Assets/cloudy.png';
import cloudymix from '../Assets/cloudymix.png';
import heavyrain from '../Assets/heavyrain.png';
import humidity from '../Assets/humidity.png';
import sun from '../Assets/sun.png';
import wind from '../Assets/wind.png';
import rainyday from '../Assets/rainyday.png';
import './Weather.css';
import SearchIcon from '@mui/icons-material/Search';

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

interface Props {
  weatherData: WeatherResponse | null;
  onSearch: (city: string) => void;
}

function Weather({ weatherData, onSearch }: Props) {
const inputRef = useRef<HTMLInputElement | null>(null);
    
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref = {inputRef} type="text" placeholder='Search city' className='search-input' />
            <button className='search-button' onClick={() => onSearch(inputRef.current ? inputRef.current.value : '')}><SearchIcon /></button>
        </div>
        {weatherData? <>
            <img src={weatherData?.weather.icon} alt='cloudy' className='weather-icon'/>
        <p className='temperature'> {weatherData?.main.temp}°C</p>
        <p className='location'> {weatherData?.location}  </p>
        <div className='weathers-data'>
            <div className='col'>
                <img src={humidity} alt='humidity' className='weather-detail-icon'/>
                <div>
                    <p> {weatherData?.main.humidity} </p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className='col'>
                <img src={wind} alt='wind' className='weather-detail-icon'/>
                <div>
                    <p> {weatherData?.wind.speed} km/h </p>
                    <span>Wind speed</span>
                </div>
            </div>
        </div>    
        </> : <></>
        }
        
    </div>
  )
}

export default Weather;