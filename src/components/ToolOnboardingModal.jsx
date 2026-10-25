import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Sparkles, Lightbulb, Target, 
  CheckCircle2, Shield, UploadCloud, MoveVertical, DownloadCloud,
  Scissors, FileArchive, Trash2, CheckSquare, ExternalLink,
  Layers, Move, RotateCw, Camera, Image, FileText,
  Minimize2, AlertTriangle, Wrench, ShieldCheck, FileSearch,
  Cpu, Copy, Images, Layout, Eye, Presentation,
  Maximize, FileSpreadsheet, Table, Code, Monitor,
  Sliders, Hash, Stamp, Crop, PenTool, Edit3,
  Lock, Key, Unlock, FileSignature, EyeOff, ShieldAlert,
  Columns, Languages, FileCode
} from 'lucide-react';

// Dynamic icon mapper for step walkthrough
const STEP_ICONS = {
  UploadCloud, MoveVertical, DownloadCloud, Scissors, FileArchive,
  Trash2, CheckSquare, ExternalLink, Layers, Move, RotateCw,
  Camera, Image, FileText, Minimize2, AlertTriangle, Wrench,
  ShieldCheck, FileSearch, Cpu, Copy, Images, Layout, Eye,
  Presentation, Maximize, FileSpreadsheet, Table, Code, Monitor,
  Sliders, Hash, Stamp, Crop, PenTool, Edit3, Lock, Key,
  Unlock, FileSignature, EyeOff, ShieldAlert, Columns, Languages, FileCode
};

function renderStepIcon(iconName, size = 26) {
  const IconComponent = STEP_ICONS[iconName] || Sparkles;
  return <IconComponent size={size} />;
}

export default function ToolOnboardingModal({ 
  tool, 
  onboardingData, 
  isOpen, 
  onClose 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Reset to step 0 whenever tool changes or opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      const isDismissed = localStorage.getItem(`dont_show_onboarding_${tool.id}`) === 'true';
      setDontShowAgain(isDismissed);
    }
  }, [isOpen, tool.id]);

  if (!isOpen || !onboardingData) return null;

  const totalSteps = onboardingData.steps.length;
  const activeStepData = onboardingData.steps[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem(`dont_show_onboarding_${tool.id}`, 'true');
    } else {
      localStorage.removeItem(`dont_show_onboarding_${tool.id}`);
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="onboarding-overlay" onClick={handleFinish}>
      <div 
        className="onboarding-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Top Accent Glow Bar */}
        <div className="onboarding-accent-bar" style={{ width: `${progressPercent}%` }} />

        {/* Modal Header */}
        <div className="onboarding-header">
          <div className="onboarding-title-area">
            <div className="onboarding-tool-badge">
              <Sparkles size={13} color="var(--pink-primary)" />
              <span>{tool.name} • Step-by-Step Guide</span>
            </div>
            <h2 id="onboarding-title" className="onboarding-heading">
              {onboardingData.title}
            </h2>
            <p className="onboarding-subheading">
              {onboardingData.tagline}
            </p>
          </div>

          <button 
            className="icon-btn onboarding-close-btn" 
            onClick={handleFinish} 
            title="Close Guide & Start Working"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Tabs / Progress Dots */}
        <div className="onboarding-steps-nav">
          {onboardingData.steps.map((s, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <button
                key={s.stepNumber}
                type="button"
                className={`onboarding-step-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <span className="step-pill-num">
                  {isCompleted ? <CheckCircle2 size={13} /> : `0${index + 1}`}
                </span>
                <span className="step-pill-title">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Step Content Card */}
        <div className="onboarding-card-body">
          <div className="onboarding-step-meta">
            <div className="onboarding-step-badge">
              STEP {currentStep + 1} OF {totalSteps}
            </div>
            <div className="onboarding-security-pill">
              <Shield size={12} color="#10b981" />
              <span>100% In-Browser & Private</span>
            </div>
          </div>

          <div className="onboarding-step-hero">
            <div className="onboarding-icon-wrapper">
              {renderStepIcon(activeStepData.icon, 30)}
            </div>
            <div className="onboarding-step-text">
              <h3 className="onboarding-step-title">
                {activeStepData.title}
              </h3>
              <p className="onboarding-step-desc">
                {activeStepData.desc}
              </p>
            </div>
          </div>

          {/* Action Tip Box */}
          {activeStepData.actionTip && (
            <div className="onboarding-tip-box">
              <div className="onboarding-tip-icon">
                <Lightbulb size={18} color="#f59e0b" />
              </div>
              <div>
                <strong style={{ color: '#fbbf24', fontSize: '0.85rem' }}>Pro Tip: </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {activeStepData.actionTip}
                </span>
              </div>
            </div>
          )}

          {/* Expected Output Pill */}
          {activeStepData.expectedOutput && (
            <div className="onboarding-output-box">
              <div className="onboarding-output-tag">
                <Target size={14} color="#38bdf8" />
                <span style={{ fontWeight: 600 }}>Expected Outcome:</span>
              </div>
              <span className="onboarding-output-value">
                {activeStepData.expectedOutput}
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="onboarding-footer">
          <label className="onboarding-checkbox-label">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Don't show automatically next time</span>
          </label>

          <div className="onboarding-nav-buttons">
            {currentStep > 0 ? (
              <button 
                type="button" 
                className="btn-outline"
                onClick={handlePrev}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
            ) : (
              <button 
                type="button" 
                className="btn-outline"
                onClick={handleFinish}
              >
                <span>Skip Guide</span>
              </button>
            )}

            <button 
              type="button" 
              className="btn-primary onboarding-next-btn"
              onClick={handleNext}
            >
              <span>{currentStep === totalSteps - 1 ? 'Start Using Tool 🚀' : 'Next Step'}</span>
              {currentStep < totalSteps - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
