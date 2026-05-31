import React, { useState } from 'react';
import StarRating from './StarRating';

export default function CocktailCard({ cocktail, onSave, onRateUpdate, onRemove, isSaved }) {
  const [expanded, setExpanded] = useState(false);

  const handleRate = (rating) => {
    if (isSaved && onRateUpdate) {
      onRateUpdate(cocktail.id, rating);
    } else if (onSave) {
      onSave({ ...cocktail, rating });
    }
  };

  const handleSave = () => onSave && onSave(cocktail);

  return (
    <div className="cocktail-card">
      {cocktail.thumbnail && (
        <div className="card-img-wrap" onClick={() => setExpanded(e => !e)}>
          <img src={cocktail.thumbnail} alt={cocktail.name} className="cocktail-thumb" />
          <div className="img-overlay">{expanded ? 'Close' : 'Details'}</div>
        </div>
      )}
      <div className="cocktail-info">
        <div className="cocktail-header">
          <h3 className="cocktail-name">{cocktail.name}</h3>
          {cocktail.barName && <span className="bar-badge">@ {cocktail.barName}</span>}
        </div>

        {cocktail.date && (
          <p className="visit-date">{new Date(cocktail.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        )}

        <StarRating rating={cocktail.rating} onRate={handleRate} size="md" />

        <div className="ingredients-list">
          {cocktail.ingredients?.slice(0, expanded ? undefined : 3).map((ing, i) => (
            <span key={i} className="ingredient-tag">{ing}</span>
          ))}
          {!expanded && (cocktail.ingredients?.length || 0) > 3 && (
            <button className="show-more" onClick={() => setExpanded(true)}>
              +{cocktail.ingredients.length - 3} more
            </button>
          )}
        </div>

        {expanded && cocktail.instructions && (
          <p className="instructions">{cocktail.instructions}</p>
        )}

        {expanded && cocktail.notes && (
          <p className="personal-notes">"{cocktail.notes}"</p>
        )}

        {cocktail.glass && expanded && (
          <p className="glass-type">Glass: {cocktail.glass}</p>
        )}

        <div className="card-actions">
          {(cocktail.ingredients?.length > 3 || cocktail.instructions) && (
            <button className="btn-small btn-secondary" onClick={() => setExpanded(e => !e)}>
              {expanded ? 'Less' : 'Details'}
            </button>
          )}
          {!isSaved && onSave && (
            <button className="btn-small btn-primary" onClick={handleSave}>
              Save
            </button>
          )}
          {isSaved && <span className="saved-badge">Saved</span>}
          {isSaved && onRemove && (
            <button className="btn-small btn-danger" onClick={() => onRemove(cocktail.id)}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
