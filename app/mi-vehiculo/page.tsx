'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Car, Clock, ShieldCheck, Wrench, CheckCircle2, 
  MessageSquare, UserCheck, AlertTriangle
} from 'lucide-react';
import Plate from '../../components/Plate';
import ServiceStageTracker from '../../components/ServiceStageTracker';
import { api } from '../../lib/api';
import { OrdenServicio } from '../../types';

const PLACAS_EJEMPLO = ['ABC-123', 'BXD-456', 'CKM-789', 'DLP-321'];

function MiVehiculoContent() {
  const searchParams = useSearchParams();
  const initialPlate = searchParams.get('placa') || 'ABC-123';

  const [inputPlaca, setInputPlaca] = useState<string>(initialPlate);
  const [activePlaca, setActivePlaca] = useState<string>(initialPlate);
  const [loading, setLoading] = useState<boolean>(false);
  const [orden, setOrden] = useState<OrdenServicio | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);

  const [repuestosAprobados, setRepuestosAprobados] = useState({
    filtroAceite: true,
    pastillasFreno: false,
    liquidoFrenos: true,
  });

  const buscarPlaca = async (placaABuscar: string) => {
    const clean = (placaABuscar || inputPlaca).trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setAnimating(true);
    setActivePlaca(clean);

    setTimeout(() => setAnimating(false), 600);

    try {
      const ordenData = await api.getOrdenPorPlaca(clean).catch(() => null);

      if (ordenData) {
        setOrden(ordenData);
      } else {
        const reservas = await api.getReservas().catch(() => []);
        const matchReserva = reservas.find(
          (r) => r.vehiculo_placa?.toUpperCase() === clean
        );

        if (matchReserva) {
          setOrden({
            id: matchReserva.id,
            vehiculo_id: matchReserva.vehiculo_id,
            sede_id: matchReserva.sede_id,
            servicio_id: matchReserva.servicio_id,
            vehiculo_placa: matchReserva.vehiculo_placa,
            vehiculo_modelo: matchReserva.vehiculo_modelo,
            sede_nombre: matchReserva.sede_nombre,
            servicio_nombre: matchReserva.servicio_nombre,
            servicio_precio: matchReserva.servicio_precio,
            costo: matchReserva.servicio_precio || 380,
            estado: matchReserva.estado === 'confirmada' ? 'recibido' : 'recibido',
            tecnico: 'Asesor Técnico Mazda',
            km_ingreso: 30000,
            fecha_ingreso: `${matchReserva.fecha}T${matchReserva.hora}`,
            diagnostico: matchReserva.observacion || 'Revisión técnica programada',
          });
        } else {
          setOrden({
            id: 99,
            vehiculo_id: 1,
            sede_id: 1,
            servicio_id: 1,
            vehiculo_placa: clean,
            vehiculo_modelo: 'CX-5',
            sede_nombre: 'Kodo Surquillo',
            servicio_nombre: 'Mantenimiento 10 000 km',
            servicio_precio: 380,
            costo: 380,
            estado: 'en_proceso',
            tecnico: 'Jorge Salas',
            km_ingreso: 28500,
            fecha_ingreso: new Date().toISOString(),
            diagnostico: 'Inspección de 21 puntos completada. Cambio de aceite y filtros en progreso.',
          });
        }
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPlaca(initialPlate);
  }, []);

  const toggleRepuesto = (key: keyof typeof repuestosAprobados) => {
    setRepuestosAprobados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const costoBase = Number(orden?.costo || orden?.servicio_precio || 380);
  const costoFiltro = repuestosAprobados.filtroAceite ? 45 : 0;
  const costoPastillas = repuestosAprobados.pastillasFreno ? 260 : 0;
  const costoLiquido = repuestosAprobados.liquidoFrenos ? 35 : 0;
  const costoTotal = costoBase + costoFiltro + costoPastillas + costoLiquido;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-xs font-head text-accent mb-3 uppercase tracking-wider">
          <Car className="w-3.5 h-3.5" />
          Seguimiento en Vivo del Auto
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Portal "Mi Vehículo" en Taller
        </h1>
        <p className="text-sm text-white/60 mt-2">
          Consulta en tiempo real la etapa de atención de tu auto sin contraseña. Trazabilidad completa desde el ingreso hasta el lavado final.
        </p>
      </div>

      <div className="card-glass p-6 md:p-8 rounded-3xl border border-white/10 text-center space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            buscarPlaca(inputPlaca);
          }}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={7}
              value={inputPlaca}
              onChange={(e) => setInputPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              className="input input-plate !h-12 !text-xl"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn !h-12 !px-6 shadow-[0_0_20px_rgba(243,255,52,0.25)]"
          >
            <Search className="w-4 h-4 mr-1" />
            {loading ? 'Buscando...' : 'Consultar'}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-white/40">Placas registradas en taller:</span>
          {PLACAS_EJEMPLO.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setInputPlaca(p);
                buscarPlaca(p);
              }}
              className={`chip ${activePlaca === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Airport Mechanical Flapboard Animation */}
        <div className="py-4">
          <div className="text-[11px] font-head uppercase tracking-widest text-white/40 mb-3">
            Matrícula Identificada
          </div>
          <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-[#09090b] border border-white/15 shadow-inner">
            <span className="text-xs font-head font-bold text-accent px-2">PERÚ</span>
            {activePlaca.split('').map((char, idx) => (
              <div
                key={idx}
                className={`w-10 h-14 md:w-12 md:h-16 rounded-lg bg-gradient-to-b from-[#18181b] to-[#0a0a0c] border border-white/20 flex items-center justify-center text-2xl md:text-3xl font-head font-bold text-white shadow-lg relative overflow-hidden ${
                  animating ? 'animate-pulse scale-95' : ''
                }`}
              >
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/60" />
                <span className="relative z-10">{char}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {orden && (
        <div className="space-y-8">
          <div className="card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-head uppercase tracking-wider text-accent font-semibold mb-1">
                  Estado en Vivo de tu Mazda
                </div>
                <h3 className="text-2xl font-bold text-white font-head flex items-center gap-3">
                  <span>{orden.vehiculo_modelo}</span>
                  <span className="text-white/30">•</span>
                  <Plate plate={orden.vehiculo_placa} size="normal" />
                </h3>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-right">
                <div className="text-[10px] font-head uppercase tracking-wider text-white/40">
                  Estimación de Entrega (ETA)
                </div>
                <div className="text-sm font-bold text-accent font-head flex items-center justify-end gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4" />
                  <span>Hoy · 17:30 hrs</span>
                </div>
              </div>
            </div>

            <ServiceStageTracker currentStage={orden.estado || 'en_proceso'} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white/40 block mb-1">Sede Asignada:</span>
                <span className="font-semibold text-white text-sm">{orden.sede_nombre}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white/40 block mb-1">Técnico a Cargo:</span>
                <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-accent" />
                  {orden.tecnico || 'Rosa Díaz'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white/40 block mb-1">Kilometraje de Ingreso:</span>
                <span className="font-semibold text-white text-sm">
                  {Number(orden.km_ingreso).toLocaleString()} km
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6 md:p-8 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-head text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-ok" />
                  Diagnóstico y Trabajo en Curso
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-ok/10 text-ok border border-ok/30 font-semibold">
                  Garantía Kodo
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-white/5 space-y-2 text-xs">
                <div className="font-semibold text-white text-sm">
                  {orden.servicio_nombre}
                </div>
                <p className="text-white/70 leading-relaxed">
                  {orden.diagnostico || 'Se realizó escaneo electrónico OBD-II de módulos de motor y transmisión sin códigos de falla activos.'}
                </p>
              </div>

              <div>
                <div className="text-xs font-head uppercase tracking-wider text-white/50 mb-3">
                  Aprobación de Repuestos Adicionales con 1 Toque
                </div>
                <div className="space-y-2.5">
                  <div
                    onClick={() => toggleRepuesto('filtroAceite')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      repuestosAprobados.filtroAceite
                        ? 'bg-ok/10 border-ok/40'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          repuestosAprobados.filtroAceite ? 'bg-ok text-black font-bold' : 'border border-white/20'
                        }`}
                      >
                        {repuestosAprobados.filtroAceite && '✓'}
                      </div>
                      <div>
                        <div className="font-medium text-white text-xs">Filtro de Aceite Genuino Mazda</div>
                        <div className="text-[11px] text-white/40">Código: PE01-14-302</div>
                      </div>
                    </div>
                    <span className="font-head font-bold text-xs text-white">S/ 45.00</span>
                  </div>

                  <div
                    onClick={() => toggleRepuesto('pastillasFreno')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      repuestosAprobados.pastillasFreno
                        ? 'bg-ok/10 border-ok/40'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          repuestosAprobados.pastillasFreno ? 'bg-ok text-black font-bold' : 'border border-white/20'
                        }`}
                      >
                        {repuestosAprobados.pastillasFreno && '✓'}
                      </div>
                      <div>
                        <div className="font-medium text-white text-xs">Pastillas Delanteras Cerámicas</div>
                        <div className="text-[11px] text-white/40">Desgaste al 80% (Recomendado)</div>
                      </div>
                    </div>
                    <span className="font-head font-bold text-xs text-white">S/ 260.00</span>
                  </div>

                  <div
                    onClick={() => toggleRepuesto('liquidoFrenos')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      repuestosAprobados.liquidoFrenos
                        ? 'bg-ok/10 border-ok/40'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          repuestosAprobados.liquidoFrenos ? 'bg-ok text-black font-bold' : 'border border-white/20'
                        }`}
                      >
                        {repuestosAprobados.liquidoFrenos && '✓'}
                      </div>
                      <div>
                        <div className="font-medium text-white text-xs">Líquido de Frenos DOT 4 Mazda Genuine</div>
                        <div className="text-[11px] text-white/40">Purgado y reemplazo completo</div>
                      </div>
                    </div>
                    <span className="font-head font-bold text-xs text-white">S/ 35.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-head uppercase tracking-wider text-accent font-semibold mb-2">
                  Presupuesto Actualizado
                </div>
                <h4 className="text-xl font-bold text-white font-head mb-4">
                  Liquidación Estimada
                </h4>

                <div className="space-y-3 text-xs border-b border-white/10 pb-4 mb-4">
                  <div className="flex justify-between text-white/70">
                    <span>Mano de obra y servicio base:</span>
                    <span className="font-semibold text-white">S/ {costoBase.toFixed(2)}</span>
                  </div>
                  {repuestosAprobados.filtroAceite && (
                    <div className="flex justify-between text-white/70">
                      <span>Filtro de aceite:</span>
                      <span className="font-semibold text-white">S/ {costoFiltro.toFixed(2)}</span>
                    </div>
                  )}
                  {repuestosAprobados.pastillasFreno && (
                    <div className="flex justify-between text-white/70">
                      <span>Pastillas de freno:</span>
                      <span className="font-semibold text-white">S/ {costoPastillas.toFixed(2)}</span>
                    </div>
                  )}
                  {repuestosAprobados.liquidoFrenos && (
                    <div className="flex justify-between text-white/70">
                      <span>Líquido de frenos:</span>
                      <span className="font-semibold text-white">S/ {costoLiquido.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-head font-bold text-white text-sm">TOTAL A PAGAR:</span>
                  <span className="font-head font-bold text-2xl text-accent">
                    S/ {costoTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-white/40 leading-tight">
                  Incluye I.G.V. Pagable mediante tarjeta, transferencia, Yape o Plin al recoger tu vehículo.
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <a
                  href={`https://wa.me/51987654321?text=${encodeURIComponent(
                    `Hola Kodo Motors, deseo consultar el estado de mi auto Mazda placa ${orden.vehiculo_placa}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !h-12 w-full text-xs font-bold bg-[#25D366] text-black hover:bg-[#2fe673] shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                >
                  <MessageSquare className="w-4 h-4 mr-1 fill-black" />
                  Contactar Asesor por WhatsApp
                </a>

                <div className="text-center text-[11px] text-white/40">
                  Respuesta inmediata de 08:00 a 18:00 hrs
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MiVehiculoPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white/50">Cargando Mi Vehículo...</div>}>
      <MiVehiculoContent />
    </Suspense>
  );
}

