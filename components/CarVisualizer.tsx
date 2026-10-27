'use client';

import React, { useState, useEffect, useRef } from 'react';
import Plate from './Plate';
import { Gauge, Shield, Cpu, Sparkles, ChevronLeft, ChevronRight, RotateCw, AlertCircle } from 'lucide-react';
import { mountCar, CarController } from '../lib/car3d';

export interface MazdaColor {
  id: string;
  name: string;
  hex: string;
  hexNum: number;
  gradient: string;
  desc: string;
}

export const MAZDA_COLORS: MazdaColor[] = [
  {
    id: 'soul-red',
    name: 'Soul Red Crystal',
    hex: '#8e1219',
    hexNum: 0x8e1219,
    gradient: 'radial-gradient(65% 65% at 35% 30%, #ff525d 0%, #8e1219 60%, #4a0509 100%)',
    desc: 'El acabado icónico de Mazda con tecnología Takuminuri de triple capa translúcida.',
  },
  {
    id: 'machine-gray',
    name: 'Machine Gray',
    hex: '#5f6266',
    hexNum: 0x5f6266,
    gradient: 'radial-gradient(65% 65% at 35% 30%, #a8abb0 0%, #5f6266 60%, #2b2c2e 100%)',
    desc: 'Efecto acero líquido esculpido a mano con partículas reflectantes de aluminio.',
  },
  {
    id: 'jet-black',
    name: 'Jet Black Mica',
    hex: '#101012',
    hexNum: 0x101012,
    gradient: 'radial-gradient(65% 65% at 35% 30%, #35353d 0%, #101012 60%, #050506 100%)',
    desc: 'Profundidad obsidiana con sutiles destellos de mica azul noche.',
  },
  {
    id: 'snowflake-white',
    name: 'Snowflake White Pearl',
    hex: '#e6e6e3',
    hexNum: 0xe6e6e3,
    gradient: 'radial-gradient(65% 65% at 35% 30%, #ffffff 0%, #e6e6e3 60%, #9e9ea0 100%)',
    desc: 'Perlado multicapa de alto brillo con destellos cerámicos.',
  },
];

interface CarVisualizerProps {
  model?: string;
  plate?: string;
}

