// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Paper,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Chip,
  Tooltip,
  CircularProgress,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import {
  Print as PrintIcon,
  ExitToApp as ExitIcon,
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  ShoppingCart as ShoppingCartIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
  ReceiptLong as ReceiptLongIcon,
  PictureAsPdf as PdfIcon,
  SaveAlt as SaveAltIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  Storefront as StorefrontIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  PriceCheck as PriceCheckIcon,
} from '@mui/icons-material';
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

// Componente principal
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
  //@ts-ignore
  const [articulosVendidos, setArticulosVendidos] = useState<ArticuloVendido[]>([
    { id: 1, codigo: "7551037600520", descripcion: "EVEREADY AA X UNIDAD", cantidad: 5, precio: 5.50, total: 27.50 },
    { id: 2, codigo: "3892095285", descripcion: "EVEREADY AAA X UNIDAD", cantidad: 3, precio: 7.00, total: 21.00 },
    { id: 3, codigo: "7551037600182", descripcion: "EVEREADY C MEDIANA X UNO", cantidad: 2, precio: 12.00, total: 24.00 },
    { id: 4, codigo: "77985255158301", descripcion: "ESPUMA", cantidad: 1, precio: 17.00, total: 17.00 },
  ]);
  
  // Detalle adicional para el balance
  //@ts-ignore
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Detalle de Caja
          </Typography>
          
          <Chip 
            label={estado} 
            color={estado === "ABIERTO" ? "success" : "default"}
            icon={estado === "ABIERTO" ? <LockOpenIcon /> : <LockIcon />}
            sx={{ fontWeight: 'bold', px: 1 }}
          />
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Tarjeta de Caja Actual */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={4} 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                background: 'linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#006064' }}>
                    Caja Actual
                  </Typography>
                  <Chip 
                    label={`#${numeroCaja}`} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'medium' }}>
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {fechaInicio ? format(fechaInicio, 'dd/MM/yyyy') : 'No establecida'}
                    </Typography>
                    <Typography variant="body2">
                      {horaInicio ? format(horaInicio, 'HH:mm') : ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'medium' }}>
                      Fecha de Cierre
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {fechaCierre ? format(fechaCierre, 'dd/MM/yyyy') : 'No establecida'}
                    </Typography>
                    <Typography variant="body2">
                      {horaCierre ? format(horaCierre, 'HH:mm') : ''}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Button
                  variant="contained"
                  startIcon={<CalculateIcon />}
                  onClick={handleCalcular}
                  size="small"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    bgcolor: '#0097a7',
                    '&:hover': {
                      bgcolor: '#00838f'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Calcular Totales'
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Tarjeta de Saldo */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={4} 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                background: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
                  Saldo Actual
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon sx={{ color: '#43a047', fontSize: 40, mr: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {formatCurrency(efectivoTotal)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 'medium' }}>
                      Efectivo Real
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={efectivoReal}
                      onChange={(e) => setEfectivoReal(Number(e.target.value))}
                      disabled={estado === "CERRADO"}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 'medium' }}>
                      Diferencia
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formatCurrency(diferencia)}
                      InputProps={{
                        readOnly: true,
                        style: { 
                          color: diferencia < 0 ? '#d32f2f' : diferencia > 0 ? '#2e7d32' : 'inherit',
                          fontWeight: 'bold'
                        }
                      }}
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Tarjeta de Acciones Rápidas */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={4} 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                background: 'linear-gradient(120deg, #e3f2fd 0%, #bbdefb 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0d47a1', mb: 2 }}>
                  Acciones Rápidas
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      startIcon={<LockOpenIcon />}
                      onClick={handleAbrirCaja}
                      disabled={estado === "ABIERTO" || loading}
                      fullWidth
                      size="small"
                      sx={{ 
                        bgcolor: '#4caf50',
                        '&:hover': {
                          bgcolor: '#388e3c'
                        }
                      }}
                    >
                      Abrir Caja
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      startIcon={<LockIcon />}
                      onClick={handleCerrarCaja}
                      disabled={estado === "CERRADO" || loading}
                      fullWidth
                      size="small"
                      sx={{ 
                        bgcolor: '#f44336',
                        '&:hover': {
                          bgcolor: '#d32f2f'
                        }
                      }}
                    >
                      Cerrar Caja
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      onClick={handleAgregarMovimiento}
                      disabled={estado === "CERRADO" || loading}
                      fullWidth
                      size="small"
                      sx={{ 
                        mt: 1,
                        bgcolor: '#ff9800',
                        '&:hover': {
                          bgcolor: '#f57c00'
                        }
                      }}
                    >
                      Nuevo Movimiento
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleArticulosVendidos}
                      fullWidth
                      size="small"
                      sx={{ 
                        mt: 1,
                        bgcolor: '#9c27b0',
                        '&:hover': {
                          bgcolor: '#7b1fa2'
                        }
                      }}
                    >
                      Artículos Vendidos
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Movimientos Table */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Resumen de Movimientos
            </Typography>
            
            <Box>
              <Tooltip title="Exportar a Excel">
                <IconButton 
                  size="small" 
                  onClick={handleExportToExcel}
                  sx={{ mr: 1 }}
                >
                  <SaveAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar a PDF">
                <IconButton 
                  size="small" 
                  onClick={handleExportToPDF}
                  sx={{ mr: 1 }}
                >
                  <PdfIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <TableContainer 
            component={Paper} 
            variant="outlined" 
            ref={tableRef}
            sx={{ borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#1976d2' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Motivo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Detalle</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Ingreso</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Egreso</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimientos.map((mov) => (
                  <TableRow 
                    key={mov.id}
                    onClick={() => setSelectedMovimiento(mov.id)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedMovimiento === mov.id ? '#e3f2fd' : 'inherit',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <TableCell>{mov.motivo}</TableCell>
                    <TableCell>{mov.detalle}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: mov.total < 0 ? '#d32f2f' : mov.total > 0 ? '#2e7d32' : 'inherit',
                        fontWeight: 'medium'
                      }}
                    >
                      {formatCurrency(mov.total)}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: '#2e7d32',
                        fontWeight: mov.ingreso > 0 ? 'medium' : 'normal'
                      }}
                    >
                      {formatCurrency(mov.ingreso)}
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        color: '#d32f2f',
                        fontWeight: mov.egreso > 0 ? 'medium' : 'normal'
                      }}
                    >
                      {formatCurrency(mov.egreso)}
                    </TableCell>
                  </TableRow>
                ))}
                {movimientos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No hay movimientos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                    Totales:
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: totalSum < 0 ? '#d32f2f' : totalSum > 0 ? '#2e7d32' : 'inherit'
                    }}
                  >
                    {formatCurrency(totalSum)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {formatCurrency(ingresoSum)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {formatCurrency(egresoSum)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>

        {/* Bottom buttons with modern design */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handleImprimir}
              color="info"
              sx={{ 
                borderRadius: 2,
                boxShadow: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 2
              }}
            >
              Imprimir
            </Button>
            
            <Button
              variant="contained"
              startIcon={<ExitIcon />}
              onClick={handleSalir}
              color="warning"
              sx={{ 
                borderRadius: 2,
                boxShadow: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 2
              }}
            >
              Salir
            </Button>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
              Última actualización: {new Date().toLocaleTimeString()}
            </Typography>
            <Tooltip title="Actualizar">
              <IconButton size="small" color="primary" onClick={handleCalcular}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
      
      {/* Diálogos */}
      
      {/* Diálogo de Apertura de Caja */}
      <Dialog
        open={openAbrirCajaDialog}
        onClose={() => setOpenAbrirCajaDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Abrir Nueva Caja</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" gutterBottom>
              Se abrirá una nueva caja con la fecha y hora actuales.
            </Typography>
            
            <TextField
              label="Saldo Inicial"
              type="number"
              fullWidth
              margin="normal"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAbrirCajaDialog(false)}>Cancelar</Button>
          <Button 
            onClick={confirmarAperturaCaja} 
            variant="contained" 
            color="success"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LockOpenIcon />}
          >
            Abrir Caja
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de Cierre de Caja */}
      <Dialog
        open={openCerrarCajaDialog}
        onClose={() => setOpenCerrarCajaDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cerrar Caja Actual</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" gutterBottom>
              Por favor verifique los siguientes datos antes de cerrar la caja:
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  label="Saldo Calculado"
                  fullWidth
                  value={formatCurrency(efectivoTotal)}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Saldo Real"
                  fullWidth
                  type="number"
                  value={efectivoReal}
                  onChange={(e) => setEfectivoReal(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Diferencia"
                  fullWidth
                  value={formatCurrency(diferencia)}
                  InputProps={{ 
                    readOnly: true,
                    style: { 
                      color: diferencia < 0 ? '#d32f2f' : diferencia > 0 ? '#2e7d32' : 'inherit',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observaciones"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Ingrese observaciones sobre el cierre de caja..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCerrarCajaDialog(false)}>Cancelar</Button>
          <Button 
            onClick={confirmarCierreCaja} 
            variant="contained" 
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
          >
            Cerrar Caja
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de Artículos Vendidos */}
      <Dialog
        open={openArticulosDialog}
        onClose={() => setOpenArticulosDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Artículos Vendidos</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Código</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {articulosVendidos.map((articulo) => (
                    <TableRow key={articulo.id}>
                      <TableCell>{articulo.codigo}</TableCell>
                      <TableCell>{articulo.descripcion}</TableCell>
                      <TableCell align="right">{articulo.cantidad}</TableCell>
                      <TableCell align="right">{formatCurrency(articulo.precio)}</TableCell>
                      <TableCell align="right">{formatCurrency(articulo.total)}</TableCell>
                    </TableRow>
                  ))}
                  {articulosVendidos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        No hay artículos vendidos en esta caja
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                      Total Vendido:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(articulosVendidos.reduce((sum, art) => sum + art.total, 0))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenArticulosDialog(false)}>Cerrar</Button>
          <Button 
            variant="contained" 
            startIcon={<PrintIcon />}
            onClick={() => {
              // Lógica para imprimir artículos vendidos
              setOpenArticulosDialog(false);
              setSnackbar({
                open: true,
                message: 'Lista de artículos vendidos impresa correctamente',
                severity: 'success'
              });
            }}
          >
            Imprimir Lista
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para confirmar salida */}
      <Dialog
        open={openExitDialog}
        onClose={() => setOpenExitDialog(false)}
      >
        <DialogTitle>Confirmar salida</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La caja se encuentra abierta. ¿Está seguro que desea salir sin cerrarla?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitDialog(false)}>Cancelar</Button>
          <Button 
            onClick={() => {
              setOpenExitDialog(false);
              exitAction();
            }} 
            color="warning" 
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para nuevo movimiento */}
      <Dialog
        open={openNuevoMovimientoDialog}
        onClose={() => setOpenNuevoMovimientoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nuevo Movimiento de Caja</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select
                value={nuevoMovimiento.tipo}
                onChange={(e: SelectChangeEvent<'ingreso' | 'egreso'>) => 
                  setNuevoMovimiento({
                    ...nuevoMovimiento,
                    tipo: e.target.value as 'ingreso' | 'egreso'
                  })
                }
                label="Tipo de Movimiento"
              >
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Egreso</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Motivo"
              fullWidth
              margin="normal"
              value={nuevoMovimiento.motivo}
              onChange={(e) => 
                setNuevoMovimiento({
                  ...nuevoMovimiento,
                  motivo: e.target.value
                })
              }
              required
            />
            
            <TextField
              label="Detalle"
              fullWidth
              margin="normal"
              value={nuevoMovimiento.detalle}
              onChange={(e) => 
                setNuevoMovimiento({
                  ...nuevoMovimiento,
                  detalle: e.target.value
                })
              }
              required
            />
            
            <TextField
              label="Monto"
              type="number"
              fullWidth
              margin="normal"
              value={nuevoMovimiento.monto}
              onChange={(e) => 
                setNuevoMovimiento({
                  ...nuevoMovimiento,
                  monto: Number(e.target.value)
                })
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNuevoMovimientoDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleGuardarNuevoMovimiento} 
            variant="contained" 
            color={nuevoMovimiento.tipo === 'ingreso' ? 'success' : 'error'}
            startIcon={nuevoMovimiento.tipo === 'ingreso' ? <AddCircleIcon /> : <RemoveCircleIcon />}
          >
            {nuevoMovimiento.tipo === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Egreso'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DetalleCaja;