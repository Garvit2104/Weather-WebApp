import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import './Weather.css';

function Searchbar() {
  return (
    
        <div className='search-bar'>
        <input type="text" placeholder='Search city' className='search-input' />
        <button className='search-button'><SearchIcon /></button>
        </div>
    
  )
}

export default Searchbar