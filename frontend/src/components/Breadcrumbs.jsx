import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <button
        onClick={() => items[0]?.onClick?.()}
        className="crumb-link"
        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
      >
        <Home size={14} />
        <span>Home</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={13} style={{ color: 'var(--text-light)' }} />
          {item.onClick ? (
            <button onClick={item.onClick} className="crumb-link">
              {item.label}
            </button>
          ) : (
            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
