import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop
} from '@mui/material';
import {
    BarChart as BarChartIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon,
    Store as StoreIcon
} from '@mui/icons-material';

// Import components
import MostSoldProduct from './MostSoldProduct';
import LocationsSales from './LocationsSales';
import CustomerSalesHistory from './CustomerSalesHistory';

// Types
export interface Product {
    id: number;
    name: string;
    code: string;
    salesCount: number;
    revenue: number;
    profit: number;
    image?: string;
}

export interface Sale {
    id: number;
    date: string;
    customer: string;
    location: string;
    products: SaleProduct[];
    total: number;
    profit: number;
    paymentMethod: string;
}

export interface SaleProduct {
    id: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    total: number;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    totalPurchases: number;
    totalSpent: number;
    lastPurchase: string;
}

export interface Location {
    id: number;
    name: string;
    sales: number;
    revenue: number;
    expenses: number;
    profit: number;
}

const ContabilidadPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Mock data - in a real app this would come from an API
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(),
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    // Date range handler - would be passed to date pickers
    const handleDateRangeChange = (start: Date, end: Date) => {
        setDateRange({ start, end });
        // In a real app, this would trigger data reload
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showSnackbar('Datos actualizados correctamente', 'success');
        }, 800);
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <Container maxWidth="xl">
                {/* Page Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BarChartIcon sx={{ fontSize: 36, mr: 2, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            Contabilidad
                        </Typography>
                    </Box>
                </Box>

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
                            icon={<TrendingUpIcon />}
                            iconPosition="start"
                            label="Resumen Mensual"
                        />
                        <Tab
                            icon={<StoreIcon />}
                            iconPosition="start"
                            label="Ventas por Locales"
                        />
                        <Tab
                            icon={<AssessmentIcon />}
                            iconPosition="start"
                            label="Historial por Cliente"
                        />
                    </Tabs>

                    {/* Resumen Mensual */}
                    <Box sx={{ display: tabValue === 0 ? 'block' : 'none', p: 3 }}>
                        <MostSoldProduct
                            onDateRangeChange={handleDateRangeChange}
                            dateRange={dateRange}
                            showSnackbar={showSnackbar}
                        />
                    </Box>

                    {/* Ventas por Locales */}
                    <Box sx={{ display: tabValue === 1 ? 'block' : 'none', p: 3 }}>
                        <LocationsSales
                            onDateRangeChange={handleDateRangeChange}
                            dateRange={dateRange}
                            showSnackbar={showSnackbar}
                        />
                    </Box>

                    {/* Historial por Cliente */}
                    <Box sx={{ display: tabValue === 2 ? 'block' : 'none', p: 3 }}>
                        <CustomerSalesHistory
                            onDateRangeChange={handleDateRangeChange}
                            dateRange={dateRange}
                            showSnackbar={showSnackbar}
                        />
                    </Box>
                </Paper>
            </Container>

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

            {/* Loading Backdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default ContabilidadPage;