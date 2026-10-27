'use client';

import React from 'react';

interface PlateProps {
  plate?: string;
  size?: 'normal' | 'lg' | 'large';
  className?: string;
}

export default function Plate({ plate = 'ABC-123', size = 'normal', className = '' }: PlateProps) {
  const isLarge = size === 'lg' || size === 'large';
  const cleanPlate = (plate || 'ABC-123').toUpperCase();

  return (
    <span className={`plate ${isLarge ? 'plate-lg' : ''} ${className}`}>
      <b>{cleanPlate}</b>
    </span>
  );
}

