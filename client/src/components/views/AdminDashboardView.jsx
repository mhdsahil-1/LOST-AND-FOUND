import React, { useState } from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import SegmentedControl from '../common/SegmentedControl';
import { getCategoryById } from '../../data/categories';
import { useApp } from '../../context/AppContext';

export const AdminDashboardView = () => {
  const { 
    items, 
    stats, 
    user, 
    toggleUserRole, 
    verifyItem, 
    deleteItem, 
    setSelectedItem,
    updateItem,
    triggerIslandAlert
  } = useApp();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'all'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const pendingItems = items.filter((item) => item.status === 'pending');

  const filteredAllItems = items.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterType !== 'all' && item.item_type !== filterType) return false;
    return true;
  });

  const handleSetOpen = (id) => {
    updateItem(id, { status: 'open' });
    triggerIslandAlert({
      title: 'Status: Open',
      subtitle: 'Item is now published',
      icon: 'fa-solid fa-circle-dot',
      type: 'success'
    });
  };

  const handleSetReturned = (id) => {
    updateItem(id, { status: 'returned' });
    triggerIslandAlert({
      title: 'Status: Returned',
      subtitle: 'Marked as reunited with owner',
      icon: 'fa-solid fa-circle-check',
      type: 'success'
    });
  };

  const tabOptions = [
    { 
      id: 'queue', 
      label: 'Verification Queue', 
      badge: stats.pending,
      icon: 'fa-solid fa-clock' 
    },
    { 
      id: 'all', 
      label: `All Items (${items.length})`,
      icon: 'fa-solid fa-list-check' 
    }
  ];

  return (
    <div className="ios-view-container admin-view">
      <header className="ios-navigation-header">
        <div className="header-eyebrow">
          <span className="admin-status-badge">
            <FontAwesomeIcon icon="fa-solid fa-shield-halved" />
            <span>Moderator Console</span>
          </span>
          <button 
            type="button" 
            className="role-toggle-link"
            onClick={toggleUserRole}
          >
            {user.role === 'admin' ? 'Switch to Student' : 'Enable Admin'}
          </button>
        </div>
        <h1 className="ios-large-title">Admin Hub</h1>
        <p className="header-subtitle">
          Review community submissions, prevent spam, and maintain database integrity.
        </p>
      </header>

      {/* Admin Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card card-primary">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-layer-group" />
          </div>
          <div className="stat-content">
            <span className="stat-val">{stats.total}</span>
            <span className="stat-lbl">Total Items</span>
          </div>
        </div>

        <div className="admin-stat-card card-warning">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-hourglass-half" />
          </div>
          <div className="stat-content">
            <span className="stat-val">{stats.pending}</span>
            <span className="stat-lbl">Pending Review</span>
          </div>
        </div>

        <div className="admin-stat-card card-success">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-door-open" />
          </div>
          <div className="stat-content">
            <span className="stat-val">{stats.open}</span>
            <span className="stat-lbl">Active Feed</span>
          </div>
        </div>

        <div className="admin-stat-card card-info">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-handshake" />
          </div>
          <div className="stat-content">
            <span className="stat-val">{stats.returned}</span>
            <span className="stat-lbl">Reunited</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="browse-segmented-wrap">
        <SegmentedControl 
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'queue' && (
        <section className="admin-queue-section">
          {pendingItems.length > 0 ? (
            <div className="pending-queue-list">
              {pendingItems.map((item) => {
                const category = getCategoryById(item.category_id);
                return (
                  <div key={item.id} className="pending-item-card">
                    <div className="pending-card-top">
                      <div className="pending-thumb">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="queue-img" 
                          />
                        ) : (
                          <div 
                            className="queue-fallback"
                            style={{ backgroundColor: category.bgLight, color: category.color }}
                          >
                            <FontAwesomeIcon icon={category.icon} />
                          </div>
                        )}
                      </div>

                      <div className="pending-info">
                        <div className="pending-badges">
                          <Badge type={item.item_type} size="sm" />
                          <span className="category-micro-tag" style={{ color: category.color }}>
                            <FontAwesomeIcon icon={category.icon} /> {category.name}
                          </span>
                        </div>
                        <h4 className="pending-title">{item.title}</h4>
                        <p className="pending-desc">{item.description}</p>
                        <div className="pending-meta">
                          <span><FontAwesomeIcon icon="fa-solid fa-location-dot" /> {item.location}</span>
                          <span><FontAwesomeIcon icon="fa-regular fa-user" /> {item.posted_by}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pending-actions-bar">
                      <button 
                        type="button" 
                        className="queue-btn btn-reject"
                        onClick={() => verifyItem(item.id, false)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        <span>Reject</span>
                      </button>

                      <button 
                        type="button" 
                        className="queue-btn btn-approve"
                        onClick={() => verifyItem(item.id, true)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-check" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon="fa-solid fa-circle-check"
              title="All Caught Up"
              description="No submissions are currently pending verification. Good job!"
            />
          )}
        </section>
      )}

      {/* Tab 2: All Items Management (from legacy-php/admin/manage-items.php) */}
      {activeTab === 'all' && (
        <section className="admin-all-items-section">
          {/* Status & Type Quick Filter Chips */}
          <div className="admin-filter-bar">
            <div className="filter-chip-row">
              <span className="filter-row-label">Status:</span>
              {['all', 'open', 'pending', 'returned'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`admin-filter-pill ${filterStatus === st ? 'is-active' : ''}`}
                  onClick={() => setFilterStatus(st)}
                >
                  {st === 'all' ? 'All' : st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>

            <div className="filter-chip-row">
              <span className="filter-row-label">Type:</span>
              {['all', 'lost', 'found'].map((tp) => (
                <button
                  key={tp}
                  type="button"
                  className={`admin-filter-pill ${filterType === tp ? 'is-active' : ''}`}
                  onClick={() => setFilterType(tp)}
                >
                  {tp === 'all' ? 'All' : tp.charAt(0).toUpperCase() + tp.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <p className="admin-items-count-text">
            Showing <strong>{filteredAllItems.length}</strong> item(s)
          </p>

          {filteredAllItems.length > 0 ? (
            <div className="all-items-list">
              {filteredAllItems.map((item) => {
                const category = getCategoryById(item.category_id);
                return (
                  <div key={item.id} className="admin-item-row">
                    <div className="row-left" onClick={() => setSelectedItem(item)}>
                      <div className="row-thumb">
                        <FontAwesomeIcon icon={category.icon} style={{ color: category.color }} />
                      </div>
                      <div className="row-details">
                        <div className="row-title-strip">
                          <span className="row-title">{item.title}</span>
                          <Badge type="status" value={item.status} size="sm" />
                          <Badge type={item.item_type} size="sm" />
                        </div>
                        <span className="row-subtext">
                          {item.location} · {item.posted_by} · {item.date_lost_found}
                        </span>
                      </div>
                    </div>

                    <div className="row-actions">
                      {item.status !== 'open' && (
                        <button 
                          type="button" 
                          className="admin-mini-btn btn-open"
                          title="Set Status to Open"
                          onClick={() => handleSetOpen(item.id)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-envelope-open" />
                        </button>
                      )}

                      {item.status !== 'returned' && (
                        <button 
                          type="button" 
                          className="admin-mini-btn btn-returned"
                          title="Mark as Returned"
                          onClick={() => handleSetReturned(item.id)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-circle-check" />
                        </button>
                      )}

                      <button 
                        type="button" 
                        className="admin-mini-btn btn-delete"
                        title="Delete item"
                        onClick={() => deleteItem(item.id)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon="fa-solid fa-filter"
              title="No Items Found"
              description="No items match your selected status and type filters."
              actionLabel="Clear Filters"
              onAction={() => {
                setFilterStatus('all');
                setFilterType('all');
              }}
            />
          )}
        </section>
      )}

      <div className="view-bottom-spacer" />
    </div>
  );
};

export default AdminDashboardView;
