import React from 'react';
import type { WindowSegment, Sheet } from '../types';
import { getCutList } from '../lib/cuttingFormulas';
import { X, Printer, Scissors } from 'lucide-react';

interface Props {
  segments: WindowSegment[];
  sheets: Sheet[];
  isOpen: boolean;
  onClose: () => void;
  onPrint?: () => void;
}

export const WorkOrderModal: React.FC<Props> = ({ segments, sheets, isOpen, onClose, onPrint }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pauta de Corte (Orden de Trabajo)</h2>
              <p className="text-sm text-slate-500 font-medium">{segments.length} Ventana(s) en este Proyecto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onPrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir PDF
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {segments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No hay ventanas en este proyecto para generar los cortes.
            </div>
          ) : (
            <div className="space-y-8">
              {segments.map((segment, index) => {
                const cuts = getCutList(segment);
                const sheetName = sheets?.find(s => s.id === segment.sheetId)?.name || 'General';
                
                return (
                  <div key={segment.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Resumen de la ventana */}
                    <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          Ventana #{index + 1} <span className="text-slate-500 font-normal ml-2">({sheetName})</span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                        <span><span className="text-slate-400">Tipo:</span> <span className="capitalize">{segment.type}</span></span>
                        <span><span className="text-slate-400">Línea:</span> {segment.line}</span>
                        <span><span className="text-slate-400">Color:</span> {segment.color}</span>
                        <span><span className="text-slate-400">Total:</span> {segment.width}x{segment.height} mm</span>
                      </div>
                    </div>

                    {/* Tabla de Cortes */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Tipo</th>
                            <th className="px-4 py-3 font-semibold">Perfil / Elemento</th>
                            <th className="px-4 py-3 font-semibold">Código</th>
                            <th className="px-4 py-3 text-center font-semibold">Cant.</th>
                            <th className="px-4 py-3 text-right font-semibold">Medida a Cortar</th>
                            <th className="px-4 py-3 text-center font-semibold">Corte</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cuts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-4 text-center text-slate-400 italic">
                                Fórmulas no definidas para esta línea/apertura. Revisar src/lib/cuttingFormulas.ts.
                              </td>
                            </tr>
                          ) : (
                            cuts.map((cut, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                                    cut.tipo === 'Vidrio' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {cut.tipo}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-700">{cut.perfil}</td>
                                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{cut.codigo}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800">{cut.cantidad}</td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 bg-blue-50/30">
                                  {cut.medida}
                                </td>
                                <td className="px-4 py-3 text-center text-slate-500 font-semibold">{cut.corte}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
