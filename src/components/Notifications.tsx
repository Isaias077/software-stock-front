// src/Pages/ArticulosPage/components/Notifications.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarState } from '../Pages/ArticulosPage/types';

interface NotificationsProps {
    snackbar: SnackbarState;
    handleCloseSnackbar: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ snackbar, handleCloseSnackbar }) => {
    return (
        <Snackbar
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
        </Snackbar>
    );
};

export default Notifications;