import React, { useState } from 'react';
import CocktailCard from './CocktailCard';

export default function Collection({ collection, updateRating, removeCocktail }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [search, setSearch] = useState('');

  const filtered = collection
    .filter(c => {
      if (filter === 'generated') return c.type === 'generated';
      if (filter === 'bar') return c.type === 'bar';
      if (filter === 'top') return (c.rating || 0) >= 4;
      return true;
    })
    .filter(c =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.barName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.savedAt) - new Date(a.savedAt);
    });

  if (collection.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🥃</div>
        <h3>Your collection is empty</h3>
        <p>Generate cocktails or log bar finds to start building your list.</p>
      </div>
    );
  }

  return (
    <div className="collection">
      <div className="collection-controls">
        <input
          className="search-input"
          placeholder="Search cocktails…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-row">
          <div className="chip-group">
            {[['all', 'All'], ['generated', 'Generated'], ['bar', 'Bar Finds'], ['top', 'Top Rated']].map(([id, label]) => (
              <button key={id} className={`chip small ${filter === id ? 'active' : ''}`}
                onClick={() => setFilter(id)}>
                {label}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="rating">Top Rated</option>
            <option value="name">A – Z</option>
          </select>
        </div>
      </div>

      <p className="collection-count">
        {filtered.length} cocktail{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No matches</h3>
          <p>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="cocktail-grid">
          {filtered.map(cocktail => (
            <CocktailCard
              key={cocktail.id}
              cocktail={cocktail}
              isSaved
              onRateUpdate={updateRating}
              onRemove={removeCocktail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
