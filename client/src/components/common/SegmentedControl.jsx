import React from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';

export const SegmentedControl = ({
  options = [],
  value,
  onChange,
  className = ''
}) => {
  const activeIndex = options.findIndex((opt) => opt.id === value);

  return (
    <div className={`segmented-control ${className}`}>
      <div 
        className="segmented-pill-indicator"
        style={{
          width: `${100 / (options.length || 1)}%`,
          transform: `translateX(${(activeIndex >= 0 ? activeIndex : 0) * 100}%)`
        }}
      />

      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={`segmented-item ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.icon && (
              <FontAwesomeIcon icon={option.icon} className="segmented-icon" />
            )}
            <span className="segmented-label">{option.label}</span>
            {option.badge !== undefined && option.badge > 0 && (
              <span className="segmented-badge">{option.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
