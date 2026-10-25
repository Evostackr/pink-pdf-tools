import React, { useState } from 'react';
import { X, Sparkles, Edit3, Shield, ArrowRight, Check } from 'lucide-react';

const INTRO_SLIDES = [
  {
    title: 'Welcome to PDF Marker Pro',
    subtitle: 'Powerful PDF Editing, Signing & Annotation Features in your pocket.',
    badge: 'Native iOS Studio',
    icon: Sparkles,
    color: '#ff2d75',
    imageSvg: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="180" height="140" rx="12" fill="#1e1e28" stroke="#ff2d75" stroke-width="2"/>
      <rect x="50" y="45" width="140" height="12" rx="4" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="50" y="70" width="100" height="8" rx="3" fill="#ffffff" fill-opacity="0.3"/>
      <rect x="50" y="85" width="120" height="8" rx="3" fill="#ffffff" fill-opacity="0.3"/>
      <rect x="50" y="115" width="80" height="24" rx="6" fill="#ff2d75"/>
      <text x="65" y="131" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">OPEN PDF</text>
    </svg>`
  },
  {
    title: 'Powerful Editing & Markup',
    subtitle: 'Edit any document easily, highlight with fluorescent colors & place signatures on any page.',
    badge: 'PencilKit & Stickers',
    icon: Edit3,
    color: '#00e5ff',
    imageSvg: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="180" height="140" rx="12" fill="#1e1e28" stroke="#00e5ff" stroke-width="2"/>
      <rect x="50" y="45" width="120" height="18" rx="4" fill="#ffeb3b" fill-opacity="0.5"/>
      <path d="M50 54h110" stroke="#ffeb3b" stroke-width="12" stroke-linecap="round"/>
      <rect x="50" y="80" width="90" height="8" rx="3" fill="#ffffff" fill-opacity="0.4"/>
      <path d="M60 125 c20 -25, 40 10, 70 -15" fill="none" stroke="#00e5ff" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    title: 'Smart Document Library',
    subtitle: 'Manage All Files, track Saved Creations, bookmark Favorites & share anywhere with zero cloud leaks.',
    badge: '100% Client-Side',
    icon: Shield,
    color: '#10b981',
    imageSvg: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="180" height="140" rx="12" fill="#1e1e28" stroke="#10b981" stroke-width="2"/>
      <circle cx="80" cy="70" r="24" fill="#10b981" fill-opacity="0.2"/>
      <path d="M72 70l6 6 12-12" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
      <rect x="120" y="55" width="70" height="10" rx="3" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="120" y="75" width="50" height="8" rx="3" fill="#ffffff" fill-opacity="0.4"/>
      <rect x="50" y="115" width="140" height="24" rx="6" fill="#242434"/>
      <text x="75" y="131" font-family="sans-serif" font-size="10" font-weight="bold" fill="#10b981">PROTECTED LOCAL DB</text>
    </svg>`
  }
];

export default function IOSIntroModal({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    if (currentIdx < INTRO_SLIDES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      localStorage.setItem('pinkpdf_intro_seen', 'true');
      onClose();
    }
  };

  const slide = INTRO_SLIDES[currentIdx];
  const IconComp = slide.icon;

  return (
    <div className="ios-modal-backdrop" onClick={onClose}>
      <div className="ios-intro-card" onClick={(e) => e.stopPropagation()}>
        <button className="ios-intro-close" onClick={onClose} title="Skip Tour">
          <X size={18} />
        </button>

        {/* Slide Visual Illustration */}
        <div className="ios-intro-visual" dangerouslySetInnerHTML={{ __html: slide.imageSvg }} />

        {/* Badge */}
        <div className="ios-intro-badge" style={{ color: slide.color, borderColor: `${slide.color}40`, backgroundColor: `${slide.color}15` }}>
          <IconComp size={14} />
          <span>{slide.badge}</span>
        </div>

        {/* Content */}
        <h2 className="ios-intro-title">{slide.title}</h2>
        <p className="ios-intro-desc">{slide.subtitle}</p>

        {/* Page Control Indicator (Mirroring JXPageControl) */}
        <div className="ios-page-control">
          {INTRO_SLIDES.map((_, idx) => (
            <div 
              key={idx}
              className={`ios-dot ${currentIdx === idx ? 'active' : ''}`}
              style={{ backgroundColor: currentIdx === idx ? slide.color : undefined }}
              onClick={() => setCurrentIdx(idx)}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          className="ios-intro-next-btn"
          style={{ backgroundColor: slide.color }}
          onClick={handleNext}
        >
          <span>{currentIdx === INTRO_SLIDES.length - 1 ? 'Get Started' : 'Next'}</span>
          {currentIdx === INTRO_SLIDES.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
