import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, Database, Trash2, Calendar, FileText, Loader2, DollarSign, Download } from 'lucide-react';
import { getQuotes, deleteQuote } from '../services/db';
import { generateQuotePDF } from '../services/pdf';
import type { SavedQuote } from '../types';

export const Dashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await getQuotes();
      setQuotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este presupuesto?')) return;
    try {
      await deleteQuote(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="flex flex-col h-screen text-slate-200 bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 p-1.5 rounded-md">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Gestión de Presupuestos</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-md border border-indigo-500/30"
          >
            <LayoutTemplate className="w-4 h-4" />
            Nuevo Presupuesto
          </Link>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Presupuestos Guardados</h2>
            <p className="text-slate-400">Administra tus configuraciones de ventanas guardadas usando Firebase.</p>
          </div>
          <div className="text-sm font-mono text-slate-500">
            Total: {quotes.length} registros
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2 text-slate-400">Aún no hay presupuestos guardados.</p>
            <p className="text-sm">Usa el Constructor para diseñar y guardar un nuevo presupuesto.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-md border border-indigo-500/30"
            >
              <LayoutTemplate className="w-4 h-4" />
              Ir al Constructor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map(quote => (
              <div key={quote.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-indigo-500/50 transition-colors">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-slate-200 truncate pr-4">{quote.clientName}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => generateQuotePDF(quote)}
                        className="text-indigo-400 hover:text-indigo-300 p-1.5 hover:bg-indigo-500/10 rounded transition-colors"
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(quote.id)}
                        className="text-red-400/70 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded transition-colors"
                        title="Eliminar Presupuesto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                       <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Fecha</span>
                       <span className="text-slate-300">{new Date(quote.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                       <span className="flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Elementos</span>
                       <span className="text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">{quote.segments.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total</div>
                  <div className="text-lg font-bold text-indigo-400 flex items-center">
                    <DollarSign className="w-4 h-4 mr-0.5" />
                    {quote.totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
