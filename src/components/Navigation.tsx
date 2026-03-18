import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Layers, LayoutDashboard, Settings, Home, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/aluminio', label: 'Cotizador Aluminio', icon: Box },
    { to: '/cotizador-termopaneles', label: 'Termopaneles', icon: Layers },
    { to: '/presupuestos', label: 'Presupuestos', icon: LayoutDashboard },
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
        <button
          onClick={() => { signOut(auth); navigate('/'); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/50 border border-transparent transition-colors ml-2"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </nav>
  );
};
