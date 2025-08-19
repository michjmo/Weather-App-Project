import { useState } from 'react';

export default function SearchBar({ initial = '', onSearch }) {
  const [value, setValue] = useState(initial);

  function submit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSearch(q);
  }

  return (
    <form className="row" onSubmit={submit} role="search" aria-label="Location search">
      <input
        className="input"
        type="text"
        value={value}
        placeholder="Search city, zip, address, or landmark"
        onChange={(e) => setValue(e.target.value)}
        aria-label="Location"
      />
      <button className="button primary" type="submit" disabled={!value.trim()}>
        Search
      </button>
    </form>
  );
}
