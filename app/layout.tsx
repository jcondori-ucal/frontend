import React from 'react';
import type { Metadata } from 'next';
import { Tomorrow, Rubik } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const tomorrow = Tomorrow({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-tomorrow',
  display: 'swap',
});

const rubik = Rubik({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kodo Motors · Portal del Cliente Mazda',
  description: 'Reserva ágil de citas en 5 pasos y seguimiento en vivo del estado de tu Mazda sin contraseña.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${tomorrow.variable} ${rubik.variable}`}>
      <body className="bg-bg text-fg font-body min-h-screen flex flex-col selection:bg-accent selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

