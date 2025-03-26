import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingIndicator: React.FC = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 9999
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingIndicator;