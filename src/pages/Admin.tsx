import React from 'react';
import { Settings, Users, Database } from 'lucide-react';

export const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => window.location.href = '/admin/configuracion'} 
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Database className="w-12 h-12 text-slate-400" />
            <div>
              <h3 className="text-lg font-semibold">Configuración General</h3>
              <p className="text-sm text-slate-500 mt-1">Ajuste de precios base y parámetros</p>
            </div>
          </div>
          <div 
            onClick={() => window.location.href = '/admin/usuarios'}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Users className="w-12 h-12 text-slate-400" />
            <div>
              <h3 className="text-lg font-semibold">Usuarios</h3>
              <p className="text-sm text-slate-500 mt-1">Gestión de roles y permisos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
