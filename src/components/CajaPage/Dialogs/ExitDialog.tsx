import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

interface ExitDialogProps {
    open: boolean;
    onClose: () => void;
    exitAction: () => void;
}

const ExitDialog: React.FC<ExitDialogProps> = ({
    open,
    onClose,
    exitAction
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Confirmar salida</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    La caja se encuentra abierta. ¿Está seguro que desea salir sin cerrarla?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={() => {
                        onClose();
                        exitAction();
                    }}
                    color="warning"
                >
                    Salir
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExitDialog;