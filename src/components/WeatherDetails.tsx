import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getWeatherByCity } from '../services/httpService';
import type { WeatherData } from '../services/utilService';

type PageState =
  | { city: string; status: 'loading'; data: null; error: '' }
  | { city: string; status: 'success'; data: WeatherData; error: '' }
  | { city: string; status: 'error'; data: null; error: string };

const formatValue = (value: number | null, suffix: string, digits = 0) =>
  value === null ? 'Not available' : `${value.toFixed(digits)}${suffix}`;

const formatTime = (timestamp: number | null, timezoneOffset: number) => {
  if (timestamp === null) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date((timestamp + timezoneOffset) * 1000));
};

const WeatherDetails = () => {
  const { city = '' } = useParams<{ city: string }>();
  const [pageState, setPageState] = useState<PageState>({
    city,
    status: 'loading',
    data: null,
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    getWeatherByCity(city, controller.signal).then((result) => {
      if (controller.signal.aborted) {
        return;
      }

      if (result.ok) {
        setPageState({ city, status: 'success', data: result.data, error: '' });
      } else {
        setPageState({ city, status: 'error', data: null, error: result.error });
      }
    });

    return () => controller.abort();
  }, [city]);

  if (pageState.status === 'loading' || pageState.city !== city) {
    return (
      <main className="weather-page d-flex flex-column align-items-center justify-content-center text-center p-4">
        <div className="spinner-border text-accent mb-3" role="status">
          <span className="visually-hidden">Loading weather</span>
        </div>
        <p className="mb-0">Checking the sky over {city}...</p>
      </main>
    );
  }

  if (pageState.status === 'error') {
    return (
      <main className="weather-page d-flex align-items-center justify-content-center text-center p-4">
        <section className="card bg-dark bg-opacity-25 border-light border-opacity-25 text-white p-4 p-md-5 error-card" role="alert">
          <span className="eyebrow">404</span>
          <h1 className="h2 fw-bold">Weather unavailable</h1>
          <p className="text-white-50">{pageState.error}</p>
          <Link className="btn btn-accent align-self-center" to="/">Try another city</Link>
        </section>
      </main>
    );
  }

  const weather = pageState.data;
  const iconUrl = weather.iconCode
    ? `https://openweathermap.org/img/wn/${weather.iconCode}@4x.png`
    : '';

  const highlights = [
    { label: 'Feels like', value: formatValue(weather.feelsLike, '\u00B0') },
    { label: 'Humidity', value: formatValue(weather.humidity, '%') },
    { label: 'Wind', value: formatValue(weather.windSpeed, ' m/s', 1) },
    { label: 'Pressure', value: formatValue(weather.pressure, ' hPa') },
    { label: 'Visibility', value: formatValue(weather.visibilityKm, ' km', 1) },
    { label: 'High / Low', value: `${formatValue(weather.maxTemperature, '\u00B0')} / ${formatValue(weather.minTemperature, '\u00B0')}` },
  ];

  return (
    <main className="weather-page">
      <nav className="container d-flex align-items-center justify-content-between py-4">
        <Link className="link-light link-opacity-75 text-decoration-none fw-semibold" to="/" aria-label="Back to saved cities">
          &larr; All cities
        </Link>
        <span className="text-accent fw-bold">City Weather</span>
      </nav>

      <section className="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-5 py-5 weather-hero">
        <div>
          <p className="eyebrow">Current conditions</p>
          <h1>{weather.city}{weather.country && <span>, {weather.country}</span>}</h1>
          <p className="weather-description">{weather.description}</p>
        </div>
        <div className="temperature-block">
          {iconUrl && <img src={iconUrl} alt="" />}
          <strong>{formatValue(weather.temperature, '\u00B0')}</strong>
          <span>Celsius</span>
        </div>
      </section>

      <section className="weather-content py-5" aria-label="Weather details">
        <div className="container">
          <div className="row g-3">
            {highlights.map((item) => (
              <div className="col-12 col-sm-6 col-lg-4" key={item.label}>
                <article className="card h-100 p-4 stat-card">
                  <span className="detail-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              </div>
            ))}
          </div>

          <article className="sun-card d-flex align-items-center gap-4 mt-3 p-4 rounded-3">
            <div>
              <span className="detail-label">Sunrise</span>
              <strong>{formatTime(weather.sunrise, weather.timezoneOffset)}</strong>
            </div>
            <div className="sun-track flex-grow-1 d-none d-sm-block" aria-hidden="true"><span /></div>
            <div className="text-end ms-auto">
              <span className="detail-label">Sunset</span>
              <strong>{formatTime(weather.sunset, weather.timezoneOffset)}</strong>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default WeatherDetails;
