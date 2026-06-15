import React, { useState } from 'react'
import { useNavigate } from 'react-router';

const Home = () => {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate('/weather-detail/' + city);
  }

  return (
    <div className="d-flex mt-2">
      <div className="input-group m-3">
        <input type="text" className="form-control" placeholder="Enter City" value={city} onChange={(event) => { setCity(event.target.value) }} />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSearch} >Search</button>
    </div>
  )
}

export default Home