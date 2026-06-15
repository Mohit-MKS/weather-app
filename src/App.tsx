import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss'
import Home from './components/Home';
import WeatherDetails from './components/WeatherDetails';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather-detail/:city" element={<WeatherDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
