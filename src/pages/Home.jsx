import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import UnitToggle from '../components/UnitToggle';
import WeatherCard from '../components/WeatherCard';
import ErrorBanner from '../components/ErrorBanner';
import Loader from '../components/Loader';
import { geocode, currentWeather } from '../services/api';

const DEFAULT_LOCATION = import.meta.env.VITE_DEFAULT_LOCATION || 'New York, NY';
const DEFAULT_UNITS = import.meta.env.VITE_DEFAULT_UNITS || 'imperial';

export default function Home() {
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [place, setPlace] = useState(DEFAULT_LOCATION);
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  // On mount: try geolocation then fallback to default location
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setPending(true);
        // Try browser geolocation (optional by user)
        const pos = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
          const t = setTimeout(() => reject(new Error('Geolocation timeout')), 6000);
          navigator.geolocation.getCurrentPosition(
            (p) => { clearTimeout(t); resolve(p); },
            (e) => { clearTimeout(t); reject(e); },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
          );
        }).catch(() => null);

        let location;
        if (pos?.coords) {
          location = { name: 'Your location', lat: pos.coords.latitude, lon: pos.coords.longitude };
        } else {
          location = await geocode(DEFAULT_LOCATION);
        }

        if (!cancelled) {
          setPlace(location.name);
          setCoords({ lat: location.lat, lon: location.lon });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to initialize');
      } finally {
        if (!cancelled) setPending(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // Fetch weather when coords or units change
  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      if (!coords) return;
      try {
        setPending(true);
        const w = await currentWeather({ ...coords, units });
        if (!cancelled) setData(w);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load weather');
      } finally {
        if (!cancelled) setPending(false);
      }
    }
    fetchWeather();
    return () => { cancelled = true; };
  }, [coords, units]);

  async function handleSearch(query) {
    try {
      setError('');
      setPending(true);
      const loc = await geocode(query);
      setPlace(loc.name);
      setCoords({ lat: loc.lat, lon: loc.lon });
    } catch (e) {
      setError(e.message || 'Search failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container">
      <div className="nav">
        <a href="/" className="active">Current</a>
        <a href="/forecast">Forecast</a>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <SearchBar initial={place} onSearch={handleSearch} />
          <UnitToggle units={units} onChange={setUnits} />
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />
      {pending && <Loader label="Fetching weather..." />}
      {!pending && data && <WeatherCard place={place} data={data} units={units} />}
    </div>
  );
}
