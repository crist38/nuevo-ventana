import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { SavedQuote } from '../types';

export const generateQuotePDF = (quote: SavedQuote) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Title
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('Presupuesto de Ventanas y Cristales', 14, 22);
  
  // Quote Meta
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Cliente: ${quote.clientName}`, 14, 30);
  doc.text(`Fecha: ${new Date(quote.date).toLocaleDateString()}`, 14, 35);
  doc.text(`ID Referencia: ${quote.id}`, 14, 40);

  // 1. Commercial Summary Table
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Resumen Comercial', 14, 55);

  const commercialBody = quote.segments.map((seg, i) => [
    i + 1,
    seg.type.toUpperCase(),
    seg.line,
    `${seg.width} x ${seg.height} mm`,
    seg.glass,
    seg.color,
    `1` // Quantity
  ]);

  (doc as any).autoTable({
    startY: 60,
    head: [['Item', 'Tipo', 'Línea', 'Medidas (An x Al)', 'Cristal', 'Color', 'Cant.']],
    body: commercialBody,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(`Valor Total Neto Estimado: $${quote.totalCost.toFixed(2)}`, pageWidth - 14, finalY + 15, { align: 'right' });

  // 2. Technical Cut List (Pauta de Corte)
  // Usually this prints on a new page for the workshop
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Pauta de Corte Técnica (Taller)', 14, 22);

  const technicalBody = quote.segments.map((seg, i) => {
    // Basic logic mapping for cutting (mocking standard deductions)
    const cw = seg.width;
    const ch = seg.height;
    
    // Example: Glass size is typically Width - 20mm and Height - 20mm depending on frame
    const glassW = cw - 30;
    const glassH = ch - 30;

    return [
      i + 1,
      seg.line,
      `${cw} mm (Cabezal/Zócalo)`,
      `${ch} mm (Jambas)`,
      `${glassW} x ${glassH} mm`,
      seg.type.toUpperCase()
    ];
  });

  (doc as any).autoTable({
    startY: 30,
    head: [['Item', 'Sistema', 'Corte Ancho (x2)', 'Corte Alto (x2)', 'Corte de Cristal', 'Notas/Tipo']],
    body: technicalBody,
    theme: 'plain',
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 4, lineColor: [200, 200, 200], lineWidth: 0.1 }
  });

  // Save the PDF
  doc.save(`Presupuesto_${quote.clientName}_${new Date(quote.date).getTime()}.pdf`);
};
