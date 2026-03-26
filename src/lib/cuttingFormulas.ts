import type { WindowSegment } from '../types';

export interface CutPiece {
  perfil: string;
  codigo: string;
  cantidad: number;
  medida: string;
  corte: string;
  tipo: "Perfil" | "Vidrio" | "Accesorio";
}

/**
 * Motor de Fórmulas para Pauta de Corte.
 * IMPORTANTE: Estos descuentos son a modo de ejemplo estructural.
 * El encargado técnico debe revisar y ajustar las matemáticas (sumas/restas) 
 * de acuerdo a los manuales de perfiles correspondientes (ej: Serie 25, 42, 5000).
 */
export const getCutList = (segment: WindowSegment): CutPiece[] => {
  const w = segment.width;
  const h = segment.height;
  const list: CutPiece[] = [];

  // ==========================================
  // LÍNEA: AL-15
  // ==========================================
  if (segment.line === 'AL-15') {
    if (segment.type === 'corredera') {
      list.push({ tipo: "Perfil", perfil: "Riel Superior", codigo: "1501", cantidad: 1, medida: `${w} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Riel Inferior", codigo: "1502", cantidad: 1, medida: `${w} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Jamba", codigo: "1503", cantidad: 2, medida: `${h - 7} mm`, corte: "90°/90°" });
      
      const anchoHoja = Math.round(w / 2);
      list.push({ tipo: "Perfil", perfil: "Cabezal", codigo: "1504", cantidad: 2, medida: `${anchoHoja} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Zócalo", codigo: "1505", cantidad: 2, medida: `${anchoHoja - 3} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Pierna", codigo: "1506", cantidad: 2, medida: `${h - 26} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Traslapo", codigo: "1508", cantidad: 2, medida: `${h - 26} mm`, corte: "90°/90°" });
      
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 2, medida: `${anchoHoja - 34} x ${h - 90} mm`, corte: "-" });
    }
  }

  // ==========================================
  // LÍNEA: AL-20
  // ==========================================
  else if (segment.line === 'AL-20') {
    if (segment.type === 'corredera') {
      list.push({ tipo: "Perfil", perfil: "Riel Superior", codigo: "2001", cantidad: 1, medida: `${w - 9} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Riel Inferior", codigo: "2002", cantidad: 1, medida: `${w - 9} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Jamba", codigo: "2009", cantidad: 2, medida: `${h} mm`, corte: "90°/90°" });
      
      const anchoHoja = Math.round(w / 2);
      list.push({ tipo: "Perfil", perfil: "Cabezal", codigo: "2004", cantidad: 2, medida: `${anchoHoja - 1} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Zócalo", codigo: "2005", cantidad: 2, medida: `${anchoHoja - 4} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Pierna", codigo: "2010", cantidad: 2, medida: `${h - 28} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Traslapo", codigo: "2019", cantidad: 2, medida: `${h - 28} mm`, corte: "90°/90°" });
      
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 2, medida: `${anchoHoja - 54} x ${h - 100} mm`, corte: "-" });
    }
  }

  // ==========================================
  // LÍNEA: AL-25
  // ==========================================
  else if (segment.line === 'AL-25') {
    if (segment.type === 'corredera') {
      list.push({ tipo: "Perfil", perfil: "Riel Superior", codigo: "2501", cantidad: 1, medida: `${w - 16} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Riel Inferior", codigo: "2502", cantidad: 1, medida: `${w - 16} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Jamba", codigo: "2509", cantidad: 2, medida: `${h} mm`, corte: "90°/90°" });
      
      const anchoHoja = Math.round(w / 2);
      list.push({ tipo: "Perfil", perfil: "Cabezal", codigo: "2504", cantidad: 2, medida: `${anchoHoja + 3} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Zócalo", codigo: "2515", cantidad: 2, medida: `${anchoHoja + 3} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Pierna", codigo: "2510", cantidad: 2, medida: `${h - 35} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Traslapo", codigo: "2507", cantidad: 2, medida: `${h - 35} mm`, corte: "90°/90°" });
      
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 2, medida: `${anchoHoja - 66} x ${h - 116} mm`, corte: "-" });
    }
  }

  // ==========================================
  // LÍNEA: AL-32
  // ==========================================
  else if (segment.line === 'AL-32') {
    if (segment.type === 'proyectante' || segment.type === 'fijo' || segment.type === 'abatible') {
      list.push({ tipo: "Perfil", perfil: "Marco Superior/Inferior", codigo: "3201", cantidad: 2, medida: `${w} mm`, corte: "45°/45°" });
      list.push({ tipo: "Perfil", perfil: "Marco Lateral (Jamba)", codigo: "3201", cantidad: 2, medida: `${h} mm`, corte: "45°/45°" });
      
      if (segment.type === 'proyectante' || segment.type === 'abatible') {
        list.push({ tipo: "Perfil", perfil: "Hoja Superior/Inferior", codigo: "3202", cantidad: 2, medida: `${w - 23} mm`, corte: "45°/45°" });
        list.push({ tipo: "Perfil", perfil: "Hoja Lateral", codigo: "3202", cantidad: 2, medida: `${h - 23} mm`, corte: "45°/45°" });
        list.push({ tipo: "Perfil", perfil: "Junquillo Horiz", codigo: "3208", cantidad: 2, medida: `${w - 85} mm`, corte: "90°/90°" });
        list.push({ tipo: "Perfil", perfil: "Junquillo Vert", codigo: "3208", cantidad: 2, medida: `${h - 85} mm`, corte: "29°/29°" });
        
        list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 1, medida: `${w - 94} x ${h - 94} mm`, corte: "-" });
      }
    }
  }

  // ==========================================
  // LÍNEA: AL-42
  // ==========================================
  else if (segment.line === 'AL-42') {
    if (segment.type === 'proyectante' || segment.type === 'fijo' || segment.type === 'abatible') {
      list.push({ tipo: "Perfil", perfil: "Marco Superior/Inferior", codigo: "4201", cantidad: 2, medida: `${w} mm`, corte: "45°/45°" });
      list.push({ tipo: "Perfil", perfil: "Marco Lateral (Jamba)", codigo: "4201", cantidad: 2, medida: `${h} mm`, corte: "45°/45°" });
      
      if (segment.type === 'proyectante' || segment.type === 'abatible') {
        list.push({ tipo: "Perfil", perfil: "Hoja Superior/Inferior", codigo: "4202", cantidad: 2, medida: `${w - 18} mm`, corte: "45°/45°" });
        list.push({ tipo: "Perfil", perfil: "Hoja Lateral", codigo: "4202", cantidad: 2, medida: `${h - 18} mm`, corte: "45°/45°" });
        list.push({ tipo: "Perfil", perfil: "Junquillo Horiz", codigo: "4229", cantidad: 2, medida: `${w - 90} mm`, corte: "90°/90°" });
        list.push({ tipo: "Perfil", perfil: "Junquillo Vert", codigo: "4229", cantidad: 2, medida: `${h - 90} mm`, corte: "34°/34°" });
        
        list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 1, medida: `${w - 96} x ${h - 96} mm`, corte: "-" });
      }
    }
  }

  // ==========================================
  // LÍNEA: Columbia 4000
  // ==========================================
  else if (segment.line === 'Columbia 4000') {
    if (segment.type === 'corredera') {
      list.push({ tipo: "Perfil", perfil: "Riel Superior", codigo: "4001", cantidad: 1, medida: `${w} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Riel Inferior", codigo: "4002", cantidad: 1, medida: `${w} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Jamba", codigo: "4003", cantidad: 2, medida: `${h - 3} mm`, corte: "90°/90°" });
      
      const anchoHoja = Math.round(w / 2);
      list.push({ tipo: "Perfil", perfil: "Cabezal", codigo: "4004", cantidad: 2, medida: `${anchoHoja - 1} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Zócalo", codigo: "4005", cantidad: 2, medida: `${anchoHoja - 4} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Pierna", codigo: "4008", cantidad: 2, medida: `${h - 18} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Traslapo", codigo: "4007", cantidad: 2, medida: `${h - 18} mm`, corte: "90°/90°" });
      
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 2, medida: `${anchoHoja - 42} x ${h - 76} mm`, corte: "-" });
    }
  }

  // ==========================================
  // LÍNEA: Columbia 5000
  // ==========================================
  else if (segment.line === 'AL-5000') {
    if (segment.type === 'corredera') {
      list.push({ tipo: "Perfil", perfil: "Riel Superior", codigo: "5001", cantidad: 1, medida: `${w} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Riel Inferior", codigo: "5002", cantidad: 1, medida: `${w} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Jamba", codigo: "5003", cantidad: 2, medida: `${h - 3} mm`, corte: "90°/3°" }); // Catálogo dice 90/3, asumo 90°/90° con leve ángulo abajo, mantengo 90°
      
      const anchoHoja = Math.round(w / 2);
      list.push({ tipo: "Perfil", perfil: "Cabezal", codigo: "5004", cantidad: 2, medida: `${anchoHoja - 2} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Zócalo", codigo: "5005", cantidad: 2, medida: `${anchoHoja - 5} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Pierna", codigo: "5006", cantidad: 2, medida: `${h - 20} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Traslapo", codigo: "5007", cantidad: 2, medida: `${h - 20} mm`, corte: "90°/90°" });
      
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 2, medida: `${anchoHoja - 50} x ${h - 84} mm`, corte: "-" });
    }
  }

  // ==========================================
  // LÍNEA: AM-35
  // ==========================================
  else if (segment.line === 'AM-35') {
    if (segment.type === 'puerta' || segment.type === 'abatible') {
      // Fórmulas para Puerta de Abatir AM-35 (1 Hoja)
      // Basado en: MODELO: PA35NM-AMNC
      list.push({ tipo: "Perfil", perfil: "Marco Superior", codigo: "3502", cantidad: 1, medida: `${w} mm`, corte: "45°/45°" });
      list.push({ tipo: "Perfil", perfil: "Marco Lateral", codigo: "3502", cantidad: 2, medida: `${h} mm`, corte: "45°/90°" });
      list.push({ tipo: "Perfil", perfil: "Pierna", codigo: "3501", cantidad: 2, medida: `${h - 28} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Zócalo / Cabezal", codigo: "3501", cantidad: 2, medida: `${w - 179} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Junquillo Vertical", codigo: "3503", cantidad: 4, medida: `${h - 168} mm`, corte: "45°/45°" });
      list.push({ tipo: "Perfil", perfil: "Junquillo Horiz", codigo: "4412", cantidad: 4, medida: `${w - 179} mm`, corte: "90°/90°" });
      list.push({ tipo: "Perfil", perfil: "Tapa", codigo: "3506", cantidad: 1, medida: `${h - 28} mm`, corte: "90°/90°" });
      
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 1, medida: `${w - 188} x ${h - 176} mm`, corte: "-" });
    } else {
      list.push({ tipo: "Perfil", perfil: `Marco Horizontal (${segment.type})`, codigo: "GEN", cantidad: 2, medida: `${w} mm`, corte: "45°" });
      list.push({ tipo: "Perfil", perfil: `Marco Vertical (${segment.type})`, codigo: "GEN", cantidad: 2, medida: `${h} mm`, corte: "45°" });
      list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 1, medida: `TBD (Revisar PDF)`, corte: "90°" });
    }
  }

  // ==========================================
  // OTRAS LÍNEAS (Pendiente rellenar)
  // ==========================================
  else {
    // Fórmulas genéricas como fallback temporal
    list.push({ tipo: "Perfil", perfil: `Marco Horizontal (${segment.type})`, codigo: "GEN", cantidad: 2, medida: `${w} mm`, corte: "45°" });
    list.push({ tipo: "Perfil", perfil: `Marco Vertical (${segment.type})`, codigo: "GEN", cantidad: 2, medida: `${h} mm`, corte: "45°" });
    list.push({ tipo: "Vidrio", perfil: segment.glass, codigo: "VIDRIO", cantidad: 1, medida: `TBD (Revisar PDF)`, corte: "90°" });
  }

  return list;
};
