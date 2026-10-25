import React from 'react';
import { TOOL_CATEGORIES } from '../tools/registry';

export default function CategoryNav({ activeCategory, setActiveCategory }) {
  return (
    <nav className="category-tabs" aria-label="Tool Categories">
      {TOOL_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            className={`category-tab ${isActive ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.name}</span>
            <span className="tab-badge">{cat.count}</span>
          </button>
        );
      })}
    </nav>
  );
}
