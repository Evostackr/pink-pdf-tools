/**
 * Comprehensive Step-by-Step Onboarding Guides for all 33 PDF Tools
 * Pure client-side, zero cloud tracking, customized per tool.
 */

export const TOOL_ONBOARDING_DATA = {
  // 1. ORGANIZE PDF
  'merge-pdf': {
    title: 'Merge PDF Walkthrough',
    tagline: 'Combine multiple PDF files into one clean document with custom order.',
    badge: 'Organize',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Multiple PDF Files',
        desc: 'Drag & drop two or more PDF documents into the upload box or click to select them from your computer.',
        icon: 'UploadCloud',
        actionTip: 'You can upload as many PDFs as needed without file size limits.',
        expectedOutput: 'Multiple document cards listed in workspace'
      },
      {
        stepNumber: 2,
        title: 'Arrange Document Sequence',
        desc: 'Use the move arrows or drag cards to order the documents exactly how you want them to appear in the combined file.',
        icon: 'MoveVertical',
        actionTip: 'Document #1 will become the beginning of the merged file.',
        expectedOutput: 'Reordered list of PDF documents'
      },
      {
        stepNumber: 3,
        title: 'Merge & Download Single PDF',
        desc: 'Click the "Merge PDF" button. In-browser engine will bundle all pages seamlessly and download your unified document.',
        icon: 'DownloadCloud',
        actionTip: '100% private in-browser compilation with zero server upload.',
        expectedOutput: 'merged_document.pdf'
      }
    ]
  },

  'split-pdf': {
    title: 'Split PDF Walkthrough',
    tagline: 'Separate pages or extract custom ranges into independent PDF files.',
    badge: 'Splitter',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Your PDF File',
        desc: 'Select or drop the multi-page PDF document you wish to divide into separate files.',
        icon: 'UploadCloud',
        actionTip: 'Thumbnails will generate automatically for every page.',
        expectedOutput: 'Visual page grid loaded'
      },
      {
        stepNumber: 2,
        title: 'Select Split Mode',
        desc: 'Choose whether to split every single page into individual files (ZIP) or extract a specific range (e.g. 1-3).',
        icon: 'Scissors',
        actionTip: 'Use "Split all pages" to get an organized ZIP package.',
        expectedOutput: 'Split configuration configured'
      },
      {
        stepNumber: 3,
        title: 'Export Split Files',
        desc: 'Click "Split PDF" to process. Your browser will instantly generate and download the separated files.',
        icon: 'FileArchive',
        actionTip: 'Each separated PDF retains original vector clarity and text formatting.',
        expectedOutput: 'split_pages.zip or custom range PDF'
      }
    ]
  },

  'remove-pages': {
    title: 'Remove Pages Walkthrough',
    tagline: 'Quickly delete unwanted pages from any PDF document.',
    badge: 'Editor',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Drop your document into the studio to view all pages as interactive visual thumbnail cards.',
        icon: 'UploadCloud',
        actionTip: 'Every page is clearly numbered for easy identification.',
        expectedOutput: 'Full document page overview'
      },
      {
        stepNumber: 2,
        title: 'Click Pages to Remove',
        desc: 'Simply click on any page card you wish to eliminate. Selected pages will be marked with a pink "[Removed]" badge.',
        icon: 'Trash2',
        actionTip: 'Clicking a removed page again will restore it to the document.',
        expectedOutput: 'Highlighted pages marked for deletion'
      },
      {
        stepNumber: 3,
        title: 'Save Cleaned PDF',
        desc: 'Click "Remove Selected Pages" to create your new PDF with only the pages you kept.',
        icon: 'CheckCircle2',
        actionTip: 'Original file remains untouched on your disk.',
        expectedOutput: 'cleaned_document.pdf'
      }
    ]
  },

  'extract-pages': {
    title: 'Extract Pages Walkthrough',
    tagline: 'Pull out specific pages to create a brand new focused document.',
    badge: 'Extractor',
    steps: [
      {
        stepNumber: 1,
        title: 'Select Source PDF',
        desc: 'Upload the document from which you want to extract specific sections or chapters.',
        icon: 'UploadCloud',
        actionTip: 'Works seamlessly with small and multi-hundred-page files.',
        expectedOutput: 'Interactive page gallery'
      },
      {
        stepNumber: 2,
        title: 'Pick Desired Pages',
        desc: 'Click each page thumbnail you want to include in your new extracted PDF. Selected pages glow with pink borders.',
        icon: 'CheckSquare',
        actionTip: 'You can extract non-consecutive pages (e.g. Page 1, 4, and 7).',
        expectedOutput: 'Custom subset of pages selected'
      },
      {
        stepNumber: 3,
        title: 'Export Extracted Document',
        desc: 'Click "Extract Pages" to package only the selected pages into a standalone high-resolution PDF.',
        icon: 'ExternalLink',
        actionTip: 'Text searchability and vector quality are completely preserved.',
        expectedOutput: 'extracted_pages.pdf'
      }
    ]
  },

  'organize-pdf': {
    title: 'Organize PDF Walkthrough',
    tagline: 'Sort, reorder, rotate, and choose exact 1st (Cover) and Last pages visually.',
    badge: 'Visual Organizer',
    steps: [
      {
        stepNumber: 1,
        title: 'Choose 1st Page (Cover) & Last Page',
        desc: 'Use the dedicated dropdowns in the right panel or click the 1st/Last icons under any thumbnail to designate cover and ending pages instantly.',
        icon: 'Layers',
        actionTip: 'Selected 1st page glows with a bright pink badge; Last page glows in cyan.',
        expectedOutput: 'Cover and ending pages locked'
      },
      {
        stepNumber: 2,
        title: 'Drag & Drop or Shift Pages',
        desc: 'Reorder any page by grabbing and dragging its thumbnail card, or use the Left/Right arrow buttons on each card.',
        icon: 'Move',
        actionTip: 'Watch the real-time sequence preview at the bottom update dynamically.',
        expectedOutput: 'Custom reordered page sequence'
      },
      {
        stepNumber: 3,
        title: 'Rotate, Remove or Apply Presets',
        desc: 'Rotate individual pages 90° clockwise, delete extra pages, or use quick presets like "Reverse All", "Odd First", or "Even First".',
        icon: 'RotateCw',
        actionTip: 'Click "Reset" anytime to revert back to original page order.',
        expectedOutput: 'Fine-tuned page orientation and structure'
      },
      {
        stepNumber: 4,
        title: 'Export Reorganized PDF',
        desc: 'Click "Export Organized PDF" to compile your document with updated page sequence and rotations.',
        icon: 'DownloadCloud',
        actionTip: 'Ultra-fast in-memory processing directly in your browser.',
        expectedOutput: 'organized_document.pdf'
      }
    ]
  },

  'scan-to-pdf': {
    title: 'Scan to PDF Walkthrough',
    tagline: 'Capture physical documents with your webcam and generate a clean PDF.',
    badge: 'Camera Scanner',
    steps: [
      {
        stepNumber: 1,
        title: 'Allow Camera Access',
        desc: 'Grant browser permission to use your webcam. Position your paper document under good lighting in front of the lens.',
        icon: 'Camera',
        actionTip: 'Ensure document edges are clearly visible inside the camera feed.',
        expectedOutput: 'Live high-definition camera stream'
      },
      {
        stepNumber: 2,
        title: 'Capture Page Snapshots',
        desc: 'Click "Capture Snapshot" for every page you want to scan. Snapshots will appear in the page queue below.',
        icon: 'Image',
        actionTip: 'You can capture as many pages as you need for a multi-page document.',
        expectedOutput: 'List of captured page thumbnails'
      },
      {
        stepNumber: 3,
        title: 'Apply Document Filters & Export',
        desc: 'Select Black & White or High-Contrast Document filter if desired, then click "Compile Scans into PDF".',
        icon: 'FileText',
        actionTip: 'Automatic paper sizing (A4) ensures standard printing format.',
        expectedOutput: 'scanned_document.pdf'
      }
    ]
  },

  // 2. OPTIMIZE PDF
  'compress-pdf': {
    title: 'Compress PDF Walkthrough',
    tagline: 'Shrink file size while preserving crisp text and sharp visual quality.',
    badge: 'Optimizer',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Heavy PDF',
        desc: 'Upload any large PDF file that exceeds email attachment or portal upload limits.',
        icon: 'UploadCloud',
        actionTip: 'Original file size in MB is calculated instantly.',
        expectedOutput: 'File loaded with size telemetry'
      },
      {
        stepNumber: 2,
        title: 'Select Compression Level',
        desc: 'Choose between "Recommended" (balanced -45%), "Extreme" (maximum shrink -70%), or "Light" (lossless -20%).',
        icon: 'Minimize2',
        actionTip: 'Recommended preset is ideal for standard business and office documents.',
        expectedOutput: 'Target compression profile selected'
      },
      {
        stepNumber: 3,
        title: 'Compress & Save',
        desc: 'Click "Compress PDF". The canvas engine downsamples high-res assets and exports your lightweight PDF.',
        icon: 'CheckCircle2',
        actionTip: 'See the exact MB savings report right on your screen.',
        expectedOutput: 'compressed_document.pdf'
      }
    ]
  },

  'repair-pdf': {
    title: 'Repair PDF Walkthrough',
    tagline: 'Rebuild damaged cross-reference tables and recover corrupt PDF files.',
    badge: 'Recovery',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Damaged PDF',
        desc: 'Select any corrupted, unopenable, or malformed PDF file that errors out in standard viewers.',
        icon: 'AlertTriangle',
        actionTip: 'Handles broken xref tables, malformed trailers, and truncated streams.',
        expectedOutput: 'Binary file ingested for diagnostic'
      },
      {
        stepNumber: 2,
        title: 'Automated Structure Scan',
        desc: 'The recovery engine parses readable object trees, recovers page dictionaries, and isolates corrupted bytes.',
        icon: 'Wrench',
        actionTip: 'Zero data is sent to external servers; your privacy is 100% protected.',
        expectedOutput: 'Recovered object tree'
      },
      {
        stepNumber: 3,
        title: 'Download Restored File',
        desc: 'Click "Repair PDF". A newly indexed, compliant PDF structure is generated and downloaded.',
        icon: 'ShieldCheck',
        actionTip: 'Opens smoothly in Adobe Reader, Chrome, and all standard PDF software.',
        expectedOutput: 'repaired_document.pdf'
      }
    ]
  },

  'ocr-pdf': {
    title: 'OCR PDF Walkthrough',
    tagline: 'Extract and recognize optical text from scanned documents and images.',
    badge: 'OCR Engine',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Scanned PDF or Image',
        desc: 'Select scanned document pages, receipts, or photos containing readable printed text.',
        icon: 'FileSearch',
        actionTip: 'High contrast between background and text yields optimal accuracy.',
        expectedOutput: 'Document page loaded for character recognition'
      },
      {
        stepNumber: 2,
        title: 'Run OCR Text Recognition',
        desc: 'Select language and click "Run OCR". The browser engine analyzes letter shapes and font glyphs.',
        icon: 'Cpu',
        actionTip: 'Fast neural character recognition executes 100% locally on your machine.',
        expectedOutput: 'Extracted digital text output'
      },
      {
        stepNumber: 3,
        title: 'Copy or Export Text',
        desc: 'Review extracted text in the live editor. Copy to clipboard or download as text / searchable file.',
        icon: 'Copy',
        actionTip: 'Great for turning scanned physical receipts into editable notes.',
        expectedOutput: 'Searchable editable text'
      }
    ]
  },

  // 3. CONVERT TO PDF
  'jpg-to-pdf': {
    title: 'JPG to PDF Walkthrough',
    tagline: 'Turn images (JPG, PNG, WebP) into high-resolution multi-page PDF documents.',
    badge: 'Converter',
    steps: [
      {
        stepNumber: 1,
        title: 'Select Multiple Images',
        desc: 'Upload one or multiple photos, charts, or diagrams in JPG, PNG, or WebP formats.',
        icon: 'Images',
        actionTip: 'Each uploaded image will become a clean, full-size page.',
        expectedOutput: 'Image queue displayed in studio'
      },
      {
        stepNumber: 2,
        title: 'Configure Layout & Margins',
        desc: 'Select page orientation (Portrait or Landscape) and choose margin padding (None, Small, Standard).',
        icon: 'Layout',
        actionTip: '"Fit to Page" maintains the original aspect ratio without distortion.',
        expectedOutput: 'Page layout options set'
      },
      {
        stepNumber: 3,
        title: 'Generate PDF Document',
        desc: 'Click "Convert Images to PDF". The tool compiles all photos into an organized document ready for sharing.',
        icon: 'DownloadCloud',
        actionTip: 'Crisp image quality is preserved without unnecessary downsampling.',
        expectedOutput: 'converted_images.pdf'
      }
    ]
  },

  'word-to-pdf': {
    title: 'Word to PDF Walkthrough',
    tagline: 'Convert Microsoft Word (.docx) documents into universally viewable PDFs.',
    badge: 'DOCX Converter',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Word Document',
        desc: 'Select your .docx or rich text document from your computer.',
        icon: 'FileText',
        actionTip: 'Supports headings, bullet lists, paragraph spacing, and styled text.',
        expectedOutput: 'Document parsed in memory'
      },
      {
        stepNumber: 2,
        title: 'Review Layout & Formatting',
        desc: 'The client-side engine maps document styles, line breaks, and fonts into standard PDF typography.',
        icon: 'Eye',
        actionTip: 'No Microsoft Office installation required on your computer.',
        expectedOutput: 'Print-ready layout structure'
      },
      {
        stepNumber: 3,
        title: 'Download Formatted PDF',
        desc: 'Click "Convert Word to PDF" to generate and download your finalized, unalterable PDF document.',
        icon: 'DownloadCloud',
        actionTip: 'Perfect for sharing resumes, invoices, and contracts safely.',
        expectedOutput: 'converted_document.pdf'
      }
    ]
  },

  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF Walkthrough',
    tagline: 'Convert presentation slide decks (.pptx) into clean multi-page PDF documents.',
    badge: 'PPTX Converter',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Slide Deck (.pptx)',
        desc: 'Select your presentation file containing slides, speaker notes, or diagrams.',
        icon: 'Presentation',
        actionTip: 'All slides are processed sequentially in their original deck order.',
        expectedOutput: 'Slides mapped to page indices'
      },
      {
        stepNumber: 2,
        title: 'Select Slide Aspect Ratio',
        desc: 'Choose between standard 16:9 widescreen or 4:3 presentation layout formats.',
        icon: 'Maximize',
        actionTip: 'Widescreen 16:9 is ideal for modern laptop screens and projectors.',
        expectedOutput: 'Configured slide orientation'
      },
      {
        stepNumber: 3,
        title: 'Export Presentation PDF',
        desc: 'Click "Convert PowerPoint to PDF" to download a crisp, presentation-ready PDF document.',
        icon: 'DownloadCloud',
        actionTip: 'Recipients can view your slides on any phone or tablet without PowerPoint.',
        expectedOutput: 'presentation_slides.pdf'
      }
    ]
  },

  'excel-to-pdf': {
    title: 'Excel to PDF Walkthrough',
    tagline: 'Transform Excel sheets (.xlsx, .csv) into clean tabular PDF reports.',
    badge: 'Sheet Converter',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Excel or CSV Sheet',
        desc: 'Drop your spreadsheet file (.xlsx, .xls, or .csv) containing data tables or financial records.',
        icon: 'FileSpreadsheet',
        actionTip: 'All rows, columns, and numeric formats are automatically parsed.',
        expectedOutput: 'Table preview displayed'
      },
      {
        stepNumber: 2,
        title: 'Review Table Alignment',
        desc: 'Choose page orientation (Landscape is recommended for wide tables with many columns).',
        icon: 'Table',
        actionTip: 'Enable gridlines for clear row separation and clean reading.',
        expectedOutput: 'Formatted table pagination'
      },
      {
        stepNumber: 3,
        title: 'Download Tabular PDF',
        desc: 'Click "Convert Excel to PDF" to generate your formatted printable data sheet.',
        icon: 'DownloadCloud',
        actionTip: 'Eliminates cell clipping and ensures clean borders.',
        expectedOutput: 'spreadsheet_report.pdf'
      }
    ]
  },

  'html-to-pdf': {
    title: 'HTML to PDF Walkthrough',
    tagline: 'Convert custom HTML code, web templates, or invoices into pixel-perfect PDF.',
    badge: 'Code Engine',
    steps: [
      {
        stepNumber: 1,
        title: 'Paste or Edit HTML Code',
        desc: 'Use the built-in live code editor to paste HTML/CSS or click "Load Sample Invoice" to start quickly.',
        icon: 'Code',
        actionTip: 'Full support for custom CSS styling, modern colors, and responsive tables.',
        expectedOutput: 'Live HTML code in editor'
      },
      {
        stepNumber: 2,
        title: 'Inspect Live Preview',
        desc: 'View real-time visual output in the split preview panel as you edit your markup and styles.',
        icon: 'Monitor',
        actionTip: 'Check typography, spacing, and logo alignment before saving.',
        expectedOutput: 'Pixel-perfect live rendering'
      },
      {
        stepNumber: 3,
        title: 'Render & Download PDF',
        desc: 'Click "Render HTML to PDF". The client renderer captures the DOM and produces a print-ready document.',
        icon: 'DownloadCloud',
        actionTip: 'Great for automated invoices, receipts, and web certificates.',
        expectedOutput: 'rendered_webpage.pdf'
      }
    ]
  },

  // 4. CONVERT FROM PDF
  'pdf-to-jpg': {
    title: 'PDF to JPG Walkthrough',
    tagline: 'Extract each PDF page into high-resolution JPG images or a single ZIP archive.',
    badge: 'Image Extractor',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Select the PDF document whose pages you want to turn into image files.',
        icon: 'UploadCloud',
        actionTip: 'Supports multi-page documents of any page count.',
        expectedOutput: 'Page gallery loaded'
      },
      {
        stepNumber: 2,
        title: 'Select Image Quality',
        desc: 'Choose output DPI resolution (Standard 150 DPI for web, High 300 DPI for print).',
        icon: 'Sliders',
        actionTip: '300 DPI produces crystal-clear images with sharp text.',
        expectedOutput: 'Resolution preset selected'
      },
      {
        stepNumber: 3,
        title: 'Export Images ZIP',
        desc: 'Click "Convert to JPG". All pages are converted into standalone JPG files packed into a convenient ZIP archive.',
        icon: 'FileArchive',
        actionTip: 'Extract the ZIP to access page_1.jpg, page_2.jpg, etc.',
        expectedOutput: 'pdf_images.zip'
      }
    ]
  },

  'pdf-to-word': {
    title: 'PDF to Word Walkthrough',
    tagline: 'Convert PDF documents into editable Microsoft Word (.docx) files.',
    badge: 'DOCX Generator',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Select any PDF document containing text, paragraphs, or reports that you need to edit.',
        icon: 'UploadCloud',
        actionTip: 'Client-side PDF.js worker extracts structured text without cloud uploads.',
        expectedOutput: 'Document analyzed in memory'
      },
      {
        stepNumber: 2,
        title: 'Text & Layout Reconstruction',
        desc: 'The engine parses lines, paragraphs, and sections into standard Microsoft Word document blocks.',
        icon: 'FileText',
        actionTip: 'Retains reading flow and paragraph breaks.',
        expectedOutput: 'Parsed Word document structure'
      },
      {
        stepNumber: 3,
        title: 'Download Editable .docx',
        desc: 'Click "Convert to Word DOCX". Open the resulting file directly in Microsoft Word, Google Docs, or LibreOffice.',
        icon: 'DownloadCloud',
        actionTip: 'Edit, retype, and modify content with full freedom.',
        expectedOutput: 'converted_document.docx'
      }
    ]
  },

  'pdf-to-powerpoint': {
    title: 'PDF to PowerPoint Walkthrough',
    tagline: 'Transform PDF pages into an editable presentation deck (.pptx slides).',
    badge: 'Deck Generator',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Choose the PDF presentation or document you want to convert into editable slides.',
        icon: 'UploadCloud',
        actionTip: 'Each PDF page maps directly to an individual presentation slide.',
        expectedOutput: 'Slides mapped to page indices'
      },
      {
        stepNumber: 2,
        title: 'Slide Layout Generation',
        desc: 'The engine scales pages into 16:9 widescreen presentation slides with extracted text and graphics.',
        icon: 'Presentation',
        actionTip: 'Ready for presentations in PowerPoint, Keynote, or Google Slides.',
        expectedOutput: 'Configured slide sequence'
      },
      {
        stepNumber: 3,
        title: 'Download .pptx Presentation',
        desc: 'Click "Convert to PowerPoint PPTX" to download your ready-to-present slide deck.',
        icon: 'DownloadCloud',
        actionTip: 'Deliver presentations seamlessly with full slide controls.',
        expectedOutput: 'presentation_deck.pptx'
      }
    ]
  },

  'pdf-to-excel': {
    title: 'PDF to Excel Walkthrough',
    tagline: 'Extract tables and numerical data from PDF into an Excel spreadsheet (.xlsx).',
    badge: 'Table Parser',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF with Data',
        desc: 'Select invoices, bank statements, or reports that contain tables and numbers.',
        icon: 'UploadCloud',
        actionTip: 'Works best on documents with structured rows and columns.',
        expectedOutput: 'PDF text streams analyzed'
      },
      {
        stepNumber: 2,
        title: 'Table Cell Detection',
        desc: 'The algorithm scans horizontal lines and tab stops to organize numbers and text into spreadsheet cells.',
        icon: 'Table',
        actionTip: 'Extracts values into proper numeric and string formats.',
        expectedOutput: 'Detected rows and columns'
      },
      {
        stepNumber: 3,
        title: 'Download Excel Spreadsheet',
        desc: 'Click "Convert to Excel (.xlsx)". Open the file in Microsoft Excel or Google Sheets to run formulas and charts.',
        icon: 'FileSpreadsheet',
        actionTip: 'Saves hours of manual data re-typing.',
        expectedOutput: 'extracted_data.xlsx'
      }
    ]
  },

  'pdf-to-pdfa': {
    title: 'PDF to PDF/A Walkthrough',
    tagline: 'Convert your document into ISO-compliant PDF/A format for long-term archiving.',
    badge: 'ISO Standard',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Standard PDF',
        desc: 'Select documents that need to be preserved for legal, governmental, or corporate archives.',
        icon: 'UploadCloud',
        actionTip: 'PDF/A ensures your file can be opened identically 30+ years into the future.',
        expectedOutput: 'Document metadata checked'
      },
      {
        stepNumber: 2,
        title: 'Embed Archival Compliance Profile',
        desc: 'The tool embeds standard sRGB color profiles, device-independent fonts, and XMP compliance metadata.',
        icon: 'ShieldCheck',
        actionTip: 'Removes non-compliant dynamic scripts and external font dependencies.',
        expectedOutput: 'ISO 19005-1 compliant structure'
      },
      {
        stepNumber: 3,
        title: 'Download PDF/A Archive',
        desc: 'Click "Convert to PDF/A" to download your certified archival document.',
        icon: 'DownloadCloud',
        actionTip: 'Accepted by legal courts, governments, and enterprise records systems worldwide.',
        expectedOutput: 'archival_document.pdf'
      }
    ]
  },

  // 5. EDIT PDF
  'rotate-pdf': {
    title: 'Rotate PDF Walkthrough',
    tagline: 'Rotate individual pages or all pages 90°, 180°, or 270° clockwise.',
    badge: 'Page Orientation',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Upload documents where scanned pages are upside down or oriented sideways.',
        icon: 'UploadCloud',
        actionTip: 'All pages are displayed with their current orientation angle.',
        expectedOutput: 'Visual page thumbnail gallery'
      },
      {
        stepNumber: 2,
        title: 'Rotate Individual or All Pages',
        desc: 'Click the rotate button on any specific thumbnail, or use "Rotate All 90°" in the controls pane.',
        icon: 'RotateCw',
        actionTip: 'Thumbnails update in real-time with smooth CSS rotation previews.',
        expectedOutput: 'Corrected page orientations'
      },
      {
        stepNumber: 3,
        title: 'Save Rotated PDF',
        desc: 'Click "Save Rotated PDF". The PDF dictionary is updated with permanent rotation angles.',
        icon: 'DownloadCloud',
        actionTip: 'Rotations are permanently embedded so they appear correctly on all devices.',
        expectedOutput: 'rotated_document.pdf'
      }
    ]
  },

  'add-page-numbers': {
    title: 'Add Page Numbers Walkthrough',
    tagline: 'Stamp customizable page numbers with positioning, format, and font styling.',
    badge: 'Pagination',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Select the document you wish to number sequentially.',
        icon: 'UploadCloud',
        actionTip: 'Total page count is calculated automatically.',
        expectedOutput: 'Document loaded'
      },
      {
        stepNumber: 2,
        title: 'Select Position & Format',
        desc: 'Choose where numbers should appear (Bottom Center, Bottom Right, Top Right) and number style (e.g. "Page {n} of {total}").',
        icon: 'Hash',
        actionTip: 'You can adjust font size, color, and margin padding to match your document style.',
        expectedOutput: 'Numbering settings configured'
      },
      {
        stepNumber: 3,
        title: 'Apply & Download',
        desc: 'Click "Apply Page Numbers". Every page is accurately numbered and ready for immediate download.',
        icon: 'CheckCircle2',
        actionTip: 'Crisp vector text stamped cleanly into the page margin.',
        expectedOutput: 'numbered_document.pdf'
      }
    ]
  },

  'add-watermark': {
    title: 'Add Watermark Walkthrough',
    tagline: 'Overlay branded text or stamps with custom opacity, rotation, and colors.',
    badge: 'Branding',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Select the file you want to protect with copyright or status watermarks.',
        icon: 'UploadCloud',
        actionTip: 'Watermark will be applied across every page uniformly.',
        expectedOutput: 'Document ready in studio'
      },
      {
        stepNumber: 2,
        title: 'Customize Watermark Text & Style',
        desc: 'Type your text (e.g. "CONFIDENTIAL", "DRAFT", "DO NOT COPY"), set rotation angle (45°), opacity, and color.',
        icon: 'Stamp',
        actionTip: 'A semi-transparent opacity (0.25 - 0.40) keeps document text fully readable.',
        expectedOutput: 'Watermark parameters set'
      },
      {
        stepNumber: 3,
        title: 'Stamp Watermark & Save',
        desc: 'Click "Apply Watermark". The vector stamp is overlaid onto all pages securely.',
        icon: 'DownloadCloud',
        actionTip: 'Cannot be easily removed by standard text selection.',
        expectedOutput: 'watermarked_document.pdf'
      }
    ]
  },

  'crop-pdf': {
    title: 'Crop PDF Walkthrough',
    tagline: 'Trim unwanted white margins or select a custom bounding box across pages.',
    badge: 'Trimmer',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Select the file with excessive white space, scanner borders, or printer marks.',
        icon: 'UploadCloud',
        actionTip: 'Works great for optimizing documents for reading on tablets or e-readers.',
        expectedOutput: 'Page dimensions displayed'
      },
      {
        stepNumber: 2,
        title: 'Adjust Margin Sliders',
        desc: 'Use the Top, Bottom, Left, and Right sliders to set exact crop margins in points.',
        icon: 'Crop',
        actionTip: 'The visual bounding box shows exactly which area will be preserved.',
        expectedOutput: 'Trim bounding box updated'
      },
      {
        stepNumber: 3,
        title: 'Apply Crop & Export',
        desc: 'Click "Apply Crop & Download". The PDF crop-box and media-box are permanently trimmed.',
        icon: 'DownloadCloud',
        actionTip: 'Decreases visual clutter and focuses attention on actual content.',
        expectedOutput: 'cropped_document.pdf'
      }
    ]
  },

  'edit-pdf': {
    title: 'Edit PDF Studio Walkthrough',
    tagline: 'Draw freehand, highlight text, add callouts, shapes, and stamps directly on any page.',
    badge: 'Full Suite',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Document & Choose Page',
        desc: 'Upload your PDF and navigate to the page you want to annotate using the page switcher.',
        icon: 'UploadCloud',
        actionTip: 'Full canvas rendering ensures high-precision drawing.',
        expectedOutput: 'Active page canvas loaded'
      },
      {
        stepNumber: 2,
        title: 'Select Drawing / Text Tools',
        desc: 'Pick your tool: Freehand Pen, Text Stamp, Highlighter, or Eraser. Choose stroke color and thickness.',
        icon: 'PenTool',
        actionTip: 'Use Neon Pink or Yellow highlighter for drawing attention to critical clauses.',
        expectedOutput: 'Selected tool active'
      },
      {
        stepNumber: 3,
        title: 'Annotate Directly on Page',
        desc: 'Draw, circle, write notes, or type anywhere on the interactive canvas overlay.',
        icon: 'Edit3',
        actionTip: 'Use "Clear Canvas" if you want to wipe drawings on the current page.',
        expectedOutput: 'Visual annotations created'
      },
      {
        stepNumber: 4,
        title: 'Export Edited PDF',
        desc: 'Click "Save & Export PDF". All canvas drawings are baked into the PDF document with original resolution.',
        icon: 'DownloadCloud',
        actionTip: 'Annotations are permanently embedded for any PDF reader.',
        expectedOutput: 'edited_document.pdf'
      }
    ]
  },

  'pdf-forms': {
    title: 'PDF Forms Walkthrough',
    tagline: 'Fill interactive PDF form fields, add text inputs, and check checkboxes easily.',
    badge: 'Form Filler',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Form',
        desc: 'Select interactive government, employment, or application forms containing AcroForm fields.',
        icon: 'UploadCloud',
        actionTip: 'All standard form fields (Text, Checkbox, Radio) are detected.',
        expectedOutput: 'Interactive form fields activated'
      },
      {
        stepNumber: 2,
        title: 'Fill Out Inputs & Checkboxes',
        desc: 'Click into any text field to type your answers, or click checkboxes to toggle checkmarks.',
        icon: 'CheckSquare',
        actionTip: 'Fields highlight neatly in Neon Pink as you focus on them.',
        expectedOutput: 'Filled form data'
      },
      {
        stepNumber: 3,
        title: 'Flatten & Save Completed Form',
        desc: 'Click "Flatten & Save Form". Your answers are permanently saved into the document for submission.',
        icon: 'DownloadCloud',
        actionTip: 'Ready for official submission without printing or physical scanning.',
        expectedOutput: 'completed_form.pdf'
      }
    ]
  },

  // 6. PDF SECURITY
  'unlock-pdf': {
    title: 'Unlock PDF Walkthrough',
    tagline: 'Remove security, passwords, and printing restrictions from locked PDFs.',
    badge: 'Decryptor',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Locked PDF File',
        desc: 'Select the password-protected or restricted PDF document you want to unlock.',
        icon: 'Lock',
        actionTip: 'Identifies standard PDF encryption structures automatically.',
        expectedOutput: 'Password prompt displayed'
      },
      {
        stepNumber: 2,
        title: 'Enter PDF Password',
        desc: 'Provide the document password once. The decryption engine decrypts the document stream in memory.',
        icon: 'Key',
        actionTip: 'All computation happens locally; your password is never transmitted across the web.',
        expectedOutput: 'Decrypted document stream'
      },
      {
        stepNumber: 3,
        title: 'Download Open Unrestricted PDF',
        desc: 'Click "Unlock & Save PDF". The new file has zero password prompts or printing/copying restrictions.',
        icon: 'Unlock',
        actionTip: 'Never type the password again when opening this document.',
        expectedOutput: 'unlocked_document.pdf'
      }
    ]
  },

  'protect-pdf': {
    title: 'Protect PDF Walkthrough',
    tagline: 'Encrypt your PDF with military-grade AES-256 Rev 5 encryption.',
    badge: 'AES-256 Vault',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Confidential PDF',
        desc: 'Select financial records, legal agreements, or sensitive documents you need to protect.',
        icon: 'UploadCloud',
        actionTip: '100% in-browser encryption using WebCrypto SubtleCrypto APIs.',
        expectedOutput: 'Document ready for encryption'
      },
      {
        stepNumber: 2,
        title: 'Enter Strong Passwords',
        desc: 'Enter User Password (required to open) and optional Owner Password (controls printing & editing permissions).',
        icon: 'Shield',
        actionTip: 'A password strength indicator helps you create a robust password.',
        expectedOutput: 'Encryption credentials set'
      },
      {
        stepNumber: 3,
        title: 'Encrypt with AES-256',
        desc: 'Click "Protect & Encrypt PDF". The engine derives 256-bit AES keys with SHA-256 and seals the document.',
        icon: 'Lock',
        actionTip: 'No one can open or print the file without the correct password.',
        expectedOutput: 'protected_document.pdf'
      }
    ]
  },

  'sign-pdf': {
    title: 'Sign PDF Walkthrough',
    tagline: 'Draw, type, or upload your electronic signature and place it onto any page.',
    badge: 'e-Signature',
    steps: [
      {
        stepNumber: 1,
        title: 'Create Your Signature',
        desc: 'Choose how to sign: Draw with smooth ink on canvas, Type calligraphy text, or Upload a signature image.',
        icon: 'FileSignature',
        actionTip: 'Select ink color (Black, Royal Blue, or Neon Pink).',
        expectedOutput: 'Generated transparent signature'
      },
      {
        stepNumber: 2,
        title: 'Place & Scale on Document',
        desc: 'Navigate to your signature line (e.g. Page 1 or final page), click to place, and adjust size to fit.',
        icon: 'Move',
        actionTip: 'Position precisely over "Sign Here" or date lines.',
        expectedOutput: 'Signature positioned on target page'
      },
      {
        stepNumber: 3,
        title: 'Burn Signature & Download',
        desc: 'Click "Sign & Download PDF". The signature is permanently embedded into the vector layer.',
        icon: 'CheckCircle2',
        actionTip: 'Legally compliant e-signature ready for contracts and NDAs.',
        expectedOutput: 'signed_document.pdf'
      }
    ]
  },

  'redact-pdf': {
    title: 'Redact PDF Walkthrough',
    tagline: 'Permanently blackout confidential text and sensitive data with zero data leakage.',
    badge: 'Permanent Redactor',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Sensitive PDF',
        desc: 'Select the document containing private data, social security numbers, or confidential names.',
        icon: 'UploadCloud',
        actionTip: 'Page preview renders at full zoom for accurate selection.',
        expectedOutput: 'Document page loaded on canvas'
      },
      {
        stepNumber: 2,
        title: 'Draw Blackout Redaction Boxes',
        desc: 'Click and drag your mouse across any sensitive text or figures to draw solid black redaction rectangles.',
        icon: 'EyeOff',
        actionTip: 'You can add multiple redaction boxes on any page.',
        expectedOutput: 'Redaction boxes highlighted'
      },
      {
        stepNumber: 3,
        title: 'Apply Permanent Sanitization',
        desc: 'Click "Apply Redactions & Save". The underlying content is permanently stripped from the PDF streams.',
        icon: 'ShieldAlert',
        actionTip: 'Cannot be undone or revealed by copy-pasting—100% permanent security.',
        expectedOutput: 'redacted_document.pdf'
      }
    ]
  },

  'compare-pdf': {
    title: 'Compare PDF Walkthrough',
    tagline: 'Side-by-side comparison with synchronous scrolling and visual difference highlights.',
    badge: 'Diff Visualizer',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Original & Modified PDFs',
        desc: 'Upload Document A (original version) and Document B (revised version) into the dual workspace.',
        icon: 'Columns',
        actionTip: 'Works with contracts, revised drafts, or legal amendments.',
        expectedOutput: 'Both documents loaded side-by-side'
      },
      {
        stepNumber: 2,
        title: 'Synchronized Dual Scrolling',
        desc: 'Scroll either document pane. Both documents navigate in sync so you can compare line-by-line.',
        icon: 'MoveVertical',
        actionTip: 'Toggle "Sync Scrolling" on or off to inspect specific mismatched pages.',
        expectedOutput: 'Synchronous side-by-side navigation'
      },
      {
        stepNumber: 3,
        title: 'Inspect Changes & Discrepancies',
        desc: 'Review structural differences, modified clauses, or page count variances in the comparison readout.',
        icon: 'CheckSquare',
        actionTip: 'Identify unauthorized edits in seconds before signing contracts.',
        expectedOutput: 'Full comparison overview'
      }
    ]
  },

  // 7. PDF INTELLIGENCE
  'ai-summarizer': {
    title: 'AI Summarizer Walkthrough',
    tagline: 'Extract key takeaways, summary bullets, read-time, and executive outline with AI.',
    badge: 'In-Browser AI',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Long Document or Paper',
        desc: 'Select research papers, lengthy reports, or legal agreements you want to digest quickly.',
        icon: 'UploadCloud',
        actionTip: 'Extracts full text locally without sending private data to cloud LLMs.',
        expectedOutput: 'Full document text indexed'
      },
      {
        stepNumber: 2,
        title: 'Run NLP & TF-IDF Extraction',
        desc: 'The client AI engine runs sentence importance scoring, word frequency metrics, and reading time analysis.',
        icon: 'Sparkles',
        actionTip: 'Generates an Executive Summary and bulleted Key Highlights.',
        expectedOutput: 'Structured AI insights & statistics'
      },
      {
        stepNumber: 3,
        title: 'Read or Export AI Summary PDF',
        desc: 'Review highlights on screen or click "Export AI Summary PDF" to save a beautifully formatted 1-page report.',
        icon: 'FileText',
        actionTip: 'Save hours of reading time on long multi-page publications.',
        expectedOutput: 'ai_summary.pdf'
      }
    ]
  },

  'translate-pdf': {
    title: 'Translate PDF Walkthrough',
    tagline: 'Translate document contents into Hindi, Spanish, French, German, and 10+ languages.',
    badge: 'Multilingual',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Document',
        desc: 'Select any foreign language PDF document you want to read in your native language.',
        icon: 'UploadCloud',
        actionTip: 'Extracts document paragraphs while maintaining textual flow.',
        expectedOutput: 'Original text extracted'
      },
      {
        stepNumber: 2,
        title: 'Select Target Language',
        desc: 'Choose from Hindi, Spanish, French, German, Japanese, Chinese, Arabic, and more from the dropdown.',
        icon: 'Languages',
        actionTip: 'Side-by-side bilingual view lets you cross-reference original and translated text.',
        expectedOutput: 'Target language selected'
      },
      {
        stepNumber: 3,
        title: 'Translate & Download',
        desc: 'Click "Translate Now". The engine translates text and exports your translated text file.',
        icon: 'DownloadCloud',
        actionTip: 'Understand international documents instantly in your preferred language.',
        expectedOutput: 'translated_document.txt'
      }
    ]
  },

  'pdf-to-markdown': {
    title: 'PDF to Markdown Walkthrough',
    tagline: 'Convert PDF headings, paragraphs, and tables into clean formatted Markdown (.md).',
    badge: 'Markdown Engine',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload PDF Document',
        desc: 'Select whitepapers, documentation, or articles you want to convert into Markdown.',
        icon: 'UploadCloud',
        actionTip: 'Preserves document hierarchy and semantic structure.',
        expectedOutput: 'Document analyzed'
      },
      {
        stepNumber: 2,
        title: 'Inspect Formatted Markdown',
        desc: 'Headings are converted into # and ## tags, bullet lists into - items, and tables into GitHub markdown tables.',
        icon: 'FileCode',
        actionTip: 'Edit or tweak Markdown syntax directly inside the live code area.',
        expectedOutput: 'Clean markdown syntax'
      },
      {
        stepNumber: 3,
        title: 'Copy or Download .md File',
        desc: 'Click "Copy Markdown" to paste into Notion or Obsidian, or click "Download .md" to save as a file.',
        icon: 'DownloadCloud',
        actionTip: 'Ready for GitHub READMEs, static site generators, and AI knowledge bases.',
        expectedOutput: 'document.md'
      }
    ]
  }
};

