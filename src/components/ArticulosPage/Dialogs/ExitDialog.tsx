import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button
} from '@mui/material';

interface ExitDialogProps {
    open: boolean;
    onClose: () => void;
    handleConfirm: () => void;
}

const ExitDialog: React.FC<ExitDialogProps> = ({
    open, onClose, handleConfirm
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Confirmar salida</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tiene cambios sin guardar. ¿Está seguro que desea salir sin guardar?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    autoFocus
                >
                    Salir sin guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExitDialog;