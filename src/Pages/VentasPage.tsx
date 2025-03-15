import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  SelectChangeEvent,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Tooltip,
  Badge,
  Fade,
  CircularProgress,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Grow,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  ExitToApp as ExitIcon,
  AddCircle as AddCircleIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as AttachMoneyIcon,
  LocalOffer as LocalOfferIcon,
  Undo as UndoIcon,
  ReceiptLong as ReceiptIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Build as BuildIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptTypeIcon,
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
  List as ListIcon,
  FilterList as FilterListIcon,
  MoneyOff as DiscountIcon,
  Calculate as CalculateIcon,
  PointOfSale as POSIcon,
  Check as CheckIcon,
  PriceCheck as PriceCheckIcon,
  Inventory as InventoryIcon,
  AddShoppingCart as AddShoppingCartIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
// Interfaces
interface SaleItem {
  id: number;
  code: string;
  quantity: number;
  detail: string;
  price: number;
  tax: number;
  discount: number;
  total: number;
  selected: boolean;
}

interface Cliente {
  id: number;
  nombre: string;
  domicilio: string;
  tipo: string;
  cuit: string;
}

// Datos simulados
const clientes: Cliente[] = [
  { id: 1, nombre: 'CONSUMIDOR FINAL', domicilio: '', tipo: 'CF', cuit: '' },
  { id: 2, nombre: 'JUAN PEREZ', domicilio: 'Av. Rivadavia 1234', tipo: 'A', cuit: '20-12345678-9' },
  { id: 3, nombre: 'COMERCIO SRL', domicilio: 'Corrientes 4321', tipo: 'B', cuit: '30-98765432-1' },
];

const productos = [
  { codigo: '7551037600520', detalle: 'EVEREADY AA X UNIDAD', precio: 5.50, tax: 21 },
  { codigo: '3892095285', detalle: 'EVEREADY AAA X UNIDAD', precio: 7.00, tax: 21 },
  { codigo: '7551037600182', detalle: 'EVEREADY C MEDIANA X UNO', precio: 12.00, tax: 21 },
  { codigo: '7551037600018', detalle: 'EVEREADY D GRANDE X UNO', precio: 16.00, tax: 21 },
  { codigo: '77985255158301', detalle: 'ESPUMA', precio: 17.00, tax: 21 },
  { codigo: '77959472050014', detalle: 'ESPUMA ARTIFICIAL', precio: 9.50, tax: 21 },
];

const vendedores = [
  'USUARIO, USUARIO',
  'ADMIN',
  'VENDEDOR 1',
  'VENDEDOR 2'
];

