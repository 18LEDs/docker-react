import React, { useState, useRef } from 'react';
import StarRating from './StarRating';

export default function Randomizer({ collection }) {
  const [minRating, setMinRating] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [picked, setPicked] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef(null);

  const eligible = collection.filter(c => {
    const typeOk = typeFilter === 'all' || c.type === typeFilter;
    const ratingOk = !minRating || (c.rating || 0) >= minRating;
    return typeOk && ratingOk;
  });

  const spin = () => {
    if (eligible.length === 0) return;
    setSpinning(true);
    setPicked(null);

    let count = 0;
    const total = 10 + Math.floor(Math.random() * 8);

    intervalRef.current = setInterval(() => {
      setPicked(eligible[Math.floor(Math.random() * eligible.length)]);
      count++;
      if (count >= total) {
        clearInterval(intervalRef.current);
        setSpinning(false);
        setPicked(eligible[Math.floor(Math.random() * eligible.length)]);
      }
    }, 100 + count * 5);
  };

  if (collection.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎲</div>
        <h3>Nothing to randomize yet</h3>
        <p>Add some cocktails to your collection first.</p>
      </div>
    );
  }

  return (
    <div className="randomizer">
      <h2>Can't decide?</h2>
      <p className="subtitle-text">Let fate choose your next drink.</p>

      <div className="randomizer-controls">
        <div className="form-group">
          <label className="form-label">Minimum rating</label>
          <div className="chip-group">
            {[[0, 'Any'], [3, '3+ ★'], [4, '4+ ★'], [5, '5 ★ only']].map(([val, label]) => (
              <button key={val} className={`chip ${minRating === val ? 'active' : ''}`}
                onClick={() => setMinRating(val)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">From</label>
          <div className="chip-group">
            {[['all', 'All'], ['generated', 'Generated'], ['bar', 'Bar Finds']].map(([id, label]) => (
              <button key={id} className={`chip ${typeFilter === id ? 'active' : ''}`}
                onClick={() => setTypeFilter(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="eligible-count">
          {eligible.length} eligible cocktail{eligible.length !== 1 ? 's' : ''}
        </p>
      </div>

      <button
        className={`btn-spin ${spinning ? 'spinning' : ''}`}
        onClick={spin}
        disabled={spinning || eligible.length === 0}
      >
        {spinning ? '🎲 Rolling…' : '🎲 Pick for Me'}
      </button>

      {eligible.length === 0 && (
        <p className="error-msg" style={{ marginTop: 12 }}>
          No cocktails match your filters. Try adjusting the criteria above.
        </p>
      )}

      {picked && (
        <div className={`picked-result ${spinning ? 'blurred' : 'revealed'}`}>
          {!spinning && <div className="picked-label">Tonight you're having:</div>}
          <div className="picked-card">
            {picked.thumbnail && (
              <img src={picked.thumbnail} alt={picked.name} className="picked-thumb" />
            )}
            <div className="picked-info">
              <h2 className="picked-name">{picked.name}</h2>
              {picked.barName && <p className="picked-bar">@ {picked.barName}</p>}
              {picked.rating && <StarRating rating={picked.rating} readonly size="md" />}
              {picked.notes && <p className="picked-notes">"{picked.notes}"</p>}
              {picked.ingredients?.length > 0 && (
                <div className="picked-ingredients">
                  {picked.ingredients.slice(0, 5).map((ing, i) => (
                    <span key={i} className="ingredient-tag">{ing}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {!spinning && (
            <button className="btn-small btn-secondary" onClick={spin}>
              Pick again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
