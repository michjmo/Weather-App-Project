import { iconUrl, titleCase, toFixed } from '../services/format';

export default function WeatherCard({ place, data, units }) {
  if (!data) return null;

  const { weather = [], main = {}, wind = {}, sys = {}, name } = data;
  const w = weather[0];
  const tempUnit = units === 'imperial' ? '°F' : '°C';
  const speedUnit = units === 'imperial' ? 'mph' : 'm/s';

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: '6px 0' }}>{place || name}</h2>
          <div style={{ color: 'var(--muted)' }}>{w ? titleCase(w.description) : '—'}</div>
        </div>
        {w && <img src={iconUrl(w.icon)} alt={w.description} width="80" height="80" />}
      </div>

      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="kpi">
          <label>Temperature</label>
          <span>{toFixed(main.temp, 0)}{tempUnit}</span>
        </div>
        <div className="kpi">
          <label>Feels like</label>
          <span>{toFixed(main.feels_like, 0)}{tempUnit}</span>
        </div>
        <div className="kpi">
          <label>Humidity</label>
          <span>{toFixed(main.humidity, 0)}%</span>
        </div>
        <div className="kpi">
          <label>Wind</label>
          <span>{toFixed(wind.speed, 0)} {speedUnit}</span>
        </div>
        <div className="kpi">
          <label>Pressure</label>
          <span>{toFixed(main.pressure, 0)} hPa</span>
        </div>
        <div className="kpi">
          <label>Sunrise / Sunset</label>
          <span>
            {sys.sunrise ? new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
            {' / '}
            {sys.sunset ? new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
