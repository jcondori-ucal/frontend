'use client';

import React from 'react';
import { Check, Clock, Wrench, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';

export interface EtapaDef {
  id: number;
  key: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ETAPAS: EtapaDef[] = [
  { id: 1, key: 'reserva', label: '1. Reserva', desc: 'Agendamiento web o call center', icon: Clock },
  { id: 2, key: 'recibido', label: '2. Recepción', desc: 'Check-in, fotos e inventario', icon: ShieldCheck },
  { id: 3, key: 'diagnostico', label: '3. Diagnóstico', desc: 'Escaneo OBD-II y 21 puntos', icon: Wrench },
  { id: 4, key: 'en_proceso', label: '4. Taller', desc: 'Mecánica y repuestos genuinos', icon: Wrench },
  { id: 5, key: 'listo', label: '5. Calidad y Lavado', desc: 'Prueba de ruta y cortesía', icon: Sparkles },
  { id: 6, key: 'entregado', label: '6. Post-venta', desc: 'Entrega de llaves y CSAT', icon: PhoneCall },
];

interface ServiceStageTrackerProps {
  currentStage?: string;
  onSelectStage?: (stage: string) => void;
  interactive?: boolean;
}

export default function ServiceStageTracker({ 
  currentStage = 'en_proceso', 
  onSelectStage, 
  interactive = false 
}: ServiceStageTrackerProps) {
  const getStageIndex = (stage: string): number => {
    switch (stage) {
      case 'reserva':
      case 'pendiente':
      case 'confirmada':
        return 1;
      case 'recibido':
        return 2;
      case 'diagnostico':
        return 3;
      case 'en_proceso':
      case 'taller':
        return 4;
      case 'listo':
      case 'calidad':
        return 5;
      case 'entregado':
      case 'postventa':
        return 6;
      default:
        return 2;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative">
        {ETAPAS.map((etapa) => {
          const isPassed = etapa.id < currentIndex;
          const isCurrent = etapa.id === currentIndex;
          const Icon = etapa.icon;

          return (
            <div
              key={etapa.id}
              onClick={() => interactive && onSelectStage && onSelectStage(etapa.key)}
              className={`p-3 rounded-2xl border transition-all ${
                interactive ? 'cursor-pointer hover:border-white/30' : ''
              } ${
                isCurrent
                  ? 'bg-accent/10 border-accent shadow-[0_0_20px_rgba(243,255,52,0.15)] ring-1 ring-accent/40'
                  : isPassed
                  ? 'bg-ok/5 border-ok/30 text-white/80'
                  : 'bg-white/[0.02] border-white/[0.06] text-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-accent text-black font-head font-bold shadow-[0_0_10px_#f3ff34]'
                      : isPassed
                      ? 'bg-ok text-black font-bold'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : etapa.id}
                </div>
                {isCurrent && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                )}
              </div>
              <div
                className={`font-head text-xs font-bold leading-tight mb-1 ${
                  isCurrent ? 'text-accent' : isPassed ? 'text-white' : 'text-white/50'
                }`}
              >
                {etapa.label}
              </div>
              <div className="text-[10px] text-white/45 leading-tight">
                {etapa.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

