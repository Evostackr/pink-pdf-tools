# 🌸 PinkPDF — 100% Private, Client-Side PDF Tools Suite

> **Fast, Free, and Zero-Data PDF Utility Platform powered by WebAssembly & Modern Web Standards.**  
> Everything runs 100% locally in your browser. Your sensitive files and documents never leave your device.

---

## ✨ Features & Capabilities

PinkPDF includes **33+ standalone tools** covering every PDF workflow:

### 🔄 Convert & Transform
- **PDF to Word (.docx)**: Extract and preserve formatting, headings, paragraphs, and tables.
- **PDF to Excel (.xlsx)**: Reconstruct tabular data cleanly into editable spreadsheets.
- **PDF to PowerPoint (.pptx)**: Multi-slide conversion with rich layout retention.
- **PDF to Text / Markdown**: Clean document text extraction for analysis and LLM workflows.
- **PDF to Images (JPG, PNG, WebP)**: High-DPI page rendering with batch ZIP download.
- **Images to PDF**: Convert JPG, PNG, WebP, SVG, and GIF directly into standard PDFs.
- **Office to PDF**: Convert DOCX, XLSX, and TXT files directly to PDF in the browser.

### ✂️ Organize & Manage
- **Merge PDF**: Combine multiple PDFs into a single organized document with drag-and-drop reordering.
- **Split PDF**: Extract page ranges or burst documents into individual single-page files.
- **Compress PDF**: Multi-level compression (Aggressive, Balanced, Minimal) to optimize file sizes.
- **Rotate & Reorder**: 90°/180°/270° orientation adjustment and visual thumbnail grid reordering.
- **Delete / Extract Pages**: Remove unwanted pages or cherry-pick specific pages into a new PDF.

### 🛡️ Security, Privacy & Signatures
- **Protect PDF**: Client-side AES-256 standard encryption with user & owner passwords and custom permission flags.
- **Unlock PDF**: Remove passwords from protected documents in-memory.
- **Digital & Visual Signatures**: Draw, type, or upload transparent PNG signatures and stamp them onto any page.
- **Watermark & Page Numbers**: Add dynamic text/image watermarks and custom page number formats (`Page {n} of {total}`).
- **Sanitize & Flatten**: Remove hidden metadata, embedded annotations, and flatten interactive form fields.

### ⚡ Advanced & Specialized
- **OCR (Optical Character Recognition)**: Extract selectable text from scanned documents using in-browser Tesseract.js.
- **Bates Numbering**: Legal-grade document indexing with custom prefixes and zero-padding.
- **Grayscale / B&W**: Strip color channels to reduce ink and file size for printing.
- **Compare PDFs**: Side-by-side visual diff and page comparison.
- **PDF Repair / Linearization**: Reconstruct corrupted cross-reference tables and broken streams.
- **PDF/A Archival**: Embed standardized PDF/A-1b metadata and compliance profiles.

---

## 🔒 Zero-Data Privacy Architecture

- **100% Client-Side Processing**: No servers, no backend uploads, no cloud storage.
- **Volatile In-Memory Operations**: Files are held in temporary WebAssembly memory buffers and instantly discarded when closed or refreshed.
- **Compliance by Design**: Inherently complies with **GDPR**, **HIPAA**, and **CCPA** regulations because no personally identifiable information (PII) is ever collected, transmitted, or logged.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Evostackr/pink-pdf-tools.git

# Navigate into the project directory
cd pink-pdf-tools

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **PDF Manipulation Engine**: `pdf-lib`, `pdfjs-dist`, `cryptpdf`, `jspdf`
- **Document Exporters**: `docx`, `xlsx`, `pptxgenjs`, `jszip`
- **Client OCR**: `tesseract.js`
- **Icons & UI**: `lucide-react`, Vanilla CSS Design Tokens (Hot-pink `#ff2d75`, dark mode, responsive glassmorphism)
- **Linter**: `oxlint`

---

## 📄 License & Terms

- Software licensed under the [MIT License](LICENSE).
- User documents: Users retain **100% ownership and copyright** over all files processed through PinkPDF.
