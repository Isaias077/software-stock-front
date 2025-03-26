import React from 'react';
import {
    Card, CardHeader, Typography, Box, IconButton, Tooltip, TableContainer,
    Paper, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody,
    Chip, Button
} from '@mui/material';
import {
    Print as PrintIcon, FileDownload as FileDownloadIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Inventory as InventoryIcon, Add as AddIcon
} from '@mui/icons-material';
import { ProductTableItem } from '../../Pages/ArticulosPage/types';

interface ProductTableProps {
    filteredData: ProductTableItem[];
    highlightedRow: string;
    isEditing: boolean;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    searchQuery: string;
    handleSort: (field: string) => void;
    handleRowClick: (product: ProductTableItem) => void;
    handleModifyProduct: () => void;
    handleDeleteProduct: () => void;
    handlePrintTable: () => void;
    setOpenExportMenuDialog: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
    handleNewProduct: () => void;
    formatCurrency: (value: number) => string;
    isButtonDisabled: (buttonType: string) => boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
    filteredData, highlightedRow, isEditing, sortField, sortOrder, searchQuery,
    handleSort, handleRowClick, handleModifyProduct, handleDeleteProduct,
    handlePrintTable, setOpenExportMenuDialog, setSearchQuery, handleNewProduct,
    formatCurrency, isButtonDisabled
}) => {
    return (
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardHeader
                title={
                    <Typography variant="h6" fontWeight="bold">
                        Listado de Productos ({filteredData.length})
                    </Typography>
                }
                action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Imprimir Listado">
                            <IconButton
                                color="primary"
                                onClick={handlePrintTable}
                                disabled={isButtonDisabled('print')}
                            >
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Exportar">
                            <IconButton
                                color="primary"
                                onClick={() => setOpenExportMenuDialog(true)}
                                disabled={isButtonDisabled('exportPDF')}
                            >
                                <FileDownloadIcon />
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
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ '& th': { backgroundColor: '#f5f5f5', fontWeight: 'bold' } }}>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'codigo'}
                                    direction={sortField === 'codigo' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('codigo')}
                                >
                                    Código
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'detalle'}
                                    direction={sortField === 'detalle' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('detalle')}
                                >
                                    Detalle
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'familia'}
                                    direction={sortField === 'familia' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('familia')}
                                >
                                    Familia
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'precio'}
                                    direction={sortField === 'precio' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('precio')}
                                >
                                    Precio
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'stock'}
                                    direction={sortField === 'stock' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('stock')}
                                >
                                    Stock
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((product) => (
                                <TableRow
                                    key={product.codigo}
                                    onClick={() => handleRowClick(product)}
                                    sx={{
                                        cursor: isEditing ? 'not-allowed' : 'pointer',
                                        backgroundColor: highlightedRow === product.codigo ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '&:hover': { backgroundColor: isEditing ? undefined : 'rgba(0, 0, 0, 0.04)' }
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {product.codigo}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{product.detalle}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.familia}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'primary.light',
                                                color: 'primary.contrastText',
                                                fontWeight: 'medium'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {formatCurrency(product.precio)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={product.stock}
                                            size="small"
                                            color={product.stock <= 0 ? "error" : "success"}
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRowClick(product);
                                                        handleModifyProduct();
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
                                                        handleRowClick(product);
                                                        handleDeleteProduct();
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
                                    {searchQuery ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <SearchIcon color="disabled" sx={{ fontSize: 40 }} />
                                            <Typography variant="body1" color="textSecondary">
                                                No se encontraron productos para "{searchQuery}"
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setSearchQuery('')}
                                                sx={{ mt: 1 }}
                                            >
                                                Limpiar búsqueda
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <InventoryIcon color="disabled" sx={{ fontSize: 40 }} />
                                            <Typography variant="body1" color="textSecondary">
                                                No hay productos disponibles
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={handleNewProduct}
                                                sx={{ mt: 1 }}
                                            >
                                                Agregar Producto
                                            </Button>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default ProductTable;