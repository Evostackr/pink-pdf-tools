import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import saveAs from 'file-saver';

// Configure pdfjs worker to local bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * Convert File to ArrayBuffer with safe copy
 */
export async function fileToArrayBuffer(file) {
  if (file instanceof ArrayBuffer) return file.slice(0);
  if (file instanceof Uint8Array) return file.buffer.slice(0);
  if (typeof file.arrayBuffer === 'function') {
    const buf = await file.arrayBuffer();
    return buf.slice(0);
  }
  return file;
}

/**
 * Format bytes to readable string (KB, MB)
 */
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format standardized download filename with website URL: pinkpdf.evostackr.in_{tool_name}.{ext}
 */
export function formatToolDownloadFilename(toolId, ext = 'pdf', extraSuffix = '') {
  const cleanTool = (toolId || 'document').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
  const suffix = extraSuffix ? `_${extraSuffix}` : '';
  const cleanExt = ext.replace(/^\./, '');
  return `pinkpdf.evostackr.in_${cleanTool}${suffix}.${cleanExt}`;
}

/**
 * Download ArrayBuffer as file
 */
export function downloadArrayBuffer(buffer, filename, mimeType = 'application/pdf') {
  const blob = new Blob([buffer], { type: mimeType });
  saveAs(blob, filename);
}

/**
 * Download Blob as file
 */
export function downloadBlob(blob, filename) {
  saveAs(blob, filename);
}


/**
 * Load PDF with pdfjsLib (cloning ArrayBuffer so worker transfer never detaches original)
 */
export async function loadPdfDoc(fileOrBuffer) {
  if (fileOrBuffer && typeof fileOrBuffer.getPage === 'function') {
    return fileOrBuffer; // Already loaded pdfjs doc
  }
  const arrayBuffer = await fileToArrayBuffer(fileOrBuffer);
  // pdfjs getDocument transfers typed array buffer to worker; always pass fresh slice:
  const bufferCopy = arrayBuffer.slice(0);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(bufferCopy) });
  return await loadingTask.promise;
}

/**
 * Render a single page to canvas
 */
export async function renderPageToCanvas(pdfDoc, pageNumber, scale = 1.5, targetCanvas = null) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return canvas;
}

/**
 * Render all pages as image data URLs / canvas thumbnails
 */
export async function renderAllPagesThumbnails(fileOrBufferOrDoc, scale = 0.5) {
  const pdfDoc = await loadPdfDoc(fileOrBufferOrDoc);
  const thumbnails = [];
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfDoc, i, scale);
    thumbnails.push({
      pageNumber: i,
      dataUrl: canvas.toDataURL('image/jpeg', 0.85),
      width: canvas.width,
      height: canvas.height,
    });
  }
  return { pdfDoc, thumbnails, totalPages: pdfDoc.numPages };
}

/**
 * Extract all text from PDF page by page
 */
export async function extractTextFromPdf(fileOrBufferOrDoc) {
  const pdfDoc = await loadPdfDoc(fileOrBufferOrDoc);
  const pagesText = [];
  let fullText = '';

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    const pageString = strings.join(' ');
    pagesText.push({ pageNumber: i, text: pageString });
    fullText += `--- Page ${i} ---\n` + pageString + '\n\n';
  }

  return { pagesText, fullText, totalPages: pdfDoc.numPages };
}

/**
 * Create a stylish multi-page sample PDF for quick 1-click testing
 */
