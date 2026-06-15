import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const SAVED_CITIES_KEY = 'city-weather:saved-cities';
const RECENT_CITIES_KEY = 'city-weather:recent-cities';

const readCities = (key: string): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value.filter((city): city is string => typeof city === 'string') : [];
  } catch {
    return [];
  }
};

const formatCityName = (value: string) => value
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const Home = () => {
  const [city, setCity] = useState('');
  const [savedCities, setSavedCities] = useState<string[]>(() => readCities(SAVED_CITIES_KEY));
  const [recentCities, setRecentCities] = useState<string[]>(() => readCities(RECENT_CITIES_KEY));
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
    const formattedCity = formatCityName(cityName);

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
    const formattedCity = formatCityName(city);

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

      <section className="saved-section" aria-labelledby="saved-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow--dark">Your places</p>
            <h2 id="saved-heading">Saved cities</h2>
          </div>
          {selectedCities.size > 0 && (
            <button className="button button--danger" type="button" onClick={deleteSelectedCities}>
              Delete selected ({selectedCities.size})
            </button>
          )}
        </div>

        {savedCities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true" />
            <h3>No saved cities yet</h3>
            <p>Enter a city above and choose “Save city” to keep it close.</p>
          </div>
        ) : (
          <div className="city-grid">
            {savedCities.map((savedCity, index) => {
              const isSelected = selectedCities.has(savedCity);
              return (
                <article
                  className={`city-card${isSelected ? ' city-card--selected' : ''}`}
                  key={savedCity}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCity(savedCity)}
                    aria-label={`Select ${savedCity}`}
                  />
                  <button className="city-card__body" type="button" onClick={() => openWeather(savedCity)}>
                    <span className="city-card__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="city-card__name">{savedCity}</span>
                    <span className="city-card__action">View weather <span aria-hidden="true">&rarr;</span></span>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
