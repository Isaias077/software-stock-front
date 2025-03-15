import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Tooltip,
  Stack,
  Container,
  CircularProgress,
  Tab,
  Tabs,
  Badge,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon, //@ts-ignore
  ArrowDropDown as ArrowDropDownIcon,
  ImageNotSupported as ImageNotSupportedIcon,
  Close as CloseIcon,
  Save as SaveIcon,//@ts-ignore
  CheckCircle as CheckCircleIcon,//@ts-ignore
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  AttachMoney as AttachMoneyIcon,//@ts-ignore
  MoneyOff as MoneyOffIcon,
  ReceiptLong as ReceiptLongIcon,//@ts-ignore
  Store as StoreIcon,//@ts-ignore
  LocalOffer as LocalOfferIcon,
  PhotoCamera as PhotoCameraIcon,
  DashboardCustomize as DashboardCustomizeIcon
} from '@mui/icons-material';

// Interfaces para los datos
// Datos de producto en la tabla
interface ProductTableItem {
  codigo: string;
  detalle: string;
  familia: string;
  precio: number;
  stock: number;
}

// Datos completos del producto
interface ProductDetail {
  codigo: string;
  descripcion: string;
  familia: string;
  marca: string;
  precioCosto: number;
  precioVenta: number;
  iva: number;
  proveedor: string;
  stock: number;
  stockMin: number;
  stockIdeal: number;
  unidadPrecioLista1: number;
  unidadPrecioLista2: number;
  unidadPrecioLista3: number;
  cantXMayor: number;
  precioXMayor: number;
  nota: string;
  tieneImagen: boolean;
}

// Sample data for the table
const initialProductData: ProductTableItem[] = [
  { codigo: '77985255158301', detalle: 'ESPUMA', familia: 'ARTICULOS', precio: 17.00, stock: 0 },
  { codigo: '77959472050014', detalle: 'ESPUMA ARTIFICIAL', familia: 'ARTICULOS', precio: 9.50, stock: 0 },
  { codigo: '40258004371305', detalle: 'ESPUMA DE AFEITAR', familia: 'ARTICULOS', precio: 13.00, stock: 0 },
  { codigo: '77932116052476', detalle: 'ESPUMA GILLETTE', familia: 'ARTICULOS', precio: 15.00, stock: 0 },
  { codigo: '47402241459', detalle: 'ESPUMA GILLETTE', familia: 'ARTICULOS', precio: 24.00, stock: 53 },
  { codigo: '77932186951123', detalle: 'ESPUMA GILLETTE 150', familia: 'ARTICULOS', precio: 21.00, stock: 0 },
  { codigo: '7551037600520', detalle: 'EVEREADY AA X UNIDAD', familia: 'ARTICULOS', precio: 5.50, stock: 0 },
  { codigo: '3892095285', detalle: 'EVEREADY AAA X UNIDAD', familia: 'ARTICULOS', precio: 7.00, stock: 0 },
  { codigo: '7551037600182', detalle: 'EVEREADY C MEDIANA X UNO', familia: 'ARTICULOS', precio: 12.00, stock: 0 },
  { codigo: '7551037600018', detalle: 'EVEREADY D GRANDE X UNO', familia: 'ARTICULOS', precio: 16.00, stock: 0 },
  { codigo: '7802300790298', detalle: 'EXTRACTO TABACO', familia: 'ARTICULOS', precio: 11.50, stock: 0 },
  { codigo: '7622300847234', detalle: 'EXPRESS', familia: 'ARTICULOS', precio: 25.50, stock: 0 },
  { codigo: '7622300299637', detalle: 'EXPRESS CLASICA', familia: 'ARTICULOS', precio: 22.80, stock: 0 },
  { codigo: '7622300087722', detalle: 'EXPRESS LIGHT', familia: 'ARTICULOS', precio: 23.50, stock: 0 },
  { codigo: '7622300792148', detalle: 'EXPRESS 3 3', familia: 'ARTICULOS', precio: 13.50, stock: 0 },
];

