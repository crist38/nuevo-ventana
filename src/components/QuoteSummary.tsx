import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Calculator, Save, Loader2 } from 'lucide-react';
import { saveQuote } from '../services/db';

export const QuoteSummary: React.FC = () => {
  const { segments, settings } = useEditorStore();
  const [clientName, setClientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const calculateBudget = () => {
    let totalGlassM2 = 0;
    let totalPerimeterMl = 0;
    
    let glassCost = 0;
    let profileCost = 0;
    let totalAccessoriesCost = 0;

    segments.forEach(seg => {
      // Area in m2 and cost
      const area = (seg.width / 1000) * (seg.height / 1000);
      totalGlassM2 += area;
      glassCost += area * (settings.glassPrices[seg.glass] || 0);

      // Perimeter in ml (meter linear) and cost
      const perimeter = ((seg.width * 2) + (seg.height * 2)) / 1000;
      totalPerimeterMl += perimeter;
      profileCost += perimeter * (settings.profilePrices[seg.line] || 0);

      // Base price per segment
      let baseAccCost = settings.basePricePerSegment;

      // Color Profile cost
      baseAccCost += settings.colorPrices[seg.color] || 0;

      // Aperture / Type cost
      baseAccCost += settings.accessoryPricePerSegment[seg.type];

      // Optional user-selected accessories
      if (seg.accessories?.mosquitero) baseAccCost += settings.optionalAccessories.mosquitero;
      if (seg.accessories?.zocalo) baseAccCost += settings.optionalAccessories.zocalo;
      if (seg.accessories?.palillaje) baseAccCost += settings.optionalAccessories.palillaje;

      totalAccessoriesCost += baseAccCost;
    });

    const subtotal = glassCost + profileCost + totalAccessoriesCost;

    return {
      totalGlassM2,
      totalPerimeterMl,
      glassCost,
      profileCost,
      totalAccessoriesCost,
      subtotal
    };
  };

  const budget = calculateBudget();

  const handleSave = async () => {
    if (!clientName.trim() || segments.length === 0) return;
    setIsSaving(true);
    try {
      await saveQuote(clientName, segments, budget.subtotal);
      alert('Presupuesto guardado exitosamente.');
      setClientName('');
    } catch (e) {
      console.error(e);
      alert('Error guardando presupuesto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border-t border-slate-700 p-4 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-200 font-semibold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          Presupuesto Estimado
        </h3>
          ${Math.round(budget.subtotal).toLocaleString('es-CL')}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase mb-1">Vidrio</p>
          <div className="flex justify-between items-end">
            <span className="text-slate-300 font-mono">{budget.totalGlassM2.toFixed(2)} m²</span>
            <span className="text-slate-100 font-medium">${Math.round(budget.glassCost).toLocaleString('es-CL')}</span>
          </div>
        </div>
        
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase mb-1">Perfilería</p>
          <div className="flex justify-between items-end">
            <span className="text-slate-300 font-mono">{budget.totalPerimeterMl.toFixed(2)} ml</span>
            <span className="text-slate-100 font-medium">${Math.round(budget.profileCost).toLocaleString('es-CL')}</span>
          </div>
        </div>

        <div className="bg-slate-800 p-3 rounded-md border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase mb-1">Accesorios y Herrajes</p>
          <div className="flex justify-between items-end">
            <span className="text-slate-300 font-mono">{segments.length} unid.</span>
            <span className="text-slate-100 font-medium">${Math.round(budget.totalAccessoriesCost).toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
        <input 
          type="text"
          placeholder="Nombre del Cliente"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm"
        />
        <button
          onClick={handleSave}
          disabled={!clientName.trim() || segments.length === 0 || isSaving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md transition-colors font-medium text-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Presupuesto
        </button>
      </div>
    </div>
  );
};
