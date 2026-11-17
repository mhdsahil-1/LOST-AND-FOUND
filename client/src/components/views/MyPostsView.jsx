import React, { useState } from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import SegmentedControl from '../common/SegmentedControl';
import { getCategoryById } from '../../data/categories';
import { useApp } from '../../context/AppContext';

export const MyPostsView = () => {
  const { 
    items, 
    user, 
    setCurrentTab, 
    setSelectedItem, 
    markAsReturned, 
    deleteItem 
  } = useApp();

  const [filterSegment, setFilterSegment] = useState('all');

  const myItems = items.filter((item) => item.posted_by === user.name);

  const displayedItems = myItems.filter((item) => {
    if (filterSegment === 'active') {
      return item.status === 'open' || item.status === 'pending';
    }
    if (filterSegment === 'resolved') {
      return item.status === 'returned' || item.status === 'claimed';
    }
    return true;
  });

  const segments = [
    { id: 'all', label: `All (${myItems.length})` },
    { id: 'active', label: 'Active' },
    { id: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="ios-view-container my-posts-view">
      <header className="ios-navigation-header">
        <h1 className="ios-large-title">My Items</h1>
        <p className="header-subtitle">
          Track, update, and resolve the reports you have submitted.
        </p>
      </header>

      {/* Segmented Filter */}
      <div className="browse-segmented-wrap">
        <SegmentedControl 
          options={segments}
          value={filterSegment}
          onChange={setFilterSegment}
        />
      </div>

      {displayedItems.length > 0 ? (
        <div className="my-posts-list">
          {displayedItems.map((item) => {
            const category = getCategoryById(item.category_id);
            return (
              <div key={item.id} className="my-post-card">
                <div 
                  className="post-card-main"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Thumbnail */}
                  <div className="my-post-thumb">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="thumb-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="thumb-fallback"
                      style={{ 
                        backgroundColor: category.bgLight, 
                        color: category.color,
                        display: item.image ? 'none' : 'flex'
                      }}
                    >
                      <FontAwesomeIcon icon={category.icon} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="my-post-info">
                    <div className="my-post-badges">
                      <Badge type={item.item_type} size="sm" />
                      <Badge type="status" value={item.status} size="sm" />
                    </div>
                    <h3 className="my-post-title">{item.title}</h3>
                    <div className="my-post-meta">
                      <span><FontAwesomeIcon icon="fa-solid fa-location-dot" /> {item.location}</span>
                      <span><FontAwesomeIcon icon="fa-solid fa-calendar" /> {item.date_lost_found}</span>
                    </div>

                    {item.status === 'claimed' && (
                      <div className="claimed-alert-pill">
                        <FontAwesomeIcon icon="fa-solid fa-bell" />
                        <span>Claim received: {item.claim_note || 'Verify ownership'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Bottom Strip */}
                <div className="my-post-actions-row">
                  <button 
                    type="button" 
                    className="post-action-btn"
                    onClick={() => setSelectedItem(item)}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-eye" />
                    <span>View Details</span>
                  </button>

                  {item.status !== 'returned' && (
                    <button 
                      type="button" 
                      className="post-action-btn action-success"
                      onClick={() => markAsReturned(item.id)}
                    >
                      <FontAwesomeIcon icon="fa-solid fa-circle-check" />
                      <span>Mark Returned</span>
                    </button>
                  )}

                  <button 
                    type="button" 
                    className="post-action-btn action-danger"
                    onClick={() => deleteItem(item.id)}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon="fa-solid fa-clipboard-list"
          title="No Reports Found"
          description={
            filterSegment !== 'all' 
              ? `You have no ${filterSegment} items reported.` 
              : 'You have not reported any lost or found items yet.'
          }
          actionLabel="Report an Item Now"
          onAction={() => setCurrentTab('post')}
        />
      )}

      <div className="view-bottom-spacer" />
    </div>
  );
};

export default MyPostsView;
