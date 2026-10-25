import React, { useState } from 'react';
import { 
  X, Star, Edit3, Share2, Printer, Trash2, Check, FileText, 
  ExternalLink, Sparkles 
} from 'lucide-react';

export default function PDFMenuModal({ 
  file, 
  onClose, 
  onRename, 
  onToggleFavorite, 
  onDelete, 
  onOpenEditor,
  onPrint,
  onShare,
  showToast 
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.filesName || 'Document');

  const handleSaveRename = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onRename(file.id, newName.trim());
    setIsRenaming(false);
    if (showToast) showToast(`Renamed to "${newName.trim()}"`);
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare(file);
    } else if (navigator.share) {
      navigator.share({
        title: file.filesName,
        text: `Check out ${file.filesName}.pdf edited with PinkPDF Pro!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin} - ${file.filesName}.pdf`);
      if (showToast) showToast('File info copied to clipboard!');
    }
  };

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint(file);
    } else {
      window.print();
    }
  };

  return (
    <div className="pdf-menu-backdrop" onClick={onClose}>
      <div className="pdf-menu-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pdf-menu-header">
          <div className="pdf-menu-preview">
            <img 
              src={file.filesImage} 
              alt={file.filesName} 
              className="pdf-menu-thumb"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
            <div className="pdf-menu-meta">
              <h3 className="pdf-menu-title" title={file.filesName}>
                {file.filesName}.{file.filesExtensions || 'pdf'}
              </h3>
              <div className="pdf-menu-sub">
                <span>{file.filesSize || '1.2 MB'}</span>
                <span>•</span>
                <span>{file.filesDate || 'Today'}</span>
                {file.pageCount && (
                  <>
                    <span>•</span>
                    <span>{file.pageCount} Pages</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="pdf-menu-close" onClick={onClose} title="Close Menu">
            <X size={20} />
          </button>
        </div>

        {/* Inline Rename Form */}
        {isRenaming ? (
          <form className="pdf-menu-rename-box" onSubmit={handleSaveRename}>
            <input 
              type="text" 
              className="pdf-menu-rename-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              placeholder="Enter new filename"
            />
            <button type="submit" className="pdf-menu-rename-btn">
              <Check size={16} />
              <span>Save</span>
            </button>
            <button 
              type="button" 
              className="pdf-menu-rename-cancel"
              onClick={() => setIsRenaming(false)}
            >
              Cancel
            </button>
          </form>
        ) : null}

        {/* Menu Actions (Mirrors iOS PDFMenuVC options) */}
        <div className="pdf-menu-actions">
          {/* Open in Editor */}
          <button 
            className="pdf-menu-item primary-action"
            onClick={() => {
              onClose();
              if (onOpenEditor) onOpenEditor(file);
            }}
          >
            <div className="pdf-menu-icon primary">
              <Edit3 size={18} />
            </div>
            <div className="pdf-menu-item-text">
              <span className="pdf-menu-item-title">Open in iOS Markup Editor</span>
              <span className="pdf-menu-item-desc">PencilKit draw, highlight, text sticker, and digital signature</span>
            </div>
          </button>

          {/* Toggle Favorite */}
          <button 
            className="pdf-menu-item"
            onClick={() => {
              onToggleFavorite(file.id);
              onClose();
            }}
          >
            <div className={`pdf-menu-icon ${file.isFavorite ? 'fav-active' : ''}`}>
              <Star size={18} fill={file.isFavorite ? 'var(--pink-primary)' : 'none'} />
            </div>
            <div className="pdf-menu-item-text">
              <span className="pdf-menu-item-title">
                {file.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </span>
              <span className="pdf-menu-item-desc">
                {file.isFavorite ? 'Remove from starred collection' : 'Star this document for quick access'}
              </span>
            </div>
          </button>

          {/* Rename File */}
          <button 
            className="pdf-menu-item"
            onClick={() => setIsRenaming(true)}
          >
            <div className="pdf-menu-icon">
              <FileText size={18} />
            </div>
            <div className="pdf-menu-item-text">
              <span className="pdf-menu-item-title">Rename Document</span>
              <span className="pdf-menu-item-desc">Change the file title</span>
            </div>
          </button>

          {/* Share */}
          <button 
            className="pdf-menu-item"
            onClick={() => {
              handleShareClick();
              onClose();
            }}
          >
            <div className="pdf-menu-icon">
              <Share2 size={18} />
            </div>
            <div className="pdf-menu-item-text">
              <span className="pdf-menu-item-title">Share Document</span>
              <span className="pdf-menu-item-desc">AirDrop, WhatsApp, Mail or copy link</span>
            </div>
          </button>

          {/* Print */}
          <button 
            className="pdf-menu-item"
            onClick={() => {
              handlePrintClick();
              onClose();
            }}
          >
            <div className="pdf-menu-icon">
              <Printer size={18} />
            </div>
            <div className="pdf-menu-item-text">
              <span className="pdf-menu-item-title">Print PDF</span>
              <span className="pdf-menu-item-desc">Direct hardware printing output</span>
            </div>
          </button>

          {/* Delete */}
          <button 
            className="pdf-menu-item delete-action"
            onClick={() => {
              onDelete(file.id);
              onClose();
            }}
          >
            <div className="pdf-menu-icon delete">
              <Trash2 size={18} />
            </div>
            <div className="pdf-menu-item-text">
              <span className="pdf-menu-item-title">Delete Document</span>
              <span className="pdf-menu-item-desc">Remove permanently from your local library</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
