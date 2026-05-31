import React, { useState } from 'react';
import CocktailCard from './CocktailCard';

const SPIRITS = ['Gin', 'Vodka', 'Rum', 'Tequila', 'Mezcal', 'Whiskey', 'Bourbon', 'Scotch', 'Brandy', 'Champagne', 'Aperol', 'Campari'];

const MOODS = [
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
  { id: 'romantic', label: 'Romantic', emoji: '💕' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🌋' },
  { id: 'celebratory', label: 'Celebratory', emoji: '🥂' },
  { id: 'contemplative', label: 'Contemplative', emoji: '🌙' },
];

const TASTING_NOTES = [
  { id: 'citrusy', label: 'Citrusy', emoji: '🍋' },
  { id: 'sweet', label: 'Sweet', emoji: '🍯' },
  { id: 'bitter', label: 'Bitter', emoji: '🌿' },
  { id: 'sour', label: 'Sour', emoji: '😬' },
  { id: 'smoky', label: 'Smoky', emoji: '🔥' },
  { id: 'herbal', label: 'Herbal', emoji: '🌱' },
  { id: 'tropical', label: 'Tropical', emoji: '🌴' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
  { id: 'bubbly', label: 'Bubbly', emoji: '🫧' },
  { id: 'creamy', label: 'Creamy', emoji: '🥛' },
];

const tastingNoteKeywords = {
  citrusy: ['lemon', 'lime', 'orange', 'grapefruit', 'citrus', 'triple sec', 'cointreau', 'curacao'],
  sweet: ['grenadine', 'simple syrup', 'sugar', 'honey', 'liqueur', 'amaretto', 'schnapps', 'maraschino'],
  bitter: ['campari', 'aperol', 'bitters', 'angostura', 'amaro', 'peychaud', 'cynar'],
  sour: ['lemon juice', 'lime juice', 'sour', 'lemon', 'lime', 'citric'],
  smoky: ['mezcal', 'scotch', 'smoked', 'peated', 'islay', 'laphroaig'],
  herbal: ['vermouth', 'chartreuse', 'elderflower', 'mint', 'basil', 'cucumber', 'thyme', 'rosemary'],
  tropical: ['coconut', 'pineapple', 'mango', 'passion fruit', 'falernum', 'orgeat', 'banana', 'kiwi'],
  spicy: ['ginger', 'jalapeño', 'chili', 'pepper', 'tabasco', 'ginger beer', 'ginger ale'],
  bubbly: ['champagne', 'prosecco', 'sparkling', 'club soda', 'tonic', 'ginger beer', 'soda water'],
  creamy: ['cream', 'milk', 'baileys', 'coconut cream', 'egg', 'half and half', 'butter'],
};

const moodAlignedNotes = {
  energetic: ['citrusy', 'bubbly', 'sour'],
  relaxed: ['bitter', 'herbal', 'sweet'],
  romantic: ['bubbly', 'sweet', 'citrusy'],
  adventurous: ['smoky', 'spicy', 'herbal'],
  celebratory: ['bubbly', 'sweet', 'tropical'],
  contemplative: ['bitter', 'smoky', 'herbal'],
};

function parseIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient?.trim()) {
      ingredients.push(measure?.trim() ? `${measure.trim()} ${ingredient.trim()}` : ingredient.trim());
    }
  }
  return ingredients;
}

function scoreCocktail(drink, mood, tastingNotes) {
  const text = parseIngredients(drink).join(' ').toLowerCase();
  let score = 0;

  tastingNotes.forEach(note => {
    (tastingNoteKeywords[note] || []).forEach(kw => {
      if (text.includes(kw)) score += 3;
    });
  });

  (moodAlignedNotes[mood] || []).forEach(note => {
    (tastingNoteKeywords[note] || []).forEach(kw => {
      if (text.includes(kw)) score += 1;
    });
  });

  return score;
}

function toCocktail(drink) {
  return {
    id: `api_${drink.idDrink}`,
    name: drink.strDrink,
    thumbnail: drink.strDrinkThumb,
    ingredients: parseIngredients(drink),
    instructions: drink.strInstructions,
    category: drink.strCategory,
    glass: drink.strGlass,
    type: 'generated',
    barName: null,
    rating: null,
    notes: '',
    tags: [],
  };
}

export default function Generator({ collection, saveCocktail, updateRating, isInCollection }) {
  const [spirits, setSpirits] = useState([]);
  const [mood, setMood] = useState('');
  const [tastingNotes, setTastingNotes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggle = (list, setList, val) =>
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const generate = async () => {
    if (spirits.length === 0) {
      setError('Select at least one spirit to get started.');
      return;
    }
    setError('');
    setLoading(true);
    setResults([]);

    try {
      const idSet = new Set();
      await Promise.all(
        spirits.map(async spirit => {
          const res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(spirit)}`
          );
          const data = await res.json();
          (data.drinks || []).forEach(d => idSet.add(d.idDrink));
        })
      );

      const ids = Array.from(idSet).sort(() => Math.random() - 0.5).slice(0, 30);

      const details = await Promise.all(
        ids.map(async id => {
          const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
          const data = await res.json();
          return data.drinks?.[0] || null;
        })
      );

      const scored = details
        .filter(Boolean)
        .map(drink => ({ drink, score: scoreCocktail(drink, mood, tastingNotes) }))
        .sort((a, b) => b.score - a.score);

      setResults(scored.slice(0, 8).map(({ drink }) => toCocktail(drink)));
    } catch {
      setError('Could not reach the cocktail database. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (cocktail) => {
    saveCocktail({ ...cocktail, tags: [...spirits, ...(mood ? [mood] : []), ...tastingNotes] });
  };

  const handleRate = (id, rating) => {
    const cocktail = results.find(c => c.id === id);
    if (!cocktail) return;
    if (isInCollection(id)) {
      updateRating(id, rating);
    } else {
      saveCocktail({ ...cocktail, rating, tags: [...spirits, ...(mood ? [mood] : []), ...tastingNotes] });
    }
    setResults(prev => prev.map(c => c.id === id ? { ...c, rating } : c));
  };

  return (
    <div className="generator">
      <div className="form-section">
        <h2>What are you in the mood for?</h2>

        <div className="form-group">
          <label className="form-label">Spirits</label>
          <div className="chip-group">
            {SPIRITS.map(s => (
              <button key={s} className={`chip ${spirits.includes(s) ? 'active' : ''}`}
                onClick={() => toggle(spirits, setSpirits, s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Mood</label>
          <div className="chip-group">
            {MOODS.map(m => (
              <button key={m.id} className={`chip ${mood === m.id ? 'active' : ''}`}
                onClick={() => setMood(prev => prev === m.id ? '' : m.id)}>
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tasting notes</label>
          <div className="chip-group">
            {TASTING_NOTES.map(n => (
              <button key={n.id} className={`chip ${tastingNotes.includes(n.id) ? 'active' : ''}`}
                onClick={() => toggle(tastingNotes, setTastingNotes, n.id)}>
                {n.emoji} {n.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn-generate" onClick={generate} disabled={loading}>
          {loading ? 'Finding cocktails…' : '🍹 Generate Cocktails'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <h2>Your matches</h2>
          <div className="cocktail-grid">
            {results.map(cocktail => {
              const saved = isInCollection(cocktail.id);
              const collectionItem = saved ? collection.find(c => c.id === cocktail.id) : null;
              return (
                <CocktailCard
                  key={cocktail.id}
                  cocktail={saved ? { ...cocktail, rating: collectionItem?.rating } : cocktail}
                  isSaved={saved}
                  onSave={handleSave}
                  onRateUpdate={handleRate}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
