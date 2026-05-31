import React, { useState } from 'react';
import './App.css';
import { useCocktails } from './hooks/useCocktails';
import Generator from './components/Generator';
import Collection from './components/Collection';
import BarEntry from './components/BarEntry';
import Randomizer from './components/Randomizer';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const cocktailState = useCocktails();

  const tabs = [
    { id: 'generator', label: 'Generate', icon: '🍹' },
    { id: 'collection', label: 'Collection', icon: '⭐', badge: cocktailState.collection.length },
    { id: 'bar', label: 'Bar Log', icon: '🍸' },
    { id: 'randomizer', label: 'Randomizer', icon: '🎲' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Cocktail Lab</h1>
        <p className="app-subtitle">Discover, rate & rediscover</p>
      </header>

      <nav className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'generator' && <Generator {...cocktailState} />}
        {activeTab === 'collection' && <Collection {...cocktailState} />}
        {activeTab === 'bar' && <BarEntry {...cocktailState} />}
        {activeTab === 'randomizer' && <Randomizer {...cocktailState} />}
      </main>
    </div>
  );
}

export default App;
