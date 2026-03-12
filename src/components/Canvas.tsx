import React, { useRef, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import type { WindowSegment } from '../types';

const SCALE = 0.2; // 0.2px = 1mm (e.g., 1000mm = 200px)
const SNAP_GRID = 50; // Snap to nearest 50mm increments

const COLOR_MAPPING: Record<string, string> = {
  Blanco: '#f8fafc',
  Negro: '#0f172a',
  Mate: '#94a3b8',
  Titanio: '#525252',
  Nogal: '#451a03',
  'Roble Dorado': '#b45309',
};

export const Canvas: React.FC = () => {
  const { segments, selectedId, selectSegment, updateSegment } = useEditorStore();
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<SVGSVGElement>(null);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as Element).id === 'grid-pattern') {
      setIsPanning(true);
      selectSegment(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    } else if (draggingId) {
      const segment = segments.find(s => s.id === draggingId);
      if (segment) {
        const newX = segment.x + e.movementX / SCALE;
        const newY = segment.y + e.movementY / SCALE;
        
        // Snap to grid
        updateSegment(draggingId, {
          x: Math.round(newX / SNAP_GRID) * SNAP_GRID,
          y: Math.round(newY / SNAP_GRID) * SNAP_GRID,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingId(null);
  };

  // Dimension lines SVG component logic
  const renderDimension = (x: number, y: number, length: number, value: number, isVertical: boolean) => {
    const offset = 30; // pixels away from the segment
    return (
      <g className="text-blue-400 stroke-blue-400 fill-blue-400" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
        {isVertical ? (
          <>
            <line x1={x - offset} y1={y} x2={x - offset} y2={y + length} strokeWidth="1" />
            <line x1={x - offset - 5} y1={y} x2={x - offset + 5} y2={y} strokeWidth="1" />
            <line x1={x - offset - 5} y1={y + length} x2={x - offset + 5} y2={y + length} strokeWidth="1" />
            <text x={x - offset - 10} y={y + length / 2} textAnchor="end" dominantBaseline="middle" transform={`rotate(-90 ${x - offset - 10} ${y + length / 2})`}>
              {value} mm
            </text>
          </>
        ) : (
          <>
            <line x1={x} y1={y - offset} x2={x + length} y2={y - offset} strokeWidth="1" />
            <line x1={x} y1={y - offset - 5} x2={x} y2={y - offset + 5} strokeWidth="1" />
            <line x1={x + length} y1={y - offset - 5} x2={x + length} y2={y - offset + 5} strokeWidth="1" />
            <text x={x + length / 2} y={y - offset - 10} textAnchor="middle">
              {value} mm
            </text>
          </>
        )}
      </g>
    );
  };

  const renderSegment = (segment: WindowSegment) => {
    const isSelected = selectedId === segment.id;
    const cw = segment.width * SCALE;
    const ch = segment.height * SCALE;
    const cx = segment.x * SCALE;
    const cy = segment.y * SCALE;

    return (
      <g 
        key={segment.id} 
        transform={`translate(${cx}, ${cy})`}
        onMouseDown={(e) => {
          e.stopPropagation();
          selectSegment(segment.id);
          setDraggingId(segment.id);
        }}
        className={`${draggingId === segment.id ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <rect
          width={cw}
          height={ch}
          fill={COLOR_MAPPING[segment.color] || "#cbd5e1"}
          stroke={isSelected ? "#3b82f6" : "#0f172a"}
          strokeWidth={isSelected ? 4 : 1}
        />
        
        {/* If it is a double panel like sliding or door, draw a divider */}
        {(segment.type === 'corredera' || segment.type === 'puerta') ? (
          <>
            {/* Left Glass */}
            <rect x={8} y={8} width={(cw / 2) - 12} height={ch - 16} fill="rgba(148, 163, 184, 0.3)" stroke="#0f172a" strokeWidth={1} />
            {/* Right Glass */}
            <rect x={(cw / 2) + 4} y={8} width={(cw / 2) - 12} height={ch - 16} fill="rgba(148, 163, 184, 0.3)" stroke="#0f172a" strokeWidth={1} />
            {/* Sliding Arrow (Left to right or Right to left) if sliding */}
            {segment.type === 'corredera' && (
              <g className="opacity-50" stroke="#0f172a" strokeWidth="1.5" fill="none">
                {(!segment.openingDirection || segment.openingDirection === 'both' || segment.openingDirection === 'left') && (
                  <>
                    <path d={`M ${cw / 4 - 10} ${ch / 2} L ${cw / 4 + 10} ${ch / 2} M ${cw / 4 + 5} ${ch / 2 - 4} L ${cw / 4 + 10} ${ch / 2} L ${cw / 4 + 5} ${ch / 2 + 4}`} />
                    {/* Small handles */}
                    <rect x={12} y={ch / 2 - 15} width={4} height={30} fill="#64748b" rx={1} stroke="none" />
                  </>
                )}
                {(!segment.openingDirection || segment.openingDirection === 'both' || segment.openingDirection === 'right') && (
                  <>
                    <path d={`M ${cw * 0.75 + 10} ${ch / 2} L ${cw * 0.75 - 10} ${ch / 2} M ${cw * 0.75 - 5} ${ch / 2 - 4} L ${cw * 0.75 - 10} ${ch / 2} L ${cw * 0.75 - 5} ${ch / 2 + 4}`} />
                    <rect x={cw - 16} y={ch / 2 - 15} width={4} height={30} fill="#64748b" rx={1} stroke="none" />
                  </>
                )}
              </g>
            )}
          </>
        ) : (
          <rect x={8} y={8} width={cw - 16} height={ch - 16} fill="rgba(148, 163, 184, 0.3)" stroke="#0f172a" strokeWidth={1} />
        )}
        
        <text 
          x={cw / 2} 
          y={ch / 4} 
          fill={isSelected ? "#3b82f6" : (['Blanco', 'Mate'].includes(segment.color) ? '#0f172a' : '#f8fafc')} 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{ fontSize: '10px', fontFamily: 'monospace', pointerEvents: 'none', fontWeight: 600 }}
        >
          {segment.type.toUpperCase()}
        </text>

        {/* Display Dimensions only if selected */}
        {isSelected && (
          <>
            {renderDimension(0, 0, cw, segment.width, false)}
            {renderDimension(0, 0, ch, segment.height, true)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="flex-1 h-full bg-blueprint-dark overflow-hidden relative" style={{ backgroundColor: '#0f172a' }}>
      <svg
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <pattern id="grid-pattern" x={pan.x} y={pan.y} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid-pattern)" id="grid-pattern" />

        <g transform={`translate(${pan.x + window.innerWidth / 3}, ${pan.y + window.innerHeight / 4})`}>
          {segments.map(renderSegment)}
        </g>
      </svg>
      
      {/* Zoom / Pan Instructions */}
      <div className="absolute bottom-4 right-4 text-slate-400 font-mono text-xs bg-slate-800/80 px-3 py-2 rounded-md pointer-events-none">
        Click and drag background to pan. Click and drag a window to move it.
      </div>
    </div>
  );
};
