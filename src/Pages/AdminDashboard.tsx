import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Divider,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Tooltip,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  TreeView,
  TreeItem
} from '@mui/material';


// Icons
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveIcon from '@mui/icons-material/Save';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import { Report as ReportIcon } from '@mui/icons-material';
// Interfaces
interface CashRegister {
  id: number;
  name: string;
  location: string;
  status: 'open' | 'closed';
  currentBalance: number;
  lastOpened?: string;
  lastClosed?: string;
  assignedUser?: string;
  openedBy?: string;
}

interface CashRegisterHistory {
  id: number;
  registerId: number;
  registerName: string;
  action: 'open' | 'close' | 'add' | 'withdraw';
  amount: number;
  date: string;
  user: string;
  notes?: string;
}

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin?: string;
  avatar?: string;
}

interface Permission {
  id: number;
  module: string;
  action: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: number[];
}

// Sample data
const cashRegisters: CashRegister[] = [
  { id: 1, name: 'Caja Central', location: 'Sucursal Principal', status: 'open', currentBalance: 15750.25, lastOpened: '2023-04-30 08:30:00', assignedUser: 'jperez', openedBy: 'admin' },
  { id: 2, name: 'Caja 1', location: 'Sucursal Norte', status: 'open', currentBalance: 8320.50, lastOpened: '2023-04-30 09:15:00', assignedUser: 'mlopez', openedBy: 'mlopez' },
  { id: 3, name: 'Caja 2', location: 'Sucursal Norte', status: 'closed', currentBalance: 0, lastClosed: '2023-04-29 20:00:00' },
  { id: 4, name: 'Caja Express', location: 'Sucursal Sur', status: 'open', currentBalance: 5210.75, lastOpened: '2023-04-30 08:45:00', assignedUser: 'agarcia', openedBy: 'agarcia' },
  { id: 5, name: 'Caja 1', location: 'Sucursal Este', status: 'closed', currentBalance: 0, lastClosed: '2023-04-29 21:10:00' },
  { id: 6, name: 'Caja 2', location: 'Sucursal Este', status: 'closed', currentBalance: 0, lastClosed: '2023-04-29 21:15:00' },
  { id: 7, name: 'Caja Principal', location: 'Sucursal Oeste', status: 'open', currentBalance: 12450.00, lastOpened: '2023-04-30 08:00:00', assignedUser: 'frodriguez', openedBy: 'admin' },
];

const cashRegisterHistory: CashRegisterHistory[] = [
  { id: 1, registerId: 1, registerName: 'Caja Central', action: 'open', amount: 10000, date: '2023-04-30 08:30:00', user: 'admin', notes: 'Apertura de caja' },
  { id: 2, registerId: 1, registerName: 'Caja Central', action: 'add', amount: 5750.25, date: '2023-04-30 12:15:00', user: 'jperez', notes: 'Ingreso ventas mañana' },
  { id: 3, registerId: 2, registerName: 'Caja 1', action: 'open', amount: 5000, date: '2023-04-30 09:15:00', user: 'mlopez', notes: 'Apertura de caja' },
  { id: 4, registerId: 2, registerName: 'Caja 1', action: 'add', amount: 3320.50, date: '2023-04-30 14:30:00', user: 'mlopez', notes: 'Ingreso ventas' },
  { id: 5, registerId: 3, registerName: 'Caja 2', action: 'close', amount: 7800.25, date: '2023-04-29 20:00:00', user: 'pdiaz', notes: 'Cierre de caja' },
  { id: 6, registerId: 4, registerName: 'Caja Express', action: 'open', amount: 3000, date: '2023-04-30 08:45:00', user: 'agarcia', notes: 'Apertura de caja' },
  { id: 7, registerId: 4, registerName: 'Caja Express', action: 'add', amount: 2210.75, date: '2023-04-30 13:10:00', user: 'agarcia', notes: 'Ingreso ventas' },
  { id: 8, registerId: 5, registerName: 'Caja 1', action: 'close', amount: 6500.30, date: '2023-04-29 21:10:00', user: 'jgomez', notes: 'Cierre de caja' },
  { id: 9, registerId: 6, registerName: 'Caja 2', action: 'close', amount: 4200.80, date: '2023-04-29 21:15:00', user: 'rmedina', notes: 'Cierre de caja' },
  { id: 10, registerId: 7, registerName: 'Caja Principal', action: 'open', amount: 8000, date: '2023-04-30 08:00:00', user: 'admin', notes: 'Apertura de caja' },
  { id: 11, registerId: 7, registerName: 'Caja Principal', action: 'add', amount: 4450, date: '2023-04-30 12:45:00', user: 'frodriguez', notes: 'Ingreso ventas' },
];

const users: User[] = [
  { id: 1, username: 'admin', fullName: 'Administrador Sistema', email: 'admin@stockfacil.com', role: 'Administrador', status: 'active', lastLogin: '2023-04-30 08:15:00' },
  { id: 2, username: 'jperez', fullName: 'Juan Pérez', email: 'jperez@stockfacil.com', role: 'Cajero', status: 'active', lastLogin: '2023-04-30 08:20:00' },
  { id: 3, username: 'mlopez', fullName: 'María López', email: 'mlopez@stockfacil.com', role: 'Cajero', status: 'active', lastLogin: '2023-04-30 09:05:00' },
  { id: 4, username: 'agarcia', fullName: 'Alejandro García', email: 'agarcia@stockfacil.com', role: 'Cajero', status: 'active', lastLogin: '2023-04-30 08:40:00' },
  { id: 5, username: 'pdiaz', fullName: 'Patricia Díaz', email: 'pdiaz@stockfacil.com', role: 'Supervisor', status: 'inactive', lastLogin: '2023-04-29 18:30:00' },
  { id: 6, username: 'jgomez', fullName: 'José Gómez', email: 'jgomez@stockfacil.com', role: 'Cajero', status: 'active', lastLogin: '2023-04-29 21:00:00' },
  { id: 7, username: 'rmedina', fullName: 'Roberto Medina', email: 'rmedina@stockfacil.com', role: 'Cajero', status: 'locked', lastLogin: '2023-04-29 21:05:00' },
  { id: 8, username: 'frodriguez', fullName: 'Fernanda Rodríguez', email: 'frodriguez@stockfacil.com', role: 'Supervisor', status: 'active', lastLogin: '2023-04-30 07:55:00' },
];

