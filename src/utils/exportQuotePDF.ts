import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import type { WindowSegment } from '../types';

const TYPE_NAMES: Record<string, string> = {
  fijo: 'Fijo',
  corredera: 'Corredera',
  proyectante: 'Proyectante',
  abatible: 'Abatible',
  puerta: 'Puerta',
};

export const exportQuotePDF = async (
  segments: WindowSegment[],
  clientName: string,
  totalCost: number
) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // ── Header ──
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.rect(0, 0, pageWidth, 38, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Presupuesto de Ventanas', pageWidth / 2, 16, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const today = new Date();
    const dateStr = today.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    pdf.text(`Cliente: ${clientName || 'Sin Nombre'}`, margin, 28);
    pdf.text(`Fecha: ${dateStr}`, pageWidth - margin, 28, { align: 'right' });

    let currentY = 48;

    // ── Canvas Image ──
    const svgElement = document.querySelector('svg.w-full.h-full');
    if (svgElement) {
      try {
        const dataUrl = await toPng(svgElement as HTMLElement, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          width: (svgElement as SVGSVGElement).clientWidth,
          height: (svgElement as SVGSVGElement).clientHeight,
        });

        const imgWidthMM = contentWidth;
        const aspectRatio = (svgElement as SVGSVGElement).clientHeight / (svgElement as SVGSVGElement).clientWidth;
        const imgHeightMM = Math.min(imgWidthMM * aspectRatio, 80);

        pdf.addImage(dataUrl, 'PNG', margin, currentY, imgWidthMM, imgHeightMM);
        currentY += imgHeightMM + 8;
      } catch (imgErr) {
        console.warn('No se pudo capturar la vista previa del canvas:', imgErr);
      }
    }

    // ── Segment Details Table ──
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detalle de Elementos', margin, currentY);
    currentY += 7;

    // Table headers
    const colX = {
      num: margin,
      type: margin + 10,
      dims: margin + 45,
      glass: margin + 85,
      color: margin + 130,
    };

    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.rect(margin, currentY - 4, contentWidth, 7, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(71, 85, 105); // slate-500
    pdf.text('#', colX.num, currentY);
    pdf.text('Tipo', colX.type, currentY);
    pdf.text('Dimensiones', colX.dims, currentY);
    pdf.text('Vidrio', colX.glass, currentY);
    pdf.text('Color', colX.color, currentY);
    currentY += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 41, 59); // slate-800
    pdf.setFontSize(9);

    segments.forEach((seg, i) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 20;
      }

      // Alternating row bg
      if (i % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin, currentY - 4, contentWidth, 6, 'F');
      }

      const typeName = TYPE_NAMES[seg.type] || seg.type;
      const dims = `${seg.width} x ${seg.height} mm`;

      // Optional accessories
      const accList: string[] = [];
      if (seg.accessories?.mosquitero) accList.push('Mosq.');
      if (seg.accessories?.zocalo) accList.push('Zóc.');
      if (seg.accessories?.palillaje) accList.push('Pal.');

      pdf.setTextColor(30, 41, 59);
      pdf.text(`${i + 1}`, colX.num, currentY);
      pdf.text(typeName, colX.type, currentY);
      pdf.text(dims, colX.dims, currentY);
      pdf.text(seg.glass.substring(0, 18), colX.glass, currentY);
      pdf.text(seg.color, colX.color, currentY);

      if (accList.length > 0) {
        currentY += 4;
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Accesorios: ${accList.join(', ')}`, colX.type, currentY);
        pdf.setFontSize(9);
      }

      currentY += 6;
    });

    // ── Total ──
    currentY += 4;
    pdf.setDrawColor(203, 213, 225);
    pdf.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 8;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('TOTAL:', margin, currentY);
    pdf.text(`$${Math.round(totalCost).toLocaleString('es-CL')}`, margin + contentWidth, currentY, { align: 'right' });
    currentY += 8;

    // ── Footer ──
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `Validez de la oferta: 30 días a partir de la fecha de emisión (${dateStr}).`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    // Download
    const safeName = (clientName || 'presupuesto').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Presupuesto_${safeName}_${dateStr.replace(/\//g, '-')}.pdf`);

  } catch (e) {
    console.error('Error exportando PDF:', e);
    alert('Error al generar el PDF. Revisa la consola para más detalles.');
  }
};
