import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Lock, Cpu, ServerOff, HardDrive, CheckCircle2, 
  ChevronDown, HelpCircle, ArrowRight, ShieldAlert, Award, FileText, Check, X
} from 'lucide-react';

export default function HomeSupportingContent({ onSelectSampleTool }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: "Are my files ever uploaded to any server or cloud storage?",
      a: "No. Never. All 33+ tools in the PINKPDF Suite execute strictly inside your web browser using WebAssembly (WASM) and client-side JavaScript. Your files are processed in local volatile RAM and are never transmitted across the network to external servers, cloud databases, or third-party APIs."
    },
    {
      q: "How does in-browser PDF processing work without a backend server?",
      a: "Modern web browsers are capable of running near-native compiled code. PINKPDF uses compiled WebAssembly modules (such as Tesseract OCR and WebAssembly cryptography) alongside client-side engines like PDF-Lib. Your computer's CPU and GPU do the heavy lifting locally on your device."
    },
    {
      q: "Is there any limit on file size or the number of PDF conversions?",
      a: "Because there is no remote cloud server incurring bandwidth or compute costs on our end, we do not impose any artificial file size limits, conversion quotas, or paywalled cooldown timers. Processing speed depends entirely on your local hardware specifications."
    },
    {
      q: "Can I use PINKPDF offline without an internet connection?",
      a: "Yes. Once the web application is loaded in your browser cache, the WebAssembly and JavaScript binaries are cached locally. You can disconnect from Wi-Fi or work in airplane mode, and tools like Merge, Split, Protect, Compress, and Watermark will continue functioning seamlessly."
    },
    {
      q: "How secure is password encryption and redaction on PINKPDF?",
      a: "Our PDF protection utilizes industry-standard AES-256 Rev 5 encryption, compliant with ISO 32000 specifications. Furthermore, our Redact tool performs irreversible vector blackout redaction—permanently scrubbing underlying vector text, metadata, and pixel buffers to guarantee zero data leakage."
    },
    {
      q: "What happens to my documents when I close the browser tab?",
      a: "When you close or reload the browser tab, the browser automatically releases the allocated memory and garbage-collects all file buffers. No temporary files or document traces remain on any server."
    },
    {
      q: "Which file formats can be converted to and from PDF?",
      a: "You can convert JPG, PNG, WebP, Microsoft Word (.docx), Microsoft PowerPoint (.pptx), Microsoft Excel (.xlsx), CSV, and raw HTML into PDF. Conversely, you can extract PDFs into high-resolution JPG archives, Word documents, PowerPoint presentations, Excel tables, and ISO-compliant PDF/A archives."
    },
    {
      q: "Is PINKPDF really 100% free with no hidden subscriptions?",
      a: "Yes. All web tools in the suite are completely free, with no account registration required, no credit cards, and no watermark stamps forced onto your output documents."
    }
  ];

  return (
    <div className="home-supporting-content">
      {/* 1. HOW IT WORKS / TECHNICAL ARCHITECTURE SECTION */}
      <section className="supporting-section" id="how-it-works" aria-labelledby="heading-how-it-works">
        <div className="supporting-container">
          <div className="section-header-center">
            <span className="section-eyebrow">CLIENT-SIDE ARCHITECTURE</span>
            <h2 id="heading-how-it-works" className="section-heading">How Client-Side PDF Processing Works</h2>
            <p className="section-subheading">
              Unlike traditional PDF converter websites that upload your confidential files to remote servers,
              PINKPDF executes 100% of the document pipeline locally on your machine.
            </p>
          </div>

          <div className="architecture-grid">
            <div className="arch-card">
              <div className="arch-icon-box">
                <HardDrive size={26} color="var(--pink-primary)" />
              </div>
              <div className="arch-step-badge">STEP 1</div>
              <h3 className="arch-title">Local In-Memory Ingestion</h3>
              <p className="arch-desc">
                When you drag & drop a PDF, the file is read into your browser's private JavaScript <code>ArrayBuffer</code> memory. 
                No network requests or upload packets are dispatched.
              </p>
            </div>

            <div className="arch-card">
              <div className="arch-icon-box">
                <Cpu size={26} color="var(--pink-primary)" />
              </div>
              <div className="arch-step-badge">STEP 2</div>
              <h3 className="arch-title">WebAssembly & GPU Execution</h3>
              <p className="arch-desc">
                Our WASM parsing engine traverses the PDF cross-reference table, rasterizes vectors with Web Workers, 
                and executes cryptography directly on your local CPU without queue delays.
              </p>
            </div>

            <div className="arch-card">
              <div className="arch-icon-box">
                <ServerOff size={26} color="var(--pink-primary)" />
              </div>
              <div className="arch-step-badge">STEP 3</div>
              <h3 className="arch-title">Instant Blob Download</h3>
              <p className="arch-desc">
                The transformed document is converted into an in-memory <code>Blob</code> and downloaded straight to your disk. 
                Closing the tab purges all data buffers immediately from memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPARISON TABLE: PINKPDF VS TRADITIONAL CLOUD CONVERTERS */}
      <section className="supporting-section comparison-section" id="comparison" aria-labelledby="heading-comparison">
        <div className="supporting-container">
          <div className="section-header-center">
            <span className="section-eyebrow">WHY CLIENT-SIDE MATTERS</span>
            <h2 id="heading-comparison" className="section-heading">PINKPDF vs Traditional Cloud PDF Websites</h2>
            <p className="section-subheading">
              A transparent look at the security, speed, and privacy differences between in-browser execution and cloud-hosted tools.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature / Guarantee</th>
                  <th className="highlight-col">PINKPDF Suite (In-Browser)</th>
                  <th>Cloud PDF Services (iLovePDF, Smallpdf, etc.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>File Uploads to Remote Cloud</strong></td>
                  <td className="highlight-col text-success"><CheckCircle2 size={16} /> <strong>Zero Uploads</strong> (100% Local)</td>
                  <td className="text-danger"><X size={16} /> Uploaded to remote third-party servers</td>
                </tr>
                <tr>
                  <td><strong>Document Privacy & Confidentiality</strong></td>
                  <td className="highlight-col text-success"><CheckCircle2 size={16} /> Absolute (Files never leave your machine)</td>
                  <td className="text-warning">Subject to cloud host privacy policies & breaches</td>
                </tr>
                <tr>
                  <td><strong>Processing Speed</strong></td>
                  <td className="highlight-col text-success"><CheckCircle2 size={16} /> Instant native CPU/WASM speed</td>
                  <td>Delayed by internet upload and server queues</td>
                </tr>
                <tr>
                  <td><strong>File Size Limits</strong></td>
                  <td className="highlight-col text-success"><CheckCircle2 size={16} /> No artificial upload caps</td>
                  <td className="text-danger"><X size={16} /> Capped at 15MB - 50MB on free tiers</td>
                </tr>
                <tr>
                  <td><strong>Offline Capability</strong></td>
                  <td className="highlight-col text-success"><CheckCircle2 size={16} /> Works completely offline in cached browser</td>
                  <td className="text-danger"><X size={16} /> Fails without active internet connection</td>
                </tr>
                <tr>
                  <td><strong>Subscription Paywalls & Daily Limits</strong></td>
                  <td className="highlight-col text-success"><CheckCircle2 size={16} /> Unlimited free conversions forever</td>
                  <td className="text-danger"><X size={16} /> Limited to 2-3 free tasks per hour/day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. SECURITY & PRIVACY ARCHITECTURE DEEP DIVE */}
      <section className="supporting-section security-section" id="security" aria-labelledby="heading-security">
        <div className="supporting-container">
          <div className="security-banner-box">
            <div className="security-banner-left">
              <div className="shield-icon-large">
                <ShieldCheck size={40} color="var(--pink-primary)" />
              </div>
              <div>
                <span className="section-eyebrow">MILITARY-GRADE SPECIFICATIONS</span>
                <h2 id="heading-security" className="section-heading" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
                  Enterprise-Grade PDF Privacy & Cryptography
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Whether you are processing healthcare records (HIPAA), confidential NDAs, tax returns, 
                  or financial statements, PINKPDF ensures your proprietary data remains strictly within your enterprise perimeter.
                </p>
              </div>
            </div>

            <div className="security-specs-grid">
              <div className="spec-item">
                <div className="spec-title">AES-256 Rev 5 Encryption</div>
                <div className="spec-desc">State-of-the-art encryption algorithms protecting password-locked documents against brute force attacks.</div>
              </div>
              <div className="spec-item">
                <div className="spec-title">Permanent Blackout Redaction</div>
                <div className="spec-desc">Unlike fake highlight boxes, our redaction engine deletes the raw text streams from the underlying PDF syntax.</div>
              </div>
              <div className="spec-item">
                <div className="spec-title">Zero Server Telemetry</div>
                <div className="spec-desc">No tracking pixels, no analytics logging document contents, and no user surveillance.</div>
              </div>
              <div className="spec-item">
                <div className="spec-title">ISO 32000 & PDF/A Archival</div>
                <div className="spec-desc">Produces standard ISO-compliant PDFs compatible with Adobe Acrobat, Apple Preview, and modern PDF readers.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AEO: FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="supporting-section faq-section" id="faq" aria-labelledby="heading-faq">
        <div className="supporting-container">
          <div className="section-header-center">
            <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2 id="heading-faq" className="section-heading">Answers to Common Questions</h2>
            <p className="section-subheading">
              Everything you need to know about how PINKPDF handles your files, privacy, and browser execution.
            </p>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                >
                  <button className="faq-question-btn" aria-expanded={isOpen}>
                    <span className="faq-question-text">{faq.q}</span>
                    <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Call to Action */}
          <div className="faq-cta-box">
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Ready to experience instant, private PDF tools?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Test our merge or compression tools right now without creating an account.</p>
            </div>
            <button className="btn-primary" onClick={onSelectSampleTool}>
              <span>Try with Sample PDF</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
