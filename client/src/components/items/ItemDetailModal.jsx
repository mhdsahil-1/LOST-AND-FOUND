import React, { useState } from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import Badge from '../common/Badge';
import ModalSheet from '../common/ModalSheet';
import { getCategoryById } from '../../data/categories';
import { getImageUrl } from '../../utils/imageUrl';
import { useApp } from '../../context/AppContext';

export const ItemDetailModal = () => {
  const { 
    selectedItem, 
    setSelectedItem, 
    setClaimItemTarget, 
    markAsReturned, 
    deleteItem, 
    user,
    triggerIslandAlert 
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedItem) return null;

  const category = getCategoryById(selectedItem.category_id);
  const imageUrl = getImageUrl(selectedItem.image);
  const isOwner = selectedItem.posted_by === user.name;
  const isAdmin = user.role === 'admin';
  const canManage = isOwner || isAdmin;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    triggerIslandAlert({
      title: 'Link Copied',
      subtitle: 'Post reference copied to clipboard',
      icon: 'fa-solid fa-link',
      type: 'info'
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenClaim = () => {
    setClaimItemTarget(selectedItem);
  };

  return (
    <ModalSheet
      isOpen={!!selectedItem}
      onClose={() => setSelectedItem(null)}
      title="Item Details"
      subtitle={selectedItem.item_type === 'lost' ? 'Reported Lost' : 'Reported Found'}
    >
      <div className="ios-detail-container">
        {/* Large Media Preview */}
        {imageUrl ? (
          <div className="ios-detail-media">
            <img 
              src={imageUrl} 
              alt={selectedItem.title} 
              className="detail-large-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div 
              className="detail-placeholder"
              style={{ 
                backgroundColor: category.bgLight, 
                color: category.color,
                display: 'none'
              }}
            >
              <FontAwesomeIcon icon={category.icon} size="3x" />
            </div>
          </div>
        ) : (
          <div 
            className="detail-placeholder"
            style={{ 
              backgroundColor: category.bgLight, 
              color: category.color 
            }}
          >
            <FontAwesomeIcon icon={category.icon} size="3x" />
          </div>
        )}

        {/* Badges Strip */}
        <div className="detail-badges-row">
          <Badge type={selectedItem.item_type} size="md" />
          <Badge type="status" value={selectedItem.status} size="md" />
          <span className="category-chip" style={{ color: category.color, borderColor: category.color }}>
            <FontAwesomeIcon icon={category.icon} />
            <span>{category.name}</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="detail-title">{selectedItem.title}</h1>

        {/* Description Section */}
        <div className="detail-section">
          <h4 className="detail-section-title">Description</h4>
          <p className="detail-description-text">{selectedItem.description}</p>
        </div>

        {/* iOS Grouped List (Settings Style) */}
        <div className="ios-grouped-list">
          <div className="grouped-list-item">
            <div className="item-leading-icon" style={{ backgroundColor: '#007AFF' }}>
              <FontAwesomeIcon icon="fa-solid fa-location-dot" />
            </div>
            <div className="item-label-group">
              <span className="item-label">Location</span>
              <span className="item-subtext">{selectedItem.location}</span>
            </div>
          </div>

          <div className="grouped-list-item">
            <div className="item-leading-icon" style={{ backgroundColor: '#FF9500' }}>
              <FontAwesomeIcon icon="fa-solid fa-calendar-days" />
            </div>
            <div className="item-label-group">
              <span className="item-label">Date Lost/Found</span>
              <span className="item-subtext">{selectedItem.date_lost_found}</span>
            </div>
          </div>

          <div className="grouped-list-item">
            <div className="item-leading-icon" style={{ backgroundColor: '#5856D6' }}>
              <FontAwesomeIcon icon="fa-solid fa-user" />
            </div>
            <div className="item-label-group">
              <span className="item-label">Posted By</span>
              <span className="item-subtext">{selectedItem.posted_by}</span>
            </div>
          </div>

          <div className="grouped-list-item">
            <div className="item-leading-icon" style={{ backgroundColor: '#34C759' }}>
              <FontAwesomeIcon icon="fa-solid fa-envelope" />
            </div>
            <div className="item-label-group">
              <span className="item-label">Contact</span>
              <span className="item-subtext contact-link">
                <a href={`mailto:${selectedItem.contact}`}>{selectedItem.contact}</a>
              </span>
            </div>
          </div>

          {selectedItem.status === 'claimed' && (
            <div className="grouped-list-item highlight-claim">
              <div className="item-leading-icon" style={{ backgroundColor: '#FF2D55' }}>
                <FontAwesomeIcon icon="fa-solid fa-handshake" />
              </div>
              <div className="item-label-group">
                <span className="item-label">Claimed By {selectedItem.claimed_by || 'User'}</span>
                <span className="item-subtext">
                  Note: {selectedItem.claim_note || 'Ownership verification initiated.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="detail-action-stack">
          {selectedItem.status === 'open' && (
            <button 
              type="button" 
              className="ios-button ios-button-primary"
              onClick={handleOpenClaim}
            >
              <FontAwesomeIcon icon="fa-solid fa-hand-holding-hand" />
              <span>Claim This Item</span>
            </button>
          )}

          <div className="detail-secondary-actions">
            <a 
              href={`mailto:${selectedItem.contact}?subject=Lost%20and%20Found:%20${encodeURIComponent(selectedItem.title)}`}
              className="ios-button ios-button-secondary"
            >
              <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
              <span>Email Poster</span>
            </a>

            <button 
              type="button" 
              className="ios-button ios-button-secondary"
              onClick={handleCopyLink}
            >
              <FontAwesomeIcon icon={copiedLink ? "fa-solid fa-check" : "fa-solid fa-share-nodes"} />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Management Actions for Owner / Admin */}
          {canManage && (
            <div className="detail-management-box">
              <h5 className="management-heading">Post Management</h5>
              <div className="management-btn-row">
                {selectedItem.status !== 'returned' && (
                  <button 
                    type="button" 
                    className="ios-button ios-button-success"
                    onClick={() => markAsReturned(selectedItem.id)}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-circle-check" />
                    <span>Mark as Returned</span>
                  </button>
                )}

                <button 
                  type="button" 
                  className="ios-button ios-button-destructive"
                  onClick={() => deleteItem(selectedItem.id)}
                >
                  <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                  <span>Delete Post</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalSheet>
  );
};

export default ItemDetailModal;
