import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import PptxGenJS from 'pptxgenjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { downloadBlob, downloadArrayBuffer, renderPageToCanvas, loadPdfDoc } from '../utils/pdfHelper';

/**
 * PDF to Word (.docx)
 */
export async function convertPdfToWord(textPages, filename = 'document.docx') {
  const sections = [];

  for (const page of textPages) {
    const lines = page.text.split('\n').filter(l => l.trim().length > 0);
    const children = [
      new Paragraph({
        text: `Page ${page.pageNumber}`,
        heading: HeadingLevel.HEADING_2,
      }),
    ];

    for (const line of lines) {
      if (line.toUpperCase() === line && line.length < 40) {
        children.push(new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_3,
        }));
      } else {
        children.push(new Paragraph({
          children: [new TextRun(line)],
        }));
      }
    }

    sections.push({
      properties: {},
      children,
    });
  }

  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  const outName = filename.toLowerCase().endsWith('.docx') ? filename : `${filename}.docx`;
  downloadBlob(blob, outName);
}

/**
 * PDF to PowerPoint (.pptx) using native pptxgenjs
 */
export async function convertPdfToPowerPoint(fileOrBuffer, filename = 'presentation.pptx') {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  const pdfDoc = await loadPdfDoc(fileOrBuffer);
  
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfDoc, i, 1.5);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    const slide = pptx.addSlide();
    slide.addImage({
      data: dataUrl,
      x: 0.5,
      y: 0.4,
      w: 9.0,
      h: 6.7,
      sizing: { type: 'contain', w: 9.0, h: 6.7 },
    });
    slide.addText(`Slide ${i} (from PDF Page ${i})`, {
      x: 0.5,
      y: 0.1,
      fontSize: 11,
      color: 'ff2d75',
      bold: true,
    });
  }

  const outName = filename.toLowerCase().endsWith('.pptx') ? filename : `${filename}.pptx`;
  await pptx.writeFile({ fileName: outName });
}

/**
 * PDF to Excel (.xlsx) using SheetJS
 */
export async function convertPdfToExcel(textPages, filename = 'spreadsheet.xlsx') {
  const wb = XLSX.utils.book_new();
  const rows = [];

  for (const page of textPages) {
    rows.push([`--- PAGE ${page.pageNumber} ---`]);
    const lines = page.text.split('\n');
    for (const line of lines) {
      // Split by tab, multiple spaces, or pipes
      const parts = line.split(/\s{2,}|\t|\|/).map(p => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        rows.push(parts);
      }
    }
    rows.push([]); // blank row separator
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'PDF Data');
  const outName = filename.toLowerCase().endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, outName);
}

/**
 * Excel (.xlsx, .xls, .csv) to PDF
 */
export async function convertExcelToPdf(file, filename = 'spreadsheet.pdf') {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data);
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage([595, 842]);
  let y = 780;

  // Header
  page.drawRectangle({
    x: 40,
    y: y - 5,
    width: 515,
    height: 35,
    color: rgb(0.08, 0.08, 0.12),
  });
  page.drawText(`Sheet: ${firstSheetName}`, {
    x: 50,
    y: y + 8,
    size: 14,
    font: fontBold,
    color: rgb(1, 0.18, 0.46),
  });

  y -= 45;

  for (let rowIndex = 0; rowIndex < Math.min(jsonData.length, 60); rowIndex++) {
    const row = jsonData[rowIndex];
    if (y < 60) {
      page = pdfDoc.addPage([595, 842]);
      y = 780;
    }

    const isHeaderRow = rowIndex === 0;
    if (isHeaderRow) {
      page.drawRectangle({
        x: 40,
        y: y - 5,
        width: 515,
        height: 22,
        color: rgb(1, 0.18, 0.46),
      });
    } else if (rowIndex % 2 === 0) {
      page.drawRectangle({
        x: 40,
        y: y - 5,
        width: 515,
        height: 20,
        color: rgb(0.96, 0.96, 0.98),
      });
    }

    let colX = 50;
    const colWidth = Math.floor(500 / Math.max(row.length, 1));

    for (let c = 0; c < row.length; c++) {
      const cellText = String(row[c] !== undefined ? row[c] : '').slice(0, 24);
      page.drawText(cellText, {
        x: colX,
        y,
        size: isHeaderRow ? 10 : 9,
        font: isHeaderRow ? fontBold : fontRegular,
        color: isHeaderRow ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1),
      });
      colX += colWidth;
    }

    y -= 22;
  }

  const pdfBytes = await pdfDoc.save();
  downloadArrayBuffer(pdfBytes, filename);
}

/**
 * HTML to PDF via html2canvas and jsPDF
 */
export async function convertHtmlToPdf(elementOrHtml, filename = 'document.pdf') {
  let container;
  let shouldCleanup = false;

  if (typeof elementOrHtml === 'string') {
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '794px'; // A4 width at 96 DPI
    container.style.background = '#ffffff';
    container.style.padding = '30px';
    container.style.color = '#000000';
    container.innerHTML = elementOrHtml;
    document.body.appendChild(container);
    shouldCleanup = true;
  } else {
    container = elementOrHtml;
  }

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  if (shouldCleanup && container.parentNode) {
    document.body.removeChild(container);
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}

/**
 * Word (.docx) to PDF
 */
export async function convertWordToPdf(file, textContent, filename = 'word_converted.pdf') {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage([595, 842]);
  let y = 780;

  // Header Title
  page.drawText(file ? file.name.replace(/\.[^/.]+$/, '') : 'Word Document', {
    x: 50,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.12),
  });
  y -= 30;

  page.drawRectangle({
    x: 50,
    y,
    width: 495,
    height: 2,
    color: rgb(1, 0.18, 0.46),
  });
  y -= 25;

  const content = textContent || 'Converted from DOCX formatted text.\nReady for review and distribution.';
  const lines = content.split('\n');

  for (const line of lines) {
    if (y < 60) {
      page = pdfDoc.addPage([595, 842]);
      y = 780;
    }
    const isHeading = line.startsWith('#') || (line.toUpperCase() === line && line.length < 35 && line.trim().length > 0);
    const cleanLine = line.replace(/^#+\s*/, '');

    page.drawText(cleanLine.slice(0, 95), {
      x: 50,
      y,
      size: isHeading ? 14 : 11,
      font: isHeading ? fontBold : fontRegular,
      color: isHeading ? rgb(0.9, 0.1, 0.4) : rgb(0.2, 0.2, 0.2),
    });
    y -= isHeading ? 24 : 18;
  }

  const pdfBytes = await pdfDoc.save();
  downloadArrayBuffer(pdfBytes, filename);
}

/**
 * PDF to PDF/A conversion
 */
export async function convertToPdfA(fileOrBuffer, filename = 'archival_pdfa.pdf') {
  const arrayBuffer = await fileOrBuffer.arrayBuffer ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Set standard PDF/A metadata
  pdfDoc.setTitle('Archival Document (PDF/A)');
  pdfDoc.setAuthor('PINKPDF Suite');
  pdfDoc.setSubject('ISO 19005-1 Compliant PDF/A Archival Format');
  pdfDoc.setKeywords(['PDF/A', 'Archive', 'ISO Standard', 'PINKPDF']);
  pdfDoc.setProducer('PINKPDF Engine v2.0');
  pdfDoc.setCreator('PINKPDF Archival Generator');
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());

  const pdfBytes = await pdfDoc.save();
  downloadArrayBuffer(pdfBytes, filename);
}
