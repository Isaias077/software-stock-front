import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Inventory as InventoryIcon } from '@mui/icons-material';

interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
        <InventoryIcon sx={{ mr: 1 }} />
        Gestión de Productos
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Buscar productos..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />
      </Box>
    </Box>
  );
};

export default ProductHeader;