import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import DateRangeSelector from '../../components/Accounting/DateRangeSelector';
import SummaryCard from '../../components/Accounting/SummaryCard';
import ProductSalesTable from '../../components/Accounting/ProductSalesTable';
import MonthlyRevenueChart from '../../components/Accounting/MonthlyRevenueChart';
import { Product } from './ContabilidadPage';

// Mock data for the example
const generateMockProducts = (): Product[] => [
  { id: 1, name: 'EVEREADY AA X UNIDAD', code: '7551037600520', salesCount: 342, revenue: 1881.00, profit: 684.00 },
  { id: 2, name: 'ESPUMA GILLETTE', code: '47402241459', salesCount: 204, revenue: 4896.00, profit: 1632.00 },
  { id: 3, name: 'EVEREADY AAA X UNIDAD', code: '3892095285', salesCount: 186, revenue: 1302.00, profit: 372.00 },
  { id: 4, name: 'EVEREADY D GRANDE X UNO', code: '7551037600018', salesCount: 122, revenue: 1952.00, profit: 488.00 },
  { id: 5, name: 'ESPUMA', code: '77985255158301', salesCount: 104, revenue: 1768.00, profit: 520.00 },
];

const monthlyData = [
  { month: 'Ene', revenue: 45200, profit: 12800 },
  { month: 'Feb', revenue: 38700, profit: 10500 },
  { month: 'Mar', revenue: 52300, profit: 14600 },
  { month: 'Abr', revenue: 49800, profit: 13200 },
  { month: 'May', revenue: 58900, profit: 16700 },
  { month: 'Jun', revenue: 42700, profit: 11900 },
  { month: 'Jul', revenue: 65800, profit: 18500 },
  { month: 'Ago', revenue: 72300, profit: 21700 },
  { month: 'Sep', revenue: 63500, profit: 17800 },
  { month: 'Oct', revenue: 68900, profit: 19200 },
  { month: 'Nov', revenue: 73400, profit: 20900 },
  { month: 'Dic', revenue: 56700, profit: 15900 },
];

interface MostSoldProductProps {
  onDateRangeChange: (start: Date, end: Date) => void;
  dateRange: { start: Date; end: Date };
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const MostSoldProduct: React.FC<MostSoldProductProps> = ({ 
  onDateRangeChange, 
  dateRange,
  showSnackbar
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  // Simulate data loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockProducts = generateMockProducts();
      setProducts(mockProducts);
      
      // Calculate totals
      const revenue = mockProducts.reduce((sum, product) => sum + product.revenue, 0);
      const profit = mockProducts.reduce((sum, product) => sum + product.profit, 0);
      const sales = mockProducts.reduce((sum, product) => sum + product.salesCount, 0);
      
      setTotalRevenue(revenue);
      setTotalProfit(profit);
      setTotalSales(sales);
      setLoading(false);
    }, 500);
  }, [dateRange]);

  // Find the most sold product
  const mostSoldProduct = products.length > 0 
    ? products.reduce((prev, current) => 
        prev.salesCount > current.salesCount ? prev : current
      ) 
    : null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const handleExportReport = () => {
    showSnackbar('Reporte exportado correctamente', 'success');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Resumen de Ventas Mensual
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
            title="Ingresos Totales"
            value={formatCurrency(totalRevenue)}
            icon={<MoneyIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Ganancia Neta"
            value={formatCurrency(totalProfit)}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Unidades Vendidas"
            value={totalSales.toString()}
            icon={<InventoryIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Most Sold Product Section */}
      {mostSoldProduct && (
        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            Producto Más Vendido del Mes
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {mostSoldProduct.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Código: 
                    </Typography>
                    <Chip 
                      label={mostSoldProduct.code} 
                      size="small" 
                      sx={{ ml: 1, fontFamily: 'monospace' }} 
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Unidades:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {mostSoldProduct.salesCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Ingresos:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {formatCurrency(mostSoldProduct.revenue)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Ganancia:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {formatCurrency(mostSoldProduct.profit)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Rendimiento
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Margen de ganancia
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {((mostSoldProduct.profit / mostSoldProduct.revenue) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Contribución a ventas totales
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" color="primary.main">
                          {((mostSoldProduct.salesCount / totalSales) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Top Products Table */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Top 5 Productos
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<CalendarIcon />} 
            size="small"
            onClick={handleExportReport}
          >
            Exportar Reporte
          </Button>
        </Box>
        
        <ProductSalesTable products={products} formatCurrency={formatCurrency} />
      </Paper>

      {/* Monthly Revenue Chart */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Tendencia de Ventas Anuales
        </Typography>
        
        <MonthlyRevenueChart data={monthlyData} formatCurrency={formatCurrency} />
      </Paper>
    </Box>
  );
};

export default MostSoldProduct;