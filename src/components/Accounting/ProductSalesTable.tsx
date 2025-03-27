import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Chip,
    Paper
} from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import { Product } from '../../Pages/ContabilidadPage/ContabilidadPage';

interface ProductSalesTableProps {
    products: Product[];
    formatCurrency: (amount: number) => string;
}

const ProductSalesTable: React.FC<ProductSalesTableProps> = ({ products, formatCurrency }) => {
    // Sort products by salesCount (descending)
    const sortedProducts = [...products].sort((a, b) => b.salesCount - a.salesCount);

    // Take top 5 products
    const topProducts = sortedProducts.slice(0, 5);

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="medium">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Unidades Vendidas</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Ingresos</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Ganancia</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Margen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {topProducts.map((product, index) => {
                        const margin = (product.profit / product.revenue) * 100;
                        return (
                            <TableRow
                                key={product.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                                    bgcolor: index === 0 ? 'rgba(255, 243, 224, 0.5)' : 'inherit' // Highlight top product
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <InventoryIcon
                                            sx={{
                                                mr: 1,
                                                color: index === 0 ? 'warning.main' : 'primary.main'
                                            }}
                                        />
                                        <Typography fontWeight={index === 0 ? "bold" : "regular"}>
                                            {product.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace' }}>
                                    {product.code}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={product.salesCount}
                                        size="small"
                                        color={index === 0 ? "warning" : "primary"}
                                        variant={index === 0 ? "filled" : "outlined"}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {formatCurrency(product.revenue)}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography color="success.main" fontWeight={index === 0 ? "bold" : "regular"}>
                                        {formatCurrency(product.profit)}
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
                    {products.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No hay datos disponibles
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductSalesTable;