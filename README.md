# City Weather

City Weather is a small React application for checking current weather conditions and keeping a short list of cities you care about. It uses the OpenWeather current weather API and stores saved cities and recent searches in the browser.

## Features

- Search current weather by city name
- View temperature, humidity, wind, pressure, visibility, sunrise, and sunset
- Save frequently checked cities
- Select and remove multiple saved cities
- Reopen recent searches without typing the city again
- Handle invalid cities, network failures, loading states, and cancelled requests
- Persist saved and recent cities with `localStorage`
- Responsive layout built with Bootstrap and a small set of custom styles

## Tech Stack

- React 19 and TypeScript
- Vite
- React Router
- Axios
- Bootstrap 5
- Sass
- OpenWeather API

## Getting Started

### Prerequisites

- Node.js `20.19+` or `22.12+`
- An [OpenWeather API key](https://openweathermap.org/api)

### Installation

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
VITE_OPEN_WEATHER_API_KEY=your_api_key_here
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check the project and create a production build |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Serve the production build locally |

## Project Structure

```text
src/
|-- components/
|   |-- Home.tsx              # Search, recent history, and saved-city state
|   |-- SavedCities.tsx       # Saved-city list and selection UI
|   `-- WeatherDetails.tsx    # Weather request states and detail view
|-- services/
|   |-- httpService.ts        # OpenWeather client and request error handling
|   `-- utilService.ts        # API normalization and city utilities
|-- App.tsx                   # Application routes
|-- App.scss                  # App-specific visual styles
`-- index.scss                # Global styles
```

## Implementation Notes

The UI does not consume the OpenWeather response directly. `utilService.formatWeatherData` converts the nested API payload into a stable `WeatherData` shape first. Keeping that conversion at the service boundary prevents API-specific field names from spreading through the components and makes response changes easier to handle.

Weather requests return a discriminated success/error result from `httpService`. This keeps Axios details out of the UI and gives the detail page one predictable path for loading, success, and failure states.

Saved cities and recent searches are intentionally browser-local. They use the following keys:

- `city-weather:saved-cities`
- `city-weather:recent-cities`

No backend or user account is required.

## Production Build

```bash
npm run build
npm run preview
```

The generated production files are written to `dist/`.
