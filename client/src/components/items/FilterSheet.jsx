import React from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import ModalSheet from '../common/ModalSheet';
import SegmentedControl from '../common/SegmentedControl';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';

export const FilterSheet = () => {
  const { 
    isFilterSheetOpen, 
    setIsFilterSheetOpen, 
    filterType, 
    setFilterType, 
    filterCategory, 
    setFilterCategory, 
    filterStatus, 
    setFilterStatus,
    filteredItems
  } = useApp();

  const typeOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'lost', label: 'Lost' },
    { id: 'found', label: 'Found' }
  ];

  const statusOptions = [
    { id: 'all', label: 'Any Status' },
    { id: 'open', label: 'Open' },
    { id: 'claimed', label: 'Claimed' },
    { id: 'returned', label: 'Returned' }
  ];

  const handleReset = () => {
    setFilterType('all');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  return (
    <ModalSheet
      isOpen={isFilterSheetOpen}
      onClose={() => setIsFilterSheetOpen(false)}
      title="Filter Listings"
      subtitle={`${filteredItems.length} matching items`}
      headerAction={
        <button 
          type="button" 
          className="ios-text-button"
          onClick={handleReset}
        >
          Reset
        </button>
      }
    >
      <div className="ios-filters-container">
        {/* Item Type */}
        <div className="filter-group">
          <label className="filter-group-title">Item Type</label>
          <SegmentedControl 
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
          />
        </div>

        {/* Categories */}
        <div className="filter-group">
          <label className="filter-group-title">Category</label>
          <div className="category-chips-grid">
            <button
              type="button"
              className={`filter-chip ${filterCategory === 'all' ? 'chip-active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              <FontAwesomeIcon icon="fa-solid fa-shapes" />
              <span>All Categories</span>
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = String(filterCategory) === String(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-chip ${isSelected ? 'chip-active' : ''}`}
                  style={isSelected ? { borderColor: cat.color, color: cat.color } : {}}
                  onClick={() => setFilterCategory(isSelected ? 'all' : cat.id)}
                >
                  <FontAwesomeIcon icon={cat.icon} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status */}
        <div className="filter-group">
          <label className="filter-group-title">Listing Status</label>
          <SegmentedControl 
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </div>

        {/* Apply CTA */}
        <div className="filter-cta-row">
          <button 
            type="button" 
            className="ios-button ios-button-primary"
            onClick={() => setIsFilterSheetOpen(false)}
          >
            Show {filteredItems.length} Results
          </button>
        </div>
      </div>
    </ModalSheet>
  );
};

export default FilterSheet;
