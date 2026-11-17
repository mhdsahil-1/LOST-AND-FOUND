import React from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';
import { useApp } from '../../context/AppContext';

export const ToastAlert = () => {
  const { islandAlert } = useApp();

  if (!islandAlert) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast-card toast-${islandAlert.type || 'info'}`}>
        <div className="toast-icon-wrap">
          <FontAwesomeIcon icon={islandAlert.icon || 'fa-solid fa-bell'} />
        </div>
        <div className="toast-body">
          <strong className="toast-title">{islandAlert.title}</strong>
          {islandAlert.subtitle && (
            <span className="toast-subtitle">{islandAlert.subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToastAlert;
