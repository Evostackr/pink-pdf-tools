import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function LegalModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className="legal-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="legal-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="legal-modal-icon">
              {activeModal === 'privacy' ? (
                <ShieldCheck size={22} color="var(--pink-primary)" />
              ) : (
                <FileText size={22} color="var(--pink-primary)" />
              )}
            </div>
            <div>
              <h3 className="legal-modal-title">
                {activeModal === 'privacy' ? 'Privacy Policy (Zero Data Collection)' : 'Terms of Use'}
              </h3>
              <div className="legal-modal-sub">
                Effective Date: October 2026 • Verified Client-Side Implementation
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="legal-modal-body">
          {activeModal === 'privacy' ? (
            <div className="legal-content-text">
              <h4>1. Core Principle: Absolute Client-Side Execution</h4>
              <p>
                PINKPDF operates on a zero-upload architecture. When you select, edit, merge, compress, or convert documents on this website, all calculations and file manipulations are performed exclusively within your browser's local sandbox using WebAssembly and client-side JavaScript.
              </p>

              <h4>2. Information We Do NOT Collect</h4>
              <p>
                We do not collect, transmit, store, or monitor:
              </p>
              <ul>
                <li>Your document filenames, text contents, images, metadata, or layout structures.</li>
                <li>Personally identifiable information (names, email addresses, phone numbers, IP logs).</li>
                <li>Tracking cookies or cross-site advertising identifiers.</li>
              </ul>

              <h4>3. Browser Local Storage & Volatile Memory</h4>
              <p>
                Files placed into the interactive workspace are kept strictly in volatile RAM. Once you close or refresh your browser tab, all allocated memory buffers are immediately purged. If you use the iOS Hub / Saved Creations feature, documents are stored solely in your device's browser IndexedDB / LocalStorage, accessible only by you on that specific browser profile.
              </p>

              <h4>4. Third-Party Sharing</h4>
              <p>
                Because no documents or user data ever leave your computer, no data is sold, rented, or shared with third parties, advertisers, or cloud hosting vendors.
              </p>
            </div>
          ) : (
            <div className="legal-content-text">
              <h4>1. Acceptance of Terms</h4>
              <p>
                By accessing and using PINKPDF, you agree to these Terms of Use. If you do not agree with any part of these terms, please discontinue use of the service.
              </p>

              <h4>2. Permitted Use & Ownership</h4>
              <p>
                PINKPDF provides client-side document processing tools for personal, educational, and commercial purposes. You retain 100% intellectual property ownership of all documents and files processed through the platform.
              </p>

              <h4>3. User Responsibility & Compliance</h4>
              <p>
                Because processing happens entirely on your machine, you are solely responsible for ensuring that you have the legal right, authorization, or license to modify, sign, decrypt, or convert the documents you input into the tools.
              </p>

              <h4>4. Disclaimer of Warranties</h4>
              <p>
                The software and services are provided "as is" without warranty of any kind, express or implied. While we employ rigorous, ISO-standard PDF engines, PINKPDF shall not be liable for any data corruption, loss, or damages resulting from the use of the tools. Users are encouraged to keep independent backup copies of important original files.
              </p>
            </div>
          )}
        </div>

        <div className="legal-modal-footer">
          <button className="btn-primary" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <span>I Understand & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
}
