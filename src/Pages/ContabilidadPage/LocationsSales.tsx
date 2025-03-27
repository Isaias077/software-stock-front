import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Card,
    CardContent,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Store as StoreIcon,
    Search as SearchIcon,
    AddBusiness as AddBusinessIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    ShowChart as ChartIcon,
    FileDownload as DownloadIcon
} from '@mui/icons-material';
import DateRangeSelector from '../../components/Accounting/DateRangeSelector';
import LocationsRevenueChart from '../../components/Accounting/LocationsRevenueChart';
import SummaryCard from '../../components/Accounting/SummaryCard';
import { Location } from './ContabilidadPage';

// Mock data for locations
const generateMockLocations = (): Location[] => [
    { id: 1, name: 'Sucursal Principal', sales: 879, revenue: 97500, expenses: 52000, profit: 45500 },
    { id: 2, name: 'Sucursal Norte', sales: 542, revenue: 62300, expenses: 36800, profit: 25500 },
    { id: 3, name: 'Sucursal Sur', sales: 412, revenue: 48900, expenses: 29500, profit: 19400 },
    { id: 4, name: 'Sucursal Este', sales: 367, revenue: 43200, expenses: 27100, profit: 16100 },
    { id: 5, name: 'Sucursal Oeste', sales: 521, revenue: 59700, expenses: 34800, profit: 24900 },
    { id: 6, name: 'Centro Comercial', sales: 684, revenue: 82100, expenses: 44900, profit: 37200 },
    { id: 7, name: 'Terminal', sales: 298, revenue: 34600, expenses: 23100, profit: 11500 },
];

interface LocationsSalesProps {
    onDateRangeChange: (start: Date, end: Date) => void;
    dateRange: { start: Date; end: Date };
    showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const LocationsSales: React.FC<LocationsSalesProps> = ({
    onDateRangeChange,
    dateRange,
    showSnackbar
}) => {
    const [locations, setLocations] = useState<Location[]>([]);
    // @ts-ignore
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalSales, setTotalSales] = useState(0);

    // Simulate data loading
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const mockLocations = generateMockLocations();
            setLocations(mockLocations);

            // Calculate totals
            const revenue = mockLocations.reduce((sum, location) => sum + location.revenue, 0);
            const profit = mockLocations.reduce((sum, location) => sum + location.profit, 0);
            const sales = mockLocations.reduce((sum, location) => sum + location.sales, 0);

            setTotalRevenue(revenue);
            setTotalProfit(profit);
            setTotalSales(sales);
            setLoading(false);
        }, 500);
    }, [dateRange]);

    // Filter locations based on search query
    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle pagination
    //@ts-ignore
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    const handleExportData = () => {
        showSnackbar('Datos exportados correctamente', 'success');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    Ventas por Locales
                </Typography>
                <DateRangeSelector
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                />
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Total de Locales"
                        value={locations.length.toString()}
                        icon={<StoreIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Ventas Totales"
                        value={formatCurrency(totalRevenue)}
                        icon={<MoneyIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Ganancia Total"
                        value={formatCurrency(totalProfit)}
                        icon={<TrendingUpIcon />}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Performance Chart */}
            <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ChartIcon sx={{ mr: 1 }} />
                        Rendimiento por Local
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportData}
                    >
                        Exportar Datos
                    </Button>
                </Box>

                <LocationsRevenueChart locations={locations} formatCurrency={formatCurrency} />
            </Paper>

            {/* Locations Table */}
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Detalle por Locales
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            placeholder="Buscar local..."
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
                            variant="contained"
                            startIcon={<AddBusinessIcon />}
                            size="small"
                            onClick={() => showSnackbar('Funcionalidad en desarrollo', 'info')}
                        >
                            Nuevo Local
                        </Button>
                    </Box>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 650 }} size="medium">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Local</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ventas</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Ingresos</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Gastos</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Beneficio</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Margen</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLocations
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((location) => {
                                    const margin = (location.profit / location.revenue) * 100;
                                    return (
                                        <TableRow
                                            key={location.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <StoreIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography fontWeight="medium">{location.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={location.sales}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">{formatCurrency(location.revenue)}</TableCell>
                                            <TableCell align="right">{formatCurrency(location.expenses)}</TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" color="success.main">
                                                    {formatCurrency(location.profit)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${margin.toFixed(1)}%`}
                                                    size="small"
                                                    color={margin > 30 ? "success" : margin > 20 ? "primary" : "warning"}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {filteredLocations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron locales
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
                    count={filteredLocations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>

            {/* Best Performing Location */}
            {locations.length > 0 && (
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Mejor Local por Rendimiento
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        {/* Get location with highest profit */}
                        {(() => {
                            const bestLocation = [...locations].sort((a, b) => b.profit - a.profit)[0];
                            return (
                                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <StoreIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                                            <Typography variant="h6" fontWeight="bold">
                                                {bestLocation.name}
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Ventas:
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {bestLocation.sales}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Ingresos:
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {formatCurrency(bestLocation.revenue)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Beneficio:
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" color="success.main">
                                                    {formatCurrency(bestLocation.profit)}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                                            <Typography variant="body2" color="success.dark">
                                                Margen de beneficio:
                                            </Typography>
                                            <Typography variant="h4" sx={{ mt: 1, color: 'success.dark', fontWeight: 'bold' }}>
                                                {((bestLocation.profit / bestLocation.revenue) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })()}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        {/* Get location with highest sales count */}
                        {(() => {
                            const mostActiveBranch = [...locations].sort((a, b) => b.sales - a.sales)[0];
                            return (
                                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <StoreIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                                            <Typography variant="h6" fontWeight="bold">
                                                Local Más Activo: {mostActiveBranch.name}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Contribución a las ventas totales:
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                {((mostActiveBranch.sales / totalSales) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Contribución a los ingresos:
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                {((mostActiveBranch.revenue / totalRevenue) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Contribución a las ganancias:
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                                {((mostActiveBranch.profit / totalProfit) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })()}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default LocationsSales;