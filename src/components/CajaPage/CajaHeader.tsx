import React, { useState } from 'react';
import { Box, Typography, Chip, FormControl, Select, MenuItem, InputLabel, SelectChangeEvent, Button, Menu } from '@mui/material';
import { Dashboard as DashboardIcon, LockOpen as LockOpenIcon, Lock as LockIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';

interface CajaHeaderProps {
  estado: string;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const CajaHeader: React.FC<CajaHeaderProps> = ({ estado, selectedLocation, onLocationChange }) => {
  // Estado para el menú de ubicaciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Lista de ubicaciones disponibles (esto podría venir de una API en una implementación real)
  const locations = [
    "Sucursal Principal",
    "Sucursal Norte",
    "Sucursal Sur",
    "Sucursal Este",
    "Sucursal Oeste"
  ];
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    handleClose();
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mr: 2 }}>
          <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Detalle de Caja
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<LocationOnIcon />}
          onClick={handleClick}
          size="small"
          sx={{ 
            ml: 2, 
            textTransform: 'none',
            borderColor: '#1976d2',
            '&:hover': { borderColor: '#1565c0' }
          }}
        >
          {selectedLocation}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'location-button',
          }}
        >
          {locations.map((location) => (
            <MenuItem 
              key={location} 
              onClick={() => handleLocationSelect(location)}
              selected={location === selectedLocation}
            >
              {location}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      
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