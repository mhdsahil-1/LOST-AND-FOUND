import React from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import { useApp } from '../../context/AppContext';

export const Navbar = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    user, 
    stats, 
    theme, 
    toggleTheme, 
    setIsAuthModalOpen,
    resetData 
  } = useApp();

  const navItems = [
    { id: 'explore', label: 'Explore', icon: 'fa-solid fa-compass' },
    { id: 'browse', label: 'Browse', icon: 'fa-solid fa-magnifying-glass' },
    { id: 'post', label: 'Report Item', icon: 'fa-solid fa-circle-plus', isAction: true },
    { id: 'my-posts', label: 'My Items', icon: 'fa-solid fa-clock-rotate-left' },
    { 
      id: 'admin', 
      label: 'Admin Hub', 
      icon: 'fa-solid fa-shield-halved',
      badge: stats.pending > 0 ? stats.pending : null 
    }
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Left: Brand */}
        <div className="site-brand" onClick={() => setCurrentTab('explore')}>
          <div className="brand-logo-bubble">
            <FontAwesomeIcon icon="fa-solid fa-compass" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">Lost & Found</span>
            <span className="brand-subtitle">Campus Network</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${isActive ? 'is-active' : ''} ${item.isAction ? 'nav-action' : ''}`}
                onClick={() => setCurrentTab(item.id)}
              >
                <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User / Theme Controls */}
        <div className="header-actions">
          {/* Identity / Login Pill */}
          <button
            type="button"
            className="user-pill-btn"
            onClick={() => setIsAuthModalOpen(true)}
            title="Manage Identity or Sign In"
          >
            <FontAwesomeIcon 
              icon={user.role === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-user-graduate'} 
              className={user.role === 'admin' ? 'icon-admin' : 'icon-student'}
            />
            <span className="user-pill-name">{user.name.split(' ')[0]}</span>
            <span className={`user-role-micro ${user.role === 'admin' ? 'role-admin' : 'role-student'}`}>
              {user.role === 'admin' ? 'Admin' : 'Student'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="header-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
          </button>

          {/* Reset Demo Data */}
          <button
            type="button"
            className="header-icon-btn reset-btn"
            onClick={resetData}
            title="Reset to default demo data"
            aria-label="Reset demo data"
          >
            <FontAwesomeIcon icon="fa-solid fa-rotate-left" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Works perfectly on mobile devices) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-tab-btn ${isActive ? 'is-active' : ''} ${item.isAction ? 'is-action' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <div className="mobile-tab-icon-wrap">
                <FontAwesomeIcon icon={item.icon} />
                {item.badge && (
                  <span className="mobile-tab-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-tab-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
