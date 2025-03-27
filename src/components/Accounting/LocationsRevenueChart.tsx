import React from 'react';
import { Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Location } from '../../Pages/ContabilidadPage/ContabilidadPage';

interface LocationsRevenueChartProps {
    locations: Location[];
    formatCurrency: (amount: number) => string;
}

const LocationsRevenueChart: React.FC<LocationsRevenueChartProps> = ({ locations, formatCurrency }) => {
    const theme = useTheme();

    // Sort locations by revenue (descending)
    const sortedLocations = [...locations].sort((a, b) => b.revenue - a.revenue);

    // Prepare data for the chart
    const chartData = sortedLocations.map(location => ({
        name: location.name,
        revenue: location.revenue,
        profit: location.profit,
        expenses: location.expenses
    }));

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: '5px 0', color: theme.palette.primary.main }}>
                        Ingresos: {formatCurrency(payload[0].value)}
                    </p>
                    <p style={{ margin: '5px 0', color: theme.palette.error.main }}>
                        Gastos: {formatCurrency(payload[1].value)}
                    </p>
                    <p style={{ margin: 0, color: theme.palette.success.main }}>
                        Ganancia: {formatCurrency(payload[2].value)}
                    </p>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        label={{ value: 'Pesos (ARS)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                        dataKey="revenue"
                        name="Ingresos"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="expenses"
                        name="Gastos"
                        fill={theme.palette.error.main}
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="profit"
                        name="Ganancia"
                        fill={theme.palette.success.main}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default LocationsRevenueChart;