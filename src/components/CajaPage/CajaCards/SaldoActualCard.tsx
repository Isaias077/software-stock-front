import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Divider,
    Grid,
    TextField,
    InputAdornment
} from '@mui/material';
import { AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

interface SaldoActualCardProps {
    efectivoTotal: number;
    efectivoReal: number;
    diferencia: number;
    estado: string;
    setEfectivoReal: (val: number) => void;
    formatCurrency: (val: number) => string;
}

const SaldoActualCard: React.FC<SaldoActualCardProps> = ({
    efectivoTotal,
    efectivoReal,
    diferencia,
    estado,
    setEfectivoReal,
    formatCurrency
}) => {
    return (
        <Card
            elevation={4}
            sx={{
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)'
                }
            }}
        >
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
                    Saldo Actual
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: '#43a047', fontSize: 40, mr: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {formatCurrency(efectivoTotal)}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 'medium' }}>
                            Efectivo Real
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={efectivoReal}
                            onChange={(e) => setEfectivoReal(Number(e.target.value))}
                            disabled={estado === "CERRADO"}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{ mt: 0.5 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 'medium' }}>
                            Diferencia
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={formatCurrency(diferencia)}
                            InputProps={{
                                readOnly: true,
                                style: {
                                    color: diferencia < 0 ? '#d32f2f' : diferencia > 0 ? '#2e7d32' : 'inherit',
                                    fontWeight: 'bold'
                                }
                            }}
                            sx={{ mt: 0.5 }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default SaldoActualCard;