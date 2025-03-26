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
  InputAdornment 
} from '@mui/material';
import { LockOpen as LockOpenIcon } from '@mui/icons-material';

interface AbrirCajaDialogProps {
  open: boolean;
  onClose: () => void;
  saldoInicial: number;
  setSaldoInicial: (val: number) => void;
  loading: boolean;
  confirmarAperturaCaja: () => void;
}

const AbrirCajaDialog: React.FC<AbrirCajaDialogProps> = ({
  open,
  onClose,
  saldoInicial,
  setSaldoInicial,
  loading,
  confirmarAperturaCaja
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Abrir Nueva Caja</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" gutterBottom>
            Se abrirá una nueva caja con la fecha y hora actuales.
          </Typography>
          
          <TextField
            label="Saldo Inicial"
            type="number"
            fullWidth
            margin="normal"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={confirmarAperturaCaja} 
          variant="contained" 
          color="success"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LockOpenIcon />}
        >
          Abrir Caja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbrirCajaDialog;