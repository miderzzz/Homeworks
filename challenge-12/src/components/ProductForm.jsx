import { useState } from 'react';

function ProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [popularity, setPopularity] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();

    const cleanName = name.trim().replace(/\s+/g, " ").toLowerCase();
    const value = Number(popularity);

    if (cleanName === "") {
      setMessage({ type: 'error', text: "Name is required" });
      return;
    }

    if (popularity === "" || !Number.isInteger(value) || value < 0 || value > 100) {
      setMessage({ type: 'error', text: "Popularity must be an integer between 0 and 100" });
      return;
    }

    const updated = onAdd(cleanName, value);

    setMessage({
      type: 'success',
      text: updated
        ? `"${cleanName}" updated to ${value}`
        : `"${cleanName}" added with popularity ${value}`,
    });
    setName('');
    setPopularity('');
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add shoe</h2>

      <div className="fields">
        <input
          className="search-input"
          type="text"
          placeholder="Name (e.g. air max 90)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="search-input"
          type="number"
          placeholder="Popularity (0-100)"
          min="0"
          max="100"
          step="1"
          value={popularity}
          onChange={e => setPopularity(e.target.value)}
        />
        <button className="submit" type="submit">Add</button>
      </div>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}
    </form>
  );
}

export default ProductForm;