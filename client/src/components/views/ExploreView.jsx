import React from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import ItemCard from '../items/ItemCard';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';

export const ExploreView = () => {
  const { 
    items, 
    stats, 
    user, 
    setCurrentTab, 
    setFilterType, 
    setFilterCategory,
    setIsAuthModalOpen
  } = useApp();

  const recentLost = items
    .filter((i) => i.item_type === 'lost' && i.status === 'open')
    .slice(0, 4);

  const recentFound = items
    .filter((i) => i.item_type === 'found' && i.status === 'open')
    .slice(0, 4);

  const handleCategoryClick = (catId) => {
    setFilterCategory(catId);
    setFilterType('all');
    setCurrentTab('browse');
  };

  const handleReport = (type) => {
    setFilterType(type);
    setCurrentTab('post');
  };

  return (
    <div className="ios-view-container explore-view">
      {/* iOS App Top Header */}
      <header className="ios-navigation-header">
        <div className="header-eyebrow">
          <span className="campus-badge">
            <FontAwesomeIcon icon="fa-solid fa-building-columns" />
            <span>Campus Network</span>
          </span>
          <button 
            type="button" 
            className="user-greeting-btn"
            onClick={() => setIsAuthModalOpen(true)}
            title="Switch User / Student & Admin Login"
          >
            <FontAwesomeIcon icon="fa-solid fa-circle-user" />
            <span>Hi, {user.name.split(' ')[0]}</span>
          </button>
        </div>
        <h1 className="ios-large-title">Lost & Found</h1>
        <p className="header-subtitle">
          Reuniting students and staff with misplaced belongings safely and quickly.
        </p>
      </header>

      {/* Quick Search Bar */}
      <div 
        className="ios-search-capsule" 
        onClick={() => setCurrentTab('browse')}
      >
        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="search-icon" />
        <span className="search-placeholder">Search laptops, keys, student IDs, bags...</span>
      </div>

      {/* Primary Action Buttons */}
      <div className="quick-action-cards">
        <button 
          type="button" 
          className="quick-card card-lost"
          onClick={() => handleReport('lost')}
        >
          <div className="card-icon-bubble">
            <FontAwesomeIcon icon="fa-solid fa-circle-question" />
          </div>
          <div className="card-text">
            <span className="card-label">I Lost Something</span>
            <span className="card-subtext">Post a missing item report</span>
          </div>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" className="card-arrow" />
        </button>

        <button 
          type="button" 
          className="quick-card card-found"
          onClick={() => handleReport('found')}
        >
          <div className="card-icon-bubble">
            <FontAwesomeIcon icon="fa-solid fa-hand-holding-heart" />
          </div>
          <div className="card-text">
            <span className="card-label">I Found Something</span>
            <span className="card-subtext">Help return to rightful owner</span>
          </div>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" className="card-arrow" />
        </button>
      </div>

      {/* Campus Statistics Banner */}
      <div className="ios-stat-strip">
        <div className="stat-unit" onClick={() => { setFilterType('all'); setCurrentTab('browse'); }}>
          <span className="stat-number">{stats.open}</span>
          <span className="stat-unit-label">Active Listings</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-unit" onClick={() => { setFilterType('all'); setCurrentTab('browse'); }}>
          <span className="stat-number stat-green">{stats.returned}</span>
          <span className="stat-unit-label">Reunited</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-unit" onClick={() => setCurrentTab('admin')}>
          <span className="stat-number stat-amber">{stats.pending}</span>
          <span className="stat-unit-label">In Review</span>
        </div>
      </div>

      {/* Browse by Category */}
      <section className="explore-section">
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
          <button 
            type="button" 
            className="section-link"
            onClick={() => { setFilterCategory('all'); setCurrentTab('browse'); }}
          >
            See all
          </button>
        </div>

        <div className="categories-horizontal-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="category-pill-card"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div 
                className="category-icon-box"
                style={{ backgroundColor: cat.bgLight, color: cat.color }}
              >
                <FontAwesomeIcon icon={cat.icon} size="lg" />
              </div>
              <span className="category-pill-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Lost Items */}
      {recentLost.length > 0 && (
        <section className="explore-section">
          <div className="section-header">
            <div className="title-with-badge">
              <h2 className="section-title">Recent Lost Items</h2>
              <span className="count-pill">{recentLost.length}</span>
            </div>
            <button 
              type="button" 
              className="section-link"
              onClick={() => { setFilterType('lost'); setCurrentTab('browse'); }}
            >
              View all
            </button>
          </div>

          <div className="items-cards-grid">
            {recentLost.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Found Items */}
      {recentFound.length > 0 && (
        <section className="explore-section">
          <div className="section-header">
            <div className="title-with-badge">
              <h2 className="section-title">Recent Found Items</h2>
              <span className="count-pill pill-found">{recentFound.length}</span>
            </div>
            <button 
              type="button" 
              className="section-link"
              onClick={() => { setFilterType('found'); setCurrentTab('browse'); }}
            >
              View all
            </button>
          </div>

          <div className="items-cards-grid">
            {recentFound.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom spacer for iOS Tab bar */}
      <div className="view-bottom-spacer" />
    </div>
  );
};

export default ExploreView;
