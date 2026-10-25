// Persistent Document Store mimicking iOS DatabaseHelper / CoreData for Pink PDF
// Manages: All Files, Saved Creations, Favorites, and Settings

const ALL_FILES_KEY = 'pinkpdf_all_files_v1';
const SAVED_FILES_KEY = 'pinkpdf_saved_files_v1';
const FAVORITES_KEY = 'pinkpdf_favorites_v1';
const PREMIUM_KEY = 'pinkpdf_is_premium';

// Generate lightweight base64 SVG thumbnails for instant display
function generatePdfThumbnail(title, color = '#ff2d75') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260">
    <rect width="200" height="260" rx="10" fill="#18181f" stroke="#2d2d3a" stroke-width="2"/>
    <rect x="20" y="24" width="36" height="42" rx="6" fill="${color}" fill-opacity="0.2"/>
    <path d="M30 36h16M30 44h10M30 52h14" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="20" y="80" width="160" height="12" rx="3" fill="#ffffff" fill-opacity="0.85"/>
    <rect x="20" y="104" width="130" height="8" rx="2" fill="#ffffff" fill-opacity="0.4"/>
    <rect x="20" y="120" width="145" height="8" rx="2" fill="#ffffff" fill-opacity="0.4"/>
    <rect x="20" y="136" width="110" height="8" rx="2" fill="#ffffff" fill-opacity="0.4"/>
    <rect x="20" y="160" width="160" height="40" rx="6" fill="#242430"/>
    <path d="M32 180h40M32 188h24" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
    <circle cx="160" cy="180" r="10" fill="${color}" fill-opacity="0.3"/>
    <rect x="20" y="218" width="80" height="16" rx="4" fill="${color}" fill-opacity="0.15"/>
    <text x="28" y="230" font-family="sans-serif" font-size="9" font-weight="bold" fill="${color}">PDF DOC</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Initial default sample files mirroring the iOS demo documents
const DEFAULT_FILES = [
  {
    id: 'doc-1',
    filesName: 'NDA_Confidential_Agreement',
    filesExtensions: 'pdf',
    filesSize: '1.42 MB',
    filesDate: '24 October 2026',
    filesTime: '10:30 AM',
    filesImage: generatePdfThumbnail('NDA', '#ff2d75'),
    isFavorite: true,
    pageCount: 3,
    url: null
  },
  {
    id: 'doc-2',
    filesName: 'Quarterly_Financial_Report_Q3',
    filesExtensions: 'pdf',
    filesSize: '3.85 MB',
    filesDate: '23 October 2026',
    filesTime: '04:15 PM',
    filesImage: generatePdfThumbnail('Finances', '#00e5ff'),
    isFavorite: false,
    pageCount: 12,
    url: null
  },
  {
    id: 'doc-3',
    filesName: 'Product_Design_Specification_v2',
    filesExtensions: 'pdf',
    filesSize: '5.20 MB',
    filesDate: '21 October 2026',
    filesTime: '01:50 PM',
    filesImage: generatePdfThumbnail('Design', '#a855f7'),
    isFavorite: true,
    pageCount: 8,
    url: null
  },
  {
    id: 'doc-4',
    filesName: 'Employment_Contract_Signed',
    filesExtensions: 'pdf',
    filesSize: '890 KB',
    filesDate: '20 October 2026',
    filesTime: '11:20 AM',
    filesImage: generatePdfThumbnail('Contract', '#10b981'),
    isFavorite: false,
    pageCount: 4,
    url: null
  }
];

const DEFAULT_SAVED = [
  {
    id: 'save-1',
    filesName: 'NDA_Confidential_Agreement_Signed',
    filesExtensions: 'pdf',
    filesSize: '1.55 MB',
    filesDate: '24 October 2026',
    filesTime: '11:05 AM',
    filesImage: generatePdfThumbnail('NDA Signed', '#ff2d75'),
    pageCount: 3
  },
  {
    id: 'save-2',
    filesName: 'Design_Spec_Annotated',
    filesExtensions: 'pdf',
    filesSize: '5.32 MB',
    filesDate: '22 October 2026',
    filesTime: '06:40 PM',
    filesImage: generatePdfThumbnail('Annotated', '#ffb703'),
    pageCount: 8
  }
];

