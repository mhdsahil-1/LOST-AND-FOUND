import React from 'react';
import FontAwesomeIcon from '../common/FontAwesomeIcon';
import Badge from '../common/Badge';
import { getCategoryById } from '../../data/categories';
import { getImageUrl } from '../../utils/imageUrl';
import { useApp } from '../../context/AppContext';

export const ItemCard = ({ item, onClick }) => {
  const { setSelectedItem } = useApp();
  const category = getCategoryById(item.category_id);
  const imageUrl = getImageUrl(item.image);

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <article className="ios-item-card" onClick={handleClick}>
      {/* Media / Image area */}
      <div className="item-card-media">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={item.title} 
            className="item-card-img"
            loading="lazy"
            onError={(e) => {
              // Graceful fallback to category icon if image fails to load
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}

        {/* Fallback Icon Thumbnail */}
        <div 
          className="item-card-placeholder" 
          style={{ 
            backgroundColor: category.bgLight, 
            color: category.color,
            display: imageUrl ? 'none' : 'flex'
          }}
        >
          <FontAwesomeIcon icon={category.icon} size="2x" />
        </div>

        {/* Top Badges overlay */}
        <div className="item-card-badges">
          <Badge type={item.item_type} size="sm" />
          <Badge type="status" value={item.status} size="sm" />
        </div>
      </div>

      {/* Card Content Area */}
      <div className="item-card-body">
        {/* Category tag */}
        <div className="item-category-tag" style={{ color: category.color }}>
          <FontAwesomeIcon icon={category.icon} className="tag-icon" />
          <span>{category.name}</span>
        </div>

        {/* Item Title */}
        <h3 className="item-card-title">{item.title}</h3>

        {/* Metadata items: Location & Date */}
        <div className="item-card-meta">
          <div className="meta-row">
            <FontAwesomeIcon icon="fa-solid fa-location-dot" className="meta-icon" />
            <span className="meta-text">{item.location}</span>
          </div>

          <div className="meta-row">
            <FontAwesomeIcon icon="fa-solid fa-calendar-days" className="meta-icon" />
            <span className="meta-text">{item.date_lost_found}</span>
          </div>
        </div>

        {/* Poster info / Chevron */}
        <div className="item-card-footer">
          <span className="poster-name">
            <FontAwesomeIcon icon="fa-regular fa-user" className="footer-icon" />
            {item.posted_by}
          </span>
          <FontAwesomeIcon icon="fa-solid fa-chevron-right" className="card-chevron" />
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
