import React from 'react';
import { Box, Button, Tooltip, Fade } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ActionButtonsProps {
    isEditing: boolean;
    handleNewProduct: () => void;
    isButtonDisabled: (buttonType: string) => boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isEditing, handleNewProduct, isButtonDisabled }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            <Tooltip title="Nuevo Producto" placement="left">
                <Fade in={!isEditing}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewProduct}
                        disabled={isButtonDisabled('new')}
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            boxShadow: 3
                        }}
                    >
                        <AddIcon />
                    </Button>
                </Fade>
            </Tooltip>
        </Box>
    );
};

export default ActionButtons;