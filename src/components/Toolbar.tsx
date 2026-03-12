import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import type { WindowSegmentType } from '../types';
import { PlusSquare, Columns, Maximize, MoveDiagonal, DoorOpen } from 'lucide-react';

const segmentIcons: Record<WindowSegmentType, React.ReactNode> = {
  fijo: <Maximize className="w-5 h-5" />,
  corredera: <Columns className="w-5 h-5" />,
  proyectante: <MoveDiagonal className="w-5 h-5" />,
  abatible: <PlusSquare className="w-5 h-5" />,
  puerta: <DoorOpen className="w-5 h-5" />
};

export const Toolbar: React.FC = () => {
  const { addSegment } = useEditorStore();

  const handleAdd = (type: WindowSegmentType) => {
    addSegment({
      type,
      line: 'AL-25',
      glass: 'Incoloro 4mm',
      color: 'Blanco',
      width: type === 'puerta' ? 900 : 1000,
      height: type === 'puerta' ? 2100 : 1500,
      x: Math.random() * 200, // slight offset for visibility
      y: Math.random() * 200,
      accessories: {
        mosquitero: false,
        zocalo: false,
        palillaje: false
      }
    });
  };

  return (
    <div className="bg-slate-900 border-b border-slate-700 p-2 flex items-center gap-2">
      <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mr-4 ml-2">Constructor</span>
      {(Object.keys(segmentIcons) as WindowSegmentType[]).map((type) => (
        <button
          key={type}
          onClick={() => handleAdd(type)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition-colors border border-slate-700"
        >
          {segmentIcons[type]}
          <span className="capitalize">{type}</span>
        </button>
      ))}
    </div>
  );
};
