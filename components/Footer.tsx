'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const sedes = [
    'Surquillo', 'La Molina', 'San Miguel', 'Los Olivos', 'Ate', 'Santa Anita', 'Arequipa'
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-[#070708] text-white/60 text-xs py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-head font-bold text-lg text-white">AGENDA KODO</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                CLIENTE
              </span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              Atención y servicio de taller especializado Mazda con repuestos genuinos, garantía oficial y seguimiento en tiempo real de tu vehículo.
            </p>
            <p className="text-[11px] text-white/40">
              Kodo Motors · 11 años de trayectoria
            </p>
          </div>

          <div>
            <h4 className="font-head text-white text-xs uppercase tracking-wider mb-3">
              Nuestras 7 Sedes
            </h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              {sedes.map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  Kodo {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-head text-white text-xs uppercase tracking-wider mb-3">
              Servicios para el Cliente
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/reservar" className="hover:text-accent transition-colors">
                  Reserva de Citas (5 Pasos)
                </Link>
              </li>
              <li>
                <Link href="/mi-vehiculo" className="hover:text-accent transition-colors">
                  Consulta "Mi Vehículo" (Flapboard)
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-accent transition-colors">
                  Catálogo Mazda 2026
                </Link>
              </li>
              <li>
                <Link href="/sedes" className="hover:text-accent transition-colors">
                  Horarios y Ubicaciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-head text-white text-xs uppercase tracking-wider mb-3">
              Contacto Directo
            </h4>
            <p className="text-xs text-white/60 mb-2">
              Lunes a Sábado de 08:00 a 18:00 hrs
            </p>
            <a
              href="https://wa.me/51987654321?text=Hola%20Kodo%20Motors,%20deseo%20consultar%20por%20mi%20vehículo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors font-semibold text-xs"
            >
              WhatsApp: +51 987 654 321
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            © 2026 Kodo Motors S.A.C. · Portal del Cliente.
          </div>
          <div className="flex items-center gap-4">
            <span>Dark Cockpit & High Precision</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-accent">Tomorrow & Rubik (TypeScript)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

