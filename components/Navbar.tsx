'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Car, MapPin, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [salud, setSalud] = useState<'online' | 'error' | 'loading'>('loading');

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await api.getSalud();
        setSalud(data?.ok ? 'online' : 'error');
      } catch {
        setSalud('error');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/reservar', label: 'Reservar Cita' },
    { href: '/mi-vehiculo', label: 'Mi Vehículo' },
    { href: '/catalogo', label: 'Modelos Mazda' },
    { href: '/sedes', label: 'Nuestras 7 Sedes' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0be6] backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(243,255,52,0.2)]">
              <span className="font-head font-bold text-lg text-accent">K</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-head font-bold text-base tracking-wider text-white">AGENDA KODO</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                  Mazda
                </span>
              </div>
              <span className="text-[11px] text-white/50 block font-normal tracking-wide">
                Portal Oficial del Cliente · 7 Sedes
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Status & Action */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  salud === 'online'
                    ? 'bg-ok shadow-[0_0_8px_#3ddc84]'
                    : salud === 'error'
                    ? 'bg-bad shadow-[0_0_8px_#ff5a4f]'
                    : 'bg-white/40 animate-pulse'
                }`}
              />
              <span className="text-white/60">
                {salud === 'online' ? 'Taller Online' : salud === 'error' ? 'Offline' : 'Conectando...'}
              </span>
            </div>

            <Link href="/reservar" className="btn !h-9 !px-4 text-xs font-semibold">
              Agendar Cita
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#0e0e10] border-b border-white/10 px-4 pt-3 pb-6 space-y-2">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium ${
                  pathname === link.href
                    ? 'bg-accent text-black font-semibold'
                    : 'bg-white/5 text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Link
              href="/reservar"
              onClick={() => setMenuOpen(false)}
              className="btn !h-10 text-xs font-semibold w-full"
            >
              Agendar Cita en 5 Pasos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

