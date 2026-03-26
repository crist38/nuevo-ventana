import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { WindowSegment, Sheet } from '../types';
import { getCutList } from '../lib/cuttingFormulas';

export const exportWorkOrder = (segments: WindowSegment[], sheets: Sheet[], projectName: string = 'Proyecto Vario') => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text("Pauta de Corte / Orden de Trabajo", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, 14, 30);
  doc.text(`Proyecto: ${projectName}`, 14, 36);

  let startY = 45;

  segments.forEach((segment, index) => {
    // Add page if near bottom
    if (startY > 250) {
      doc.addPage();
      startY = 20;
    }

    const sheetName = sheets?.find(s => s.id === segment.sheetId)?.name || 'General';

    // Window Header Row
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(`Ventana #${index + 1}: ${segment.type.toUpperCase()} (${sheetName})`, 14, startY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const details = `Línea: ${segment.line} | Color: ${segment.color} | Dim: ${segment.width}x${segment.height}mm`;
    doc.text(details, 14, startY + 6);
    
    startY += 10;

    const cuts = getCutList(segment);
    
    if (cuts.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(239, 68, 68);
      doc.text("Sin fórmulas de corte definidas para esta línea.", 14, startY + 5);
      startY += 15;
      return;
    }

    const tableData = cuts.map(cut => [
      cut.tipo,
      cut.perfil,
      cut.codigo,
      cut.cantidad.toString(),
      cut.corte,
      cut.medida
    ]);

    // @ts-ignore
    doc.autoTable({
      startY: startY,
      head: [['Tipo', 'Perfil/Elemento', 'Código', 'Cant.', 'Corte', 'Medida a Cortar']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 40, halign: 'right', fontStyle: 'bold', textColor: [37, 99, 235] }
      },
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    startY = doc.lastAutoTable.finalY + 15;
  });

  // Footer / Notes
  if (startY > 270) {
    doc.addPage();
    startY = 20;
  }
  
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Nota: Los descuentos en milímetros están basados en la configuración base del taller.", 14, startY);
  doc.text("El instalador debe verificar las medidas finales en obra.", 14, startY + 5);

  doc.save(`Pauta_Corte_${projectName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};
