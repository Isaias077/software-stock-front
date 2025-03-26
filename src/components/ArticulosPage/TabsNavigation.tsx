import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Category as CategoryIcon, DashboardCustomize as DashboardCustomizeIcon } from '@mui/icons-material';

interface TabsNavigationProps {
    activeTab: number;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, handleTabChange }) => {
    return (
        <Box sx={{ width: '100%', mb: 3 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{
                    '& .MuiTab-root': {
                        fontWeight: 'bold',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        py: 1,
                        px: 3,
                        minHeight: 48
                    },
                    '& .Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                    }
                }}
            >
                <Tab
                    icon={<CategoryIcon />}
                    iconPosition="start"
                    label="Listado de Productos"
                    sx={{ px: 3 }}
                />
                <Tab
                    icon={<DashboardCustomizeIcon />}
                    iconPosition="start"
                    label="Datos del Producto"
                />
            </Tabs>
        </Box>
    );
};

export default TabsNavigation;