import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    Paper
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';

interface ArticuloVendido {
    id: number;
    codigo: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    total: number;
}

interface ArticulosDialogProps {
    open: boolean;
    onClose: () => void;
    articulosVendidos: ArticuloVendido[];
    formatCurrency: (val: number) => string;
    setSnackbar: (val: any) => void;
    setOpenArticulosDialog: (val: boolean) => void;
}

const ArticulosDialog: React.FC<ArticulosDialogProps> = ({
    open,
    onClose,
    articulosVendidos,
    formatCurrency,
    setSnackbar,
    setOpenArticulosDialog
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Artículos Vendidos</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell align="right">Cantidad</TableCell>
                                    <TableCell align="right">Precio</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {articulosVendidos.map((articulo) => (
                                    <TableRow key={articulo.id}>
                                        <TableCell>{articulo.codigo}</TableCell>
                                        <TableCell>{articulo.descripcion}</TableCell>
                                        <TableCell align="right">{articulo.cantidad}</TableCell>
                                        <TableCell align="right">{formatCurrency(articulo.precio)}</TableCell>
                                        <TableCell align="right">{formatCurrency(articulo.total)}</TableCell>
                                    </TableRow>
                                ))}
                                {articulosVendidos.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                            No hay artículos vendidos en esta caja
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                                        Total Vendido:
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(articulosVendidos.reduce((sum, art) => sum + art.total, 0))}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => {
                        // Lógica para imprimir artículos vendidos
                        setOpenArticulosDialog(false);
                        setSnackbar({
                            open: true,
                            message: 'Lista de artículos vendidos impresa correctamente',
                            severity: 'success'
                        });
                    }}
                >
                    Imprimir Lista
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ArticulosDialog;