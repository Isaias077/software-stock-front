import React from 'react';
import { Dialog, DialogContent, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, children }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>
            <DialogContent sx={{ p: 0 }}>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;