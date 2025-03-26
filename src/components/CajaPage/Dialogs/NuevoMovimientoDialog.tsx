import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    InputAdornment,
    SelectChangeEvent
} from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    RemoveCircle as RemoveCircleIcon
} from '@mui/icons-material';

interface NuevoMovimientoDialogProps {
    open: boolean;
    onClose: () => void;
    nuevoMovimiento: {
        tipo: 'ingreso' | 'egreso';
        motivo: string;
        detalle: string;
        monto: number;
    };
    setNuevoMovimiento: (val: any) => void;
    handleGuardarNuevoMovimiento: () => void;
}

const NuevoMovimientoDialog: React.FC<NuevoMovimientoDialogProps> = ({
    open,
    onClose,
    nuevoMovimiento,
    setNuevoMovimiento,
    handleGuardarNuevoMovimiento
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Nuevo Movimiento de Caja</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de Movimiento</InputLabel>
                        <Select
                            value={nuevoMovimiento.tipo}
                            onChange={(e: SelectChangeEvent<'ingreso' | 'egreso'>) =>
                                setNuevoMovimiento({
                                    ...nuevoMovimiento,
                                    tipo: e.target.value as 'ingreso' | 'egreso'
                                })
                            }
                            label="Tipo de Movimiento"
                        >
                            <MenuItem value="ingreso">Ingreso</MenuItem>
                            <MenuItem value="egreso">Egreso</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Motivo"
                        fullWidth
                        margin="normal"
                        value={nuevoMovimiento.motivo}
                        onChange={(e) =>
                            setNuevoMovimiento({
                                ...nuevoMovimiento,
                                motivo: e.target.value
                            })
                        }
                        required
                    />

                    <TextField
                        label="Detalle"
                        fullWidth
                        margin="normal"
                        value={nuevoMovimiento.detalle}
                        onChange={(e) =>
                            setNuevoMovimiento({
                                ...nuevoMovimiento,
                                detalle: e.target.value
                            })
                        }
                        required
                    />

                    <TextField
                        label="Monto"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={nuevoMovimiento.monto}
                        onChange={(e) =>
                            setNuevoMovimiento({
                                ...nuevoMovimiento,
                                monto: Number(e.target.value)
                            })
                        }
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleGuardarNuevoMovimiento}
                    variant="contained"
                    color={nuevoMovimiento.tipo === 'ingreso' ? 'success' : 'error'}
                    startIcon={nuevoMovimiento.tipo === 'ingreso' ? <AddCircleIcon /> : <RemoveCircleIcon />}
                >
                    {nuevoMovimiento.tipo === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Egreso'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NuevoMovimientoDialog;