'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { Sede } from '../../types';

export default function ClienteSedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSedes() {
      try {
        const data = await api.getSedes();
        setSedes(data || []);
      } catch (err) {
        console.error('Error al cargar sedes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSedes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-head uppercase tracking-wider text-accent font-semibold">
            Red de Talleres Especializados
          </span>
          <span className="text-white/30">•</span>
          <span className="text-xs text-white/60">Lima & Arequipa</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight font-head">
          Nuestras 7 Sedes de Atención
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Encuentra tu taller Kodo Motors más cercano, consulta horarios y agenda tu cita directamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sedes.map((s) => (
          <div
            key={s.id}
            className="card p-6 rounded-3xl flex flex-col justify-between hover:border-accent/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-head uppercase font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/25">
                  {s.distrito}
                </span>
                <span className="text-[10px] text-ok font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Sede Certificada
                </span>
              </div>

              <h3 className="font-head font-bold text-xl text-white mb-2">
                {s.nombre}
              </h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                {s.direccion}
              </p>

              <div className="p-4 rounded-2xl bg-[#121214] border border-white/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white/80">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>Central: <strong>{s.telefono}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span>Horario: {s.hora_apertura} - {s.hora_cierre} hrs</span>
                </div>
                <div className="text-[11px] text-white/40 pt-1 border-t border-white/5">
                  {s.atiende_domingo ? '✓ Atención días domingo' : '• Lunes a Sábado'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-5">
              <Link
                href={`/reservar?sede=${s.id}`}
                className="btn !h-10 text-xs w-full font-bold flex items-center justify-center gap-1"
              >
                <span>Agendar en {s.nombre}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