// Familias disponibles para seleccionar
const familias = ['ARTICULOS', 'BEBIDAS', 'LIMPIEZA', 'PERFUMERIA', 'ALIMENTOS'];

// Proveedores disponibles para seleccionar
const proveedores = ['EVEREADY', 'GILLETTE', 'EXPRESS', 'COLGATE', 'UNILEVER'];

// Función de componente principal
function ArticulosPage() {
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Estados para los datos
  const [productData, setProductData] = useState<ProductTableItem[]>(initialProductData);
  const [filteredData, setFilteredData] = useState<ProductTableItem[]>(initialProductData);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail>({
    codigo: '7551037600182',
    descripcion: 'EVEREADY C MEDIANA X UNO',
    familia: 'ARTICULOS',
    marca: 'EVEREADY',
    precioCosto: 6.30,
    precioVenta: 12.00,
    iva: 21,
    proveedor: 'EVEREADY',
    stock: 0,
    stockMin: 0,
    stockIdeal: 0,
    unidadPrecioLista1: 0,
    unidadPrecioLista2: 0.00,
    unidadPrecioLista3: 0.00,
    cantXMayor: 1,
    precioXMayor: 0,
    nota: '',
    tieneImagen: false
  });
  
  // Estados para la interfaz
  const [highlightedRow, setHighlightedRow] = useState<string>('7551037600182');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<string>('codigo');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para diálogos y notificaciones
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openExitDialog, setOpenExitDialog] = useState<boolean>(false);
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);
  const [openExportMenuDialog, setOpenExportMenuDialog] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estadísticas rápidas
  const totalProducts = productData.length;
  const outOfStockProducts = productData.filter(p => p.stock <= 0).length;
  const totalValue = productData.reduce((sum, product) => sum + (product.precio * product.stock), 0);
  
  // Filtrar productos cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(productData);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = productData.filter(product => 
        product.codigo.toLowerCase().includes(lowercaseQuery) ||
        product.detalle.toLowerCase().includes(lowercaseQuery) ||
        product.familia.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, productData]);
  
  // Manejadores de interacción
  const handleRowClick = (product: ProductTableItem) => {
    if (!isEditing) {
      // Buscar los detalles completos del producto
      //@ts-ignore
      const currentProductInTable = productData.find(p => p.codigo === product.codigo);
      
      setSelectedProduct({
        ...selectedProduct,
        codigo: product.codigo,
        descripcion: product.detalle,
        familia: product.familia,
        precioVenta: product.precio,
        stock: product.stock
      });
      
      setHighlightedRow(product.codigo);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convertir a número si el campo debería ser numérico
    const numericFields = ['precioCosto', 'precioVenta', 'iva', 'stock', 'stockMin', 'stockIdeal', 
      'unidadPrecioLista1', 'unidadPrecioLista2', 'unidadPrecioLista3', 'cantXMayor', 'precioXMayor'];
    
    const processedValue = numericFields.includes(name) ? 
      (value === '' ? 0 : parseFloat(value)) : 
      value;
    
    setSelectedProduct({
      ...selectedProduct,
      [name]: processedValue
    });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    
    setSelectedProduct({
      ...selectedProduct,
      [name]: value
    });
  };
  //@ts-ignore
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Funcionalidad para ordenar
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
    
    const sortedData = [...productData].sort((a, b) => {
      // Determinar si son strings o números
      const valueA = typeof a[field as keyof ProductTableItem] === 'string' 
        ? (a[field as keyof ProductTableItem] as string).toLowerCase() 
        : a[field as keyof ProductTableItem];
      const valueB = typeof b[field as keyof ProductTableItem] === 'string' 
        ? (b[field as keyof ProductTableItem] as string).toLowerCase() 
        : b[field as keyof ProductTableItem];
      
      if (valueA < valueB) {
        return isAsc ? 1 : -1;
      }
      if (valueA > valueB) {
        return isAsc ? -1 : 1;
      }
      return 0;
    });
    
    setProductData(sortedData);
  };

  // Funcionalidad para buscar producto por código
  const handleSearchCode = () => {
    const foundProduct = productData.find(p => p.codigo === selectedProduct.codigo);
    
    if (foundProduct) {
      handleRowClick(foundProduct);
      setSnackbar({
        open: true,
        message: 'Producto encontrado',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Código de producto no encontrado',
        severity: 'error'
      });
    }
  };

  // Funcionalidad de los botones principales
  
  // Nuevo Artículo
  const handleNewProduct = () => {
    // Generar un código único (podría generarse en el servidor en un caso real)
    const generateUniqueCode = () => {
      return Math.floor(Math.random() * 10000000000000).toString();
    };
    
    const newProduct: ProductDetail = {
      codigo: generateUniqueCode(),
      descripcion: '',
      familia: 'ARTICULOS',
      marca: '',
      precioCosto: 0,
      precioVenta: 0,
      iva: 21,
      proveedor: '',
      stock: 0,
      stockMin: 0,
      stockIdeal: 0,
      unidadPrecioLista1: 0,
      unidadPrecioLista2: 0,
      unidadPrecioLista3: 0,
      cantXMayor: 1,
      precioXMayor: 0,
      nota: '',
      tieneImagen: false
    };
    
    setSelectedProduct(newProduct);
    setIsNewProduct(true);
    setIsEditing(true);
    setHighlightedRow('');
    setActiveTab(1); // Cambiar a la pestaña de datos
  };
  
  // Modificar Artículo
  const handleModifyProduct = () => {
    if (highlightedRow) {
      setIsEditing(true);
      setActiveTab(1); // Cambiar a la pestaña de datos
    } else {
      setSnackbar({
        open: true,
        message: 'Seleccione un producto para modificar',
        severity: 'warning'
      });
    }
  };
  
  // Guardar Artículo (para Nuevo y Modificar)
  const handleSaveProduct = () => {
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Validación básica
      if (!selectedProduct.descripcion) {
        setSnackbar({
          open: true,
          message: 'La descripción del producto es obligatoria',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      
      if (selectedProduct.precioVenta <= 0) {
        setSnackbar({
          open: true,
          message: 'El precio de venta debe ser mayor que cero',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      
      // Crear el objeto para la tabla
      const productForTable: ProductTableItem = {
        codigo: selectedProduct.codigo,
        detalle: selectedProduct.descripcion,
        familia: selectedProduct.familia,
        precio: selectedProduct.precioVenta,
        stock: selectedProduct.stock
      };
      
      if (isNewProduct) {
        // Añadir nuevo producto
        setProductData([...productData, productForTable]);
      } else {
        // Actualizar producto existente
        setProductData(productData.map(product => 
          product.codigo === selectedProduct.codigo ? productForTable : product
        ));
      }
      
      setIsEditing(false);
      setIsNewProduct(false);
      setHighlightedRow(selectedProduct.codigo);
      setActiveTab(0); // Volver a la pestaña de listado
      
      setSnackbar({
        open: true,
        message: `Producto ${isNewProduct ? 'creado' : 'actualizado'} correctamente`,
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };
  
  // Eliminar Artículo
  const handleDeleteProduct = () => {
    if (highlightedRow) {
      setOpenDeleteDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Seleccione un producto para eliminar',
        severity: 'warning'
      });
    }
  };
  
  const confirmDeleteProduct = () => {
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Eliminar el producto
      const updatedProducts = productData.filter(
        product => product.codigo !== selectedProduct.codigo
      );
      
      setProductData(updatedProducts);
      
      // Seleccionar el primer producto si hay alguno
      if (updatedProducts.length > 0) {
        handleRowClick(updatedProducts[0]);
      } else {
        setSelectedProduct({
          codigo: '',
          descripcion: '',
          familia: 'ARTICULOS',
          marca: '',
          precioCosto: 0,
          precioVenta: 0,
          iva: 21,
          proveedor: '',
          stock: 0,
          stockMin: 0,
          stockIdeal: 0,
          unidadPrecioLista1: 0,
          unidadPrecioLista2: 0,
          unidadPrecioLista3: 0,
          cantXMayor: 1,
          precioXMayor: 0,
          nota: '',
          tieneImagen: false
        });
      }
      
      setOpenDeleteDialog(false);
      
      setSnackbar({
        open: true,
        message: 'Producto eliminado correctamente',
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };
  
  // Imprimir la tabla
  const handlePrintTable = () => {
    if (productData.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay productos para imprimir',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Crear una nueva tabla HTML para imprimir
      const printContent = document.createElement('div');
      
      // Añadir estilos para la impresión
      printContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          h2 { font-size: 18px; margin-bottom: 10px; }
          .fecha { font-size: 12px; margin-bottom: 20px; }
          @media print {
            body * { visibility: hidden; }
            #print-content, #print-content * { visibility: visible; }
            #print-content { position: absolute; left: 0; top: 0; width: 100%; }
          }
        </style>
        <div id="print-content">
          <h2>Listado de Artículos</h2>
          <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Detalle</th>
                <th>Familia</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              ${productData.map(product => `
                <tr>
                  <td>${product.codigo}</td>
                  <td>${product.detalle}</td>
                  <td>${product.familia}</td>
                  <td class="text-right">$${product.precio.toFixed(2)}</td>
                  <td class="text-center">${product.stock}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      
      document.body.appendChild(printContent);
      
      // Imprimir y luego eliminar el elemento temporal
      window.print();
      document.body.removeChild(printContent);
      
      setLoading(false);
    }, 800);
  };
  
  // Exportar a PDF
  const handleExportToPDF = () => {
    if (productData.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay productos para exportar',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Crear un elemento temporal con los datos formateados
      const pdfContent = document.createElement('div');
      
      // Añadir estilos para el PDF
      pdfContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .fecha { font-size: 12px; text-align: center; margin-bottom: 20px; }
        </style>
        <h1>Listado de Artículos</h1>
        <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Detalle</th>
              <th>Familia</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            ${productData.map(product => `
              <tr>
                <td>${product.codigo}</td>
                <td>${product.detalle}</td>
                <td>${product.familia}</td>
                <td class="text-right">$${product.precio.toFixed(2)}</td>
                <td class="text-center">${product.stock}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      // Convertir el HTML a un PDF y descargar
      // Usamos un enfoque que no requiere bibliotecas externas
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Listado de Artículos</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(pdfContent.innerHTML);
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
      } else {
        setSnackbar({
          open: true,
          message: 'No se pudo abrir la ventana para imprimir. Compruebe su bloqueador de ventanas emergentes.',
          severity: 'error'
        });
      }
      
      setLoading(false);
    }, 800);
  };
  
  // Exportar a Excel (CSV)
  const handleExportToExcel = () => {
    if (productData.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay productos para exportar',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Crear el contenido CSV
      const headers = ['Código', 'Detalle', 'Familia', 'Precio', 'Stock'];
      let csvContent = headers.join(',') + '\n';
      
      // Añadir los datos
      productData.forEach(product => {
        // Escapar campos que puedan contener comas
        const detalle = `"${product.detalle.replace(/"/g, '""')}"`;
        const familia = `"${product.familia.replace(/"/g, '""')}"`;
        const precio = product.precio.toFixed(2);
        
        const row = [
          product.codigo,
          detalle,
          familia,
          precio,
          product.stock
        ].join(',');
        
        csvContent += row + '\n';
      });
      
      // Crear un blob y un enlace de descarga
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Configurar el enlace y simular clic
      link.setAttribute('href', url);
      link.setAttribute('download', `Listado_Articulos_${new Date().toISOString().slice(0,10)}.csv`);
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
  
  // Salir
  const handleExit = () => {
    if (isEditing) {
      setOpenExitDialog(true);
    } else {
      // Aquí podría redirigirse a otra página o cerrar el componente
      setSnackbar({
        open: true,
        message: 'Saliendo del módulo de artículos',
        severity: 'info'
      });
    }
  };
  
  // Manejar cierre de diálogos
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Subir imagen
  const handleUploadImage = () => {
    setOpenImageDialog(true);
  };
  
  // Función auxiliar para determinar si un botón debe estar deshabilitado
  const isButtonDisabled = (buttonType: string): boolean => {
    switch (buttonType) {
      case 'new':
        return isEditing;
      case 'modify':
        return isEditing || productData.length === 0;
      case 'save':
        return !isEditing;
      case 'delete':
        return isEditing || productData.length === 0;
      case 'print':
      case 'exportPDF':
      case 'exportExcel':
        return productData.length === 0;
      default:
        return false;
    }
  };
  
  // Formatear moneda
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
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
          <InventoryIcon sx={{ mr: 1 }} />
          Gestión de Productos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      {/* Estadísticas */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
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
                      {totalProducts}
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card 
              elevation={2}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
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
                      Sin Stock
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {outOfStockProducts}
                    </Typography>
                  </Box>
                  <Badge 
                    badgeContent={outOfStockProducts} 
                    color="error"
                    max={999}
                    sx={{ '& .MuiBadge-badge': { fontSize: 12, height: 20, minWidth: 20 } }}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.8 }} />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
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
                      Valor Total de Inventario
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatCurrency(totalValue)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs de contenido */}
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
            icon={<CategoryIcon />} 
            iconPosition="start" 
            label="Listado de Productos" 
            sx={{ px: 3 }}
          />
          <Tab 
            icon={<DashboardCustomizeIcon />} 
            iconPosition="start" 
            label="Datos del Producto" 
          />
        </Tabs>
      </Box>

      {/* Contenido de las tabs */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Listado de Productos ({filteredData.length})
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Imprimir Listado">
                  <IconButton 
                    color="primary" 
                    onClick={handlePrintTable}
                    disabled={isButtonDisabled('print')}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar">
                  <IconButton 
                    color="primary" 
                    onClick={() => setOpenExportMenuDialog(true)}
                    disabled={isButtonDisabled('exportPDF')}
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
          
          <TableContainer 
            component={Paper} 
            sx={{ maxHeight: 440, boxShadow: 'none' }}
            ref={tableRef}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ '& th': { backgroundColor: '#f5f5f5', fontWeight: 'bold' } }}>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'codigo'}
                      direction={sortField === 'codigo' ? sortOrder : 'asc'}
                      onClick={() => handleSort('codigo')}
                    >
                      Código
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'detalle'}
                      direction={sortField === 'detalle' ? sortOrder : 'asc'}
                      onClick={() => handleSort('detalle')}
                    >
                      Detalle
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'familia'}
                      direction={sortField === 'familia' ? sortOrder : 'asc'}
                      onClick={() => handleSort('familia')}
                    >
                      Familia
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'precio'}
                      direction={sortField === 'precio' ? sortOrder : 'asc'}
                      onClick={() => handleSort('precio')}
                    >
                      Precio
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'stock'}
                      direction={sortField === 'stock' ? sortOrder : 'asc'}
                      onClick={() => handleSort('stock')}
                    >
                      Stock
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((product) => (
                    <TableRow 
                      key={product.codigo}
                      onClick={() => handleRowClick(product)}
                      sx={{ 
                        cursor: isEditing ? 'not-allowed' : 'pointer',
                        backgroundColor: highlightedRow === product.codigo ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                        '&:hover': { backgroundColor: isEditing ? undefined : 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {product.codigo}
                        </Typography>
                      </TableCell>
                      <TableCell>{product.detalle}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.familia} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            fontWeight: 'medium'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {formatCurrency(product.precio)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={product.stock} 
                          size="small" 
                          color={product.stock <= 0 ? "error" : "success"}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(product);
                                handleModifyProduct();
                              }}
                              disabled={isEditing}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(product);
                                handleDeleteProduct();
                              }}
                              disabled={isEditing}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      {searchQuery ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <SearchIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No se encontraron productos para "{searchQuery}"
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => setSearchQuery('')}
                            sx={{ mt: 1 }}
                          >
                            Limpiar búsqueda
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <InventoryIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No hay productos disponibles
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<AddIcon />}
                            onClick={handleNewProduct}
                            sx={{ mt: 1 }}
                          >
                            Agregar Producto
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Pestaña de Detalles */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                {isNewProduct ? 'Nuevo Producto' : `Editando: ${selectedProduct.descripcion}`}
              </Typography>
            }
            sx={{ 
              backgroundColor: isEditing ? 'primary.light' : '#f5f5f5', 
              color: isEditing ? 'primary.contrastText' : 'inherit',
              py: 1
            }}
          />
          
          <CardContent>
            <Grid container spacing={3}>
              {/* Primera Sección */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ReceiptLongIcon sx={{ mr: 1 }} />
                    Información Básica
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3} md={2}>
                      <TextField 
                        label="Código" 
                        fullWidth 
                        size="small"
                        name="codigo"
                        value={selectedProduct.codigo}
                        disabled={true} // Código siempre deshabilitado
                        InputProps={{
                          endAdornment: !isEditing ? (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={handleSearchCode}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ) : null,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={5}>
                      <TextField 
                        label="Descripción" 
                        fullWidth 
                        size="small"
                        name="descripcion"
                        value={selectedProduct.descripcion}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        error={isEditing && !selectedProduct.descripcion}
                        helperText={isEditing && !selectedProduct.descripcion ? "Campo requerido" : ""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="familia-label">Familia</InputLabel>
                        <Select
                          labelId="familia-label"
                          name="familia"
                          value={selectedProduct.familia}
                          label="Familia" // @ts-ignore
                          onChange={handleSelectChange}
                          disabled={!isEditing}
                        >
                          {familias.map(familia => (
                            <MenuItem key={familia} value={familia}>{familia}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={0} md={2}></Grid>
                    
                    <Grid item xs={12} sm={3} md={2}>
                      <TextField 
                        label="Marca" 
                        fullWidth 
                        size="small"
                        name="marca"
                        value={selectedProduct.marca}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="proveedor-label">Proveedor</InputLabel>
                        <Select
                          labelId="proveedor-label"
                          name="proveedor"
                          value={selectedProduct.proveedor}
                          label="Proveedor" //@ts-ignore
                          onChange={handleSelectChange}
                          disabled={!isEditing}
                        >
                          {proveedores.map(proveedor => (
                            <MenuItem key={proveedor} value={proveedor}>{proveedor}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Segunda Sección */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 1 }} />
                    Precios
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="Precio de Costo" 
                        fullWidth 
                        size="small"
                        name="precioCosto"
                        value={selectedProduct.precioCosto.toFixed(2)}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="Precio de Venta" 
                        fullWidth 
                        size="small"
                        name="precioVenta"
                        value={selectedProduct.precioVenta.toFixed(2)}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                        required
                        error={isEditing && selectedProduct.precioVenta <= 0}
                        helperText={isEditing && selectedProduct.precioVenta <= 0 ? "Debe ser mayor a 0" : ""}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="I.V.A." 
                        fullWidth 
                        size="small"
                        name="iva"
                        value={selectedProduct.iva}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField 
                          label="Cant x Mayor" 
                          size="small"
                          name="cantXMayor"
                          value={selectedProduct.cantXMayor}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          type="number"
                          sx={{ width: 100 }}
                        />
                        <TextField 
                          label="$ x Mayor" 
                          size="small"
                          name="precioXMayor"
                          value={selectedProduct.precioXMayor}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          type="number"
                          sx={{ flex: 1 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Listas de Precios
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField 
                        label="Lista 1" 
                        fullWidth 
                        size="small"
                        name="unidadPrecioLista1"
                        value={selectedProduct.unidadPrecioLista1}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField 
                        label="Lista 2" 
                        fullWidth 
                        size="small"
                        name="unidadPrecioLista2"
                        value={selectedProduct.unidadPrecioLista2.toFixed(2)}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField 
                        label="Lista 3" 
                        fullWidth 
                        size="small"
                        name="unidadPrecioLista3"
                        value={selectedProduct.unidadPrecioLista3.toFixed(2)}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Tercera Sección */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ShoppingCartIcon sx={{ mr: 1 }} />
                    Inventario y Adicionales
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField 
                        label="Stock Actual" 
                        fullWidth 
                        size="small"
                        name="stock"
                        value={selectedProduct.stock}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField 
                        label="Stock Mínimo" 
                        fullWidth 
                        size="small"
                        name="stockMin"
                        value={selectedProduct.stockMin}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField 
                        label="Stock Ideal" 
                        fullWidth 
                        size="small"
                        name="stockIdeal"
                        value={selectedProduct.stockIdeal}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="number"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField 
                        label="Nota del Producto" 
                        fullWidth 
                        size="small"
                        name="nota"
                        value={selectedProduct.nota}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={handleUploadImage}
                          disabled={!isEditing}
                          startIcon={<PhotoCameraIcon />}
                        >
                          Subir Imagen
                        </Button>
                        
                        <Paper 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 120, 
                            height: 80, 
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <ImageNotSupportedIcon sx={{ color: '#9e9e9e', fontSize: 32 }} />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              position: 'absolute', 
                              bottom: 8, 
                              left: 0, 
                              right: 0, 
                              textAlign: 'center',
                              color: '#f44336', 
                              fontWeight: 'bold',
                              bgcolor: 'rgba(255,255,255,0.7)',
                              py: 0.5
                            }}
                          >
                            NO DISPONIBLE
                          </Typography>
                        </Paper>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                onClick={isEditing ? handleSaveProduct : handleNewProduct}
                disabled={(isEditing && isButtonDisabled('save')) || (!isEditing && isButtonDisabled('new'))}
              >
                {isEditing ? 'Guardar Cambios' : 'Nuevo Producto'}
              </Button>
              {isEditing && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setIsEditing(false);
                    setIsNewProduct(false);
                    setActiveTab(0); // Volver a la tabla
                    
                    // Restaurar datos originales si no es nuevo
                    if (!isNewProduct) {
                      const originalProduct = productData.find(p => p.codigo === selectedProduct.codigo);
                      if (originalProduct) {
                        handleRowClick(originalProduct);
                      }
                    }
                  }}
                >
                  Cancelar
                </Button>
              )}
            </Box>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={handleExit}
            >
              Salir
            </Button>
          </Box>
        </Card>
      </Box>
      
      {/* Botones de acción flotantes (solo en modo listado) */}
      {activeTab === 0 && (
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
          <Tooltip title="Nuevo Producto" placement="left">
            <Fade in={!isEditing}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNewProduct}
                disabled={isButtonDisabled('new')}
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
        </Box>
      )}

      {/* Diálogos */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el producto "{selectedProduct.descripcion}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteProduct} 
            color="error" 
            autoFocus
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={openExitDialog}
        onClose={() => setOpenExitDialog(false)}
      >
        <DialogTitle>Confirmar salida</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tiene cambios sin guardar. ¿Está seguro que desea salir sin guardar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              setIsEditing(false);
              setIsNewProduct(false);
              setOpenExitDialog(false);
              setActiveTab(0);
              
              // Restaurar datos originales
              if (!isNewProduct) {
                const originalProduct = productData.find(p => p.codigo === selectedProduct.codigo);
                if (originalProduct) {
                  handleRowClick(originalProduct);
                }
              }
            }} 
            color="error" 
            autoFocus
          >
            Salir sin guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Subir imagen de producto</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                border: '2px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main'
                }
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Haga clic para seleccionar una imagen
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
              Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
            </Typography>
            
            <Button variant="contained" color="primary" disabled>
              Subir Imagen
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={openExportMenuDialog}
        onClose={() => setOpenExportMenuDialog(false)}
      >
        <DialogTitle>Exportar datos</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Seleccione el formato para exportar los datos:
          </DialogContentText>
          <Stack spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />} 
              onClick={() => {
                setOpenExportMenuDialog(false);
                handlePrintTable();
              }}
              fullWidth
            >
              Imprimir
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<FileUploadIcon />} 
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
}

export default ArticulosPage;