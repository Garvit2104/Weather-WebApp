import React from 'react';
import cloudy from '../Assets/cloudy.png';
import cloudymix from '../Assets/cloudymix.png';
import heavyrain from '../Assets/heavyrain.png';
import humidity from '../Assets/humidity.png';
import sun from '../Assets/sun.png';
import wind from '../Assets/wind.png';
import rainyday from '../Assets/rainyday.png';
import './Weather.css';
import SearchIcon from '@mui/icons-material/Search';

function Weather() {
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input type="text" placeholder='Search city' className='search-input' />
            <button className='search-button'><SearchIcon /></button>
        </div>
        <img src={sun} alt='cloudy' className='weather-icon'/>
        <p className='temperature'> 18° C</p>
        <p className='location'> London  </p>
        <div className='weathers-data'>
            <div className='col'>
                <img src={humidity} alt='humidity' className='weather-detail-icon'/>
                <div>
                    <p> 60% </p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className='col'>
                <img src={wind} alt='wind' className='weather-detail-icon'/>
                <div>
                    <p> 10 km/h </p>
                    <span>Wind speed</span>
                </div>
            </div>
        </div>    
    </div>
  )
}

export default Weather;