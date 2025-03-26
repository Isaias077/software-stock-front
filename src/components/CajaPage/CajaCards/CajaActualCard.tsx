import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Grid, Button, CircularProgress } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface CajaActualCardProps {
  numeroCaja: number;
  fechaInicio: Date | null;
  fechaCierre: Date | null;
  horaInicio: Date | null;
  horaCierre: Date | null;
  loading: boolean;
  handleCalcular: () => void;
}

const CajaActualCard: React.FC<CajaActualCardProps> = ({
  numeroCaja,
  fechaInicio,
  fechaCierre,
  horaInicio,
  horaCierre,
  loading,
  handleCalcular
}) => {
  return (
    <Card 
      elevation={4} 
      sx={{ 
        height: '100%', 
        borderRadius: 2,
        background: 'linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%)',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#006064' }}>
            Caja Actual
          </Typography>
          <Chip 
            label={`#${numeroCaja}`} 
            color="primary" 
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'medium' }}>
              Fecha de Inicio
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {fechaInicio ? format(fechaInicio, 'dd/MM/yyyy') : 'No establecida'}
            </Typography>
            <Typography variant="body2">
              {horaInicio ? format(horaInicio, 'HH:mm') : ''}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'medium' }}>
              Fecha de Cierre
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {fechaCierre ? format(fechaCierre, 'dd/MM/yyyy') : 'No establecida'}
            </Typography>
            <Typography variant="body2">
              {horaCierre ? format(horaCierre, 'HH:mm') : ''}
            </Typography>
          </Grid>
        </Grid>
        
        <Button
          variant="contained"
          startIcon={<CalculateIcon />}
          onClick={handleCalcular}
          size="small"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ 
            mt: 2,
            bgcolor: '#0097a7',
            '&:hover': {
              bgcolor: '#00838f'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Calcular Totales'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CajaActualCard;