export async function createSamplePdf(title = 'Sample PinkPDF Document') {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Page 1: Cover & Intro
  const page1 = pdfDoc.addPage([595, 842]); // A4
  // Header background banner
  page1.drawRectangle({
    x: 0,
    y: 720,
    width: 595,
    height: 122,
    color: rgb(0.06, 0.06, 0.08),
  });
  page1.drawRectangle({
    x: 0,
    y: 715,
    width: 595,
    height: 5,
    color: rgb(1, 0.18, 0.46), // Neon Pink #ff2d75
  });

  page1.drawText('PINKPDF SUITE', {
    x: 50,
    y: 770,
    size: 28,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page1.drawText('Professional In-Browser PDF Processing', {
    x: 50,
    y: 742,
    size: 13,
    font: fontRegular,
    color: rgb(1, 0.42, 0.62),
  });

  page1.drawText(title, {
    x: 50,
    y: 650,
    size: 22,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.15),
  });

  const introText = [
    'Welcome to PINKPDF! This document is generated on-demand to test all 33 tools.',
    'Every operation runs 100% inside your browser using client-side WebAssembly,',
    'ensuring total security, lightning speed, and complete privacy for all files.',
    '',
    'Features tested in this document:',
    '• High-fidelity page rendering & canvas manipulation',
    '• Extraction of text, tables, and structural elements',
    '• Support for splitting, merging, rotating, watermarking, and reordering',
    '• Security capabilities including digital signature stamps & redaction',
    '• AI intelligence summaries, translations, and markdown export',
  ];

  let y = 600;
  for (const line of introText) {
    page1.drawText(line, {
      x: 50,
      y,
      size: 12,
      font: line.startsWith('•') || line.startsWith('Features') ? fontBold : fontRegular,
      color: rgb(0.2, 0.2, 0.25),
    });
    y -= 22;
  }

  // Pink Accent Box
  page1.drawRectangle({
    x: 50,
    y: 280,
    width: 495,
    height: 90,
    color: rgb(1, 0.95, 0.97),
    borderColor: rgb(1, 0.18, 0.46),
    borderWidth: 1.5,
  });
  page1.drawText('Pro Tip: You can edit, sign, merge, crop, or protect this file instantly!', {
    x: 70,
    y: 325,
    size: 13,
    font: fontBold,
    color: rgb(0.9, 0.1, 0.4),
  });

  page1.drawText('Page 1 of 3 - Generated by PINKPDF', {
    x: 210,
    y: 30,
    size: 10,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Page 2: Data & Tables
  const page2 = pdfDoc.addPage([595, 842]);
  page2.drawText('Quarterly Performance & Metrics', {
    x: 50,
    y: 770,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.12),
  });
  page2.drawText('Table sample for testing PDF to Excel, OCR, and AI summarization:', {
    x: 50,
    y: 740,
    size: 12,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.45),
  });

  // Draw Table Header
  page2.drawRectangle({
    x: 50,
    y: 680,
    width: 495,
    height: 30,
    color: rgb(1, 0.18, 0.46),
  });
  page2.drawText('Module / Tool', { x: 65, y: 690, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Category', { x: 230, y: 690, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Processing Speed', { x: 340, y: 690, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Status', { x: 470, y: 690, size: 11, font: fontBold, color: rgb(1, 1, 1) });

  const rows = [
    ['Merge & Split Engine', 'Organize', '< 150 ms', 'Active'],
    ['Compress & Repair', 'Optimize', '< 250 ms', 'Verified'],
    ['Word / Excel / PPTX', 'Conversions', '< 400 ms', 'Ready'],
    ['Digital Sign & Redact', 'Security', '< 80 ms', 'Protected'],
    ['AI Summarize & Translate', 'Intelligence', '< 300 ms', 'Online'],
  ];

  let rowY = 650;
  rows.forEach((row, idx) => {
    if (idx % 2 === 0) {
      page2.drawRectangle({
        x: 50,
        y: rowY - 5,
        width: 495,
        height: 25,
        color: rgb(0.96, 0.96, 0.98),
      });
    }
    page2.drawText(row[0], { x: 65, y: rowY + 3, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
    page2.drawText(row[1], { x: 230, y: rowY + 3, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    page2.drawText(row[2], { x: 340, y: rowY + 3, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    page2.drawText(row[3], { x: 470, y: rowY + 3, size: 10, font: fontBold, color: rgb(0.1, 0.6, 0.2) });
    rowY -= 30;
  });

  page2.drawText('Confidential & Proprietary Document', {
    x: 50,
    y: 380,
    size: 14,
    font: fontBold,
    color: rgb(0.8, 0.1, 0.3),
  });
  page2.drawText('This sample paragraph contains sensitive test information for Redaction tool testing.', {
    x: 50,
    y: 355,
    size: 11,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });
  page2.drawText('Target Account ID: ACCT-99482-SECURE | PIN: 84920', {
    x: 50,
    y: 335,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page2.drawText('Page 2 of 3 - Generated by PINKPDF', {
    x: 210,
    y: 30,
    size: 10,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Page 3: Visual Elements & Form fields test
  const page3 = pdfDoc.addPage([595, 842]);
  page3.drawText('Interactive Tools & Signature Zone', {
    x: 50,
    y: 770,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.12),
  });
  page3.drawText('Use this page to test Sign PDF, Add Watermark, Edit PDF, and Page Numbering:', {
    x: 50,
    y: 740,
    size: 12,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.45),
  });

  // Signature box
  page3.drawRectangle({
    x: 50,
    y: 480,
    width: 300,
    height: 120,
    borderColor: rgb(0.7, 0.7, 0.75),
    borderWidth: 1,
    borderDashPhase: 4,
    borderDashArray: [4, 4],
    color: rgb(0.98, 0.98, 1),
  });
  page3.drawText('PLACE SIGNATURE HERE', {
    x: 100,
    y: 535,
    size: 12,
    font: fontBold,
    color: rgb(0.6, 0.6, 0.65),
  });

  page3.drawText('Authorized Signature: _______________________________', {
    x: 50,
    y: 440,
    size: 11,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });
  page3.drawText('Date: ________________________', {
    x: 50,
    y: 410,
    size: 11,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  page3.drawText('Page 3 of 3 - Generated by PINKPDF', {
    x: 210,
    y: 30,
    size: 10,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], 'sample-pinkpdf-doc.pdf', { type: 'application/pdf' });
}
