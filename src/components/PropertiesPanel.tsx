import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import type { WindowSegmentType, LineType, GlassType, ColorType } from '../types';
import { Settings, Trash2 } from 'lucide-react';

const VALID_LINES_BY_TYPE: Record<WindowSegmentType, LineType[]> = {
  corredera: ['AL-5000', 'AL-20', 'AL-25', 'AL-25 TP', 'S-33 RPT', 'AM-35', 'AL-12 Shower Door'],
  fijo: ['AL-32', 'AL-42', 'S-38 RPT', 'Tubular 40x80'],
  proyectante: ['AL-32', 'AL-42', 'S-38 RPT'],
  abatible: ['AM-35', 'AL-32', 'AL-42', 'S-38 RPT'],
  puerta: ['AM-35', 'AL-42', 'S-38 RPT', 'AL-12 Shower Door'],
};

const getValidGlassesForLine = (line: LineType): GlassType[] => {
  const allGlasses: GlassType[] = [
    'Incoloro 3mm', 'Incoloro 4mm', 'Incoloro 5mm', 'Incoloro 6mm', 'Incoloro 8mm', 'Incoloro 10mm',
    'Bronce 4mm', 'Bronce 5mm', 'Bronce 6mm', 'Espejo 4mm', 'Satén 4mm', 'Satén 5mm',
    'Laminado 5mm', 'Laminado 6mm', 'Laminado 8mm', 'Laminado 10mm', 'Templado 10mm',
    'Empavonado 4mm', 'Empavonado 5mm', 'Acrílico'
  ];

  if (line === 'AL-12 Shower Door') {
    return ['Acrílico', 'Incoloro 6mm', 'Incoloro 8mm', 'Templado 10mm'];
  }
  
  if (line === 'AL-25 TP' || line === 'S-33 RPT' || line === 'S-38 RPT') {
    return ['DVH 4+9+4', ...allGlasses];
  }

  return allGlasses;
};

export const PropertiesPanel: React.FC = () => {
  const { segments, selectedId, updateSegment, removeSegment } = useEditorStore();
  
  const selectedSegment = segments.find(s => s.id === selectedId);

  if (!selectedSegment) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-700 p-6 flex flex-col items-center justify-center text-slate-500">
        <Settings className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">Selecciona un elemento para editar sus propiedades</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Propiedades
        </h2>
        <button 
          onClick={() => removeSegment(selectedSegment.id)}
          className="p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          title="Eliminar elemento"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
            Tipo
          </label>
          <select
            value={selectedSegment.type}
            onChange={(e) => {
              const newType = e.target.value as WindowSegmentType;
              const validLines = VALID_LINES_BY_TYPE[newType] || [];
              const updates: any = { type: newType };
              if (!validLines.includes(selectedSegment.line)) {
                updates.line = validLines[0]; // fallback to first valid line
              }
              updateSegment(selectedSegment.id, updates);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm capitalize"
          >
            {['fijo', 'corredera', 'proyectante', 'abatible', 'puerta'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {(selectedSegment.type === 'corredera' || selectedSegment.type === 'puerta' || selectedSegment.type === 'abatible') && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
              {selectedSegment.type === 'corredera' ? 'Hojas Móviles' : 'Apertura'}
            </label>
            <select
              value={selectedSegment.openingDirection || (selectedSegment.type === 'corredera' ? 'both' : 'left')}
              onChange={(e) => updateSegment(selectedSegment.id, { openingDirection: e.target.value as 'left' | 'right' | 'both' })}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm mb-4"
            >
              {selectedSegment.type === 'corredera' ? (
                <>
                  <option value="both">Ambas (Convencional)</option>
                  <option value="left">Móvil Izquierda</option>
                  <option value="right">Móvil Derecha</option>
                </>
              ) : selectedSegment.type === 'abatible' ? (
                <>
                  <option value="left">Bisagras Izquierda</option>
                  <option value="right">Bisagras Derecha</option>
                </>
              ) : (
                <>
                  <option value="left">1 Hoja (Abre a Derecha)</option>
                  <option value="right">1 Hoja (Abre a Izquierda)</option>
                  <option value="both">2 Hojas</option>
                </>
              )}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
            Línea (Perfil)
          </label>
          <select
            value={selectedSegment.line}
            onChange={(e) => {
              const newLine = e.target.value as LineType;
              const validGlasses = getValidGlassesForLine(newLine);
              const updates: any = { line: newLine };
              if (!validGlasses.includes(selectedSegment.glass)) {
                updates.glass = validGlasses[0]; // fallback
              }
              updateSegment(selectedSegment.id, updates);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
          >
            {(VALID_LINES_BY_TYPE[selectedSegment.type] || []).map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
            Cristal
          </label>
          <select
            value={selectedSegment.glass}
            onChange={(e) => updateSegment(selectedSegment.id, { glass: e.target.value as GlassType })}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm"
          >
            {getValidGlassesForLine(selectedSegment.line).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            Color del Perfil
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Blanco', bg: 'bg-white', border: 'border-slate-300' },
              { label: 'Negro', bg: 'bg-slate-900', border: 'border-black' },
              { label: 'Mate', bg: 'bg-slate-300', border: 'border-slate-400' },
              { label: 'Titanio', bg: 'bg-neutral-500', border: 'border-neutral-600' },
              { label: 'Nogal', bg: 'bg-amber-900', border: 'border-amber-950' },
              { label: 'Roble Dorado', bg: 'bg-amber-600', border: 'border-amber-700' },
            ].map(colorOption => (
                <button
                  key={colorOption.label}
                  onClick={() => updateSegment(selectedSegment.id, { color: colorOption.label as ColorType })}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all ${
                    selectedSegment.color === colorOption.label 
                      ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500' 
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border shrink-0 ${colorOption.bg} ${colorOption.border}`}></div>
                  <span className="text-xs text-slate-200 font-medium text-left leading-tight">{colorOption.label}</span>
                </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
              Ancho (mm)
            </label>
            <input
              type="number"
              value={selectedSegment.width}
              onChange={(e) => updateSegment(selectedSegment.id, { width: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
              Alto (mm)
            </label>
            <input
              type="number"
              value={selectedSegment.height}
              onChange={(e) => updateSegment(selectedSegment.id, { height: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
              Pos X (mm)
            </label>
            <input
              type="number"
              value={selectedSegment.x}
              onChange={(e) => updateSegment(selectedSegment.id, { x: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
              Pos Y (mm)
            </label>
            <input
              type="number"
              value={selectedSegment.y}
              onChange={(e) => updateSegment(selectedSegment.id, { y: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
            Accesorios
          </label>
          <div className="space-y-2">
            {[
              { id: 'mosquitero', label: 'Mosquitero', price: 50000 },
              { id: 'zocalo', label: 'Zócalo', price: 14000 },
              { id: 'palillaje', label: 'Palillaje', price: 3000 },
            ].map((acc) => (
              <label key={acc.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={selectedSegment.accessories?.[acc.id as keyof typeof selectedSegment.accessories] || false}
                  onChange={(e) => updateSegment(selectedSegment.id, { 
                    accessories: { 
                      ...(selectedSegment.accessories || { mosquitero: false, zocalo: false, palillaje: false }), 
                      [acc.id]: e.target.checked 
                    } 
                  })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-slate-200">{acc.label}</span>
                  <span className="text-xs text-slate-500">(+${acc.price.toLocaleString('es-CL')})</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
