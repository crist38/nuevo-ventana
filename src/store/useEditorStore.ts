import { create } from 'zustand';
import type { WindowSegment, QuoteSettings, Sheet } from '../types';

interface EditorState {
  segments: WindowSegment[];
  sheets: Sheet[];
  activeSheetId: string;
  selectedId: string | null;
  settings: QuoteSettings;
  
  // Actions
  addSheet: () => void;
  removeSheet: (id: string) => void;
  renameSheet: (id: string, name: string) => void;
  setActiveSheet: (id: string) => void;
  addSegment: (segment: Omit<WindowSegment, "id" | "sheetId">) => void;
  updateSegment: (id: string, updates: Partial<WindowSegment>) => void;
  removeSegment: (id: string) => void;
  selectSegment: (id: string | null) => void;
  updateSettings: (updates: Partial<QuoteSettings>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  sheets: [{ id: 'default-sheet', name: 'Hoja 1' }],
  activeSheetId: 'default-sheet',
  segments: [
    {
      id: 'default-segment',
      sheetId: 'default-sheet',
      type: 'fijo',
      line: 'AL-25',
      glass: 'Incoloro 4mm',
      color: 'Blanco',
      width: 1000,
      height: 1500,
      x: 0,
      y: 0,
      accessories: {
        mosquitero: false,
        zocalo: false,
        palillaje: false
      }
    }
  ],
  selectedId: 'default-segment',
  settings: {
    basePricePerSegment: 60000,
    glassPrices: {
      "Incoloro 3mm": 15,
      "Incoloro 4mm": 20,
      "Incoloro 5mm": 25,
      "Incoloro 6mm": 30,
      "Incoloro 8mm": 40,
      "Incoloro 10mm": 50,
      "Bronce 4mm": 25,
      "Bronce 5mm": 30,
      "Bronce 6mm": 35,
      "Espejo 4mm": 35,
      "Satén 4mm": 30,
      "Satén 5mm": 40,
      "Laminado 5mm": 60,
      "Laminado 6mm": 70,
      "Laminado 8mm": 90,
      "Laminado 10mm": 110,
      "Templado 10mm": 120,
      "Empavonado 4mm": 35,
      "Empavonado 5mm": 45,
      "DVH 4+9+4": 80,
      "Acrílico": 15
    },
    profilePrices: {
      "AL-25": 10000,
      "AL-15": 45000,
      "Columbia 4000": 48000,
      "AL-5000": 35000,
      "AL-20": 55000,
      "AL-42": 40000,
      "AL-32": 29000,
      "AM-35": 45000,
      "AL-12 Shower Door": 25000,
      "S-38 RPT": 90000,
      "S-33 RPT": 85000,
      "AL-25 TP": 75000,
      "Tubular 40x80": 70000
    },
    colorPrices: {
      "Mate": 20000,
      "Blanco": 26000,
      "Negro": 30000,
      "Titanio": 28000,
      "Nogal": 32000,
      "Roble Dorado": 35000
    },
    accessoryPricePerSegment: {
      fijo: 10000,
      abatible: 34000,
      proyectante: 30000,
      corredera: 25000,
      puerta: 70000
    },
    optionalAccessories: {
      mosquitero: 50000,
      zocalo: 14000,
      palillaje: 3000
    }
  },

  addSegment: (segment) => set((state) => ({
    segments: [...state.segments, { ...segment, id: crypto.randomUUID(), sheetId: state.activeSheetId }]
  })),

  updateSegment: (id, updates) => set((state) => ({
    segments: state.segments.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  removeSegment: (id) => set((state) => ({
    segments: state.segments.filter(s => s.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),

  selectSegment: (id) => set({ selectedId: id }),
  
  addSheet: () => set((state) => {
    const newSheetId = crypto.randomUUID();
    const newSheetNumber = state.sheets.length + 1;
    return {
      sheets: [...state.sheets, { id: newSheetId, name: `Hoja ${newSheetNumber}` }],
      activeSheetId: newSheetId,
      selectedId: null
    };
  }),

  removeSheet: (id) => set((state) => {
    if (state.sheets.length === 1) return state; // Prevent deleting the last sheet
    
    const newSheets = state.sheets.filter(s => s.id !== id);
    const newActiveSheetId = state.activeSheetId === id ? newSheets[0].id : state.activeSheetId;
    
    return {
      sheets: newSheets,
      segments: state.segments.filter(s => s.sheetId !== id),
      activeSheetId: newActiveSheetId,
      selectedId: state.selectedId && state.segments.find(s => s.id === state.selectedId)?.sheetId === id ? null : state.selectedId
    };
  }),

  renameSheet: (id, name) => set((state) => ({
    sheets: state.sheets.map(s => s.id === id ? { ...s, name } : s)
  }),),

  setActiveSheet: (id) => set({ activeSheetId: id, selectedId: null }),

  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  }))
}));
