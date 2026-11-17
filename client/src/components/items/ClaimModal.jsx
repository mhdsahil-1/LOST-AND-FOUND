import React, { useState } from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import ModalSheet from '../common/ModalSheet';
import { useApp } from '../../context/AppContext';

export const ClaimModal = () => {
  const { claimItemTarget, setClaimItemTarget, claimItem, user } = useApp();
  
  const [claimantName, setClaimantName] = useState(user.name || '');
  const [claimantEmail, setClaimantEmail] = useState(user.email || '');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!claimItemTarget) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proofNote.trim()) {
      setError('Please provide proof or identifying details for this item.');
      return;
    }

    setIsSubmitting(true);
    claimItem(claimItemTarget.id, {
      name: claimantName,
      contact: claimantEmail + (claimantPhone ? ` / ${claimantPhone}` : ''),
      note: proofNote
    });

    setIsSubmitting(false);
    setClaimItemTarget(null);
  };

  return (
    <ModalSheet
      isOpen={!!claimItemTarget}
      onClose={() => setClaimItemTarget(null)}
      title="Claim Item"
      subtitle={claimItemTarget.title}
    >
      <form className="ios-form-container" onSubmit={handleSubmit}>
        <div className="ios-form-notice">
          <FontAwesomeIcon icon="fa-solid fa-shield-halved" className="notice-icon" />
          <p>
            To prevent false claims, please describe identifying details (e.g., serial number, wallpaper, stickers, scratches, or unique contents).
          </p>
        </div>

        {error && (
          <div className="ios-form-error">
            <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <div className="ios-input-group">
          <label className="ios-label">Your Full Name</label>
          <div className="ios-input-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-user" className="input-icon" />
            <input 
              type="text" 
              className="ios-input"
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="ios-input-group">
          <label className="ios-label">Campus Email</label>
          <div className="ios-input-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-envelope" className="input-icon" />
            <input 
              type="email" 
              className="ios-input"
              value={claimantEmail}
              onChange={(e) => setClaimantEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="ios-input-group">
          <label className="ios-label">Phone Number (Optional)</label>
          <div className="ios-input-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-phone" className="input-icon" />
            <input 
              type="tel" 
              className="ios-input"
              placeholder="+1 (555) 000-0000"
              value={claimantPhone}
              onChange={(e) => setClaimantPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="ios-input-group">
          <label className="ios-label">Proof of Ownership / Details</label>
          <div className="ios-input-wrapper textarea-wrapper">
            <textarea 
              className="ios-textarea"
              rows="4"
              placeholder="e.g. Can unlock with PIN, contains specific books, red keychain attached, invoice available..."
              value={proofNote}
              onChange={(e) => {
                setProofNote(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>
        </div>

        <div className="ios-form-actions">
          <button 
            type="submit" 
            className="ios-button ios-button-primary"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Claim'}</span>
          </button>

          <button 
            type="button" 
            className="ios-button ios-button-secondary"
            onClick={() => setClaimItemTarget(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalSheet>
  );
};

export default ClaimModal;
