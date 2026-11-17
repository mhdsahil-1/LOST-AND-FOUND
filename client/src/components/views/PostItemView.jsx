import React, { useState } from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import SegmentedControl from '../common/SegmentedControl';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';

export const PostItemView = () => {
  const { addItem, user, setCurrentTab } = useApp();

  const [itemType, setItemType] = useState('lost');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [contact, setContact] = useState(user.email || '');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeOptions = [
    { id: 'lost', label: 'I Lost an Item', icon: 'fa-solid fa-circle-question' },
    { id: 'found', label: 'I Found an Item', icon: 'fa-solid fa-hand-holding-heart' }
  ];

  const campusLocations = [
    'Central Library',
    'Main Canteen',
    'Science Complex',
    'Student Union',
    'Sports Gym',
    'Peace Park',
    'Turing Hall Lab'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image must be under 5MB.' }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors((prev) => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Please provide description details';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!date) newErrors.date = 'Date is required';
    if (!contact.trim()) newErrors.contact = 'Contact information is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await addItem({
        item_type: itemType,
        category_id: categoryId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date_lost_found: date,
        contact: contact.trim(),
        image: imagePreview
      }, imageFile);
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
      setCurrentTab('my-posts');
    }
  };

  return (
    <div className="ios-view-container post-view">
      <header className="ios-navigation-header">
        <h1 className="ios-large-title">Report Item</h1>
        <p className="header-subtitle">
          Submit details about a misplaced or discovered object on campus.
        </p>
      </header>

      <form className="ios-post-form" onSubmit={handleSubmit}>
        {/* Type Selection */}
        <div className="form-section">
          <label className="section-label">Report Type</label>
          <SegmentedControl 
            options={typeOptions}
            value={itemType}
            onChange={setItemType}
          />
        </div>

        {/* Photo Upload Zone */}
        <div className="form-section">
          <label className="section-label">Item Photo (Optional)</label>
          {imagePreview ? (
            <div className="image-preview-card">
              <img src={imagePreview} alt="Item upload preview" className="preview-img" />
              <button 
                type="button" 
                className="remove-img-btn"
                onClick={handleRemoveImage}
                title="Remove photo"
              >
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </button>
            </div>
          ) : (
            <label className="photo-upload-dropzone">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="file-input-hidden"
              />
              <div className="upload-prompt">
                <div className="camera-icon-bubble">
                  <FontAwesomeIcon icon="fa-solid fa-camera" size="lg" />
                </div>
                <span className="upload-main-text">Take Photo or Choose from Library</span>
                <span className="upload-sub-text">PNG, JPG, HEIC up to 5MB</span>
              </div>
            </label>
          )}
          {errors.image && <span className="field-error">{errors.image}</span>}
        </div>

        {/* Title */}
        <div className="form-section">
          <label className="section-label">Item Title *</label>
          <div className="ios-field-wrapper">
            <input 
              type="text" 
              className={`ios-field-input ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Space Gray MacBook Air, Blue Water Bottle"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
            />
          </div>
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        {/* Category Selection */}
        <div className="form-section">
          <label className="section-label">Category *</label>
          <div className="category-select-grid">
            {CATEGORIES.map((cat) => {
              const isSelected = String(categoryId) === String(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-select-tile ${isSelected ? 'tile-active' : ''}`}
                  onClick={() => setCategoryId(cat.id)}
                >
                  <FontAwesomeIcon 
                    icon={cat.icon} 
                    className="tile-icon"
                    style={{ color: isSelected ? '#FFFFFF' : cat.color }} 
                  />
                  <span className="tile-name">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <label className="section-label">Detailed Description *</label>
          <div className="ios-field-wrapper textarea-field">
            <textarea 
              className={`ios-field-input ${errors.description ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="Color, brand, identifying marks, serial numbers, case style, contents..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
            />
          </div>
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        {/* Location & Quick Presets */}
        <div className="form-section">
          <label className="section-label">Location Where Lost/Found *</label>
          <div className="ios-field-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-location-dot" className="field-leading-icon" />
            <input 
              type="text" 
              className={`ios-field-input with-leading-icon ${errors.location ? 'is-invalid' : ''}`}
              placeholder="e.g. Library 3rd Floor Pods, Science Room 204"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
              }}
            />
          </div>
          {errors.location && <span className="field-error">{errors.location}</span>}

          {/* Quick campus presets */}
          <div className="location-presets">
            {campusLocations.map((loc) => (
              <button
                key={loc}
                type="button"
                className="preset-chip"
                onClick={() => setLocation(loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="form-section">
          <label className="section-label">Date Lost / Found *</label>
          <div className="ios-field-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-calendar" className="field-leading-icon" />
            <input 
              type="date" 
              className={`ios-field-input with-leading-icon ${errors.date ? 'is-invalid' : ''}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="form-section">
          <label className="section-label">Your Contact Email or Phone *</label>
          <div className="ios-field-wrapper">
            <FontAwesomeIcon icon="fa-solid fa-envelope" className="field-leading-icon" />
            <input 
              type="text" 
              className={`ios-field-input with-leading-icon ${errors.contact ? 'is-invalid' : ''}`}
              placeholder="student.email@campus.edu or +1 555-0199"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          {errors.contact && <span className="field-error">{errors.contact}</span>}
          <span className="field-hint">
            Posted as <strong style={{ color: 'var(--ios-label)' }}>{user.name}</strong>
          </span>
        </div>

        {/* Submit Button */}
        <div className="form-submit-row">
          <button 
            type="submit" 
            className="ios-button ios-button-primary submit-btn"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
          </button>
        </div>
      </form>

      <div className="view-bottom-spacer" />
    </div>
  );
};

export default PostItemView;
