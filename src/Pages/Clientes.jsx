//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
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
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment,
  IconButton,
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
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Container,
  Divider,
  CircularProgress,
  Fade,
  Autocomplete
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  ExitToApp as ExitToAppIcon,
  ArrowForward as ArrowForwardIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CreditCard as CreditCardIcon,
  Facebook as FacebookIcon,
  PriceChange as PriceChangeIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Group as GroupIcon
} from '@mui/icons-material';

function ClientPage() {
  // Sample data for the members list
  const initialMembers = [
    { id: 1, apellido: 'CONSUMIDOR FINAL', nombre: '', ciudad: 'CIUDAD', telefono: '', dni: '' },
    { id: 2, apellido: 'MARTINEZ', nombre: 'JUAN', ciudad: 'CORDOBA', telefono: '351-123456', dni: '28456789' },
    { id: 3, apellido: 'GONZALEZ', nombre: 'MARIA', ciudad: 'BUENOS AIRES', telefono: '11-987654', dni: '30123456' },
  ];

  // Refs
  const tableRef = useRef(null);

  // State management
  const [members, setMembers] = useState(initialMembers);
  const [filteredMembers, setFilteredMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberData, setMemberData] = useState({
    id: null,
    apellido: '',
    nombre: '',
    domicilio: '',
    ciudad: '',
    telefono: '',
    celular: '',
    nroDocumento: '',
    tipoDocumento: 'DNI',
    categoria: 'CONSUMIDOR FINAL',
    correoElectronico: '',
    facebook: '',
    precioLista: 'LISTA 1'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [cities, setCities] = useState(['CIUDAD', 'CORDOBA', 'BUENOS AIRES', 'ROSARIO', 'MENDOZA']);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('apellido');

  // Stats for dashboard
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.id !== 1).length; // Excluding 'CONSUMIDOR FINAL'
  const citiesCount = [...new Set(members.map(m => m.ciudad))].length;

  // Load member data when selecting a member
  useEffect(() => {
    if (selectedMember) {
      const member = members.find(m => m.id === selectedMember);
      if (member) {
        setMemberData({
          id: member.id,
          apellido: member.apellido || '',
          nombre: member.nombre || '',
          domicilio: member.domicilio || '',
          ciudad: member.ciudad || '',
          telefono: member.telefono || '',
          celular: member.celular || '',
          nroDocumento: member.dni || '',
          tipoDocumento: member.tipoDocumento || 'DNI',
          categoria: member.categoria || 'CONSUMIDOR FINAL',
          correoElectronico: member.correoElectronico || '',
          facebook: member.facebook || '',
          precioLista: member.precioLista || 'LISTA 1'
        });
      }
    }
  }, [selectedMember, members]);

  // Filter members based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredMembers(members);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = members.filter(
        member => 
          member.apellido.toLowerCase().includes(searchLower) ||
          (member.nombre && member.nombre.toLowerCase().includes(searchLower)) ||
          (member.dni && member.dni.includes(searchText))
      );
      setFilteredMembers(filtered);
    }
  }, [searchText, members]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0 && isEditing) {
      setDialogOpen(true);
    }
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new member
  const handleNew = () => {
    setIsEditing(true);
    setSelectedMember(null);
    setMemberData({
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
      apellido: '',
      nombre: '',
      domicilio: '',
      ciudad: '',
      telefono: '',
      celular: '',
      nroDocumento: '',
      tipoDocumento: 'DNI',
      categoria: 'CONSUMIDOR FINAL',
      correoElectronico: '',
      facebook: '',
      precioLista: 'LISTA 1'
    });
    setActiveTab(1);
  };

  // Edit selected member
  const handleEdit = () => {
    if (!selectedMember) {
      setSnackbar({
        open: true,
        message: 'Por favor seleccione un socio para modificar',
        severity: 'warning'
      });
      return;
    }
    setIsEditing(true);
    setActiveTab(1);
  };

  // Save member data
  const handleSave = () => {
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      if (!memberData.apellido) {
        setSnackbar({
          open: true,
          message: 'El apellido es obligatorio',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (selectedMember) {
        // Update existing member
        setMembers(members.map(member => 
          member.id === selectedMember ? 
          {
            ...member,
            apellido: memberData.apellido,
            nombre: memberData.nombre,
            domicilio: memberData.domicilio,
            ciudad: memberData.ciudad,
            telefono: memberData.telefono,
            celular: memberData.celular,
            dni: memberData.nroDocumento,
            tipoDocumento: memberData.tipoDocumento,
            categoria: memberData.categoria,
            correoElectronico: memberData.correoElectronico,
            facebook: memberData.facebook,
            precioLista: memberData.precioLista
          } : member
        ));
        setSnackbar({
          open: true,
          message: 'Socio actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Add new member
        setMembers([...members, {
          id: memberData.id,
          apellido: memberData.apellido,
          nombre: memberData.nombre,
          ciudad: memberData.ciudad,
          telefono: memberData.telefono,
          dni: memberData.nroDocumento,
          domicilio: memberData.domicilio,
          celular: memberData.celular,
          tipoDocumento: memberData.tipoDocumento,
          categoria: memberData.categoria,
          correoElectronico: memberData.correoElectronico,
          facebook: memberData.facebook,
          precioLista: memberData.precioLista
        }]);
        setSnackbar({
          open: true,
          message: 'Nuevo socio agregado correctamente',
          severity: 'success'
        });
      }
      
      setIsEditing(false);
      setActiveTab(0);
      setLoading(false);
    }, 800);
  };

  // Delete member
  const handleDelete = () => {
    if (!selectedMember) {
      setSnackbar({
        open: true,
        message: 'Por favor seleccione un socio para eliminar',
        severity: 'warning'
      });
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setMembers(members.filter(member => member.id !== selectedMember));
      setSelectedMember(null);
      setMemberData({
        id: null,
        apellido: '',
        nombre: '',
        domicilio: '',
        ciudad: '',
        telefono: '',
        celular: '',
        nroDocumento: '',
        tipoDocumento: 'DNI',
        categoria: 'CONSUMIDOR FINAL',
        correoElectronico: '',
        facebook: '',
        precioLista: 'LISTA 1'
      });
      setConfirmDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Socio eliminado correctamente',
        severity: 'success'
      });
      setLoading(false);
    }, 800);
  };

  // Handle print
  const handlePrint = () => {
    if (!selectedMember) {
      setSnackbar({
        open: true,
        message: 'Por favor seleccione un socio para imprimir',
        severity: 'warning'
      });
      return;
    }
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: 'Imprimiendo datos del socio...',
        severity: 'info'
      });
      setLoading(false);
      // In a real app, this would connect to a printing service
      window.print();
    }, 800);
  };

  // Handle exit
  const handleExit = () => {
    if (isEditing) {
      setDialogOpen(true);
    } else {
      // In a real app, this would navigate away or close the application
      setSnackbar({
        open: true,
        message: 'Saliendo del sistema...',
        severity: 'info'
      });
      // Simulate application exit after delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchText) {
      setSnackbar({
        open: true,
        message: 'Ingrese un texto para buscar',
        severity: 'info'
      });
      return;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = members.filter(
      member => 
        member.apellido.toLowerCase().includes(searchLower) ||
        (member.nombre && member.nombre.toLowerCase().includes(searchLower)) ||
        (member.dni && member.dni.includes(searchText))
    );
    
    if (filtered.length === 0) {
      setSnackbar({
        open: true,
        message: 'No se encontraron resultados',
        severity: 'info'
      });
    } else {
      setFilteredMembers(filtered);
      setSnackbar({
        open: true,
        message: `Se encontraron ${filtered.length} resultado(s)`,
        severity: 'success'
      });
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearchText('');
    setFilteredMembers(members);
  };

  // Add new city
  const handleAddCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity]);
      setMemberData({...memberData, ciudad: newCity});
      setSnackbar({
        open: true,
        message: 'Ciudad agregada correctamente',
        severity: 'success'
      });
    }
    setCityDialogOpen(false);
    setNewCity('');
  };

  // Show price list
  const handleShowPriceList = () => {
    setSnackbar({
      open: true,
      message: `Mostrando lista de precios: ${memberData.precioLista}`,
      severity: 'info'
    });
  };

  // Handle sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
    
    const sortedData = [...filteredMembers].sort((a, b) => {
      // Determine if they are strings or numbers
      const valueA = a[field] ? a[field].toString().toLowerCase() : '';
      const valueB = b[field] ? b[field].toString().toLowerCase() : '';
      
      if (valueA < valueB) {
        return isAsc ? -1 : 1;
      }
      if (valueA > valueB) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredMembers(sortedData);
  };

  // Format name for display
  const formatFullName = (apellido, nombre) => {
    if (!nombre) return apellido;
    return `${apellido}, ${nombre}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section with Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1 }} />
          Gestión de Socios
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar socios..."
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            onClick={handleSearch}
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
                      Total de Socios
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {totalMembers}
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
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
                      Socios Activos
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {activeMembers}
                    </Typography>
                  </Box>
                  <GroupIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card 
              elevation={2}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #e0f7fa 30%, #b2ebf2 90%)',
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
                      Ciudades Registradas
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {citiesCount}
                    </Typography>
                  </Box>
                  <LocationOnIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.8 }} />
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
            icon={<PersonIcon />} 
            iconPosition="start" 
            label="Listado de Socios" 
            sx={{ px: 3 }}
          />
          <Tab 
            icon={<BadgeIcon />} 
            iconPosition="start" 
            label="Datos del Socio" 
          />
        </Tabs>
      </Box>

      {/* Main Content Area based on selected Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Listado General de Socios ({filteredMembers.length})
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Imprimir Listado">
                  <IconButton 
                    color="primary" 
                    onClick={handlePrint}
                    disabled={!selectedMember}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Actualizar">
                  <IconButton 
                    color="primary" 
                    onClick={() => setFilteredMembers(members)}
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
                      active={sortField === 'id'}
                      direction={sortField === 'id' ? sortOrder : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      Código
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'apellido'}
                      direction={sortField === 'apellido' ? sortOrder : 'asc'}
                      onClick={() => handleSort('apellido')}
                    >
                      Apellido y Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'ciudad'}
                      direction={sortField === 'ciudad' ? sortOrder : 'asc'}
                      onClick={() => handleSort('ciudad')}
                    >
                      Ciudad
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'telefono'}
                      direction={sortField === 'telefono' ? sortOrder : 'asc'}
                      onClick={() => handleSort('telefono')}
                    >
                      Teléfono
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'dni'}
                      direction={sortField === 'dni' ? sortOrder : 'asc'}
                      onClick={() => handleSort('dni')}
                    >
                      DNI
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow 
                      key={member.id}
                      onClick={() => {
                        if (!isEditing) {
                          setSelectedMember(member.id);
                        }
                      }}
                      sx={{ 
                        cursor: isEditing ? 'not-allowed' : 'pointer',
                        backgroundColor: selectedMember === member.id ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                        '&:hover': { backgroundColor: isEditing ? undefined : 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {member.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatFullName(member.apellido, member.nombre)}</TableCell>
                      <TableCell>
                        {member.ciudad && (
                          <Chip 
                            icon={<LocationOnIcon fontSize="small" />}
                            label={member.ciudad} 
                            size="small" 
                            sx={{ 
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText',
                              fontWeight: 'medium'
                            }} 
                          />
                        )}
                      </TableCell>
                      <TableCell>{member.telefono}</TableCell>
                      <TableCell>{member.dni}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member.id);
                                handleEdit();
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
                                setSelectedMember(member.id);
                                handleDelete();
                              }}
                              disabled={isEditing}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Imprimir">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member.id);
                                handlePrint();
                              }}
                              disabled={isEditing}
                            >
                              <PrintIcon fontSize="small" />
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
                            No se encontraron socios para "{searchText}"
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
                            No hay socios disponibles
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<AddIcon />}
                            onClick={handleNew}
                            sx={{ mt: 1 }}
                          >
                            Agregar Socio
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Actions Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
            <Stack direction="row" spacing={1}>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<AddIcon />}
                onClick={handleNew}
                disabled={isEditing}
              >
                Nuevo
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
                onClick={handleEdit}
                disabled={isEditing || !selectedMember}
              >
                Modificar
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={isEditing || !selectedMember}
              >
                Borrar
              </Button>
              <Button 
                variant="contained" 
                color="info" 
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                disabled={isEditing || !selectedMember}
              >
                Imprimir
              </Button>
            </Stack>
            
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<ExitToAppIcon />}
              onClick={handleExit}
            >
              Salir
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Socio Detail Section */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                {selectedMember ? 
                  `Editando: ${formatFullName(memberData.apellido, memberData.nombre)}` : 
                  'Nuevo Socio'
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        name="apellido"
                        size="small"
                        value={memberData.apellido}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        error={isEditing && !memberData.apellido}
                        helperText={isEditing && !memberData.apellido ? "Campo requerido" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        size="small"
                        value={memberData.nombre}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nº Documento"
                        name="nroDocumento"
                        size="small"
                        value={memberData.nroDocumento}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Tipo de Documento</InputLabel>
                        <Select
                          name="tipoDocumento"
                          value={memberData.tipoDocumento}
                          onChange={handleInputChange}
                          label="Tipo de Documento"
                          disabled={!isEditing}
                          startAdornment={
                            <InputAdornment position="start">
                              <BadgeIcon fontSize="small" sx={{ ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="DNI">DNI</MenuItem>
                          <MenuItem value="CUIT">CUIT</MenuItem>
                          <MenuItem value="PASSPORT">PASAPORTE</MenuItem>
                        </Select>
                      </FormControl>
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Domicilio"
                        name="domicilio"
                        size="small"
                        value={memberData.domicilio}
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
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Ciudad</InputLabel>
                          <Select
                            name="ciudad"
                            value={memberData.ciudad}
                            onChange={handleInputChange}
                            label="Ciudad"
                            disabled={!isEditing}
                            startAdornment={
                              <InputAdornment position="start">
                                <LocationOnIcon fontSize="small" sx={{ ml: 1 }} />
                              </InputAdornment>
                            }
                          >
                            {cities.map((city) => (
                              <MenuItem key={city} value={city}>{city}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Tooltip title="Agregar Nueva Ciudad">
                          <span>
                            <IconButton 
                              size="small" 
                              sx={{ ml: 1 }}
                              onClick={() => setCityDialogOpen(true)}
                              disabled={!isEditing}
                              color="primary"
                            >
                              <AddIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        size="small"
                        value={memberData.telefono}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Celular"
                        name="celular"
                        size="small"
                        value={memberData.celular}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="correoElectronico"
                        size="small"
                        value={memberData.correoElectronico}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Facebook (www.facebook.com/)"
                        name="facebook"
                        size="small"
                        value={memberData.facebook}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FacebookIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Información Comercial */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1 }} />
                    Información Comercial
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Categoría</InputLabel>
                        <Select
                          name="categoria"
                          value={memberData.categoria}
                          onChange={handleInputChange}
                          label="Categoría"
                          disabled={!isEditing}
                          startAdornment={
                            <InputAdornment position="start">
                              <CreditCardIcon fontSize="small" sx={{ ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="CONSUMIDOR FINAL">CONSUMIDOR FINAL</MenuItem>
                          <MenuItem value="RESPONSABLE INSCRIPTO">RESPONSABLE INSCRIPTO</MenuItem>
                          <MenuItem value="MONOTRIBUTO">MONOTRIBUTO</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Precio de Lista</InputLabel>
                          <Select
                            name="precioLista"
                            value={memberData.precioLista}
                            onChange={handleInputChange}
                            label="Precio de Lista"
                            disabled={!isEditing}
                            startAdornment={
                              <InputAdornment position="start">
                                <PriceChangeIcon fontSize="small" sx={{ ml: 1 }} />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="LISTA 1">LISTA 1</MenuItem>
                            <MenuItem value="LISTA 2">LISTA 2</MenuItem>
                            <MenuItem value="LISTA 3">LISTA 3</MenuItem>
                          </Select>
                        </FormControl>
                        <Tooltip title="Ver Lista de Precios">
                          <span>
                            <IconButton 
                              color="info"
                              sx={{ ml: 1 }}
                              onClick={handleShowPriceList}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
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
                onClick={handleSave}
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
                  if (selectedMember) {
                    const member = members.find(m => m.id === selectedMember);
                    if (member) {
                      setMemberData({
                        id: member.id,
                        apellido: member.apellido || '',
                        nombre: member.nombre || '',
                        domicilio: member.domicilio || '',
                        ciudad: member.ciudad || '',
                        telefono: member.telefono || '',
                        celular: member.celular || '',
                        nroDocumento: member.dni || '',
                        tipoDocumento: member.tipoDocumento || 'DNI',
                        categoria: member.categoria || 'CONSUMIDOR FINAL',
                        correoElectronico: member.correoElectronico || '',
                        facebook: member.facebook || '',
                        precioLista: member.precioLista || 'LISTA 1'
                      });
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
              onClick={handleExit}
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
          <Tooltip title="Nuevo Socio" placement="left">
            <Fade in={!isEditing}>
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleNew}
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

      {/* Dialogs */}
      
      {/* Exit Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hay cambios sin guardar. ¿Desea salir sin guardar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setIsEditing(false);
              setActiveTab(0);
              // Reload state from selected member or clear
              if (selectedMember) {
                const member = members.find(m => m.id === selectedMember);
                if (member) {
                  setMemberData({
                    id: member.id,
                    apellido: member.apellido || '',
                    nombre: member.nombre || '',
                    domicilio: member.domicilio || '',
                    ciudad: member.ciudad || '',
                    telefono: member.telefono || '',
                    celular: member.celular || '',
                    nroDocumento: member.dni || '',
                    tipoDocumento: member.tipoDocumento || 'DNI',
                    categoria: member.categoria || 'CONSUMIDOR FINAL',
                    correoElectronico: member.correoElectronico || '',
                    facebook: member.facebook || '',
                    precioLista: member.precioLista || 'LISTA 1'
                  });
                }
              } else {
                setMemberData({
                  id: null,
                  apellido: '',
                  nombre: '',
                  domicilio: '',
                  ciudad: '',
                  telefono: '',
                  celular: '',
                  nroDocumento: '',
                  tipoDocumento: 'DNI',
                  categoria: 'CONSUMIDOR FINAL',
                  correoElectronico: '',
                  facebook: '',
                  precioLista: 'LISTA 1'
                });
              }
            }} 
            color="error"
            autoFocus
          >
            Salir sin guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New City Dialog */}
      <Dialog 
        open={cityDialogOpen} 
        onClose={() => setCityDialogOpen(false)}
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
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
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
          <Button onClick={() => setCityDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddCity} 
            variant="contained" 
            color="primary"
            disabled={!newCity.trim()}
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este socio? Esta acción no se puede deshacer.
          </DialogContentText>
          {selectedMember && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary">
                {formatFullName(memberData.apellido, memberData.nombre)}
              </Typography>
              <Typography variant="body2">
                DNI: {memberData.nroDocumento || 'No disponible'}
              </Typography>
              <Typography variant="body2">
                Ciudad: {memberData.ciudad || 'No disponible'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            autoFocus
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
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
}

export default ClientPage;