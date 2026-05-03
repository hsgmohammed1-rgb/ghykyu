import { useRef, useState, useEffect } from 'react';
import { renderWithMath } from '../pages/StudentRoom';
import { Pencil, Eraser, Trash2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import getStroke from 'perfect-freehand';

interface WhiteboardProps {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onClose?: () => void;
  onDraw?: (dataUrl: string) => void;
  readOnly?: boolean;
  initialDataUrl?: string; // for students to see the canvas
}

// Default options for perfect-freehand
const getStrokeOptions = {
  size: 6,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t: number) => t,
  start: {
    taper: 0,
    easing: (t: number) => t,
    cap: true
  },
  end: {
    taper: 0,
    easing: (t: number) => t,
    cap: true
  }
};

// Helper to convert perfect-freehand stroke points to SVG path data
function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
}

type Point = [number, number, number];

export function Whiteboard({ questionText, options, correctIndex, explanation, onClose, onDraw, readOnly, initialDataUrl }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#B026FF');
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  
  // Store the current stroke being drawn
  const currentPoints = useRef<Point[]>([]);
  // Use a secondary canvas (offscreen or drawn once stroke ends) if we want absolute perfection,
  // but for simplicity, we'll draw the active stroke continuously.

  // Handle resizing so internal canvas resolution matches visual size
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Only update if changed significantly to avoid constant clearing
        if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
           canvasRef.current.width = width;
           canvasRef.current.height = height;
           
           // If we have an initial image, redraw it after resize
           if (initialDataUrl || currentPoints.current.length > 0) {
               // Redraw logic would ideally go here, but since it's a stateless bitmap for now,
               // we'll rely on the image load effect to handle initial state.
           }
        }
      }
    };

    handleResize(); // Initial sizing
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialDataUrl]);

  useEffect(() => {
    if (readOnly && initialDataUrl && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
        };
        img.src = initialDataUrl;
      }
    }
  }, [readOnly, initialDataUrl]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Scale coordinates if the CSS size doesn't match the internal canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      pressure: 'touches' in e && e.touches[0].force ? e.touches[0].force : 0.5
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    currentPoints.current = [[coords.x, coords.y, coords.pressure]];
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    e.preventDefault(); // Prevent scrolling on touch
    
    const coords = getCoordinates(e);
    if (!coords) return;

    currentPoints.current.push([coords.x, coords.y, coords.pressure]);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // We can use perfect-freehand to generate a smooth polygon
    const strokeOutline = getStroke(currentPoints.current, {
        ...getStrokeOptions,
        size: mode === 'erase' ? 40 : (e.type.includes('touch') ? 6 : 4), // thicker eraser
    });
    
    const pathData = new Path2D(getSvgPathFromStroke(strokeOutline));
    
    // Config context
    if (mode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000'; // Doesn't matter for destination-out
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = color;
    }
    
    ctx.fill(pathData);
  };

  const stopDrawing = () => {
    if (readOnly || !isDrawing) return;
    setIsDrawing(false);
    
    // Clear current points for the next stroke
    currentPoints.current = [];
    
    // Sync draw data
    if (onDraw && canvasRef.current) {
      // Lower quality webp for faster transmission
      const dataUrl = canvasRef.current.toDataURL('image/webp', 0.4);
      onDraw(dataUrl);
    }
  };

  const clearCanvas = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onDraw) onDraw(''); // empty
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-space-blue flex flex-col pt-16 pr-4 pl-4 pb-4 overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 glass-panel p-2">
        <div className="flex items-center gap-2 px-2">
          <span className="font-bold text-white bg-neon-purple/20 px-3 py-1 rounded-lg">لوحة الشرح</span>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-2">
            {/* Colors */}
            {['#FFFFFF', '#B026FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'].map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setMode('draw'); }}
                className={cn("w-8 h-8 rounded-full border-2 transition-transform", color === c && mode === 'draw' ? "scale-110 border-white shadow-lg" : "border-white/20")}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="w-px h-8 bg-white/20 mx-2" />
            <button onClick={() => setMode('draw')} className={cn("p-2 rounded-lg transition-colors", mode === 'draw' ? "bg-white/20" : "")}><Pencil size={20} /></button>
            <button onClick={() => setMode('erase')} className={cn("p-2 rounded-lg transition-colors", mode === 'erase' ? "bg-white/20" : "")}><Eraser size={20} /></button>
            <button onClick={clearCanvas} className="p-2 rounded-lg text-coral-red hover:bg-coral-red/10"><Trash2 size={20} /></button>
            <div className="w-px h-8 bg-white/20 mx-2" />
            {onClose && (
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-300">
                <XCircle size={24} />
              </button>
            )}
          </div>
        )}
        {readOnly && onClose && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-300 ml-auto">
              إغلاق
            </button>
        )}
      </div>

      <div className="flex-1 flex gap-4 mt-6">
        {/* Sidebar Info */}
        <div className="w-1/3 max-w-sm glass-panel p-6 flex flex-col gap-6 overflow-y-auto">
          <h2 className="text-xl font-bold leading-relaxed">{renderWithMath(questionText)}</h2>
          <div className="flex flex-col gap-3">
            {options.map((opt, idx) => (
              <div key={idx} className={cn(
                "p-3 rounded-lg border",
                idx === correctIndex ? "bg-emerald-500/20 border-emerald-500 text-emerald-100" : "bg-white/5 border-white/10"
              )}>
                {renderWithMath(opt)}
              </div>
            ))}
          </div>
          <div className="mt-auto bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm leading-relaxed">
            <strong className="block text-blue-400 mb-2">الشرح:</strong>
            {explanation}
          </div>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 glass-panel relative overflow-hidden bg-space-blue shadow-inner" style={{ cursor: readOnly ? 'default' : (mode === 'draw' ? 'crosshair' : 'cell') }}>
            {/* Grid background for whiteboard */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
        </div>
      </div>
    </div>
  );
}
