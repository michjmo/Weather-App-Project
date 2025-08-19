export default function UnitToggle({ units, onChange }) {
    const other = units === 'imperial' ? 'metric' : 'imperial';
    const label = units === 'imperial' ? '°F' : '°C';
  
    return (
      <div className="row">
        <span aria-live="polite">Units: <strong>{label}</strong></span>
        <button
          className="button"
          onClick={() => onChange(other)}
          aria-label={`Switch to ${other === 'imperial' ? 'Fahrenheit' : 'Celsius'}`}
        >
          Switch to {other === 'imperial' ? '°F' : '°C'}
        </button>
      </div>
    );
  }
  