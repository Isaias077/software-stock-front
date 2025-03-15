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
  TableSortLabel,
  TextField,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Container,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  InputAdornment,
  Divider,
  CircularProgress,
  Fade,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  Smartphone as SmartphoneIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  ShoppingCart as ShoppingCartIcon,
  PageviewOutlined as PageviewOutlinedIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  ExitToApp as ExitToAppIcon,
  Security as SecurityIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';

// Interfaz para los datos de usuario
interface Usuario {
  codigo: number;
  apellido: string;
  nombre: string;
  domicilio: string;
  ciudad: string;
  tipo: string;
  telefono: string;
  celular: string;
  usuario: string;
  contrasena: string;
}

// Datos iniciales de usuario
const initialUsuarios: Usuario[] = [
  {
    codigo: 1,
    apellido: 'USUARIO',
    nombre: 'USUARIO',
    domicilio: '',
    ciudad: 'CIUDAD',
    tipo: 'ADMINISTRADOR',
    telefono: '',
    celular: '',
    usuario: 'USUARIO',
    contrasena: ''
  }
];

// Tipos de usuario disponibles
const tiposUsuario = ['ADMINISTRADOR', 'OPERADOR', 'VENDEDOR', 'CONSULTA'];

// Ciudades disponibles
const ciudades = ['CIUDAD', 'BUENOS AIRES', 'CÓRDOBA', 'ROSARIO', 'MENDOZA'];

