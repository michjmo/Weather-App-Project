import { useEffect, useState } from 'react';
import ErrorBanner from '../components/ErrorBanner';
import Loader from '../components/Loader';
import { forecast5d } from '../services/api';

export default function Forecast() {
  const [params, setParams] = useState(() => {
    try {
      const raw = localStorage.getItem('lastLocation');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [units, setUnits] = useState(import.meta.env.VITE_DEFAULT_UNITS || 'imperial');
  const [data, setData] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user came directly, try to read coords from URL params or bail
    const url = new URL(window.location.href);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const u = url.searchParams.get('units');
    if (lat && lon) setParams({ lat: Number(lat), lon: Number(lon) });
    if (u) setUnits(u);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!params?.lat || !params?.lon) return;
      try {
        setPending(true);
        const f = await forecast5d({ lat: params.lat, lon: params.lon, units });
        if (!cancelled) setData(f);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load forecast');
      } finally {
        if (!cancelled) setPending(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params, units]);

  return (
    <div className="container">
      <div className="nav">
        <a href="/">Current</a>
        <a href="/forecast" className="active">Forecast</a>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>5-day forecast</h2>
          <div className="row">
            <span>Units:</span>
            <select className="select" value={units} onChange={(e) => setUnits(e.target.value)}>
              <option value="imperial">°F</option>
              <option value="metric">°C</option>
            </select>
          </div>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />
      {pending && <Loader label="Fetching forecast..." />}

      {!pending && data && (
        <div className="grid-2">
          {data.list
            .filter((_, i) => i % 2 === 0) // sample every 6 hours → make it lighter
            .slice(0, 16)
            .map((slot) => (
              <div key={slot.dt} className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'var(--muted)' }}>
                      {new Date(slot.dt * 1000).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>
                      {Math.round(slot.main.temp)}{units === 'imperial' ? '°F' : '°C'}
                    </div>
                  </div>
                  <img
                    alt={slot.weather?.[0]?.description || 'weather'}
                    src={`https://openweathermap.org/img/wn/${slot.weather?.[0]?.icon}@2x.png`}
                    width="64" height="64"
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}