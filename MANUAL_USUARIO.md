# Manual de Usuario - Sistema Cripter

Bienvenido al manual oficial del sistema Cripter. Esta guía le ayudará a navegar y utilizar todas las herramientas de cotización y administración de nuestra plataforma.

---

## 1. Introducción
El Sistema Cripter es una plataforma integral diseñada para simplificar el proceso de cotización de ventanería y termopaneles, automatizar la generación de pautas técnicas y gestionar la base de datos de clientes y precios en tiempo real.

---

## 2. Guía del Vendedor

### 2.1 Cotizador de Aluminio
Esta es la herramienta principal para diseñar ventanas y puertas de aluminio.

1.  **Selección de Línea**: Elija entre las líneas disponibles:
    - **AL-25 / AL-20 / AM-35**: Líneas correderas estándar.
    - **AL-5000**: Línea corredera de alta gama.
    - **AL-32 / AL-42**: Líneas para proyectantes y fijos.
    - **S-33 RPT**: Línea RPT (Rotura de Puente Térmico) para ventanas correderas con eficiencia térmica.
    - **S-38 RPT**: Línea RPT (Rotura de Puente Térmico) para fijos y proyectantes con alta eficiencia térmica.
    - **Shower Door (AL-12)**: Línea especializada para baños.
2.  **Dimensiones**: Ingrese el Ancho (X) y Alto (Y) en **milímetros (mm)**.
3.  **Configuración**:
    - Seleccione el tipo de apertura (Fijo, Corredera, Proyectante, etc.).
    - Elija el color del perfil y el tipo de cristal.
    - Agregue accesorios (Manillas, Mosquiteros, Palillaje).
4.  **Exportación**:
    - **PDF Presupuesto**: Documento limpio para el cliente con imagen y descripción.
    - **PDF Pauta de Corte**: Documento técnico para el taller que incluye fórmulas de corte, vidrios necesarios y quincallería (incluye cálculo automático de silicona).

### 2.2 Cotizador de Termopaneles
Permite configurar cristales DVH (Doble Vidriado Hermético) de forma independiente.

1.  **Cristal Interior/Exterior**: Seleccione el tipo de cristal para cada cara.
2.  **Separador**: Elija el ancho de la cámara de aire/gas.
3.  **Dimensiones**: Ingrese medidas en mm para calcular el área y precio neto.

### 2.3 Gestión de Presupuestos
Acceda a través del botón "Mis Presupuestos" o "Historial".

- **Búsqueda**: Filtre por nombre de cliente o número de presupuesto.
- **Acciones**:
    - **Ver**: Visualiza los detalles completos y permite re-imprimir el PDF.
    - **Editar**: Carga el presupuesto nuevamente en el cotizador para hacer cambios.
    - **Duplicar**: Crea una copia exacta (útil para presupuestos similares en distintos clientes).
    - **Eliminar**: Borra el registro permanentemente.

---

## 3. Guía del Administrador

### 3.1 Ajustes de Precios
Ubicado en el portal de configuración. Permite mantener actualizados los costos ante variaciones del mercado.

- **Precio Base**: Afecta el costo por m2 global.
- **Perfiles y Cristales**: Permite editar el precio unitario de cada insumo.
- **IMPORTANTE**: No olvide hacer clic en "Guardar Todo" al finalizar los cambios.

### 3.2 Gestión de Modelos
Permite pre-configurar tipos de ventanas comunes (Presets). Al guardar un modelo, los vendedores pueden seleccionarlo y solo ajustar las dimensiones, ahorrando tiempo de configuración.

### 3.3 Catálogo de Perfiles
Sección técnica donde se definen los pesos (kg/m) y códigos de cada perfil de aluminio. Estos datos alimentan los cálculos de las pautas de corte.

### 3.4 Gestión de Usuarios
En el panel "Usuarios", el administrador puede:
- Ver quién se ha registrado.
- Cambiar roles de **Vendedor** a **Administrador**.
- Eliminar accesos no autorizados.

