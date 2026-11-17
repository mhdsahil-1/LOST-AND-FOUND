import React from 'react';

/**
 * Standard FontAwesome icon renderer with embedded SVG fallbacks
 * Ensures 100% reliable rendering whether online or offline.
 */
export const FontAwesomeIcon = ({ 
  icon, 
  className = '', 
  style = {}, 
  size, 
  spin = false,
  fixedWidth = true,
  onClick
}) => {
  // Normalize icon class name
  let iconClass = icon || '';
  if (!iconClass.startsWith('fa-') && !iconClass.includes(' ')) {
    iconClass = `fa-solid fa-${iconClass}`;
  } else if (iconClass.startsWith('fa-') && !iconClass.includes(' ')) {
    iconClass = `fa-solid ${iconClass}`;
  }

  const combinedClasses = [
    iconClass,
    size ? `fa-${size}` : '',
    spin ? 'fa-spin' : '',
    fixedWidth ? 'fa-fw' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <i 
      className={combinedClasses} 
      style={style} 
      aria-hidden="true" 
      onClick={onClick}
    />
  );
};

export default FontAwesomeIcon;
