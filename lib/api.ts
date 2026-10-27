import { 
  Sede, Servicio, Vehiculo, Reserva, OrdenServicio, 
  CatalogoItem, Repuesto, Encuesta, SaludResponse 
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (response.status === 204) {
    return true as unknown as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.mensaje || (data?.errores ? data.errores.join(', ') : 'Error en la petición');
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.detalles = data?.errores || [];
    throw error;
  }

  return data as T;
}

export const api = {
  // Salud
  getSalud: () => request<SaludResponse>('/api/salud'),

  // Sedes
  getSedes: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<Sede[]>(`/api/sedes${query ? `?${query}` : ''}`);
  },
  getSede: (id: number) => request<Sede>(`/api/sedes/${id}`),
  createSede: (datos: Partial<Sede>) => request<Sede>('/api/sedes', { method: 'POST', body: JSON.stringify(datos) }),
  updateSede: (id: number, datos: Partial<Sede>) => request<Sede>(`/api/sedes/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  deleteSede: (id: number) => request<boolean>(`/api/sedes/${id}`, { method: 'DELETE' }),

  // Servicios
  getServicios: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<Servicio[]>(`/api/servicios${query ? `?${query}` : ''}`);
  },
  getServicio: (id: number) => request<Servicio>(`/api/servicios/${id}`),
  createServicio: (datos: Partial<Servicio>) => request<Servicio>('/api/servicios', { method: 'POST', body: JSON.stringify(datos) }),
  updateServicio: (id: number, datos: Partial<Servicio>) => request<Servicio>(`/api/servicios/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  deleteServicio: (id: number) => request<boolean>(`/api/servicios/${id}`, { method: 'DELETE' }),

  // Catálogo
  getCatalogo: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<CatalogoItem[]>(`/api/catalogo${query ? `?${query}` : ''}`);
  },
  getVehiculoCatalogo: (id: number) => request<CatalogoItem>(`/api/catalogo/${id}`),
  createCatalogo: (datos: Partial<CatalogoItem>) => request<CatalogoItem>('/api/catalogo', { method: 'POST', body: JSON.stringify(datos) }),
  updateCatalogo: (id: number, datos: Partial<CatalogoItem>) => request<CatalogoItem>(`/api/catalogo/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  deleteCatalogo: (id: number) => request<boolean>(`/api/catalogo/${id}`, { method: 'DELETE' }),

  // Reservas
  getReservas: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<Reserva[]>(`/api/reservas${query ? `?${query}` : ''}`);
  },
  getReserva: (id: number) => request<Reserva>(`/api/reservas/${id}`),
  createReserva: (datos: Partial<Reserva>) => request<Reserva>('/api/reservas', { method: 'POST', body: JSON.stringify(datos) }),
  updateReserva: (id: number, datos: Partial<Reserva>) => request<Reserva>(`/api/reservas/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  deleteReserva: (id: number) => request<boolean>(`/api/reservas/${id}`, { method: 'DELETE' }),

  // Repuestos
  getRepuestos: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<Repuesto[]>(`/api/repuestos${query ? `?${query}` : ''}`);
  },
  getRepuesto: (id: number) => request<Repuesto>(`/api/repuestos/${id}`),
  createRepuesto: (datos: Partial<Repuesto>) => request<Repuesto>('/api/repuestos', { method: 'POST', body: JSON.stringify(datos) }),
  updateRepuesto: (id: number, datos: Partial<Repuesto>) => request<Repuesto>(`/api/repuestos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  deleteRepuesto: (id: number) => request<boolean>(`/api/repuestos/${id}`, { method: 'DELETE' }),

  // Encuestas
  getEncuestas: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<Encuesta[]>(`/api/encuestas${query ? `?${query}` : ''}`);
  },
  getEncuesta: (id: number) => request<Encuesta>(`/api/encuestas/${id}`),
  createEncuesta: (datos: Partial<Encuesta>) => request<Encuesta>('/api/encuestas', { method: 'POST', body: JSON.stringify(datos) }),
  updateEncuesta: (id: number, datos: Partial<Encuesta>) => request<Encuesta>(`/api/encuestas/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  deleteEncuesta: (id: number) => request<boolean>(`/api/encuestas/${id}`, { method: 'DELETE' }),

  // Vehículos
  getVehiculos: () => request<Vehiculo[]>('/api/vehiculos'),

  // Órdenes de Servicio
  getOrdenes: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<OrdenServicio[]>(`/api/ordenes${query ? `?${query}` : ''}`);
  },
  getOrden: (id: number) => request<OrdenServicio>(`/api/ordenes/${id}`),
  getOrdenPorPlaca: (placa: string) => request<OrdenServicio>(`/api/ordenes/placa/${encodeURIComponent(placa)}`),
  createOrden: (datos: Partial<OrdenServicio>) => request<OrdenServicio>('/api/ordenes', { method: 'POST', body: JSON.stringify(datos) }),
  updateOrden: (id: number, datos: Partial<OrdenServicio>) => request<OrdenServicio>(`/api/ordenes/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  patchOrdenEstado: (id: number, estado: string) => request<OrdenServicio>(`/api/ordenes/${id}`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
};

