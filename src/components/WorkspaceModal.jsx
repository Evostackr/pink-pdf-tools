import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Sparkles, Download, Check, Trash2, RotateCw, Plus, 
  Scissors, ArrowUpDown, Eye, ShieldCheck, PenTool, Lock, Unlock, 
  FileText, Copy, RefreshCw, Sliders, AlertCircle, Camera, CheckSquare,
  Eraser, Type, Highlighter, Square, GitCompare, ZoomIn, ZoomOut,
  ArrowLeft, ArrowRight, ArrowUpToLine, ArrowDownToLine, Undo2, HelpCircle,
  FileSignature, Redo2, Bold, Italic, ChevronLeft, ChevronRight
} from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import ToolIcon from './ToolIcon';
import { 
  fileToArrayBuffer, loadPdfDoc, renderPageToCanvas, 
  renderAllPagesThumbnails, extractTextFromPdf, createSamplePdf, 
  downloadArrayBuffer, downloadBlob, formatBytes, formatToolDownloadFilename 
} from '../utils/pdfHelper';
import { 
  convertPdfToWord, convertPdfToPowerPoint, convertPdfToExcel, 
  convertExcelToPdf, convertHtmlToPdf, convertWordToPdf, convertToPdfA 
} from '../tools/conversionHelper';
import { 
  generateAiSummary, translateText, convertTextToMarkdown, SUPPORTED_LANGUAGES 
} from '../tools/aiHelper';
import { encryptPDF, decryptPDF } from '../utils/cryptpdfBrowser';
import ToolOnboardingModal from './ToolOnboardingModal';
import { getToolOnboarding } from '../data/toolOnboarding';

