import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Plus, X } from 'lucide-react';

export const TabBar: React.FC = () => {
  const { sheets, activeSheetId, setActiveSheet, addSheet, removeSheet, renameSheet } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleDoubleClick = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleRenameSubmit = (id: string) => {
    if (editName.trim()) {
      renameSheet(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="flex items-center bg-slate-900 border-b border-slate-700 overflow-x-auto overflow-y-hidden shrink-0 custom-scrollbar">
      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          className={`
            group flex items-center px-4 py-2 border-r border-slate-700 cursor-pointer min-w-32 max-w-64 transition-colors
            ${activeSheetId === sheet.id 
              ? 'bg-slate-800 text-blue-400 border-b-2 border-b-blue-500' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
          `}
          onClick={() => setActiveSheet(sheet.id)}
          onDoubleClick={() => handleDoubleClick(sheet.id, sheet.name)}
          title="Doble clic para renombrar"
        >
          {editingId === sheet.id ? (
            <input
              autoFocus
              className="bg-slate-700 text-white px-2 py-0.5 rounded outline-none w-full text-sm"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => handleRenameSubmit(sheet.id)}
              onKeyDown={(e) => handleKeyDown(e, sheet.id)}
            />
          ) : (
            <>
              <span className="truncate flex-1 select-none text-sm font-medium">{sheet.name}</span>
              {sheets.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("¿Estás seguro de que quieres eliminar esta hoja? Esto borrará todas sus ventanas.")) {
                      removeSheet(sheet.id);
                    }
                  }}
                  className={`ml-2 p-0.5 rounded-full hover:bg-red-500 hover:text-white ${activeSheetId === sheet.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                  title="Eliminar hoja"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      ))}
      <button
        onClick={addSheet}
        className="flex items-center justify-center px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Nueva hoja"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};
