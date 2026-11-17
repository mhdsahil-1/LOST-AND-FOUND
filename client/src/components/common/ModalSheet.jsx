import React, { useEffect } from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';

export const ModalSheet = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  headerAction,
  maxHeight = '90%'
}) => {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ios-sheet-overlay" onClick={onClose}>
      <div 
        className="ios-sheet-container" 
        style={{ maxHeight }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="ios-sheet-handle-bar">
          <div className="ios-sheet-handle" />
        </div>

        {/* Sheet Header */}
        <div className="ios-sheet-header">
          <div className="ios-sheet-title-group">
            {title && <h2 className="ios-sheet-title">{title}</h2>}
            {subtitle && <p className="ios-sheet-subtitle">{subtitle}</p>}
          </div>

          <div className="ios-sheet-actions">
            {headerAction}
            <button 
              type="button" 
              className="ios-sheet-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Sheet Content */}
        <div className="ios-sheet-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalSheet;
