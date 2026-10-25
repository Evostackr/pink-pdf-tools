import React from 'react';
import { ArrowRight } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { PDF_TOOLS, TOOL_CATEGORIES } from '../tools/registry';

export default function ToolGrid({ activeCategory, searchQuery, onSelectTool }) {
  // Filter by search query if present
  const query = searchQuery.trim().toLowerCase();
  
  let filteredTools = PDF_TOOLS;
  if (query) {
    filteredTools = PDF_TOOLS.filter(
      tool => tool.name.toLowerCase().includes(query) ||
              tool.desc.toLowerCase().includes(query) ||
              tool.categoryTitle.toLowerCase().includes(query)
    );
  } else if (activeCategory !== 'all') {
    filteredTools = PDF_TOOLS.filter(tool => tool.category === activeCategory);
  }

  const handleCardClick = (e, tool) => {
    // If middle click, Ctrl+Click or Cmd+Click, let browser open new tab
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    onSelectTool(tool);
  };

  // If viewing all and no search query, group by categories
  if (activeCategory === 'all' && !query) {
    const categoriesWithTools = TOOL_CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
      ...cat,
      tools: PDF_TOOLS.filter(t => t.category === cat.id),
    }));

    return (
      <div className="tools-grid-container">
        {categoriesWithTools.map(group => (
          <section key={group.id} className="category-section" id={`cat-${group.id}`}>
            <div className="category-group-header">
              <h2 className="category-group-title">
                <span className="dot"></span>
                <span>{group.name}</span>
              </h2>
              <span className="tool-badge">{group.tools.length} Tools</span>
            </div>
            
            <div className="tools-grid">
              {group.tools.map(tool => (
                <a 
                  key={tool.id} 
                  href={`/${tool.id}`}
                  className="tool-card"
                  onClick={(e) => handleCardClick(e, tool)}
                  id={`tool-${tool.id}`}
                >
                  <div className="tool-card-top">
                    <div className="tool-card-icon">
                      <ToolIcon name={tool.icon} size={22} />
                    </div>
                    {tool.badge && <span className="tool-badge">{tool.badge}</span>}
                  </div>
                  <h3 className="tool-card-title">{tool.name}</h3>
                  <p className="tool-card-desc">{tool.desc}</p>
                  <div className="tool-card-footer">
                    <span>Open Tool Page</span>
                    <ArrowRight size={16} className="tool-card-arrow" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // Filtered view
  return (
    <div className="tools-grid-container">
      {filteredTools.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No tools found matching "{searchQuery}"</p>
          <p style={{ fontSize: '0.9rem' }}>Try searching for merge, split, compress, watermark, ocr, or sign.</p>
        </div>
      ) : (
        <div className="tools-grid" style={{ marginTop: '2rem' }}>
          {filteredTools.map(tool => (
            <a 
              key={tool.id} 
              href={`/${tool.id}`}
              className="tool-card"
              onClick={(e) => handleCardClick(e, tool)}
              id={`tool-${tool.id}`}
            >
              <div className="tool-card-top">
                <div className="tool-card-icon">
                  <ToolIcon name={tool.icon} size={22} />
                </div>
                {tool.badge ? (
                  <span className="tool-badge">{tool.badge}</span>
                ) : (
                  <span className="tool-badge">{tool.categoryTitle}</span>
                )}
              </div>
              <h3 className="tool-card-title">{tool.name}</h3>
              <p className="tool-card-desc">{tool.desc}</p>
              <div className="tool-card-footer">
                <span>Open Tool Page</span>
                <ArrowRight size={16} className="tool-card-arrow" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
