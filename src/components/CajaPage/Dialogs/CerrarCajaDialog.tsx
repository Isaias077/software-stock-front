import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Grid,
    InputAdornment
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface CerrarCajaDialogProps {
    open: boolean;
    onClose: () => void;
    efectivoTotal: number;
    efectivoReal: number;
    diferencia: number;
    setEfectivoReal: (val: number) => void;
    loading: boolean;
    confirmarCierreCaja: () => void;
    formatCurrency: (val: number) => string;
}

const CerrarCajaDialog: React.FC<CerrarCajaDialogProps> = ({
    open,
    onClose,
    efectivoTotal,
    efectivoReal,
    diferencia,
    setEfectivoReal,
    loading,
    confirmarCierreCaja,
    formatCurrency
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Cerrar Caja Actual</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <Typography variant="body2" gutterBottom>
                        Por favor verifique los siguientes datos antes de cerrar la caja:
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Saldo Calculado"
                                fullWidth
                                value={formatCurrency(efectivoTotal)}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Saldo Real"
                                fullWidth
                                type="number"
                                value={efectivoReal}
                                onChange={(e) => setEfectivoReal(Number(e.target.value))}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Diferencia"
                                fullWidth
                                value={formatCurrency(diferencia)}
                                InputProps={{
                                    readOnly: true,
                                    style: {
                                        color: diferencia < 0 ? '#d32f2f' : diferencia > 0 ? '#2e7d32' : 'inherit',
                                        fontWeight: 'bold'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Observaciones"
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Ingrese observaciones sobre el cierre de caja..."
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={confirmarCierreCaja}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                >
                    Cerrar Caja
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CerrarCajaDialog;