import React, { useState, useEffect } from 'react';
import { 
  Folder, Clock, Star, Settings, Plus, Search, 
  MoreVertical, FileText, ArrowRight, Trash2, Printer, 
  Share2, Edit3, Shield, Sparkles, ExternalLink, RefreshCw, 
  CheckCircle2, AlertCircle, HelpCircle, HardDrive, Crown,
  Grid, Compass
} from 'lucide-react';
import { DocumentStore } from '../utils/documentStore';
import PDFMenuModal from './PDFMenuModal';
import IOSPDFEditorStudio from './IOSPDFEditorStudio';
import IOSPremiumModal from './IOSPremiumModal';
import IOSIntroModal from './IOSIntroModal';

export default function IOSAppHub({ 
  onSwitchToWebTools, 
  showToast 
}) {
  // Active Tab: 'all-files', 'saved', 'favorites', 'settings'
  const [activeTab, setActiveTab] = useState('all-files');
  const [searchQuery, setSearchQuery] = useState('');
  const [allFiles, setAllFiles] = useState([]);
  const [savedFiles, setSavedFiles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isPro, setIsPro] = useState(DocumentStore.isPremium());

  // Modal states
  const [selectedMenuFile, setSelectedMenuFile] = useState(null);
  const [editorFile, setEditorFile] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Reload data from DocumentStore
  const refreshLibrary = () => {
    setAllFiles(DocumentStore.getAllFiles());
    setSavedFiles(DocumentStore.getSavedFiles());
    setFavorites(DocumentStore.getFavorites());
    setIsPro(DocumentStore.isPremium());
  };

  useEffect(() => {
    refreshLibrary();
  }, []);

  // Filtered files for search
  const filteredAllFiles = allFiles.filter(f => 
    f.filesName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const filteredSavedFiles = savedFiles.filter(f => 
    f.filesName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const filteredFavorites = favorites.filter(f => 
    f.filesName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Add new file handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = DocumentStore.addFile({
      name: file.name,
      size: file.size,
      pageCount: 1,
    }, file);

    refreshLibrary();
    if (showToast) showToast(`Added "${newDoc.filesName}" to Library`);
  };

  // Actions
  const handleRename = (id, newName) => {
    DocumentStore.renameFile(id, newName);
    refreshLibrary();
  };

  const handleToggleFavorite = (id) => {
    const isFav = DocumentStore.toggleFavorite(id);
    refreshLibrary();
    if (showToast) showToast(isFav ? 'Added to Favorites ⭐' : 'Removed from Favorites');
  };

  const handleDelete = (id) => {
    DocumentStore.deleteFile(id);
    DocumentStore.deleteSavedFile(id);
    refreshLibrary();
    if (showToast) showToast('Document deleted');
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to reset the local document library?')) {
      DocumentStore.clearAllStorage();
      refreshLibrary();
      if (showToast) showToast('Storage database reset to defaults');
    }
  };

  return (
    <div className="ios-hub-root">
      {/* iOS App Navigation Header */}
      <div className="ios-hub-header">
        <div className="ios-hub-brand">
          <div className="ios-hub-logo-circle">
            <Edit3 size={20} color="#fff" />
          </div>
          <div>
            <h1 className="ios-hub-title">PDF Marker Pro</h1>
            <span className="ios-hub-tag">iOS Mobile Edition • Local Storage Hub</span>
          </div>
        </div>

        <div className="ios-hub-header-actions">
          {/* Switch to Web Tools Suite */}
          <button 
            className="ios-btn-switch-suite"
            onClick={onSwitchToWebTools}
            title="Switch back to All 33 Web Tools"
          >
            <Grid size={16} />
            <span>Switch to 33 Tools Directory</span>
          </button>

          {/* Premium VIP status badge */}
          <button 
            className={`ios-vip-badge ${isPro ? 'vip-active' : ''}`}
            onClick={() => setShowPremiumModal(true)}
          >
            <Crown size={15} />
            <span>{isPro ? 'VIP PRO' : 'UPGRADE PRO'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="ios-tab-content-area">
        {/* ===================== TAB 0: ALL FILES ===================== */}
        {activeTab === 'all-files' && (
          <div className="ios-tab-page">
            {/* Top Bar with Search & Add PDF Button (Mirroring AllFilesVC) */}
            <div className="ios-action-bar">
              <div className="ios-search-box">
                <Search size={18} color="var(--pink-primary)" />
                <input 
                  type="text" 
                  placeholder="Search PDF in Library..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <label className="ios-btn-add-pdf" title="Add PDF to Library">
                <Plus size={18} />
                <span>Add PDF</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  style={{ display: 'none' }}
                  onChange={handleFileUpload} 
                />
              </label>
            </div>

            {/* Document List */}
            {filteredAllFiles.length === 0 ? (
              <div className="ios-empty-state">
                <div className="ios-empty-icon">
                  <Folder size={44} />
                </div>
                <h3>No PDF Files Found</h3>
                <p>Click "Add PDF" to import files or drag and drop documents here.</p>
              </div>
            ) : (
              <div className="ios-files-list">
                {filteredAllFiles.map(file => (
                  <div 
                    key={file.id} 
                    className="ios-file-cell"
                    onClick={() => setEditorFile(file)}
                  >
                    {/* Thumbnail */}
                    <div className="ios-file-thumb-wrap">
                      <img 
                        src={file.filesImage} 
                        alt={file.filesName} 
                        className="ios-file-thumb"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="75" fill="%23222"><rect width="60" height="75" rx="6"/><text x="15" y="42" fill="%23ff2d75" font-size="10">PDF</text></svg>';
                        }} 
                      />
                      {file.isFavorite && (
                        <span className="ios-fav-badge" title="Favorite">
                          <Star size={11} fill="#ff2d75" color="#ff2d75" />
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="ios-file-details">
                      <h4 className="ios-file-title" title={file.filesName}>
                        {file.filesName}.{file.filesExtensions || 'pdf'}
                      </h4>
                      <div className="ios-file-meta-row">
                        <span className="ios-file-size">{file.filesSize}</span>
                        <span>•</span>
                        <span className="ios-file-date">{file.filesDate}</span>
                        {file.filesTime && (
                          <>
                            <span>•</span>
                            <span className="ios-file-time">{file.filesTime}</span>
                          </>
                        )}
                        {file.pageCount && (
                          <span className="ios-file-pages">{file.pageCount} Pages</span>
                        )}
                      </div>
                    </div>

                    {/* Open in Editor Direct Button */}
                    <button 
                      className="ios-open-editor-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditorFile(file);
                      }}
                      title="Open in iOS Markup Editor"
                    >
                      <Edit3 size={15} />
                      <span>Edit & Sign</span>
                    </button>

                    {/* 3-Dots Context Menu Button */}
                    <button 
                      className="ios-file-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMenuFile(file);
                      }}
                      title="Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 1: SAVED CREATIONS ===================== */}
        {activeTab === 'saved' && (
          <div className="ios-tab-page">
            <div className="ios-section-header">
              <div>
                <h2>Saved Creations & Exports</h2>
                <p>History of all PDF files edited, highlighted, signed and saved locally.</p>
              </div>
            </div>

            {filteredSavedFiles.length === 0 ? (
              <div className="ios-empty-state">
                <div className="ios-empty-icon">
                  <Clock size={44} />
                </div>
                <h3>No Saved Creations Yet</h3>
                <p>Edit or sign any PDF in the Editor Studio and click "Save PDF" to store your creations here.</p>
              </div>
            ) : (
              <div className="ios-files-list">
                {filteredSavedFiles.map(file => (
                  <div 
                    key={file.id} 
                    className="ios-file-cell"
                    onClick={() => setEditorFile(file)}
                  >
                    <div className="ios-file-thumb-wrap">
                      <img src={file.filesImage} alt={file.filesName} className="ios-file-thumb" />
                      <span className="ios-saved-badge">Saved</span>
                    </div>

                    <div className="ios-file-details">
                      <h4 className="ios-file-title">{file.filesName}.pdf</h4>
                      <div className="ios-file-meta-row">
                        <span className="ios-file-size">{file.filesSize}</span>
                        <span>•</span>
                        <span className="ios-file-date">{file.filesDate}</span>
                        {file.filesTime && (
                          <>
                            <span>•</span>
                            <span className="ios-file-time">{file.filesTime}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      className="ios-open-editor-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditorFile(file);
                      }}
                    >
                      <Edit3 size={15} />
                      <span>Re-Open</span>
                    </button>

                    <button 
                      className="ios-file-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMenuFile(file);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: FAVORITES ===================== */}
        {activeTab === 'favorites' && (
          <div className="ios-tab-page">
            <div className="ios-section-header">
              <div>
                <h2>Favorite Documents</h2>
                <p>Starred files for instant single-click access.</p>
              </div>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="ios-empty-state">
                <div className="ios-empty-icon">
                  <Star size={44} />
                </div>
                <h3>No Favorites Starred</h3>
                <p>Click the 3-dots menu on any document in "All Files" and select "Add to Favorites".</p>
              </div>
            ) : (
              <div className="ios-files-list">
                {filteredFavorites.map(file => (
                  <div 
                    key={file.id} 
                    className="ios-file-cell"
                    onClick={() => setEditorFile(file)}
                  >
                    <div className="ios-file-thumb-wrap">
                      <img src={file.filesImage} alt={file.filesName} className="ios-file-thumb" />
                      <span className="ios-fav-badge">
                        <Star size={11} fill="#ff2d75" color="#ff2d75" />
                      </span>
                    </div>

                    <div className="ios-file-details">
                      <h4 className="ios-file-title">{file.filesName}.pdf</h4>
                      <div className="ios-file-meta-row">
                        <span className="ios-file-size">{file.filesSize}</span>
                        <span>•</span>
                        <span className="ios-file-date">{file.filesDate}</span>
                      </div>
                    </div>

                    <button 
                      className="ios-open-editor-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditorFile(file);
                      }}
                    >
                      <Edit3 size={15} />
                      <span>Edit</span>
                    </button>

                    <button 
                      className="ios-file-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMenuFile(file);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="ios-tab-page">
            <div className="ios-section-header">
              <div>
                <h2>iOS PDF Editor Settings</h2>
                <p>System configuration, Pro tier management, and local storage stats.</p>
              </div>
            </div>

            <div className="ios-settings-card">
              {/* Pro Banner */}
              <div className="ios-settings-pro-banner" onClick={() => setShowPremiumModal(true)}>
                <div className="ios-pro-banner-left">
                  <div className="ios-pro-icon-wrap">
                    <Crown size={24} />
                  </div>
                  <div>
                    <h4>{isPro ? 'PinkPDF Pro VIP Active' : 'Upgrade to Pro VIP'}</h4>
                    <p>{isPro ? 'Lifetime access unlocked • No limits' : 'Unlimited daily text annotations & signatures'}</p>
                  </div>
                </div>
                <ArrowRight size={18} />
              </div>

              {/* Version & Storage List */}
              <div className="ios-settings-list">
                <div className="ios-settings-row">
                  <div className="ios-row-left">
                    <HelpCircle size={18} color="var(--pink-primary)" />
                    <span>App Version</span>
                  </div>
                  <span className="ios-row-val">v2.4.0 (iOS Build 24)</span>
                </div>

                <div className="ios-settings-row">
                  <div className="ios-row-left">
                    <HardDrive size={18} color="var(--pink-primary)" />
                    <span>Stored Documents</span>
                  </div>
                  <span className="ios-row-val">{allFiles.length} Files ({savedFiles.length} Saved)</span>
                </div>

                <div className="ios-settings-row action-row" onClick={() => setShowIntroModal(true)}>
                  <div className="ios-row-left">
                    <Compass size={18} color="var(--pink-primary)" />
                    <span>Re-launch Intro Tour</span>
                  </div>
                  <ArrowRight size={16} />
                </div>

                <div className="ios-settings-row action-row" onClick={() => setTermsModalOpen(true)}>
                  <div className="ios-row-left">
                    <Shield size={18} color="var(--pink-primary)" />
                    <span>Terms & Conditions</span>
                  </div>
                  <ArrowRight size={16} />
                </div>

                <div className="ios-settings-row action-row" onClick={() => setPrivacyModalOpen(true)}>
                  <div className="ios-row-left">
                    <Shield size={18} color="var(--pink-primary)" />
                    <span>Privacy Policy (100% Client-Side)</span>
                  </div>
                  <ArrowRight size={16} />
                </div>

                <div className="ios-settings-row danger-row" onClick={handleClearCache}>
                  <div className="ios-row-left">
                    <Trash2 size={18} color="#ef4444" />
                    <span style={{ color: '#ef4444' }}>Reset Local Database Cache</span>
                  </div>
                  <span className="ios-row-val" style={{ color: '#ef4444' }}>Reset</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== FLOATING ANIMATED BOTTOM TABBAR ===================== */}
      {/* Matches TabbarViewController.swift with movingBackgroundCircle */}
      <nav className="ios-custom-tabbar-wrap">
        <div className="ios-custom-tabbar">
          <button 
            className={`ios-tabbar-item ${activeTab === 'all-files' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-files')}
            title="All Files"
          >
            <Folder size={20} />
            <span className="ios-tabbar-label">All Files</span>
          </button>

          <button 
            className={`ios-tabbar-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
            title="Saved Creations"
          >
            <Clock size={20} />
            <span className="ios-tabbar-label">Saved</span>
          </button>

          <button 
            className={`ios-tabbar-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
            title="Favorites"
          >
            <Star size={20} />
            <span className="ios-tabbar-label">Favorites</span>
          </button>

          <button 
            className={`ios-tabbar-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            title="Settings"
          >
            <Settings size={20} />
            <span className="ios-tabbar-label">Settings</span>
          </button>
        </div>
      </nav>

      {/* 3-Dots Context Menu Modal */}
      {selectedMenuFile && (
        <PDFMenuModal 
          file={selectedMenuFile}
          onClose={() => setSelectedMenuFile(null)}
          onRename={handleRename}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          onOpenEditor={(file) => {
            setSelectedMenuFile(null);
            setEditorFile(file);
          }}
          showToast={showToast}
        />
      )}

      {/* Full iOS PDFKit & PencilKit Editor Studio */}
      {editorFile && (
        <IOSPDFEditorStudio 
          file={editorFile}
          onClose={() => {
            setEditorFile(null);
            refreshLibrary();
          }}
          showToast={showToast}
        />
      )}

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <IOSPremiumModal 
          onClose={() => setShowPremiumModal(false)}
          showToast={showToast}
          onStatusChange={refreshLibrary}
        />
      )}

      {/* Intro Tour Modal */}
      {showIntroModal && (
        <IOSIntroModal 
          onClose={() => setShowIntroModal(false)}
        />
      )}

      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="ios-modal-backdrop" onClick={() => setTermsModalOpen(false)}>
          <div className="ios-info-card" onClick={e => e.stopPropagation()}>
            <h3>Terms & Conditions</h3>
            <p>
              PinkPDF Pro is 100% free software that processes all files locally inside your browser WebAssembly engine.
              No documents are transmitted to external servers. You maintain complete ownership and copyright over your files.
            </p>
            <button className="ios-btn-primary" onClick={() => setTermsModalOpen(false)}>I Agree</button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {privacyModalOpen && (
        <div className="ios-modal-backdrop" onClick={() => setPrivacyModalOpen(false)}>
          <div className="ios-info-card" onClick={e => e.stopPropagation()}>
            <h3>Privacy Policy</h3>
            <p>
              Zero server data collection. All PDF renders, highlights, signatures, and edits are strictly local to your device.
              Storage uses your browser's private local database (LocalStore / IndexedDB).
            </p>
            <button className="ios-btn-primary" onClick={() => setPrivacyModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
