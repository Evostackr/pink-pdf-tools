import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Search, Moon, Sun, Sparkles, ArrowRight, X, 
  Menu, ChevronDown, ShieldCheck, Zap, HelpCircle, Layers, Smartphone, Activity
} from 'lucide-react';
import { PDF_TOOLS, TOOL_CATEGORIES } from '../tools/registry';
import ToolIcon from './ToolIcon';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  isDarkMode, 
  setIsDarkMode, 
  onSelectSampleTool,
  onGoHome,
  onSelectTool,
  onGoToSeoStudio,
  isIosMode,
  onToggleIosMode
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Filter tools for instant dropdown
  const query = searchQuery.trim().toLowerCase();
  const matchingTools = query 
    ? PDF_TOOLS.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.desc.toLowerCase().includes(query) ||
        t.categoryTitle.toLowerCase().includes(query)
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (tool) => {
    setShowDropdown(false);
    setShowCategoryMenu(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
    if (onSelectTool) {
      onSelectTool(tool);
    }
  };

  const handleNavAnchor = (e, hash) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setShowCategoryMenu(false);
    if (window.location.pathname !== '/') {
      onGoHome();
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="header-container">
        {/* Brand Logo */}
        <a 
          href="/" 
          className="brand-logo" 
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onGoHome();
            }
          }}
          title="Return to PinkPDF Home"
          style={{ textDecoration: 'none' }}
        >
          <div className="logo-icon-wrap">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-name">
            PINK<span>PDF</span>
          </div>
          <span className="brand-badge">PRO SUITE</span>
        </a>

        {/* Primary Desktop Navigation Links */}
        <nav className="header-nav-links" aria-label="Main Navigation">
          <div className="nav-item-dropdown-wrap" ref={categoryMenuRef}>
            <button 
              className="nav-link-btn"
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              aria-expanded={showCategoryMenu}
            >
              <span>Tools</span>
              <ChevronDown size={14} className={showCategoryMenu ? 'rotate-180' : ''} />
            </button>

            {/* Categories Dropdown Menu */}
            {showCategoryMenu && (
              <div className="nav-dropdown-menu">
                <div className="nav-dropdown-header">33 CLIENT-SIDE TOOLS</div>
                <div className="nav-dropdown-grid">
                  {TOOL_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                    const catTools = PDF_TOOLS.filter(t => t.category === cat.id).slice(0, 4);
                    return (
                      <div key={cat.id} className="nav-dropdown-group">
                        <div className="nav-dropdown-group-title">{cat.name}</div>
                        {catTools.map(t => (
                          <div 
                            key={t.id} 
                            className="nav-dropdown-item" 
                            onClick={() => handleToolClick(t)}
                          >
                            <ToolIcon name={t.icon} size={15} />
                            <span>{t.name}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <a href="#how-it-works" className="nav-link-item" onClick={(e) => handleNavAnchor(e, '#how-it-works')}>
            How It Works
          </a>
          <a href="#security" className="nav-link-item" onClick={(e) => handleNavAnchor(e, '#security')}>
            Security
          </a>
          <a href="#faq" className="nav-link-item" onClick={(e) => handleNavAnchor(e, '#faq')}>
            FAQ
          </a>
        </nav>

        {/* Search Bar with live autocomplete */}
        <div className="header-center" ref={searchContainerRef} style={{ position: 'relative' }}>
          <div className="search-bar">
            <Search size={18} color="var(--pink-primary)" />
            <input 
              type="text" 
              placeholder="Search 33+ tools (e.g. merge, compress, sign)..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              aria-label="Search all PDF tools"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Instant Search Dropdown */}
          {showDropdown && matchingTools.length > 0 && (
            <div className="search-dropdown-popup">
              <div className="search-dropdown-header">
                MATCHING TOOLS ({matchingTools.length})
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {matchingTools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className="search-dropdown-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="search-item-icon">
                        <ToolIcon name={tool.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{tool.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.categoryTitle}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--pink-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <span>Open Page</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions & Utilities */}
        <div className="header-actions">
          <button 
            className="btn-outline try-sample-btn" 
            onClick={onSelectSampleTool}
            title="Try with an auto-generated sample document"
          >
            <Sparkles size={16} color="var(--pink-primary)" />
            <span>Try Sample</span>
          </button>

          <button 
            className="btn-outline" 
            onClick={onGoToSeoStudio}
            title="SEO, AEO, GEO & AI Search Intelligence Studio"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Activity size={15} color="var(--pink-primary)" />
            <span>SEO Studio</span>
          </button>

          <button 
            className="icon-btn theme-toggle-btn" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button 
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); onGoHome(); setMobileMenuOpen(false); }}>
              Home
            </a>
            <a href="#how-it-works" onClick={(e) => handleNavAnchor(e, '#how-it-works')}>
              How It Works
            </a>
            <a href="#security" onClick={(e) => handleNavAnchor(e, '#security')}>
              Security & Privacy
            </a>
            <a href="#faq" onClick={(e) => handleNavAnchor(e, '#faq')}>
              FAQ
            </a>
          </div>

          <div className="mobile-categories-section">
            <div className="mobile-section-title">Popular Tools</div>
            <div className="mobile-tools-grid">
              {PDF_TOOLS.slice(0, 8).map(t => (
                <div key={t.id} className="mobile-tool-chip" onClick={() => handleToolClick(t)}>
                  <ToolIcon name={t.icon} size={14} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
