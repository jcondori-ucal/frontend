'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Calendar, Car, Clock, ShieldCheck, Wrench, ArrowRight, 
  Users, CheckCircle2, Star, Sparkles, PhoneCall, ChevronRight
} from 'lucide-react';
import ServiceStageTracker from '../components/ServiceStageTracker';
import Plate from '../components/Plate';
import { api } from '../lib/api';

const CarVisualizer = dynamic(() => import('../components/CarVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="card-glass p-8 rounded-3xl min-h-[460px] flex flex-col items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="stage-loader">
        <i />
      </div>
      <span className="text-xs text-white/40 mt-12 font-head tracking-wider uppercase">Cargando visualizador 3D...</span>
    </div>
  ),
});

export default function ClienteHomePage() {
  const [stats, setStats] = useState({
    sedes: 7,
    servicios: 5,
    catalogo: 6,
    csat: '5.0',
    loading: true,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [sedes, servicios, catalogo, encuestas] = await Promise.allSettled([
          api.getSedes(),
          api.getServicios(),
          api.getCatalogo(),
          api.getEncuestas(),
        ]);

        const totalSedes = sedes.status === 'fulfilled' ? sedes.value?.length || 7 : 7;
        const totalServicios = servicios.status === 'fulfilled' ? servicios.value?.length || 5 : 5;
        const totalCatalogo = catalogo.status === 'fulfilled' ? catalogo.value?.length || 6 : 6;
        const listaEncuestas = encuestas.status === 'fulfilled' ? encuestas.value || [] : [];

        let promedioCsat = '5.0';
        if (listaEncuestas.length > 0) {
          const suma = listaEncuestas.reduce((acc, curr) => acc + (Number(curr.puntuacion) || 5), 0);
          promedioCsat = (suma / listaEncuestas.length).toFixed(1);
        }

        setStats({
          sedes: totalSedes,
          servicios: totalServicios,
          catalogo: totalCatalogo,
          csat: promedioCsat,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-head text-accent mb-4 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Especialistas Mazda en el Perú · 7 Sedes Operativas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
            Tu Mazda en las mejores manos.
            <span className="block text-accent sheen mt-2">
              Reserva online sin esperas ni chats desordenados.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Agenda tu mantenimiento oficial en menos de 90 segundos o rastrea en tiempo real el avance de tu auto en taller ingresando solo tu número de placa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/reservar" className="btn !h-12 !px-8 text-base font-semibold shadow-[0_0_25px_rgba(243,255,52,0.3)]">
              Reservar Cita en 5 Pasos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link href="/mi-vehiculo" className="btn-ghost !h-12 !px-7 text-base">
              Consultar "Mi Vehículo"
            </Link>
            <Link href="/catalogo" className="btn-quiet !h-12 !px-5 text-sm">
              Ver Modelos 2026 →
            </Link>
          </div>
        </div>

        {/* Live Metrics Ribbon for Customer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="kpi">
            <span className="text-[11px] font-head uppercase tracking-wider text-white/40">Sedes en Red</span>
            <strong className="text-accent">{stats.sedes}</strong>
            <span className="text-[10px] text-white/50">Lima & Arequipa</span>
          </div>
          <div className="kpi">
            <span className="text-[11px] font-head uppercase tracking-wider text-white/40">Trabajos de Taller</span>
            <strong>{stats.servicios}</strong>
            <span className="text-[10px] text-white/50">Garantía oficial Mazda</span>
          </div>
          <div className="kpi">
            <span className="text-[11px] font-head uppercase tracking-wider text-white/40">Calificación Clientes</span>
            <strong className="text-ok flex items-center gap-1">
              {stats.csat} <Star className="w-4 h-4 fill-ok" />
            </strong>
            <span className="text-[10px] text-white/50">Satisfacción certificada</span>
          </div>
          <div className="kpi">
            <span className="text-[11px] font-head uppercase tracking-wider text-white/40">Modelos Nuevos</span>
            <strong>{stats.catalogo}</strong>
            <span className="text-[10px] text-white/50">Disponibles en exhibición</span>
          </div>
        </div>

        {/* Car Visualizer (Mazda CX-5 with 3D color switcher) */}
        <CarVisualizer model="Mazda CX-5 Signature 2.5 Turbo" plate="ABC-123" />
      </section>

      {/* Customer Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-head uppercase tracking-widest text-accent mb-2">Servicios para el Conductor</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Transparencia y Precisión Automotriz
          </h2>
          <p className="text-sm text-white/60 mt-2">
            Olvídate de llamar para preguntar cómo va tu vehículo. Toda la información en tu pantalla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8 flex flex-col justify-between hover:border-accent/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Reserva de Citas en 5 Pasos
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Selecciona tu sede más cercana, el servicio requerido, ingresa tu placa con formateador automático y escoge el horario disponible sin sobreventa de turnos.
              </p>
              <div className="space-y-2 mb-8 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-ok" />
                  <span>Sin colisión de horarios entre vehículos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-ok" />
                  <span>Confirmación y recordatorio automático por WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-ok" />
                  <span>Precios claros con I.G.V. incluido</span>
                </div>
              </div>
            </div>
            <Link href="/reservar" className="btn !h-11 text-xs font-semibold w-full">
              Iniciar Reserva Online →
            </Link>
          </div>

          <div className="card p-8 flex flex-col justify-between hover:border-accent/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/20 text-white flex items-center justify-center mb-5">
                <Car className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Portal "Mi Vehículo"
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Ingresa con tu número de placa sin necesidad de contraseñas. Revisa en qué etapa se encuentra tu auto, aprueba repuestos adicionales con 1 toque y conoce la hora exacta de entrega.
              </p>
              <div className="space-y-2 mb-8 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Matrícula animada estilo flapboard de aeropuerto</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Barra progresiva de las 6 etapas del auto</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Contacto directo por WhatsApp con tu asesor</span>
                </div>
              </div>
            </div>
            <Link href="/mi-vehiculo" className="btn-ghost !h-11 text-xs font-semibold w-full">
              Consultar Mi Auto por Placa →
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Stages Cycle Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-glass p-6 md:p-8 rounded-3xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-head uppercase tracking-wider text-accent font-semibold mb-1">
                Estandarización Kodo
              </div>
              <h3 className="text-2xl font-bold text-white">
                Las 6 Etapas del Vehículo en Taller
              </h3>
            </div>
            <Link href="/mi-vehiculo" className="btn-ghost !h-9 text-xs">
              Rastrear Placa →
            </Link>
          </div>
          <ServiceStageTracker currentStage="en_proceso" />
        </div>
      </section>
    </div>
  );
}