export const DocumentStore = {
  // Get all files
  getAllFiles() {
    try {
      const data = localStorage.getItem(ALL_FILES_KEY);
      if (!data) {
        localStorage.setItem(ALL_FILES_KEY, JSON.stringify(DEFAULT_FILES));
        return DEFAULT_FILES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_FILES;
    }
  },

  // Save all files
  saveAllFiles(files) {
    try {
      localStorage.setItem(ALL_FILES_KEY, JSON.stringify(files));
    } catch (e) {
      console.warn('DocumentStore save error', e);
    }
  },

  // Add new file
  addFile(fileObj, fileBlob = null) {
    const files = this.getAllFiles();
    const newDoc = {
      id: 'doc-' + Date.now(),
      filesName: fileObj.name ? fileObj.name.replace(/\.[^/.]+$/, '') : (fileObj.filesName || 'Untitled_Document'),
      filesExtensions: 'pdf',
      filesSize: fileObj.size ? (fileObj.size > 1048576 ? `${(fileObj.size / 1048576).toFixed(2)} MB` : `${Math.round(fileObj.size / 1024)} KB`) : (fileObj.filesSize || '1.2 MB'),
      filesDate: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      filesTime: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date()),
      filesImage: fileObj.thumbnail || generatePdfThumbnail(fileObj.name || 'PDF', '#ff2d75'),
      isFavorite: false,
      pageCount: fileObj.pageCount || 1,
      blobData: fileBlob
    };
    const updated = [newDoc, ...files];
    this.saveAllFiles(updated);
    return newDoc;
  },

  // Rename a file
  renameFile(id, newName) {
    const files = this.getAllFiles();
    const sanitized = newName.trim().replace(/\.[^/.]+$/, '');
    const updated = files.map(f => f.id === id ? { ...f, filesName: sanitized } : f);
    this.saveAllFiles(updated);

    // Also update saved creations if matched
    const saved = this.getSavedFiles();
    const updatedSaved = saved.map(s => s.id === id ? { ...s, filesName: sanitized } : s);
    this.saveSavedFiles(updatedSaved);
    return true;
  },

  // Toggle favorite
  toggleFavorite(id) {
    const files = this.getAllFiles();
    let newState = false;
    const updated = files.map(f => {
      if (f.id === id) {
        newState = !f.isFavorite;
        return { ...f, isFavorite: newState };
      }
      return f;
    });
    this.saveAllFiles(updated);
    return newState;
  },

  // Delete a file
  deleteFile(id) {
    const files = this.getAllFiles();
    const updated = files.filter(f => f.id !== id);
    this.saveAllFiles(updated);
    return true;
  },

  // Get Saved Creations (Recent creations from iOS PDF Editor)
  getSavedFiles() {
    try {
      const data = localStorage.getItem(SAVED_FILES_KEY);
      if (!data) {
        localStorage.setItem(SAVED_FILES_KEY, JSON.stringify(DEFAULT_SAVED));
        return DEFAULT_SAVED;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SAVED;
    }
  },

  saveSavedFiles(saved) {
    try {
      localStorage.setItem(SAVED_FILES_KEY, JSON.stringify(saved));
    } catch (e) {
      console.warn('SavedStore save error', e);
    }
  },

  // Add a saved creation
  addSavedCreation({ name, size, pageCount, thumbnail, blob }) {
    const saved = this.getSavedFiles();
    const newSaved = {
      id: 'save-' + Date.now(),
      filesName: name.trim().replace(/\.[^/.]+$/, ''),
      filesExtensions: 'pdf',
      filesSize: size || '1.5 MB',
      filesDate: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      filesTime: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date()),
      filesImage: thumbnail || generatePdfThumbnail(name, '#10b981'),
      pageCount: pageCount || 1,
      blobData: blob
    };
    const updated = [newSaved, ...saved];
    this.saveSavedFiles(updated);

    // Also auto-add to All Files
    this.addFile({
      name: newSaved.filesName,
      filesSize: newSaved.filesSize,
      thumbnail: newSaved.filesImage,
      pageCount: newSaved.pageCount
    }, blob);

    return newSaved;
  },

  deleteSavedFile(id) {
    const saved = this.getSavedFiles();
    const updated = saved.filter(s => s.id !== id);
    this.saveSavedFiles(updated);
    return true;
  },

  // Get Favorites
  getFavorites() {
    const files = this.getAllFiles();
    return files.filter(f => f.isFavorite);
  },

  // Premium / VIP state
  isPremium() {
    return localStorage.getItem(PREMIUM_KEY) === 'true';
  },

  setPremium(val) {
    localStorage.setItem(PREMIUM_KEY, val ? 'true' : 'false');
  },

  // Clear cache/storage
  clearAllStorage() {
    localStorage.removeItem(ALL_FILES_KEY);
    localStorage.removeItem(SAVED_FILES_KEY);
    localStorage.removeItem(FAVORITES_KEY);
  }
};
