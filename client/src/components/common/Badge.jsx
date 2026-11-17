import React from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';

export const Badge = ({ 
  type, // 'lost', 'found', 'status', 'category', 'custom'
  value, 
  icon, 
  color, 
  bg, 
  size = 'md',
  className = '' 
}) => {
  let badgeClass = 'ios-badge';
  let displayIcon = icon;
  let text = value;

  if (type === 'lost') {
    badgeClass += ' badge-lost';
    displayIcon = displayIcon || 'fa-solid fa-circle-question';
    text = text || 'Lost';
  } else if (type === 'found') {
    badgeClass += ' badge-found';
    displayIcon = displayIcon || 'fa-solid fa-hand-holding-heart';
    text = text || 'Found';
  } else if (type === 'status') {
    const s = (value || '').toLowerCase();
    if (s === 'open') {
      badgeClass += ' badge-status-open';
      displayIcon = displayIcon || 'fa-solid fa-circle-dot';
      text = 'Open';
    } else if (s === 'pending') {
      badgeClass += ' badge-status-pending';
      displayIcon = displayIcon || 'fa-solid fa-clock';
      text = 'Pending Review';
    } else if (s === 'claimed') {
      badgeClass += ' badge-status-claimed';
      displayIcon = displayIcon || 'fa-solid fa-handshake';
      text = 'Claimed';
    } else if (s === 'returned') {
      badgeClass += ' badge-status-returned';
      displayIcon = displayIcon || 'fa-solid fa-circle-check';
      text = 'Returned';
    }
  }

  const customStyle = {};
  if (color) customStyle.color = color;
  if (bg) customStyle.backgroundColor = bg;

  return (
    <span 
      className={`${badgeClass} badge-${size} ${className}`}
      style={customStyle}
    >
      {displayIcon && (
        <FontAwesomeIcon icon={displayIcon} className="badge-icon" />
      )}
      <span className="badge-text">{text}</span>
    </span>
  );
};

export default Badge;
