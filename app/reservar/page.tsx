'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Wrench, Car, 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle
} from 'lucide-react';
import Plate from '../../components/Plate';
import { api } from '../../lib/api';
import { Sede, Servicio, Vehiculo, Reserva } from '../../types';

const HORARIOS = [
  '08:00', '09:00', '10:00', '10:30', '11:30', '12:30', 
  '14:00', '15:00', '15:30', '16:30', '17:00'
];

const MODELOS_MAZDA = [
  'Mazda2', 'Mazda3', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-90', 'BT-50', 'MX-5'
];

export default function ReservarPage() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reservaExitosa, setReservaExitosa] = useState<Reserva | null>(null);

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [vehiculosExistentes, setVehiculosExistentes] = useState<Vehiculo[]>([]);
  const [reservasExistentes, setReservasExistentes] = useState<Reserva[]>([]);

  const [formData, setFormData] = useState({
    sede_id: 1,
    sede_nombre: '',
    servicio_id: 1,
    servicio_nombre: '',
    servicio_precio: 0,
    servicio_duracion: 0,
    vehiculo_id: null as number | null,
    placa: 'ABC-123',
    modelo: 'CX-5',
    anio: 2023,
    kilometraje: 30000,
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    nombre_contacto: 'Lucía Ramírez',
    telefono: '987654321',
    email: 'lucia.ramirez@mail.com',
    acepta_whatsapp: true,
    observacion: 'Mantenimiento regular Mazda',
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [sedesData, serviciosData, vehiculosData, reservasData] = await Promise.all([
          api.getSedes(),
          api.getServicios(),
          api.getVehiculos(),
          api.getReservas(),
        ]);

        setSedes(sedesData || []);
        setServicios(serviciosData || []);
        setVehiculosExistentes(vehiculosData || []);
        setReservasExistentes(reservasData || []);

        if (sedesData?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            sede_id: sedesData[0].id,
            sede_nombre: sedesData[0].nombre,
          }));
        }
        if (serviciosData?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            servicio_id: serviciosData[0].id,
            servicio_nombre: serviciosData[0].nombre,
            servicio_precio: serviciosData[0].precio,
            servicio_duracion: serviciosData[0].duracion_min,
          }));
        }
        if (vehiculosData?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            vehiculo_id: vehiculosData[0].id,
            placa: vehiculosData[0].placa,
            modelo: vehiculosData[0].modelo,
            anio: vehiculosData[0].anio,
          }));
        }
      } catch (err) {
        console.error('Error al cargar datos de reserva:', err);
      }
    }
    loadInitialData();
  }, []);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3, 6)}`;
    }
    setFormData((prev) => ({ ...prev, placa: val }));

    const matched = vehiculosExistentes.find(
      (v) => v.placa.toUpperCase() === val.toUpperCase()
    );
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        vehiculo_id: matched.id,
        modelo: matched.modelo,
        anio: matched.anio,
      }));
    }
  };

  const isSlotTaken = (hora: string) => {
    return reservasExistentes.some(
      (r) =>
        r.sede_id === formData.sede_id &&
        r.fecha === formData.fecha &&
        r.hora?.slice(0, 5) === hora.slice(0, 5) &&
        (r.estado === 'pendiente' || r.estado === 'confirmada')
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let finalVehiculoId = formData.vehiculo_id;
      if (!finalVehiculoId && vehiculosExistentes.length > 0) {
        finalVehiculoId = vehiculosExistentes[0].id;
      }

      const payload = {
        fecha: formData.fecha,
        hora: formData.hora.length === 5 ? `${formData.hora}:00` : formData.hora,
        sede_id: Number(formData.sede_id),
        servicio_id: Number(formData.servicio_id),
        vehiculo_id: Number(finalVehiculoId),
        estado: 'confirmada' as const,
        observacion: formData.observacion || 'Reserva web Agenda Kodo',
      };

      const resultado = await api.createReserva(payload);
      setReservaExitosa(resultado);
      setStep(6);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la reserva en el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-head uppercase tracking-wider text-accent font-semibold">
            Portal del Cliente
          </span>
          <span className="text-white/30">•</span>
          <span className="text-xs text-white/60">Tiempo estimado: &lt; 90 segundos</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Reserva de Cita de Taller
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Agenda tu mantenimiento oficial Mazda en cualquiera de nuestras 7 sedes con disponibilidad en tiempo real.
        </p>
      </div>

      {step <= 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-head uppercase tracking-wider text-white/60 mb-2">
            <span className={step >= 1 ? 'text-accent font-bold' : ''}>1. Sede</span>
            <span className={step >= 2 ? 'text-accent font-bold' : ''}>2. Servicio</span>
            <span className={step >= 3 ? 'text-accent font-bold' : ''}>3. Vehículo</span>
            <span className={step >= 4 ? 'text-accent font-bold' : ''}>4. Fecha & Turno</span>
            <span className={step >= 5 ? 'text-accent font-bold' : ''}>5. Contacto</span>
          </div>
          <div className="meter">
            <div className="meter-fill" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-bad/15 border border-bad/30 text-bad text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 1 && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-head flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Paso 1: Selecciona la Sede de Atención
            </h2>
            <span className="text-xs text-white/40">{sedes.length} Sedes disponibles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sedes.map((s) => {
              const selected = formData.sede_id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      sede_id: s.id,
                      sede_nombre: s.nombre,
                    }))
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selected
                      ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(243,255,52,0.15)] ring-1 ring-accent'
                      : 'bg-[#121214] border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-head font-bold text-base text-white">
                      {s.nombre}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-accent">
                      {s.distrito}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mb-2">{s.direccion}</p>
                  <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
                    <span>Horario: {s.hora_apertura} - {s.hora_cierre}</span>
                    <span>{s.atiende_domingo ? 'Abre Domingo' : 'Lun a Sáb'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!formData.sede_id}
              className="btn !h-11 !px-6"
            >
              Continuar al Paso 2
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-head flex items-center gap-2">
              <Wrench className="w-5 h-5 text-accent" />
              Paso 2: ¿Qué servicio necesita tu Mazda?
            </h2>
            <span className="text-xs text-white/40">{servicios.length} Trabajos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {servicios.map((sv) => {
              const selected = formData.servicio_id === sv.id;
              return (
                <div
                  key={sv.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      servicio_id: sv.id,
                      servicio_nombre: sv.nombre,
                      servicio_precio: sv.precio,
                      servicio_duracion: sv.duracion_min,
                    }))
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selected
                      ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(243,255,52,0.15)] ring-1 ring-accent'
                      : 'bg-[#121214] border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-head font-bold text-base text-white">
                      {sv.nombre}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                      {sv.categoria}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mb-3">{sv.descripcion || 'Servicio técnico especializado Mazda.'}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-accent font-head font-bold text-base">
                      S/ {Number(sv.precio).toFixed(2)}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {sv.duracion_min} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="btn-ghost !h-11 !px-5">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Atrás
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.servicio_id}
              className="btn !h-11 !px-6"
            >
              Continuar al Paso 3
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-head flex items-center gap-2">
              <Car className="w-5 h-5 text-accent" />
              Paso 3: Datos de tu Vehículo
            </h2>
            <Plate plate={formData.placa} size="normal" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="field">
              <label className="label">Placa Peruana (MTC)</label>
              <input
                type="text"
                maxLength={7}
                value={formData.placa}
                onChange={handlePlateChange}
                placeholder="ABC-123"
                className="input input-plate"
              />
              <span className="text-[11px] text-white/40">
                Formato automático: ABC-123.
              </span>
            </div>

            <div className="field">
              <label className="label">Modelo Mazda</label>
              <select
                value={formData.modelo}
                onChange={(e) => setFormData((prev) => ({ ...prev, modelo: e.target.value }))}
                className="select font-head font-semibold"
              >
                {MODELOS_MAZDA.map((m) => (
                  <option key={m} value={m} className="bg-[#121214] text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Año de Fabricación</label>
              <input
                type="number"
                min={2010}
                max={2026}
                value={formData.anio}
                onChange={(e) => setFormData((prev) => ({ ...prev, anio: Number(e.target.value) }))}
                className="input"
              />
            </div>

            <div className="field">
              <label className="label">Kilometraje Actual (km)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={formData.kilometraje}
                onChange={(e) => setFormData((prev) => ({ ...prev, kilometraje: Number(e.target.value) }))}
                className="input"
              />
            </div>
          </div>

          {vehiculosExistentes.length > 0 && (
            <div className="pt-2">
              <label className="label mb-2 block">O elige uno de tus vehículos guardados:</label>
              <div className="flex flex-wrap gap-2">
                {vehiculosExistentes.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        vehiculo_id: v.id,
                        placa: v.placa,
                        modelo: v.modelo,
                        anio: v.anio,
                      }))
                    }
                    className={`chip ${formData.placa === v.placa ? 'active' : ''}`}
                  >
                    <span>{v.placa}</span>
                    <span className="text-white/50 text-[11px]">• {v.modelo} ({v.anio})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="btn-ghost !h-11 !px-5">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Atrás
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={formData.placa.length < 6}
              className="btn !h-11 !px-6"
            >
              Continuar al Paso 4
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-head flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Paso 4: Fecha y Turno de Taller
            </h2>
            <span className="text-xs text-accent font-semibold">{formData.sede_nombre}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="field md:col-span-1">
              <label className="label">Selecciona el Día</label>
              <input
                type="date"
                value={formData.fecha}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))}
                className="input"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="label">Horario Disponible en Bahía</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {HORARIOS.map((hora) => {
                  const taken = isSlotTaken(hora);
                  const selected = formData.hora === hora;
                  return (
                    <button
                      key={hora}
                      type="button"
                      disabled={taken}
                      onClick={() => setFormData((prev) => ({ ...prev, hora }))}
                      className={`p-3 rounded-xl border font-head text-center transition-all ${
                        selected
                          ? 'bg-accent text-black font-bold border-accent shadow-[0_0_15px_rgba(243,255,52,0.3)]'
                          : taken
                          ? 'bg-bad/10 border-bad/30 text-bad/50 cursor-not-allowed line-through'
                          : 'bg-[#121214] border-white/10 text-white hover:border-white/30'
                      }`}
                    >
                      <div className="text-sm font-bold">{hora}</div>
                      <div className="text-[10px] mt-0.5 opacity-70">
                        {taken ? 'Ocupado' : 'Libre'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="btn-ghost !h-11 !px-5">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Atrás
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!formData.fecha || !formData.hora}
              className="btn !h-11 !px-6"
            >
              Continuar al Paso 5
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-head flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Paso 5: Datos de Contacto y Confirmación
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="field">
              <label className="label">Nombre y Apellidos</label>
              <input
                type="text"
                value={formData.nombre_contacto}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre_contacto: e.target.value }))}
                placeholder="Nombre del propietario o conductor"
                className="input"
                required
              />
            </div>

            <div className="field">
              <label className="label">WhatsApp (9 dígitos)</label>
              <input
                type="tel"
                maxLength={9}
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value.replace(/\D/g, '') }))}
                placeholder="987654321"
                className="input"
                required
              />
            </div>

            <div className="field sm:col-span-2">
              <label className="label">Correo Electrónico</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="tu@correo.com"
                className="input"
              />
            </div>

            <div className="field sm:col-span-2">
              <label className="label">Observaciones o Síntomas del Auto</label>
              <textarea
                value={formData.observacion}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacion: e.target.value }))}
                className="input !h-20 py-2 resize-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <input
              type="checkbox"
              id="whatsappCheck"
              checked={formData.acepta_whatsapp}
              onChange={(e) => setFormData((prev) => ({ ...prev, acepta_whatsapp: e.target.checked }))}
              className="w-5 h-5 rounded accent-accent cursor-pointer"
            />
            <label htmlFor="whatsappCheck" className="text-xs text-white/80 cursor-pointer">
              Recibir confirmación inmediata y recordatorio del estado del vehículo por WhatsApp.
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(4)} className="btn-ghost !h-11 !px-5">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Atrás
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.nombre_contacto || formData.telefono.length < 9}
              className="btn !h-11 !px-8 text-black font-bold shadow-[0_0_20px_rgba(243,255,52,0.3)]"
            >
              {loading ? 'Confirmando Cita...' : 'Confirmar Reserva Ahora'}
              <CheckCircle2 className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="card-glass p-8 md:p-10 text-center rounded-3xl border border-ok/30 space-y-6">
          <div className="w-16 h-16 rounded-full bg-ok/20 border border-ok/40 text-ok mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(61,220,132,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-head uppercase tracking-widest text-ok font-bold mb-1">
              ¡Cita Confirmada con Éxito!
            </div>
            <h2 className="text-3xl font-bold text-white font-head">
              Reserva #{reservaExitosa?.id || '2026-KD'}
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-md mx-auto">
              Tu cita quedó registrada en la base de datos central de Kodo Motors sin colisión de horarios.
            </p>
          </div>

          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#121214] border border-white/10 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-[10px] uppercase font-head text-white/40">Placa Registrada</div>
                <Plate plate={formData.placa} size="normal" className="mt-1" />
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-head text-white/40">Estado</div>
                <span className="text-xs font-bold text-ok uppercase px-2 py-0.5 rounded bg-ok/10 border border-ok/30">
                  Confirmada
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span className="text-white/40">Sede:</span>
                <span className="font-semibold text-white">{formData.sede_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Servicio:</span>
                <span className="font-semibold text-white">{formData.servicio_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Fecha y Hora:</span>
                <span className="font-semibold text-white">{formData.fecha} a las {formData.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Precio Estimado:</span>
                <span className="font-semibold text-accent font-head">S/ {Number(formData.servicio_precio).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href={`/mi-vehiculo?placa=${encodeURIComponent(formData.placa)}`}
              className="btn !h-11 !px-6"
            >
              Hacer Seguimiento en "Mi Vehículo"
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <button
              onClick={() => {
                setStep(1);
                setReservaExitosa(null);
              }}
              className="btn-ghost !h-11 !px-4"
            >
              Nueva Reserva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

