export default function ErrorBanner({ message, onClose }) {
    if (!message) return null;
    return (
      <div className="panel" role="alert" style={{ borderColor: 'rgba(255,0,0,0.2)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>⚠️ {message}</div>
          <button className="button" onClick={onClose} aria-label="Dismiss error">Dismiss</button>
        </div>
      </div>
    );
  }
  