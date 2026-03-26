import React, { useRef, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import type { WindowSegment } from '../types';

const SCALE = 0.2; // 0.2px = 1mm (e.g., 1000mm = 200px)
const SNAP_GRID = 50; // Snap to nearest 50mm increments

const COLOR_MAPPING: Record<string, string> = {
  Blanco: '#f8fafc',
  Negro: '#1e293b', // Lighter than #0f172a to distinguish from bg
  Mate: '#94a3b8',
  Titanio: '#525252',
  Nogal: '#451a03',
  'Roble Dorado': '#b45309',
};

export const Canvas: React.FC = () => {
  const { segments, activeSheetId, selectedId, selectSegment, updateSegment } = useEditorStore();
  const activeSegments = segments.filter(s => s.sheetId === activeSheetId);
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

    // Configuración estética del material
    const baseColor = COLOR_MAPPING[segment.color] || "#f8fafc";
    const glassColor = "#bae6fd"; // Light blue termopanel tint
    const strokeColor = "#64748b";
    
    // Dimensiones de perfilería
    const marcoT = 10;
    const hojaT = 10;
    const innerW = cw - marcoT * 2;
    const innerH = ch - marcoT * 2;
    
    // Para hojas correderas
    const overlap = 6;
    const hojaW = innerW / 2 + overlap / 2;

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
        {/* Sombra de la ventana contra el fondo */}
        <rect width={cw} height={ch} fill="rgba(0,0,0,0.3)" x={3} y={6} rx={2} />

        {/* --- MARCO EXTERIOR --- */}
        <rect
          width={cw}
          height={ch}
          fill={baseColor}
          stroke={isSelected ? "#3b82f6" : strokeColor}
          strokeWidth={isSelected ? 3 : 1}
        />
        {/* Bisel de iluminación del marco */}
        <rect x={1} y={1} width={cw-2} height={ch-2} fill="none" stroke="rgba(255,255,255,0.4)" pointerEvents="none" />

        {/* --- HOJAS INTERIORES --- */}
        {segment.type === 'corredera' ? (
          <g transform={`translate(${marcoT}, ${marcoT})`}>
            {/* Fondo del riel */}
            <rect width={innerW} height={innerH} fill="#0f172a" opacity={0.5} />

            {/* Hoja Izquierda */}
            <g transform={`translate(0, 0)`}>
              <rect width={hojaW} height={innerH} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
              <rect x={1} y={1} width={hojaW-2} height={innerH-2} fill="none" stroke="rgba(255,255,255,0.4)" />
              <rect x={hojaT} y={hojaT} width={hojaW - hojaT*2} height={innerH - hojaT*2} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
            </g>

            {/* Hoja Derecha */}
            <g transform={`translate(${innerW / 2 - overlap / 2}, 0)`}>
              <rect width={hojaW} height={innerH} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
              <rect x={1} y={1} width={hojaW-2} height={innerH-2} fill="none" stroke="rgba(255,255,255,0.4)" />
              <rect x={hojaT} y={hojaT} width={hojaW - hojaT*2} height={innerH - hojaT*2} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
            </g>

            {/* Flechas indicadoras de corredera */}
            {segment.type === 'corredera' && (
              <g className="opacity-80" stroke="#f1f5f9" strokeWidth="1.5" fill="none">
                {(!segment.openingDirection || segment.openingDirection === 'both' || segment.openingDirection === 'left') && (
                  <>
                    <path d={`M ${hojaW / 2 - 8} ${innerH / 2} L ${hojaW / 2 + 8} ${innerH / 2} M ${hojaW / 2 + 3} ${innerH / 2 - 4} L ${hojaW / 2 + 8} ${innerH / 2} L ${hojaW / 2 + 3} ${innerH / 2 + 4}`} />
                    <rect x={hojaT + 4} y={innerH / 2 - 15} width={4} height={30} fill={strokeColor} rx={1} stroke="none" />
                  </>
                )}
                {(!segment.openingDirection || segment.openingDirection === 'both' || segment.openingDirection === 'right') && (
                  <>
                    <path d={`M ${innerW - hojaW / 2 + 8} ${innerH / 2} L ${innerW - hojaW / 2 - 8} ${innerH / 2} M ${innerW - hojaW / 2 - 3} ${innerH / 2 - 4} L ${innerW - hojaW / 2 - 8} ${innerH / 2} L ${innerW - hojaW / 2 - 3} ${innerH / 2 + 4}`} />
                    <rect x={innerW - hojaT - 8} y={innerH / 2 - 15} width={4} height={30} fill={strokeColor} rx={1} stroke="none" />
                  </>
                )}
              </g>
            )}
          </g>
        ) : segment.type === 'puerta' ? (
          <g transform={`translate(${marcoT}, ${marcoT})`}>
            {segment.openingDirection === 'both' ? (
              // Puerta 2 Hojas
              <>
                {/* Hoja Izquierda */}
                <g>
                  <rect width={innerW / 2} height={innerH} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                  <rect x={1} y={1} width={innerW / 2 - 2} height={innerH - 2} fill="none" stroke="rgba(255,255,255,0.4)" />
                  {segment.accessories?.zocalo ? (
                    <>
                      <rect x={hojaT} y={hojaT} width={innerW / 2 - hojaT * 2} height={innerH / 2 - hojaT} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
                      <rect x={hojaT} y={innerH / 2} width={innerW / 2 - hojaT * 2} height={innerH / 2 - hojaT} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                      {/* Divisor central */}
                      <rect x={hojaT} y={innerH / 2 - 5} width={innerW / 2 - hojaT * 2} height={10} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                    </>
                  ) : (
                    <rect x={hojaT} y={hojaT} width={innerW / 2 - hojaT * 2} height={innerH - hojaT * 2} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
                  )}
                  {/* Líneas rojas apertura (bisagras a la izquierda) */}
                  <path d={`M ${hojaT} ${hojaT} L ${innerW / 2 - hojaT} ${innerH / 2} L ${hojaT} ${innerH - hojaT}`} fill="none" stroke="#ef4444" strokeWidth={1} />
                  {/* Manilla derecha */}
                  <rect x={innerW / 2 - hojaT - 4} y={innerH / 2 - 15} width={6} height={30} fill="#eab308" stroke="#a16207" strokeWidth={1} rx={2} />
                </g>
                
                {/* Hoja Derecha */}
                <g transform={`translate(${innerW / 2}, 0)`}>
                  <rect width={innerW / 2} height={innerH} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                  <rect x={1} y={1} width={innerW / 2 - 2} height={innerH - 2} fill="none" stroke="rgba(255,255,255,0.4)" />
                  {segment.accessories?.zocalo ? (
                    <>
                      <rect x={hojaT} y={hojaT} width={innerW / 2 - hojaT * 2} height={innerH / 2 - hojaT} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
                      <rect x={hojaT} y={innerH / 2} width={innerW / 2 - hojaT * 2} height={innerH / 2 - hojaT} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                      <rect x={hojaT} y={innerH / 2 - 5} width={innerW / 2 - hojaT * 2} height={10} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                    </>
                  ) : (
                    <rect x={hojaT} y={hojaT} width={innerW / 2 - hojaT * 2} height={innerH - hojaT * 2} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
                  )}
                  {/* Líneas rojas apertura (bisagras a la derecha) */}
                  <path d={`M ${innerW / 2 - hojaT} ${hojaT} L ${hojaT} ${innerH / 2} L ${innerW / 2 - hojaT} ${innerH - hojaT}`} fill="none" stroke="#ef4444" strokeWidth={1} />
                  {/* Manilla izquierda */}
                  <rect x={hojaT - 2} y={innerH / 2 - 15} width={6} height={30} fill="#eab308" stroke="#a16207" strokeWidth={1} rx={2} />
                </g>
              </>
            ) : (
              // Puerta 1 Hoja
              <>
                <rect width={innerW} height={innerH} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                <rect x={1} y={1} width={innerW - 2} height={innerH - 2} fill="none" stroke="rgba(255,255,255,0.4)" />
                {segment.accessories?.zocalo ? (
                  <>
                    <rect x={hojaT} y={hojaT} width={innerW - hojaT * 2} height={innerH / 2 - hojaT} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
                    <rect x={hojaT} y={innerH / 2} width={innerW - hojaT * 2} height={innerH / 2 - hojaT} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                    {/* Divisor central */}
                    <rect x={hojaT} y={innerH / 2 - 5} width={innerW - hojaT * 2} height={10} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
                  </>
                ) : (
                  <rect x={hojaT} y={hojaT} width={innerW - hojaT * 2} height={innerH - hojaT * 2} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
                )}

                {segment.openingDirection === 'right' ? (
                  <>
                    {/* Bisagras derecha, abre desde izquierda. Triángulo apunta a manilla en izquierda */}
                    <path d={`M ${innerW - hojaT} ${hojaT} L ${hojaT} ${innerH / 2} L ${innerW - hojaT} ${innerH - hojaT}`} fill="none" stroke="#ef4444" strokeWidth={1} />
                    <rect x={hojaT - 2} y={innerH / 2 - 15} width={6} height={30} fill="#eab308" stroke="#a16207" strokeWidth={1} rx={2} />
                  </>
                ) : (
                  <>
                    {/* Bisagras izquierda, abre desde derecha. Triángulo apunta a manilla en derecha */}
                    <path d={`M ${hojaT} ${hojaT} L ${innerW - hojaT} ${innerH / 2} L ${hojaT} ${innerH - hojaT}`} fill="none" stroke="#ef4444" strokeWidth={1} />
                    <rect x={innerW - hojaT - 4} y={innerH / 2 - 15} width={6} height={30} fill="#eab308" stroke="#a16207" strokeWidth={1} rx={2} />
                  </>
                )}
              </>
            )}
          </g>
        ) : (
          <g transform={`translate(${marcoT}, ${marcoT})`}>
            {/* Hoja estática para fijo, proyectante, abatible */}
            <rect width={innerW} height={innerH} fill={baseColor} stroke={strokeColor} strokeWidth={1} />
            <rect x={1} y={1} width={innerW-2} height={innerH-2} fill="none" stroke="rgba(255,255,255,0.4)" />
            {/* Cristal */}
            <rect x={hojaT} y={hojaT} width={innerW - hojaT*2} height={innerH - hojaT*2} fill={glassColor} fillOpacity={0.4} stroke={strokeColor} strokeWidth={1} />
            
            {/* Indicadores de apertura para proyectante */}
            {segment.type === 'proyectante' && (
              <>
                <path 
                  d={`M ${hojaT} ${hojaT} L ${innerW / 2} ${innerH - hojaT} L ${innerW - hojaT} ${hojaT}`} 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth={1} 
                />
                {/* Manilla */}
                <rect 
                  x={innerW / 2 - 10} 
                  y={innerH - hojaT - 4} 
                  width={20} 
                  height={8} 
                  fill="#475569" 
                  stroke="#0f172a" 
                  strokeWidth={1} 
                  rx={1.5} 
                />
              </>
            )}

            {/* Indicadores de apertura para abatible */}
            {segment.type === 'abatible' && (
              <>
                <path 
                  d={
                    segment.openingDirection === 'right' 
                      ? `M ${innerW - hojaT} ${hojaT} L ${hojaT} ${innerH / 2} L ${innerW - hojaT} ${innerH - hojaT}` 
                      : `M ${hojaT} ${hojaT} L ${innerW - hojaT} ${innerH / 2} L ${hojaT} ${innerH - hojaT}`
                  }
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth={1} 
                  strokeDasharray="4 4"
                />
                {/* Manilla */}
                <rect 
                  x={segment.openingDirection === 'right' ? hojaT - 2 : innerW - hojaT - 4} 
                  y={innerH / 2 - 10} 
                  width={6} 
                  height={20} 
                  fill="#475569" 
                  stroke="#0f172a" 
                  strokeWidth={1} 
                  rx={1.5} 
                />
              </>
            )}
          </g>
        )}
        
        <text 
          x={cw / 2} 
          y={ch / 4} 
          fill={isSelected ? "#3b82f6" : (['Blanco', 'Mate'].includes(segment.color) ? '#0f172a' : '#f8fafc')} 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{ fontSize: '10px', fontFamily: 'monospace', pointerEvents: 'none', fontWeight: 600, textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
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
          {activeSegments.map(renderSegment)}
        </g>
      </svg>
      
      {/* Zoom / Pan Instructions */}
      <div className="absolute bottom-4 right-4 text-slate-400 font-mono text-xs bg-slate-800/80 px-3 py-2 rounded-md pointer-events-none">
        Click and drag background to pan. Click and drag a window to move it.
      </div>
    </div>
  );
};
