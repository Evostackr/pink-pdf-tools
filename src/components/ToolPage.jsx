import React from 'react';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, Zap, Lock, Sparkles, 
  CheckCircle2, HelpCircle, ChevronRight, Share2, FileCheck, Info
} from 'lucide-react';
import ToolIcon from './ToolIcon';
import WorkspaceModal from './WorkspaceModal';
import { PDF_TOOLS } from '../tools/registry';
import { TOOL_ONBOARDING_DATA } from '../data/toolOnboarding';

export default function ToolPage({ tool, onBackToHome, onSelectTool, showToast }) {
  // Find related tools (same category first, excluding current tool)
  const relatedTools = PDF_TOOLS
    .filter(t => t.id !== tool.id && t.category === tool.category)
    .slice(0, 4);

  // If not enough in same category, supplement with popular tools
  if (relatedTools.length < 4) {
    const popularExtras = PDF_TOOLS
      .filter(t => t.id !== tool.id && !relatedTools.some(r => r.id === t.id))
      .slice(0, 4 - relatedTools.length);
    relatedTools.push(...popularExtras);
  }

  // Get onboarding steps for "How to use" section
  const onboarding = TOOL_ONBOARDING_DATA[tool.id] || {
    title: `${tool.name} Guide`,
    tagline: tool.desc,
    steps: [
      {
        stepNumber: 1,
        title: 'Select or Drop Files',
        desc: `Choose your document to process with ${tool.name}.`,
        actionTip: 'No file size limit. Processed locally in your browser.',
        expectedOutput: 'Document loaded in studio'
      },
      {
        stepNumber: 2,
        title: 'Customize Settings',
        desc: 'Adjust tool parameters, page orders, or output options in the right sidebar.',
        actionTip: 'Changes reflect in real-time.',
        expectedOutput: 'Options configured'
      },
      {
        stepNumber: 3,
        title: 'Apply & Download',
        desc: 'Click the process button to generate and instantly download your document.',
        actionTip: 'Your file remains 100% private and never touches cloud servers.',
        expectedOutput: 'Clean processed document downloaded'
      }
    ]
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tool page link copied to clipboard!');
    }
  };

  return (
    <div className="tool-page-wrapper">
      {/* Breadcrumb Navigation Bar */}
      <nav className="tool-breadcrumbs-bar">
        <div className="tool-breadcrumbs-container">
          <div className="breadcrumbs-list">
            <button className="breadcrumb-link" onClick={onBackToHome}>
              Home
            </button>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-category">{tool.categoryTitle}</span>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{tool.name}</span>
          </div>

          <div className="tool-breadcrumb-actions">
            <button 
              className="btn-outline btn-sm" 
              onClick={handleShare}
              title="Copy direct link to this tool"
            >
              <Share2 size={14} />
              <span>Share Tool</span>
            </button>
            <button 
              className="btn-outline btn-sm" 
              onClick={onBackToHome}
              title="Return to full tool directory"
            >
              <ArrowLeft size={14} />
              <span>All 33 Tools</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tool Page Hero Header */}
      <section className="tool-page-hero">
        <div className="tool-page-hero-container">
          <div className="tool-hero-top">
            <div className="tool-hero-icon-wrap">
              <ToolIcon name={tool.icon} size={36} />
            </div>
            <div className="tool-hero-meta">
              <div className="tool-hero-tags">
                <span className="tool-tag category-tag">{tool.categoryTitle}</span>
                {tool.badge && <span className="tool-tag badge-tag">{tool.badge}</span>}
                <span className="tool-tag private-tag">
                  <ShieldCheck size={13} />
                  <span>100% Client-Side</span>
                </span>
              </div>
              <h1 className="tool-hero-title">{tool.name}</h1>
              <p className="tool-hero-desc">{tool.desc}</p>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="tool-hero-props">
            <div className="hero-prop-item">
              <ShieldCheck size={18} color="var(--pink-primary)" />
              <div>
                <strong>Zero Server Upload</strong>
                <span>Files never leave your machine</span>
              </div>
            </div>
            <div className="hero-prop-item">
              <Zap size={18} color="var(--pink-primary)" />
              <div>
                <strong>Native WASM Speed</strong>
                <span>No queue times or cloud lag</span>
              </div>
            </div>
            <div className="hero-prop-item">
              <Lock size={18} color="var(--pink-primary)" />
              <div>
                <strong>Private & Free</strong>
                <span>No account required, no file limits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool Workspace */}
      <section className="tool-workspace-section">
        <div className="tool-workspace-wrapper">
          <WorkspaceModal 
            tool={tool}
            onClose={onBackToHome}
            showToast={showToast}
            isStandalonePage={true}
          />
        </div>
      </section>

      {/* How to Use Section (Step-by-Step Guide) */}
      <section className="tool-guide-section">
        <div className="tool-guide-container">
          <div className="section-header-center">
            <span className="section-eyebrow">STEP-BY-STEP INSTRUCTIONS</span>
            <h2 className="section-heading">How to use {tool.name}</h2>
            <p className="section-subheading">
              Follow these simple steps to process your document in seconds right inside your browser.
            </p>
          </div>

          <div className="tool-steps-grid">
            {onboarding.steps.map((step, idx) => (
              <div key={idx} className="tool-step-card">
                <div className="step-card-header">
                  <span className="step-number-badge">Step {step.stepNumber || idx + 1}</span>
                  <div className="step-icon-wrap">
                    <CheckCircle2 size={18} color="var(--pink-primary)" />
                  </div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {step.actionTip && (
                  <div className="step-tip-box">
                    <Info size={14} color="var(--pink-primary)" />
                    <span>{step.actionTip}</span>
                  </div>
                )}
                {step.expectedOutput && (
                  <div className="step-output-box">
                    <FileCheck size={14} color="#38bdf8" />
                    <span>Output: <code>{step.expectedOutput}</code></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Quality Guarantee Section */}
      <section className="tool-guarantee-section">
        <div className="tool-guarantee-container">
          <div className="guarantee-card">
            <div className="guarantee-icon-box">
              <ShieldCheck size={32} color="var(--pink-primary)" />
            </div>
            <div className="guarantee-text">
              <h3>Security & Privacy First Guarantee</h3>
              <p>
                Unlike traditional PDF websites that upload your confidential files to remote cloud servers, 
                <strong> PINKPDF executes 100% of the document processing directly inside your browser</strong> using 
                WebAssembly and client-side JavaScript. Your sensitive documents, invoices, contracts, and images 
                are never uploaded, never saved, and never viewed by anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="tool-related-section">
        <div className="tool-related-container">
          <div className="related-section-header">
            <div>
              <span className="section-eyebrow">EXPLORE MORE TOOLS</span>
              <h2 className="section-heading">More Tools You Might Need</h2>
            </div>
            <button className="btn-outline" onClick={onBackToHome}>
              <span>View All 33 Tools</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="related-tools-grid">
            {relatedTools.map(relTool => (
              <div 
                key={relTool.id} 
                className="related-tool-card"
                onClick={() => onSelectTool(relTool)}
              >
                <div className="related-card-top">
                  <div className="related-card-icon">
                    <ToolIcon name={relTool.icon} size={20} />
                  </div>
                  <span className="tool-badge">{relTool.categoryTitle}</span>
                </div>
                <h4 className="related-card-title">{relTool.name}</h4>
                <p className="related-card-desc">{relTool.desc}</p>
                <div className="related-card-action">
                  <span>Open Tool</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
