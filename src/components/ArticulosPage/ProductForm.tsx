import React from 'react';
import {
    Card, CardHeader, CardContent, Typography, Box, Grid, TextField,
    FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton,
    Button, Divider, Paper
} from '@mui/material';
import {
    ReceiptLong as ReceiptLongIcon, AttachMoney as AttachMoneyIcon,
    ShoppingCart as ShoppingCartIcon, PhotoCamera as PhotoCameraIcon,
    ImageNotSupported as ImageNotSupportedIcon, Search as SearchIcon,
    Save as SaveIcon, Add as AddIcon, Close as CloseIcon
} from '@mui/icons-material';
import { ProductDetail } from '../../Pages/ArticulosPage/types';

interface ProductFormProps {
    isEditing: boolean;
    isNewProduct: boolean;
    selectedProduct: ProductDetail;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
    handleSearchCode: () => void;
    handleSaveProduct: () => void;
    handleNewProduct: () => void;
    handleUploadImage: () => void;
    handleExit: () => void;
    isButtonDisabled: (buttonType: string) => boolean;
    setIsEditing: (isEditing: boolean) => void;
    setIsNewProduct: (isNewProduct: boolean) => void;
    setActiveTab: (tab: number) => void;
    productData: any[];
    handleRowClick: (product: any) => void;
    familias: string[];
    proveedores: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
    isEditing, isNewProduct, selectedProduct, handleInputChange, handleSelectChange,
    handleSearchCode, handleSaveProduct, handleNewProduct, handleUploadImage, handleExit,
    isButtonDisabled, setIsEditing, setIsNewProduct, setActiveTab, productData, handleRowClick,
    familias, proveedores
}) => {
    return (
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardHeader
                title={
                    <Typography variant="h6" fontWeight="bold">
                        {isNewProduct ? 'Nuevo Producto' : `Editando: ${selectedProduct.descripcion}`}
                    </Typography>
                }
                sx={{
                    backgroundColor: isEditing ? 'primary.light' : '#f5f5f5',
                    color: isEditing ? 'primary.contrastText' : 'inherit',
                    py: 1
                }}
            />

            <CardContent>
                <Grid container spacing={3}>
                    {/* Primera Sección */}
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <ReceiptLongIcon sx={{ mr: 1 }} />
                                Información Básica
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3} md={2}>
                                    <TextField
                                        label="Código"
                                        fullWidth
                                        size="small"
                                        name="codigo"
                                        value={selectedProduct.codigo}
                                        onChange={handleInputChange}
                                        disabled={false} // Hacemos el código siempre editable
                                        InputProps={{
                                            endAdornment: !isEditing ? (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={handleSearchCode}>
                                                        <SearchIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={5}>
                                    <TextField
                                        label="Descripción"
                                        fullWidth
                                        size="small"
                                        name="descripcion"
                                        value={selectedProduct.descripcion}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required
                                        error={isEditing && !selectedProduct.descripcion}
                                        helperText={isEditing && !selectedProduct.descripcion ? "Campo requerido" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="familia-label">Familia</InputLabel>
                                        <Select
                                            labelId="familia-label"
                                            name="familia"
                                            value={selectedProduct.familia}
                                            label="Familia" // @ts-ignore
                                            onChange={handleSelectChange}
                                            disabled={!isEditing}
                                        >
                                            {familias.map(familia => (
                                                <MenuItem key={familia} value={familia}>{familia}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={0} md={2}></Grid>

                                <Grid item xs={12} sm={3} md={2}>
                                    <TextField
                                        label="Marca"
                                        fullWidth
                                        size="small"
                                        name="marca"
                                        value={selectedProduct.marca}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="proveedor-label">Proveedor</InputLabel>
                                        <Select
                                            labelId="proveedor-label"
                                            name="proveedor"
                                            value={selectedProduct.proveedor}
                                            label="Proveedor" //@ts-ignore
                                            onChange={handleSelectChange}
                                            disabled={!isEditing}
                                        >
                                            {proveedores.map(proveedor => (
                                                <MenuItem key={proveedor} value={proveedor}>{proveedor}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* Segunda Sección */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <AttachMoneyIcon sx={{ mr: 1 }} />
                                Precios
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Precio de Costo"
                                        fullWidth
                                        size="small"
                                        name="precioCosto"
                                        value={selectedProduct.precioCosto.toFixed(2)}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Precio de Venta"
                                        fullWidth
                                        size="small"
                                        name="precioVenta"
                                        value={selectedProduct.precioVenta.toFixed(2)}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                        required
                                        error={isEditing && selectedProduct.precioVenta <= 0}
                                        helperText={isEditing && selectedProduct.precioVenta <= 0 ? "Debe ser mayor a 0" : ""}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="I.V.A."
                                        fullWidth
                                        size="small"
                                        name="iva"
                                        value={selectedProduct.iva}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            label="Cant x Mayor"
                                            size="small"
                                            name="cantXMayor"
                                            value={selectedProduct.cantXMayor}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            type="number"
                                            sx={{ width: 100 }}
                                        />
                                        <TextField
                                            label="$ x Mayor"
                                            size="small"
                                            name="precioXMayor"
                                            value={selectedProduct.precioXMayor}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            type="number"
                                            sx={{ flex: 1 }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Listas de Precios
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Lista 1"
                                        fullWidth
                                        size="small"
                                        name="unidadPrecioLista1"
                                        value={selectedProduct.unidadPrecioLista1}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Lista 2"
                                        fullWidth
                                        size="small"
                                        name="unidadPrecioLista2"
                                        value={selectedProduct.unidadPrecioLista2.toFixed(2)}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Lista 3"
                                        fullWidth
                                        size="small"
                                        name="unidadPrecioLista3"
                                        value={selectedProduct.unidadPrecioLista3.toFixed(2)}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* Tercera Sección */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <ShoppingCartIcon sx={{ mr: 1 }} />
                                Inventario y Adicionales
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Stock Actual"
                                        fullWidth
                                        size="small"
                                        name="stock"
                                        value={selectedProduct.stock}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Stock Mínimo"
                                        fullWidth
                                        size="small"
                                        name="stockMin"
                                        value={selectedProduct.stockMin}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Stock Ideal"
                                        fullWidth
                                        size="small"
                                        name="stockIdeal"
                                        value={selectedProduct.stockIdeal}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        type="number"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Nota del Producto"
                                        fullWidth
                                        size="small"
                                        name="nota"
                                        value={selectedProduct.nota}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleUploadImage}
                                            disabled={!isEditing}
                                            startIcon={<PhotoCameraIcon />}
                                        >
                                            Subir Imagen
                                        </Button>

                                        <Paper
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 120,
                                                height: 80,
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}
                                        >
                                            <ImageNotSupportedIcon sx={{ color: '#9e9e9e', fontSize: 32 }} />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    left: 0,
                                                    right: 0,
                                                    textAlign: 'center',
                                                    color: '#f44336',
                                                    fontWeight: 'bold',
                                                    bgcolor: 'rgba(255,255,255,0.7)',
                                                    py: 0.5
                                                }}
                                            >
                                                NO DISPONIBLE
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                        onClick={isEditing ? handleSaveProduct : handleNewProduct}
                        disabled={(isEditing && isButtonDisabled('save')) || (!isEditing && isButtonDisabled('new'))}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Nuevo Producto'}
                    </Button>
                    {isEditing && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setIsEditing(false);
                                setIsNewProduct(false);
                                setActiveTab(0); // Volver a la tabla

                                // Restaurar datos originales si no es nuevo
                                if (!isNewProduct) {
                                    const originalProduct = productData.find(p => p.codigo === selectedProduct.codigo);
                                    if (originalProduct) {
                                        handleRowClick(originalProduct);
                                    }
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={handleExit}
                >
                    Salir
                </Button>
            </Box>
        </Card>
    );
};

export default ProductForm;