const VentasPage: React.FC = () => {
  const theme = useTheme();
  const tableRef = useRef<HTMLDivElement>(null);
  const codigoBarrasRef = useRef<HTMLInputElement>(null);

  // Estados básicos
  const [cliente, setCliente] = useState('CONSUMIDOR FINAL');
  const [tipoPago, setTipoPago] = useState('CONTADO');
  const [tipoComprobante, setTipoComprobante] = useState('REMITO X');
  const [vendedor, setVendedor] = useState('USUARIO, USUARIO');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [numeroVenta, setNumeroVenta] = useState('0000000000037');
  const [calcularVuelto, setCalcularVuelto] = useState(true);
  const [lista, setLista] = useState('LISTA 1');
  const [alicuotaIVA, setAlicuotaIVA] = useState(21);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [montoRecibido, setMontoRecibido] = useState(0);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Estado para los ítems de venta
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<SaleItem>({
    id: 0,
    code: '',
    quantity: 1,
    detail: '',
    price: 0,
    tax: 0,
    discount: 0,
    total: 0,
    selected: false
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // Estados para diálogos
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openClienteDialog, setOpenClienteDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [openVueltoDialog, setOpenVueltoDialog] = useState(false);
  const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
  const [openChangePriceDialog, setOpenChangePriceDialog] = useState(false);
  const [openDevolutionDialog, setOpenDevolutionDialog] = useState(false);
  const [openAddVariosDialog, setOpenAddVariosDialog] = useState(false);
  const [openExportMenuDialog, setOpenExportMenuDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Calcular totales
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const iva = subtotal * (alicuotaIVA / 100);
  const descuento = subtotal * (descuentoPorcentaje / 100);
  const total = subtotal + iva - descuento;
  const vuelto = montoRecibido - total > 0 ? montoRecibido - total : 0;

  // Estadísticas de venta
  const itemCount = items.length;
  const itemQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Efecto para calcular total de cada ítem cuando cambia
  useEffect(() => {
    // Recalcular totales si cambia alicuotaIVA o descuentoPorcentaje
  }, [alicuotaIVA, descuentoPorcentaje]);

  // Efecto para enfocar campo de código de barras
  useEffect(() => {
    if (codigoBarrasRef.current) {
      codigoBarrasRef.current.focus();
    }
  }, [items.length]);

  // Manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && !e.repeat) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'F4' && !e.repeat) {
        e.preventDefault();
        handleAddItem();
      } else if (e.key === 'F5' && !e.repeat) {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Delete' && !e.repeat) {
        e.preventDefault();
        handleDeleteItem();
      } else if (e.key === 'F8' && !e.repeat) {
        e.preventDefault();
        handlePrint();
      } else if (e.key === 'Escape' && !e.repeat) {
        e.preventDefault();
        handleExit();
      } else if (e.key === 'F3' && !e.repeat) {
        e.preventDefault();
        handleAddPromocion();
      } else if (e.key === 'F9' && !e.repeat) {
        e.preventDefault();
        handleChangePrecio();
      } else if (e.key === 'F10' && !e.repeat) {
        e.preventDefault();
        handleAddVarios();
      } else if (e.key === 'Enter' && document.activeElement === codigoBarrasRef.current) {
        e.preventDefault();
        handleSearchByBarcode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, selectedItem, cliente, tipoPago, tipoComprobante]);

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

  // Búsqueda por código de barras
  const handleSearchByBarcode = () => {
    if (!codigoBarras) return;

    setLoading(true);

    // Simulación de búsqueda con un pequeño retraso
    setTimeout(() => {
      const producto = productos.find(p => p.codigo === codigoBarras);

      if (producto) {
        const newItem: SaleItem = {
          id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
          code: producto.codigo,
          quantity: 1,
          detail: producto.detalle,
          price: producto.precio,
          tax: producto.tax,
          discount: 0,
          total: producto.precio,
          selected: false
        };

        setItems([...items, newItem]);
        setCodigoBarras('');

        setSnackbar({
          open: true,
          message: 'Producto agregado correctamente',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Producto no encontrado',
          severity: 'warning'
        });
      }

      setLoading(false);
    }, 300);
  };

  // Manejar selección de ítem
  const handleSelectItem = (index: number) => {
    setSelectedItem(index);
  };

  // Manejadores para cambios en los ítems
  const handleItemChange = (field: keyof SaleItem, value: any) => {
    let updatedItem = { ...currentItem, [field]: value };

    // Si se cambia el código, buscar el producto
    if (field === 'code' && value) {
      const producto = productos.find(p => p.codigo === value);
      if (producto) {
        updatedItem = {
          ...updatedItem,
          detail: producto.detalle,
          price: producto.precio,
          tax: producto.tax
        };
      }
    }

    // Recalcular el total del ítem
    if (field === 'quantity' || field === 'price' || field === 'discount') {
      const discountAmount = updatedItem.price * (updatedItem.discount / 100);
      updatedItem.total = updatedItem.quantity * (updatedItem.price - discountAmount);
    }

    setCurrentItem(updatedItem);
  };

  // Guardar ítem en diálogo
  const handleSaveItem = () => {
    if (!currentItem.code || !currentItem.detail || currentItem.quantity <= 0) {
      setSnackbar({
        open: true,
        message: 'Debe completar los campos requeridos',
        severity: 'error'
      });
      return;
    }

    // Recalcular total antes de guardar
    const discountAmount = currentItem.price * (currentItem.discount / 100);
    const itemTotal = currentItem.quantity * (currentItem.price - discountAmount);

    setLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      if (editingItemId !== null) {
        // Actualizar ítem existente
        setItems(items.map(item =>
          item.id === editingItemId
            ? { ...currentItem, total: itemTotal }
            : item
        ));
      } else {
        // Agregar nuevo ítem
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems([...items, { ...currentItem, id: newId, total: itemTotal }]);
      }

      setOpenItemDialog(false);
      setEditingItemId(null);
      setCurrentItem({
        id: 0,
        code: '',
        quantity: 1,
        detail: '',
        price: 0,
        tax: 0,
        discount: 0,
        total: 0,
        selected: false
      });

      // Enfocar el campo de código de barras
      setTimeout(() => {
        if (codigoBarrasRef.current) {
          codigoBarrasRef.current.focus();
        }
      }, 100);

      setLoading(false);
    }, 400);
  };

  // Funciones principales

  const handleAddItem = () => {
    setCurrentItem({
      id: 0,
      code: '',
      quantity: 1,
      detail: '',
      price: 0,
      tax: alicuotaIVA,
      discount: 0,
      total: 0,
      selected: false
    });
    setEditingItemId(null);
    setOpenItemDialog(true);
  };

  const handleDeleteItem = () => {
    if (selectedItem !== null) {
      setLoading(true);

      setTimeout(() => {
        setItems(items.filter((_, index) => index !== selectedItem));
        setSelectedItem(null);

        setSnackbar({
          open: true,
          message: 'Ítem eliminado correctamente',
          severity: 'success'
        });

        setLoading(false);
      }, 300);
    } else {
      setSnackbar({
        open: true,
        message: 'Debe seleccionar un ítem para eliminar',
        severity: 'warning'
      });
    }
  };

  const handleSave = () => {
    if (items.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay ítems para guardar',
        severity: 'warning'
      });
      return;
    }

    // Calcular vuelto si está activada la opción
    if (calcularVuelto) {
      setOpenVueltoDialog(true);
    } else {
      finalizarVenta();
    }
  };

  const finalizarVenta = () => {
    setLoading(true);

    // Simulación de procesamiento
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: 'Venta guardada con éxito',
        severity: 'success'
      });

      // Limpiar el formulario después de guardar
      clearForm();

      setLoading(false);
    }, 800);
  };

  const clearForm = () => {
    setItems([]);
    setSelectedItem(null);
    setNumeroVenta(generateNextInvoiceNumber());
    setCodigoBarras('');
    setMontoRecibido(0);
    setDescuentoPorcentaje(0);
  };

  const generateNextInvoiceNumber = () => {
    // Simular generación de número secuencial
    const currentNumber = parseInt(numeroVenta, 10);
    return String(currentNumber + 1).padStart(13, '0');
  };

  const handleCancel = () => {
    if (items.length > 0) {
      setOpenCancelDialog(true);
    } else {
      clearForm();
    }
  };

  const handlePrint = () => {
    if (items.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay ítems para imprimir',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);

    // Simulación de impresión
    setTimeout(() => {
      // Crear contenido para imprimir
      const printContent = document.createElement('div');

      // Estilos para la impresión
      printContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
          h2 { font-size: 14px; margin-top: 15px; margin-bottom: 5px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          th, td { border: 1px solid #000; padding: 5px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .fecha { font-size: 12px; margin-bottom: 15px; }
          .info-block { margin-bottom: 15px; }
          .info-row { display: flex; margin-bottom: 5px; }
          .info-label { font-weight: bold; width: 150px; }
          .totales { margin-top: 20px; }
          .total-final { font-size: 18px; font-weight: bold; text-align: right; margin-top: 10px; }
          @media print {
            body * { visibility: hidden; }
            #print-content, #print-content * { visibility: visible; }
            #print-content { position: absolute; left: 0; top: 0; width: 100%; }
          }
        </style>
        <div id="print-content">
          <h1>${tipoComprobante}</h1>
          <div class="fecha">Fecha: ${fecha ? fecha.toLocaleDateString() : 'N/A'} - N° ${numeroVenta}</div>
          
          <div class="info-block">
            <div class="info-row">
              <div class="info-label">Cliente:</div>
              <div>${cliente}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Vendedor:</div>
              <div>${vendedor}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Forma de Pago:</div>
              <div>${tipoPago}</div>
            </div>
          </div>
          
          <h2>Detalle de Ítems</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Detalle</th>
                <th>Precio</th>
                <th>IVA %</th>
                <th>Dto. %</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.code}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td>${item.detail}</td>
                  <td class="text-right">${formatCurrency(item.price)}</td>
                  <td class="text-right">${item.tax}%</td>
                  <td class="text-right">${item.discount}%</td>
                  <td class="text-right">${formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totales">
            <div class="info-row">
              <div class="info-label">Subtotal:</div>
              <div class="text-right">${formatCurrency(subtotal)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">IVA (${alicuotaIVA}%):</div>
              <div class="text-right">${formatCurrency(iva)}</div>
            </div>
            ${descuentoPorcentaje > 0 ? `
              <div class="info-row">
                <div class="info-label">Descuento (${descuentoPorcentaje}%):</div>
                <div class="text-right">${formatCurrency(descuento)}</div>
              </div>
            ` : ''}
            <div class="total-final">
              Total: ${formatCurrency(total)}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(printContent);

      // Imprimir y eliminar el elemento temporal
      window.print();
      document.body.removeChild(printContent);

      setLoading(false);
    }, 800);
  };

  // Exportar a PDF
  const handleExportToPDF = () => {
    if (items.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay ítems para exportar',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);

    // Simulación de exportación a PDF
    setTimeout(() => {
      // Similar al contenido de impresión pero con ajustes para PDF
      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = `<style>/* Estilos similares a la impresión */</style>`;

      // Abrir en nueva ventana para imprimir como PDF
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        setSnackbar({
          open: true,
          message: 'Error al abrir ventana de impresión. Verifique su bloqueador de ventanas emergentes.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      printWindow.document.write('<html><head><title>Comprobante de Venta</title>');
      printWindow.document.write('<style>/* Estilos para PDF */</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`
        <h1>${tipoComprobante}</h1>
        <div>Fecha: ${fecha ? fecha.toLocaleDateString() : 'N/A'} - N° ${numeroVenta}</div>
        <div>Cliente: ${cliente}</div>
        <div>Vendedor: ${vendedor}</div>
        <div>Forma de Pago: ${tipoPago}</div>
        
        <h2>Detalle de Ítems</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <tr>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Detalle</th>
            <th>Precio</th>
            <th>IVA %</th>
            <th>Dto. %</th>
            <th>Total</th>
          </tr>
          ${items.map(item => `
            <tr>
              <td>${item.code}</td>
              <td style="text-align: right;">${item.quantity}</td>
              <td>${item.detail}</td>
              <td style="text-align: right;">${formatCurrency(item.price)}</td>
              <td style="text-align: right;">${item.tax}%</td>
              <td style="text-align: right;">${item.discount}%</td>
              <td style="text-align: right;">${formatCurrency(item.total)}</td>
            </tr>
          `).join('')}
        </table>
        
        <div style="margin-top: 20px;">
          <div>Subtotal: ${formatCurrency(subtotal)}</div>
          <div>IVA (${alicuotaIVA}%): ${formatCurrency(iva)}</div>
          ${descuentoPorcentaje > 0 ? `<div>Descuento (${descuentoPorcentaje}%): ${formatCurrency(descuento)}</div>` : ''}
          <div style="font-weight: bold; font-size: 16px; margin-top: 10px;">Total: ${formatCurrency(total)}</div>
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

        setLoading(false);
      }, 500);
    }, 800);
  };

  // Exportar a Excel (CSV)
  const handleExportToExcel = () => {
    if (items.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay ítems para exportar',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);

    // Simulación de exportación a Excel
    setTimeout(() => {
      // Crear encabezados para el CSV
      const headers = ['Código', 'Cantidad', 'Detalle', 'Precio', 'IVA %', 'Descuento %', 'Total'];
      let csvContent = headers.join(',') + '\n';

      // Añadir los datos de los ítems
      items.forEach(item => {
        // Escapar campos que puedan contener comas
        const detalle = `"${item.detail.replace(/"/g, '""')}"`;

        const row = [
          item.code,
          item.quantity,
          detalle,
          item.price.toFixed(2),
          item.tax.toFixed(2),
          item.discount.toFixed(2),
          item.total.toFixed(2)
        ].join(',');

        csvContent += row + '\n';
      });

      // Añadir información de totales
      csvContent += '\n';
      csvContent += `"Subtotal",,,,,,${subtotal.toFixed(2)}\n`;
      csvContent += `"IVA (${alicuotaIVA}%)",,,,,,${iva.toFixed(2)}\n`;
      if (descuentoPorcentaje > 0) {
        csvContent += `"Descuento (${descuentoPorcentaje}%)",,,,,,${descuento.toFixed(2)}\n`;
      }
      csvContent += `"TOTAL",,,,,,${total.toFixed(2)}\n`;

      // Crear un blob y un enlace de descarga
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Configurar el enlace y simular clic
      const dateStr = fecha ? fecha.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `Comprobante_Venta_${dateStr}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({
        open: true,
        message: 'Archivo CSV generado correctamente',
        severity: 'success'
      });

      setLoading(false);
    }, 800);
  };

  const handleExit = () => {
    if (items.length > 0) {
      setOpenExitDialog(true);
    } else {
      // Aquí normalmente redirigirías o cerrarías el componente
      setSnackbar({
        open: true,
        message: 'Saliendo del módulo de ventas',
        severity: 'info'
      });
    }
  };

  // Funciones adicionales
  const handleClienteSearch = () => {
    setOpenClienteDialog(true);
  };

  const handleSelectCliente = (clienteSeleccionado: Cliente) => {
    setCliente(clienteSeleccionado.nombre);
    setOpenClienteDialog(false);
  };

  const handleAddDevolucion = () => {
    setOpenDevolutionDialog(true);
  };

  const handleAddPromocion = () => {
    setOpenPromotionDialog(true);
  };

  const handleChangePrecio = () => {
    if (selectedItem === null) {
      setSnackbar({
        open: true,
        message: 'Debe seleccionar un ítem para cambiar el precio',
        severity: 'warning'
      });
      return;
    }

    const itemToEdit = items[selectedItem];
    setCurrentItem(itemToEdit);
    setOpenChangePriceDialog(true);
  };

  const handleAddVarios = () => {
    setOpenAddVariosDialog(true);
  };

  const handleVueltoConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (montoRecibido < total) {
      setSnackbar({
        open: true,
        message: 'El monto recibido es menor que el total',
        severity: 'error'
      });
      return;
    }

    setOpenVueltoDialog(false);
    finalizarVenta();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Cerrar dialogs y snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ maxWidth: 'xl', py: 3 }}>
      {/* Encabezado con título y estadísticas */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <POSIcon sx={{ mr: 1 }} />
            Punto de Venta
          </Typography>

          <Chip
            label={`Venta #${numeroVenta}`}
            color="primary"
            sx={{ fontWeight: 'bold', px: 1 }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Ítems
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {itemCount}
                    </Typography>
                  </Box>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Unidades
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {itemQuantity}
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Subtotal
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {formatCurrency(subtotal)}
                    </Typography>
                  </Box>
                  <ReceiptIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="white" variant="body2">
                      Total a Pagar
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {formatCurrency(total)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs de navegación */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              py: 1,
              px: 3,
              minHeight: 48
            },
            '& .Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }
          }}
        >
          <Tab
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            label="Venta Actual"
          />
          <Tab
            icon={<PersonIcon />}
            iconPosition="start"
            label="Datos Cliente"
          />
          <Tab
            icon={<CalculateIcon />}
            iconPosition="start"
            label="Totales"
          />
        </Tabs>
      </Box>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        {/* Tab de Venta Actual */}
        <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Sección de búsqueda por código de barras */}
            <Grid item xs={12} md={8}>
              <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ mr: 1 }} />
                  Agregar Producto
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <TextField
                    label="Código de Barras"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputRef={codigoBarrasRef}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchByBarcode();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: loading && (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      )
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleSearchByBarcode}
                    disabled={loading || !codigoBarras}
                    sx={{ minWidth: 120 }}
                  >
                    Buscar
                  </Button>

                  <Tooltip title="Agregar Ítem [F4]">
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddIcon />}
                      onClick={handleAddItem}
                      sx={{ minWidth: 120 }}
                    >
                      Agregar
                    </Button>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Tooltip title="Agregar Devolución">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AssignmentReturnIcon />}
                      onClick={handleAddDevolucion}
                    >
                      Devolución
                    </Button>
                  </Tooltip>

                  <Tooltip title="Agregar Promoción [F3]">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LocalOfferIcon />}
                      onClick={handleAddPromocion}
                    >
                      Promoción
                    </Button>
                  </Tooltip>

                  <Tooltip title="Cambiar Precio [F9]">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PriceCheckIcon />}
                      onClick={handleChangePrecio}
                      disabled={selectedItem === null}
                    >
                      Cambiar Precio
                    </Button>
                  </Tooltip>

                  <Tooltip title="Agregar Varios [F10]">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={handleAddVarios}
                    >
                      Agregar Varios
                    </Button>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>

            {/* Sección de información de venta */}
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Cliente:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" fontWeight="medium">
                        {cliente}
                      </Typography>
                    </Grid>

                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Pago:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={tipoPago}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReceiptTypeIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Tipo:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={tipoComprobante}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Fecha:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {fecha ? fecha.toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabla de Ítems */}
          <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, overflow: 'hidden' }}>
            <CardHeader
              title={
                <Typography variant="subtitle1" fontWeight="bold">
                  Detalle de Productos ({items.length})
                </Typography>
              }
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Eliminar Seleccionado [Delete]">
                    <IconButton
                      color="error"
                      onClick={handleDeleteItem}
                      disabled={selectedItem === null || loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exportar">
                    <IconButton
                      color="primary"
                      onClick={() => setOpenExportMenuDialog(true)}
                      disabled={items.length === 0 || loading}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                py: 1
              }}
            />

            <TableContainer ref={tableRef} sx={{ maxHeight: 350 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={20}></TableCell>
                    <TableCell width={120} sx={{ fontWeight: 'bold' }}>Código</TableCell>
                    <TableCell width={80} align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Detalle</TableCell>
                    <TableCell width={100} align="right" sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                    <TableCell width={80} align="right" sx={{ fontWeight: 'bold' }}>IVA</TableCell>
                    <TableCell width={80} align="right" sx={{ fontWeight: 'bold' }}>Dto.</TableCell>
                    <TableCell width={100} align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={item.id}
                      selected={selectedItem === index}
                      onClick={() => handleSelectItem(index)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedItem === index ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          setCurrentItem(item);
                          setEditingItemId(item.id);
                          setOpenItemDialog(true);
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{item.code}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.quantity}
                          size="small"
                          color="primary"
                          sx={{ minWidth: 40 }}
                        />
                      </TableCell>
                      <TableCell>{item.detail}</TableCell>
                      <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                      <TableCell align="right">{item.tax}%</TableCell>
                      <TableCell align="right">
                        {item.discount > 0 && (
                          <Chip
                            label={`${item.discount}%`}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ minWidth: 40 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <ShoppingCartIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                          <Typography variant="body1" color="textSecondary">
                            No hay productos agregados a la venta
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={handleAddItem}
                            sx={{ mt: 1 }}
                          >
                            Agregar Producto
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Botones de Acción */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  Cancelar [F5]
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  disabled={items.length === 0 || loading}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar [F2]'}
                </Button>

                <Button
                  variant="contained"
                  color="info"
                  onClick={handlePrint}
                  startIcon={<PrintIcon />}
                  disabled={items.length === 0 || loading}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  Imprimir [F8]
                </Button>

                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleExit}
                  startIcon={<ExitIcon />}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  Salir [Esc]
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'black',
                  color: 'cyan',
                  borderRadius: 2,
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: 3
                }}
              >
                <Typography variant="body2">Total</Typography>
                <Typography variant="h4" sx={{ color: 'cyan', fontWeight: 'bold' }}>
                  {formatCurrency(total)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Tab de Datos Cliente */}
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
            <CardHeader
              title={
                <Typography variant="subtitle1" fontWeight="bold">
                  Información del Cliente
                </Typography>
              }
              action={
                <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  onClick={handleClienteSearch}
                  size="small"
                >
                  Buscar Cliente
                </Button>
              }
              sx={{
                backgroundColor: '#f5f5f5',
                py: 1
              }}
            />

            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre del Cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de Comprobante</InputLabel>
                    <Select
                      value={tipoComprobante}
                      onChange={(e: SelectChangeEvent) => setTipoComprobante(e.target.value as string)}
                      label="Tipo de Comprobante"
                      startAdornment={
                        <InputAdornment position="start">
                          <ReceiptTypeIcon fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="REMITO X">REMITO X</MenuItem>
                      <MenuItem value="FACTURA A">FACTURA A</MenuItem>
                      <MenuItem value="FACTURA B">FACTURA B</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Vendedor</InputLabel>
                    <Select
                      value={vendedor}
                      onChange={(e: SelectChangeEvent) => setVendedor(e.target.value as string)}
                      label="Vendedor"
                      startAdornment={
                        <InputAdornment position="start">
                          <StoreIcon fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      {vendedores.map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de Pago</InputLabel>
                    <Select
                      value={tipoPago}
                      onChange={(e: SelectChangeEvent) => setTipoPago(e.target.value as string)}
                      label="Tipo de Pago"
                      startAdornment={
                        <InputAdornment position="start">
                          <PaymentIcon fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="CONTADO">CONTADO</MenuItem>
                      <MenuItem value="CREDITO">CRÉDITO</MenuItem>
                      <MenuItem value="DEBITO">DÉBITO</MenuItem>
                      <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha de Venta"
                      value={fecha}
                      onChange={(newValue) => setFecha(newValue)}
                      format="EEEE, d 'de' MMMM 'de' yyyy"
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="N° de Venta"
                    value={numeroVenta}
                    onChange={(e) => setNumeroVenta(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Lista de Precios</InputLabel>
                    <Select
                      value={lista}
                      onChange={(e: SelectChangeEvent) => setLista(e.target.value as string)}
                      label="Lista de Precios"
                      startAdornment={
                        <InputAdornment position="start">
                          <ListIcon fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="LISTA 1">LISTA 1</MenuItem>
                      <MenuItem value="LISTA 2">LISTA 2</MenuItem>
                      <MenuItem value="LISTA 3">LISTA 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={calcularVuelto}
                        onChange={(e) => setCalcularVuelto(e.target.checked)}
                        size="small"
                      />
                      <Typography variant="body2">Calcular Vuelto al Finalizar</Typography>
                    </Box>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setActiveTab(0)}
              startIcon={<ArrowBackIcon />}
            >
              Volver a Venta
            </Button>

            <Button
              variant="contained"
              onClick={() => setActiveTab(2)}
              endIcon={<CalculateIcon />}
              color="primary"
            >
              Ir a Totales
            </Button>
          </Box>
        </Box>

        {/* Tab de Totales */}
        <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              mb: 3,
              background: 'linear-gradient(120deg, #fafafa 0%, #f5f5f5 100%)',
            }}
          >
            <CardHeader
              title={
                <Typography variant="subtitle1" fontWeight="bold">
                  Resumen de Totales
                </Typography>
              }
              sx={{
                backgroundColor: '#f5f5f5',
                py: 1
              }}
            />

            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <ReceiptIcon sx={{ mr: 1, fontSize: 20 }} />
                      Detalle de Venta
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography color="text.secondary" variant="body2">
                          Cantidad de Ítems:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold" textAlign="right">
                          {itemCount}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography color="text.secondary" variant="body2">
                          Total Unidades:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold" textAlign="right">
                          {itemQuantity}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography color="text.secondary" variant="body2">
                          Subtotal:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold" textAlign="right">
                          {formatCurrency(subtotal)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography color="text.secondary" variant="body2">
                          IVA ({alicuotaIVA}%):
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold" textAlign="right">
                          {formatCurrency(iva)}
                        </Typography>
                      </Grid>

                      {descuentoPorcentaje > 0 && (
                        <>
                          <Grid item xs={6}>
                            <Typography color="text.secondary" variant="body2">
                              Descuento ({descuentoPorcentaje}%):
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="bold" textAlign="right" color="error.main">
                              -{formatCurrency(descuento)}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography color="primary" variant="subtitle2">
                          TOTAL:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="right" color="primary.main">
                          {formatCurrency(total)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <CalculateIcon sx={{ mr: 1, fontSize: 20 }} />
                      Configuración de Totales
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Alícuota IVA</InputLabel>
                          <Select
                            value={alicuotaIVA}
                            onChange={(e) => setAlicuotaIVA(Number(e.target.value))}
                            label="Alícuota IVA"
                          >
                            <MenuItem value={0}>0%</MenuItem>
                            <MenuItem value={10.5}>10.5%</MenuItem>
                            <MenuItem value={21}>21%</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Porcentaje de Descuento"
                          type="number"
                          fullWidth
                          size="small"
                          value={descuentoPorcentaje}
                          onChange={(e) => setDescuentoPorcentaje(Number(e.target.value))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DiscountIcon fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Monto Recibido"
                          type="number"
                          fullWidth
                          size="small"
                          value={montoRecibido}
                          onChange={(e) => setMontoRecibido(Number(e.target.value))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoneyIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Vuelto a Entregar"
                          fullWidth
                          size="small"
                          value={formatCurrency(vuelto)}
                          InputProps={{
                            readOnly: true,
                            style: {
                              fontWeight: 'bold',
                              color: vuelto > 0 ? theme.palette.success.main : 'inherit'
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoneyIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setActiveTab(1)}
              startIcon={<ArrowBackIcon />}
            >
              Volver a Datos Cliente
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              color="success"
              disabled={items.length === 0 || loading}
            >
              Finalizar Venta
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Botón flotante principal */}
      <Zoom in={activeTab === 0}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
          }}
        >
          <Tooltip title="Agregar Producto [F4]">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              sx={{
                borderRadius: '50%',
                width: 64,
                height: 64,
                boxShadow: 4,
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </Button>
          </Tooltip>
        </Box>
      </Zoom>

      {/* Diálogos */}

      {/* Diálogo para agregar o editar ítem */}
      <Dialog
        open={openItemDialog}
        onClose={() => setOpenItemDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {editingItemId !== null ? (
              <>
                <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
                Editar Ítem
              </>
            ) : (
              <>
                <AddIcon sx={{ mr: 1, color: 'success.main' }} />
                Agregar Ítem
              </>
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Código"
                  size="small"
                  fullWidth
                  value={currentItem.code}
                  onChange={(e) => handleItemChange('code', e.target.value)}
                  required
                  error={!currentItem.code}
                  helperText={!currentItem.code ? "Campo requerido" : ""}
                  sx={{ flex: 1 }}
                />
                <IconButton onClick={() => {
                  // Aquí podría abrir un diálogo de búsqueda de productos
                }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detalle"
                size="small"
                fullWidth
                value={currentItem.detail}
                onChange={(e) => handleItemChange('detail', e.target.value)}
                required
                error={!currentItem.detail}
                helperText={!currentItem.detail ? "Campo requerido" : ""}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Cantidad"
                size="small"
                fullWidth
                type="number"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', parseFloat(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0 } }}
                required
                error={currentItem.quantity <= 0}
                helperText={currentItem.quantity <= 0 ? "Mayor a 0" : ""}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Precio"
                size="small"
                fullWidth
                type="number"
                value={currentItem.price}
                onChange={(e) => handleItemChange('price', parseFloat(e.target.value) || 0)}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
                error={currentItem.price <= 0}
                helperText={currentItem.price <= 0 ? "Mayor a 0" : ""}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="% Descuento"
                size="small"
                fullWidth
                type="number"
                value={currentItem.discount}
                onChange={(e) => handleItemChange('discount', parseFloat(e.target.value) || 0)}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="% IVA"
                size="small"
                fullWidth
                type="number"
                value={currentItem.tax}
                onChange={(e) => handleItemChange('tax', parseFloat(e.target.value) || 0)}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Total"
                size="small"
                fullWidth
                value={formatCurrency((currentItem.price * currentItem.quantity * (1 - currentItem.discount / 100)))}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ fontWeight: 'bold' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            color="primary"
            disabled={!currentItem.code || !currentItem.detail || currentItem.quantity <= 0 || currentItem.price <= 0 || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {editingItemId !== null ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para buscar cliente */}
      <Dialog
        open={openClienteDialog}
        onClose={() => setOpenClienteDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            Seleccionar Cliente
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Buscar cliente..."
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': { backgroundColor: '#f5f5f5', fontWeight: 'bold' } }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>CUIT</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={() => handleSelectCliente(c)}
                  >
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.cuit}</TableCell>
                    <TableCell>
                      <Chip
                        label={c.tipo}
                        size="small"
                        color={c.tipo === 'A' ? 'primary' : c.tipo === 'B' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCliente(c);
                        }}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClienteDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar cancelación */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
          <CancelIcon sx={{ mr: 1 }} />
          Confirmar Cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de cancelar la venta? Se perderán todos los datos ingresados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No</Button>
          <Button
            onClick={() => {
              clearForm();
              setOpenCancelDialog(false);
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar salida */}
      <Dialog
        open={openExitDialog}
        onClose={() => setOpenExitDialog(false)}
      >
        <DialogTitle sx={{ color: 'warning.main', display: 'flex', alignItems: 'center' }}>
          <ExitIcon sx={{ mr: 1 }} />
          Confirmar Salida
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hay datos sin guardar. ¿Está seguro que desea salir? Se perderán todos los cambios.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitDialog(false)}>No</Button>
          <Button
            onClick={() => {
              // Aquí redirigirías o cerrarías el componente
              setOpenExitDialog(false);
              setSnackbar({
                open: true,
                message: 'Saliendo del módulo de ventas',
                severity: 'info'
              });
            }}
            color="warning"
            variant="contained"
            autoFocus
          >
            Sí, salir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de vuelto */}
      <Dialog
        open={openVueltoDialog}
        onClose={() => setOpenVueltoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleVueltoConfirm}>
          <DialogTitle sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <CalculateIcon sx={{ mr: 1 }} />
            Calcular Vuelto
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Total a Pagar: {formatCurrency(total)}
              </Typography>

              <TextField
                label="Monto Recibido"
                type="number"
                fullWidth
                value={montoRecibido}
                onChange={(e) => setMontoRecibido(parseFloat(e.target.value) || 0)}
                margin="normal"
                autoFocus
                required
                error={montoRecibido < total}
                helperText={montoRecibido < total ? "El monto debe ser mayor o igual al total" : ""}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />

              <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="subtitle1" color="success.dark">
                  Vuelto a entregar:
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, color: 'success.dark', fontWeight: 'bold' }}>
                  {formatCurrency(vuelto)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenVueltoDialog(false)}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={montoRecibido < total || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
            >
              Confirmar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Diálogo de promoción */}
      <Dialog
        open={openPromotionDialog}
        onClose={() => setOpenPromotionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'secondary.main', display: 'flex', alignItems: 'center' }}>
          <LocalOfferIcon sx={{ mr: 1 }} />
          Agregar Promoción
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Funcionalidad para agregar promociones (pendiente de implementación)
          </DialogContentText>

          <TextField
            label="Código de promoción"
            fullWidth
            size="small"
            margin="normal"
          />

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Tipo de promoción</InputLabel>
            <Select label="Tipo de promoción" value="">
              <MenuItem value="descuento">Descuento porcentual</MenuItem>
              <MenuItem value="2x1">2x1</MenuItem>
              <MenuItem value="regalo">Producto de regalo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPromotionDialog(false)}>Cerrar</Button>
          <Button
            variant="contained"
            color="secondary"
            disabled
          >
            Aplicar Promoción
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de cambio de precio */}
      <Dialog
        open={openChangePriceDialog}
        onClose={() => setOpenChangePriceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
          <PriceCheckIcon sx={{ mr: 1 }} />
          Cambiar Precio
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem !== null && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {currentItem.detail}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Precio Actual"
                    fullWidth
                    value={formatCurrency(currentItem.price)}
                    disabled
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nuevo Precio"
                    type="number"
                    fullWidth
                    value={currentItem.price}
                    onChange={(e) => handleItemChange('price', parseFloat(e.target.value) || 0)}
                    margin="normal"
                    autoFocus
                    required
                    error={currentItem.price <= 0}
                    helperText={currentItem.price <= 0 ? "Mayor que cero" : ""}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePriceDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                setLoading(true);

                // Simulación de guardado
                setTimeout(() => {
                  // Actualizar el precio del ítem
                  setItems(items.map((item, idx) =>
                    idx === selectedItem
                      ? {
                        ...item,
                        price: currentItem.price,
                        total: currentItem.price * item.quantity * (1 - item.discount / 100)
                      }
                      : item
                  ));
                  setOpenChangePriceDialog(false);

                  setSnackbar({
                    open: true,
                    message: 'Precio actualizado correctamente',
                    severity: 'success'
                  });

                  setLoading(false);
                }, 400);
              }
            }}
            variant="contained"
            color="success"
            disabled={currentItem.price <= 0 || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de devolución */}
      <Dialog
        open={openDevolutionDialog}
        onClose={() => setOpenDevolutionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
          <AssignmentReturnIcon sx={{ mr: 1 }} />
          Agregar Devolución
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Funcionalidad para agregar devoluciones (pendiente de implementación)
          </DialogContentText>

          <TextField
            label="Código de producto a devolver"
            fullWidth
            size="small"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Cantidad a devolver"
            fullWidth
            size="small"
            type="number"
            margin="normal"
            defaultValue={1}
          />

          <TextField
            label="Motivo de devolución"
            fullWidth
            size="small"
            rows={2}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDevolutionDialog(false)}>Cerrar</Button>
          <Button
            variant="contained"
            color="error"
            disabled
          >
            Procesar Devolución
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de artículos varios */}
      <Dialog
        open={openAddVariosDialog}
        onClose={() => setOpenAddVariosDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'info.main', display: 'flex', alignItems: 'center' }}>
          <AddShoppingCartIcon sx={{ mr: 1 }} />
          Agregar Artículo Varios
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Use este formulario para agregar artículos no catalogados.
          </DialogContentText>

          <TextField
            label="Descripción"
            fullWidth
            size="small"
            margin="normal"
            placeholder="Ingrese una descripción para el artículo"
            required
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Precio"
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cantidad"
                fullWidth
                size="small"
                type="number"
                defaultValue={1}
                required
              />
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Tipo de IVA</InputLabel>
            <Select label="Tipo de IVA" defaultValue={21}>
              <MenuItem value={0}>Exento (0%)</MenuItem>
              <MenuItem value={10.5}>Tasa Reducida (10.5%)</MenuItem>
              <MenuItem value={21}>Tasa General (21%)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddVariosDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="info"
          >
            Agregar a Venta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de exportación */}
      <Dialog
        open={openExportMenuDialog}
        onClose={() => setOpenExportMenuDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
          <FileDownloadIcon sx={{ mr: 1 }} />
          Exportar Comprobante
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => {
                setOpenExportMenuDialog(false);
                handlePrint();
              }}
              fullWidth
            >
              Imprimir
            </Button>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={() => {
                setOpenExportMenuDialog(false);
                handleExportToPDF();
              }}
              fullWidth
            >
              Exportar a PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={() => {
                setOpenExportMenuDialog(false);
                handleExportToExcel();
              }}
              fullWidth
            >
              Exportar a Excel (CSV)
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportMenuDialog(false)}>Cancelar</Button>
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

      {/* Indicador de carga global */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default VentasPage;