### 🎯 Múltiples Módulos de Cotización
- **Cotizador de Aluminio**: 10 líneas completas (AL-25, AL-5000, AL-20, AL-42, AL-32, AM-35, L-12 Shower Door, S-38 RPT, S-33 RPT)
- **Cotizador de Termopaneles**: Cálculo especializado para vidrios DVH (Doble Vidrio Hermético)
- **Optimizador de Vidrios**: Algoritmo de corte 2D para optimizar el uso de planchas de vidrio

### 🔧 Funcionalidad Técnica Avanzada
- **Pautas de Corte Automáticas**: Generación de listas técnicas con todas las medidas y fórmulas
- **Visualización en Tiempo Real**: Preview interactivo de las configuraciones de ventanas
- **Cálculo de Materiales**: Perfiles, vidrios, quincallería y accesorios
- **Exportación PDF Profesional**: Documentos técnicos con detalles comerciales y de taller
- **Gestión de Márgenes**: Sistema de ajuste de márgenes y descuentos

### 👥 Sistema de Usuarios y Administración
- **Autenticación con Firebase**: Login seguro con roles de usuario
- **Panel de Administración**: Gestión de usuarios, presupuestos y configuraciones
- **Roles de Usuario**: Admin, Vendedor, Visualizador
- **Gestión de Presupuestos**: Vista unificada de todos los presupuestos (Aluminio y Termopanel)

## 🚀 Módulos del Sistema

### 1. 🏗️ Configurador de Ventanas de Aluminio (`/aluminio`)
Herramienta completa para diseño y presupuesto de ventanas de aluminio.

**Líneas Soportadas:**
- **AL-25**: Línea corredera estándar con termopanel (+$75.000)
- **AL-5000**: Línea corredera reforzada (+$35.000)
- **AL-20**: Línea corredera económica (+$55.000)
- **AL-42**: Línea proyectante con cámara (+$40.000)
- **AL-32**: Línea especial para abatibles (+$29.000)
- **AM-35**: Línea para puertas (+$45.000)
- **L-12 Shower Door**: Puertas de ducha aluminio (Base)
- **S-38 RPT**: Serie premium proyectante/fijo RPT (+$90.000)
- **S-33 RPT**: Serie premium corredera RPT (+$85.000)
- **AL-25 TP**: Variante termopanel de AL-25

**Tipos de Apertura:**
- Corredera (2H, 3H, 4H)
- Proyectante
- Fijo
- Abatible
- Combinaciones personalizadas

**Características:**
- Configuración de medidas en milímetros
- Múltiples opciones de vidrio (simple, termopanel, DVH)
- Selección de colores de perfil
- Compatible con accesorios y quincallería
- Cálculo automático de sash widths (anchos de hojas)
- Vista previa con dimensiones

### 2. 🌡️ Calculador de Termopaneles (`/cotizador-termopaneles`)
Módulo especializado para cotización de vidrios termopaneles (DVH).

**Características:**
- Selección de espesores de cristal (3mm, 4mm, 5mm, 6mm, 8mm, 10mm)
- Configuración de cámara de aire
- Cálculo de metros cuadrados
- Validación de compatibilidad con perfiles
- Precios según tipo y espesor

### 3. 📊 Optimizador de Vidrios (`/admin/optimizer`)
Herramienta de optimización de corte 2D para maximizar el aprovechamiento de planchas de vidrio.

**Características:**
- Algoritmo de bin packing 2D
- Soporte para múltiples ítems y formas
- 59 formas pre-definidas en registro
- Visualización de cortes optimizados
- Estadísticas de aprovechamiento
- Exportación a PDF con layouts
- Tabs: Estándar y Formas

### 4. 📄 Gestión de Presupuestos (`/presupuestos`)
Panel centralizado para administrar todas las cotizaciones.

**Características:**
- Vista unificada de presupuestos de Aluminio y Termopanel
- Columna "Tipo" para diferenciar módulo de origen
- Búsqueda por número de presupuesto
- Filtrado por usuario y fecha
- Re-edición de presupuestos guardados
- Sincronización en tiempo real con Firestore
- Exportación masiva

### 5. 🔐 Panel de Administración (`/admin`)
Dashboard administrativo para gestión del sistema.

**Módulos:**
- **Config**: Configuración general del sistema
- **Modelos**: Gestión de modelos y plantillas
- **Perfiles**: Administración de perfiles de aluminio
- **Usuarios**: Gestión de roles y permisos
- **Optimizador**: Herramienta de optimización de vidrios

## 🧱 Stack Tecnológico
# 💻 Stack Tecnológico
- **Frontend Framework**: React 18 + Vite
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Lucide React (Íconos)
- **Base de Datos & Auth**: Firebase (Firestore + Authentication)
- **Gestor de Estado**: Zustand
- **Enrutamiento**: React Router v6
- **Animaciones**: Tailwind CSS nativo (Optimizadas para rendimiento)

## 🛠️ Instalación y Configuración Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/crist38/Modulo2.git
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno para Firebase (requiere `.env.local`).
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🔒 Consideraciones de Seguridad
Todas las reglas de seguridad de la base de datos están gestionadas mediante `firestore.rules`. Los usuarios y roles están estrictamente controlados, asegurando que solo los correos designados como "Administrador" puedan realizar cambios en configuraciones o modificar los precios base del sistema.
