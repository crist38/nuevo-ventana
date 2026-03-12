import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Layers, LayoutDashboard, Settings, Maximize } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Cotizador Aluminio', icon: Box },
    { to: '/cotizador-termopaneles', label: 'Termopaneles', icon: Layers },
    { to: '/presupuestos', label: 'Presupuestos', icon: LayoutDashboard },
    { to: '/admin/optimizer', label: 'Optimizador', icon: Maximize },
    { to: '/admin', label: 'Administración', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold tracking-tighter">
          CR
        </div>
        <span className="text-slate-200 font-semibold tracking-wide">Cripter</span>
      </div>
      
      <div className="flex items-center gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link 
              key={link.to} 
              to={link.to}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-slate-800 text-blue-400 border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
