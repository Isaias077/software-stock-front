import React from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  Tooltip, 
  IconButton 
} from '@mui/material';
import { 
  Print as PrintIcon, 
  ExitToApp as ExitIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';

interface ActionButtonsProps {
  handleImprimir: () => void;
  handleSalir: () => void;
  handleCalcular: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleImprimir,
  handleSalir,
  handleCalcular
}) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handleImprimir}
          color="info"
          sx={{ 
            borderRadius: 2,
            boxShadow: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 2
          }}
        >
          Imprimir
        </Button>
        
        <Button
          variant="contained"
          startIcon={<ExitIcon />}
          onClick={handleSalir}
          color="warning"
          sx={{ 
            borderRadius: 2,
            boxShadow: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 2
          }}
        >
          Salir
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
          Última actualización: {new Date().toLocaleTimeString()}
        </Typography>
        <Tooltip title="Actualizar">
          <IconButton size="small" color="primary" onClick={handleCalcular}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ActionButtons;