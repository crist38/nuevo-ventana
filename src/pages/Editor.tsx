import React from 'react';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { QuoteSummary } from '../components/QuoteSummary';
import { TabBar } from '../components/TabBar';
import { LayoutTemplate, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Editor: React.FC = () => {
  return (
    <div className="flex flex-col h-screen text-slate-200" style={{ backgroundColor: '#0f172a' }}>
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-md">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">WindowCAD / Constructor</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/presupuestos" 
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <List className="w-4 h-4" />
            Mis Presupuestos
          </Link>
          <div className="text-sm text-slate-400 font-mono">
            beta v0.2
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left/Center Editor Area */}
        <div className="flex flex-col flex-1 border-r border-slate-800">
          <TabBar />
          <Toolbar />
          <Canvas />
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col w-96 bg-slate-900 shrink-0 shadow-xl z-10 border-l border-slate-700">
          <QuoteSummary />
          <div className="flex-1 overflow-y-auto">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
