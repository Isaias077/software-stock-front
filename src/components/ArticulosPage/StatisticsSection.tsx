import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Badge } from '@mui/material';
import { Inventory as InventoryIcon, ShoppingCart as ShoppingCartIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';
import { ProductTableItem } from '../../Pages/ArticulosPage/types';

interface StatisticsSectionProps {
    productData: ProductTableItem[];
    formatCurrency: (value: number) => string;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ productData, formatCurrency }) => {
    const totalProducts = productData.length;
    const outOfStockProducts = productData.filter(p => p.stock <= 0).length;
    const totalValue = productData.reduce((sum, product) => sum + (product.precio * product.stock), 0); //@ts-ignore
    const damagedProducts = productData.filter(p => p.estado === 'roto').length;

    return (
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
                            background: 'linear-gradient(45deg, #fbe9e7 30%, #ffccbc 90%)',
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
                                        Productos en mal estado
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                                        {damagedProducts}
                                    </Typography>
                                </Box>
                                
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
    );
};

export default StatisticsSection;