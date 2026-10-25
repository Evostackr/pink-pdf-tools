import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Download, Check, Undo, Redo, Trash2, 
  PenTool, Highlighter, Type, FileSignature, 
  ChevronUp, ChevronDown, AlignLeft, AlignCenter, AlignRight, 
  Bold, Italic, Palette, Sliders, X, Sparkles, Layers,
  ZoomIn, ZoomOut, Save
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DocumentStore } from '../utils/documentStore';
import { fileToArrayBuffer, loadPdfDoc, renderPageToCanvas, downloadBlob } from '../utils/pdfHelper';

// Predefined iOS highlighter fluorescent colors
const HIGHLIGHTER_COLORS = [
  { name: 'Fluorescent Yellow', value: 'rgba(255, 235, 59, 0.45)', hex: '#ffeb3b' },
  { name: 'Neon Pink', value: 'rgba(255, 45, 117, 0.45)', hex: '#ff2d75' },
  { name: 'Emerald Green', value: 'rgba(0, 230, 118, 0.45)', hex: '#00e676' },
  { name: 'Electric Cyan', value: 'rgba(0, 229, 255, 0.45)', hex: '#00e5ff' },
  { name: 'Sunset Orange', value: 'rgba(255, 145, 0, 0.45)', hex: '#ff9100' },
];

const PEN_COLORS = [
  '#000000', '#ffffff', '#ff2d75', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6'
];

const FONTS_LIST = [
  { id: 'Helvetica', name: 'Helvetica / Sans' },
  { id: 'Arial', name: 'Arial' },
  { id: 'Times New Roman', name: 'Times New Roman' },
  { id: 'Courier New', name: 'Courier / Mono' },
  { id: 'Georgia', name: 'Georgia' },
];

