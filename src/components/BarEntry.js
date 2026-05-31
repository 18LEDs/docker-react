import React, { useState } from 'react';
import StarRating from './StarRating';

const SPIRITS = ['Gin', 'Vodka', 'Rum', 'Tequila', 'Mezcal', 'Whiskey', 'Bourbon', 'Scotch', 'Brandy', 'Champagne', 'Wine', 'Beer', 'Other'];

const CHARS = ['Citrusy', 'Sweet', 'Bitter', 'Sour', 'Smoky', 'Herbal', 'Tropical', 'Spicy', 'Bubbly', 'Creamy', 'Fruity', 'Floral'];

const blank = () => ({
  name: '',
  barName: '',
  spirits: [],
  characteristics: [],
  rating: 0,
  notes: '',
  date: new Date().toISOString().split('T')[0],
});

export default function BarEntry({ saveCocktail }) {
  const [form, setForm] = useState(blank());
  const [saved, setSaved] = useState(false);

  const toggleArr = (field, val) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(v => v !== val)
        : [...prev[field], val],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    saveCocktail({
      id: `bar_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: form.name.trim(),
      barName: form.barName.trim() || null,
      spirits: form.spirits,
      characteristics: form.characteristics,
      ingredients: form.spirits,
      rating: form.rating || null,
      notes: form.notes.trim(),
      date: form.date,
      type: 'bar',
      thumbnail: null,
      instructions: '',
      tags: [...form.spirits, ...form.characteristics],
    });

    setForm(blank());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bar-entry">
      <h2>Log a Bar Cocktail</h2>
      <p className="subtitle-text">Found something amazing? Save it before you forget.</p>

      {saved && <div className="success-banner">✓ Saved to your collection!</div>}

      <form onSubmit={handleSubmit} className="bar-form">
        <div className="form-group">
          <label className="form-label">Cocktail name *</label>
          <input
            className="text-input"
            placeholder="e.g. Smoky Negroni"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bar / Restaurant</label>
          <input
            className="text-input"
            placeholder="Where did you have this?"
            value={form.barName}
            onChange={e => setForm(p => ({ ...p, barName: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date visited</label>
          <input
            className="text-input"
            type="date"
            value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Spirits</label>
          <div className="chip-group">
            {SPIRITS.map(s => (
              <button type="button" key={s}
                className={`chip ${form.spirits.includes(s) ? 'active' : ''}`}
                onClick={() => toggleArr('spirits', s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Characteristics</label>
          <div className="chip-group">
            {CHARS.map(c => (
              <button type="button" key={c}
                className={`chip ${form.characteristics.includes(c) ? 'active' : ''}`}
                onClick={() => toggleArr('characteristics', c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your rating</label>
          <StarRating
            rating={form.rating}
            onRate={r => setForm(p => ({ ...p, rating: r }))}
            size="lg"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="text-input textarea"
            placeholder="Flavor notes, what made it special, would you order again?"
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            rows={3}
          />
        </div>

        <button type="submit" className="btn-generate" disabled={!form.name.trim()}>
          Save to Collection
        </button>
      </form>
    </div>
  );
}
