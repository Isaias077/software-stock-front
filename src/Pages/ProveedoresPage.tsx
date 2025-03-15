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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  Container,
  CircularProgress,
  Badge,
  Fade,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationCity as LocationCityIcon,
  Phone as PhoneIcon,
  ContactPhone as ContactPhoneIcon,
  CreditCard as CreditCardIcon,
  ReceiptLong as ReceiptLongIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  AddCircle as AddCircleIcon,
  BusinessCenter as BusinessCenterIcon
} from '@mui/icons-material';

// Define TypeScript interface for supplier data
interface Supplier {
  codigo: string;
  razon: string;
  domicilio: string;
  ciudad: string;
  cuit: string;
  ingresosBrutos: string;
  codigoPostal: string;
  telefono: string;
  celular: string;
  email?: string; // Campo opcional para mejora de datos
  contacto?: string; // Campo opcional para mejora de datos
}

// Default empty supplier
const emptySupplier: Supplier = {
  codigo: '',
  razon: '',
  domicilio: '',
  ciudad: '',
  cuit: '',
  ingresosBrutos: '',
  codigoPostal: '',
  telefono: '',
  celular: '',
  email: '',
  contacto: ''
};

// Lista de ciudades de ejemplo
const ciudades = [
  'CIUDAD',
  'BUENOS AIRES',
  'CÓRDOBA',
  'ROSARIO',
  'MENDOZA',
  'LA PLATA',
  'TUCUMÁN',
  'MAR DEL PLATA',
  'SALTA'
];

const ProveedoresPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const tableRef = useRef<HTMLDivElement>(null);

  // Estados básicos
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      codigo: '1',
      razon: 'DISTRIBUIDORA MAYORISTA S.A.',
      domicilio: 'Av. Rivadavia 1234',
      ciudad: 'BUENOS AIRES',
      cuit: '30-12345678-9',
      ingresosBrutos: '123-456789-0',
      codigoPostal: '1424',
      telefono: '011-4555-6666',
      celular: '11-6789-1234',
      email: 'info@distribuidora.com',
      contacto: 'Juan Perez'
    },
    {
      codigo: '2',
      razon: 'COMERCIAL DEL SUR S.R.L.',
      domicilio: 'Belgrano 567',
      ciudad: 'CÓRDOBA',
      cuit: '30-87654321-0',
      ingresosBrutos: '987-654321-0',
      codigoPostal: '5000',
      telefono: '0351-422-3344',
      celular: '351-567-8901',
      email: 'ventas@comercialsur.com',
      contacto: 'María Rodriguez'
    },
    {
      codigo: '3',
      razon: 'IMPORTADORA TECH',
      domicilio: 'San Martín 890',
      ciudad: 'ROSARIO',
      cuit: '30-56789012-3',
      ingresosBrutos: '456-789012-3',
      codigoPostal: '2000',
      telefono: '0341-455-6677',
      celular: '341-890-1234',
      email: 'contacto@importech.com',
      contacto: 'Roberto Gomez'
    }
  ]);
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(suppliers[0]);
  const [highlightedRow, setHighlightedRow] = useState<string>('1');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isNewSupplier, setIsNewSupplier] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(suppliers);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para diálogos
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openExitDialog, setOpenExitDialog] = useState<boolean>(false);
  const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);
  const [openCiudadDialog, setOpenCiudadDialog] = useState<boolean>(false);
  const [nuevaCiudad, setNuevaCiudad] = useState<string>('');
  
  // Estado para el snackbar
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
  const totalProveedores = suppliers.length;
  const proveedoresActivos = suppliers.filter(s => s.razon && s.cuit).length;
  
  // Filtrar proveedores cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = suppliers.filter(supplier => 
        supplier.codigo.toLowerCase().includes(lowercaseQuery) ||
        supplier.razon.toLowerCase().includes(lowercaseQuery) ||
        supplier.ciudad.toLowerCase().includes(lowercaseQuery) ||
        supplier.cuit.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchQuery, suppliers]);

  // Manejadores de eventos
  const handleRowClick = (supplier: Supplier) => {
    if (!isEditing) {
      setSelectedSupplier(supplier);
      setHighlightedRow(supplier.codigo);
    }
  };

  const handleNewSupplier = () => {
    // Generar nuevo código automáticamente (incrementando el último)
    const lastCode = Math.max(...suppliers.map(s => parseInt(s.codigo || '0')));
    const newCode = (lastCode + 1).toString();
    
    const newSupplier = { ...emptySupplier, codigo: newCode };
    setSelectedSupplier(newSupplier);
    setIsNewSupplier(true);
    setIsEditing(true);
    setActiveTab(1); // Cambiar a la pestaña de detalles
  };

  const handleEditSupplier = () => {
    if (highlightedRow) {
      setIsEditing(true);
      setActiveTab(1); // Cambiar a la pestaña de detalles
    } else {
      setSnackbar({
        open: true,
        message: 'Seleccione un proveedor para modificar',
        severity: 'warning'
      });
    }
  };

  const handleSaveSupplier = () => {
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Validaciones básicas
      if (!selectedSupplier.razon.trim()) {
        setSnackbar({
          open: true,
          message: 'La Razón Social es obligatoria',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (isNewSupplier) {
        // Añadir nuevo proveedor
        setSuppliers([...suppliers, selectedSupplier]);
      } else {
        // Actualizar proveedor existente
        setSuppliers(suppliers.map(supplier => 
          supplier.codigo === selectedSupplier.codigo ? selectedSupplier : supplier
        ));
      }

      setIsEditing(false);
      setIsNewSupplier(false);
      setHighlightedRow(selectedSupplier.codigo);
      setActiveTab(0); // Volver a la pestaña de listado
      
      setSnackbar({
        open: true,
        message: `Proveedor ${isNewSupplier ? 'creado' : 'actualizado'} correctamente`,
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };

  const handleDeleteSupplier = () => {
    if (highlightedRow) {
      setOpenDeleteDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Seleccione un proveedor para eliminar',
        severity: 'warning'
      });
    }
  };

  const confirmDeleteSupplier = () => {
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Filtrar el proveedor seleccionado
      const updatedSuppliers = suppliers.filter(
        supplier => supplier.codigo !== selectedSupplier.codigo
      );
      
      setSuppliers(updatedSuppliers);
      
      // Si no quedan proveedores, crear uno vacío
      if (updatedSuppliers.length === 0) {
        setSelectedSupplier(emptySupplier);
      } else {
        // Seleccionar el primer proveedor de la lista
        setSelectedSupplier(updatedSuppliers[0]);
        setHighlightedRow(updatedSuppliers[0].codigo);
      }
      
      setOpenDeleteDialog(false);
      
      setSnackbar({
        open: true,
        message: 'Proveedor eliminado correctamente',
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };

  const handlePrintTable = () => {
    if (suppliers.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay proveedores para imprimir',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      // Crear contenido para imprimir
      const printContent = document.createElement('div');
      
      // Agregar estilos para la impresión
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
          .highlight { background-color: #e3f2fd; }
          @media print {
            body * { visibility: hidden; }
            #print-content, #print-content * { visibility: visible; }
            #print-content { position: absolute; left: 0; top: 0; width: 100%; }
          }
        </style>
        <div id="print-content">
          <h2>Listado de Proveedores</h2>
          <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Razón Social</th>
                <th>Domicilio</th>
                <th>Ciudad</th>
                <th>CUIT</th>
                <th>Ingresos Brutos</th>
              </tr>
            </thead>
            <tbody>
              ${suppliers.map(supplier => `
                <tr class="${supplier.codigo === highlightedRow ? 'highlight' : ''}">
                  <td>${supplier.codigo}</td>
                  <td>${supplier.razon}</td>
                  <td>${supplier.domicilio}</td>
                  <td>${supplier.ciudad}</td>
                  <td>${supplier.cuit}</td>
                  <td>${supplier.ingresosBrutos}</td>
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

  const handleExportToPDF = () => {
    if (suppliers.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay proveedores para exportar',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      // Crear elemento temporal para PDF
      const pdfContent = document.createElement('div');
      
      // Agregar estilos y contenido para el PDF
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
        <h1>Listado de Proveedores</h1>
        <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Razón Social</th>
              <th>Domicilio</th>
              <th>Ciudad</th>
              <th>CUIT</th>
              <th>Ingresos Brutos</th>
            </tr>
          </thead>
          <tbody>
            ${suppliers.map(supplier => `
              <tr>
                <td>${supplier.codigo}</td>
                <td>${supplier.razon}</td>
                <td>${supplier.domicilio}</td>
                <td>${supplier.ciudad}</td>
                <td>${supplier.cuit}</td>
                <td>${supplier.ingresosBrutos}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      // Abrir ventana para PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Listado de Proveedores</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(pdfContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
          
          // Cerrar la ventana después de imprimir
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
          message: 'Error al generar PDF. Compruebe que no esté bloqueando ventanas emergentes.',
          severity: 'error'
        });
      }
      
      setLoading(false);
    }, 800);
  };

  const handleExportToExcel = () => {
    if (suppliers.length === 0) {
      setSnackbar({
        open: true,
        message: 'No hay proveedores para exportar',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      // Crear encabezados CSV
      const headers = ['Código', 'Razón Social', 'Domicilio', 'Ciudad', 'CUIT', 'Ingresos Brutos', 'Código Postal', 'Teléfono', 'Celular'];
      let csvContent = headers.join(',') + '\n';
      
      // Agregar filas de datos
      suppliers.forEach(supplier => {
        // Escapar campos con comas
        const razon = `"${supplier.razon.replace(/"/g, '""')}"`;
        const domicilio = `"${supplier.domicilio.replace(/"/g, '""')}"`;
        const ciudad = `"${supplier.ciudad.replace(/"/g, '""')}"`;
        
        const row = [
          supplier.codigo,
          razon,
          domicilio,
          ciudad,
          supplier.cuit,
          supplier.ingresosBrutos,
          supplier.codigoPostal,
          supplier.telefono,
          supplier.celular
        ].join(',');
        
        csvContent += row + '\n';
      });
      
      // Crear blob y enlace de descarga
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Proveedores_${new Date().toISOString().slice(0,10)}.csv`);
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

  const handleExitClick = () => {
    if (isEditing) {
      setOpenExitDialog(true);
    } else {
      // Aquí podrías redirigir o cerrar el componente según tu aplicación
      setSnackbar({
        open: true,
        message: 'Saliendo del módulo de proveedores',
        severity: 'info'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedSupplier({
      ...selectedSupplier,
      [name]: value
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleCiudadNuevo = () => {
    setOpenCiudadDialog(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGuardarCiudad = () => {
    if (nuevaCiudad.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Ingrese un nombre de ciudad válido',
        severity: 'error'
      });
      return;
    }
    
    // En una aplicación real, aquí guardarías la ciudad en la base de datos
    // Para esta demo, simplemente actualizamos el proveedor seleccionado
    setSelectedSupplier({
      ...selectedSupplier,
      ciudad: nuevaCiudad
    });
    
    setSnackbar({
      open: true,
      message: 'Ciudad agregada correctamente',
      severity: 'success'
    });
    
    setNuevaCiudad('');
    setOpenCiudadDialog(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 1 }} />
          Gestión de Proveedores
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar proveedores..."
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
                      Total de Proveedores
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {totalProveedores}
                    </Typography>
                  </Box>
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
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
                      Proveedores Activos
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {proveedoresActivos}
                    </Typography>
                  </Box>
                  <Badge 
                    badgeContent={proveedoresActivos} 
                    color="success"
                    max={999}
                    sx={{ '& .MuiBadge-badge': { fontSize: 12, height: 20, minWidth: 20 } }}
                  >
                    <BusinessCenterIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
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
                      Acciones Rápidas
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small" 
                        startIcon={<AddIcon />}
                        onClick={handleNewSupplier}
                        disabled={isEditing}
                      >
                        Nuevo
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        size="small" 
                        startIcon={<PrintIcon />}
                        onClick={handlePrintTable}
                        disabled={suppliers.length === 0}
                      >
                        Imprimir
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<FileDownloadIcon />}
                        onClick={() => setOpenExportDialog(true)}
                        disabled={suppliers.length === 0}
                      >
                        Exportar
                      </Button>
                    </Box>
                  </Box>
                  <RefreshIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
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
            icon={<BusinessIcon />} 
            iconPosition="start" 
            label="Listado de Proveedores" 
            sx={{ px: 3 }}
          />
          <Tab 
            icon={<EditIcon />} 
            iconPosition="start" 
            label="Datos del Proveedor" 
          />
        </Tabs>
      </Box>

      {/* Pestaña de Listado */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Listado de Proveedores ({filteredSuppliers.length})
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Imprimir Listado">
                  <IconButton 
                    color="primary" 
                    onClick={handlePrintTable}
                    disabled={suppliers.length === 0}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar">
                  <IconButton 
                    color="primary" 
                    onClick={() => setOpenExportDialog(true)}
                    disabled={suppliers.length === 0}
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
                  <TableCell>Código</TableCell>
                  <TableCell>Razón Social</TableCell>
                  <TableCell>Domicilio</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>CUIT</TableCell>
                  <TableCell>Ing. Brutos</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier.codigo}
                      onClick={() => handleRowClick(supplier)}
                      sx={{
                        cursor: isEditing ? 'not-allowed' : 'pointer',
                        backgroundColor: highlightedRow === supplier.codigo ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                        '&:hover': { backgroundColor: isEditing ? undefined : 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {supplier.codigo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {supplier.razon}
                        </Typography>
                      </TableCell>
                      <TableCell>{supplier.domicilio}</TableCell>
                      <TableCell>
                        <Chip 
                          label={supplier.ciudad} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell>{supplier.cuit}</TableCell>
                      <TableCell>{supplier.ingresosBrutos}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(supplier);
                                handleEditSupplier();
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
                                handleRowClick(supplier);
                                handleDeleteSupplier();
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
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      {searchQuery ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <SearchIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No se encontraron proveedores para "{searchQuery}"
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
                          <BusinessIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No hay proveedores disponibles
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<AddIcon />}
                            onClick={handleNewSupplier}
                            sx={{ mt: 1 }}
                          >
                            Agregar Proveedor
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
                {isNewSupplier ? 'Nuevo Proveedor' : `Editando: ${selectedSupplier.razon}`}
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
              {/* Primera Sección - Información Básica */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    Información Básica
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} md={1}>
                      <TextField
                        label="Código"
                        fullWidth
                        size="small"
                        name="codigo"
                        value={selectedSupplier.codigo}
                        disabled={true} // Código siempre deshabilitado
                      />
                    </Grid>
                    <Grid item xs={12} sm={10} md={5}>
                      <TextField
                        label="Razón Social"
                        fullWidth
                        size="small"
                        name="razon"
                        value={selectedSupplier.razon}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        error={isEditing && !selectedSupplier.razon}
                        helperText={isEditing && !selectedSupplier.razon ? "Campo requerido" : ""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        label="Domicilio"
                        fullWidth
                        size="small"
                        name="domicilio"
                        value={selectedSupplier.domicilio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Autocomplete
                        options={ciudades}
                        value={selectedSupplier.ciudad}
                        onChange={(event, newValue) => {
                          setSelectedSupplier({
                            ...selectedSupplier,
                            ciudad: newValue || ''
                          });
                        }}
                        disabled={!isEditing}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Ciudad" 
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start">
                                    <LocationCityIcon fontSize="small" />
                                  </InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        label="Código Postal"
                        fullWidth
                        size="small"
                        name="codigoPostal"
                        value={selectedSupplier.codigoPostal}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="CUIT"
                        fullWidth
                        size="small"
                        name="cuit"
                        value={selectedSupplier.cuit}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCardIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Ingresos Brutos"
                        fullWidth
                        size="small"
                        name="ingresosBrutos"
                        value={selectedSupplier.ingresosBrutos}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ReceiptLongIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Segunda Sección - Contacto */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ContactPhoneIcon sx={{ mr: 1 }} />
                    Información de Contacto
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Teléfono"
                        fullWidth
                        size="small"
                        name="telefono"
                        value={selectedSupplier.telefono}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Celular"
                        fullWidth
                        size="small"
                        name="celular"
                        value={selectedSupplier.celular}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ContactPhoneIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Contacto"
                        fullWidth
                        size="small"
                        name="contacto"
                        value={selectedSupplier.contacto || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Email"
                        fullWidth
                        size="small"
                        name="email"
                        value={selectedSupplier.email || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon fontSize="small" />
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
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                onClick={isEditing ? handleSaveSupplier : handleNewSupplier}
                disabled={(isEditing && !selectedSupplier.razon) || loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEditing ? (
                  'Guardar Cambios'
                ) : (
                  'Nuevo Proveedor'
                )}
              </Button>
              {isEditing && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setIsEditing(false);
                    setIsNewSupplier(false);
                    setActiveTab(0); // Volver a la tabla
                    
                    // Restaurar datos originales si no es nuevo
                    if (!isNewSupplier) {
                      const originalSupplier = suppliers.find(s => s.codigo === selectedSupplier.codigo);
                      if (originalSupplier) {
                        setSelectedSupplier(originalSupplier);
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
              onClick={handleExitClick}
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
          <Tooltip title="Nuevo Proveedor" placement="left">
            <Fade in={!isEditing}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNewSupplier}
                disabled={isEditing}
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
      
      {/* Diálogo de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el proveedor <strong>{selectedSupplier.razon}</strong>?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteSupplier} 
            color="error" 
            autoFocus
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Salida */}
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
              setIsNewSupplier(false);
              setOpenExitDialog(false);
              setActiveTab(0);
              
              // Restaurar el proveedor original si estaba editando
              if (!isNewSupplier) {
                const originalSupplier = suppliers.find(s => s.codigo === selectedSupplier.codigo);
                if (originalSupplier) {
                  setSelectedSupplier(originalSupplier);
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

      {/* Diálogo de Exportación */}
      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
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
                setOpenExportDialog(false);
                handlePrintTable();
              }}
              fullWidth
            >
              Imprimir
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<FileDownloadIcon />} 
              onClick={() => {
                setOpenExportDialog(false);
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
                setOpenExportDialog(false);
                handleExportToExcel();
              }}
              fullWidth
            >
              Exportar a Excel (CSV)
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Nueva Ciudad */}
      <Dialog open={openCiudadDialog} onClose={() => setOpenCiudadDialog(false)}>
        <DialogTitle>Agregar Nueva Ciudad</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Ingrese el nombre de la ciudad que desea agregar:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de Ciudad"
            fullWidth
            value={nuevaCiudad}
            onChange={(e) => setNuevaCiudad(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCiudadDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleGuardarCiudad}
            variant="contained" 
            color="primary"
            disabled={!nuevaCiudad.trim()}
          >
            Guardar
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

export default ProveedoresPage;