export default function IOSPDFEditorStudio({ 
  file, 
  onClose, 
  showToast 
}) {
  const [docPdfBytes, setDocPdfBytes] = useState(null);
  const [pageThumbnails, setPageThumbnails] = useState([]);
  const [activeTool, setActiveTool] = useState('highlighter'); // 'highlighter', 'pen', 'text', 'signature'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  // Pen / Highlighter settings (Mirroring iOS PencilKit)
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(3);
  const [highlighterColor, setHighlighterColor] = useState(HIGHLIGHTER_COLORS[0]);
  const [highlighterSize, setHighlighterSize] = useState(24);

  // Per-page drawings state: { [pageIndex]: [{ type, points, color, size }] }
  const [drawingsPerPage, setDrawingsPerPage] = useState({});
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);

  // Text Stickers state (Mirroring iOS StickerView & KeyboardTopView)
  const [textStickers, setTextStickers] = useState([
    {
      id: 'st-init',
      page: 1,
      x: 60,
      y: 120,
      text: 'Reviewed & Approved',
      fontSize: 18,
      fontFamily: 'Helvetica',
      fontColor: '#000000',
      bgColor: '#ffeb3b',
      isBold: true,
      isItalic: false,
      align: 'center',
    }
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState('st-init');

  // Signature modal state (Mirroring iOS SignatureViewController)
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [sigColor, setSigColor] = useState('#000000');
  const sigCanvasRef = useRef(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [sigStrokes, setSigStrokes] = useState([]);

  // Active page drawing canvas ref
  const canvasRefs = useRef({});

  // 1. Initialize document
  useEffect(() => {
    let isCancelled = false;

    async function initDocument() {
      try {
        let arrayBuffer;
        if (file?.blobData) {
          arrayBuffer = await file.blobData.arrayBuffer();
        } else {
          // Create fallback default clean multi-page PDF
          const sampleDoc = await PDFDocument.create();
          for (let p = 1; p <= 3; p++) {
            const page = sampleDoc.addPage([595.28, 841.89]);
            const font = await sampleDoc.embedFont(StandardFonts.HelveticaBold);
            const regular = await sampleDoc.embedFont(StandardFonts.Helvetica);
            page.drawText(`${file?.filesName || 'Confidential Document'}`, {
              x: 50,
              y: 770,
              size: 20,
              font,
              color: rgb(0.1, 0.1, 0.15)
            });
            page.drawText(`Page ${p} of 3 • Native iOS PDFKit & PencilKit Mode`, {
              x: 50,
              y: 745,
              size: 11,
              font: regular,
              color: rgb(0.5, 0.5, 0.6)
            });

            // Sample document body lines
            for (let i = 0; i < 18; i++) {
              page.drawRectangle({
                x: 50,
                y: 690 - i * 32,
                width: 495 * (0.7 + (i % 4) * 0.1),
                height: 10,
                color: rgb(0.9, 0.92, 0.95),
              });
            }
          }
          arrayBuffer = await sampleDoc.save();
        }

        if (isCancelled) return;
        setDocPdfBytes(arrayBuffer);

        // Render thumbnails using PDF.js
        const pdf = await loadPdfDoc(arrayBuffer);
        setTotalPages(pdf.numPages);
        const thumbs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const thumbUrl = await renderPageToCanvas(pdf, i, 1.4);
          thumbs.push({ pageNum: i, url: thumbUrl });
        }
        if (!isCancelled) {
          setPageThumbnails(thumbs);
        }
      } catch (err) {
        console.error('Error loading PDF in iOS Studio:', err);
      }
    }

    initDocument();
    return () => {
      isCancelled = true;
    };
  }, [file]);

  // Redraw canvas whenever drawings update
  useEffect(() => {
    pageThumbnails.forEach(({ pageNum }) => {
      const canvas = canvasRefs.current[pageNum];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pageDrawings = drawingsPerPage[pageNum] || [];
      pageDrawings.forEach(stroke => {
        if (!stroke.points || stroke.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = stroke.type === 'highlighter' ? 'square' : 'round';
        ctx.lineJoin = stroke.type === 'highlighter' ? 'bevel' : 'round';
        ctx.stroke();
      });
    });
  }, [drawingsPerPage, pageThumbnails]);

  // Canvas drawing handlers
  const handlePointerDown = (e, pageNum) => {
    if (activeTool === 'text') return;
    const canvas = canvasRefs.current[pageNum];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setCurrentPage(pageNum);

    const stroke = {
      type: activeTool,
      color: activeTool === 'highlighter' ? highlighterColor.value : penColor,
      size: activeTool === 'highlighter' ? highlighterSize : penSize,
      points: [{ x, y }]
    };
    setCurrentStroke(stroke);
  };

  const handlePointerMove = (e, pageNum) => {
    if (!isDrawing || !currentStroke) return;
    const canvas = canvasRefs.current[pageNum];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newPoints = [...currentStroke.points, { x, y }];
    const updatedStroke = { ...currentStroke, points: newPoints };
    setCurrentStroke(updatedStroke);

    // Live draw on canvas
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(currentStroke.points[currentStroke.points.length - 1].x, currentStroke.points[currentStroke.points.length - 1].y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = updatedStroke.color;
    ctx.lineWidth = updatedStroke.size;
    ctx.lineCap = updatedStroke.type === 'highlighter' ? 'square' : 'round';
    ctx.stroke();
  };

  const handlePointerUp = (pageNum) => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);

    const existing = drawingsPerPage[pageNum] || [];
    const updated = [...existing, currentStroke];

    // Push to undo stack
    setUndoStack(prev => [...prev, { pageNum, stroke: currentStroke }]);
    setRedoStack([]);

    setDrawingsPerPage(prev => ({
      ...prev,
      [pageNum]: updated
    }));
    setCurrentStroke(null);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastAction]);

    setDrawingsPerPage(prev => {
      const pageStrokes = prev[lastAction.pageNum] || [];
      return {
        ...prev,
        [lastAction.pageNum]: pageStrokes.slice(0, -1)
      };
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextAction = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, nextAction]);

    setDrawingsPerPage(prev => {
      const pageStrokes = prev[nextAction.pageNum] || [];
      return {
        ...prev,
        [nextAction.pageNum]: [...pageStrokes, nextAction.stroke]
      };
    });
  };

  const handleClearPage = () => {
    setDrawingsPerPage(prev => ({
      ...prev,
      [currentPage]: []
    }));
    showToast(`Page ${currentPage} annotations cleared`);
  };

  // Text Sticker Management (Mirroring iOS KeyboardTopView)
  const addTextSticker = () => {
    const newSticker = {
      id: 'st-' + Date.now(),
      page: currentPage,
      x: 100,
      y: 180 + (textStickers.length * 20),
      text: 'Tap to type text',
      fontSize: 18,
      fontFamily: 'Helvetica',
      fontColor: '#000000',
      bgColor: 'transparent',
      isBold: false,
      isItalic: false,
      align: 'left'
    };
    setTextStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    setActiveTool('text');
  };

  const updateSelectedSticker = (key, value) => {
    setTextStickers(prev => prev.map(s => {
      if (s.id === selectedStickerId) {
        return { ...s, [key]: value };
      }
      return s;
    }));
  };

  const deleteSelectedSticker = () => {
    setTextStickers(prev => prev.filter(s => s.id !== selectedStickerId));
    setSelectedStickerId(null);
  };

  // Signature canvas handlers (SwiftSignatureView)
  const handleSigPointerDown = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawingSig(true);
    setSigStrokes(prev => [...prev, [{ x, y }]]);
  };

  const handleSigPointerMove = (e) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSigStrokes(prev => {
      const copy = [...prev];
      const current = copy[copy.length - 1];
      copy[copy.length - 1] = [...current, { x, y }];
      return copy;
    });

    const ctx = canvas.getContext('2d');
    const lastStroke = sigStrokes[sigStrokes.length - 1];
    if (lastStroke && lastStroke.length > 0) {
      const prevPoint = lastStroke[lastStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = sigColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const handleApplySignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    // Add signature as image sticker
    const newSticker = {
      id: 'sig-' + Date.now(),
      page: currentPage,
      x: 120,
      y: 350,
      isImage: true,
      imageUrl: dataUrl,
      width: 180,
      height: 70
    };
    setTextStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    setShowSignatureModal(false);
    showToast('Signature placed on document!');
  };

  // Flatten and Save PDF (iOS SavePDF logic in PDFEditorModel)
  const handleSaveAndExport = async () => {
    setIsSaving(true);
    try {
      const basePdf = await PDFDocument.load(docPdfBytes);
      const pages = basePdf.getPages();

      // For each page, overlay drawings and stickers
      for (let i = 0; i < pages.length; i++) {
        const pageNum = i + 1;
        const page = pages[i];
        const { width: pWidth, height: pHeight } = page.getSize();

        // 1. Burn canvas drawings onto page
        const canvas = canvasRefs.current[pageNum];
        if (canvas) {
          const drawingDataUrl = canvas.toDataURL('image/png');
          const pngBytes = await fetch(drawingDataUrl).then(res => res.arrayBuffer());
          const pngImage = await basePdf.embedPng(pngBytes);
          page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: pWidth,
            height: pHeight,
          });
        }

        // 2. Burn text & signature stickers
        const pageStickers = textStickers.filter(s => s.page === pageNum);
        for (const st of pageStickers) {
          if (st.isImage && st.imageUrl) {
            const imgBytes = await fetch(st.imageUrl).then(res => res.arrayBuffer());
            const imgEmbed = await basePdf.embedPng(imgBytes);
            page.drawImage(imgEmbed, {
              x: st.x,
              y: pHeight - st.y - (st.height || 70),
              width: st.width || 180,
              height: st.height || 70,
            });
          } else {
            // Text sticker
            const helvetica = await basePdf.embedFont(
              st.isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica
            );
            // Draw background if not transparent
            if (st.bgColor && st.bgColor !== 'transparent') {
              page.drawRectangle({
                x: st.x - 6,
                y: pHeight - st.y - st.fontSize - 6,
                width: (st.text.length * (st.fontSize * 0.58)) + 12,
                height: st.fontSize + 12,
                color: rgb(1, 0.92, 0.23), // Yellow badge
                opacity: 0.85
              });
            }
            page.drawText(st.text, {
              x: st.x,
              y: pHeight - st.y - st.fontSize,
              size: st.fontSize || 16,
              font: helvetica,
              color: rgb(0, 0, 0)
            });
          }
        }
      }

      const finalBytes = await basePdf.save();
      const finalBlob = new Blob([finalBytes], { type: 'application/pdf' });
      const finalFileName = `${file?.filesName || 'Edited_Document'}_ProEdited.pdf`;

      // Save to Saved Creations library (SaveFilesVC)
      DocumentStore.addSavedCreation({
        name: finalFileName,
        size: `${(finalBytes.byteLength / 1048576).toFixed(2)} MB`,
        pageCount: pages.length,
        thumbnail: pageThumbnails[0]?.url,
        blob: finalBlob
      });

      // Download file to user
      downloadBlob(finalBlob, finalFileName);
      showToast(`Saved & Exported "${finalFileName}" successfully!`);
      setIsSaving(false);
    } catch (err) {
      console.error('Error saving PDF in iOS editor:', err);
      showToast('Error saving document');
      setIsSaving(false);
    }
  };

  const activeSticker = textStickers.find(s => s.id === selectedStickerId);

  return (
    <div className="ios-editor-studio">
      {/* Top Navigation Bar (Mirroring iOS PDFEditorVC TopBar) */}
      <header className="ios-editor-header">
        <div className="ios-header-left">
          <button className="ios-btn-icon" onClick={onClose} title="Back to Library">
            <ArrowLeft size={20} />
          </button>
          <div className="ios-doc-info">
            <h2 className="ios-doc-name">{file?.filesName || 'PDF Document'}.pdf</h2>
            <div className="ios-doc-meta">
              <span>Page {currentPage} of {totalPages}</span>
              <span>•</span>
              <span className="ios-badge-pro">iOS PencilKit & Markup</span>
            </div>
          </div>
        </div>

        {/* Center Tool Selector (Highlighter, Signature, Add Text) */}
        <div className="ios-tool-picker">
          <button 
            className={`ios-tool-tab ${activeTool === 'highlighter' ? 'active' : ''}`}
            onClick={() => setActiveTool('highlighter')}
            title="Fluorescent Highlighter"
          >
            <Highlighter size={17} />
            <span>Highlighter</span>
          </button>

          <button 
            className={`ios-tool-tab ${activeTool === 'pen' ? 'active' : ''}`}
            onClick={() => setActiveTool('pen')}
            title="Fine Drawing Pen"
          >
            <PenTool size={17} />
            <span>Pen</span>
          </button>

          <button 
            className={`ios-tool-tab ${activeTool === 'text' ? 'active' : ''}`}
            onClick={() => {
              setActiveTool('text');
              addTextSticker();
            }}
            title="Add Movable Text Sticker"
          >
            <Type size={17} />
            <span>Add Text</span>
          </button>

          <button 
            className="ios-tool-tab"
            onClick={() => setShowSignatureModal(true)}
            title="Digital Signature (SwiftSignatureView)"
          >
            <FileSignature size={17} />
            <span>Signature</span>
          </button>
        </div>

        {/* Right Actions: Undo/Redo/Save */}
        <div className="ios-header-right">
          <button 
            className="ios-btn-icon" 
            onClick={handleUndo} 
            disabled={undoStack.length === 0}
            title="Undo Stroke"
          >
            <Undo size={18} />
          </button>
          <button 
            className="ios-btn-icon" 
            onClick={handleRedo} 
            disabled={redoStack.length === 0}
            title="Redo Stroke"
          >
            <Redo size={18} />
          </button>
          <button 
            className="ios-btn-icon text-danger" 
            onClick={handleClearPage}
            title="Clear Current Page"
          >
            <Trash2 size={18} />
          </button>

          <button 
            className="ios-btn-save"
            onClick={handleSaveAndExport}
            disabled={isSaving}
          >
            {isSaving ? <Sparkles size={16} className="spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Flattening...' : 'Save PDF'}</span>
          </button>
        </div>
      </header>

      {/* Sub-Toolbar (KeyboardTopView for Text / Palette for Highlighter) */}
      <div className="ios-sub-toolbar">
        {activeTool === 'highlighter' && (
          <div className="ios-color-bar">
            <span className="ios-toolbar-label">Highlighter Ink:</span>
            <div className="ios-color-swatches">
              {HIGHLIGHTER_COLORS.map(c => (
                <button 
                  key={c.name}
                  className={`ios-swatch ${highlighterColor.name === c.name ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setHighlighterColor(c)}
                  title={c.name}
                />
              ))}
            </div>
            <span className="ios-toolbar-divider" />
            <span className="ios-toolbar-label">Thickness:</span>
            <input 
              type="range" 
              min="12" 
              max="48" 
              value={highlighterSize}
              onChange={(e) => setHighlighterSize(Number(e.target.value))}
              className="ios-range-slider"
            />
            <span className="ios-range-val">{highlighterSize}px</span>
          </div>
        )}

        {activeTool === 'pen' && (
          <div className="ios-color-bar">
            <span className="ios-toolbar-label">Pen Color:</span>
            <div className="ios-color-swatches">
              {PEN_COLORS.map(color => (
                <button 
                  key={color}
                  className={`ios-swatch ${penColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPenColor(color)}
                />
              ))}
            </div>
            <span className="ios-toolbar-divider" />
            <span className="ios-toolbar-label">Stroke Size:</span>
            <input 
              type="range" 
              min="1" 
              max="16" 
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              className="ios-range-slider"
            />
            <span className="ios-range-val">{penSize}px</span>
          </div>
        )}

        {/* KeyboardTopView (Text formatting toolbar matching iOS keyboardTopView.swift) */}
        {activeTool === 'text' && activeSticker && !activeSticker.isImage && (
          <div className="ios-keyboard-top-view">
            <div className="ios-stepper-group">
              <span className="ios-toolbar-label">Size:</span>
              <button 
                className="ios-stepper-btn"
                onClick={() => updateSelectedSticker('fontSize', Math.max(10, (activeSticker.fontSize || 18) - 2))}
              >
                <ChevronDown size={14} />
              </button>
              <span className="ios-stepper-val">{activeSticker.fontSize || 18}pt</span>
              <button 
                className="ios-stepper-btn"
                onClick={() => updateSelectedSticker('fontSize', Math.min(99, (activeSticker.fontSize || 18) + 2))}
              >
                <ChevronUp size={14} />
              </button>
            </div>

            <span className="ios-toolbar-divider" />

            <div className="ios-font-selector">
              <select 
                value={activeSticker.fontFamily || 'Helvetica'}
                onChange={(e) => updateSelectedSticker('fontFamily', e.target.value)}
                className="ios-select"
              >
                {FONTS_LIST.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <span className="ios-toolbar-divider" />

            {/* Alignment & Style Buttons */}
            <div className="ios-style-buttons">
              <button 
                className={`ios-mini-btn ${activeSticker.isBold ? 'active' : ''}`}
                onClick={() => updateSelectedSticker('isBold', !activeSticker.isBold)}
                title="Bold"
              >
                <Bold size={15} />
              </button>
              <button 
                className={`ios-mini-btn ${activeSticker.isItalic ? 'active' : ''}`}
                onClick={() => updateSelectedSticker('isItalic', !activeSticker.isItalic)}
                title="Italic"
              >
                <Italic size={15} />
              </button>
            </div>

            <span className="ios-toolbar-divider" />

            {/* Delete Sticker */}
            <button 
              className="ios-mini-btn text-danger"
              onClick={deleteSelectedSticker}
              title="Delete Text Sticker"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Main Multi-Page Canvas Viewer (DMScrollBar continuous scroll) */}
      <main className="ios-editor-viewport">
        {/* Floating Page Indicator Pill (Mirroring iOS DMScrollBar Configuration) */}
        <div className="ios-page-indicator-pill">
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        <div className="ios-pages-stack">
          {pageThumbnails.map(({ pageNum, url }) => (
            <div 
              key={pageNum}
              className={`ios-page-card ${currentPage === pageNum ? 'active-page' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              <div className="ios-page-header-tag">Page {pageNum}</div>
              
              <div className="ios-page-canvas-wrapper" style={{ position: 'relative' }}>
                {/* Background PDF Page Image */}
                <img 
                  src={url} 
                  alt={`Page ${pageNum}`} 
                  className="ios-page-bg-img"
                  draggable={false}
                />

                {/* Transparent Interactive Drawing Overlay Canvas (PencilKit View) */}
                <canvas 
                  ref={el => canvasRefs.current[pageNum] = el}
                  width={800}
                  height={1130}
                  className="ios-drawing-canvas"
                  onPointerDown={(e) => handlePointerDown(e, pageNum)}
                  onPointerMove={(e) => handlePointerMove(e, pageNum)}
                  onPointerUp={() => handlePointerUp(pageNum)}
                  onPointerLeave={() => handlePointerUp(pageNum)}
                />

                {/* Text & Signature Floating Stickers (iOS StickerView) */}
                {textStickers.filter(s => s.page === pageNum).map(st => (
                  <div 
                    key={st.id}
                    className={`ios-sticker-container ${selectedStickerId === st.id ? 'selected-sticker' : ''}`}
                    style={{
                      left: st.x,
                      top: st.y,
                      position: 'absolute',
                      cursor: 'move'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(st.id);
                    }}
                  >
                    {st.isImage ? (
                      <div className="ios-signature-sticker">
                        <img src={st.imageUrl} alt="Signature" style={{ width: st.width, height: st.height }} />
                        {selectedStickerId === st.id && (
                          <div className="ios-sticker-handlers">
                            <button 
                              className="ios-handler-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTextStickers(prev => prev.filter(x => x.id !== st.id));
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="ios-text-sticker"
                        style={{
                          fontSize: `${st.fontSize}px`,
                          fontFamily: st.fontFamily,
                          fontWeight: st.isBold ? 'bold' : 'normal',
                          fontStyle: st.isItalic ? 'italic' : 'normal',
                          color: st.fontColor,
                          backgroundColor: st.bgColor || 'transparent',
                        }}
                      >
                        <input 
                          type="text"
                          value={st.text}
                          onChange={(e) => updateSelectedSticker('text', e.target.value)}
                          className="ios-sticker-input"
                          style={{
                            fontSize: `${st.fontSize}px`,
                            fontFamily: st.fontFamily,
                            fontWeight: st.isBold ? 'bold' : 'normal',
                          }}
                        />
                        {selectedStickerId === st.id && (
                          <div className="ios-sticker-handlers">
                            <button 
                              className="ios-handler-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTextStickers(prev => prev.filter(x => x.id !== st.id));
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Signature Modal (Mirroring iOS SignatureViewController.swift) */}
      {showSignatureModal && (
        <div className="ios-modal-backdrop" onClick={() => setShowSignatureModal(false)}>
          <div className="ios-signature-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ios-modal-header">
              <h3 className="ios-modal-title">Draw Digital Signature</h3>
              <button className="ios-btn-icon" onClick={() => setShowSignatureModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ios-sig-canvas-wrap">
              <canvas 
                ref={sigCanvasRef}
                width={500}
                height={220}
                className="ios-sig-canvas"
                onPointerDown={handleSigPointerDown}
                onPointerMove={handleSigPointerMove}
                onPointerUp={() => setIsDrawingSig(false)}
                onPointerLeave={() => setIsDrawingSig(false)}
              />
              <span className="ios-sig-hint">Sign above with your finger or mouse</span>
            </div>

            <div className="ios-sig-footer">
              <div className="ios-sig-colors">
                {['#000000', '#1d4ed8', '#ff2d75'].map(c => (
                  <button 
                    key={c}
                    className={`ios-swatch ${sigColor === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setSigColor(c)}
                  />
                ))}
              </div>

              <div className="ios-sig-actions">
                <button 
                  className="ios-btn-text" 
                  onClick={() => {
                    const canvas = sigCanvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      setSigStrokes([]);
                    }
                  }}
                >
                  Clear
                </button>
                <button 
                  className="ios-btn-primary"
                  onClick={handleApplySignature}
                >
                  <Check size={16} />
                  <span>Place Signature</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