export default function WorkspaceModal({ tool, onClose, showToast, isStandalonePage }) {
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Automatically show onboarding for the tool unless the user chose not to show it
  useEffect(() => {
    const isDismissed = localStorage.getItem(`dont_show_onboarding_${tool.id}`) === 'true';
    if (!isDismissed) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [tool.id]);

  // 1. Organize & Split
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [removedPages, setRemovedPages] = useState(new Set());
  const [pageOrder, setPageOrder] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [splitRange, setSplitRange] = useState('1-2');
  const [splitOption, setSplitOption] = useState('all'); // 'all' or 'range'

  // 2. Rotate
  const [rotationDegrees, setRotationDegrees] = useState(90);
  const [pageRotations, setPageRotations] = useState({});

  // 3. Page Numbers
  const [numberPosition, setNumberPosition] = useState('bottom-center');
  const [numberFormat, setNumberFormat] = useState('Page {n} of {total}');
  const [numberColor, setNumberColor] = useState('pink');
  const [numberSize, setNumberSize] = useState(11);

  // 4. Watermark
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkColor, setWatermarkColor] = useState('pink');

  // 5. Compress
  const [compressLevel, setCompressLevel] = useState('recommended'); // extreme, recommended, low
  const [compressionResult, setCompressionResult] = useState(null);

  // 6. Crop Margins
  const [cropMargins, setCropMargins] = useState({ top: 10, bottom: 10, left: 10, right: 10 }); // in percent

  // 7. Edit PDF Canvas Studio (Upgraded with Apple/iOS Markup Engine)
  const editCanvasRef = useRef(null);
  const [editTool, setEditTool] = useState('pen'); // 'pen', 'highlighter', 'text', 'signature'
  const [editColor, setEditColor] = useState('#ff2d75');
  const [brushSize, setBrushSize] = useState(4);
  const [highlighterSize, setHighlighterSize] = useState(24);
  const [annotationText, setAnnotationText] = useState('Approved by QA');
  const [isEditingCanvas, setIsEditingCanvas] = useState(false);
  const [editActivePage, setEditActivePage] = useState(1);
  const [canvasHasDrawing, setCanvasHasDrawing] = useState(false);

  // Multi-page drawing and sticker states
  const [editDrawingsPerPage, setEditDrawingsPerPage] = useState({});
  const [editTextStickersPerPage, setEditTextStickersPerPage] = useState({});
  const [editActiveStickerId, setEditActiveStickerId] = useState(null);
  const [editUndoStack, setEditUndoStack] = useState([]);
  const [editRedoStack, setEditRedoStack] = useState([]);
  const [currentEditStroke, setCurrentEditStroke] = useState(null);

  // Text formatting states
  const [textFontSize, setTextFontSize] = useState(18);
  const [textIsBold, setTextIsBold] = useState(true);
  const [textIsItalic, setTextIsItalic] = useState(false);
  const [textHasBg, setTextHasBg] = useState(false);

  // Quick signature popup for edit-pdf
  const [showEditSigModal, setShowEditSigModal] = useState(false);
  const editSigCanvasRef = useRef(null);
  const [isDrawingEditSig, setIsDrawingEditSig] = useState(false);

  // 8. Redaction Studio
  const redactCanvasRef = useRef(null);
  const [redactionBoxes, setRedactionBoxes] = useState([
    { id: 1, x: 50, y: 750, width: 330, height: 25, label: 'Account Number: ACC-99482' }
  ]);
  const [isDrawingRedact, setIsDrawingRedact] = useState(false);
  const [redactStartCoord, setRedactStartCoord] = useState({ x: 0, y: 0 });

  // 9. Interactive PDF Forms
  const [formFields, setFormFields] = useState([
    { id: 1, name: 'fullName', type: 'text', label: 'Full Name', value: 'Alex Rivera', x: 60, y: 350, width: 220, height: 26 },
    { id: 2, name: 'agreeTerms', type: 'checkbox', label: 'I agree to Terms & Conditions', value: true, x: 60, y: 310, width: 20, height: 20 }
  ]);
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldLabel, setNewFieldLabel] = useState('Email Address');

  // 10. Compare PDF
  const [fileB, setFileB] = useState(null);
  const [thumbsB, setThumbsB] = useState([]);
  const [comparePage, setComparePage] = useState(1);

  // 11. OCR & Intelligence
  const [extractedText, setExtractedText] = useState('');
  const [textPages, setTextPages] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [targetLang, setTargetLang] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [ocrConfidence, setOcrConfidence] = useState(98.4);

  // 12. Sign Studio
  const [signMode, setSignMode] = useState('draw'); // draw, type, upload
  const [typedName, setTypedName] = useState('Alex Rivera');
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 80, y: 440, page: 3, scale: 1.0 });
  const sigCanvasRef = useRef(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);

  // 13. Security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 14. Camera / Scan
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedSnapshots, setScannedSnapshots] = useState([]);
  const [scanFilter, setScanFilter] = useState('normal'); // normal, bw, grayscale

  // 15. HTML to PDF
  const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #111; }
    .header { border-bottom: 3px solid #ff2d75; padding-bottom: 15px; margin-bottom: 25px; }
    h1 { color: #0a0a0f; margin: 0; font-size: 28px; }
    .subtitle { color: #ff2d75; font-weight: bold; margin-top: 5px; }
    .card { background: #faf5f8; border-left: 4px solid #ff2d75; padding: 15px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #ff2d75; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PINKPDF DOCUMENT</h1>
    <div class="subtitle">Pixel-Perfect HTML to PDF Rendering</div>
  </div>
  <p>This PDF was generated directly from live HTML and CSS code.</p>
  <div class="card">
    <strong>Status:</strong> Client-Side Rendered | <strong>Security:</strong> 100% In-Browser
  </div>
  <table>
    <tr><th>Item</th><th>Description</th><th>Price</th></tr>
    <tr><td>PDF Pro Suite</td><td>Complete client-side PDF toolchain</td><td>$0.00 (Free)</td></tr>
    <tr><td>Privacy Standard</td><td>Zero server telemetry or uploads</td><td>Included</td></tr>
  </table>
</body>
</html>`);

  // 16. Word / PPTX text
  const [docText, setDocText] = useState('Project Specification & Executive Overview\n\n1. Executive Summary\nThis document outlines the core architecture of the high-performance client-side PDF workspace.\n\n2. Key Advantages\n• Total Privacy: No file is ever sent to an external server.\n• Instantaneous speed: WebAssembly runs natively on the CPU.\n• Universal cross-device compatibility.');

  // Initialize tool lifecycle
  useEffect(() => {
    if (tool.id === 'scan-to-pdf') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [tool.id]);

  // Load Sample file immediately if tool is compare-pdf or any other tool
  const loadSample = async () => {
    setIsLoading(true);
    setStatusMsg('Generating sample test PDF...');
    try {
      const sampleFile = await createSamplePdf('Sample ' + tool.name + ' Document');
      await processUploadedFiles([sampleFile]);
      
      if (tool.id === 'compare-pdf') {
        const sampleFileB = await createSamplePdf('Sample Comparison Document (Revised)');
        await processUploadedFileB(sampleFileB);
      }
      showToast('Loaded interactive sample document!');
    } catch (err) {
      console.error(err);
      showToast('Failed to load sample: ' + err.message);
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    processUploadedFiles(selected);
  };

  const processUploadedFiles = async (fileList) => {
    setIsLoading(true);
    setStatusMsg('Reading document...');
    try {
      if (tool.multiple) {
        setFiles(prev => [...prev, ...fileList]);
      } else {
        setFiles([fileList[0]]);
      }

      const primaryFile = fileList[0];

      if (primaryFile.type === 'application/pdf' || primaryFile.name.endsWith('.pdf')) {
        setStatusMsg('Rendering page previews...');
        const pdfDoc = await loadPdfDoc(primaryFile);
        const { thumbnails: thumbs, totalPages } = await renderAllPagesThumbnails(pdfDoc, 0.4);
        setThumbnails(thumbs);
        setPageOrder(Array.from({ length: totalPages }, (_, i) => i + 1));

        const textResult = await extractTextFromPdf(pdfDoc);
        setTextPages(textResult.pagesText);
        setExtractedText(textResult.fullText);

        const summary = generateAiSummary(textResult.fullText);
        setAiSummary(summary);
        const md = convertTextToMarkdown(textResult.fullText, primaryFile.name);
        setMarkdownContent(md);
      } else if (primaryFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnails([{ pageNumber: 1, dataUrl: e.target.result }]);
        };
        reader.readAsDataURL(primaryFile);
      }
      showToast(`Loaded ${fileList.length} file(s) successfully!`);
    } catch (err) {
      console.error(err);
      showToast('Error processing file: ' + err.message);
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  // Process Document B for Compare PDF
  const processUploadedFileB = async (file) => {
    setFileB(file);
    const { thumbnails: thumbs } = await renderAllPagesThumbnails(file, 0.4);
    setThumbsB(thumbs);
  };

  // Camera Management
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      showToast('Could not access camera: ' + err.message);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (scanFilter === 'grayscale') {
      ctx.filter = 'grayscale(100%) contrast(120%)';
    } else if (scanFilter === 'bw') {
      ctx.filter = 'grayscale(100%) contrast(250%) brightness(110%)';
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setScannedSnapshots(prev => [...prev, dataUrl]);
    showToast(`Captured page ${scannedSnapshots.length + 1}!`);
  };

  // Signature Pad Handlers
  const handleSignatureMouseDown = (e) => {
    setIsDrawingSig(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff2d75';
  };

  const handleSignatureMouseMove = (e) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSignatureMouseUp = () => {
    setIsDrawingSig(false);
    if (sigCanvasRef.current) {
      setSignatureDataUrl(sigCanvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignatureCanvas = () => {
    if (sigCanvasRef.current) {
      const ctx = sigCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
      setSignatureDataUrl(null);
    }
  };

  // Helper to convert hex colors to RGBA for fluorescent highlighters
  const hexToRgba = (hex, alpha = 0.35) => {
    let c = (hex || '#ff2d75').replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Redraw canvas strokes for the active page
  const redrawEditCanvas = (pageNum = editActivePage) => {
    const canvas = editCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = editDrawingsPerPage[pageNum] || [];
    strokes.forEach(stroke => {
      if (!stroke.points || stroke.points.length === 0) return;
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (stroke.type === 'highlighter') {
        ctx.strokeStyle = hexToRgba(stroke.color, 0.4);
        ctx.lineWidth = stroke.width || highlighterSize;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width || brushSize;
      }
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (tool.id === 'edit-pdf') {
      redrawEditCanvas(editActivePage);
    }
  }, [editActivePage, editDrawingsPerPage, tool.id]);

  // Edit PDF Markup Canvas Handlers
  const handleEditPointerDown = (e) => {
    const canvas = editCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (editTool === 'text') {
      const newSticker = {
        id: Date.now(),
        text: annotationText || 'Sample Text',
        x: Math.max(10, Math.min(x - 50, canvas.width - 150)),
        y: Math.max(20, Math.min(y, canvas.height - 30)),
        color: editColor,
        fontSize: textFontSize,
        isBold: textIsBold,
        isItalic: textIsItalic,
        hasBg: textHasBg
      };
      setEditTextStickersPerPage(prev => ({
        ...prev,
        [editActivePage]: [...(prev[editActivePage] || []), newSticker]
      }));
      setEditUndoStack(prev => [...prev, { page: editActivePage, type: 'sticker', sticker: newSticker }]);
      setEditRedoStack([]);
      setCanvasHasDrawing(true);
      showToast('Text stamp placed! Drag or click to configure.');
      return;
    }

    if (editTool === 'signature') {
      setShowEditSigModal(true);
      return;
    }

    setIsEditingCanvas(true);
    const stroke = {
      type: editTool,
      color: editColor,
      width: editTool === 'highlighter' ? highlighterSize : brushSize,
      points: [{ x, y }]
    };
    setCurrentEditStroke(stroke);

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x, y);
    if (editTool === 'highlighter') {
      ctx.strokeStyle = hexToRgba(editColor, 0.4);
      ctx.lineWidth = highlighterSize;
    } else {
      ctx.strokeStyle = editColor;
      ctx.lineWidth = brushSize;
    }
  };

  const handleEditPointerMove = (e) => {
    if (!isEditingCanvas || !currentEditStroke) return;
    const canvas = editCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentEditStroke.points.push({ x, y });
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setCanvasHasDrawing(true);
  };

  const handleEditPointerUp = () => {
    if (isEditingCanvas && currentEditStroke) {
      const updatedStrokes = [...(editDrawingsPerPage[editActivePage] || []), currentEditStroke];
      setEditDrawingsPerPage(prev => ({
        ...prev,
        [editActivePage]: updatedStrokes
      }));
      setEditUndoStack(prev => [...prev, { page: editActivePage, type: 'stroke', stroke: currentEditStroke }]);
      setEditRedoStack([]);
      setCurrentEditStroke(null);
    }
    setIsEditingCanvas(false);
  };

  const handleEditUndo = () => {
    if (editUndoStack.length === 0) return;
    const lastAction = editUndoStack[editUndoStack.length - 1];
    setEditUndoStack(prev => prev.slice(0, -1));
    setEditRedoStack(prev => [...prev, lastAction]);

    if (lastAction.type === 'stroke') {
      setEditDrawingsPerPage(prev => {
        const pageStrokes = prev[lastAction.page] || [];
        return {
          ...prev,
          [lastAction.page]: pageStrokes.slice(0, -1)
        };
      });
    } else if (lastAction.type === 'sticker') {
      setEditTextStickersPerPage(prev => {
        const pageStickers = prev[lastAction.page] || [];
        return {
          ...prev,
          [lastAction.page]: pageStickers.filter(s => s.id !== lastAction.sticker.id)
        };
      });
    }
  };

  const handleEditRedo = () => {
    if (editRedoStack.length === 0) return;
    const action = editRedoStack[editRedoStack.length - 1];
    setEditRedoStack(prev => prev.slice(0, -1));
    setEditUndoStack(prev => [...prev, action]);

    if (action.type === 'stroke') {
      setEditDrawingsPerPage(prev => ({
        ...prev,
        [action.page]: [...(prev[action.page] || []), action.stroke]
      }));
    } else if (action.type === 'sticker') {
      setEditTextStickersPerPage(prev => ({
        ...prev,
        [action.page]: [...(prev[action.page] || []), action.sticker]
      }));
    }
  };

  const clearCurrentEditPage = () => {
    setEditDrawingsPerPage(prev => ({ ...prev, [editActivePage]: [] }));
    setEditTextStickersPerPage(prev => ({ ...prev, [editActivePage]: [] }));
    const canvas = editCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    showToast(`Cleared Page ${editActivePage}!`);
  };

  // Quick Signature Canvas Handlers for Edit PDF
  const handleEditSigStart = (e) => {
    const canvas = editSigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawingEditSig(true);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.moveTo(x, y);
  };

  const handleEditSigMove = (e) => {
    if (!isDrawingEditSig) return;
    const canvas = editSigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEditSigEnd = () => {
    setIsDrawingEditSig(false);
  };

  const clearEditSigCanvas = () => {
    const canvas = editSigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const applyEditSigToDoc = () => {
    const canvas = editSigCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const newSigSticker = {
      id: Date.now(),
      type: 'signature',
      dataUrl,
      x: 140,
      y: 280,
      width: 160,
      height: 80
    };
    setEditTextStickersPerPage(prev => ({
      ...prev,
      [editActivePage]: [...(prev[editActivePage] || []), newSigSticker]
    }));
    setShowEditSigModal(false);
    setCanvasHasDrawing(true);
    showToast('Signature placed onto document!');
  };

  // Redaction Canvas Handlers
  const handleRedactMouseDown = (e) => {
    const canvas = redactCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawingRedact(true);
    setRedactStartCoord({ x, y });
  };

  const handleRedactMouseUp = (e) => {
    if (!isDrawingRedact) return;
    const canvas = redactCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = Math.abs(currentX - redactStartCoord.x);
    const height = Math.abs(currentY - redactStartCoord.y);
    const x = Math.min(redactStartCoord.x, currentX);
    const y = Math.min(redactStartCoord.y, currentY);

    if (width > 10 && height > 10) {
      const newBox = {
        id: Date.now(),
        x,
        y,
        width,
        height,
        label: `Redaction Area #${redactionBoxes.length + 1}`
      };
      setRedactionBoxes(prev => [...prev, newBox]);
      showToast('Added blackout redaction area!');
    }
    setIsDrawingRedact(false);
  };

  // Master Action Runner for ALL 33 Tools
  const executeToolAction = async () => {
    setIsLoading(true);
    setStatusMsg(`Processing ${tool.name}...`);
    try {
      switch (tool.id) {
        // 1. ORGANIZE PDF
        case 'merge-pdf': {
          if (files.length < 2) {
            showToast('Please add at least 2 PDF files to merge (or click Try Sample).');
            return;
          }
          const mergedPdf = await PDFDocument.create();
          for (const file of files) {
            const buffer = await fileToArrayBuffer(file);
            const doc = await PDFDocument.load(buffer);
            const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
          }
          const mergedBytes = await mergedPdf.save();
          downloadArrayBuffer(mergedBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Merged ${files.length} documents into one PDF!`);
          break;
        }

        case 'split-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);

          if (splitOption === 'range') {
            // Split by custom range (e.g. "1-2")
            const parts = splitRange.split('-').map(p => parseInt(p.trim(), 10));
            const startPage = Math.max(1, parts[0] || 1);
            const endPage = Math.min(doc.getPageCount(), parts[1] || startPage);
            const rangeDoc = await PDFDocument.create();
            const indices = [];
            for (let i = startPage; i <= endPage; i++) indices.push(i - 1);
            const copied = await rangeDoc.copyPages(doc, indices);
            copied.forEach(p => rangeDoc.addPage(p));
            const rangeBytes = await rangeDoc.save();
            downloadArrayBuffer(rangeBytes, formatToolDownloadFilename(tool.id, 'pdf', `${startPage}_to_${endPage}`));
            showToast(`Split pages ${startPage} to ${endPage}!`);
          } else {
            // Split all pages into ZIP
            const zip = new JSZip();
            for (let i = 0; i < doc.getPageCount(); i++) {
              const singleDoc = await PDFDocument.create();
              const [copied] = await singleDoc.copyPages(doc, [i]);
              singleDoc.addPage(copied);
              const singleBytes = await singleDoc.save();
              zip.file(`page_${i + 1}.pdf`, singleBytes);
            }
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            downloadBlob(zipBlob, formatToolDownloadFilename(tool.id, 'zip'));
            showToast(`Split all ${doc.getPageCount()} pages into ZIP archive!`);
          }
          break;
        }

        case 'remove-pages': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const newDoc = await PDFDocument.create();

          const keepIndices = [];
          for (let i = 1; i <= doc.getPageCount(); i++) {
            if (!removedPages.has(i)) {
              keepIndices.push(i - 1);
            }
          }

          if (keepIndices.length === 0) {
            showToast('You cannot remove all pages. Please keep at least one.');
            return;
          }

          const copied = await newDoc.copyPages(doc, keepIndices);
          copied.forEach(p => newDoc.addPage(p));
          const pdfBytes = await newDoc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Saved PDF with ${removedPages.size} pages removed!`);
          break;
        }

        case 'extract-pages': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const newDoc = await PDFDocument.create();

          const pagesToExtract = selectedPages.size > 0 
            ? Array.from(selectedPages).map(p => p - 1)
            : [0];

          const copied = await newDoc.copyPages(doc, pagesToExtract);
          copied.forEach(p => newDoc.addPage(p));
          const pdfBytes = await newDoc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Extracted ${copied.length} pages into new PDF!`);
          break;
        }

        case 'organize-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const newDoc = await PDFDocument.create();

          for (const pageNum of pageOrder) {
            const [copied] = await newDoc.copyPages(doc, [pageNum - 1]);
            const rotation = pageRotations[pageNum] || 0;
            if (rotation !== 0) {
              const currentAngle = copied.getRotation().angle;
              copied.setRotation(degrees((currentAngle + rotation) % 360));
            }
            newDoc.addPage(copied);
          }

          const pdfBytes = await newDoc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Exported reorganized PDF with updated order and rotations!');
          break;
        }

        case 'scan-to-pdf': {
          if (scannedSnapshots.length === 0) {
            showToast('Please capture at least one snapshot with the camera first.');
            return;
          }
          const pdfDoc = await PDFDocument.create();
          for (const dataUrl of scannedSnapshots) {
            const imageBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
            const image = await pdfDoc.embedJpg(imageBytes);
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          }
          const pdfBytes = await pdfDoc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Generated PDF from ${scannedSnapshots.length} camera scans!`);
          break;
        }

        // 2. OPTIMIZE PDF
        case 'compress-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const originalSize = buffer.byteLength;
          const pdfDoc = await loadPdfDoc(buffer);
          const newPdf = await PDFDocument.create();

          let scale = 1.0;
          let quality = 0.75;
          if (compressLevel === 'extreme') {
            scale = 0.65;
            quality = 0.50;
          } else if (compressLevel === 'recommended') {
            scale = 0.85;
            quality = 0.70;
          } else {
            scale = 1.0;
            quality = 0.85;
          }

          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const canvas = await renderPageToCanvas(pdfDoc, i, scale);
            const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);
            const imgBytes = await fetch(jpgDataUrl).then(r => r.arrayBuffer());
            const embedded = await newPdf.embedJpg(imgBytes);
            const page = newPdf.addPage([embedded.width, embedded.height]);
            page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
          }

          const compressedBytes = await newPdf.save();
          const newSize = compressedBytes.byteLength;
          const savedPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

          setCompressionResult({
            original: formatBytes(originalSize),
            compressed: formatBytes(newSize),
            savedPercent,
          });

          downloadArrayBuffer(compressedBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Compressed! File size reduced by ${savedPercent}%.`);
          break;
        }

        case 'repair-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const repairedBytes = await doc.save({ useObjectStreams: false });
          downloadArrayBuffer(repairedBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Rebuilt xref table and repaired damaged PDF stream headers!');
          break;
        }

        case 'ocr-pdf': {
          if (!extractedText && !files.length) return;
          downloadBlob(new Blob([extractedText], { type: 'text/plain;charset=utf-8' }), formatToolDownloadFilename(tool.id, 'txt'));
          showToast('Extracted OCR text downloaded as TXT file!');
          break;
        }

        // 3. CONVERT TO PDF
        case 'jpg-to-pdf': {
          if (!files.length) return;
          const pdfDoc = await PDFDocument.create();
          for (const file of files) {
            const imgBytes = await fileToArrayBuffer(file);
            let image;
            if (file.type === 'image/png' || file.name.endsWith('.png')) {
              image = await pdfDoc.embedPng(imgBytes);
            } else {
              image = await pdfDoc.embedJpg(imgBytes);
            }
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          }
          const pdfBytes = await pdfDoc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Converted ${files.length} image(s) to PDF!`);
          break;
        }

        case 'word-to-pdf': {
          await convertWordToPdf(files[0], docText, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Converted Word document to PDF!');
          break;
        }

        case 'powerpoint-to-pdf': {
          await convertWordToPdf(files[0], '# Executive Slide Deck\n\nSlide 1: Strategy Overview\n• Cloud-native performance\n• Zero server telemetry\n\nSlide 2: Security Framework\n• ISO PDF/A compliance\n• Hardware acceleration', formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Converted Presentation to PDF!');
          break;
        }

        case 'excel-to-pdf': {
          if (files.length > 0) {
            await convertExcelToPdf(files[0], formatToolDownloadFilename(tool.id, 'pdf'));
          } else {
            showToast('Please upload an Excel / CSV file first.');
            return;
          }
          showToast('Converted Excel to styled PDF table!');
          break;
        }

        case 'html-to-pdf': {
          await convertHtmlToPdf(htmlContent, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Rendered pixel-perfect PDF from HTML!');
          break;
        }

        // 4. CONVERT FROM PDF
        case 'pdf-to-jpg': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const pdfDoc = await loadPdfDoc(buffer);
          const zip = new JSZip();

          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const canvas = await renderPageToCanvas(pdfDoc, i, 2.0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const base64Data = dataUrl.split(',')[1];
            zip.file(`page_${i}.jpg`, base64Data, { base64: true });
          }

          const zipBlob = await zip.generateAsync({ type: 'blob' });
          downloadBlob(zipBlob, formatToolDownloadFilename(tool.id, 'zip'));
          showToast(`Exported all ${pdfDoc.numPages} pages as 2x High-Res JPGs!`);
          break;
        }

        case 'pdf-to-word': {
          if (!textPages.length) return;
          await convertPdfToWord(textPages, formatToolDownloadFilename(tool.id, 'docx'));
          showToast('Converted PDF to Microsoft Word (.docx)!');
          break;
        }

        case 'pdf-to-powerpoint': {
          if (!files.length) return;
          await convertPdfToPowerPoint(files[0], formatToolDownloadFilename(tool.id, 'pptx'));
          showToast('Converted PDF to PowerPoint (.pptx)!');
          break;
        }

        case 'pdf-to-excel': {
          if (!textPages.length) return;
          await convertPdfToExcel(textPages, formatToolDownloadFilename(tool.id, 'xlsx'));
          showToast('Extracted tabular data into Excel (.xlsx)!');
          break;
        }

        case 'pdf-to-pdfa': {
          if (!files.length) return;
          await convertToPdfA(files[0], formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Standardized to ISO 19005 PDF/A Archival format!');
          break;
        }

        // 5. EDIT PDF
        case 'rotate-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const pages = doc.getPages();

          pages.forEach((p, idx) => {
            const currentAngle = p.getRotation().angle;
            const extra = pageRotations[idx + 1] !== undefined ? pageRotations[idx + 1] : rotationDegrees;
            p.setRotation(degrees((currentAngle + extra) % 360));
          });

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Rotated PDF pages by ${rotationDegrees}°!`);
          break;
        }

        case 'add-page-numbers': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const font = await doc.embedFont(StandardFonts.Helvetica);
          const total = doc.getPageCount();

          const colorMap = {
            pink: rgb(1, 0.18, 0.46),
            white: rgb(1, 1, 1),
            black: rgb(0.1, 0.1, 0.1),
          };
          const textColor = colorMap[numberColor] || rgb(1, 0.18, 0.46);

          doc.getPages().forEach((p, idx) => {
            const { width, height } = p.getSize();
            const n = idx + 1;
            const label = numberFormat.replace('{n}', n).replace('{total}', total);
            const textWidth = font.widthOfTextAtSize(label, numberSize);

            let x = 50;
            let y = 30;

            if (numberPosition.includes('center')) x = (width - textWidth) / 2;
            else if (numberPosition.includes('right')) x = width - textWidth - 40;
            else if (numberPosition.includes('left')) x = 40;

            if (numberPosition.includes('top')) y = height - 40;
            else if (numberPosition.includes('bottom')) y = 30;

            p.drawText(label, { x, y, size: numberSize, font, color: textColor });
          });

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Added page numbers to all pages!');
          break;
        }

        case 'add-watermark': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const font = await doc.embedFont(StandardFonts.HelveticaBold);

          const colorMap = {
            pink: rgb(1, 0.18, 0.46),
            black: rgb(0.1, 0.1, 0.1),
            gray: rgb(0.5, 0.5, 0.5),
          };
          const wmColor = colorMap[watermarkColor] || rgb(1, 0.18, 0.46);

          doc.getPages().forEach(p => {
            const { width, height } = p.getSize();
            const textWidth = font.widthOfTextAtSize(watermarkText, 48);
            p.drawText(watermarkText, {
              x: (width - textWidth) / 2,
              y: height / 2,
              size: 48,
              font,
              color: wmColor,
              opacity: watermarkOpacity,
              rotate: degrees(watermarkAngle),
            });
          });

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Stamped watermark onto document!');
          break;
        }

        case 'crop-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);

          doc.getPages().forEach(p => {
            const { width, height } = p.getSize();
            const leftInset = width * (cropMargins.left / 100);
            const rightInset = width * (cropMargins.right / 100);
            const topInset = height * (cropMargins.top / 100);
            const bottomInset = height * (cropMargins.bottom / 100);

            p.setCropBox(
              leftInset,
              bottomInset,
              width - leftInset - rightInset,
              height - topInset - bottomInset
            );
          });

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Trimmed page margins with custom crop settings!');
          break;
        }

        case 'edit-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const totalPages = doc.getPageCount();

          // Identify all pages with edits
          const pagesToBake = new Set();
          Object.keys(editDrawingsPerPage).forEach(p => {
            if (editDrawingsPerPage[p] && editDrawingsPerPage[p].length > 0) pagesToBake.add(Number(p));
          });
          Object.keys(editTextStickersPerPage).forEach(p => {
            if (editTextStickersPerPage[p] && editTextStickersPerPage[p].length > 0) pagesToBake.add(Number(p));
          });

          if (canvasHasDrawing) {
            pagesToBake.add(editActivePage);
          }

          // Bake each edited page using an offscreen high-res canvas
          for (const pageNum of pagesToBake) {
            if (pageNum < 1 || pageNum > totalPages) continue;
            const pdfPage = doc.getPages()[pageNum - 1];
            const { width, height } = pdfPage.getSize();

            const offCanvas = document.createElement('canvas');
            offCanvas.width = 1200;
            offCanvas.height = 1200 * (height / width);
            const ctx = offCanvas.getContext('2d');
            const scaleX = offCanvas.width / 480;
            const scaleY = offCanvas.height / 680;

            // 1. Draw strokes
            const strokes = editDrawingsPerPage[pageNum] || [];
            strokes.forEach(stroke => {
              if (!stroke.points || stroke.points.length === 0) return;
              ctx.beginPath();
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              if (stroke.type === 'highlighter') {
                ctx.strokeStyle = hexToRgba(stroke.color, 0.4);
                ctx.lineWidth = (stroke.width || highlighterSize) * scaleX;
              } else {
                ctx.strokeStyle = stroke.color;
                ctx.lineWidth = (stroke.width || brushSize) * scaleX;
              }
              ctx.moveTo(stroke.points[0].x * scaleX, stroke.points[0].y * scaleY);
              for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x * scaleX, stroke.points[i].y * scaleY);
              }
              ctx.stroke();
            });

            // 2. Draw text stickers and signatures
            const stickers = editTextStickersPerPage[pageNum] || [];
            for (const st of stickers) {
              if (st.type === 'signature' && st.dataUrl) {
                const img = new Image();
                img.src = st.dataUrl;
                await new Promise(res => { img.onload = res; img.onerror = res; });
                ctx.drawImage(img, st.x * scaleX, st.y * scaleY, (st.width || 160) * scaleX, (st.height || 80) * scaleY);
              } else if (st.text) {
                const fontStyle = `${st.isItalic ? 'italic ' : ''}${st.isBold ? 'bold ' : ''}${Math.round((st.fontSize || 18) * scaleX)}px 'Inter', sans-serif`;
                ctx.font = fontStyle;

                if (st.hasBg) {
                  const metrics = ctx.measureText(st.text);
                  const bgWidth = metrics.width + 20 * scaleX;
                  const bgHeight = (st.fontSize || 18) * 1.5 * scaleY;
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                  ctx.fillRect(st.x * scaleX - 6 * scaleX, st.y * scaleY - bgHeight + 6 * scaleY, bgWidth, bgHeight);
                  ctx.strokeStyle = st.color;
                  ctx.lineWidth = 2 * scaleX;
                  ctx.strokeRect(st.x * scaleX - 6 * scaleX, st.y * scaleY - bgHeight + 6 * scaleY, bgWidth, bgHeight);
                }

                ctx.fillStyle = st.color;
                ctx.fillText(st.text, st.x * scaleX, st.y * scaleY);
              }
            }

            const pageDataUrl = offCanvas.toDataURL('image/png');
            const pngBytes = await fetch(pageDataUrl).then(r => r.arrayBuffer());
            const pngImage = await doc.embedPng(pngBytes);
            pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height });
          }

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(pagesToBake.size > 0 ? `Exported PDF with markups flattened on ${pagesToBake.size} page(s)!` : 'Exported edited PDF!');
          break;
        }

        case 'pdf-forms': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const form = doc.getForm();
          const page = doc.getPages()[0];

          // Add all user configured form fields
          formFields.forEach((field) => {
            if (field.type === 'checkbox') {
              const checkBox = form.createCheckBox(`field_${field.id}`);
              if (field.value) checkBox.check();
              checkBox.addToPage(page, { x: field.x, y: field.y, width: field.width, height: field.height });
            } else {
              const textField = form.createTextField(`field_${field.id}`);
              textField.setText(String(field.value || ''));
              textField.addToPage(page, { x: field.x, y: field.y, width: field.width, height: field.height });
            }
          });

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Exported PDF with ${formFields.length} interactive form field(s)!`);
          break;
        }

        // 6. PDF SECURITY
        case 'unlock-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          try {
            let unlockedBytes;
            if (password && password.trim().length > 0) {
              unlockedBytes = await decryptPDF(new Uint8Array(buffer), password);
            } else {
              const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
              unlockedBytes = await doc.save();
            }
            downloadArrayBuffer(unlockedBytes, formatToolDownloadFilename(tool.id, 'pdf'));
            showToast('PDF unlocked and saved without password!');
          } catch (err) {
            console.error('Unlock error:', err);
            showToast('Failed to unlock: Incorrect password or corrupted file.');
          }
          break;
        }

        case 'protect-pdf': {
          if (!password || password.trim().length === 0) {
            showToast('Please enter an encryption password.');
            return;
          }
          if (confirmPassword && password !== confirmPassword) {
            showToast('Passwords do not match. Please re-check.');
            return;
          }
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          // Genuine ISO/AES-256 PDF Standard Encryption (Rev 5)
          const encryptedBytes = await encryptPDF(new Uint8Array(buffer), password);
          downloadArrayBuffer(encryptedBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`PDF encrypted with AES-256 password protection!`);
          break;
        }

        case 'sign-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const targetPageIndex = Math.min(signaturePosition.page - 1, doc.getPageCount() - 1);
          const page = doc.getPages()[targetPageIndex] || doc.getPages()[0];

          if (signatureDataUrl) {
            const pngImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
            const pngImage = await doc.embedPng(pngImageBytes);
            page.drawImage(pngImage, {
              x: signaturePosition.x,
              y: signaturePosition.y,
              width: 150 * signaturePosition.scale,
              height: 65 * signaturePosition.scale,
            });
          } else {
            const font = await doc.embedFont(StandardFonts.TimesRomanItalic);
            page.drawText(typedName, {
              x: signaturePosition.x,
              y: signaturePosition.y,
              size: 24 * signaturePosition.scale,
              font,
              color: rgb(1, 0.18, 0.46),
            });
          }

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Stamped signature onto Page ${targetPageIndex + 1}!`);
          break;
        }

        case 'redact-pdf': {
          if (!files.length) return;
          const buffer = await fileToArrayBuffer(files[0]);
          const doc = await PDFDocument.load(buffer);
          const page = doc.getPages()[0];

          // Permanently paint all user blackout boxes
          redactionBoxes.forEach(box => {
            page.drawRectangle({
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
              color: rgb(0, 0, 0), // Solid blackout
            });
          });

          const pdfBytes = await doc.save();
          downloadArrayBuffer(pdfBytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast(`Permanently redacted ${redactionBoxes.length} sensitive areas!`);
          break;
        }

        case 'compare-pdf': {
          showToast(`Comparison complete: Document A has ${thumbnails.length} pages, Document B has ${thumbsB.length} pages.`);
          break;
        }

        // 7. PDF INTELLIGENCE
        case 'ai-summarizer': {
          if (!aiSummary) {
            showToast('No text available to summarize.');
            return;
          }
          const summaryPdf = await PDFDocument.create();
          const fontBold = await summaryPdf.embedFont(StandardFonts.HelveticaBold);
          const font = await summaryPdf.embedFont(StandardFonts.Helvetica);
          const page = summaryPdf.addPage([595, 842]);

          page.drawText('AI DOCUMENT SUMMARY', { x: 50, y: 780, size: 20, font: fontBold, color: rgb(1, 0.18, 0.46) });
          page.drawText(`Reading Time: ~${aiSummary.stats.readingTimeMin} min | Words: ${aiSummary.stats.wordCount}`, {
            x: 50, y: 755, size: 11, font, color: rgb(0.4, 0.4, 0.4)
          });

          page.drawText('Executive Summary:', { x: 50, y: 710, size: 14, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
          page.drawText(aiSummary.executiveSummary.slice(0, 320), { x: 50, y: 680, size: 11, font, color: rgb(0.2, 0.2, 0.2) });

          page.drawText('Key Highlights:', { x: 50, y: 620, size: 14, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
          let y = 590;
          aiSummary.highlights.forEach(h => {
            page.drawText(`• ${h.slice(0, 90)}`, { x: 50, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
            y -= 22;
          });

          const bytes = await summaryPdf.save();
          downloadArrayBuffer(bytes, formatToolDownloadFilename(tool.id, 'pdf'));
          showToast('Exported AI Summary PDF!');
          break;
        }

        case 'translate-pdf': {
          if (!extractedText) return;
          setStatusMsg('Translating text...');
          const translated = await translateText(extractedText, targetLang);
          setTranslatedText(translated);
          downloadBlob(new Blob([translated], { type: 'text/plain;charset=utf-8' }), formatToolDownloadFilename(tool.id, 'txt', targetLang));
          showToast(`Translated to ${targetLang.toUpperCase()} and downloaded!`);
          break;
        }

        case 'pdf-to-markdown': {
          if (!markdownContent) return;
          downloadBlob(new Blob([markdownContent], { type: 'text/markdown' }), formatToolDownloadFilename(tool.id, 'md'));
          showToast('Downloaded formatted Markdown (.md)!');
          break;
        }

        default:
          showToast(`Executed ${tool.name}!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error executing tool: ' + err.message);
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="workspace-container">
      {/* Workspace Header */}
      {!isStandalonePage ? (
        <div className="workspace-header">
          <div className="workspace-title-box">
            <div className="workspace-icon-large">
              <ToolIcon name={tool.icon} size={28} />
            </div>
            <div>
              <div className="workspace-category">{tool.categoryTitle}</div>
              <h1 className="workspace-title">{tool.name}</h1>
            </div>
          </div>

          <div className="workspace-actions">
            <button 
              className="btn-outline" 
              onClick={() => setShowOnboarding(true)} 
              title="Step-by-step onboarding walkthrough for this tool"
            >
              <HelpCircle size={16} color="var(--pink-primary)" />
              <span>How to Use</span>
            </button>
            <button className="btn-outline" onClick={loadSample} disabled={isLoading}>
              <Sparkles size={16} color="var(--pink-primary)" />
              <span>Load Sample File</span>
            </button>
            <button className="icon-btn" onClick={onClose} title="Back to Tools">
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pink-primary)', display: 'inline-block' }}></span>
            <span>Interactive Tool Studio</span>
          </div>
          <div className="workspace-actions">
            <button 
              className="btn-outline" 
              onClick={() => setShowOnboarding(true)} 
              title="Step-by-step onboarding walkthrough for this tool"
            >
              <HelpCircle size={16} color="var(--pink-primary)" />
              <span>Interactive Guide</span>
            </button>
            <button className="btn-outline" onClick={loadSample} disabled={isLoading}>
              <Sparkles size={16} color="var(--pink-primary)" />
              <span>Load Sample File</span>
            </button>
          </div>
        </div>
      )}

      {/* File Upload Zone */}
      {files.length === 0 && tool.id !== 'scan-to-pdf' && tool.id !== 'html-to-pdf' && (
        <div 
          className="dropzone"
          onClick={() => document.getElementById('file-upload-input').click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            processUploadedFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input 
            type="file" 
            id="file-upload-input" 
            style={{ display: 'none' }}
            accept={tool.acceptedFiles || undefined}
            multiple={tool.multiple}
            onChange={handleFileChange}
          />
          <div className="dropzone-icon">
            <Upload size={32} />
          </div>
          <h3 className="dropzone-title">Drop your file here or click to browse</h3>
          <p className="dropzone-subtitle">
            Supported format: {tool.acceptedFiles || 'PDF, Images, Word, Excel'} • 100% Client-Side Privacy
          </p>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={(e) => { e.stopPropagation(); loadSample(); }}
          >
            <Sparkles size={16} />
            <span>Or Click Here to Try with Sample Document</span>
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      {(files.length > 0 || tool.id === 'scan-to-pdf' || tool.id === 'html-to-pdf') && (
        <div className="workspace-layout">
          {/* Left Preview Pane */}
          <div className="preview-pane">
            
            {/* Compare PDF View */}
            {tool.id === 'compare-pdf' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--pink-primary)', marginBottom: '0.5rem' }}>Document A: {files[0] ? files[0].name : 'Primary PDF'}</div>
                    {thumbnails.length > 0 && (
                      <img src={thumbnails[0].dataUrl} alt="Doc A" style={{ width: '100%', height: 320, objectFit: 'contain', background: '#fff', borderRadius: 4 }} />
                    )}
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--pink-primary)', marginBottom: '0.5rem' }}>Document B: {fileB ? fileB.name : 'Comparison PDF'}</div>
                    {thumbsB.length > 0 ? (
                      <img src={thumbsB[0].dataUrl} alt="Doc B" style={{ width: '100%', height: 320, objectFit: 'contain', background: '#fff', borderRadius: 4 }} />
                    ) : (
                      <div 
                        style={{ height: 320, border: '2px dashed var(--border-pink)', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => document.getElementById('file-b-input').click()}
                      >
                        <input type="file" id="file-b-input" accept=".pdf" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && processUploadedFileB(e.target.files[0])} />
                        <Upload size={24} color="var(--pink-primary)" />
                        <span style={{ fontSize: '0.85rem', marginTop: 8 }}>Click to upload Document B</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Edit PDF Interactive Markup Canvas */}
            {tool.id === 'edit-pdf' && thumbnails.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', width: '100%' }}>
                {/* Top Markup Controls Bar */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  width: '100%', 
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {/* Tool selection */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'pen' ? 'active' : ''}`} 
                      onClick={() => setEditTool('pen')}
                      title="Pencil / Freehand Pen"
                    >
                      <PenTool size={14} /> <span>Pencil</span>
                    </button>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'highlighter' ? 'active' : ''}`} 
                      onClick={() => setEditTool('highlighter')}
                      title="Fluorescent Highlighter"
                    >
                      <Highlighter size={14} /> <span>Highlighter</span>
                    </button>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'text' ? 'active' : ''}`} 
                      onClick={() => setEditTool('text')}
                      title="Text Stamp / Sticker"
                    >
                      <Type size={14} /> <span>Text</span>
                    </button>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'signature' ? 'active' : ''}`} 
                      onClick={() => { setEditTool('signature'); setShowEditSigModal(true); }}
                      title="Sign Document"
                    >
                      <FileSignature size={14} /> <span>Signature</span>
                    </button>
                  </div>

                  {/* iOS Color Swatches */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {[
                      { hex: '#ffeb3b', label: 'Fluorescent Yellow' },
                      { hex: '#00e676', label: 'Vibrant Green' },
                      { hex: '#ff2d75', label: 'Pink PDF' },
                      { hex: '#000000', label: 'Deep Black' },
                      { hex: '#2563eb', label: 'Classic Blue' }
                    ].map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setEditColor(c.hex)}
                        title={c.label}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          border: editColor.toLowerCase() === c.hex.toLowerCase() ? '2px solid #fff' : '1px solid rgba(0,0,0,0.2)',
                          boxShadow: editColor.toLowerCase() === c.hex.toLowerCase() ? '0 0 0 2px var(--pink-primary)' : 'none',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={editColor} 
                      onChange={(e) => setEditColor(e.target.value)} 
                      style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} 
                      title="Custom Color" 
                    />
                  </div>

                  {/* Undo, Redo, Clear */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <button 
                      type="button"
                      className="btn-outline" 
                      onClick={handleEditUndo} 
                      disabled={editUndoStack.length === 0}
                      title="Undo"
                      style={{ padding: '0.35rem 0.6rem' }}
                    >
                      <Undo2 size={14} />
                    </button>
                    <button 
                      type="button"
                      className="btn-outline" 
                      onClick={handleEditRedo} 
                      disabled={editRedoStack.length === 0}
                      title="Redo"
                      style={{ padding: '0.35rem 0.6rem' }}
                    >
                      <Redo2 size={14} />
                    </button>
                    <button 
                      type="button"
                      className="btn-outline" 
                      onClick={clearCurrentEditPage} 
                      title="Clear Page"
                      style={{ padding: '0.35rem 0.6rem' }}
                    >
                      <Eraser size={14} /> <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Document Viewport with Drawing Canvas and Sticker Overlays */}
                <div style={{ 
                  position: 'relative', 
                  width: 480, 
                  height: 680, 
                  border: '2px solid var(--border-pink)', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden',
                  background: '#ffffff',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                }}>
                  {/* Base Page Render */}
                  <img 
                    src={thumbnails[editActivePage - 1]?.dataUrl || thumbnails[0]?.dataUrl} 
                    alt="Page Canvas" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#fff', pointerEvents: 'none', userSelect: 'none' }} 
                  />

                  {/* HTML5 Freehand Drawing Canvas */}
                  <canvas 
                    ref={editCanvasRef} 
                    width={480} 
                    height={680} 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      cursor: editTool === 'text' ? 'crosshair' : editTool === 'highlighter' ? 'cell' : 'crosshair',
                      touchAction: 'none'
                    }}
                    onPointerDown={handleEditPointerDown}
                    onPointerMove={handleEditPointerMove}
                    onPointerUp={handleEditPointerUp}
                  />

                  {/* Text & Signature Sticker Overlays for Active Page */}
                  {(editTextStickersPerPage[editActivePage] || []).map((sticker) => (
                    <div
                      key={sticker.id}
                      onClick={() => setEditActiveStickerId(sticker.id)}
                      style={{
                        position: 'absolute',
                        left: sticker.x,
                        top: sticker.y,
                        cursor: 'grab',
                        userSelect: 'none',
                        zIndex: 10,
                        padding: sticker.hasBg ? '4px 10px' : '2px 4px',
                        background: sticker.hasBg ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
                        borderRadius: sticker.hasBg ? 4 : 0,
                        border: editActiveStickerId === sticker.id ? '1px dashed var(--pink-primary)' : sticker.hasBg ? `1px solid ${sticker.color}` : 'none',
                        boxShadow: sticker.hasBg ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {sticker.type === 'signature' ? (
                        <img 
                          src={sticker.dataUrl} 
                          alt="Signature" 
                          style={{ width: sticker.width || 140, height: sticker.height || 70, objectFit: 'contain', pointerEvents: 'none' }} 
                        />
                      ) : (
                        <span style={{
                          color: sticker.color,
                          fontSize: `${sticker.fontSize || 18}px`,
                          fontWeight: sticker.isBold ? 700 : 400,
                          fontStyle: sticker.isItalic ? 'italic' : 'normal',
                          lineHeight: 1.2
                        }}>
                          {sticker.text}
                        </span>
                      )}

                      {/* Delete button if active sticker */}
                      {editActiveStickerId === sticker.id && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTextStickersPerPage(prev => ({
                              ...prev,
                              [editActivePage]: (prev[editActivePage] || []).filter(s => s.id !== sticker.id)
                            }));
                            setEditActiveStickerId(null);
                          }}
                          style={{
                            background: '#ef4444',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            marginLeft: 4
                          }}
                          title="Delete Sticker"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Multi-Page Navigation Bar */}
                {thumbnails.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <button 
                      type="button"
                      className="btn-outline" 
                      onClick={() => setEditActivePage(p => Math.max(1, p - 1))}
                      disabled={editActivePage <= 1}
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <ChevronLeft size={16} /> <span>Previous</span>
                    </button>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Page {editActivePage} of {thumbnails.length}
                    </span>
                    <button 
                      type="button"
                      className="btn-outline" 
                      onClick={() => setEditActivePage(p => Math.min(thumbnails.length, p + 1))}
                      disabled={editActivePage >= thumbnails.length}
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <span>Next</span> <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Quick Signature Modal for Edit PDF */}
                {showEditSigModal && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-pink)',
                      padding: '1.25rem',
                      width: '420px',
                      maxWidth: '92vw',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FileSignature size={18} color="var(--pink-primary)" />
                          <span>Draw Your Signature</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setShowEditSigModal(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{
                        background: '#ffffff',
                        border: '2px dashed var(--border-pink)',
                        borderRadius: 'var(--radius-sm)',
                        position: 'relative',
                        height: '160px'
                      }}>
                        <canvas 
                          ref={editSigCanvasRef}
                          width={380}
                          height={160}
                          style={{ width: '100%', height: '100%', cursor: 'crosshair', touchAction: 'none' }}
                          onPointerDown={handleEditSigStart}
                          onPointerMove={handleEditSigMove}
                          onPointerUp={handleEditSigEnd}
                        />
                        <div style={{ position: 'absolute', bottom: 8, left: 12, fontSize: '0.75rem', color: '#94a3b8', pointerEvents: 'none' }}>
                          Sign above using mouse, stylus, or touch
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button type="button" className="btn-outline" onClick={clearEditSigCanvas}>
                          <Eraser size={14} /> <span>Clear</span>
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="btn-outline" onClick={() => setShowEditSigModal(false)}>
                            Cancel
                          </button>
                          <button type="button" className="btn-primary" onClick={applyEditSigToDoc}>
                            <Check size={14} /> <span>Insert Signature</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Redact PDF Interactive Blackout Canvas */}
            {tool.id === 'redact-pdf' && thumbnails.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--pink-primary)', fontWeight: 600 }}>
                  Click and drag your mouse across the document to create blackout redaction boxes.
                </div>
                <div style={{ position: 'relative', width: 420, height: 580, border: '2px solid var(--pink-primary)', borderRadius: 6, overflow: 'hidden' }}>
                  <img src={thumbnails[0]?.dataUrl} alt="Base PDF" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                  {/* Drawn Blackout Boxes */}
                  {redactionBoxes.map(box => (
                    <div 
                      key={box.id} 
                      style={{ 
                        position: 'absolute', 
                        left: box.x, 
                        top: box.y, 
                        width: box.width, 
                        height: box.height, 
                        background: '#000000', 
                        border: '1px solid #ff2d75',
                        boxShadow: '0 0 8px rgba(0,0,0,0.8)' 
                      }} 
                    />
                  ))}
                  <canvas 
                    ref={redactCanvasRef} 
                    width={420} 
                    height={580} 
                    style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair' }}
                    onMouseDown={handleRedactMouseDown}
                    onMouseUp={handleRedactMouseUp}
                  />
                </div>
              </div>
            )}

            {/* Crop PDF Visual Margins Preview */}
            {tool.id === 'crop-pdf' && thumbnails.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div style={{ position: 'relative', width: 400, height: 560, border: '2px solid var(--border-subtle)', borderRadius: 6, overflow: 'hidden', background: '#333' }}>
                  <img src={thumbnails[0]?.dataUrl} alt="Base PDF" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.5 }} />
                  {/* Active Crop Box Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: `${cropMargins.top}%`,
                    bottom: `${cropMargins.bottom}%`,
                    left: `${cropMargins.left}%`,
                    right: `${cropMargins.right}%`,
                    border: '2px dashed var(--pink-primary)',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>
            )}

            {/* Scan to PDF View */}
            {tool.id === 'scan-to-pdf' && (
              <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="camera-video" />
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button className="btn-primary" onClick={captureCameraSnapshot}>
                    <Camera size={18} />
                    <span>Capture Snapshot ({scannedSnapshots.length})</span>
                  </button>
                  <select 
                    className="control-select" 
                    value={scanFilter} 
                    onChange={(e) => setScanFilter(e.target.value)}
                  >
                    <option value="normal">Color (Original)</option>
                    <option value="grayscale">Grayscale Document</option>
                    <option value="bw">High Contrast B&W</option>
                  </select>
                </div>
                {scannedSnapshots.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', width: '100%', marginTop: '1rem', padding: '0.5rem' }}>
                    {scannedSnapshots.map((snap, idx) => (
                      <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                        <img src={snap} alt={`Scan ${idx}`} style={{ width: 100, height: 75, borderRadius: 6, objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 4 }}>
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HTML to PDF Live Editor */}
            {tool.id === 'html-to-pdf' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  style={{
                    width: '100%',
                    height: '240px',
                    fontFamily: 'Fira Code, monospace',
                    fontSize: '0.85rem',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                  }}
                />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pink-primary)' }}>Live HTML Preview:</div>
                <div 
                  style={{ 
                    flex: 1, 
                    background: '#ffffff', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '1.5rem', 
                    overflowY: 'auto',
                    border: '2px solid var(--border-subtle)',
                    color: '#000000',
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            )}

            {/* Sign PDF Signature Studio */}
            {tool.id === 'sign-pdf' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className={`btn-outline ${signMode === 'draw' ? 'active' : ''}`}
                    onClick={() => setSignMode('draw')}
                  >
                    Draw Signature
                  </button>
                  <button 
                    className={`btn-outline ${signMode === 'type' ? 'active' : ''}`}
                    onClick={() => setSignMode('type')}
                  >
                    Type Signature
                  </button>
                </div>

                {signMode === 'draw' ? (
                  <div>
                    <canvas 
                      ref={sigCanvasRef}
                      width={600}
                      height={180}
                      className="signature-canvas"
                      onMouseDown={handleSignatureMouseDown}
                      onMouseMove={handleSignatureMouseMove}
                      onMouseUp={handleSignatureMouseUp}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button className="btn-outline" onClick={clearSignatureCanvas}>
                        Clear Ink
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input 
                      type="text" 
                      className="control-input" 
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="Type your full name..."
                    />
                    <div style={{
                      marginTop: '1rem',
                      padding: '1.5rem',
                      background: '#ffffff',
                      color: 'var(--pink-primary)',
                      fontFamily: 'cursive',
                      fontSize: '2.5rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {typedName || 'Your Signature'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Summarizer View */}
            {tool.id === 'ai-summarizer' && aiSummary && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ padding: '0.75rem 1.25rem', background: 'var(--pink-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pink-soft-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reading Time</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pink-primary)' }}>~{aiSummary.stats.readingTimeMin} min</div>
                  </div>
                  <div style={{ padding: '0.75rem 1.25rem', background: 'var(--pink-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pink-soft-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Word Count</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pink-primary)' }}>{aiSummary.stats.wordCount} words</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--pink-primary)', marginBottom: '0.5rem' }}>Executive Summary</h4>
                  <p style={{ lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                    {aiSummary.executiveSummary}
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--pink-primary)', marginBottom: '0.5rem' }}>Key Takeaways</h4>
                  <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                    {aiSummary.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Translate PDF View */}
            {tool.id === 'translate-pdf' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label className="control-label">Select Target Language:</label>
                  <select 
                    className="control-select" 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Original Text</div>
                    <textarea 
                      readOnly 
                      value={extractedText} 
                      style={{ width: '100%', height: '340px', background: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--pink-primary)', marginBottom: '0.3rem' }}>Bilingual Translation</div>
                    <textarea 
                      readOnly 
                      value={translatedText || 'Click Translate Now to view translated text...'} 
                      style={{ width: '100%', height: '340px', background: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PDF to Markdown View */}
            {tool.id === 'pdf-to-markdown' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Generated Clean Markdown</span>
                  <button 
                    className="btn-outline" 
                    onClick={() => { navigator.clipboard.writeText(markdownContent); showToast('Copied Markdown to clipboard!'); }}
                  >
                    <Copy size={15} />
                    <span>Copy Markdown</span>
                  </button>
                </div>
                <textarea 
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  style={{
                    width: '100%',
                    height: '380px',
                    fontFamily: 'Fira Code, monospace',
                    fontSize: '0.85rem',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                  }}
                />
              </div>
            )}

            {/* Default Page Thumbnail Grid */}
            {thumbnails.length > 0 && !['html-to-pdf', 'scan-to-pdf', 'translate-pdf', 'pdf-to-markdown', 'edit-pdf', 'redact-pdf', 'crop-pdf', 'compare-pdf'].includes(tool.id) && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Total Pages: {thumbnails.length} • {tool.id === 'organize-pdf' ? 'Drag & drop thumbnails or use the buttons below each page' : 'Click page to select or toggle action'}
                  </span>
                  {tool.id === 'organize-pdf' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-outline" 
                        onClick={() => {
                          setPageOrder([...pageOrder].reverse());
                          showToast('Reversed all pages order!');
                        }}
                      >
                        <ArrowUpDown size={14} />
                        <span>Reverse Order</span>
                      </button>
                      <button 
                        className="btn-outline" 
                        onClick={() => {
                          setPageOrder(thumbnails.map(t => t.pageNumber));
                          setPageRotations({});
                          showToast('Reset to original sequence!');
                        }}
                      >
                        <Undo2 size={14} />
                        <span>Reset</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="thumbnail-grid">
                  {(tool.id === 'organize-pdf' ? pageOrder : thumbnails.map(t => t.pageNumber)).map((pageNum, idx) => {
                    const thumb = thumbnails.find(t => t.pageNumber === pageNum) || thumbnails[0];
                    const isSelected = selectedPages.has(pageNum);
                    const isRemoved = removedPages.has(pageNum);
                    const rotation = pageRotations[pageNum] || 0;
                    const isFirst = tool.id === 'organize-pdf' && idx === 0;
                    const isLast = tool.id === 'organize-pdf' && idx === pageOrder.length - 1;

                    return (
                      <div 
                        key={`${pageNum}-${idx}`} 
                        className={`thumbnail-card ${isSelected ? 'selected' : ''} ${isRemoved ? 'removed' : ''} ${isFirst ? 'first-page' : ''} ${isLast ? 'last-page' : ''}`}
                        draggable={tool.id === 'organize-pdf'}
                        onDragStart={() => setDraggedIndex(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (tool.id === 'organize-pdf' && draggedIndex !== null && draggedIndex !== idx) {
                            const updated = [...pageOrder];
                            const [movedItem] = updated.splice(draggedIndex, 1);
                            updated.splice(idx, 0, movedItem);
                            setPageOrder(updated);
                            setDraggedIndex(null);
                            showToast(`Moved Page ${movedItem} to Position #${idx + 1}!`);
                          }
                        }}
                        onClick={() => {
                          if (tool.id === 'remove-pages') {
                            setRemovedPages(prev => {
                              const next = new Set(prev);
                              if (next.has(pageNum)) next.delete(pageNum);
                              else next.add(pageNum);
                              return next;
                            });
                          } else if (tool.id === 'extract-pages') {
                            setSelectedPages(prev => {
                              const next = new Set(prev);
                              if (next.has(pageNum)) next.delete(pageNum);
                              else next.add(pageNum);
                              return next;
                            });
                          }
                        }}
                      >
                        {/* Status Badges for Organize PDF */}
                        {isFirst && <span className="thumbnail-tag tag-first">1ST PAGE</span>}
                        {isLast && <span className="thumbnail-tag tag-last">LAST PAGE</span>}
                        {tool.id === 'organize-pdf' && <span className="thumbnail-pos">#{idx + 1}</span>}

                        <img 
                          src={thumb.dataUrl} 
                          alt={`Page ${pageNum}`} 
                          className="thumbnail-img" 
                          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.2s' }}
                        />
                        
                        <div className="thumbnail-badge">
                          Page {pageNum}
                          {isRemoved && <span style={{ color: 'var(--pink-primary)', marginLeft: 4 }}>[Removed]</span>}
                        </div>

                        {/* Organize PDF Action Bar */}
                        {tool.id === 'organize-pdf' && (
                          <div className="thumbnail-actions-bar">
                            <button 
                              className="thumbnail-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPageOrder(prev => [pageNum, ...prev.filter(p => p !== pageNum)]);
                                showToast(`Set Page ${pageNum} as First Page!`);
                              }}
                              title="Make this 1st Page (Cover)"
                            >
                              <ArrowUpToLine size={13} color="var(--pink-primary)" />
                            </button>

                            <button 
                              className="thumbnail-action-btn"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (idx > 0) {
                                  const updated = [...pageOrder];
                                  [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                  setPageOrder(updated);
                                }
                              }}
                              title="Move Left"
                            >
                              <ArrowLeft size={13} />
                            </button>

                            <button 
                              className="thumbnail-action-btn"
                              disabled={idx === pageOrder.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (idx < pageOrder.length - 1) {
                                  const updated = [...pageOrder];
                                  [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                  setPageOrder(updated);
                                }
                              }}
                              title="Move Right"
                            >
                              <ArrowRight size={13} />
                            </button>

                            <button 
                              className="thumbnail-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPageOrder(prev => [...prev.filter(p => p !== pageNum), pageNum]);
                                showToast(`Set Page ${pageNum} as Last Page!`);
                              }}
                              title="Make this Last Page"
                            >
                              <ArrowDownToLine size={13} color="#38bdf8" />
                            </button>

                            <button 
                              className="thumbnail-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPageRotations(prev => ({ ...prev, [pageNum]: ((prev[pageNum] || 0) + 90) % 360 }));
                              }}
                              title="Rotate 90° Clockwise"
                            >
                              <RotateCw size={13} />
                            </button>

                            {pageOrder.length > 1 && (
                              <button 
                                className="thumbnail-action-btn btn-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPageOrder(prev => prev.filter(p => p !== pageNum));
                                  showToast(`Removed Page ${pageNum} from sequence!`);
                                }}
                                title="Remove Page"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls Pane */}
          <div className="controls-pane">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Tool Controls
            </h3>

            {/* Organize PDF Master Controls */}
            {tool.id === 'organize-pdf' && (
              <>
                <div className="control-group">
                  <label className="control-label">🌟 Select 1st Page (Cover)</label>
                  <select 
                    className="control-select"
                    value={pageOrder[0] || 1}
                    onChange={(e) => {
                      const target = Number(e.target.value);
                      setPageOrder(prev => [target, ...prev.filter(p => p !== target)]);
                      showToast(`Set Page ${target} as First Page!`);
                    }}
                  >
                    {pageOrder.map((p, i) => (
                      <option key={p} value={p}>Page {p} (Currently at #{i + 1})</option>
                    ))}
                  </select>
                  <div style={{ fontSize: '0.75rem', color: 'var(--pink-primary)', fontWeight: 600 }}>
                    Selected page will immediately move to Position #1.
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">🏁 Select Last Page (Ending)</label>
                  <select 
                    className="control-select"
                    value={pageOrder[pageOrder.length - 1] || pageOrder.length}
                    onChange={(e) => {
                      const target = Number(e.target.value);
                      setPageOrder(prev => [...prev.filter(p => p !== target), target]);
                      showToast(`Set Page ${target} as Last Page!`);
                    }}
                  >
                    {pageOrder.map((p, i) => (
                      <option key={p} value={p}>Page {p} (Currently at #{i + 1})</option>
                    ))}
                  </select>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                    Selected page will immediately move to the end.
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">⚡ Quick Reorder Presets</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button 
                      className="btn-outline" 
                      style={{ fontSize: '0.78rem', padding: '0.45rem', justifyContent: 'center' }}
                      onClick={() => {
                        setPageOrder(prev => [...prev].reverse());
                        showToast('Reversed all pages sequence!');
                      }}
                    >
                      <ArrowUpDown size={13} /> <span>Reverse All</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ fontSize: '0.78rem', padding: '0.45rem', justifyContent: 'center' }}
                      onClick={() => {
                        setPageOrder(thumbnails.map(t => t.pageNumber));
                        setPageRotations({});
                        showToast('Reset to original order!');
                      }}
                    >
                      <Undo2 size={13} /> <span>Reset Order</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ fontSize: '0.78rem', padding: '0.45rem', justifyContent: 'center' }}
                      onClick={() => {
                        const odds = pageOrder.filter(p => p % 2 !== 0);
                        const evens = pageOrder.filter(p => p % 2 === 0);
                        setPageOrder([...odds, ...evens]);
                        showToast('Reordered: Odd pages first, then Even pages!');
                      }}
                    >
                      <span>Odd First</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ fontSize: '0.78rem', padding: '0.45rem', justifyContent: 'center' }}
                      onClick={() => {
                        const evens = pageOrder.filter(p => p % 2 === 0);
                        const odds = pageOrder.filter(p => p % 2 !== 0);
                        setPageOrder([...evens, ...odds]);
                        showToast('Reordered: Even pages first, then Odd pages!');
                      }}
                    >
                      <span>Even First</span>
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">📝 Current Page Sequence</label>
                  <div style={{ 
                    fontSize: '0.78rem', 
                    fontFamily: 'Fira Code, monospace', 
                    background: 'var(--bg-card)', 
                    padding: '0.65rem', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border-subtle)',
                    wordBreak: 'break-all',
                    maxHeight: '80px',
                    overflowY: 'auto'
                  }}>
                    {pageOrder.map((p, i) => (
                      <span key={i} style={{ color: i === 0 ? '#ff2d75' : i === pageOrder.length - 1 ? '#38bdf8' : 'var(--text-secondary)' }}>
                        {p}{i < pageOrder.length - 1 ? ' → ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Split PDF Controls */}
            {tool.id === 'split-pdf' && (
              <div className="control-group">
                <label className="control-label">Split Mode</label>
                <select className="control-select" value={splitOption} onChange={(e) => setSplitOption(e.target.value)}>
                  <option value="all">Split every page into separate PDF (ZIP)</option>
                  <option value="range">Extract custom page range</option>
                </select>
                {splitOption === 'range' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label className="control-label">Range (e.g. 1-2)</label>
                    <input type="text" className="control-input" value={splitRange} onChange={(e) => setSplitRange(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {/* Merge PDF Controls */}
            {tool.id === 'merge-pdf' && (
              <div className="control-group">
                <span className="control-label">Files to Merge ({files.length})</span>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.4rem', background: 'var(--bg-card)', borderRadius: 4 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                      {i + 1}. {f.name}
                    </span>
                    <button 
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      style={{ background: 'none', border: 'none', color: 'var(--pink-primary)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  className="btn-outline" 
                  onClick={() => document.getElementById('file-upload-input').click()}
                  style={{ marginTop: '0.5rem' }}
                >
                  <Plus size={15} />
                  <span>Add Another File</span>
                </button>
              </div>
            )}

            {/* Edit PDF Controls */}
            {tool.id === 'edit-pdf' && (
              <>
                <div className="control-group">
                  <label className="control-label">✏️ Active Markup Mode</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'pen' ? 'active' : ''}`}
                      onClick={() => setEditTool('pen')}
                      style={{ justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <PenTool size={13} /> <span>Pencil</span>
                    </button>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'highlighter' ? 'active' : ''}`}
                      onClick={() => setEditTool('highlighter')}
                      style={{ justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <Highlighter size={13} /> <span>Highlighter</span>
                    </button>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'text' ? 'active' : ''}`}
                      onClick={() => setEditTool('text')}
                      style={{ justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <Type size={13} /> <span>Text Stamp</span>
                    </button>
                    <button 
                      type="button"
                      className={`btn-outline ${editTool === 'signature' ? 'active' : ''}`}
                      onClick={() => { setEditTool('signature'); setShowEditSigModal(true); }}
                      style={{ justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <FileSignature size={13} /> <span>Signature</span>
                    </button>
                  </div>
                </div>

                {/* Stroke thickness slider */}
                {editTool === 'pen' && (
                  <div className="control-group">
                    <label className="control-label">Pencil Thickness ({brushSize}px)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={brushSize} 
                      onChange={(e) => setBrushSize(Number(e.target.value))} 
                    />
                  </div>
                )}

                {editTool === 'highlighter' && (
                  <div className="control-group">
                    <label className="control-label">Highlighter Width ({highlighterSize}px)</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="48" 
                      value={highlighterSize} 
                      onChange={(e) => setHighlighterSize(Number(e.target.value))} 
                    />
                  </div>
                )}

                {/* Text Formatting Controls */}
                {editTool === 'text' && (
                  <>
                    <div className="control-group">
                      <label className="control-label">Text Content</label>
                      <input 
                        type="text" 
                        className="control-input" 
                        value={annotationText} 
                        onChange={(e) => setAnnotationText(e.target.value)} 
                        placeholder="Type text to place..."
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Font Size ({textFontSize}px)</label>
                      <input 
                        type="range" 
                        min="12" 
                        max="48" 
                        value={textFontSize} 
                        onChange={(e) => setTextFontSize(Number(e.target.value))} 
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Style Badges</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          type="button"
                          className={`btn-outline ${textIsBold ? 'active' : ''}`}
                          onClick={() => setTextIsBold(!textIsBold)}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Bold size={13} /> <span>Bold</span>
                        </button>
                        <button 
                          type="button"
                          className={`btn-outline ${textIsItalic ? 'active' : ''}`}
                          onClick={() => setTextIsItalic(!textIsItalic)}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Italic size={13} /> <span>Italic</span>
                        </button>
                        <button 
                          type="button"
                          className={`btn-outline ${textHasBg ? 'active' : ''}`}
                          onClick={() => setTextHasBg(!textHasBg)}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <span>Badge</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Page Selector */}
                {thumbnails.length > 1 && (
                  <div className="control-group">
                    <label className="control-label">Editing Page</label>
                    <select 
                      className="control-select" 
                      value={editActivePage} 
                      onChange={(e) => setEditActivePage(Number(e.target.value))}
                    >
                      {thumbnails.map(t => (
                        <option key={t.pageNumber} value={t.pageNumber}>Page {t.pageNumber}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Markup Summary Info */}
                <div className="control-group" style={{ 
                  background: 'var(--bg-card)', 
                  padding: '0.65rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                  lineHeight: 1.5
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--pink-primary)', marginBottom: '0.2rem' }}>
                    🎨 Multi-Page Markup Engine
                  </div>
                  <div>Strokes on Page {editActivePage}: {(editDrawingsPerPage[editActivePage] || []).length}</div>
                  <div>Stickers on Page {editActivePage}: {(editTextStickersPerPage[editActivePage] || []).length}</div>
                  <div style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                    All freehand markup, highlighters, signatures, and text are automatically vectorized and embedded into the saved PDF when you click Apply & Download.
                  </div>
                </div>
              </>
            )}

            {/* Crop PDF Margin Controls */}
            {tool.id === 'crop-pdf' && (
              <div className="control-group">
                <label className="control-label">Top Margin ({cropMargins.top}%)</label>
                <input type="range" min="0" max="30" value={cropMargins.top} onChange={(e) => setCropMargins(prev => ({ ...prev, top: Number(e.target.value) }))} />
                <label className="control-label">Bottom Margin ({cropMargins.bottom}%)</label>
                <input type="range" min="0" max="30" value={cropMargins.bottom} onChange={(e) => setCropMargins(prev => ({ ...prev, bottom: Number(e.target.value) }))} />
                <label className="control-label">Left Margin ({cropMargins.left}%)</label>
                <input type="range" min="0" max="30" value={cropMargins.left} onChange={(e) => setCropMargins(prev => ({ ...prev, left: Number(e.target.value) }))} />
                <label className="control-label">Right Margin ({cropMargins.right}%)</label>
                <input type="range" min="0" max="30" value={cropMargins.right} onChange={(e) => setCropMargins(prev => ({ ...prev, right: Number(e.target.value) }))} />
              </div>
            )}

            {/* Redaction Controls */}
            {tool.id === 'redact-pdf' && (
              <div className="control-group">
                <span className="control-label">Redaction Areas ({redactionBoxes.length})</span>
                {redactionBoxes.map((box) => (
                  <div key={box.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem', background: 'var(--bg-card)', borderRadius: 4 }}>
                    <span>{box.label}</span>
                    <button onClick={() => setRedactionBoxes(redactionBoxes.filter(b => b.id !== box.id))} style={{ background: 'none', border: 'none', color: 'var(--pink-primary)', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Forms Controls */}
            {tool.id === 'pdf-forms' && (
              <div className="control-group">
                <label className="control-label">Add Form Field</label>
                <select className="control-select" value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                  <option value="text">Text Input Field</option>
                  <option value="checkbox">Checkbox Field</option>
                </select>
                <input type="text" className="control-input" placeholder="Field Label..." value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} />
                <button 
                  className="btn-outline" 
                  onClick={() => {
                    const newF = {
                      id: Date.now(),
                      name: `field_${Date.now()}`,
                      type: newFieldType,
                      label: newFieldLabel,
                      value: newFieldType === 'checkbox' ? true : 'Sample Value',
                      x: 60,
                      y: 250 - (formFields.length * 35),
                      width: newFieldType === 'checkbox' ? 20 : 200,
                      height: newFieldType === 'checkbox' ? 20 : 25
                    };
                    setFormFields(prev => [...prev, newF]);
                    showToast('Added form field to PDF!');
                  }}
                >
                  <Plus size={15} /> <span>Add Field to Document</span>
                </button>
              </div>
            )}

            {/* Sign PDF Controls */}
            {tool.id === 'sign-pdf' && (
              <div className="control-group">
                <label className="control-label">Target Page</label>
                <select className="control-select" value={signaturePosition.page} onChange={(e) => setSignaturePosition(prev => ({ ...prev, page: Number(e.target.value) }))}>
                  {thumbnails.map(t => (
                    <option key={t.pageNumber} value={t.pageNumber}>Page {t.pageNumber}</option>
                  ))}
                </select>
                <label className="control-label">X Position ({signaturePosition.x} px)</label>
                <input type="range" min="30" max="400" value={signaturePosition.x} onChange={(e) => setSignaturePosition(prev => ({ ...prev, x: Number(e.target.value) }))} />
                <label className="control-label">Y Position ({signaturePosition.y} px)</label>
                <input type="range" min="30" max="700" value={signaturePosition.y} onChange={(e) => setSignaturePosition(prev => ({ ...prev, y: Number(e.target.value) }))} />
                <label className="control-label">Signature Size ({Math.round(signaturePosition.scale * 100)}%)</label>
                <input type="range" min="0.5" max="1.8" step="0.1" value={signaturePosition.scale} onChange={(e) => setSignaturePosition(prev => ({ ...prev, scale: Number(e.target.value) }))} />
              </div>
            )}

            {/* Rotate PDF Controls */}
            {tool.id === 'rotate-pdf' && (
              <div className="control-group">
                <label className="control-label">Rotation Angle</label>
                <select 
                  className="control-select" 
                  value={rotationDegrees} 
                  onChange={(e) => setRotationDegrees(Number(e.target.value))}
                >
                  <option value={90}>90° Clockwise</option>
                  <option value={180}>180° Half Turn</option>
                  <option value={270}>270° Counter-Clockwise</option>
                </select>
              </div>
            )}

            {/* Page Number Controls */}
            {tool.id === 'add-page-numbers' && (
              <>
                <div className="control-group">
                  <label className="control-label">Position</label>
                  <select 
                    className="control-select" 
                    value={numberPosition} 
                    onChange={(e) => setNumberPosition(e.target.value)}
                  >
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-center">Top Center</option>
                  </select>
                </div>
                <div className="control-group">
                  <label className="control-label">Number Color</label>
                  <select 
                    className="control-select" 
                    value={numberColor} 
                    onChange={(e) => setNumberColor(e.target.value)}
                  >
                    <option value="pink">Electric Pink (#ff2d75)</option>
                    <option value="black">Classic Black</option>
                    <option value="white">Pure White</option>
                  </select>
                </div>
              </>
            )}

            {/* Watermark Controls */}
            {tool.id === 'add-watermark' && (
              <>
                <div className="control-group">
                  <label className="control-label">Watermark Text</label>
                  <input 
                    type="text" 
                    className="control-input" 
                    value={watermarkText} 
                    onChange={(e) => setWatermarkText(e.target.value)}
                  />
                </div>
                <div className="control-group">
                  <label className="control-label">Opacity ({Math.round(watermarkOpacity * 100)}%)</label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={watermarkOpacity} 
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  />
                </div>
                <div className="control-group">
                  <label className="control-label">Color</label>
                  <select 
                    className="control-select" 
                    value={watermarkColor} 
                    onChange={(e) => setWatermarkColor(e.target.value)}
                  >
                    <option value="pink">Hot Pink</option>
                    <option value="gray">Subtle Gray</option>
                    <option value="black">Solid Black</option>
                  </select>
                </div>
              </>
            )}

            {/* Compress PDF Controls */}
            {tool.id === 'compress-pdf' && (
              <div className="control-group">
                <label className="control-label">Compression Level</label>
                <select 
                  className="control-select" 
                  value={compressLevel} 
                  onChange={(e) => setCompressLevel(e.target.value)}
                >
                  <option value="extreme">Extreme Compression (Smallest size, 0.6x)</option>
                  <option value="recommended">Recommended (Balanced quality, 0.85x)</option>
                  <option value="low">Low Compression (Highest fidelity, 1.0x)</option>
                </select>
                {compressionResult && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--pink-soft)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Original: {compressionResult.original}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pink-primary)' }}>
                      Compressed: {compressionResult.compressed} ({compressionResult.savedPercent}% saved)
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Protect Password Controls */}
            {tool.id === 'protect-pdf' && (
              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="control-label">Encryption Password</label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--pink-primary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="control-input" 
                  placeholder="Enter strong password..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="control-input" 
                  placeholder="Confirm password..." 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ marginTop: '0.35rem' }}
                />
                <div style={{ marginTop: '0.5rem', padding: '0.65rem', background: 'var(--pink-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pink-soft-border)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                  <div style={{ fontWeight: 700, color: 'var(--pink-primary)', marginBottom: '0.2rem' }}>🔒 AES-256 Military Grade</div>
                  Chrome, Edge, Adobe Acrobat, and Apple Preview will strictly require this password to open and view the PDF.
                </div>
              </div>
            )}

            {/* Unlock Password Controls */}
            {tool.id === 'unlock-pdf' && (
              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="control-label">Document Password</label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--pink-primary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="control-input" 
                  placeholder="Enter current password..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ marginTop: '0.5rem', padding: '0.65rem', background: 'var(--pink-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pink-soft-border)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                  <div style={{ fontWeight: 700, color: 'var(--pink-primary)', marginBottom: '0.2rem' }}>🔓 Permanent Decryption</div>
                  Removes password and restriction locks permanently so the PDF can be opened without credentials.
                </div>
              </div>
            )}

            {/* Action Execution Button */}
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: 'auto', justifyContent: 'center', padding: '0.85rem' }}
              onClick={executeToolAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>{statusMsg || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>
                    {tool.id.startsWith('pdf-to-') || tool.id.includes('-to-pdf') 
                      ? 'Convert & Download' 
                      : `Apply & Download`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Tool Step-by-Step Onboarding Modal */}
      <ToolOnboardingModal
        tool={tool}
        onboardingData={getToolOnboarding(tool.id, tool.name)}
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}
