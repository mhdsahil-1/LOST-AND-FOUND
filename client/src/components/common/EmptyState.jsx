import React from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';

export const EmptyState = ({
  icon = 'fa-solid fa-box-open',
  title = 'No items found',
  description = 'Try adjusting your search query or filters.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="ios-empty-state">
      <div className="empty-state-icon-bubble">
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button 
          type="button" 
          className="ios-button ios-button-secondary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
