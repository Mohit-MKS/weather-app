import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss'
import Home from './components/Home';
import WeatherDetails from './components/WeatherDetails';

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather-detail/:city" element={<WeatherDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