export default function CarVisualizer({
  model = 'Mazda CX-5 Signature AWD',
  plate = 'ABC-123',
}: CarVisualizerProps) {
  const [selectedColor, setSelectedColor] = useState<MazdaColor>(MAZDA_COLORS[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<CarController | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const stageEl = stageRef.current;
    if (!stageEl) return;

    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setError('Tu navegador o dispositivo no soporta aceleración 3D WebGL');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    mountCar(stageEl, '/models/cx5.glb', selectedColor.hexNum)
      .then((controller) => {
        if (isCancelled) {
          controller.destroy();
          return;
        }
        controllerRef.current = controller;
        stageEl.classList.add('ready');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar modelo 3D:', err);
        if (!isCancelled) {
          setError('No se pudo cargar el modelo 3D');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
      if (stageEl) {
        stageEl.classList.remove('ready');
      }
    };
  }, []);

  const handleColorChange = (color: MazdaColor) => {
    setSelectedColor(color);
    if (controllerRef.current) {
      controllerRef.current.setPaint(color.hexNum);
    }
  };

  const handleNudge = (dir: number) => {
    if (controllerRef.current) {
      controllerRef.current.nudge(dir);
    }
  };

  return (
    <div className="card-glass p-6 md:p-8 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Background glow matching the selected car paint */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[130px] opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: selectedColor.hex }}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-head uppercase tracking-widest text-accent font-semibold">
              KODO · ALMA DEL MOVIMIENTO
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-white/60">Configurador 3D Oficial (Three.js)</span>
          </div>
          <h3 className="font-head text-2xl md:text-3xl font-bold text-white tracking-tight">
            {model}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Plate plate={plate} size="normal" />
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-head">Color Activo</div>
            <div className="text-xs font-semibold text-white">{selectedColor.name}</div>
          </div>
        </div>
      </div>

      {/* 3D Stage Section */}
      <div className="relative my-2">
        <div
          ref={stageRef}
          id="stage"
          className="stage select-none"
          aria-label="Mazda CX-5 en 3D interactivo"
        >
          {/* Radial Spotlight */}
          <div className="spot" aria-hidden="true" />

          {/* Floor Shadow */}
          <div className="floor" aria-hidden="true" />

          {/* Loading Animation */}
          {loading && (
            <div className="stage-loader" aria-label="Cargando modelo 3D...">
              <i />
            </div>
          )}

          {/* Error Fallback */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20 bg-black/60 backdrop-blur-sm">
              <AlertCircle className="w-8 h-8 text-bad mb-2" />
              <p className="text-sm text-white/80">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-quiet text-xs mt-3 !py-1 !px-3"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>

        {/* Stage Interaction Controls */}
        <div className="stage-ui mt-3">
          <button
            type="button"
            className="icon-btn"
            onClick={() => handleNudge(-1)}
            aria-label="Girar auto a la izquierda"
            title="Girar a la izquierda"
          >
            <ChevronLeft className="w-5 h-5 text-white/80" />
          </button>

          {/* Paint Swatches Radio Group */}
          <div className="paints-group" role="radiogroup" aria-label="Colores Takuminuri Mazda">
            {MAZDA_COLORS.map((col) => {
              const active = selectedColor.id === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleColorChange(col)}
                  className={`paint-swatch ${active ? 'active' : ''}`}
                  style={{
                    backgroundColor: col.hex,
                    backgroundImage: `radial-gradient(60% 60% at 35% 30%, rgba(255,255,255,0.45), transparent 60%)`,
                  }}
                  title={col.name}
                  aria-label={col.name}
                />
              );
            })}
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={() => handleNudge(1)}
            aria-label="Girar auto a la derecha"
            title="Girar a la derecha"
          >
            <ChevronRight className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Color Description & Drag hint */}
        <div className="text-center mt-3 text-xs text-white/70">
          <span className="font-semibold text-white">{selectedColor.name}</span>
          <span className="text-white/30 mx-2">·</span>
          <span className="text-white/50">{selectedColor.desc}</span>
          <span className="text-white/30 mx-2">·</span>
          <span className="text-accent/90 inline-flex items-center gap-1">
            <RotateCw className="w-3 h-3 inline animate-spin-slow" /> Arrastra para rotar 360°
          </span>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-6 pt-6 border-t border-white/5">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-1.5 text-white/50 mb-1">
            <Gauge className="w-3.5 h-3.5 text-accent" />
            <span>Motorización</span>
          </div>
          <div className="font-head font-bold text-white text-sm">Skyactiv-G 2.5L Turbo</div>
          <div className="text-[11px] text-white/40">250 HP · 434 Nm Torque</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-1.5 text-white/50 mb-1">
            <Shield className="w-3.5 h-3.5 text-ok" />
            <span>Tracción Inteligente</span>
          </div>
          <div className="font-head font-bold text-white text-sm">i-Activ AWD</div>
          <div className="text-[11px] text-white/40">27 sensores predictivos</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-1.5 text-white/50 mb-1">
            <Cpu className="w-3.5 h-3.5 text-info" />
            <span>Chasis Dinámico</span>
          </div>
          <div className="font-head font-bold text-white text-sm">G-Vectoring Control+</div>
          <div className="text-[11px] text-white/40">Estabilidad activa en curva</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-1.5 text-white/50 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-warn" />
            <span>Garantía & Taller</span>
          </div>
          <div className="font-head font-bold text-white text-sm">Red 7 Sedes Kodo</div>
          <div className="text-[11px] text-white/40">11 años especialistas Mazda</div>
        </div>
      </div>

      {/* Model Attribution Footer */}
      <div className="mt-4 text-center text-[10px] text-white/30">
        Modelo 3D basado en «Mazda CX-5 2020» de ItsDiyor (licencia CC BY 4.0) optimizado con Meshopt para Kodo Motors.
      </div>
    </div>
  );
}
