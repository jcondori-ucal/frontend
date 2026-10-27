export interface Sede {
  id: number;
  nombre: string;
  distrito: string;
  direccion: string;
  telefono: string;
  hora_apertura: string;
  hora_cierre: string;
  atiende_domingo: boolean | number;
  activa?: boolean | number;
}

export interface Servicio {
  id: number;
  nombre: string;
  categoria: 'mantenimiento' | 'diagnostico' | 'frenos' | 'neumaticos' | 'electrico' | 'planchado_pintura';
  descripcion?: string | null;
  precio: number;
  duracion_min: number;
  activo?: boolean | number;
}

export interface Vehiculo {
  id: number;
  placa: string;
  modelo: string;
  anio: number;
  color?: string | null;
  kilometraje?: number;
  contacto_id?: number;
}

export interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  sede_id: number;
  servicio_id: number;
  vehiculo_id: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'atendida';
  observacion?: string | null;
  activo?: boolean | number;
  created_at?: string;
  sede_nombre?: string;
  servicio_nombre?: string;
  servicio_precio?: number;
  vehiculo_placa?: string;
  vehiculo_modelo?: string;
}

export interface OrdenServicio {
  id: number;
  vehiculo_id: number;
  sede_id: number;
  servicio_id: number;
  tecnico: string;
  km_ingreso: number;
  diagnostico?: string | null;
  costo: number;
  estado: 'recibido' | 'diagnostico' | 'en_proceso' | 'listo' | 'entregado';
  fecha_ingreso: string;
  vehiculo_placa?: string;
  vehiculo_modelo?: string;
  vehiculo_anio?: number;
  vehiculo_color?: string;
  contacto_nombre?: string;
  contacto_telefono?: string;
  contacto_email?: string;
  sede_nombre?: string;
  sede_distrito?: string;
  servicio_nombre?: string;
  servicio_categoria?: string;
  servicio_precio?: number;
}

export interface CatalogoItem {
  id: number;
  modelo: string;
  version: string;
  anio: number;
  precio_usd: number;
  stock: number;
  combustible: 'gasolina' | 'hibrido' | 'diesel';
  transmision: 'mecanica' | 'automatica';
  destacado: boolean | number;
  activo?: boolean | number;
}

export interface Repuesto {
  id: number;
  codigo: string;
  nombre: string;
  modelo_compatible: string;
  stock: number;
  stock_minimo: number;
  precio: number;
  ubicacion?: string | null;
  activo?: boolean | number;
}

export interface Encuesta {
  id: number;
  orden_id: number;
  puntuacion: number;
  recomendaria: boolean | number;
  comentario?: string | null;
  activo?: boolean | number;
  created_at?: string;
  detallesOrden?: {
    tecnico: string;
    costo: number;
    estado: string;
  };
}

export interface SaludResponse {
  ok: boolean;
  mensaje: string;
  base_de_datos: string;
  version_mysql: string;
  hora_servidor: string;
}

