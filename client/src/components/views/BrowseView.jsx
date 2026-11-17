import React from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import ItemCard from '../items/ItemCard';
import EmptyState from '../common/EmptyState';
import SegmentedControl from '../common/SegmentedControl';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';

export const BrowseView = () => {
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setIsFilterSheetOpen,
    setCurrentTab
  } = useApp();

  const typeSegments = [
    { id: 'all', label: 'All Items' },
    { id: 'lost', label: 'Lost' },
    { id: 'found', label: 'Found' }
  ];

  const hasActiveFilters = filterCategory !== 'all' || filterStatus !== 'all';

  return (
    <div className="ios-view-container browse-view">
      {/* Top Bar Header */}
      <div className="browse-top-bar">
        <div>
          <h1 className="ios-large-title">Browse</h1>
          <p className="browse-subhead">Campus listings feed</p>
        </div>

        <button 
          type="button" 
          className={`filter-icon-button ${hasActiveFilters ? 'has-active-filters' : ''}`}
          onClick={() => setIsFilterSheetOpen(true)}
          aria-label="Open Filters"
        >
          <FontAwesomeIcon icon="fa-solid fa-sliders" />
          {hasActiveFilters && <span className="filter-active-dot" />}
        </button>
      </div>

      {/* iOS Search Bar */}
      <div className="ios-search-bar-row">
        <div className="ios-search-input-box">
          <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="search-box-icon" />
          <input 
            type="text" 
            className="search-box-input"
            placeholder="Search items, tags, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>
      </div>

      {/* Segmented Control: All / Lost / Found */}
      <div className="browse-segmented-wrap">
        <SegmentedControl 
          options={typeSegments}
          value={filterType}
          onChange={setFilterType}
        />
      </div>

      {/* Categories horizontal chip scroll */}
      <div className="browse-categories-chips">
        <button
          type="button"
          className={`chip-button ${filterCategory === 'all' ? 'chip-selected' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          <span>All</span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = String(filterCategory) === String(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              className={`chip-button ${isSelected ? 'chip-selected' : ''}`}
              onClick={() => setFilterCategory(isSelected ? 'all' : cat.id)}
            >
              <FontAwesomeIcon icon={cat.icon} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Result Meta & Feed */}
      <div className="browse-feed-meta">
        <span className="results-count">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </span>

        {hasActiveFilters && (
          <button 
            type="button" 
            className="clear-filters-link"
            onClick={() => {
              setFilterCategory('all');
              setSearchQuery('');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Items Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="items-cards-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="fa-solid fa-magnifying-glass-location"
          title="No Matching Items"
          description={
            searchQuery 
              ? `No items found matching "${searchQuery}". Try different keywords or reset filters.`
              : 'There are currently no items under this category or filter.'
          }
          actionLabel="Report This Item"
          onAction={() => setCurrentTab('post')}
        />
      )}

      <div className="view-bottom-spacer" />
    </div>
  );
};

export default BrowseView;