/**
 * Helper to get onboarding guide for a tool ID with graceful fallback
 */
export function getToolOnboarding(toolId, toolName = 'PDF Tool') {
  if (TOOL_ONBOARDING_DATA[toolId]) {
    return TOOL_ONBOARDING_DATA[toolId];
  }
  return {
    title: `${toolName} Walkthrough`,
    tagline: `Step-by-step guide to using ${toolName} with maximum efficiency.`,
    badge: 'Tool Guide',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload or Select Your File',
        desc: `Drag and drop your file into the upload zone to begin using ${toolName}.`,
        icon: 'UploadCloud',
        actionTip: '100% Client-side. Your file never leaves your machine.',
        expectedOutput: 'File loaded into workspace'
      },
      {
        stepNumber: 2,
        title: 'Adjust Options & Settings',
        desc: 'Customize the tool options in the right control panel according to your requirements.',
        icon: 'Sliders',
        actionTip: 'All settings update in real-time.',
        expectedOutput: 'Options configured'
      },
      {
        stepNumber: 3,
        title: 'Execute & Download Result',
        desc: `Click the primary action button to process and instantly download your output file.`,
        icon: 'DownloadCloud',
        actionTip: 'Super-fast processing directly in your browser.',
        expectedOutput: 'Processed output file'
      }
    ]
  };
}
