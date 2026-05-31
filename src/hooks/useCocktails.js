import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cocktail_collection';

export function useCocktails() {
  const [collection, setCollection] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  const saveCocktail = (cocktail) => {
    setCollection(prev => {
      const exists = prev.find(c => c.id === cocktail.id);
      if (exists) {
        return prev.map(c => c.id === cocktail.id ? { ...c, ...cocktail } : c);
      }
      return [{ ...cocktail, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const updateRating = (id, rating) => {
    setCollection(prev => prev.map(c => c.id === id ? { ...c, rating } : c));
  };

  const updateNotes = (id, notes) => {
    setCollection(prev => prev.map(c => c.id === id ? { ...c, notes } : c));
  };

  const removeCocktail = (id) => {
    setCollection(prev => prev.filter(c => c.id !== id));
  };

  const getRandomCocktail = (minRating = 0, typeFilter = 'all') => {
    const filtered = collection.filter(c => {
      const ratingOk = !minRating || (c.rating || 0) >= minRating;
      const typeOk = typeFilter === 'all' || c.type === typeFilter;
      return ratingOk && typeOk;
    });
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const isInCollection = (id) => collection.some(c => c.id === id);

  return { collection, saveCocktail, updateRating, updateNotes, removeCocktail, getRandomCocktail, isInCollection };
}
