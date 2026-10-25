import React from 'react';
import { 
  FileText, ShieldCheck, ArrowLeft, ArrowRight, ChevronRight, 
  CheckCircle2, Scale, AlertTriangle, HelpCircle, Check 
} from 'lucide-react';

export default function TermsOfUsePage({ onBackToHome, onGoToPrivacy }) {
  return (
    <article className="policy-page-wrapper" aria-labelledby="terms-heading">
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
            <span className="breadcrumb-current">Terms of Use</span>
          </div>

          <div className="tool-breadcrumb-actions">
            <button 
              className="btn-outline btn-sm" 
              onClick={onGoToPrivacy}
              title="View Privacy Policy"
            >
              <ShieldCheck size={14} />
              <span>Privacy Policy</span>
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
            <Scale size={38} color="#fff" />
          </div>
          <div className="policy-hero-meta">
            <div className="tool-tag category-tag" style={{ marginBottom: '0.65rem' }}>
              <span>Legal Agreement & Terms</span>
            </div>
            <h1 id="terms-heading" className="policy-hero-title">
              Terms of Use
            </h1>
            <p className="policy-hero-desc">
              Please read these Terms of Use carefully before using PINKPDF Suite. 
              These terms govern your access to and use of our client-side software and web applications.
            </p>
            <div className="policy-timestamp">
              <span>Effective Date: October 2026</span>
              <span>•</span>
              <span>Version: 2.4</span>
              <span>•</span>
              <span className="badge-verified">Binding Agreement</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="policy-content-container">
        {/* Quick Highlights Summary Cards */}
        <div className="policy-highlights-grid">
          <div className="policy-highlight-card">
            <CheckCircle2 size={24} color="var(--pink-primary)" />
            <h4>100% User Ownership</h4>
            <p>You retain full intellectual property rights to all documents you process.</p>
          </div>
          <div className="policy-highlight-card">
            <ShieldCheck size={24} color="var(--pink-primary)" />
            <h4>Free & Unlimited Access</h4>
            <p>Our web utilities are accessible without subscriptions, accounts, or watermarks.</p>
          </div>
          <div className="policy-highlight-card">
            <Scale size={24} color="var(--pink-primary)" />
            <h4>Fair & Responsible Use</h4>
            <p>Users must comply with copyright, authorization, and privacy laws.</p>
          </div>
        </div>

        {/* Detailed Legal Clauses */}
        <div className="policy-clauses-wrapper">
          <section className="policy-clause-section">
            <h2 className="clause-title">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using the PINKPDF Suite web application (&quot;PINKPDF&quot;, &quot;the Service&quot;, or &quot;we&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, you must discontinue your use of the Service immediately.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">2. Description of the Service</h2>
            <p>
              PINKPDF provides a suite of 33+ client-side web tools designed to organize, convert, edit, optimize, sign, protect, and analyze PDF documents. All processing is executed locally within your web browser using WebAssembly and client-side JavaScript. PINKPDF operates without requiring software installation, server accounts, or file uploads.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">3. Intellectual Property Rights &amp; Document Ownership</h2>
            <p>
              <strong>Your Documents:</strong> PINKPDF claims zero ownership, copyright, or intellectual property rights over any documents, files, images, or data you input, edit, or generate using the Service. All rights remain exclusively with you or the lawful copyright holders.
            </p>
            <p>
              <strong>The Service:</strong> The PINKPDF interface, software architecture, stylesheets, branding, visual assets, and WebAssembly compilation pipeline are the proprietary property of PINKPDF Suite and are protected by applicable intellectual property and copyright laws.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">4. User Responsibility &amp; Acceptable Use</h2>
            <p>
              Because PINKPDF runs locally on your machine with zero server oversight, you bear full responsibility for your use of the software. You agree that you will not use PINKPDF to:
            </p>
            <ul className="policy-bullet-list">
              <li>
                Decrypt, unlock, or bypass security restrictions on documents that you do not own or do not possess explicit legal authorization to access.
              </li>
              <li>
                Violate the intellectual property, copyright, trademark, or privacy rights of any third party.
              </li>
              <li>
                Process or distribute illegal, fraudulent, harmful, or defamatory materials.
              </li>
              <li>
                Attempt to inject malicious payloads into generated PDF documents or tamper with client-side cryptographic functions for fraudulent purposes.
              </li>
            </ul>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">5. Client-Side Processing Acknowledgment</h2>
            <p>
              You understand and acknowledge that all document transformations take place within your device&apos;s browser memory. Consequently:
            </p>
            <ul className="policy-bullet-list">
              <li>
                Performance and speed depend directly on your computer or mobile device&apos;s hardware specifications (CPU, RAM, GPU).
              </li>
              <li>
                Closing or refreshing your browser tab before downloading your completed file will discard the in-memory document. PINKPDF cannot restore lost unsaved progress because files are never saved to our servers.
              </li>
            </ul>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
            </p>
            <p>
              While we utilize industry-standard, ISO-compliant PDF libraries (including PDF-Lib and PDF.js), PINKPDF does not warrant that the Service will be completely error-free, uninterrupted, or that converted documents will perfectly replicate exotic proprietary formatting in all external PDF viewers.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">7. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL PINKPDF, ITS DEVELOPERS, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF, OR INABILITY TO USE, THE SERVICE OR ANY DATA LOSS OR CORRUPTION.
            </p>
            <p>
              Users are strongly advised to maintain independent backup copies of all critical original documents prior to performing editing, cropping, or redaction tasks.
            </p>
          </section>

          <section className="policy-clause-section">
            <h2 className="clause-title">8. Modifications to Service &amp; Terms</h2>
            <p>
              We reserve the right to update, modify, or enhance the Service, features, or these Terms of Use at any time. Continued use of PINKPDF following any published updates constitutes your acceptance of the revised Terms.
            </p>
          </section>
        </div>

        {/* Bottom Navigation Box */}
        <div className="policy-footer-nav">
          <div>
            <h3>Review Our Privacy Policy</h3>
            <p>Learn how our 100% client-side architecture guarantees zero data collection.</p>
          </div>
          <button className="btn-primary" onClick={onGoToPrivacy}>
            <span>View Privacy Policy</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
