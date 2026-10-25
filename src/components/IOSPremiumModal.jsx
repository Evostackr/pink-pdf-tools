import React, { useState } from 'react';
import { X, CheckCircle2, Crown, Zap, Shield, Sparkles, Star } from 'lucide-react';
import { DocumentStore } from '../utils/documentStore';

export default function IOSPremiumModal({ onClose, showToast, onStatusChange }) {
  const [isPro, setIsPro] = useState(DocumentStore.isPremium());

  const handleTogglePro = () => {
    const nextState = !isPro;
    DocumentStore.setPremium(nextState);
    setIsPro(nextState);
    if (onStatusChange) onStatusChange(nextState);
    if (showToast) {
      showToast(nextState ? '🎉 Upgraded to PinkPDF Pro VIP!' : 'Switched to Standard Tier');
    }
  };

  return (
    <div className="ios-modal-backdrop" onClick={onClose}>
      <div className="ios-premium-card" onClick={(e) => e.stopPropagation()}>
        <button className="ios-intro-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="ios-premium-header">
          <div className="ios-premium-crown">
            <Crown size={28} />
          </div>
          <h2 className="ios-premium-title">Upgrade to PinkPDF Pro</h2>
          <p className="ios-premium-subtitle">
            Unlock the full potential of iOS Native PDFKit & Desktop Studio with zero limits.
          </p>
        </div>

        {/* Feature comparison perks */}
        <div className="ios-premium-perks">
          <div className="ios-perk-item">
            <CheckCircle2 size={18} className="ios-perk-check" />
            <div>
              <strong>Unlimited Daily Edits & Signatures</strong>
              <p>Bypass the 2 daily text and signature limits completely.</p>
            </div>
          </div>

          <div className="ios-perk-item">
            <CheckCircle2 size={18} className="ios-perk-check" />
            <div>
              <strong>High-Res 300 DPI Rendering</strong>
              <p>Crystal clear multi-page export without compression degradation.</p>
            </div>
          </div>

          <div className="ios-perk-item">
            <CheckCircle2 size={18} className="ios-perk-check" />
            <div>
              <strong>Ad-Free Minimal UI</strong>
              <p>Distraction-free canvas with expanded PencilKit color palettes.</p>
            </div>
          </div>

          <div className="ios-perk-item">
            <CheckCircle2 size={18} className="ios-perk-check" />
            <div>
              <strong>Local Database Cloud Sync Ready</strong>
              <p>Instant favorite backups and multi-device export profiles.</p>
            </div>
          </div>
        </div>

        {/* Pricing Card / Free Unlock */}
        <div className="ios-premium-tier-box">
          <div className="ios-tier-label">VIP PRO LIFETIME</div>
          <div className="ios-tier-price">
            <span className="price-amount">FREE</span>
            <span className="price-period">/ Community Edition</span>
          </div>
          <p className="ios-tier-note">100% In-Browser WebAssembly. No subscription needed!</p>
        </div>

        <button 
          className={`ios-premium-action-btn ${isPro ? 'pro-active' : ''}`}
          onClick={handleTogglePro}
        >
          <Sparkles size={18} />
          <span>{isPro ? 'Pro VIP Active (Click to Demote)' : 'Activate VIP Pro Lifetime Now'}</span>
        </button>
      </div>
    </div>
  );
}
