import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ToolGrid from './components/ToolGrid';
import ToolPage from './components/ToolPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfUsePage from './components/TermsOfUsePage';
import SeoIntelligenceStudio from './components/SeoIntelligenceStudio';
import HomeSupportingContent from './components/HomeSupportingContent';
import Footer from './components/Footer';
import { PDF_TOOLS } from './tools/registry';
import { useAppRoute } from './utils/navigation';
import { Sparkles, Shield, Zap, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Routing state
  const { 
    tool, 
    isHome, 
    isNotFound, 
    isPrivacy, 
    isTerms, 
    isSeoStudio,
    toolId, 
    goToTool, 
    goToPrivacy, 
    goToTerms, 
    goToSeoStudio,
    goHome 
  } = useAppRoute();

  // Handle theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('theme-light');
    } else {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
    }
  }, [isDarkMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3800);
  };

  // Launch sample tool quickly
  const handleLaunchSample = () => {
    goToTool('merge-pdf');
  };

  return (
    <div className="app-root">
      {/* Universal Header with Navigation & Live Search */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onSelectSampleTool={handleLaunchSample}
        onGoHome={goHome}
        onSelectTool={(t) => goToTool(t)}
        onGoToSeoStudio={goToSeoStudio}
      />

      {/* Main Routed Content Area */}
      <main id="main-content">
        {isPrivacy ? (
          // Dedicated Full Page: Privacy Policy (Zero Data)
          <PrivacyPolicyPage 
            onBackToHome={goHome} 
            onGoToTerms={goToTerms} 
          />
        ) : isTerms ? (
          // Dedicated Full Page: Terms of Use
          <TermsOfUsePage 
            onBackToHome={goHome} 
            onGoToPrivacy={goToPrivacy} 
          />
        ) : isSeoStudio ? (
          // Dedicated Full Page: SEO, AEO, GEO & AI Search Command Center
          <SeoIntelligenceStudio
            onBackToHome={goHome}
            onSelectTool={(t) => goToTool(t)}
            showToast={showToast}
          />
        ) : tool ? (
          // Dedicated Page for the Active Tool (including PDF Marker & Studio)
          <ToolPage 
            tool={tool}
            onBackToHome={goHome}
            onSelectTool={(t) => goToTool(t)}
            showToast={showToast}
          />
        ) : isNotFound ? (
          // 404 Tool Not Found Page
          <div className="not-found-container">
            <div className="not-found-icon">
              <AlertCircle size={40} />
            </div>
            <h1 className="not-found-title">Page Not Found</h1>
            <p className="not-found-desc">
              We couldn't find a page or PDF tool matching <code>"/{toolId}"</code>. Explore our complete directory of 33+ client-side tools below.
            </p>
            <button className="btn-primary" onClick={goHome} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 3rem' }}>
              <ArrowLeft size={18} />
              <span>Back to All Tools</span>
            </button>

            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                Popular PDF Tools:
              </h3>
              <div className="related-tools-grid">
                {PDF_TOOLS.slice(0, 4).map(popTool => (
                  <div 
                    key={popTool.id} 
                    className="related-tool-card" 
                    onClick={() => goToTool(popTool)}
                  >
                    <div className="related-card-top">
                      <span className="tool-badge">{popTool.categoryTitle}</span>
                    </div>
                    <h4 className="related-card-title">{popTool.name}</h4>
                    <p className="related-card-desc">{popTool.desc}</p>
                    <div className="related-card-action">
                      <span>Open Page</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Complete Home Landing Page with Hero, Tabs, Grid, and Supporting SEO Content
          <>
            <section className="hero-section">
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Next-Gen In-Browser PDF Suite</span>
              </div>
              <h1 className="hero-title">
                Every PDF Tool You Need. <br />
                <span className="gradient-text">100% Private. Free. In-Browser.</span>
              </h1>
              <p className="hero-desc">
                Organize, convert, edit, sign, redact, and optimize your PDF files locally on your machine.
                No server uploads. No file size limits. Pure client-side speed.
              </p>

              {/* Category Filter Pills */}
              <CategoryNav 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </section>

            {/* Complete 33+ Tools Grid with Dedicated Page Links */}
            <ToolGrid 
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onSelectTool={(selected) => goToTool(selected)}
            />

            {/* Feature Highlights Banner */}
            <section style={{ maxWidth: 1200, margin: '2rem auto 2rem', padding: '0 1.5rem' }}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--pink-soft)', color: 'var(--pink-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Zero Server Uploads</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All 33+ tools run strictly inside your browser WebAssembly engine. Your files never touch external servers.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--pink-soft)', color: 'var(--pink-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Instant Native Speed</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Processed directly by your GPU and CPU. No queue times, no waiting for slow cloud servers.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--pink-soft)', color: 'var(--pink-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Lock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>End-to-End Security</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Features military-grade PDF protection, permanent irreversible blackout redaction, and digital signing.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SEO, AEO & GEO Supporting Content (Architecture, Comparison, Security, FAQ) */}
            <HomeSupportingContent onSelectSampleTool={handleLaunchSample} />
          </>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice" role="alert">
          <CheckCircle2 size={18} color="var(--pink-primary)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Enhanced Multi-Column Professional Footer */}
      <Footer 
        onSelectTool={(t) => goToTool(t)}
        onGoHome={goHome}
        onGoToPrivacy={goToPrivacy}
        onGoToTerms={goToTerms}
        onGoToSeoStudio={goToSeoStudio}
      />
    </div>
  );
}