const permissions: Permission[] = [
  // Cajas
  { id: 1, module: 'cajas', action: 'view', description: 'Ver cajas' },
  { id: 2, module: 'cajas', action: 'open', description: 'Abrir caja' },
  { id: 3, module: 'cajas', action: 'close', description: 'Cerrar caja' },
  { id: 4, module: 'cajas', action: 'add_funds', description: 'Agregar fondos a caja' },
  { id: 5, module: 'cajas', action: 'withdraw_funds', description: 'Retirar fondos de caja' },
  { id: 6, module: 'cajas', action: 'view_history', description: 'Ver historial de caja' },
  
  // Ventas
  { id: 7, module: 'ventas', action: 'view', description: 'Ver ventas' },
  { id: 8, module: 'ventas', action: 'create', description: 'Crear ventas' },
  { id: 9, module: 'ventas', action: 'cancel', description: 'Cancelar ventas' },
  { id: 10, module: 'ventas', action: 'apply_discount', description: 'Aplicar descuentos' },
  { id: 11, module: 'ventas', action: 'change_price', description: 'Cambiar precios' },
  
  // Productos
  { id: 12, module: 'productos', action: 'view', description: 'Ver productos' },
  { id: 13, module: 'productos', action: 'create', description: 'Crear productos' },
  { id: 14, module: 'productos', action: 'edit', description: 'Editar productos' },
  { id: 15, module: 'productos', action: 'delete', description: 'Eliminar productos' },
  
  // Usuarios
  { id: 16, module: 'usuarios', action: 'view', description: 'Ver usuarios' },
  { id: 17, module: 'usuarios', action: 'create', description: 'Crear usuarios' },
  { id: 18, module: 'usuarios', action: 'edit', description: 'Editar usuarios' },
  { id: 19, module: 'usuarios', action: 'delete', description: 'Eliminar usuarios' },
  { id: 20, module: 'usuarios', action: 'manage_permissions', description: 'Gestionar permisos' },
  
  // Reportes
  { id: 21, module: 'reportes', action: 'sales_reports', description: 'Reportes de ventas' },
  { id: 22, module: 'reportes', action: 'inventory_reports', description: 'Reportes de inventario' },
  { id: 23, module: 'reportes', action: 'user_reports', description: 'Reportes de usuarios' },
  { id: 24, module: 'reportes', action: 'export', description: 'Exportar reportes' },
];

const roles: Role[] = [
  { id: 1, name: 'Administrador', description: 'Control total del sistema', permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
  { id: 2, name: 'Supervisor', description: 'Gestión de cajas y reportes', permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 21, 22, 23, 24] },
  { id: 3, name: 'Cajero', description: 'Operación de caja y ventas', permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12] },
  { id: 4, name: 'Vendedor', description: 'Solo ventas', permissions: [1, 7, 8, 12] },
  { id: 5, name: 'Inventario', description: 'Gestión de inventario', permissions: [12, 13, 14, 15, 22] },
];

