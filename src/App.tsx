import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Grid, 
  Paper, 
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Zoom,
  Chip,
  Divider
} from '@mui/material'; //@ts-ignore
import logo from './assets/logo.png';
import ArticulosPage from './Pages/ArticulosPage';
import ProveedoresPage from './Pages/ProveedoresPage'; //@ts-ignore
import ClientPage from './Pages/Clientes';
import ComprasPage from './Pages/Compras'
import VentasPage from './Pages/VentasPage';
import CajaPage from './Pages/CajaPage'
import UsuariosPage from './Pages/UsuariosPage';

// Import icons (using Material Icons)
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReportIcon from '@mui/icons-material/Report';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';

// Define theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 13,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  key: string;
  shortcut: string;
}

const menuItems: MenuItem[] = [
  { icon: <InventoryIcon />, text: 'Artículos', key: 'articulos', shortcut: 'F1' },
  { icon: <LocalShippingIcon />, text: 'Proveedores', key: 'proveedores', shortcut: 'F2' },
  { icon: <ShoppingCartIcon />, text: 'Clientes', key: 'clientes', shortcut: 'F3' },
  { icon: <PersonIcon />, text: 'Usuarios', key: 'usuarios', shortcut: 'F4' },
  { icon: <BusinessIcon />, text: 'Compras', key: 'compras', shortcut: 'F5' },
  { icon: <PointOfSaleIcon />, text: 'Ventas', key: 'ventas', shortcut: 'F6' },
  { icon: <ReportIcon />, text: 'Caja', key: 'caja', shortcut: 'F7' },
  // Commented out but kept for potential future use
  // { icon: <BarChartIcon />, text: 'Estadísticas', key: 'estadisticas', shortcut: 'F8' },
  // { icon: <BuildIcon />, text: 'Mantenimiento', key: 'mantenimiento', shortcut: 'F9' },
  // { icon: <ReceiptIcon />, text: 'Contabilidad', key: 'contabilidad', shortcut: 'F10' },
  // { icon: <ExitToAppIcon />, text: 'Salir', key: 'salir', shortcut: 'F12' },
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('ventas');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActivePage('articulos');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setActivePage('proveedores');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setActivePage('clientes');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActivePage('usuarios');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setActivePage('compras');
      } else if (e.key === 'F6') {
        e.preventDefault();
        setActivePage('ventas');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setActivePage('caja');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMenuClick = (key: string) => {
    setActivePage(key);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'articulos':
        return <ArticulosPage />;
      case 'proveedores':
        return <ProveedoresPage />;
      case 'clientes':
        return <ClientPage />
      case 'compras':
        return <ComprasPage />
      case 'ventas':
        return <VentasPage />
      case 'caja':
        return <CajaPage />
      case 'usuarios':
        return <UsuariosPage />
      //case 'estadisticas':
        //return <AdminDashboard />
      default:
        return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2, backgroundColor: '#f5f7fa', height: '100vh' }}> 
          <Box 
            sx={{ 
              flexGrow: 1, 
              backgroundImage: 'linear-gradient(to bottom, #1976d2, #1565c0)',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              padding: 3,
              height: 'calc(100vh - 80px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Logo */}
            <Box sx={{ position: 'absolute', bottom: 20, left: 20 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      component="div"
                      sx={{
                        width: 80,
                        height: 40,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          width: 15,
                          height: 60,
                          backgroundColor: 'yellow',
                          borderRadius: '5px',
                          transform: 'rotate(15deg)',
                          left: 0,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: 15,
                          height: 50,
                          backgroundColor: 'orange',
                          borderRadius: '5px',
                          transform: 'rotate(8deg)',
                          left: 20,
                        }
                      }}
                    />
                    <Box
                      component="div"
                      sx={{
                        width: 15,
                        height: 40,
                        backgroundColor: 'red',
                        borderRadius: '5px',
                        transform: 'rotate(0deg)',
                        marginLeft: -6
                      }}
                    />
                    <Box
                      component="div"
                      sx={{
                        width: 15,
                        height: 30,
                        backgroundColor: 'green',
                        borderRadius: '5px',
                        transform: 'rotate(-8deg)',
                        marginLeft: 1
                      }}
                    />
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      width: 40,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid green',
                      position: 'absolute',
                      bottom: -10,
                      left: 20,
                      zIndex: 1
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: '#fff',
                    ml: 2,
                    fontFamily: 'Arial, sans-serif',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  Stock<span style={{ fontWeight: 'normal' }}>Facil</span>
                </Typography>
              </Box>
            </Box>
          </Box>
          </Box>
        );
    }
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="img"
            src={logo}
            alt="StockFácil Logo"
            sx={{ height: 40, mr: 1 }}
          />
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {menuItems.map((item) => (
        <Box
          key={item.key}
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            bgcolor: activePage === item.key ? 'primary.light' : 'transparent',
            color: activePage === item.key ? 'white' : 'text.primary',
            borderRadius: 0,
            borderLeft: activePage === item.key ? '4px solid' : '4px solid transparent',
            borderColor: activePage === item.key ? 'primary.dark' : 'transparent',
            '&:hover': {
              bgcolor: activePage === item.key ? 'primary.light' : 'rgba(0, 0, 0, 0.04)',
              cursor: 'pointer'
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => handleMenuClick(item.key)}
        >
          <Box sx={{ mr: 2, color: activePage === item.key ? 'white' : 'primary.main' }}>
            {item.icon}
          </Box>
          <Typography variant="body2" fontWeight={activePage === item.key ? 'bold' : 'regular'}>
            {item.text}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Chip 
              label={item.shortcut} 
              size="small" 
              variant="outlined" 
              sx={{ 
                height: 20, 
                '& .MuiChip-label': { px: 0.75, fontSize: '0.6rem' },
                bgcolor: activePage === item.key ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                borderColor: activePage === item.key ? 'white' : 'rgba(0, 0, 0, 0.2)',
                color: activePage === item.key ? 'white' : 'text.secondary',
              }} 
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Tooltip title="Ayuda" arrow>
          <IconButton color="primary">
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Configuración" arrow>
          <IconButton color="primary">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Salir" arrow>
          <IconButton color="error">
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top AppBar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0} 
          sx={{ 
            bgcolor: 'background.paper', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo/Brand for mobile */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  component="img"
                  src={logo}
                  alt=""
                  sx={{ height: 40, mr: 1 }}
                />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  
                </Typography>
              </Box>
            )}
            
            {/* Logo for desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Box 
                  component="img"
                  src={logo}
                  alt="StockFácil Logo"
                  sx={{ height: 40, mr: 1 }}
                />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  
                </Typography>
              </Box>
            )}
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Grid 
                container 
                spacing={1} 
                justifyContent="center" 
                sx={{ 
                  maxWidth: 1200,
                  mx: 'auto'
                }}
              >
                {menuItems.map((item) => (
                  <Grid item key={item.key}>
                    <Tooltip 
                      title={`${item.text} (${item.shortcut})`} 
                      arrow
                      TransitionComponent={Zoom}
                      placement="bottom"
                    >
                      <Paper 
                        elevation={activePage === item.key ? 4 : 0} 
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                          px: isTablet ? 1 : 1.5,
                          width: isTablet ? 68 : 80,
                          height: isTablet ? 70 : 76,  // Increased height for better spacing
                          cursor: 'pointer',
                          bgcolor: activePage === item.key ? 'primary.main' : 'background.paper',
                          color: activePage === item.key ? 'white' : 'text.primary',
                          borderBottom: '3px solid',
                          borderBottomColor: activePage === item.key ? 'primary.dark' : 'transparent',
                          transition: 'all 0.2s ease-in-out',
                          overflow: 'visible', // Changed from 'hidden' to 'visible'
                          '&:hover': {
                            bgcolor: activePage === item.key ? 'primary.main' : 'rgba(25, 118, 210, 0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: activePage === item.key ? 4 : 2
                          },
                        }}
                        onClick={() => handleMenuClick(item.key)}
                      >
                        {/* Restructured content for better spacing */}
                        <Box sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 0.5
                        }}>
                          <Box 
                            sx={{ 
                              color: activePage === item.key ? 'white' : 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.2s ease-in-out',
                              transform: activePage === item.key ? 'scale(1.1)' : 'scale(1)'
                            }}
                          >
                            {item.icon}
                          </Box>
                          
                          <Box sx={{ textAlign: 'center', mt: 0.5 }}>
                            <Typography 
                              variant="caption" 
                              align="center" 
                              sx={{ 
                                fontSize: '0.90rem',
                                fontWeight: activePage === item.key ? 'bold' : 'regular',
                                color: activePage === item.key ? 'white' : 'text.secondary',
                                display: 'block'
                              }}
                            >
                              {item.text}
                            </Typography>
                            
                            {/* Chip moved out of Fade for better visibility */}
                            <Box sx={{ mt: 0.5, visibility: activePage === item.key ? 'visible' : 'hidden', height: 16 }}>
                              <Chip 
                                label={item.shortcut} 
                                size="small" 
                                variant="outlined" 
                                sx={{ 
                                  height: 16, 
                                  '& .MuiChip-label': { px: 0.5, fontSize: '0.6rem' },
                                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                                  borderColor: 'white',
                                  color: 'white',
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Right side actions */}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Mostrar atajos de teclado" arrow>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <KeyboardIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notificaciones" arrow>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Perfil" arrow>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
            }}
          >
            {drawer}
          </Drawer>
        )}
        
        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'background.default' }}>
          {renderPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;