const UsuariosPage: React.FC = () => {
  // Refs
  const tableRef = useRef<HTMLDivElement>(null);

  // Estados
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario>(initialUsuarios[0]);
  const [highlightedRow, setHighlightedRow] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openExitDialog, setOpenExitDialog] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<string>('codigo');
  const [openCiudadDialog, setOpenCiudadDialog] = useState<boolean>(false);
  const [newCiudad, setNewCiudad] = useState<string>('');
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
  const totalUsuarios = usuarios.length;
  const adminUsuarios = usuarios.filter(u => u.tipo === 'ADMINISTRADOR').length;
  const vendedorUsuarios = usuarios.filter(u => u.tipo === 'VENDEDOR').length;
  
  // Filtrar usuarios basados en el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredUsuarios(usuarios);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = usuarios.filter(
        usuario => 
          usuario.apellido.toLowerCase().includes(searchLower) ||
          usuario.nombre.toLowerCase().includes(searchLower) ||
          usuario.usuario.toLowerCase().includes(searchLower)
      );
      setFilteredUsuarios(filtered);
    }
  }, [searchText, usuarios]);

  // Manejo de cambio de pestaña
  // @ts-ignore
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0 && isEditing) {
      setOpenExitDialog(true);
    }
  };

  // Funciones auxiliares
  const handleRowClick = (usuario: Usuario) => {
    if (!isEditing) {
      setSelectedUsuario(usuario);
      setHighlightedRow(usuario.codigo);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUsuario({
      ...selectedUsuario,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setSelectedUsuario({
      ...selectedUsuario,
      [name]: value
    });
  };

  // Función para obtener el ícono del tipo de usuario
  const getTipoUsuarioIcon = (tipo: string) => {
    switch (tipo) {
      case 'ADMINISTRADOR':
        return <AdminPanelSettingsIcon fontSize="small" />;
      case 'OPERADOR':
        return <SupervisorAccountIcon fontSize="small" />;
      case 'VENDEDOR':
        return <ShoppingCartIcon fontSize="small" />;
      case 'CONSULTA':
        return <PageviewOutlinedIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  // Función para obtener el color del tipo de usuario
  const getTipoUsuarioColor = (tipo: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (tipo) {
      case 'ADMINISTRADOR':
        return 'error';
      case 'OPERADOR':
        return 'primary';
      case 'VENDEDOR':
        return 'success';
      case 'CONSULTA':
        return 'info';
      default:
        return 'default';
    }
  };

  // Función para formatear el nombre completo
  const formatFullName = (apellido: string, nombre: string) => {
    return `${apellido}, ${nombre}`;
  };

  // Ordenar usuarios
  const handleSort = (field: keyof Usuario) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
    
    const sortedData = [...filteredUsuarios].sort((a, b) => {
      const valueA = a[field]?.toString().toLowerCase() || '';
      const valueB = b[field]?.toString().toLowerCase() || '';
      
      if (valueA < valueB) {
        return isAsc ? -1 : 1;
      }
      if (valueA > valueB) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsuarios(sortedData);
  };

  // Resetear búsqueda
  const resetSearch = () => {
    setSearchText('');
    setFilteredUsuarios(usuarios);
  };

  // Funciones de los botones
  const handleNuevo = () => {
    setLoading(true);
    
    // Simular procesamiento
    setTimeout(() => {
      // Crear nuevo usuario con código consecutivo
      const maxCodigo = Math.max(...usuarios.map(u => u.codigo), 0);
      const newUsuario: Usuario = {
        codigo: maxCodigo + 1,
        apellido: '',
        nombre: '',
        domicilio: '',
        ciudad: 'CIUDAD',
        tipo: 'ADMINISTRADOR',
        telefono: '',
        celular: '',
        usuario: '',
        contrasena: ''
      };

      setSelectedUsuario(newUsuario);
      setIsNewUser(true);
      setIsEditing(true);
      setHighlightedRow(-1); // Ninguna fila seleccionada
      setActiveTab(1); // Cambiar a la pestaña de detalles
      setLoading(false);
    }, 500);
  };

  const handleModificar = () => {
    if (highlightedRow > 0) {
      setIsEditing(true);
      setActiveTab(1); // Cambiar a la pestaña de detalles
    } else {
      setSnackbar({
        open: true,
        message: 'Seleccione un usuario para modificar',
        severity: 'warning'
      });
    }
  };

  const handleGuardar = () => {
    setLoading(true);
    
    // Simular procesamiento
    setTimeout(() => {
      // Validar campos obligatorios
      if (!selectedUsuario.apellido || !selectedUsuario.nombre || !selectedUsuario.usuario) {
        setSnackbar({
          open: true,
          message: 'Los campos Apellido, Nombre y Usuario son obligatorios',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (isNewUser) {
        // Añadir nuevo usuario
        setUsuarios([...usuarios, selectedUsuario]);
      } else {
        // Actualizar usuario existente
        setUsuarios(usuarios.map(user => 
          user.codigo === selectedUsuario.codigo ? selectedUsuario : user
        ));
      }

      setIsEditing(false);
      setIsNewUser(false);
      setHighlightedRow(selectedUsuario.codigo);
      setActiveTab(0); // Volver a la pestaña de listado
      
      setSnackbar({
        open: true,
        message: `Usuario ${isNewUser ? 'creado' : 'actualizado'} correctamente`,
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };

  const handleBorrar = () => {
    if (highlightedRow > 0) {
      setOpenDeleteDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Seleccione un usuario para eliminar',
        severity: 'warning'
      });
    }
  };

  const confirmDeleteUser = () => {
    setLoading(true);
    
    // Simular procesamiento
    setTimeout(() => {
      // Eliminar el usuario
      const updatedUsuarios = usuarios.filter(
        usuario => usuario.codigo !== selectedUsuario.codigo
      );
      
      setUsuarios(updatedUsuarios);
      
      // Si quedan usuarios, seleccionar el primero
      if (updatedUsuarios.length > 0) {
        setSelectedUsuario(updatedUsuarios[0]);
        setHighlightedRow(updatedUsuarios[0].codigo);
      } else {
        // Si no quedan usuarios, crear uno vacío
        const emptyUser: Usuario = {
          codigo: 1,
          apellido: '',
          nombre: '',
          domicilio: '',
          ciudad: 'CIUDAD',
          tipo: 'ADMINISTRADOR',
          telefono: '',
          celular: '',
          usuario: '',
          contrasena: ''
        };
        setSelectedUsuario(emptyUser);
        setHighlightedRow(-1);
      }
      
      setOpenDeleteDialog(false);
      
      setSnackbar({
        open: true,
        message: 'Usuario eliminado correctamente',
        severity: 'success'
      });
      
      setLoading(false);
    }, 800);
  };

  const handleImprimir = () => {
    setLoading(true);
    
    // Simular procesamiento
    setTimeout(() => {
      if (usuarios.length === 0) {
        setSnackbar({
          open: true,
          message: 'No hay usuarios para imprimir',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }
      
      // Crear una nueva tabla HTML para imprimir
      const printContent = document.createElement('div');
      
      // Añadir estilos para la impresión
      printContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; }
          h2 { font-size: 16px; margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr.destacado { background-color: #90caf9; }
          .fecha { font-size: 12px; margin-bottom: 15px; }
          @media print {
            body * { visibility: hidden; }
            #print-content, #print-content * { visibility: visible; }
            #print-content { position: absolute; left: 0; top: 0; width: 100%; }
          }
        </style>
        <div id="print-content">
          <h2>Listado General de Usuarios</h2>
          <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Domicilio</th>
                <th>Ciudad</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              ${usuarios.map(usuario => `
                <tr ${usuario.codigo === highlightedRow ? 'class="destacado"' : ''}>
                  <td>${usuario.codigo}</td>
                  <td>${usuario.apellido}</td>
                  <td>${usuario.nombre}</td>
                  <td>${usuario.domicilio}</td>
                  <td>${usuario.ciudad}</td>
                  <td>${usuario.tipo}</td>
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

  const handleSalir = () => {
    if (isEditing) {
      setOpenExitDialog(true);
    } else {
      // Aquí podrías redirigir o cerrar el componente según tu aplicación
      setSnackbar({
        open: true,
        message: 'Saliendo del módulo de usuarios',
        severity: 'info'
      });
    }
  };

  const handleAddCiudad = () => {
    if (newCiudad && !ciudades.includes(newCiudad)) {
      // Esta es una simulación. En una app real, probablemente actualizarías una base de datos
      //@ts-ignore
      const updatedCiudades = [...ciudades, newCiudad];
      // Actualizar el usuario seleccionado con la nueva ciudad
      setSelectedUsuario({
        ...selectedUsuario,
        ciudad: newCiudad
      });
      
      setSnackbar({
        open: true,
        message: 'Ciudad agregada correctamente',
        severity: 'success'
      });
    }
    setOpenCiudadDialog(false);
    setNewCiudad('');
  };

  const handleCiudadNuevo = () => {
    setOpenCiudadDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Comprobar si un botón debe estar deshabilitado
  const isButtonDisabled = (buttonType: string): boolean => {
    switch (buttonType) {
      case 'nuevo':
        return isEditing;
      case 'modificar':
        return isEditing || usuarios.length === 0;
      case 'guardar':
        return !isEditing;
      case 'borrar':
        return isEditing || usuarios.length === 0;
      case 'imprimir':
        return usuarios.length === 0;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section with Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          Gestión de Usuarios
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar usuarios..."
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && resetSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={resetSearch}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 250 }}
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => {}} // No es necesario un manejador separado ya que el filtrado es dinámico
            size="small"
          >
            Buscar
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
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
                      Total de Usuarios
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {totalUsuarios}
                    </Typography>
                  </Box>
                  <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
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
                      Administradores
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {adminUsuarios}
                    </Typography>
                  </Box>
                  <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.8 }} />
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
                      Vendedores
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {vendedorUsuarios}
                    </Typography>
                  </Box>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs Section */}
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
            icon={<GroupsIcon />} 
            iconPosition="start" 
            label="Listado de Usuarios" 
            sx={{ px: 3 }}
          />
          <Tab 
            icon={<AccountCircleIcon />} 
            iconPosition="start" 
            label="Datos del Usuario" 
          />
        </Tabs>
      </Box>

      {/* Main Content Area based on selected Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Listado General de Usuarios ({filteredUsuarios.length})
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Imprimir Listado">
                  <IconButton 
                    color="primary" 
                    onClick={handleImprimir}
                    disabled={isButtonDisabled('imprimir')}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Actualizar">
                  <IconButton 
                    color="primary" 
                    onClick={() => setFilteredUsuarios(usuarios)}
                  >
                    <RefreshIcon />
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
                      direction={sortOrder}
                      onClick={() => handleSort('codigo')}
                    >
                      Código
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'apellido'}
                      direction={sortOrder}
                      onClick={() => handleSort('apellido')}
                    >
                      Apellido y Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'ciudad'}
                      direction={sortOrder}
                      onClick={() => handleSort('ciudad')}
                    >
                      Ciudad
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'tipo'}
                      direction={sortOrder}
                      onClick={() => handleSort('tipo')}
                    >
                      Tipo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'usuario'}
                      direction={sortOrder}
                      onClick={() => handleSort('usuario')}
                    >
                      Usuario
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <TableRow
                      key={usuario.codigo}
                      onClick={() => handleRowClick(usuario)}
                      sx={{
                        cursor: isEditing ? 'not-allowed' : 'pointer',
                        backgroundColor: highlightedRow === usuario.codigo ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                        '&:hover': { backgroundColor: isEditing ? undefined : 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {usuario.codigo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              mr: 1, 
                              bgcolor: 'primary.main',
                              fontSize: '0.8rem'
                            }}
                          >
                            {usuario.apellido.charAt(0)}{usuario.nombre.charAt(0)}
                          </Avatar>
                          {formatFullName(usuario.apellido, usuario.nombre)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {usuario.ciudad && (
                          <Chip 
                            icon={<LocationOnIcon fontSize="small" />}
                            label={usuario.ciudad} 
                            size="small" 
                            sx={{ 
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText',
                              fontWeight: 'medium'
                            }} 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getTipoUsuarioIcon(usuario.tipo)}
                          label={usuario.tipo} 
                          size="small" 
                          color={getTipoUsuarioColor(usuario.tipo)}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            fontWeight: 'medium' 
                          }}
                        >
                          <AccountCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {usuario.usuario}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(usuario);
                                handleModificar();
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
                                handleRowClick(usuario);
                                handleBorrar();
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
                      {searchText ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <SearchIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No se encontraron usuarios para "{searchText}"
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
                          <PersonIcon color="disabled" sx={{ fontSize: 40 }} />
                          <Typography variant="body1" color="textSecondary">
                            No hay usuarios disponibles
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<AddIcon />}
                            onClick={handleNuevo}
                            sx={{ mt: 1 }}
                          >
                            Agregar Usuario
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Botones de acciones */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
            <Stack direction="row" spacing={1}>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<AddIcon />}
                onClick={handleNuevo}
                disabled={isButtonDisabled('nuevo')}
              >
                Nuevo
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
                onClick={handleModificar}
                disabled={isButtonDisabled('modificar')}
              >
                Modificar
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={handleBorrar}
                disabled={isButtonDisabled('borrar')}
              >
                Borrar
              </Button>
              <Button 
                variant="contained" 
                color="info" 
                startIcon={<PrintIcon />}
                onClick={handleImprimir}
                disabled={isButtonDisabled('imprimir')}
              >
                Imprimir
              </Button>
            </Stack>
            
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<ExitToAppIcon />}
              onClick={handleSalir}
            >
              Salir
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Usuario Detail Section */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                {isNewUser ? 
                  'Nuevo Usuario' : 
                  `Editando: ${formatFullName(selectedUsuario.apellido, selectedUsuario.nombre)}`
                }
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
              {/* Información Personal */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Información Personal
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Código"
                        fullWidth
                        size="small"
                        name="codigo"
                        value={selectedUsuario.codigo}
                        disabled={true} // Código siempre deshabilitado
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Apellido"
                        fullWidth
                        size="small"
                        name="apellido"
                        value={selectedUsuario.apellido}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        error={isEditing && !selectedUsuario.apellido}
                        helperText={isEditing && !selectedUsuario.apellido ? "Campo requerido" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Nombre"
                        fullWidth
                        size="small"
                        name="nombre"
                        value={selectedUsuario.nombre}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        error={isEditing && !selectedUsuario.nombre}
                        helperText={isEditing && !selectedUsuario.nombre ? "Campo requerido" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Domicilio"
                        fullWidth
                        size="small"
                        name="domicilio"
                        value={selectedUsuario.domicilio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Ciudad</InputLabel>
                          <Select
                            name="ciudad"
                            value={selectedUsuario.ciudad}
                            label="Ciudad"
                            onChange={handleSelectChange}
                            disabled={!isEditing}
                            startAdornment={
                              <InputAdornment position="start">
                                <LocationOnIcon fontSize="small" sx={{ ml: 1 }} />
                              </InputAdornment>
                            }
                          >
                            {ciudades.map(ciudad => (
                              <MenuItem key={ciudad} value={ciudad}>{ciudad}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Tooltip title="Agregar Nueva Ciudad">
                          <span>
                            <IconButton 
                              size="small"
                              color="primary"
                              sx={{ ml: 1 }}
                              onClick={handleCiudadNuevo}
                              disabled={!isEditing}
                            >
                              <AddIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Información de Contacto */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    Información de Contacto
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Teléfono"
                        fullWidth
                        size="small"
                        name="telefono"
                        value={selectedUsuario.telefono}
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Celular"
                        fullWidth
                        size="small"
                        name="celular"
                        value={selectedUsuario.celular}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SmartphoneIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Información de Cuenta */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <SecurityIcon sx={{ mr: 1 }} />
                    Información de Cuenta
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Tipo de Usuario</InputLabel>
                        <Select
                          name="tipo"
                          value={selectedUsuario.tipo}
                          label="Tipo de Usuario"
                          onChange={handleSelectChange}
                          disabled={!isEditing}
                          startAdornment={
                            <InputAdornment position="start">
                              {getTipoUsuarioIcon(selectedUsuario.tipo)}
                            </InputAdornment>
                          }
                        >
                          {tiposUsuario.map(tipo => (
                            <MenuItem key={tipo} value={tipo}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getTipoUsuarioIcon(tipo)}
                                <Box sx={{ ml: 1 }}>{tipo}</Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Usuario"
                        fullWidth
                        size="small"
                        name="usuario"
                        value={selectedUsuario.usuario}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        error={isEditing && !selectedUsuario.usuario}
                        helperText={isEditing && !selectedUsuario.usuario ? "Campo requerido" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Contraseña"
                        fullWidth
                        size="small"
                        name="contrasena"
                        type="password"
                        value={selectedUsuario.contrasena}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon fontSize="small" />
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
          
          {/* Bottom action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleGuardar}
                disabled={!isEditing || loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setIsEditing(false);
                  setActiveTab(0);
                  
                  // Restaurar datos originales si no es nuevo
                  if (!isNewUser) {
                    const originalUser = usuarios.find(u => u.codigo === selectedUsuario.codigo);
                    if (originalUser) {
                      setSelectedUsuario(originalUser);
                    }
                  } else {
                    // Si era nuevo, seleccionar el primer usuario
                    if (usuarios.length > 0) {
                      setSelectedUsuario(usuarios[0]);
                      setHighlightedRow(usuarios[0].codigo);
                    }
                  }
                }}
                disabled={!isEditing || loading}
              >
                Cancelar
              </Button>
            </Box>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToAppIcon />}
              onClick={handleSalir}
            >
              Salir
            </Button>
          </Box>
        </Card>
      </Box>
      
      {/* Floating action button for add new (only in list mode) */}
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
          <Tooltip title="Nuevo Usuario" placement="left">
            <Fade in={!isEditing}>
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleNuevo}
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

      {/* Acciones Rápidas */}
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          left: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Tooltip title="Imprimir Lista" placement="right">
          <Fade in={activeTab === 0}>
            <Button 
              variant="contained" 
              color="info" 
              onClick={handleImprimir}
              disabled={isButtonDisabled('imprimir')}
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%',
                boxShadow: 2
              }}
            >
              <PrintIcon />
            </Button>
          </Fade>
        </Tooltip>
      </Box>

      {/* Dialogs */}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Confirmar eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el usuario {selectedUsuario.apellido} {selectedUsuario.nombre}?
            Esta acción no se puede deshacer.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                icon={getTipoUsuarioIcon(selectedUsuario.tipo)}
                label={selectedUsuario.tipo} 
                size="small" 
                color={getTipoUsuarioColor(selectedUsuario.tipo)}
                sx={{ mr: 1 }}
              />
              <Typography variant="subtitle2" color="primary">
                {formatFullName(selectedUsuario.apellido, selectedUsuario.nombre)}
              </Typography>
            </Box>
            <Typography variant="body2">
              Usuario: <b>{selectedUsuario.usuario}</b>
            </Typography>
            <Typography variant="body2">
              Ciudad: {selectedUsuario.ciudad || 'No disponible'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteUser} 
            color="error" 
            autoFocus
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Dialog */}
      <Dialog
        open={openExitDialog}
        onClose={() => setOpenExitDialog(false)}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            Confirmar salida
          </Box>
        </DialogTitle>
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
              setIsNewUser(false);
              setOpenExitDialog(false);
              setActiveTab(0);
              
              // Restaurar el usuario original si estaba editando
              if (!isNewUser) {
                const originalUser = usuarios.find(u => u.codigo === selectedUsuario.codigo);
                if (originalUser) {
                  setSelectedUsuario(originalUser);
                }
              } else {
                // Si era nuevo, seleccionar el primer usuario
                if (usuarios.length > 0) {
                  setSelectedUsuario(usuarios[0]);
                  setHighlightedRow(usuarios[0].codigo);
                }
              }
            }} 
            color="error" 
            autoFocus
            startIcon={<ExitToAppIcon />}
          >
            Salir sin guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New City Dialog */}
      <Dialog 
        open={openCiudadDialog} 
        onClose={() => setOpenCiudadDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
            Agregar Nueva Ciudad
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Ciudad"
            fullWidth
            variant="outlined"
            value={newCiudad}
            onChange={(e) => setNewCiudad(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCiudadDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddCiudad} 
            variant="contained" 
            color="primary"
            disabled={!newCiudad.trim()}
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
          sx={{ minWidth: '250px' }}
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

export default UsuariosPage;