import React from 'react';
import { 
  ShieldCheck, Lock, ArrowLeft, ArrowRight, ChevronRight, 
  CheckCircle2, HardDrive, EyeOff, ServerOff, Cpu, RefreshCw, FileText 
} from 'lucide-react';

export default function PrivacyPolicyPage({ onBackToHome, onGoToTerms }) {
  return (
    <article className="policy-page-wrapper" aria-labelledby="privacy-heading">
      {/* Breadcrumb Navigation Bar */}
      <nav className="tool-breadcrumbs-bar" aria-label="Breadcrumb">
        <div className="tool-breadcrumbs-container">
          <div className="breadcrumbs-list">
            <button className="breadcrumb-link" onClick={onBackToHome}>
              Home
            </button>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-category">Legal & Security</span>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">Privacy Policy</span>
          </div>

          <div className="tool-breadcrumb-actions">
            <button 
              className="btn-outline btn-sm" 
              onClick={onGoToTerms}
              title="View Terms of Use"
            >
              <FileText size={14} />
              <span>Terms of Use</span>
            </button>
            <button 
              className="btn-outline btn-sm" 
              onClick={onBackToHome}
              title="Return to full tool directory"
            >
              <ArrowLeft size={14} />
              <span>Back to Tools</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="policy-hero-header">
        <div className="policy-hero-container">
          <div className="policy-icon-wrap">
            <ShieldCheck size={38} color="#fff" />
          </div>
          <div className="policy-hero-meta">
            <div className="tool-tag private-tag" style={{ marginBottom: '0.65rem' }}>
              <ShieldCheck size={13} />
              <span>Zero Server Transmission Guarantee</span>
            </div>
            <h1 id="privacy-heading" className="policy-hero-title">
              Privacy Policy (Zero Data Collection)
            </h1>
            <p className="policy-hero-desc">
              At PINKPDF, we believe privacy is not a setting—it is our core software architecture. 
              Our suite executes 100% locally on your device with no cloud server uploads, no user tracking, and no data retention.
            </p>
            <div className="policy-timestamp">
              <span>Effective Date: October 2026</span>
              <span>•</span>
              <span>Version: 2.4 (Client-Side Standard)</span>
              <span>•</span>
              <span className="badge-verified">Verified Architecture</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="policy-content-container">
        {/* Quick Highlights Summary Cards */}
        <div className="policy-highlights-grid">
          <div className="policy-highlight-card">
            <ServerOff size={24} color="var(--pink-primary)" />
            <h4>Zero Server Uploads</h4>
            <p>Your documents never leave your physical device. No server processing occurs.</p>
          </div>
          <div className="policy-highlight-card">
            <EyeOff size={24} color="var(--pink-primary)" />
            <h4>No Cookies or Tracking</h4>
            <p>We do not use advertising cookies, third-party analytics pixels, or user fingerprints.</p>
          </div>
          <div className="policy-highlight-card">
            <Cpu size={24} color="var(--pink-primary)" />
            <h4>Volatile In-Memory Sandbox</h4>
            <p>Processing happens in local RAM and is immediately purged upon closing the tab.</p>
          </div>
        </div>

        {/* Detailed Legal Clauses */}
        <div className="policy-clauses-wrapper">
          <section className="policy-clause-section">
            <h2 className="clause-title">1. Introduction & Foundational Philosophy</h2>
            <p>
              PINKPDF Suite (&quot;PINKPDF&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) provides high-performance client-side PDF manipulation tools. Unlike traditional online document conversion websites that upload your files to remote third-party cloud servers, PINKPDF is built on a strict <strong>Zero-Transmission Architecture</strong>.
            </p>
            <p>
              This policy explains in concrete, verifiable technical detail how your data is handled when you interact with any of our 33+ web tools.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">2. Information We Do NOT Collect</h2>
            <p>
              By virtue of our technical design, we do not have the technological capability or infrastructure to observe, collect, intercept, or store:
            </p>
            <ul className="policy-bullet-list">
              <li>
                <strong>Document Contents:</strong> Text, images, financial data, medical records, legal clauses, signatures, or vector elements contained within your uploaded PDF, Word, Excel, PowerPoint, or image files.
              </li>
              <li>
                <strong>File Metadata:</strong> Document authors, creation timestamps, filenames, or embedded revision logs.
              </li>
              <li>
                <strong>Personally Identifiable Information (PII):</strong> We do not require account registration, passwords, email addresses, credit cards, or physical addresses.
              </li>
              <li>
                <strong>Network IP Logging:</strong> Web server requests for static HTML/JS assets do not log or associate user IP addresses with document tasks.
              </li>
            </ul>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">3. How Browser Memory & WebAssembly Operate</h2>
            <p>
              When you select or drag a document into any PINKPDF tool:
            </p>
            <ol className="policy-numbered-list">
              <li>
                The file is read by your browser into a local JavaScript <code>ArrayBuffer</code> residing exclusively within your device&apos;s volatile Random Access Memory (RAM).
              </li>
              <li>
                Compiled WebAssembly (WASM) modules (such as WebAssembly crypto libraries, Tesseract OCR, and PDF-Lib) parse and transform the document using your device&apos;s CPU and GPU.
              </li>
              <li>
                The final document is rendered into an in-memory <code>Blob</code> object and downloaded directly to your local file system.
              </li>
              <li>
                When you refresh, navigate away from, or close the browser tab, the browser runtime automatically deallocates all memory buffers. Nothing is left behind on any server.
              </li>
            </ol>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">4. Local Storage & Offline Cache</h2>
            <p>
              PINKPDF may utilize local browser caching mechanisms solely to enhance your user experience:
            </p>
            <ul className="policy-bullet-list">
              <li>
                <strong>Local Application Cache (Service Workers):</strong> Code binaries (JavaScript, CSS, WebAssembly modules) are stored in your browser cache to enable 100% offline functionality.
              </li>
              <li>
                <strong>User Preferences:</strong> Your preferred theme mode (Dark or Light) is stored in your browser&apos;s local <code>localStorage</code>.
              </li>
              <li>
                <strong>Optional iOS Studio Hub:</strong> If you use the PDF Marker &amp; Studio local document organizer, saved creations remain entirely within your browser&apos;s client-side <code>IndexedDB</code>. We have zero remote access to this local database.
              </li>
            </ul>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">5. Third-Party Services & Analytics</h2>
            <p>
              We do not embed third-party surveillance scripts, cross-site trackers, Facebook Pixels, or invasive behavioral tracking tools. Fonts are served via standard CDN endpoints with no tracking payloads, and all document processing code is served statically.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">6. Regulatory Alignment (GDPR, HIPAA &amp; CCPA by Design)</h2>
            <p>
              Because PINKPDF never ingests, stores, processes, or transmits personal data to external servers:
            </p>
            <ul className="policy-bullet-list">
              <li>
                <strong>GDPR (European Union):</strong> We act neither as a Data Controller nor as a Data Processor for your documents, as no processing happens on our servers.
              </li>
              <li>
                <strong>HIPAA (Healthcare):</strong> Healthcare professionals can sanitize, redact, and merge patient records without violating HIPAA data transmission regulations, as files never leave the local terminal.
              </li>
              <li>
                <strong>CCPA / CPRA (California):</strong> We do not sell, rent, or share personal information under any circumstances.
              </li>
            </ul>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">7. Contact & Verification</h2>
            <p>
              Our client-side processing can be independently verified at any time using your browser&apos;s built-in Developer Tools (Network Tab). You can observe that during document upload, merging, compression, and editing, zero HTTP POST/PUT requests with document payloads are dispatched.
            </p>
            <p>
              For security inquiries or questions regarding this Privacy Policy, please consult our documentation or contact the development team through our official repository.
            </p>
          </section>
        </div>

        {/* Bottom Navigation Box */}
        <div className="policy-footer-nav">
          <div>
            <h3>Review Our Terms of Use</h3>
            <p>Learn about software licensing, acceptable use, and our client-side terms.</p>
          </div>
          <button className="btn-primary" onClick={onGoToTerms}>
            <span>View Terms of Use</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
