import React, { useState } from 'react';

export default function StarRating({ rating, onRate, size = 'md', readonly = false }) {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 18, md: 26, lg: 34 };
  const px = sizes[size] || 26;
  const display = hovered || rating || 0;

  return (
    <div className="star-rating" style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: px,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= display ? '#c9a84c' : '#2e2318',
            transition: 'color 0.1s, transform 0.1s',
            transform: !readonly && hovered >= star ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
            lineHeight: 1,
          }}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          title={readonly ? undefined : `Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
