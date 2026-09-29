import React, { useState, useRef } from 'react';
import { GIRIDIH_BLOCKS, BlockData } from '../../data/jharkhandGeoData';
import { ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Building2 } from 'lucide-react';

interface GiridihBlockMapProps {
  selectedBlockId: string | null;
  onSelectBlock: (block: BlockData) => void;
  hoveredBlockId?: string | null;
  onHoverBlock?: (blockId: string | null) => void;
}

export const GiridihBlockMap: React.FC<GiridihBlockMapProps> = ({
  selectedBlockId,
  onSelectBlock,
  hoveredBlockId: externalHoveredId,
  onHoverBlock
}) => {
  const [internalHoveredBlock, setInternalHoveredBlock] = useState<BlockData | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const hoveredBlock = internalHoveredBlock || 
    (externalHoveredId ? GIRIDIH_BLOCKS.find(b => b.id === externalHoveredId) : null);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.9));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden select-none">
      
      {/* Map Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#003D7C] to-[#0B5499] text-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#FF9933]" />
          <span className="text-xs font-bold tracking-wide">
            गिरिडीह प्रखण्ड मानचित्र | Block Map of Giridih District (13 Blocks)
          </span>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2 py-1 rounded-md border border-white/20">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1 hover:bg-white/20 rounded transition text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1 font-bold text-amber-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1 hover:bg-white/20 rounded transition text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="h-3 w-px bg-white/20 mx-0.5" />
          <button
            onClick={handleResetZoom}
            title="Reset Map View"
            className="p-1 hover:bg-white/20 rounded transition text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Block Map Container */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full overflow-hidden bg-slate-50 flex items-center justify-center ${
          zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        style={{ minHeight: '520px', maxHeight: '680px' }}
      >
        <div
          className="relative transition-transform duration-150 ease-out origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            width: '100%',
            maxWidth: '817px',
            aspectRatio: '817 / 747'
          }}
        >
          {/* Reference Map Image from user */}
          <img
            src="/maps/giridih-block-map.png"
            alt="Block Map of Giridih District, Jharkhand"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
          />

          {/* Interactive SVG Overlay */}
          <svg
            viewBox="0 0 817 747"
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <filter id="blockGlowActive" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="blockGlowHover" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Clickable Block Polygons */}
            {GIRIDIH_BLOCKS.map((block) => {
              const isSelected = selectedBlockId === block.id;
              const isHovered = hoveredBlock?.id === block.id;

              return (
                <g key={block.id} className="cursor-pointer">
                  {/* Interactive Hotspot Polygon */}
                  <polygon
                    points={block.polygonPoints}
                    onClick={() => onSelectBlock(block)}
                    onMouseEnter={() => {
                      setInternalHoveredBlock(block);
                      onHoverBlock?.(block.id);
                    }}
                    onMouseLeave={() => {
                      setInternalHoveredBlock(null);
                      onHoverBlock?.(null);
                    }}
                    fill={
                      isSelected
                        ? 'rgba(0, 40, 86, 0.45)'
                        : isHovered
                        ? 'rgba(255, 153, 51, 0.40)'
                        : 'rgba(255, 255, 255, 0.01)'
                    }
                    stroke={
                      isSelected
                        ? '#002856'
                        : isHovered
                        ? '#FF9933'
                        : 'rgba(0, 0, 0, 0.05)'
                    }
                    strokeWidth={isSelected ? 4 : isHovered ? 3 : 1}
                    strokeLinejoin="round"
                    filter={isSelected ? 'url(#blockGlowActive)' : isHovered ? 'url(#blockGlowHover)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Pin on Block Center */}
                  <g
                    transform={`translate(${block.mapPin.x}, ${block.mapPin.y})`}
                    onClick={() => onSelectBlock(block)}
                    onMouseEnter={() => {
                      setInternalHoveredBlock(block);
                      onHoverBlock?.(block.id);
                    }}
                    onMouseLeave={() => {
                      setInternalHoveredBlock(null);
                      onHoverBlock?.(null);
                    }}
                    className="cursor-pointer transition-transform duration-200"
                    style={{
                      transformOrigin: `${block.mapPin.x}px ${block.mapPin.y}px`,
                      transform: isSelected || isHovered ? 'scale(1.3)' : 'scale(1)'
                    }}
                  >
                    {/* Ring for Selected Block */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill="none"
                        stroke="#002856"
                        strokeWidth="2.5"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 10 : isHovered ? 8 : 6}
                      fill={isSelected ? '#002856' : isHovered ? '#FF9933' : '#0B5499'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Center Dot */}
                    <circle
                      cx="0"
                      cy="0"
                      r="2.5"
                      fill="#FFFFFF"
                    />
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Active Hover Tooltip */}
        {hoveredBlock && (
          <div
            className="absolute bottom-4 left-4 max-w-xs bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-lg shadow-xl border border-slate-700/80 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
              <div>
                <span className="text-sm font-black text-amber-400">
                  {hoveredBlock.name}
                </span>
                <span className="text-xs text-slate-300 ml-1.5">
                  ({hoveredBlock.hindiName})
                </span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                {hoveredBlock.completionRate}% Done
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-400">HQ:</span>{' '}
                <strong className="text-white">{hoveredBlock.headquarters}</strong>
              </div>
              <div>
                <span className="text-slate-400">Panchayats:</span>{' '}
                <strong className="text-white">{hoveredBlock.panchayatsCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Villages:</span>{' '}
                <strong className="text-white">{hoveredBlock.villagesCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Parcels:</span>{' '}
                <strong className="text-emerald-400 font-bold">{hoveredBlock.digitizedParcels.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Click to select this block for Land Record Services</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Legend Footer */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#002856] border border-white shadow-2xs" />
            <span className="font-semibold text-slate-700">Selected Block</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF9933] border border-white shadow-2xs" />
            <span className="font-semibold text-slate-700">Hover Highlight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#0B5499] border border-white shadow-2xs" />
            <span className="font-semibold text-slate-700">Block HQ</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Giridih District Land Registry Jurisdiction (13 Anchal / Blocks)
        </div>
      </div>

    </div>
  );
};
