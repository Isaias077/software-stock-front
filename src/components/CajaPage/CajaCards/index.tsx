import React from 'react';
import { Grid } from '@mui/material';
import CajaActualCard from './CajaActualCard';
import SaldoActualCard from './SaldoActualCard';
import AccionesRapidasCard from './AccionesRapidasCard';

interface CajaCardsProps {
  numeroCaja: number;
  fechaInicio: Date | null;
  fechaCierre: Date | null;
  horaInicio: Date | null;
  horaCierre: Date | null;
  efectivoTotal: number;
  efectivoReal: number;
  diferencia: number;
  estado: string;
  loading: boolean;
  handleCalcular: () => void;
  handleAbrirCaja: () => void;
  handleCerrarCaja: () => void;
  handleAgregarMovimiento: () => void;
  handleArticulosVendidos: () => void;
  setEfectivoReal: (val: number) => void;
  formatCurrency: (val: number) => string;
}

const CajaCards: React.FC<CajaCardsProps> = (props) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <CajaActualCard 
          numeroCaja={props.numeroCaja}
          fechaInicio={props.fechaInicio}
          fechaCierre={props.fechaCierre}
          horaInicio={props.horaInicio}
          horaCierre={props.horaCierre}
          loading={props.loading}
          handleCalcular={props.handleCalcular}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <SaldoActualCard 
          efectivoTotal={props.efectivoTotal}
          efectivoReal={props.efectivoReal}
          diferencia={props.diferencia}
          estado={props.estado}
          setEfectivoReal={props.setEfectivoReal}
          formatCurrency={props.formatCurrency}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <AccionesRapidasCard 
          estado={props.estado}
          loading={props.loading}
          handleAbrirCaja={props.handleAbrirCaja}
          handleCerrarCaja={props.handleCerrarCaja}
          handleAgregarMovimiento={props.handleAgregarMovimiento}
          handleArticulosVendidos={props.handleArticulosVendidos}
        />
      </Grid>
    </Grid>
  );
};

export default CajaCards;