// Dashboard component
const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [cashRegisterPage, setCashRegisterPage] = useState(0);
  const [cashRegisterRowsPerPage, setCashRegisterRowsPerPage] = useState(5);
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(5);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(5);
  const [searchCashRegister, setSearchCashRegister] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [selectedCashRegister, setSelectedCashRegister] = useState<CashRegister | null>(null);
  const [openCashRegisterDialog, setOpenCashRegisterDialog] = useState(false);
  const [closeCashRegisterDialog, setCloseCashRegisterDialog] = useState(false);
  const [addFundsDialog, setAddFundsDialog] = useState(false);
  const [withdrawFundsDialog, setWithdrawFundsDialog] = useState(false);
  const [newCashRegisterDialog, setNewCashRegisterDialog] = useState(false);
  const [editCashRegisterDialog, setEditCashRegisterDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserPermissions, setShowUserPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const [openAmount, setOpenAmount] = useState<number>(1000);
  const [fundsAmount, setFundsAmount] = useState<number>(0);
  const [fundsNote, setFundsNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterUserStatus, setFilterUserStatus] = useState<'all' | 'active' | 'inactive' | 'locked'>('all');
  const [filterUserRole, setFilterUserRole] = useState<string>('all');
  
  // Cash register locations
  const locations = Array.from(new Set(cashRegisters.map(cr => cr.location)));
  
  // Handle tab change
  //@ts-check
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle cash register pagination
  const handleChangeCashRegisterPage = (event: unknown, newPage: number) => {
    setCashRegisterPage(newPage);
  };
  
  const handleChangeCashRegisterRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-check
    setCashRegisterRowsPerPage(parseInt(event.target.value, 10));
    setCashRegisterPage(0);
  };
  
  // Handle user pagination
  const handleChangeUserPage = (event: unknown, newPage: number) => {
    setUserPage(newPage);
  };
  
  const handleChangeUserRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserRowsPerPage(parseInt(event.target.value, 10));
    setUserPage(0);
  };
  
  // Handle history pagination
  const handleChangeHistoryPage = (event: unknown, newPage: number) => {
    setHistoryPage(newPage);
  };
  
  const handleChangeHistoryRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHistoryRowsPerPage(parseInt(event.target.value, 10));
    setHistoryPage(0);
  };
  
  // Filter cash registers
  const filteredCashRegisters = cashRegisters
    .filter(cr => 
      (filterStatus === 'all' || cr.status === filterStatus) &&
      (filterLocation === 'all' || cr.location === filterLocation) &&
      (searchCashRegister === '' || 
        cr.name.toLowerCase().includes(searchCashRegister.toLowerCase()) ||
        cr.location.toLowerCase().includes(searchCashRegister.toLowerCase()) ||
        (cr.assignedUser && cr.assignedUser.toLowerCase().includes(searchCashRegister.toLowerCase()))
      )
    );
  
  // Filter users
  const filteredUsers = users
    .filter(user => 
      (filterUserStatus === 'all' || user.status === filterUserStatus) &&
      (filterUserRole === 'all' || user.role === filterUserRole) &&
      (searchUser === '' ||
        user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.email.toLowerCase().includes(searchUser.toLowerCase())
      )
    );
  
  // Handle dialog operations
  const handleOpenCashRegister = (register: CashRegister) => {
    setSelectedCashRegister(register);
    setOpenCashRegisterDialog(true);
  };
  
  const handleCloseCashRegister = (register: CashRegister) => {
    setSelectedCashRegister(register);
    setCloseCashRegisterDialog(true);
  };
  
  const handleAddFunds = (register: CashRegister) => {
    setSelectedCashRegister(register);
    setFundsAmount(0);
    setFundsNote('');
    setAddFundsDialog(true);
  };
  
  const handleWithdrawFunds = (register: CashRegister) => {
    setSelectedCashRegister(register);
    setFundsAmount(0);
    setFundsNote('');
    setWithdrawFundsDialog(true);
  };
  
  const handleNewCashRegister = () => {
    setNewCashRegisterDialog(true);
  };
  
  const handleEditCashRegister = (register: CashRegister) => {
    setSelectedCashRegister(register);
    setEditCashRegisterDialog(true);
  };
  
  const handleNewUser = () => {
    setSelectedUser(null);
    setOpenUserDialog(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserDialog(true);
  };
  
  const handleShowUserPermissions = (user: User) => {
    setSelectedUser(user);
    setShowUserPermissions(true);
  };
  
  // Simulated operations with loading
  const confirmOperation = (operation: string) => {
    setLoading(true);
    
    // Simulated API call
    setTimeout(() => {
      let message = '';
      let severity: 'success' | 'error' | 'info' | 'warning' = 'success';
      
      switch (operation) {
        case 'openCashRegister':
          message = `Caja ${selectedCashRegister?.name} abierta correctamente`;
          break;
        case 'closeCashRegister':
          message = `Caja ${selectedCashRegister?.name} cerrada correctamente`;
          break;
        case 'addFunds':
          message = `Fondos agregados a ${selectedCashRegister?.name}`;
          break;
        case 'withdrawFunds':
          message = `Fondos retirados de ${selectedCashRegister?.name}`;
          break;
        case 'newCashRegister':
          message = 'Nueva caja creada correctamente';
          break;
        case 'editCashRegister':
          message = `Caja ${selectedCashRegister?.name} actualizada correctamente`;
          break;
        case 'newUser':
          message = 'Nuevo usuario creado correctamente';
          break;
        case 'editUser':
          message = `Usuario ${selectedUser?.username} actualizado correctamente`;
          break;
        default:
          message = 'Operación completada';
      }
      
      setLoading(false);
      setOpenCashRegisterDialog(false);
      setCloseCashRegisterDialog(false);
      setAddFundsDialog(false);
      setWithdrawFundsDialog(false);
      setNewCashRegisterDialog(false);
      setEditCashRegisterDialog(false);
      setOpenUserDialog(false);
      setEditUserDialog(false);
      setShowUserPermissions(false);
      
      setSnackbar({
        open: true,
        message,
        severity,
      });
    }, 1000);
  };
  
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Get cash register history for a specific register
  const getCashRegisterHistory = (registerId: number) => {
    return cashRegisterHistory.filter(history => history.registerId === registerId);
  };
  
  // Get permission details
  const getPermissionDetails = (permissionId: number) => {
    return permissions.find(permission => permission.id === permissionId);
  };
  
  // Get permissions for a specific role
  const getPermissionsForRole = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    if (!role) return [];
    return role.permissions.map(permId => getPermissionDetails(permId)).filter(Boolean) as Permission[];
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR');
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ fontSize: 36, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Panel de Administración
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{ mr: 1 }}
              onClick={() => {
                setSnackbar({
                  open: true,
                  message: 'Datos actualizados',
                  severity: 'info',
                });
              }}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
            >
              Configuración
            </Button>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Cajas
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {cashRegisters.length}
                    </Typography>
                  </Box>
                  <StorefrontIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={`${cashRegisters.filter(cr => cr.status === 'open').length} Abiertas`} 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    label={`${cashRegisters.filter(cr => cr.status === 'closed').length} Cerradas`} 
                    color="default" 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Balance Total
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatCurrency(cashRegisters.reduce((sum, register) => sum + register.currentBalance, 0))}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Actualizado: {new Date().toLocaleString('es-AR')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Usuarios
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {users.length}
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={`${users.filter(u => u.status === 'active').length} Activos`} 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    label={`${users.filter(u => u.status !== 'active').length} Inactivos`} 
                    color="default" 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2,
              backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="white" variant="body2">
                      Locales
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {locations.length}
                    </Typography>
                  </Box>
                  <StoreIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={`${locations.length} Ubicaciones`} 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 'bold' }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Main Content Tabs */}
        <Paper sx={{ borderRadius: 2, mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 'bold',
                py: 2,
                px: 3,
                minHeight: 48
              },
              '& .Mui-selected': {
                color: 'primary.main'
              }
            }}
          >
            <Tab 
              icon={<StorefrontIcon />} 
              iconPosition="start" 
              label="Gestión de Cajas" 
            />
            <Tab 
              icon={<PersonIcon />} 
              iconPosition="start" 
              label="Gestión de Usuarios" 
            />
            <Tab 
              icon={<HistoryIcon />} 
              iconPosition="start" 
              label="Historial de Cajas" 
            />
            <Tab 
              icon={<SecurityIcon />} 
              iconPosition="start" 
              label="Roles y Permisos" 
            />
          </Tabs>
          
          {/* Cash Registers Tab */}
          <Box sx={{ display: tabValue === 0 ? 'block' : 'none', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Listado de Cajas
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Buscar cajas..."
                  size="small"
                  value={searchCashRegister}
                  onChange={(e) => setSearchCashRegister(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Estado"
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'open' | 'closed')}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="open">Abiertas</MenuItem>
                    <MenuItem value="closed">Cerradas</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Ubicación</InputLabel>
                  <Select
                    value={filterLocation}
                    label="Ubicación"
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {locations.map((location) => (
                      <MenuItem key={location} value={location}>{location}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNewCashRegister}
                >
                  Nueva Caja
                </Button>
              </Box>
            </Box>
            
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ubicación</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Usuario Asignado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Balance Actual</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Última Operación</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCashRegisters
                    .slice(cashRegisterPage * cashRegisterRowsPerPage, cashRegisterPage * cashRegisterRowsPerPage + cashRegisterRowsPerPage)
                    .map((register) => (
                    <TableRow
                      key={register.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight="medium">{register.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          {register.location}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={register.status === 'open' ? <LockOpenIcon /> : <LockIcon />}
                          label={register.status === 'open' ? 'Abierta' : 'Cerrada'}
                          color={register.status === 'open' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {register.assignedUser ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main', fontSize: '0.75rem' }}
                            >
                              {register.assignedUser.charAt(0).toUpperCase()}
                            </Avatar>
                            {register.assignedUser}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No asignado
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight="medium"
                          color={register.currentBalance > 0 ? 'success.main' : 'text.primary'}
                        >
                          {formatCurrency(register.currentBalance)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {register.status === 'open' ? (
                          <Tooltip title={`Abierta por ${register.openedBy}`} arrow>
                            <Typography variant="body2">
                              Abierta: {register.lastOpened ? formatDate(register.lastOpened) : 'N/A'}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2">
                            Cerrada: {register.lastClosed ? formatDate(register.lastClosed) : 'N/A'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          {register.status === 'closed' ? (
                            <Tooltip title="Abrir Caja" arrow>
                              <IconButton
                                color="success"
                                size="small"
                                onClick={() => handleOpenCashRegister(register)}
                              >
                                <LockOpenIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <>
                              <Tooltip title="Agregar Fondos" arrow>
                                <IconButton
                                  color="info"
                                  size="small"
                                  onClick={() => handleAddFunds(register)}
                                  sx={{ mr: 1 }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Retirar Fondos" arrow>
                                <IconButton
                                  color="warning"
                                  size="small"
                                  onClick={() => handleWithdrawFunds(register)}
                                  sx={{ mr: 1 }}
                                >
                                  <MonetizationOnIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cerrar Caja" arrow>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleCloseCashRegister(register)}
                                >
                                  <LockIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="Editar" arrow>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditCashRegister(register)}
                              sx={{ ml: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCashRegisters.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No se encontraron cajas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCashRegisters.length}
              rowsPerPage={cashRegisterRowsPerPage}
              page={cashRegisterPage}
              onPageChange={handleChangeCashRegisterPage}
              onRowsPerPageChange={handleChangeCashRegisterRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Box>
          
          {/* Users Tab */}
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Gestión de Usuarios
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Buscar usuarios..."
                  size="small"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filterUserStatus}
                    label="Estado"
                    onChange={(e) => setFilterUserStatus(e.target.value as 'all' | 'active' | 'inactive' | 'locked')}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="active">Activos</MenuItem>
                    <MenuItem value="inactive">Inactivos</MenuItem>
                    <MenuItem value="locked">Bloqueados</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={filterUserRole}
                    label="Rol"
                    onChange={(e) => setFilterUserRole(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNewUser}
                >
                  Nuevo Usuario
                </Button>
              </Box>
            </Box>
            
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre Completo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Último Acceso</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage)
                    .map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              mr: 1,
                              bgcolor: user.status === 'active' ? 'primary.main' : 'text.disabled',
                              width: 30,
                              height: 30
                            }}
                          >
                            {user.fullName.charAt(0)}
                          </Avatar>
                          <Typography fontWeight="medium">{user.username}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color={
                            user.role === 'Administrador' ? 'error' :
                            user.role === 'Supervisor' ? 'warning' :
                            'primary'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            user.status === 'active' ? <CheckCircleIcon /> :
                            user.status === 'locked' ? <BlockIcon /> :
                            <CancelIcon />
                          }
                          label={
                            user.status === 'active' ? 'Activo' :
                            user.status === 'locked' ? 'Bloqueado' :
                            'Inactivo'
                          }
                          color={
                            user.status === 'active' ? 'success' :
                            user.status === 'locked' ? 'error' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Editar Usuario" arrow>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditUser(user)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Gestionar Permisos" arrow>
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => handleShowUserPermissions(user)}
                            >
                              <LockIcon />
                            </IconButton>
                          </Tooltip>
                          {user.status === 'active' ? (
                            <Tooltip title="Desactivar Usuario" arrow>
                              <IconButton
                                color="warning"
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSnackbar({
                                    open: true,
                                    message: `Usuario ${user.username} desactivado`,
                                    severity: 'warning',
                                  });
                                }}
                                sx={{ ml: 1 }}
                              >
                                <PowerSettingsNewIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activar Usuario" arrow>
                              <IconButton
                                color="success"
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSnackbar({
                                    open: true,
                                    message: `Usuario ${user.username} activado`,
                                    severity: 'success',
                                  });
                                }}
                                sx={{ ml: 1 }}
                              >
                                <PowerSettingsNewIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No se encontraron usuarios
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={userRowsPerPage}
              page={userPage}
              onPageChange={handleChangeUserPage}
              onRowsPerPageChange={handleChangeUserRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Box>
          
          {/* Cash Register History Tab */}
          <Box sx={{ display: tabValue === 2 ? 'block' : 'none', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Historial de Operaciones de Cajas
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Buscar en historial..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<ReportIcon />}
                >
                  Generar Reporte
                </Button>
              </Box>
            </Box>
            
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha y Hora</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Caja</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Operación</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Notas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cashRegisterHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(historyPage * historyRowsPerPage, historyPage * historyRowsPerPage + historyRowsPerPage)
                    .map((history) => (
                    <TableRow
                      key={history.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HistoryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          {formatDate(history.date)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorefrontIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                          <Typography fontWeight="medium">{history.registerName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            history.action === 'open' ? <LockOpenIcon /> :
                            history.action === 'close' ? <LockIcon /> :
                            history.action === 'add' ? <AddIcon /> :
                            <MonetizationOnIcon />
                          }
                          label={
                            history.action === 'open' ? 'Apertura' :
                            history.action === 'close' ? 'Cierre' :
                            history.action === 'add' ? 'Ingreso' :
                            'Retiro'
                          }
                          color={
                            history.action === 'open' ? 'success' :
                            history.action === 'close' ? 'info' :
                            history.action === 'add' ? 'primary' :
                            'warning'
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main', fontSize: '0.75rem' }}
                          >
                            {history.user.charAt(0).toUpperCase()}
                          </Avatar>
                          {history.user}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight="medium"
                          color={
                            history.action === 'open' || history.action === 'add' ? 'success.main' :
                            history.action === 'close' ? 'info.main' :
                            'warning.main'
                          }
                        >
                          {formatCurrency(history.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {history.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={cashRegisterHistory.length}
              rowsPerPage={historyRowsPerPage}
              page={historyPage}
              onPageChange={handleChangeHistoryPage}
              onRowsPerPageChange={handleChangeHistoryRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Box>
          
          {/* Roles & Permissions Tab */}
          <Box sx={{ display: tabValue === 3 ? 'block' : 'none', p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                  <CardHeader
                    title="Roles del Sistema"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    action={
                      <Button
                        startIcon={<AddIcon />}
                        size="small"
                        variant="outlined"
                      >
                        Nuevo Rol
                      </Button>
                    }
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                  />
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ p: 0 }}>
                      {roles.map((role) => (
                        <React.Fragment key={role.id}>
                          <ListItem
                            disablePadding
                            secondaryAction={
                              <IconButton edge="end" size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            }
                          >
                            <ListItemButton sx={{ px: 2, py: 1.5 }}>
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                {role.name === 'Administrador' ? (
                                  <AdminPanelSettingsIcon color="error" />
                                ) : role.name === 'Supervisor' ? (
                                  <VerifiedUserIcon color="warning" />
                                ) : role.name === 'Cajero' ? (
                                  <PointOfSaleIcon color="info" />
                                ) : role.name === 'Vendedor' ? (
                                  <LocalAtmIcon color="primary" />
                                ) : (
                                  <CategoryIcon color="success" />
                                )}
                              </ListItemIcon>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {role.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {role.description}
                                </Typography>
                              </Box>
                            </ListItemButton>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardHeader
                    title="Permisos por Módulo"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                  />
                  <CardContent>
                    <TreeView
                      defaultCollapseIcon={<ArrowDropDownIcon />}
                      defaultExpandIcon={<ArrowRightIcon />}
                      defaultExpanded={['cajas', 'ventas', 'productos', 'usuarios', 'reportes']}
                    >
                      <TreeItem nodeId="cajas" label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight="bold">Cajas</Typography>
                        </Box>
                      }>
                        {permissions
                          .filter(p => p.module === 'cajas')
                          .map(permission => (
                            <TreeItem 
                              key={permission.id}
                              nodeId={`permission-${permission.id}`}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                  <Checkbox size="small" />
                                  <Typography variant="body2">{permission.description}</Typography>
                                </Box>
                              }
                            />
                          ))
                        }
                      </TreeItem>
                      
                      <TreeItem nodeId="ventas" label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PointOfSaleIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight="bold">Ventas</Typography>
                        </Box>
                      }>
                        {permissions
                          .filter(p => p.module === 'ventas')
                          .map(permission => (
                            <TreeItem 
                              key={permission.id}
                              nodeId={`permission-${permission.id}`}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                  <Checkbox size="small" />
                                  <Typography variant="body2">{permission.description}</Typography>
                                </Box>
                              }
                            />
                          ))
                        }
                      </TreeItem>
                      
                      <TreeItem nodeId="productos" label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight="bold">Productos</Typography>
                        </Box>
                      }>
                        {permissions
                          .filter(p => p.module === 'productos')
                          .map(permission => (
                            <TreeItem 
                              key={permission.id}
                              nodeId={`permission-${permission.id}`}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                  <Checkbox size="small" />
                                  <Typography variant="body2">{permission.description}</Typography>
                                </Box>
                              }
                            />
                          ))
                        }
                      </TreeItem>
                      
                      <TreeItem nodeId="usuarios" label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight="bold">Usuarios</Typography>
                        </Box>
                      }>
                        {permissions
                          .filter(p => p.module === 'usuarios')
                          .map(permission => (
                            <TreeItem 
                              key={permission.id}
                              nodeId={`permission-${permission.id}`}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                  <Checkbox size="small" />
                                  <Typography variant="body2">{permission.description}</Typography>
                                </Box>
                              }
                            />
                          ))
                        }
                      </TreeItem>
                      
                      <TreeItem nodeId="reportes" label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight="bold">Reportes</Typography>
                        </Box>
                      }>
                        {permissions
                          .filter(p => p.module === 'reportes')
                          .map(permission => (
                            <TreeItem 
                              key={permission.id}
                              nodeId={`permission-${permission.id}`}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                  <Checkbox size="small" />
                                  <Typography variant="body2">{permission.description}</Typography>
                                </Box>
                              }
                            />
                          ))
                        }
                      </TreeItem>
                    </TreeView>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => {
                          setSnackbar({
                            open: true,
                            message: 'Permisos guardados correctamente',
                            severity: 'success',
                          });
                        }}
                      >
                        Guardar Permisos
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        {/* Dialog for Opening Cash Register */}
        <Dialog
          open={openCashRegisterDialog}
          onClose={() => setOpenCashRegisterDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LockOpenIcon sx={{ mr: 1, color: 'success.main' }} />
              Abrir Caja
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                {selectedCashRegister?.name} - {selectedCashRegister?.location}
              </Typography>
              
              <TextField
                label="Monto Inicial"
                type="number"
                fullWidth
                margin="normal"
                value={openAmount}
                onChange={(e) => setOpenAmount(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <TextField
                label="Observaciones"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                placeholder="Ingrese observaciones si es necesario"
              />
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  La caja será abierta con un saldo inicial de {formatCurrency(openAmount)} y quedará asignada a su usuario.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCashRegisterDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="success"
              onClick={() => confirmOperation('openCashRegister')}
              disabled={openAmount <= 0 || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOpenIcon />}
            >
              Abrir Caja
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for Closing Cash Register */}
        <Dialog
          open={closeCashRegisterDialog}
          onClose={() => setCloseCashRegisterDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon sx={{ mr: 1, color: 'error.main' }} />
              Cerrar Caja
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                {selectedCashRegister?.name} - {selectedCashRegister?.location}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Balance Sistema"
                    fullWidth
                    value={formatCurrency(selectedCashRegister?.currentBalance || 0)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Balance Real"
                    type="number"
                    fullWidth
                    defaultValue={selectedCashRegister?.currentBalance}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                label="Observaciones"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                placeholder="Ingrese observaciones si es necesario"
              />
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  La caja será cerrada con un saldo final de {formatCurrency(selectedCashRegister?.currentBalance || 0)}. Esta operación no se puede deshacer.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCloseCashRegisterDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="error"
              onClick={() => confirmOperation('closeCashRegister')}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
            >
              Cerrar Caja
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for Adding Funds */}
        <Dialog
          open={addFundsDialog}
          onClose={() => setAddFundsDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AddIcon sx={{ mr: 1, color: 'info.main' }} />
              Agregar Fondos
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                {selectedCashRegister?.name} - {selectedCashRegister?.location}
              </Typography>
              
              <TextField
                label="Monto a Agregar"
                type="number"
                fullWidth
                margin="normal"
                value={fundsAmount}
                onChange={(e) => setFundsAmount(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <TextField
                label="Concepto"
                fullWidth
                margin="normal"
                value={fundsNote}
                onChange={(e) => setFundsNote(e.target.value)}
                placeholder="Ej: Ingreso de ventas del turno mañana"
              />
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(33, 150, 243, 0.08)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Saldo actual: {formatCurrency(selectedCashRegister?.currentBalance || 0)}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="info.main" sx={{ mt: 0.5 }}>
                  Saldo después de la operación: {formatCurrency((selectedCashRegister?.currentBalance || 0) + fundsAmount)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddFundsDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="info"
              onClick={() => confirmOperation('addFunds')}
              disabled={fundsAmount <= 0 || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            >
              Agregar Fondos
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for Withdrawing Funds */}
        <Dialog
          open={withdrawFundsDialog}
          onClose={() => setWithdrawFundsDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MonetizationOnIcon sx={{ mr: 1, color: 'warning.main' }} />
              Retirar Fondos
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                {selectedCashRegister?.name} - {selectedCashRegister?.location}
              </Typography>
              
              <TextField
                label="Monto a Retirar"
                type="number"
                fullWidth
                margin="normal"
                value={fundsAmount}
                onChange={(e) => setFundsAmount(Number(e.target.value))}
                error={fundsAmount > (selectedCashRegister?.currentBalance || 0)}
                helperText={fundsAmount > (selectedCashRegister?.currentBalance || 0) ? "El monto excede el saldo disponible" : ""}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <TextField
                label="Concepto"
                fullWidth
                margin="normal"
                value={fundsNote}
                onChange={(e) => setFundsNote(e.target.value)}
                placeholder="Ej: Retiro para depósito bancario"
              />
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 152, 0, 0.08)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Saldo actual: {formatCurrency(selectedCashRegister?.currentBalance || 0)}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="warning.main" sx={{ mt: 0.5 }}>
                  Saldo después de la operación: {formatCurrency((selectedCashRegister?.currentBalance || 0) - fundsAmount)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWithdrawFundsDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="warning"
              onClick={() => confirmOperation('withdrawFunds')}
              disabled={fundsAmount <= 0 || fundsAmount > (selectedCashRegister?.currentBalance || 0) || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MonetizationOnIcon />}
            >
              Retirar Fondos
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for New Cash Register */}
        <Dialog
          open={newCashRegisterDialog}
          onClose={() => setNewCashRegisterDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
              Nueva Caja
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <TextField
                label="Nombre de la Caja"
                fullWidth
                margin="normal"
                placeholder="Ej: Caja 1"
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Ubicación</InputLabel>
                <Select label="Ubicación">
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                  <MenuItem value="new">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AddIcon sx={{ mr: 1, fontSize: 18 }} />
                      Nueva Ubicación
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Nueva Ubicación"
                fullWidth
                margin="normal"
                placeholder="Ej: Sucursal Centro"
              />
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  La nueva caja se creará en estado cerrado. Deberá abrirla para comenzar a operar.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewCashRegisterDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => confirmOperation('newCashRegister')}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              Crear Caja
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for Editing Cash Register */}
        <Dialog
          open={editCashRegisterDialog}
          onClose={() => setEditCashRegisterDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
              Editar Caja
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <TextField
                label="Nombre de la Caja"
                fullWidth
                margin="normal"
                value={selectedCashRegister?.name}
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Ubicación</InputLabel>
                <Select label="Ubicación" value={selectedCashRegister?.location}>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Usuario Asignado</InputLabel>
                <Select
                  label="Usuario Asignado"
                  value={selectedCashRegister?.assignedUser || ''}
                  disabled={selectedCashRegister?.status === 'closed'}
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {users
                    .filter(user => user.status === 'active')
                    .map((user) => (
                      <MenuItem key={user.id} value={user.username}>{user.fullName}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              
              {selectedCashRegister?.status === 'closed' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    La caja está cerrada actualmente. Algunos campos no pueden ser modificados hasta que se abra.
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditCashRegisterDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => confirmOperation('editCashRegister')}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for New User */}
        <Dialog
          open={openUserDialog}
          onClose={() => setOpenUserDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              Nuevo Usuario
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre de Usuario"
                  fullWidth
                  margin="normal"
                  required
                />
                
                <TextField
                  label="Nombre Completo"
                  fullWidth
                  margin="normal"
                  required
                />
                
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  type="email"
                  required
                />
                
                <TextField
                  label="Contraseña"
                  fullWidth
                  margin="normal"
                  type="password"
                  required
                />
                
                <TextField
                  label="Confirmar Contraseña"
                  fullWidth
                  margin="normal"
                  type="password"
                  required
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Rol</InputLabel>
                  <Select label="Rol">
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Permisos Adicionales
                </Typography>
                <Typography variant="caption" color="text.secondary" paragraph>
                  El usuario heredará los permisos del rol seleccionado. Puede agregar permisos adicionales específicos para este usuario.
                </Typography>
                
                <Box sx={{ height: 300, overflow: 'auto', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, p: 1 }}>
                  <TreeView
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                  >
                    <TreeItem nodeId="cajas" label="Cajas">
                      {permissions
                        .filter(p => p.module === 'cajas')
                        .map(permission => (
                          <TreeItem 
                            key={permission.id}
                            nodeId={`permission-${permission.id}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <Checkbox size="small" />
                                <Typography variant="body2">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        ))
                      }
                    </TreeItem>
                    
                    <TreeItem nodeId="ventas" label="Ventas">
                      {permissions
                        .filter(p => p.module === 'ventas')
                        .map(permission => (
                          <TreeItem 
                            key={permission.id}
                            nodeId={`permission-${permission.id}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <Checkbox size="small" />
                                <Typography variant="body2">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        ))
                      }
                    </TreeItem>
                    
                    <TreeItem nodeId="productos" label="Productos">
                      {permissions
                        .filter(p => p.module === 'productos')
                        .map(permission => (
                          <TreeItem 
                            key={permission.id}
                            nodeId={`permission-${permission.id}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <Checkbox size="small" />
                                <Typography variant="body2">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        ))
                      }
                    </TreeItem>
                  </TreeView>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Activar usuario inmediatamente"
                    defaultChecked
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUserDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => confirmOperation('newUser')}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              Crear Usuario
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for Editing User */}
        <Dialog
          open={editUserDialog}
          onClose={() => setEditUserDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
              Editar Usuario: {selectedUser?.username}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre de Usuario"
                  fullWidth
                  margin="normal"
                  value={selectedUser?.username}
                  disabled
                />
                
                <TextField
                  label="Nombre Completo"
                  fullWidth
                  margin="normal"
                  value={selectedUser?.fullName}
                  required
                />
                
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  type="email"
                  value={selectedUser?.email}
                  required
                />
                
                <TextField
                  label="Nueva Contraseña"
                  fullWidth
                  margin="normal"
                  type="password"
                  placeholder="Dejar en blanco para mantener actual"
                />
                
                <TextField
                  label="Confirmar Contraseña"
                  fullWidth
                  margin="normal"
                  type="password"
                  placeholder="Dejar en blanco para mantener actual"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Rol</InputLabel>
                  <Select 
                    label="Rol"
                    value={selectedUser?.role}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Estado</InputLabel>
                  <Select 
                    label="Estado"
                    value={selectedUser?.status}
                  >
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="inactive">Inactivo</MenuItem>
                    <MenuItem value="locked">Bloqueado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Permisos Adicionales
                </Typography>
                <Typography variant="caption" color="text.secondary" paragraph>
                  El usuario heredará los permisos del rol seleccionado. Puede modificar los permisos adicionales específicos para este usuario.
                </Typography>
                
                <Box sx={{ height: 300, overflow: 'auto', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, p: 1 }}>
                  <TreeView
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultExpanded={['cajas', 'ventas']}
                  >
                    <TreeItem nodeId="cajas" label="Cajas">
                      {permissions
                        .filter(p => p.module === 'cajas')
                        .map(permission => (
                          <TreeItem 
                            key={permission.id}
                            nodeId={`permission-${permission.id}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <Checkbox 
                                  size="small" 
                                  checked={selectedUser?.role === 'Administrador' || permission.id === 1 || permission.id === 2}
                                />
                                <Typography variant="body2">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        ))
                      }
                    </TreeItem>
                    
                    <TreeItem nodeId="ventas" label="Ventas">
                      {permissions
                        .filter(p => p.module === 'ventas')
                        .map(permission => (
                          <TreeItem 
                            key={permission.id}
                            nodeId={`permission-${permission.id}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <Checkbox 
                                  size="small" 
                                  checked={selectedUser?.role === 'Administrador' || selectedUser?.role === 'Supervisor' || permission.id === 7 || permission.id === 8}
                                />
                                <Typography variant="body2">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        ))
                      }
                    </TreeItem>
                    
                    <TreeItem nodeId="productos" label="Productos">
                      {permissions
                        .filter(p => p.module === 'productos')
                        .map(permission => (
                          <TreeItem 
                            key={permission.id}
                            nodeId={`permission-${permission.id}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <Checkbox 
                                  size="small" 
                                  checked={selectedUser?.role === 'Administrador' || (selectedUser?.role === 'Inventario' && (permission.id === 12 || permission.id === 13))}
                                />
                                <Typography variant="body2">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        ))
                      }
                    </TreeItem>
                  </TreeView>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" fontWeight="bold" mr={2}>
                    Último acceso:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser?.lastLogin ? formatDate(selectedUser.lastLogin) : 'Nunca'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUserDialog(false)}>Cancelar</Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => confirmOperation('editUser')}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog for User Permissions */}
        <Dialog
          open={showUserPermissions}
          onClose={() => setShowUserPermissions(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon sx={{ mr: 1, color: 'info.main' }} />
              Permisos de Usuario: {selectedUser?.fullName}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{ mr: 2, bgcolor: selectedUser?.status === 'active' ? 'primary.main' : 'text.disabled', width: 40, height: 40 }}
                >
                  {selectedUser?.fullName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser?.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser?.username} | {selectedUser?.email}
                  </Typography>
                </Box>
                <Chip
                  label={selectedUser?.role}
                  color={
                    selectedUser?.role === 'Administrador' ? 'error' :
                    selectedUser?.role === 'Supervisor' ? 'warning' :
                    'primary'
                  }
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Permisos del Rol {selectedUser?.role}
              </Typography>
              
              {selectedUser ? (
                <Grid container spacing={2}>
                  {/* Permiso para el módulo de Cajas */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Cajas
                        </Typography>
                      </Box>
                      <List dense>
                        {getPermissionsForRole(selectedUser.role)
                          .filter(p => p.module === 'cajas')
                          .map(permission => (
                            <ListItem key={permission.id} disablePadding>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={permission.description}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))
                        }
                      </List>
                    </Paper>
                  </Grid>
                  
                  {/* Permiso para el módulo de Ventas */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PointOfSaleIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Ventas
                        </Typography>
                      </Box>
                      <List dense>
                        {getPermissionsForRole(selectedUser.role)
                          .filter(p => p.module === 'ventas')
                          .map(permission => (
                            <ListItem key={permission.id} disablePadding>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={permission.description}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))
                        }
                      </List>
                    </Paper>
                  </Grid>
                  
                  {/* Permiso para el módulo de Productos */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Productos
                        </Typography>
                      </Box>
                      <List dense>
                        {getPermissionsForRole(selectedUser.role)
                          .filter(p => p.module === 'productos')
                          .map(permission => (
                            <ListItem key={permission.id} disablePadding>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={permission.description}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))
                        }
                      </List>
                    </Paper>
                  </Grid>
                  
                  {/* Permiso para el módulo de Usuarios */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Usuarios
                        </Typography>
                      </Box>
                      <List dense>
                        {getPermissionsForRole(selectedUser.role)
                          .filter(p => p.module === 'usuarios')
                          .map(permission => (
                            <ListItem key={permission.id} disablePadding>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={permission.description}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))
                        }
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  No hay información de permisos disponible
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Permisos Adicionales
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Este usuario tiene los siguientes permisos adicionales a los de su rol:
              </Typography>
              
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" color="text.disabled" align="center" sx={{ py: 2 }}>
                  No hay permisos adicionales configurados
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowUserPermissions(false)}
              variant="outlined"
            >
              Cerrar
            </Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => {
                setShowUserPermissions(false);
                handleEditUser(selectedUser as User);
              }}
              startIcon={<EditIcon />}
            >
              Editar Permisos
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminDashboard;