# Kodo Motors · Portal del Cliente (Frontend Web)

Portal web de cara al cliente final para la red de talleres autorizados **Kodo Motors** (Mazda Perú). Desarrollado con **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS**.

---

## 🚀 Funcionalidades Principales

1. **Vitrina Kodo (Showroom Mazda 2026)**:
   - Visualizador 3D interactivo con pinturas Takuminuri (Soul Red Crystal, Machine Grey, Polymetal Grey, Jet Black, Snowflake White).
   - Catálogo interactivo de modelos con especificaciones técnicas, precio en USD y disponibilidad en tiempo real.
2. **Reserva de Cita en 5 Pasos**:
   - Selección de sede entre las 7 sedes oficiales de Lima.
   - Selección de servicio (mantenimiento preventivo, diagnóstico, frenos, neumáticos, etc.).
   - Validación de placa peruana (formato `ABC-123`).
   - Verificación de colisión de horarios por bahía.
   - Resumen digital y confirmación con notificación WhatsApp.
3. **Seguimiento en Vivo de Vehículo (`/mi-vehiculo`)**:
   - Búsqueda por placa con animación flapboard estilo aeropuerto mecánico.
   - Línea de tiempo de las 6 etapas del servicio:
     1. Recepción & Inventario
     2. Diagnóstico Computarizado
     3. Aprobación de Presupuesto
     4. En Bahía (Mecánica)
     5. Lavado & Detailing
     6. Control de Calidad & Entrega
   - Aprobación de repuestos adicionales con 1 clic.
   - Estimación de entrega (ETA) y contacto directo con el asesor de servicio vía WhatsApp.
4. **Directorio de 7 Sedes Operativas**:
   - Información de contacto, horarios de atención, teléfonos y mapas de acceso.

---

## 🛠️ Requisitos e Instalación

### Requisitos
- Node.js >= 18
- Backend Kodo Motors en ejecución en `http://localhost:4000` (o configurar `NEXT_PUBLIC_API_URL`)

### Instalación de dependencias
```bash
npm install
```

### Ejecución en Modo Desarrollo (Puerto 3001)
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3001](http://localhost:3001).

### Compilación y Producción
```bash
npm run build
npm start
```

---

## 📁 Estructura del Proyecto

```
frontend-cliente/
├── app/
│   ├── catalogo/         # Showroom interactivo de vehículos Mazda
│   ├── mi-vehiculo/      # Rastreo en vivo por placa (6 etapas)
│   ├── reservar/         # Flujo de reserva de citas en 5 pasos
│   ├── sedes/            # Directorio de las 7 sedes operativas
│   ├── globals.css       # Estilos globales y paleta Kodo Motors
│   ├── layout.tsx        # Layout con Navbar y Footer
│   └── page.tsx          # Landing page con visualizador 3D
├── components/
│   ├── CarVisualizer.tsx # Visualizador 3D de pinturas Takuminuri
│   ├── Footer.tsx        # Pie de página institucional
│   ├── Navbar.tsx        # Barra de navegación con indicador de estado
│   ├── Plate.tsx         # Renderizador de placa peruana oficial
│   └── ServiceStageTracker.tsx # Rastreador de 6 etapas
├── lib/
│   └── api.ts            # Cliente HTTP tipado hacia la API REST
├── types/
│   └── index.ts          # Tipos TypeScript para todas las entidades
├── next.config.js        # Configuración de proxies /api y headers
├── tailwind.config.ts    # Configuración de Tailwind y paleta de colores
└── tsconfig.json         # Configuración estricta de TypeScript
```

---

## 📡 Endpoints Consumidos
- `GET /api/salud`: Verificación de disponibilidad de la API.
- `GET /api/sedes`: Lista de sedes operativas y horarios.
- `GET /api/servicios`: Lista de servicios disponibles y precios.
- `GET /api/catalogo`: Modelos Mazda 2026 y stock.
- `GET /api/reservas`: Validación de disponibilidad horaria por sede.
- `POST /api/reservas`: Registro de nueva cita con placa de vehículo.
- `GET /api/ordenes/placa/:placa`: Consulta del estado en vivo de la orden de trabajo por placa.