---

## 4. Preguntas Frecuentes (FAQ)

**¿Cómo cambio el IVA?**
El sistema calcula automáticamente el 19%. Si requiere cambiarlo, debe realizarse a nivel de código o consultarlo con soporte técnico.

**¿Por qué no puedo ver el botón de administración?**
Asegúrese de haber iniciado sesión con un correo autorizado en la lista de administradores (`ADMIN_EMAILS`).

**¿Las pautas de corte son exactas?**
Las fórmulas están basadas en los catálogos técnicos de cada línea. Siempre se recomienda una validación visual inicial en proyectos críticos.

---

## 5. Anexos y Valores del Sistema

### 5.1 Líneas Disponibles (linea)
El sistema soporta las siguientes líneas arquitectónicas de aluminio y estructuras:
- **Línea AL 5000** (Corredera estándar)
- **Línea AL 20** (Corredera estándar liviana)
- **Línea AL 25** (Alta gama corredera)
- **Línea AL 25 TP** (Corredera Alta gama para termopanel)
- **Línea S-33 RPT** (Corredera con rotura de puente térmico)
- **Línea AL 32** (Fijos y proyectantes livianos)
- **Línea AL 42** (Fijos y proyectantes)
- **Línea S-38 RPT** (Fijos y proyectantes con rotura perimetral)
- **Línea AM-35** (Puertas de abatir)
- **Línea AL-12** (Shower Door)
- **Tubular 40x80** (Estructuras fijas y divisiones)

### 5.2 Tipos de Vidrios (vidrio)
Se encuentran preconfigurados en el sistema los siguientes tipos de cristales y espesores:
- **Incoloro:** 3mm, 4mm, 5mm, 6mm, 8mm, 10mm
- **Bronce:** 4mm, 5mm, 6mm
- **Espejo:** 4mm
- **Satén:** 4mm, 5mm
- **Semilla / Semilla Bronce:** 4mm
- **Laminado:** 5mm, 6mm, 8mm, 10mm
- **Especiales:** Evergreen (4mm), Solar Cool Bronce (4mm), Solar Green (4mm), Bluegreen (6mm)
- **Reflex Bronce:** 4mm, 5mm
- **Templado:** 10mm
- **Empavonado:** 4mm, 5mm

### 5.3 Perfiles de Aluminio (perfiles)
El sistema calcula y genera pautas de corte basadas en los descuentos de una amplia variedad de perfiles técnicos:
- **Línea AL-25:** 2501 (Riel Superior), 2502 (Riel Inferior), 2503 (Jamba), 2504 (Cabezal), 2505 (Zócalo), 2506 (Pierna), 2507 (Traslapo), 2509, 2510, 2511R, 2512R, 2514, 2548, 2549
- **Línea AL-25 TP:** 2519 (Traslapo TP), 2517 (Pierna Abierta TP), 2530R, 2529R, 2547, 2550, 8015, 2516, 2545
- **Línea AL-5000:** 5001 (Riel Inferior), 5002 (Riel Superior), 5003 (Jamba), 5004 (Zócalo), 5005 (Cabezal), 5006 (Pierna), 5007 (Traslapo)
- **Línea AL-20:** 2001 (Riel Superior), 2002 (Riel Inferior), 2009 (Jamba), 2004 (Cabezal), 2005 (Zócalo), 2010 (Pierna), 2019 (Traslapo)
- **Línea AL-42:** 4201, 4209, 4204, 4202, 4229, 4231, 4206
- **Línea S-38 RPT:** 53810, 53820, 53830, 53500, 53510, 53511, 53910
- **Línea S-33 RPT:** 33010, 53010, 53030, 33030, 3500
- **Shower Door (AL-12):** 1201, 1202, 1203, 1204
- **Colores de Perfil Soportados:** Blanco, Roble Dorado, Negro, Nogal, Mate, Titanio.

---
*Cripter Limitada — Innovación en Cerramientos.*
