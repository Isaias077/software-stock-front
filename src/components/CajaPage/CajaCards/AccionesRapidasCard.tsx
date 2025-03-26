import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button
} from '@mui/material';
import {
    LockOpen as LockOpenIcon,
    Lock as LockIcon,
    AddCircle as AddCircleIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

interface AccionesRapidasCardProps {
    estado: string;
    loading: boolean;
    handleAbrirCaja: () => void;
    handleCerrarCaja: () => void;
    handleAgregarMovimiento: () => void;
    handleArticulosVendidos: () => void;
}

const AccionesRapidasCard: React.FC<AccionesRapidasCardProps> = ({
    estado,
    loading,
    handleAbrirCaja,
    handleCerrarCaja,
    handleAgregarMovimiento,
    handleArticulosVendidos
}) => {
    return (
        <Card
            elevation={4}
            sx={{
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(120deg, #e3f2fd 0%, #bbdefb 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)'
                }
            }}
        >
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0d47a1', mb: 2 }}>
                    Acciones Rápidas
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            startIcon={<LockOpenIcon />}
                            onClick={handleAbrirCaja}
                            disabled={estado === "ABIERTO" || loading}
                            fullWidth
                            size="small"
                            sx={{
                                bgcolor: '#4caf50',
                                '&:hover': {
                                    bgcolor: '#388e3c'
                                }
                            }}
                        >
                            Abrir Caja
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            startIcon={<LockIcon />}
                            onClick={handleCerrarCaja}
                            disabled={estado === "CERRADO" || loading}
                            fullWidth
                            size="small"
                            sx={{
                                bgcolor: '#f44336',
                                '&:hover': {
                                    bgcolor: '#d32f2f'
                                }
                            }}
                        >
                            Cerrar Caja
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleIcon />}
                            onClick={handleAgregarMovimiento}
                            disabled={estado === "CERRADO" || loading}
                            fullWidth
                            size="small"
                            sx={{
                                mt: 1,
                                bgcolor: '#ff9800',
                                '&:hover': {
                                    bgcolor: '#f57c00'
                                }
                            }}
                        >
                            Nuevo Movimiento
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleArticulosVendidos}
                            fullWidth
                            size="small"
                            sx={{
                                mt: 1,
                                bgcolor: '#9c27b0',
                                '&:hover': {
                                    bgcolor: '#7b1fa2'
                                }
                            }}
                        >
                            Artículos Vendidos
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default AccionesRapidasCard;