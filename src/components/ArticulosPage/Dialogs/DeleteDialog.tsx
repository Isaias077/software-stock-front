import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ProductDetail } from '../../../Pages/ArticulosPage/types';

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    selectedProduct: ProductDetail;
    confirmDeleteProduct: () => void;
    loading: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    open, onClose, selectedProduct, confirmDeleteProduct, loading
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Está seguro que desea eliminar el producto "{selectedProduct.descripcion}"?
                    Esta acción no se puede deshacer.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button
                    onClick={confirmDeleteProduct}
                    color="error"
                    autoFocus
                    startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                    disabled={loading}
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;