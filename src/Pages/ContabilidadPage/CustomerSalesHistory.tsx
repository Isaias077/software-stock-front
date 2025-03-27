//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    TextField,
    InputAdornment,
    Button,
    Card,
    CardContent,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Collapse,
    Badge
} from '@mui/material';
import {
    Person as PersonIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    ShoppingBag as ShoppingBagIcon,
    Receipt as ReceiptIcon,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import DateRangeSelector from '../../components/Accounting/DateRangeSelector';
import CustomerSpendingChart from '../../components/Accounting/CustomerSpendingChart';
import { Customer, Sale } from './ContabilidadPage';

// Mock data for customers and sales
const generateMockCustomers = (): Customer[] => [
    { id: 1, name: 'Juan Pérez', email: 'jperez@email.com', phone: '555-1234', totalPurchases: 15, totalSpent: 32500, lastPurchase: '2023-04-28' },
    { id: 2, name: 'María López', email: 'mlopez@email.com', phone: '555-5678', totalPurchases: 8, totalSpent: 19300, lastPurchase: '2023-04-25' },
    { id: 3, name: 'Carlos Gómez', email: 'cgomez@email.com', phone: '555-9012', totalPurchases: 22, totalSpent: 44750, lastPurchase: '2023-04-29' },
    { id: 4, name: 'Ana Rodríguez', email: 'arodriguez@email.com', phone: '555-3456', totalPurchases: 11, totalSpent: 26800, lastPurchase: '2023-04-22' },
    { id: 5, name: 'Roberto Silva', email: 'rsilva@email.com', phone: '555-7890', totalPurchases: 5, totalSpent: 12500, lastPurchase: '2023-04-18' },
    { id: 6, name: 'Laura Martínez', email: 'lmartinez@email.com', phone: '555-2345', totalPurchases: 19, totalSpent: 38900, lastPurchase: '2023-04-30' },
    { id: 7, name: 'Pedro Díaz', email: 'pdiaz@email.com', phone: '555-6789', totalPurchases: 3, totalSpent: 8700, lastPurchase: '2023-04-15' },
];

const generateMockSales = (): Sale[] => [
    {
        id: 1,
        date: '2023-04-30 14:30:00',
        customer: 'Laura Martínez',
        location: 'Sucursal Principal',
        products: [
            { id: 1, name: 'ESPUMA GILLETTE', quantity: 2, price: 24.00, discount: 0, total: 48.00 },
            { id: 2, name: 'EVEREADY AA X UNIDAD', quantity: 4, price: 5.50, discount: 0, total: 22.00 }
        ],
        total: 70.00,
        profit: 23.00,
        paymentMethod: 'EFECTIVO'
    },
    {
        id: 2,
        date: '2023-04-29 11:15:00',
        customer: 'Carlos Gómez',
        location: 'Sucursal Norte',
        products: [
            { id: 3, name: 'EVEREADY D GRANDE X UNO', quantity: 3, price: 16.00, discount: 0, total: 48.00 },
            { id: 4, name: 'ESPUMA', quantity: 1, price: 17.00, discount: 0, total: 17.00 }
        ],
        total: 65.00,
        profit: 21.00,
        paymentMethod: 'TARJETA'
    },
    {
        id: 3,
        date: '2023-04-28 16:45:00',
        customer: 'Juan Pérez',
        location: 'Sucursal Este',
        products: [
            { id: 5, name: 'EVEREADY AAA X UNIDAD', quantity: 6, price: 7.00, discount: 0, total: 42.00 }
        ],
        total: 42.00,
        profit: 14.00,
        paymentMethod: 'EFECTIVO'
    },
    {
        id: 4,
        date: '2023-04-25 13:20:00',
        customer: 'María López',
        location: 'Sucursal Principal',
        products: [
            { id: 6, name: 'ESPUMA GILLETTE', quantity: 1, price: 24.00, discount: 0, total: 24.00 },
            { id: 7, name: 'EVEREADY C MEDIANA X UNO', quantity: 2, price: 12.00, discount: 0, total: 24.00 }
        ],
        total: 48.00,
        profit: 16.00,
        paymentMethod: 'TARJETA'
    },
    {
        id: 5,
        date: '2023-04-22 10:05:00',
        customer: 'Ana Rodríguez',
        location: 'Sucursal Sur',
        products: [
            { id: 8, name: 'ESPUMA ARTIFICIAL', quantity: 3, price: 9.50, discount: 0, total: 28.50 }
        ],
        total: 28.50,
        profit: 9.50,
        paymentMethod: 'EFECTIVO'
    }
];

interface CustomerSalesHistoryProps {
    onDateRangeChange: (start: Date, end: Date) => void;
    dateRange: { start: Date; end: Date };
    showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const CustomerSalesHistory: React.FC<CustomerSalesHistoryProps> = ({
    onDateRangeChange,
    dateRange,
    showSnackbar
}) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [expandedSales, setExpandedSales] = useState<number[]>([]);

    // Simulate data loading
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const mockCustomers = generateMockCustomers();
            const mockSales = generateMockSales();
            setCustomers(mockCustomers);
            setSales(mockSales);
            setLoading(false);
        }, 500);
    }, [dateRange]);

    // Filter customers based on search query
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle customer selection
    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
    };

    // Toggle sale expansion
    const toggleSaleExpansion = (saleId: number) => {
        setExpandedSales(prev =>
            prev.includes(saleId)
                ? prev.filter(id => id !== saleId)
                : [...prev, saleId]
        );
    };

    // Filter sales by selected customer
    const customerSales = selectedCustomer
        ? sales.filter(sale => sale.customer === selectedCustomer.name)
        : [];

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    Historial de Ventas por Cliente
                </Typography>
                <DateRangeSelector
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                />
            </Box>

            <Grid container spacing={3}>
                {/* Customers List */}
                <Grid item xs={12} md={selectedCustomer ? 6 : 12}>
                    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="bold">
                                Clientes
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    placeholder="Buscar cliente..."
                                    size="small"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    size="small"
                                    onClick={() => showSnackbar('Filtros aplicados', 'success')}
                                >
                                    Filtros
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} size="medium">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Compras</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Gastado</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Última Compra</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCustomers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((customer) => (
                                            <TableRow
                                                key={customer.id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                                                    bgcolor: selectedCustomer?.id === customer.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                        <Typography fontWeight={selectedCustomer?.id === customer.id ? "bold" : "regular"}>
                                                            {customer.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{customer.email}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={customer.totalPurchases}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{formatCurrency(customer.totalSpent)}</TableCell>
                                                <TableCell align="right">{formatDate(customer.lastPurchase)}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        endIcon={<ArrowForwardIcon />}
                                                        onClick={() => handleSelectCustomer(customer)}
                                                    >
                                                        Ver
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {filteredCustomers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body1" color="text.secondary">
                                                    No se encontraron clientes
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
                            count={filteredCustomers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        />
                    </Paper>
                </Grid>

                {/* Customer Details */}
                {selectedCustomer && (
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">
                                                {selectedCustomer.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedCustomer.email} | {selectedCustomer.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setSelectedCustomer(null)}
                                    >
                                        Cerrar
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Compras:
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                            {selectedCustomer.totalPurchases}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Gastado:
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color="success.main">
                                            {formatCurrency(selectedCustomer.totalSpent)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Última Compra:
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {formatDate(selectedCustomer.lastPurchase)}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3 }}>
                                    <CustomerSpendingChart
                                        customerId={selectedCustomer.id}
                                        formatCurrency={formatCurrency}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Customer Sales */}
                        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ShoppingBagIcon sx={{ mr: 1 }} />
                                    Historial de Compras
                                </Typography>
                            </Box>

                            <List sx={{ width: '100%', p: 0 }}>
                                {customerSales.map((sale) => (
                                    <React.Fragment key={sale.id}> 
                                        <ListItem
                                            sx={{
                                                px: 2,
                                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                                            }}
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => toggleSaleExpansion(sale.id)}>
                                                    {expandedSales.includes(sale.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            }
                                            button
                                            onClick={() => toggleSaleExpansion(sale.id)}
                                        >
                                            <ListItemIcon>
                                                <Badge badgeContent={sale.products.length} color="primary">
                                                    <ReceiptIcon color="primary" />
                                                </Badge>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            Venta #{sale.id}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                            {formatCurrency(sale.total)}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(sale.date).toLocaleString('es-AR')}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {sale.location} | {sale.paymentMethod}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <Collapse in={expandedSales.includes(sale.id)} timeout="auto" unmountOnExit>
                                            <Box sx={{ pl: 4, pr: 2, py: 1, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Detalle de productos:
                                                </Typography>
                                                <TableContainer component={Paper} variant="outlined">
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Producto</TableCell>
                                                                <TableCell align="center">Cantidad</TableCell>
                                                                <TableCell align="right">Precio</TableCell>
                                                                <TableCell align="right">Total</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {sale.products.map((product) => (
                                                                <TableRow key={product.id}>
                                                                    <TableCell>{product.name}</TableCell>
                                                                    <TableCell align="center">{product.quantity}</TableCell>
                                                                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                                                                    <TableCell align="right">{formatCurrency(product.total)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                            <TableRow>
                                                                <TableCell colSpan={2} />
                                                                <TableCell align="right">
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        Total:
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                                        {formatCurrency(sale.total)}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        </Collapse>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                                {customerSales.length === 0 && (
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ py: 3, textAlign: 'center' }}>
                                                    <Typography variant="body1" color="text.secondary">
                                                        No hay compras registradas para este cliente
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default CustomerSalesHistory;