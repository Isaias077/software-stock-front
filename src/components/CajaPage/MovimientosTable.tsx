import React from 'react';
import {
    Box,
    Typography,
    Tooltip,
    IconButton,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from '@mui/material';
import {
    SaveAlt as SaveAltIcon,
    PictureAsPdf as PdfIcon
} from '@mui/icons-material';

interface MovimientoCaja {
    id: number;
    motivo: string;
    detalle: string;
    total: number;
    ingreso: number;
    egreso: number;
    fecha?: Date;
    hora?: Date;
}

interface MovimientosTableProps {
    movimientos: MovimientoCaja[];
    tableRef: React.RefObject<HTMLDivElement>;
    selectedMovimiento: number | null;
    setSelectedMovimiento: (id: number | null) => void;
    totalSum: number;
    ingresoSum: number;
    egresoSum: number;
    formatCurrency: (val: number) => string;
    handleExportToExcel: () => void;
    handleExportToPDF: () => void;
}

const MovimientosTable: React.FC<MovimientosTableProps> = ({
    movimientos,
    tableRef,
    selectedMovimiento,
    setSelectedMovimiento,
    totalSum,
    ingresoSum,
    egresoSum,
    formatCurrency,
    handleExportToExcel,
    handleExportToPDF
}) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Resumen de Movimientos
                </Typography>

                <Box>
                    <Tooltip title="Exportar a Excel">
                        <IconButton
                            size="small"
                            onClick={handleExportToExcel}
                            sx={{ mr: 1 }}
                        >
                            <SaveAltIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Exportar a PDF">
                        <IconButton
                            size="small"
                            onClick={handleExportToPDF}
                            sx={{ mr: 1 }}
                        >
                            <PdfIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <TableContainer
                component={Paper}
                variant="outlined"
                ref={tableRef}
                sx={{ borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#1976d2' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Motivo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Detalle</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Ingreso</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Egreso</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movimientos.map((mov) => (
                            <TableRow
                                key={mov.id}
                                onClick={() => setSelectedMovimiento(mov.id)}
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: selectedMovimiento === mov.id ? '#e3f2fd' : 'inherit',
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                            >
                                <TableCell>{mov.motivo}</TableCell>
                                <TableCell>{mov.detalle}</TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        color: mov.total < 0 ? '#d32f2f' : mov.total > 0 ? '#2e7d32' : 'inherit',
                                        fontWeight: 'medium'
                                    }}
                                >
                                    {formatCurrency(mov.total)}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        color: '#2e7d32',
                                        fontWeight: mov.ingreso > 0 ? 'medium' : 'normal'
                                    }}
                                >
                                    {formatCurrency(mov.ingreso)}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        color: '#d32f2f',
                                        fontWeight: mov.egreso > 0 ? 'medium' : 'normal'
                                    }}
                                >
                                    {formatCurrency(mov.egreso)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {movimientos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    No hay movimientos registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                                Totales:
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 'bold',
                                    color: totalSum < 0 ? '#d32f2f' : totalSum > 0 ? '#2e7d32' : 'inherit'
                                }}
                            >
                                {formatCurrency(totalSum)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                {formatCurrency(ingresoSum)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                {formatCurrency(egresoSum)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MovimientosTable;