'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Fuel, Gauge, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { CatalogoItem } from '../../types';

export default function ClienteCatalogoPage() {
  const [vehiculos, setVehiculos] = useState<CatalogoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtroModelo, setFiltroModelo] = useState<string>('todos');

  useEffect(() => {
    async function loadCatalogo() {
      try {
        const data = await api.getCatalogo();
        setVehiculos(data || []);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogo();
  }, []);

  const modelosUnicos = ['todos', ...Array.from(new Set(vehiculos.map((v) => v.modelo)))];

  const vehiculosFiltrados = vehiculos.filter((v) => {
    if (filtroModelo === 'todos') return true;
    return v.modelo === filtroModelo;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-head uppercase tracking-wider text-accent font-semibold">
            Salón de Exhibición Kodo
          </span>
          <span className="text-white/30">•</span>
          <span className="text-xs text-white/60">Línea Oficial 2026</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight font-head">
          Gama de Vehículos Nuevos Mazda
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Descubre los modelos con tecnología Skyactiv, diseño Kodo y garantía oficial de red.
        </p>
      </div>

      {/* Model Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {modelosUnicos.map((m) => (
          <button
            key={m}
            onClick={() => setFiltroModelo(m)}
            className={`chip ${filtroModelo === m ? 'active' : ''}`}
          >
            {m === 'todos' ? `Todos (${vehiculos.length})` : m}
          </button>
        ))}
      </div>

      {/* Grid of Catalog items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculosFiltrados.map((v) => (
          <div
            key={v.id}
            className="card p-6 rounded-3xl flex flex-col justify-between hover:border-accent/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-head font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
                  Año {v.anio}
                </span>
                {v.destacado ? (
                  <span className="text-[10px] font-head font-bold uppercase px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Destacado
                  </span>
                ) : null}
              </div>

              <h3 className="font-head font-bold text-2xl text-white">
                {v.modelo}
              </h3>
              <div className="text-xs text-white/70 font-medium mb-4">
                {v.version}
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-white/5 space-y-2 text-xs mb-4">
                <div className="flex justify-between text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-accent" /> Combustible:
                  </span>
                  <span className="font-semibold text-white uppercase">{v.combustible}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-info" /> Transmisión:
                  </span>
                  <span className="font-semibold text-white uppercase">{v.transmision}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Disponibilidad:</span>
                  <span
                    className={`font-head font-bold ${
                      v.stock > 0 ? 'text-ok' : 'text-bad'
                    }`}
                  >
                    {v.stock > 0 ? `${v.stock} unidades listas` : 'Próxima llegada'}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-white/40">Precio Sugerido:</span>
                <span className="font-head font-bold text-2xl text-accent">
                  $ {Number(v.precio_usd).toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-5">
              <a
                href={`https://wa.me/51987654321?text=${encodeURIComponent(
                  `Hola Kodo Motors, me interesa cotizar el ${v.modelo} ${v.version} año ${v.anio}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn !h-10 text-xs w-full font-bold flex items-center justify-center gap-1"
              >
                <span>Cotizar por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

