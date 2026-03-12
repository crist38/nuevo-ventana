import React from 'react';
import { Maximize } from 'lucide-react';

export const Optimizer: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Maximize className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Optimizador de Vidrios</h1>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <p className="text-slate-400">Herramienta de optimización de corte 2D para maximizar el aprovechamiento de planchas de vidrio (En desarrollo).</p>
        </div>
      </div>
    </div>
  );
};
