import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, Stack
} from '@mui/material';
import {
    Print as PrintIcon,
    FileUpload as FileUploadIcon,
    FileDownload as FileDownloadIcon
} from '@mui/icons-material';

interface ExportDialogProps {
    open: boolean;
    onClose: () => void;
    handlePrintTable: () => void;
    handleExportToPDF: () => void;
    handleExportToExcel: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
    open, onClose, handlePrintTable, handleExportToPDF, handleExportToExcel
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Exportar datos</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Seleccione el formato para exportar los datos:
                </DialogContentText>
                <Stack spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={() => {
                            onClose();
                            handlePrintTable();
                        }}
                        fullWidth
                    >
                        Imprimir
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileUploadIcon />}
                        onClick={() => {
                            onClose();
                            handleExportToPDF();
                        }}
                        fullWidth
                    >
                        Exportar a PDF
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={() => {
                            onClose();
                            handleExportToExcel();
                        }}
                        fullWidth
                    >
                        Exportar a Excel (CSV)
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDialog;