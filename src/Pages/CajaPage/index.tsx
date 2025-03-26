import React, { useState, useRef, useEffect } from 'react';
import { Container, Paper } from '@mui/material';
import CajaHeader from '../../components/CajaPage/CajaHeader';
import CajaCards from '../../components/CajaPage/CajaCards';
import MovimientosTable from '../../components/CajaPage/MovimientosTable';
import ActionButtons from '../../components/CajaPage/ActionButtons';
import AbrirCajaDialog from '../../components/CajaPage/Dialogs/AbrirCajaDialog';
import CerrarCajaDialog from '../../components/CajaPage/Dialogs/CerrarCajaDialog';
import ArticulosDialog from '../../components/CajaPage/Dialogs/ArticulosDialog';
import ExitDialog from '../../components/CajaPage/Dialogs/ExitDialog';
import NuevoMovimientoDialog from '../../components/CajaPage/Dialogs/NuevoMovimientoDialog';
import CajaSnackbar from '../../components/CajaPage/Snackbar';
import { format } from 'date-fns';

// Interfaces
interface MovimientoCaja {
  id: number;
  motivo: string;
  detalle: string;
  total: number;
  ingreso: number;
  egreso: number;
  fecha?: Date;
  hora?: Date;
}

interface ArticuloVendido {
  id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  total: number;
}

interface DetalleBalance {
  concepto: string;
  valor: number;
}

const DetalleCaja: React.FC = () => {
  // Referencias
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Estados para los datos de caja
  const [numeroCaja, setNumeroCaja] = useState<number>(2);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date('2023-04-30'));
  const [fechaCierre, setFechaCierre] = useState<Date | null>(new Date('2023-04-30'));
  const [horaInicio, setHoraInicio] = useState<Date | null>(new Date('2000-01-01T08:30:00'));
  const [horaCierre, setHoraCierre] = useState<Date | null>(new Date('2000-01-01T18:00:00'));
  const [estado, setEstado] = useState<string>("ABIERTO");
  const [efectivoTotal, setEfectivoTotal] = useState<number>(224.17);
  const [saldoInicial, setSaldoInicial] = useState<number>(1000);
  const [diferencia, setDiferencia] = useState<number>(0);
  const [efectivoReal, setEfectivoReal] = useState<number>(224.17);
  const [selectedLocation, setSelectedLocation] = useState<string>("Sucursal Principal");
  
  // Estados para el loading y selección
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState<number | null>(null);
  
  // Estados para diálogos
  const [openCerrarCajaDialog, setOpenCerrarCajaDialog] = useState<boolean>(false);
  const [openAbrirCajaDialog, setOpenAbrirCajaDialog] = useState<boolean>(false);
  const [openArticulosDialog, setOpenArticulosDialog] = useState<boolean>(false);
  const [openExitDialog, setOpenExitDialog] = useState<boolean>(false);
  const [openNuevoMovimientoDialog, setOpenNuevoMovimientoDialog] = useState<boolean>(false);
  
  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Movimientos de caja
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([
    { id: 1, motivo: "Compras", detalle: "CONTADO", total: -811.20, ingreso: 0, egreso: 811.20, fecha: new Date('2023-04-30'), hora: new Date('2000-01-01T10:15:00') },
    { id: 2, motivo: "Ventas", detalle: "CONTADO / TARJETA Efectivo", total: 35.37, ingreso: 35.37, egreso: 0, fecha: new Date('2023-04-30'), hora: new Date('2000-01-01T11:30:00') },
    { id: 3, motivo: "Ventas", detalle: "CONTADO / TARJETA TarjetaV1", total: 20.00, ingreso: 20.00, egreso: 0, fecha: new Date('2023-04-30'), hora: new Date('2000-01-01T14:45:00') },
    { id: 4, motivo: "MOVIMIENTOS", detalle: "INICIO DE CAJA", total: 1000.00, ingreso: 1000.00, egreso: 0, fecha: new Date('2023-04-30'), hora: new Date('2000-01-01T08:30:00') },
  ]);
  
  // Artículos vendidos (simulados)
  // @ts-ignore
  const [articulosVendidos, setArticulosVendidos] = useState<ArticuloVendido[]>([
    { id: 1, codigo: "7551037600520", descripcion: "EVEREADY AA X UNIDAD", cantidad: 5, precio: 5.50, total: 27.50 },
    { id: 2, codigo: "3892095285", descripcion: "EVEREADY AAA X UNIDAD", cantidad: 3, precio: 7.00, total: 21.00 },
    { id: 3, codigo: "7551037600182", descripcion: "EVEREADY C MEDIANA X UNO", cantidad: 2, precio: 12.00, total: 24.00 },
    { id: 4, codigo: "77985255158301", descripcion: "ESPUMA", cantidad: 1, precio: 17.00, total: 17.00 },
  ]);
  
  // Detalle adicional para el balance
  // @ts-ignore
  const [detalleBalance, setDetalleBalance] = useState<DetalleBalance[]>([
    { concepto: "Ventas en efectivo", valor: 35.37 },
    { concepto: "Ventas con tarjeta", valor: 20.00 },
    { concepto: "Retiros", valor: 0.00 },
    { concepto: "Ingresos extra", valor: 0.00 },
    { concepto: "Compras", valor: 811.20 },
    { concepto: "Gastos", valor: 0.00 },
  ]);
  
  // Estado para nuevo movimiento
  const [nuevoMovimiento, setNuevoMovimiento] = useState<{
    tipo: 'ingreso' | 'egreso';
    motivo: string;
    detalle: string;
    monto: number;
  }>({
    tipo: 'ingreso',
    motivo: '',
    detalle: '',
    monto: 0
  });
  
  // Calcular totales
  const totalSum = movimientos.reduce((acc, mov) => acc + mov.total, 0);
  const ingresoSum = movimientos.reduce((acc, mov) => acc + mov.ingreso, 0);
  const egresoSum = movimientos.reduce((acc, mov) => acc + mov.egreso, 0);
  
  // Efecto para calcular diferencia
  useEffect(() => {
    const calcularDiferencia = () => {
      setDiferencia(efectivoReal - efectivoTotal);
    };
    
    calcularDiferencia();
  }, [efectivoTotal, efectivoReal]);
  
  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
      .format(value)
      .replace('ARS', '$')
      .trim();
  };
  
  // Manejadores de eventos
  const handleCalcular = () => {
    setLoading(true);
    
    // Simulación de cálculo
    setTimeout(() => {
      // Recalcular el efectivo total basado en los movimientos
      const calculatedTotal = (saldoInicial + ingresoSum - egresoSum);
      setEfectivoTotal(calculatedTotal);
      
      setSnackbar({
        open: true,
        message: 'Totales calculados correctamente',
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };
  
  const handleSalir = () => {
    if (estado === "ABIERTO") {
      setOpenExitDialog(true);
    } else {
      exitAction();
    }
  };
  
  const exitAction = () => {
    setSnackbar({
      open: true,
      message: 'Saliendo del módulo de Caja',
      severity: 'info'
    });
    
    // Aquí normalmente redirigirías o cerrarías el componente
  };
  
  const handleAbrirCaja = () => {
    setOpenAbrirCajaDialog(true);
  };
  
  const confirmarAperturaCaja = () => {
    setLoading(true);
    
    // Simulación de apertura
    setTimeout(() => {
      // Generar nuevo número de caja
      const nuevoCaja = numeroCaja + 1;
      setNumeroCaja(nuevoCaja);
      
      // Establecer fecha y hora actuales
      const ahora = new Date();
      setFechaInicio(ahora);
      setHoraInicio(ahora);
      setFechaCierre(null);
      setHoraCierre(null);
      
      // Limpiar movimientos excepto el saldo inicial
      const movimientoInicial: MovimientoCaja = {
        id: 1,
        motivo: "MOVIMIENTOS",
        detalle: "INICIO DE CAJA",
        total: saldoInicial,
        ingreso: saldoInicial,
        egreso: 0,
        fecha: ahora,
        hora: ahora
      };
      
      setMovimientos([movimientoInicial]);
      setEstado("ABIERTO");
      setEfectivoTotal(saldoInicial);
      setEfectivoReal(saldoInicial);
      setDiferencia(0);
      
      setSnackbar({
        open: true,
        message: `Caja #${nuevoCaja} abierta correctamente`,
        severity: 'success'
      });
      
      setLoading(false);
      setOpenAbrirCajaDialog(false);
    }, 1000);
  };
  
  const handleCerrarCaja = () => {
    setOpenCerrarCajaDialog(true);
  };
  
  const confirmarCierreCaja = () => {
    setLoading(true);
    
    // Simulación de cierre
    setTimeout(() => {
      // Establecer fecha y hora actuales para el cierre
      const ahora = new Date();
      setFechaCierre(ahora);
      setHoraCierre(ahora);
      
      setEstado("CERRADO");
      
      setSnackbar({
        open: true,
        message: `Caja #${numeroCaja} cerrada correctamente`,
        severity: 'success'
      });
      
      setLoading(false);
      setOpenCerrarCajaDialog(false);
    }, 1000);
  };
  
  const handleArticulosVendidos = () => {
    setOpenArticulosDialog(true);
  };
  
  const handleAgregarMovimiento = () => {
    setOpenNuevoMovimientoDialog(true);
  };
  
  const handleGuardarNuevoMovimiento = () => {
    if (!nuevoMovimiento.motivo || !nuevoMovimiento.detalle || nuevoMovimiento.monto <= 0) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos correctamente',
        severity: 'error'
      });
      return;
    }
    
    const ahora = new Date();
    const nuevoId = Math.max(...movimientos.map(m => m.id), 0) + 1;
    
    const movimiento: MovimientoCaja = {
      id: nuevoId,
      motivo: nuevoMovimiento.motivo,
      detalle: nuevoMovimiento.detalle,
      total: nuevoMovimiento.tipo === 'ingreso' ? nuevoMovimiento.monto : -nuevoMovimiento.monto,
      ingreso: nuevoMovimiento.tipo === 'ingreso' ? nuevoMovimiento.monto : 0,
      egreso: nuevoMovimiento.tipo === 'egreso' ? nuevoMovimiento.monto : 0,
      fecha: ahora,
      hora: ahora
    };
    
    setMovimientos([...movimientos, movimiento]);
    
    // Actualizar el efectivo total
    const nuevoEfectivoTotal = efectivoTotal + (nuevoMovimiento.tipo === 'ingreso' ? nuevoMovimiento.monto : -nuevoMovimiento.monto);
    setEfectivoTotal(nuevoEfectivoTotal);
    
    // Reiniciar el formulario
    setNuevoMovimiento({
      tipo: 'ingreso',
      motivo: '',
      detalle: '',
      monto: 0
    });
    
    setSnackbar({
      open: true,
      message: 'Movimiento agregado correctamente',
      severity: 'success'
    });
    
    setOpenNuevoMovimientoDialog(false);
  };
  
  const handleImprimir = () => {
    // Crear contenido para imprimir
    const printContent = document.createElement('div');
    
    // Estilos para la impresión
    printContent.innerHTML = `
      <style>
        @media print {
          body { font-family: Arial, sans-serif; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
          h2 { font-size: 14px; font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          th, td { border: 1px solid #000; padding: 5px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          .text-right { text-align: right; }
          .fecha { font-size: 12px; margin-bottom: 15px; text-align: right; }
          .info-block { margin-bottom: 15px; }
          .info-row { display: flex; margin-bottom: 5px; }
          .info-label { font-weight: bold; width: 150px; }
          .totales { margin-top: 20px; }
          .total-final { font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px; }
        }
      </style>
      <div>
        <h1>DETALLE DE CAJA #${numeroCaja}</h1>
        <div class="fecha">Fecha de impresión: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        
        <div class="info-block">
          <div class="info-row">
            <div class="info-label">Estado:</div>
            <div>${estado}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Fecha de apertura:</div>
            <div>${fechaInicio ? fechaInicio.toLocaleDateString() : 'N/A'} ${horaInicio ? format(horaInicio, 'HH:mm') : ''}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Fecha de cierre:</div>
            <div>${fechaCierre ? fechaCierre.toLocaleDateString() : 'N/A'} ${horaCierre ? format(horaCierre, 'HH:mm') : ''}</div>
          </div>
        </div>
        
        <h2>RESUMEN DE MOVIMIENTOS</h2>
        <table>
          <thead>
            <tr>
              <th>Motivo</th>
              <th>Detalle</th>
              <th>Total</th>
              <th>Ingreso</th>
              <th>Egreso</th>
            </tr>
          </thead>
          <tbody>
            ${movimientos.map(mov => `
              <tr>
                <td>${mov.motivo}</td>
                <td>${mov.detalle}</td>
                <td class="text-right">${formatCurrency(mov.total)}</td>
                <td class="text-right">${formatCurrency(mov.ingreso)}</td>
                <td class="text-right">${formatCurrency(mov.egreso)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; font-weight: bold;">TOTALES:</td>
              <td class="text-right" style="font-weight: bold;">${formatCurrency(totalSum)}</td>
              <td class="text-right" style="font-weight: bold;">${formatCurrency(ingresoSum)}</td>
              <td class="text-right" style="font-weight: bold;">${formatCurrency(egresoSum)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div class="totales">
          <div class="info-row">
            <div class="info-label">Efectivo calculado:</div>
            <div class="text-right">${formatCurrency(efectivoTotal)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Efectivo real:</div>
            <div class="text-right">${formatCurrency(efectivoReal)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Diferencia:</div>
            <div class="text-right">${formatCurrency(diferencia)}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Este documento es un comprobante de control interno</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(printContent);
    
    // Imprimir y eliminar el elemento temporal
    window.print();
    document.body.removeChild(printContent);
  };
  
  // Exportar a PDF
  const handleExportToPDF = () => {
    // Similar al contenido de impresión pero con ajustes para PDF
    const pdfContent = document.createElement('div');
    pdfContent.innerHTML = `<style>/* Estilos similares a la impresión */</style>`;
    
    // Abrir en nueva ventana para imprimir como PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setSnackbar({
        open: true,
        message: 'Error al abrir ventana de impresión. Verifique su bloqueador de pop-ups.',
        severity: 'error'
      });
      return;
    }
    
    printWindow.document.write('<html><head><title>Detalle de Caja</title>');
    printWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
        h2 { font-size: 14px; font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; font-size: 12px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; }
        .text-right { text-align: right; }
      </style>
    `);
    printWindow.document.write('</head><body>');
    
    printWindow.document.write(`
      <h1>DETALLE DE CAJA #${numeroCaja}</h1>
      <p>Estado: ${estado}</p>
      <p>Fecha de apertura: ${fechaInicio ? fechaInicio.toLocaleDateString() : 'N/A'} ${horaInicio ? format(horaInicio, 'HH:mm') : ''}</p>
      <p>Fecha de cierre: ${fechaCierre ? fechaCierre.toLocaleDateString() : 'N/A'} ${horaCierre ? format(horaCierre, 'HH:mm') : ''}</p>
      
      <h2>RESUMEN DE MOVIMIENTOS</h2>
      <table>
        <thead>
          <tr>
            <th>Motivo</th>
            <th>Detalle</th>
            <th>Total</th>
            <th>Ingreso</th>
            <th>Egreso</th>
          </tr>
        </thead>
        <tbody>
          ${movimientos.map(mov => `
            <tr>
              <td>${mov.motivo}</td>
              <td>${mov.detalle}</td>
              <td class="text-right">${formatCurrency(mov.total)}</td>
              <td class="text-right">${formatCurrency(mov.ingreso)}</td>
              <td class="text-right">${formatCurrency(mov.egreso)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right; font-weight: bold;">TOTALES:</td>
            <td class="text-right" style="font-weight: bold;">${formatCurrency(totalSum)}</td>
            <td class="text-right" style="font-weight: bold;">${formatCurrency(ingresoSum)}</td>
            <td class="text-right" style="font-weight: bold;">${formatCurrency(egresoSum)}</td>
          </tr>
        </tfoot>
      </table>
      
      <p><strong>Efectivo calculado:</strong> ${formatCurrency(efectivoTotal)}</p>
      <p><strong>Efectivo real:</strong> ${formatCurrency(efectivoReal)}</p>
      <p><strong>Diferencia:</strong> ${formatCurrency(diferencia)}</p>
      
      <div class="footer">
        <p>Este documento es un comprobante de control interno</p>
      </div>
    `);
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Añadir un pequeño retraso para permitir que el contenido se cargue
    setTimeout(() => {
      printWindow.print();
      
      // Cerrar la ventana después de imprimir o cancelar
      printWindow.addEventListener('afterprint', () => {
        printWindow.close();
      });
      
      setSnackbar({
        open: true,
        message: 'PDF generado correctamente',
        severity: 'success'
      });
    }, 500);
  };
  
  // Exportar a Excel (CSV)
  const handleExportToExcel = () => {
    // Crear encabezados para el CSV
    const headers = ['Motivo', 'Detalle', 'Total', 'Ingreso', 'Egreso'];
    let csvContent = headers.join(',') + '\n';
    
    // Añadir los datos de los movimientos
    movimientos.forEach(mov => {
      // Escapar campos que puedan contener comas
      const detalle = `"${mov.detalle.replace(/"/g, '""')}"`;
      const motivo = `"${mov.motivo.replace(/"/g, '""')}"`;
      
      const row = [
        motivo,
        detalle,
        mov.total.toFixed(2),
        mov.ingreso.toFixed(2),
        mov.egreso.toFixed(2)
      ].join(',');
      
      csvContent += row + '\n';
    });
    
    // Añadir información de totales
    csvContent += '\n';
    csvContent += `"TOTALES",,${totalSum.toFixed(2)},${ingresoSum.toFixed(2)},${egresoSum.toFixed(2)}\n`;
    csvContent += '\n';
    csvContent += `"Efectivo calculado",,${efectivoTotal.toFixed(2)}\n`;
    csvContent += `"Efectivo real",,${efectivoReal.toFixed(2)}\n`;
    csvContent += `"Diferencia",,${diferencia.toFixed(2)}\n`;
    
    // Crear un blob y un enlace de descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Configurar el enlace y simular clic
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `Detalle_Caja_${numeroCaja}_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbar({
      open: true,
      message: 'Archivo CSV generado correctamente',
      severity: 'success'
    });
  };
  
  // Cerrar dialogs y snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Manejador para cambio de ubicación
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    
    // Datos demo para diferentes sucursales
    if (location === "Sucursal Norte") {
      setMovimientos([
        { id: 1, motivo: "Inicio Norte", detalle: "INICIO DE CAJA", total: 1500, ingreso: 1500, egreso: 0, fecha: new Date(), hora: new Date() },
        { id: 2, motivo: "Ventas Norte", detalle: "CONTADO", total: 450.50, ingreso: 450.50, egreso: 0, fecha: new Date(), hora: new Date() }
      ]);
      setArticulosVendidos([
        { id: 1, codigo: "N123", descripcion: "Producto Norte 1", cantidad: 3, precio: 50, total: 150 },
        { id: 2, codigo: "N456", descripcion: "Producto Norte 2", cantidad: 2, precio: 75, total: 150 }
      ]);
      setEfectivoTotal(1500 + 450.50);
      setEfectivoReal(1500 + 450.50);
    } else if (location === "Sucursal Sur") {
      setMovimientos([
        { id: 1, motivo: "Inicio Sur", detalle: "FONDO INICIAL", total: 2000, ingreso: 2000, egreso: 0, fecha: new Date(), hora: new Date() },
        { id: 2, motivo: "Ventas Mayoristas", detalle: "FACTURA A 1234", total: 1200.75, ingreso: 1200.75, egreso: 0, fecha: new Date(), hora: new Date() },
        { id: 3, motivo: "Gastos Operativos", detalle: "PAGO PROVEEDORES", total: -350.20, ingreso: 0, egreso: 350.20, fecha: new Date(), hora: new Date() }
      ]);
      setArticulosVendidos([
        { id: 1, codigo: "SUR001", descripcion: "BATERIA AUTOS SUR", cantidad: 2, precio: 450, total: 900 },
        { id: 2, codigo: "SUR002", descripcion: "LUBRICANTE INDUSTRIAL", cantidad: 5, precio: 80, total: 400 }
      ]);
      setEfectivoTotal(2000 + 1200.75 - 350.20);
      setEfectivoReal(2000 + 1200.75 - 350.20);
    } else if (location === "Sucursal Oeste") {
      setMovimientos([
        { id: 1, motivo: "Apertura Caja", detalle: "FONDO OPERATIVO", total: 1800, ingreso: 1800, egreso: 0, fecha: new Date(), hora: new Date() },
        { id: 2, motivo: "Ventas Minoristas", detalle: "EFECTIVO", total: 650.90, ingreso: 650.90, egreso: 0, fecha: new Date(), hora: new Date() },
        { id: 3, motivo: "Inversiones", detalle: "COMPRA MERCADERIA", total: -920.50, ingreso: 0, egreso: 920.50, fecha: new Date(), hora: new Date() }
      ]);
      setArticulosVendidos([
        { id: 1, codigo: "OES001", descripcion: "KIT HERRAMIENTAS", cantidad: 3, precio: 220, total: 660 },
        { id: 2, codigo: "OES002", descripcion: "ILUMINACION LED", cantidad: 10, precio: 35, total: 350 }
      ]);
      setEfectivoTotal(1800 + 650.90 - 920.50);
      setEfectivoReal(1800 + 650.90 - 920.50);
    } else {
      // Datos originales para sucursal principal
      setMovimientos([
        { id: 1, motivo: "Compras", detalle: "CONTADO", total: -811.20, ingreso: 0, egreso: 811.20, fecha: new Date('2023-04-30'), hora: new Date('2000-01-01T10:15:00') },
        { id: 2, motivo: "Ventas", detalle: "CONTADO / TARJETA Efectivo", total: 35.37, ingreso: 35.37, egreso: 0, fecha: new Date('2023-04-30'), hora: new Date('2000-01-01T11:30:00') }
      ]);
      setArticulosVendidos([
        { id: 1, codigo: "7551037600520", descripcion: "EVEREADY AA X UNIDAD", cantidad: 5, precio: 5.50, total: 27.50 },
        { id: 2, codigo: "3892095285", descripcion: "EVEREADY AAA X UNIDAD", cantidad: 3, precio: 7.00, total: 21.00 }
      ]);
      setEfectivoTotal(224.17);
      setEfectivoReal(224.17);
    }
    
    setSnackbar({
      open: true,
      message: `Caja de ${location} cargada`,
      severity: 'info'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <CajaHeader 
          estado={estado} 
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
        />

        <CajaCards
          numeroCaja={numeroCaja}
          fechaInicio={fechaInicio}
          fechaCierre={fechaCierre}
          horaInicio={horaInicio}
          horaCierre={horaCierre}
          efectivoTotal={efectivoTotal}
          efectivoReal={efectivoReal}
          diferencia={diferencia}
          estado={estado}
          loading={loading}
          handleCalcular={handleCalcular}
          handleAbrirCaja={handleAbrirCaja}
          handleCerrarCaja={handleCerrarCaja}
          handleAgregarMovimiento={handleAgregarMovimiento}
          handleArticulosVendidos={handleArticulosVendidos}
          setEfectivoReal={setEfectivoReal}
          formatCurrency={formatCurrency}
        />

        <MovimientosTable
          movimientos={movimientos} //@ts-ignore
          tableRef={tableRef}
          selectedMovimiento={selectedMovimiento}
          setSelectedMovimiento={setSelectedMovimiento}
          totalSum={totalSum}
          ingresoSum={ingresoSum}
          egresoSum={egresoSum}
          formatCurrency={formatCurrency}
          handleExportToExcel={handleExportToExcel}
          handleExportToPDF={handleExportToPDF}
        />

        <ActionButtons
          handleImprimir={handleImprimir}
          handleSalir={handleSalir}
          handleCalcular={handleCalcular}
        />
        
        {/* Diálogos */}
        <AbrirCajaDialog
          open={openAbrirCajaDialog}
          onClose={() => setOpenAbrirCajaDialog(false)}
          saldoInicial={saldoInicial}
          setSaldoInicial={setSaldoInicial}
          loading={loading}
          confirmarAperturaCaja={confirmarAperturaCaja}
        />
        
        <CerrarCajaDialog
          open={openCerrarCajaDialog}
          onClose={() => setOpenCerrarCajaDialog(false)}
          efectivoTotal={efectivoTotal}
          efectivoReal={efectivoReal}
          diferencia={diferencia}
          setEfectivoReal={setEfectivoReal}
          loading={loading}
          confirmarCierreCaja={confirmarCierreCaja}
          formatCurrency={formatCurrency}
        />
        
        <ArticulosDialog
          open={openArticulosDialog}
          onClose={() => setOpenArticulosDialog(false)}
          articulosVendidos={articulosVendidos}
          formatCurrency={formatCurrency}
          setSnackbar={setSnackbar}
          setOpenArticulosDialog={setOpenArticulosDialog}
        />
        
        <ExitDialog
          open={openExitDialog}
          onClose={() => setOpenExitDialog(false)}
          exitAction={exitAction}
        />
        
        <NuevoMovimientoDialog
          open={openNuevoMovimientoDialog}
          onClose={() => setOpenNuevoMovimientoDialog(false)}
          nuevoMovimiento={nuevoMovimiento}
          setNuevoMovimiento={setNuevoMovimiento}
          handleGuardarNuevoMovimiento={handleGuardarNuevoMovimiento}
        />
        
        {/* Snackbar */}
        <CajaSnackbar
          snackbar={snackbar}
          handleCloseSnackbar={handleCloseSnackbar}
        />
      </Paper>
    </Container>
  );
};

export default DetalleCaja;