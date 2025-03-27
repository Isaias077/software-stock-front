import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SummaryCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
    // Create gradient backgrounds based on color
    const getGradient = (color: string) => {
        switch (color) {
            case 'primary':
                return 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)';
            case 'secondary':
                return 'linear-gradient(45deg, #f3e5f5 30%, #e1bee7 90%)';
            case 'success':
                return 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)';
            case 'error':
                return 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)';
            case 'warning':
                return 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)';
            case 'info':
                return 'linear-gradient(45deg, #e1f5fe 30%, #b3e5fc 90%)';
            default:
                return 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)';
        }
    };

    // Get color for the icon/text
    const getColor = (color: string) => {
        return `${color}.main`;
    };

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 2,
                background: getGradient(color),
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="text.secondary" variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color={getColor(color)}>
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{
                        color: getColor(color),
                        opacity: 0.8,
                        '& > svg': {
                            fontSize: 40
                        }
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;