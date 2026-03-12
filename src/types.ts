export type WindowSegmentType = "puerta" | "corredera" | "fijo" | "proyectante" | "abatible";
export type LineType = "AL-25" | "AL-5000" | "AL-20" | "AL-42" | "AL-32" | "AM-35" | "AL-12 Shower Door" | "S-38 RPT" | "S-33 RPT" | "AL-25 TP" | "Tubular 40x80";
export type GlassType = "Incoloro 3mm" | "Incoloro 4mm" | "Incoloro 5mm" | "Incoloro 6mm" | "Incoloro 8mm" | "Incoloro 10mm" | "Bronce 4mm" | "Bronce 5mm" | "Bronce 6mm" | "Espejo 4mm" | "Satén 4mm" | "Satén 5mm" | "Laminado 5mm" | "Laminado 6mm" | "Laminado 8mm" | "Laminado 10mm" | "Templado 10mm" | "Empavonado 4mm" | "Empavonado 5mm" | "DVH 4+9+4" | "Acrílico";
export type ColorType = "Blanco" | "Negro" | "Mate" | "Titanio" | "Nogal" | "Roble Dorado";

export interface WindowSegment {
  id: string;
  type: WindowSegmentType;
  line: LineType;
  glass: GlassType;
  color: ColorType;
  width: number; // Width in millimeters
  height: number; // Height in millimeters
  x: number; // local X offset in mm
  y: number; // local Y offset in mm
  accessories?: {
    mosquitero: boolean;
    zocalo: boolean;
    palillaje: boolean;
  };
  openingDirection?: 'left' | 'right' | 'both';
}

// Global quote settings for pricing
export interface QuoteSettings {
  basePricePerSegment: number;
  glassPrices: Record<GlassType, number>;
  profilePrices: Record<LineType, number>;
  colorPrices: Record<ColorType, number>;
  accessoryPricePerSegment: Record<WindowSegmentType, number>;
  optionalAccessories: {
    mosquitero: number;
    zocalo: number;
    palillaje: number;
  };
}

export interface SavedQuote {
  id: string; // Firestore DOC ID
  clientName: string;
  date: string; // ISO String
  segments: WindowSegment[];
  totalCost: number;
}
