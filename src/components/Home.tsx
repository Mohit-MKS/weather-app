import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import utilService from '../services/utilService';
import SavedCities from './SavedCities';

const SAVED_CITIES_KEY = 'city-weather:saved-cities';
const RECENT_CITIES_KEY = 'city-weather:recent-cities';

const Home = () => {
  const [city, setCity] = useState('');
  const [savedCities, setSavedCities] = useState<string[]>(() => utilService.readCities(SAVED_CITIES_KEY));
  const [recentCities, setRecentCities] = useState<string[]>(() => utilService.readCities(RECENT_CITIES_KEY));
  const [selectedCities, setSelectedCities] = useState<Set<string>>(() => new Set());
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recentCities));
  }, [recentCities]);

  const openWeather = (cityName: string) => {
    const formattedCity = utilService.formatCityName(cityName);

    if (!formattedCity) {
      setFormError('Enter a city name to continue.');
      return;
    }

    setFormError('');
    setRecentCities((current) => [
      formattedCity,
      ...current.filter((item) => item.toLowerCase() !== formattedCity.toLowerCase()),
    ].slice(0, 6));
    navigate(`/weather-detail/${encodeURIComponent(formattedCity)}`);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openWeather(city);
  };

  const handleSaveCity = () => {
    const formattedCity = utilService.formatCityName(city);

    if (!formattedCity) {
      setFormError('Enter a city name before saving.');
      return;
    }

    if (savedCities.some((item) => item.toLowerCase() === formattedCity.toLowerCase())) {
      setFormError(`${formattedCity} is already saved.`);
      return;
    }

    setSavedCities((current) => [...current, formattedCity]);
    setCity('');
    setFormError('');
  };

  const toggleCity = (cityName: string) => {
    setSelectedCities((current) => {
      const next = new Set(current);
      if (next.has(cityName)) {
        next.delete(cityName);
      } else {
        next.add(cityName);
      }
      return next;
    });
  };

  const deleteSelectedCities = () => {
    setSavedCities((current) => current.filter((item) => !selectedCities.has(item)));
    setSelectedCities(new Set());
  };

  return (
    <main className="min-vh-100">
      <section className="hero-panel text-white">
        <div className="container py-5 position-relative z-1">
          <div className="brand-mark mb-4" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">City Weather</p>
          <h1 className="display-2 fw-bold hero-title">Weather for the places that matter.</h1>
          <p className="lead text-white-50 hero-copy">
            Search any city, save your regular spots, and get the current conditions in one clean view.
          </p>

          <form className="city-form" onSubmit={handleSearch} noValidate>
            <label className="form-label small text-white-50" htmlFor="city-name">City name</label>
            <div className="row g-2">
              <div className="col-12 col-md">
                <input
                  className="form-control form-control-lg city-input"
                  id="city-name"
                  type="text"
                  placeholder="e.g. Delhi"
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setFormError('');
                  }}
                  aria-describedby={formError ? 'city-error' : undefined}
                />
              </div>
              <div className="col-6 col-md-auto d-grid">
                <button className="btn btn-accent btn-lg" type="submit">Check weather</button>
              </div>
              <div className="col-6 col-md-auto d-grid">
                <button className="btn btn-outline-light btn-lg" type="button" onClick={handleSaveCity}>
                  Save city
                </button>
              </div>
            </div>
            {formError && <p className="text-warning small mt-2 mb-0" id="city-error" role="alert">{formError}</p>}
          </form>

          {recentCities.length > 0 && (
            <div className="d-flex flex-wrap align-items-center gap-2 mt-4" aria-label="Recent searches">
              <span className="small text-uppercase text-white-50 fw-bold me-1">Recent</span>
              {recentCities.map((recentCity) => (
                <button
                  className="btn btn-sm btn-outline-light rounded-pill"
                  type="button"
                  key={recentCity}
                  onClick={() => openWeather(recentCity)}
                >
                  {recentCity}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <SavedCities
        cities={savedCities}
        selectedCities={selectedCities}
        onSelect={toggleCity}
        onDeleteSelected={deleteSelectedCities}
        onOpen={openWeather}
      />
    </main>
  );
};

export default Home;
