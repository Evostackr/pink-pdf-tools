import React from 'react';
import { 
  FileText, ShieldCheck, Zap, Lock, Heart, ExternalLink, 
  ChevronRight, Sparkles, CheckCircle2, HelpCircle, Bot, Map
} from 'lucide-react';
import { PDF_TOOLS, TOOL_CATEGORIES } from '../tools/registry';

export default function Footer({ onSelectTool, onGoHome, onGoToPrivacy, onGoToTerms, onGoToSeoStudio }) {
  const currentYear = new Date().getFullYear();

  // Organize tools for structured footer columns
  const organizeTools = PDF_TOOLS.filter(t => t.category === 'organize').slice(0, 5);
  const optimizeTools = PDF_TOOLS.filter(t => t.category === 'optimize');
  const convertTools = PDF_TOOLS.filter(t => t.category === 'convert-to' || t.category === 'convert-from').slice(0, 6);
  const editAndSecurityTools = PDF_TOOLS.filter(t => t.category === 'edit' || t.category === 'security').slice(0, 6);

  const handleToolLink = (e, tool) => {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onSelectTool(tool);
    }
  };

  const handleNavAnchor = (e, hash) => {
    e.preventDefault();
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

  const handlePrivacyClick = (e) => {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onGoToPrivacy();
    }
  };

  const handleTermsClick = (e) => {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onGoToTerms();
    }
  };

  return (
    <footer className="enhanced-app-footer" role="contentinfo" aria-label="Site Footer">
      {/* Top Banner: Local Engine Guarantee */}
      <div className="footer-trust-banner">
        <div className="footer-container trust-banner-content">
          <div className="trust-pill">
            <ShieldCheck size={18} color="var(--pink-primary)" aria-hidden="true" />
            <span>100% In-Browser WebAssembly Engine • Zero Cloud Server Uploads</span>
          </div>
          <div className="trust-badges">
            <span className="badge-item"><Zap size={14} aria-hidden="true" /> GPU Accelerated</span>
            <span className="badge-item"><Lock size={14} aria-hidden="true" /> Memory Isolated</span>
            <span className="badge-item"><Sparkles size={14} aria-hidden="true" /> Unlimited & Free</span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="footer-container footer-main-grid">
        {/* Col 1: Brand & Mission */}
        <div className="footer-col brand-col">
          <div className="brand-logo" onClick={onGoHome} style={{ cursor: 'pointer', marginBottom: '1rem' }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onGoHome(); }}>
            <div className="logo-icon-wrap" aria-hidden="true">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <div className="brand-name">
              PINK<span>PDF</span>
            </div>
            <span className="brand-badge">PRO SUITE</span>
          </div>
          <p className="footer-bio">
            The next-generation client-side PDF workspace created by <strong>Evostackr</strong>. Edit, merge, compress, protect, 
            and convert documents entirely inside your browser with maximum privacy and native CPU/GPU execution.
          </p>
          <div className="footer-engine-badge">
            <span className="engine-dot" aria-hidden="true"></span>
            <span>Local Engine: <strong>Active & Private</strong></span>
          </div>
        </div>

        {/* Col 2: Organize & Optimize */}
        <div className="footer-col">
          <h4 className="footer-heading">Organize & Optimize</h4>
          <ul className="footer-links">
            {organizeTools.map(tool => (
              <li key={tool.id}>
                <a href={`/${tool.id}`} onClick={(e) => handleToolLink(e, tool)}>
                  {tool.name}
                </a>
              </li>
            ))}
            {optimizeTools.map(tool => (
              <li key={tool.id}>
                <a href={`/${tool.id}`} onClick={(e) => handleToolLink(e, tool)}>
                  {tool.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Convert Documents */}
        <div className="footer-col">
          <h4 className="footer-heading">Convert Documents</h4>
          <ul className="footer-links">
            {convertTools.map(tool => (
              <li key={tool.id}>
                <a href={`/${tool.id}`} onClick={(e) => handleToolLink(e, tool)}>
                  {tool.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Edit & Security */}
        <div className="footer-col">
          <h4 className="footer-heading">Edit & Security</h4>
          <ul className="footer-links">
            {editAndSecurityTools.map(tool => (
              <li key={tool.id}>
                <a href={`/${tool.id}`} onClick={(e) => handleToolLink(e, tool)}>
                  {tool.name}
                </a>
              </li>
            ))}
            <li>
              <a href="/ios-editor" onClick={(e) => { e.preventDefault(); onSelectTool({ id: 'ios-editor', name: 'iOS Studio', categoryTitle: 'iOS PDF Editor Studio', desc: 'Apple PencilKit-style PDF editing studio' }); }}>
                PDF Marker & Studio (iOS)
              </a>
            </li>
          </ul>
        </div>

        {/* Col 5: Resources, AI & Trust */}
        <div className="footer-col">
          <h4 className="footer-heading">Resources & Trust</h4>
          <ul className="footer-links">
            <li>
              <a href="#how-it-works" onClick={(e) => handleNavAnchor(e, '#how-it-works')}>
                How It Works (WASM)
              </a>
            </li>
            <li>
              <a href="#security" onClick={(e) => handleNavAnchor(e, '#security')}>
                Security Architecture
              </a>
            </li>
            <li>
              <a href="#faq" onClick={(e) => handleNavAnchor(e, '#faq')}>
                Frequently Asked Questions
              </a>
            </li>
            <li>
              <a href="/privacy" onClick={handlePrivacyClick}>
                Privacy Policy (Zero Data)
              </a>
            </li>
            <li>
              <a href="/terms" onClick={handleTermsClick}>
                Terms of Use
              </a>
            </li>
            <li>
              <a href="/seo-studio" onClick={(e) => { e.preventDefault(); if (onGoToSeoStudio) onGoToSeoStudio(); }}>
                SEO & AI Command Center
              </a>
            </li>
            <li>
              <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
                AI Knowledge (llms.txt)
              </a>
            </li>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                Sitemap (XML)
              </a>
            </li>
            <li>
              <a href="https://github.com/Evostackr/pink-pdf-tools" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-bar-container">
          <div className="copyright-text">
            <span>© {currentYear} PINKPDF Suite by Evostackr. Handcrafted with Hot Pink & WebAssembly. All rights reserved.</span>
          </div>

          <div className="footer-sub-links">
            <a href="/privacy" onClick={handlePrivacyClick} style={{ color: 'inherit', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" onClick={handleTermsClick} style={{ color: 'inherit', textDecoration: 'none' }}>
              Terms of Use
            </a>
            <span>•</span>
            <span>Zero Server Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
