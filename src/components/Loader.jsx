export default function Loader({ label = 'Loading...' }) {
    return (
      <div className="center">
        <div role="status" aria-live="polite" aria-busy="true">
          <svg width="32" height="32" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6" />
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="100" strokeDashoffset="60">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div style={{ marginTop: 8 }}>{label}</div>
        </div>
      </div>
    );
  }
  