//@ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  InputAdornment,
  SelectChangeEvent,
  Container,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Divider,
  CircularProgress,
  Fade,
  AppBar,
  Toolbar,
  Menu,
  Badge,
  Avatar,
  Stack,
  TableSortLabel,
  LinearProgress,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Autocomplete
} from '@mui/material';

import {
  Cancel as CancelIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Print as PrintIcon,
  ExitToApp as ExitToAppIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  QrCode as BarcodeIcon,
  Calculate as CalculateIcon,
  ReceiptLong as ReceiptLongIcon,
  CalendarToday as CalendarTodayIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Numbers as NumbersIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon,
  ViewList as ViewListIcon,
  BarChart as BarChartIcon,
  Discount as DiscountIcon,
  Percent as PercentIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

// Interfaz para los ítems de compra
interface PurchaseItem {
  id: number;
  code: string;
  quantity: number;
  detail: string;
  cost: number;
  price: number;
  total: number;
  selected: boolean;
}

// Interfaz para los totales
interface Totals {
  subtotal: number;
  internalTaxes: number;
  discount: number;
  discountPercentage: number;
  subtotal2: number;
  VAT: number;
  VATPercentage: number;
  parcialVAT: number;
  otherPercent: number;
  total: number;
}

// Datos de proveedores (simulados)
const proveedores = [
  { id: 1, nombre: 'DISTRIBUIDORA S.A.', cuit: '30-71234567-8', tipo: 'A' },
  { id: 2, nombre: 'MAYORISTA EXPRESS', cuit: '30-99876543-2', tipo: 'B' },
  { id: 3, nombre: 'IMPORTADORA TECH', cuit: '33-45678901-9', tipo: 'C' }
];

// Datos de productos (simulados)
const productos = [
  { codigo: '7551037600520', detalle: 'EVEREADY AA X UNIDAD', costo: 3.20, precio: 5.50 },
  { codigo: '3892095285', detalle: 'EVEREADY AAA X UNIDAD', costo: 4.10, precio: 7.00 },
  { codigo: '7551037600182', detalle: 'EVEREADY C MEDIANA X UNO', costo: 6.30, precio: 12.00 },
  { codigo: '7551037600018', detalle: 'EVEREADY D GRANDE X UNO', costo: 8.50, precio: 16.00 }
];

const ComprasPage: React.FC = () => {
  // Referencias
  const tableRef = useRef<HTMLDivElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Estado para el formulario
  const [date, setDate] = useState<Date | null>(new Date());
  const [paymentMethod, setPaymentMethod] = useState('CONTADO');
  const [provider, setProvider] = useState('');
  const [providerObject, setProviderObject] = useState<any>(null);
  const [invoiceType, setInvoiceType] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [updatePricesAtEnd, setUpdatePricesAtEnd] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState('id');

  // Estado para los items de compra
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PurchaseItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<PurchaseItem>({
    id: 0,
    code: '',
    quantity: 1,
    detail: '',
    cost: 0,
    price: 0,
    total: 0,
    selected: false
  });

  // Estado para el menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Estado para los totales
  const [totals, setTotals] = useState<Totals>({
    subtotal: 0,
    internalTaxes: 0,
    discount: 0,
    discountPercentage: 0,
    subtotal2: 0,
    VAT: 0,
    VATPercentage: 21, // IVA por defecto al 21%
    parcialVAT: 0,
    otherPercent: 0,
    total: 0
  });

  // Estados para diálogos y notificaciones
  const [openProviderDialog, setOpenProviderDialog] = useState(false);
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estadísticas para el dashboard
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const averageItemCost = items.length > 0
    ? items.reduce((sum, item) => sum + item.cost, 0) / items.length
    : 0;

  // Filtrar ítems
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(item =>
        item.code.toLowerCase().includes(query) ||
        item.detail.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // Efecto para calcular los totales cuando cambian los items o descuentos
  useEffect(() => {
    calculateTotals();
  }, [items, totals.discountPercentage, totals.VATPercentage]);

  // Efecto para enfocar el campo de código de barras después de agregar un ítem
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [items.length]);

  // Calcular los totales
  const calculateTotals = () => {
    // Calcular subtotal
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    // Calcular descuento
    const discount = (subtotal * totals.discountPercentage) / 100;

    // Subtotal 2 (después del descuento)
    const subtotal2 = subtotal - discount;

    // Calcular IVA
    const parcialVAT = (subtotal2 * totals.VATPercentage) / 100;

    // Calcular total final
    const total = subtotal2 + parcialVAT + totals.otherPercent;

    setTotals({
      ...totals,
      subtotal,
      discount,
      subtotal2,
      parcialVAT,
      total
    });
  };

  // Función para formatear moneda
  const formatCurrency = (value: number): string => {
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

  // Manejar cambio de pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Manejar cambio en campos del ítem actual
  const handleItemChange = (field: keyof PurchaseItem, value: any) => {
    let updatedItem = { ...currentItem, [field]: value };

    // Si es el código, buscar el producto
    if (field === 'code' && value) {
      const product = productos.find(p => p.codigo === value);
      if (product) {
        updatedItem = {
          ...updatedItem,
          detail: product.detalle,
          cost: product.costo,
          price: product.precio
        };
      }
    }

    // Recalcular el total del ítem
    if (field === 'quantity' || field === 'cost') {
      updatedItem.total = updatedItem.quantity * updatedItem.cost;
    }

    setCurrentItem(updatedItem);
  };

  // Manejar apertura del menú de acciones
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Manejar cierre del menú de acciones
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Buscar producto por código de barras
  const handleBarcodeSearch = () => {
    if (!barcode) return;

    setLoading(true);

    // Simulación de procesamiento
    setTimeout(() => {
      const product = productos.find(p => p.codigo === barcode);

      if (product) {
        // Si encuentra el producto, crear un nuevo ítem
        const newItem: PurchaseItem = {
          id: items.length + 1,
          code: product.codigo,
          quantity: 1,
          detail: product.detalle,
          cost: product.costo,
          price: product.precio,
          total: product.costo,
          selected: false
        };

        setItems([...items, newItem]);
        setBarcode('');

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
    }, 500);
  };

  // Manejar la tecla Enter en el campo de código de barras
  const handleBarcodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeSearch();
    }
  };

  // Ordenar ítems
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);

    const sortedData = [...filteredItems].sort((a, b) => {
      // @ts-ignore
      const valueA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
      // @ts-ignore
      const valueB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];

      if (valueA < valueB) {
        return isAsc ? -1 : 1;
      }
      if (valueA > valueB) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });

    setFilteredItems(sortedData);
  };

  // Resetear búsqueda
  const resetSearch = () => {
    setSearchQuery('');
    setFilteredItems(items);
  };

  // Agregar o actualizar ítem
  const handleSaveItem = () => {
    setLoading(true);

    setTimeout(() => {
      if (!currentItem.code || !currentItem.detail || currentItem.quantity <= 0) {
        setSnackbar({
          open: true,
          message: 'Complete todos los campos requeridos',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (editingItemId !== null) {
        // Actualizar ítem existente
        const updatedItems = items.map(item =>
          item.id === editingItemId ? { ...currentItem, selected: false } : item
        );
        setItems(updatedItems);
      } else {
        // Agregar nuevo ítem
        const newItem: PurchaseItem = {
          ...currentItem,
          id: items.length + 1,
          selected: false
        };
        setItems([...items, newItem]);
      }

      // Limpiar formulario
      setCurrentItem({
        id: 0,
        code: '',
        quantity: 1,
        detail: '',
        cost: 0,
        price: 0,
        total: 0,
        selected: false
      });

      setEditingItemId(null);
      setOpenItemDialog(false);

      setSnackbar({
        open: true,
        message: `Ítem ${editingItemId !== null ? 'actualizado' : 'agregado'} correctamente`,
        severity: 'success'
      });

      setLoading(false);
    }, 500);
  };

  // Eliminar ítem seleccionado
  const handleDeleteItem = () => {
    const selectedItems = items.filter(item => item.selected);

    if (selectedItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay ítems seleccionados para eliminar',
        severity: 'warning'
      });
      return;
    }

    setOpenDeleteItemDialog(true);
  };

  // Confirmar eliminación de ítems
  const confirmDeleteItems = () => {
    setLoading(true);

    setTimeout(() => {
      const updatedItems = items.filter(item => !item.selected);
      setItems(updatedItems);
      setOpenDeleteItemDialog(false);

      setSnackbar({
        open: true,
        message: 'Ítems eliminados correctamente',
        severity: 'success'
      });

      setLoading(false);
    }, 500);
  };

  // Seleccionar o deseleccionar un ítem
  const toggleItemSelection = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  // Editar un ítem
  const handleEditItem = (id: number) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setCurrentItem(itemToEdit);
      setEditingItemId(id);
      setOpenItemDialog(true);
    }
  };

  // Funcionalidad para los botones principales
  const handleAddItem = () => {
    setCurrentItem({
      id: 0,
      code: '',
      quantity: 1,
      detail: '',
      cost: 0,
      price: 0,
      total: 0,
      selected: false
    });
    setEditingItemId(null);
    setOpenItemDialog(true);
  };

  const handleCancel = () => {
    if (items.length > 0 || provider !== '' || invoiceNumber !== '') {
      setOpenConfirmCancelDialog(true);
    } else {
      clearForm();
    }
  };

  const clearForm = () => {
    setLoading(true);

    setTimeout(() => {
      setProvider('');
      setProviderObject(null);
      setPaymentMethod('CONTADO');
      setInvoiceType('');
      setInvoiceNumber('');
      setDate(new Date());
      setItems([]);
      setUpdatePricesAtEnd(false);
      setTotals({
        subtotal: 0,
        internalTaxes: 0,
        discount: 0,
        discountPercentage: 0,
        subtotal2: 0,
        VAT: 0,
        VATPercentage: 21,
        parcialVAT: 0,
        otherPercent: 0,
        total: 0
      });

      setSnackbar({
        open: true,
        message: 'Formulario limpiado',
        severity: 'info'
      });

      setLoading(false);
    }, 500);
  };

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      // Validar campos requeridos
      if (!provider) {
        setSnackbar({
          open: true,
          message: 'Debe seleccionar un proveedor',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (!invoiceType) {
        setSnackbar({
          open: true,
          message: 'Debe seleccionar un tipo de factura',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (!invoiceNumber) {
        setSnackbar({
          open: true,
          message: 'Debe ingresar un número de factura',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (items.length === 0) {
        setSnackbar({
          open: true,
          message: 'Debe agregar al menos un ítem',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      // Aquí normalmente enviarías los datos al servidor
      // Simulamos una operación exitosa

      setSnackbar({
        open: true,
        message: 'Compra guardada correctamente',
        severity: 'success'
      });

      // Opcional: limpiar el formulario después de guardar
      clearForm();

      setLoading(false);
    }, 800);
  };

  const handlePrint = () => {
    setLoading(true);

    setTimeout(() => {
      if (items.length === 0) {
        setSnackbar({
          open: true,
          message: 'No hay ítems para imprimir',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }

      // Crear un documento para imprimir solo los datos
      const printContent = document.createElement('div');

      // Estilo para la impresión
      printContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
          h2 { font-size: 16px; margin-top: 15px; margin-bottom: 5px; }
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
          <h1>Comprobante de Compra</h1>
          <div class="fecha">Fecha: ${date ? date.toLocaleDateString() : 'N/A'}</div>
          
          <div class="info-block">
            <div class="info-row">
              <div class="info-label">Proveedor:</div>
              <div>${provider}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Tipo de Factura:</div>
              <div>${invoiceType || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Número de Factura:</div>
              <div>${invoiceNumber || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Forma de Pago:</div>
              <div>${paymentMethod}</div>
            </div>
          </div>
          
          <h2>Detalle de Ítems</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Detalle</th>
                <th>P. Costo</th>
                <th>P. Venta</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.code}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td>${item.detail}</td>
                  <td class="text-right">$${item.cost.toFixed(2)}</td>
                  <td class="text-right">$${item.price.toFixed(2)}</td>
                  <td class="text-right">$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totales">
            <div class="info-row">
              <div class="info-label">Subtotal:</div>
              <div class="text-right">$${totals.subtotal.toFixed(2)}</div>
            </div>
            ${totals.discountPercentage > 0 ? `
              <div class="info-row">
                <div class="info-label">Descuento (${totals.discountPercentage}%):</div>
                <div class="text-right">$${totals.discount.toFixed(2)}</div>
              </div>
            ` : ''}
            <div class="info-row">
              <div class="info-label">Subtotal 2:</div>
              <div class="text-right">$${totals.subtotal2.toFixed(2)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">IVA (${totals.VATPercentage}%):</div>
              <div class="text-right">$${totals.parcialVAT.toFixed(2)}</div>
            </div>
            ${totals.otherPercent > 0 ? `
              <div class="info-row">
                <div class="info-label">Otros:</div>
                <div class="text-right">$${totals.otherPercent.toFixed(2)}</div>
              </div>
            ` : ''}
            <div class="total-final">
              Total: $${totals.total.toFixed(2)}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(printContent);

      // Imprimir y luego eliminar el elemento temporal
      window.print();
      document.body.removeChild(printContent);

      setLoading(false);
    }, 500);
  };

  const handleExit = () => {
    if (items.length > 0 || provider !== '' || invoiceNumber !== '') {
      setOpenExitDialog(true);
    } else {
      // Aquí normalmente redirigirías o cerrarías el componente
      setSnackbar({
        open: true,
        message: 'Saliendo del formulario de compras',
        severity: 'info'
      });
    }
  };

  // Exportar a PDF
  const handleExportToPDF = () => {
    setLoading(true);

    setTimeout(() => {
      if (items.length === 0) {
        setSnackbar({
          open: true,
          message: 'No hay ítems para exportar',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }

      // Crear contenido para PDF
      const pdfContent = document.createElement('div');

      // Similar al contenido de impresión pero con algunos ajustes para PDF
      pdfContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
          h2 { font-size: 16px; margin-top: 15px; margin-bottom: 5px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          th, td { border: 1px solid #000; padding: 5px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .fecha { font-size: 12px; margin-bottom: 15px; text-align: center; }
          .info-block { margin-bottom: 15px; }
          .info-row { display: flex; margin-bottom: 5px; }
          .info-label { font-weight: bold; width: 150px; }
          .totales { margin-top: 20px; }
          .total-final { font-size: 18px; font-weight: bold; text-align: right; margin-top: 10px; }
        </style>
        <div>
          <h1>Comprobante de Compra - PDF</h1>
          <div class="fecha">Fecha: ${date ? date.toLocaleDateString() : 'N/A'}</div>
          
          <!-- Información similar a la de impresión -->
        </div>
      `;

      // Abrir en nueva ventana para imprimir como PDF
      const printWindow = window.open('', '_blank');// @ts-ignore
      printWindow.document.write('<html><head><title>Comprobante de Compra</title>');// @ts-ignore
      printWindow.document.write('</head><body>');// @ts-ignore
      printWindow.document.write(pdfContent.innerHTML);

      // Agregar el resto del contenido similar al de impresión
      // @ts-ignore
      printWindow.document.write(`
        <div class="info-block">
          <div class="info-row">
            <div class="info-label">Proveedor:</div>
            <div>${provider}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Factura:</div>
            <div>${invoiceType || 'N/A'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Número de Factura:</div>
            <div>${invoiceNumber || 'N/A'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Forma de Pago:</div>
            <div>${paymentMethod}</div>
          </div>
        </div>
        
        <h2>Detalle de Ítems</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Detalle</th>
              <th>P. Costo</th>
              <th>P. Venta</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.code}</td>
                <td class="text-right">${item.quantity}</td>
                <td>${item.detail}</td>
                <td class="text-right">$${item.cost.toFixed(2)}</td>
                <td class="text-right">$${item.price.toFixed(2)}</td>
                <td class="text-right">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totales">
          <div class="info-row">
            <div class="info-label">Subtotal:</div>
            <div class="text-right">$${totals.subtotal.toFixed(2)}</div>
          </div>
          ${totals.discountPercentage > 0 ? `
            <div class="info-row">
              <div class="info-label">Descuento (${totals.discountPercentage}%):</div>
              <div class="text-right">$${totals.discount.toFixed(2)}</div>
            </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Subtotal 2:</div>
            <div class="text-right">$${totals.subtotal2.toFixed(2)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">IVA (${totals.VATPercentage}%):</div>
            <div class="text-right">$${totals.parcialVAT.toFixed(2)}</div>
          </div>
          ${totals.otherPercent > 0 ? `
            <div class="info-row">
              <div class="info-label">Otros:</div>
              <div class="text-right">$${totals.otherPercent.toFixed(2)}</div>
            </div>
          ` : ''}
          <div class="total-final">
            Total: $${totals.total.toFixed(2)}
          </div>
        </div>
      `);

      // @ts-ignore
      printWindow.document.write('</body></html>');// @ts-ignore
      printWindow.document.close();

      // Añadir un pequeño retraso para permitir que el contenido se cargue
      setTimeout(() => {// @ts-ignore
        printWindow.print();

        // Cerrar la ventana después de imprimir o cancelar
        // @ts-ignore
        printWindow.addEventListener('afterprint', () => {
          // @ts-ignore
          printWindow.close();
        });

        setSnackbar({
          open: true,
          message: 'PDF generado correctamente',
          severity: 'success'
        });
      }, 500);

      setLoading(false);
    }, 500);
  };

  // Exportar a Excel (CSV)
  const handleExportToExcel = () => {
    setLoading(true);

    setTimeout(() => {
      if (items.length === 0) {
        setSnackbar({
          open: true,
          message: 'No hay ítems para exportar',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }

      // Crear encabezados para el CSV
      const headers = ['Código', 'Cantidad', 'Detalle', 'Precio Costo', 'Precio Venta', 'Total'];
      let csvContent = headers.join(',') + '\n';

      // Añadir los datos de los ítems
      items.forEach(item => {
        // Escapar campos que puedan contener comas
        const detalle = `"${item.detail.replace(/"/g, '""')}"`;

        const row = [
          item.code,
          item.quantity,
          detalle,
          item.cost.toFixed(2),
          item.price.toFixed(2),
          item.total.toFixed(2)
        ].join(',');

        csvContent += row + '\n';
      });

      // Añadir información de totales
      csvContent += '\n';
      csvContent += `"Subtotal",,,,,${totals.subtotal.toFixed(2)}\n`;
      if (totals.discountPercentage > 0) {
        csvContent += `"Descuento (${totals.discountPercentage}%)",,,,,${totals.discount.toFixed(2)}\n`;
      }
      csvContent += `"Subtotal 2",,,,,${totals.subtotal2.toFixed(2)}\n`;
      csvContent += `"IVA (${totals.VATPercentage}%)",,,,,${totals.parcialVAT.toFixed(2)}\n`;
      if (totals.otherPercent > 0) {
        csvContent += `"Otros",,,,,${totals.otherPercent.toFixed(2)}\n`;
      }
      csvContent += `"TOTAL",,,,,${totals.total.toFixed(2)}\n`;

      // Crear un blob y un enlace de descarga
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Configurar el enlace y simular clic
      const dateStr = date ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `Comprobante_Compra_${dateStr}.csv`);
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
    }, 500);
  };

  // Función para buscar proveedor
  const handleProviderSearch = () => {
    setOpenProviderDialog(true);
  };

  // Seleccionar proveedor
  const handleSelectProvider = (proveedorSeleccionado: any) => {
    setProvider(proveedorSeleccionado.nombre);
    setProviderObject(proveedorSeleccionado);
    setInvoiceType(proveedorSeleccionado.tipo);
    setOpenProviderDialog(false);
  };

  // Manejo de cambios en los porcentajes
  const handleDiscountPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTotals({
      ...totals,
      discountPercentage: value
    });
  };

  const handleVATPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTotals({
      ...totals,
      VATPercentage: value
    });
  };

  // Manejadores de cierre de diálogos
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Teclas de atajo
  const handleKeyDown = (e: KeyboardEvent) => {
    // F2: Guardar
    if (e.key === 'F2') {
      e.preventDefault();
      handleSave();
    }
    // F4: Agregar ítem
    else if (e.key === 'F4') {
      e.preventDefault();
      handleAddItem();
    }
    // F5: Cancelar
    else if (e.key === 'F5') {
      e.preventDefault();
      handleCancel();
    }
    // Supr: Imprimir boleta
    else if (e.key === 'Delete') {
      e.preventDefault();
      handlePrint();
    }
    // Esc: Salir
    else if (e.key === 'Escape') {
      e.preventDefault();
      handleExit();
    }
  };

  // Agregar y eliminar escuchador de teclado
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, provider, invoiceNumber, totals]); // Dependencias actualizadas para manejar cambios

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Barra superior con acciones principales */}
      <AppBar
        position="static"
        color="default"
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <ShoppingCartIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Gestión de Compras
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar (F2)'}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              disabled={loading}
            >
              Agregar (F4)
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            <IconButton onClick={handleMenuClick} color="primary">
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                handlePrint();
              }}>
                <ListItemIcon>
                  <PrintIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Imprimir (Supr)" />
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                handleExportToPDF();
              }}>
                <ListItemIcon>
                  <ReceiptIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exportar a PDF" />
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                handleExportToExcel();
              }}>
                <ListItemIcon>
                  <FileDownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exportar a Excel" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                handleMenuClose();
                handleExit();
              }}>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Salir (Esc)" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
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
                      Total de Productos
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {totalItems}
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
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
                      Cantidad Total
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {totalQuantity}
                    </Typography>
                  </Box>
                  <LocalOfferIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #fff8e1 30%, #ffecb3 90%)',
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
                      Costo Promedio
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {formatCurrency(averageItemCost)}
                    </Typography>
                  </Box>
                  <MoneyOffIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #e1f5fe 30%, #b3e5fc 90%)',
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
                      Total Compra
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {formatCurrency(totals.total)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
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
            icon={<DescriptionIcon />}
            iconPosition="start"
            label="Datos de la Compra"
            sx={{ px: 3 }}
          />
          <Tab
            icon={<ViewListIcon />}
            iconPosition="start"
            label="Ítems de Compra"
            sx={{ px: 3 }}
          />
          <Tab
            icon={<BarChartIcon />}
            iconPosition="start"
            label="Resumen y Totales"
            sx={{ px: 3 }}
          />
        </Tabs>
      </Box>

      {/* Contenido de Tab 1: Datos de la Compra */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Información del Proveedor y Factura
              </Typography>
            }
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              py: 1
            }}
          />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <StoreIcon sx={{ mr: 1 }} />
                    Datos del Proveedor
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Proveedor"
                      size="small"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      placeholder="Seleccione un proveedor"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Tooltip title="Buscar Proveedor">
                      <IconButton size="small" sx={{ ml: 1 }} onClick={handleProviderSearch} color="primary">
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {providerObject && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        {providerObject.nombre}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <b>CUIT:</b> {providerObject.cuit}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <b>Tipo:</b> {providerObject.tipo}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ReceiptLongIcon sx={{ mr: 1 }} />
                    Datos de la Factura
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Tipo</InputLabel>
                        <Select
                          label="Tipo"
                          value={invoiceType}
                          onChange={(e: SelectChangeEvent) => setInvoiceType(e.target.value)}
                          startAdornment={
                            <InputAdornment position="start">
                              <ReceiptIcon fontSize="small" sx={{ ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value=""><em>Seleccionar</em></MenuItem>
                          <MenuItem value="A">A</MenuItem>
                          <MenuItem value="B">B</MenuItem>
                          <MenuItem value="C">C</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Nº de Factura"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NumbersIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                          label="Fecha"
                          value={date}
                          onChange={(newDate) => setDate(newDate)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarTodayIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                              }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Forma de Pago</InputLabel>
                        <Select
                          label="Forma de Pago"
                          value={paymentMethod}
                          onChange={(e: SelectChangeEvent) => setPaymentMethod(e.target.value as string)}
                          startAdornment={
                            <InputAdornment position="start">
                              <PaymentIcon fontSize="small" sx={{ ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="CONTADO">CONTADO</MenuItem>
                          <MenuItem value="CREDITO">CRÉDITO</MenuItem>
                          <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={updatePricesAtEnd}
                            onChange={(e) => setUpdatePricesAtEnd(e.target.checked)}
                            size="small"
                            color="primary"
                          />
                        }
                        label="Actualizar Precios al finalizar"
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BarcodeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Escáner de Código de Barras
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              label="Código de Barras"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleBarcodeSearch}
                      color="primary"
                      disabled={!barcode}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputRef={barcodeInputRef}
              placeholder="Escanee o ingrese un código de producto"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ ml: 2 }}
              onClick={handleAddItem}
            >
              Agregar Manualmente
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Contenido de Tab 2: Ítems de Compra */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Lista de Productos ({filteredItems.length})
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  placeholder="Buscar productos..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={resetSearch}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: 220 }}
                />
                <Tooltip title="Agregar Producto">
                  <IconButton color="primary" onClick={handleAddItem}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar Seleccionados">
                  <IconButton
                    color="error"
                    onClick={handleDeleteItem}
                    disabled={!items.some(item => item.selected)}
                  >
                    <DeleteIcon />
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

          {loading && <LinearProgress />}

          <TableContainer component={Paper} sx={{ maxHeight: 440, boxShadow: 'none' }} ref={tableRef}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ '& th': { backgroundColor: '#f5f5f5', fontWeight: 'bold' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      onChange={(e) => {
                        setItems(items.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      indeterminate={items.some(item => item.selected) && !items.every(item => item.selected)}
                      checked={items.length > 0 && items.every(item => item.selected)}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'code'}
                      direction={sortOrder}
                      onClick={() => handleSort('code')}
                    >
                      Código
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'quantity'}
                      direction={sortOrder}
                      onClick={() => handleSort('quantity')}
                    >
                      Cantidad
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'detail'}
                      direction={sortOrder}
                      onClick={() => handleSort('detail')}
                    >
                      Detalle
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'cost'}
                      direction={sortOrder}
                      onClick={() => handleSort('cost')}
                    >
                      P. Costo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'price'}
                      direction={sortOrder}
                      onClick={() => handleSort('price')}
                    >
                      P. Venta
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'total'}
                      direction={sortOrder}
                      onClick={() => handleSort('total')}
                    >
                      Total
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      {searchQuery ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <SearchIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No se encontraron productos para "{searchQuery}"
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={resetSearch}
                            sx={{ mt: 1 }}
                          >
                            Limpiar búsqueda
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <InventoryIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No hay productos agregados
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
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} sx={{
                      backgroundColor: item.selected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={item.selected}
                          onChange={() => toggleItemSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {item.code}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={item.quantity}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>{item.detail}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium" color="error.main">
                          {formatCurrency(item.cost)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium" color="success.main">
                          {formatCurrency(item.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          {formatCurrency(item.total)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => handleEditItem(item.id)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => {
                              setItems(items.filter(i => i.id !== item.id));
                            }} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell colSpan={5} align="right">
                    <Typography variant="subtitle2">
                      Total:
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatCurrency(totals.subtotal)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Contenido de Tab 3: Resumen y Totales */}
      <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Resumen de Compra
                  </Typography>
                }
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  py: 1
                }}
              />

              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Información General
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Proveedor:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {provider || 'No seleccionado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Tipo de Factura:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {invoiceType || 'No seleccionado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Nº de Factura:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {invoiceNumber || 'No ingresado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Fecha:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {date ? format(date, 'dd/MM/yyyy') : 'No establecida'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Detalle de Productos ({items.length})
                    </Typography>

                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 240 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Código</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell align="right">P. Costo</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                No hay productos agregados
                              </TableCell>
                            </TableRow>
                          ) : (
                            items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Typography variant="body2" fontFamily="monospace">
                                    {item.code}
                                  </Typography>
                                </TableCell>
                                <TableCell>{item.detail}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{formatCurrency(item.cost)}</TableCell>
                                <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Totales
                  </Typography>
                }
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  py: 1
                }}
              />

              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Sub total
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatCurrency(totals.subtotal)}
                      </Typography>
                    </Box>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Descuento %"
                      type="number"
                      value={totals.discountPercentage}
                      onChange={handleDiscountPercentChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        startAdornment: (
                          <InputAdornment position="start">
                            <DiscountIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      value={formatCurrency(totals.discount)}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <TrendingDownIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Sub total 2
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatCurrency(totals.subtotal2)}
                      </Typography>
                    </Box>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="IVA %"
                      type="number"
                      value={totals.VATPercentage}
                      onChange={handleVATPercentChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PercentIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      value={formatCurrency(totals.parcialVAT)}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <ArrowForwardIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Otras Percepciones"
                      type="number"
                      value={totals.otherPercent}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setTotals({
                          ...totals,
                          otherPercent: value
                        });
                      }}
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
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        TOTAL:
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                        {formatCurrency(totals.total)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                        fullWidth
                        onClick={handleSave}
                        sx={{ mr: 1 }}
                      >
                        Guardar Compra
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<PrintIcon />}
                        fullWidth
                        onClick={handlePrint}
                        sx={{ ml: 1 }}
                      >
                        Imprimir
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Flotant actions based on current tab */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {activeTab === 0 && (
          <Tooltip title="Continuar" placement="left">
            <Fade in={true}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveTab(1)}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  boxShadow: 3
                }}
              >
                <ArrowForwardIcon />
              </Button>
            </Fade>
          </Tooltip>
        )}

        {activeTab === 1 && (
          <>
            <Tooltip title="Agregar Producto" placement="left">
              <Fade in={true}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddItem}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    boxShadow: 3
                  }}
                >
                  <AddIcon />
                </Button>
              </Fade>
            </Tooltip>

            <Tooltip title="Continuar a Totales" placement="left">
              <Fade in={true}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveTab(2)}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    boxShadow: 3
                  }}
                >
                  <CalculateIcon />
                </Button>
              </Fade>
            </Tooltip>
          </>
        )}

        {activeTab === 2 && (
          <Tooltip title="Guardar Compra" placement="left">
            <Fade in={true}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  boxShadow: 3
                }}
              >
                <SaveIcon />
              </Button>
            </Fade>
          </Tooltip>
        )}
      </Box>

      {/* Diálogos */}

      {/* Diálogo para seleccionar proveedor */}
      <Dialog
        open={openProviderDialog}
        onClose={() => setOpenProviderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <StoreIcon sx={{ mr: 1 }} />
          Seleccionar Proveedor
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Buscar proveedor..."
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>CUIT</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proveedores.map((proveedor) => (
                  <TableRow key={proveedor.id} hover>
                    <TableCell>{proveedor.id}</TableCell>
                    <TableCell>{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.cuit}</TableCell>
                    <TableCell>
                      <Chip
                        label={proveedor.tipo}
                        size="small"
                        color={
                          proveedor.tipo === 'A' ? 'primary' :
                            proveedor.tipo === 'B' ? 'success' :
                              'warning'
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleSelectProvider(proveedor)}
                        startIcon={<CheckIcon />}
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
          <Button onClick={() => setOpenProviderDialog(false)} color="inherit">Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para agregar o editar ítem */}
      <Dialog
        open={openItemDialog}
        onClose={() => setOpenItemDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          {editingItemId !== null ? (
            <>
              <EditIcon sx={{ mr: 1 }} />
              Editar Ítem
            </>
          ) : (
            <>
              <AddIcon sx={{ mr: 1 }} />
              Agregar Ítem
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Código"
                  size="small"
                  fullWidth
                  value={currentItem.code}
                  onChange={(e) => handleItemChange('code', e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BarcodeIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Tooltip title="Buscar Producto">
                  <IconButton onClick={() => {
                    setOpenItemDialog(false);
                    setOpenProviderDialog(true);
                  }} color="primary">
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
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
                error={!currentItem.detail && currentItem.code !== ''}
                helperText={!currentItem.detail && currentItem.code !== '' ? "El detalle es obligatorio" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Precio Costo"
                size="small"
                fullWidth
                type="number"
                value={currentItem.cost}
                onChange={(e) => handleItemChange('cost', parseFloat(e.target.value) || 0)}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Precio Venta"
                size="small"
                fullWidth
                type="number"
                value={currentItem.price}
                onChange={(e) => handleItemChange('price', parseFloat(e.target.value) || 0)}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total"
                size="small"
                fullWidth
                value={formatCurrency(currentItem.total)}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)} color="inherit">Cancelar</Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            color="primary"
            disabled={!currentItem.code || !currentItem.detail || currentItem.quantity <= 0}
            startIcon={loading ? <CircularProgress size={20} /> : (editingItemId !== null ? <SaveIcon /> : <AddIcon />)}
          >
            {editingItemId !== null ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar cancelación */}
      <Dialog
        open={openConfirmCancelDialog}
        onClose={() => setOpenConfirmCancelDialog(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Confirmar cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea cancelar esta compra? Se perderán todos los datos ingresados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmCancelDialog(false)}>No</Button>
          <Button
            onClick={() => {
              clearForm();
              setOpenConfirmCancelDialog(false);
            }}
            color="error"
            autoFocus
            startIcon={<CancelIcon />}
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Confirmar salida
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
                message: 'Saliendo del formulario',
                severity: 'info'
              });
            }}
            color="error"
            autoFocus
            startIcon={<ExitToAppIcon />}
          >
            Sí, salir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar eliminación de ítems */}
      <Dialog
        open={openDeleteItemDialog}
        onClose={() => setOpenDeleteItemDialog(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="error" sx={{ mr: 1 }} />
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar los ítems seleccionados?
          </DialogContentText>

          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {items.filter(item => item.selected).length > 0 && (
              <>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Ítems a eliminar:
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Detalle</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.filter(item => item.selected).map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.detail}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
          </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteItemDialog(false)} color="inherit">Cancelar</Button>
          <Button 
            onClick={confirmDeleteItems} 
            color="error" 
            autoFocus
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
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
          sx={{ width: '100%', minWidth: '250px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Loading overlay */}
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

export default ComprasPage;