import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';

interface CajaSnackbarProps {
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    };
    handleCloseSnackbar: () => void;
}

const CajaSnackbar: React.FC<CajaSnackbarProps> = ({
    snackbar,
    handleCloseSnackbar
}) => {
    return (
        <MuiSnackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </MuiSnackbar>
    );
};

export default CajaSnackbar;