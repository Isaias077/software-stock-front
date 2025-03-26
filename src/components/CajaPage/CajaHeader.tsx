import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Dashboard as DashboardIcon, LockOpen as LockOpenIcon, Lock as LockIcon } from '@mui/icons-material';

interface CajaHeaderProps {
  estado: string;
}

const CajaHeader: React.FC<CajaHeaderProps> = ({ estado }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Detalle de Caja
      </Typography>
      
      <Chip 
        label={estado} 
        color={estado === "ABIERTO" ? "success" : "default"}
        icon={estado === "ABIERTO" ? <LockOpenIcon /> : <LockIcon />}
        sx={{ fontWeight: 'bold', px: 1 }}
      />
    </Box>
  );
};

export default CajaHeader;