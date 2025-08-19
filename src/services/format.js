export function iconUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  
  export function titleCase(s) {
    return s ? s[0].toUpperCase() + s.slice(1) : '';
  }
  
  export function toFixed(n, d = 0) {
    return typeof n === 'number' ? n.toFixed(d) : n;
  }
  