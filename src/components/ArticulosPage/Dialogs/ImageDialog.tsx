import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';

interface ImageDialogProps {
    open: boolean;
    onClose: () => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Subir imagen de producto</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                    <Box
                        sx={{
                            width: 200,
                            height: 200,
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main'
                            }
                        }}
                    >
                        <PhotoCameraIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Haga clic para seleccionar una imagen
                        </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
                        Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                    </Typography>

                    <Button variant="contained" color="primary" disabled>
                        Subir Imagen
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageDialog;