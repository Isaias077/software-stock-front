# Software Stock - Sistema de Gestión

![Banner](public/vite.svg) 

Sistema moderno de gestión de inventario y ventas desarrollado con las mejores tecnologías web.

## Características Principales 🚀
- Gestión completa de artículos, proveedores y clientes
- Módulos de compras, ventas y control de caja
- Interfaz intuitiva con componentes Material-UI
- Exportación de reportes en PDF
- Atajos de teclado (F1-F7) para navegación rápida
- Diseño responsive para móviles y tablets

## Tecnologías Utilizadas 🛠️
- **Frontend**: React 19 + TypeScript
- **UI Framework**: Material-UI v6 con Emotion
- **Bundler**: Vite
- **Utilidades**:
  - jspdf y jspdf-autotable para generación de PDF
  - date-fns para manejo de fechas
  - react-to-print para impresión de componentes

## Instalación ⚙️
1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/software-stock-front.git
```
2. Instalar dependencias
```bash
npm install
```
3. Iniciar entorno de desarrollo
```bash
npm run dev
```

## Scripts Disponibles 📜
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run lint` | Ejecuta análisis de código |
| `npm run preview` | Previsualiza build de producción |

## Estructura de Proyecto 📂
```
software-stock-front/
├── src/
│   ├── Pages/         # Componentes de página
│   ├── components/    # Componentes reutilizables
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Punto de entrada
├── public/            # Assets estáticos
└── vite.config.ts     # Configuración de Vite
```

## Capturas de Pantalla 🖼️
![Interfaz Principal](public/interfaz/dashboard.png)
*Captura del dashboard principal con estadísticas clave*

## Licencia 📄
Este proyecto está bajo la licencia [MIT](LICENSE).
