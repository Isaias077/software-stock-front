import React from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerSpendingChartProps {
    customerId: number;
    formatCurrency: (amount: number) => string;
}

const CustomerSpendingChart: React.FC<CustomerSpendingChartProps> = ({ customerId, formatCurrency }) => {
    const theme = useTheme();

    // Mock data - this would come from an API in a real app
    // Generate spending data for the last 6 months
    const generateMonthlySpending = (customerId: number) => {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        // Use customerId as seed for "random" but consistent data
        const seed = customerId * 1000;

        return months.map((month, index) => {
            // Generate spending with some variation based on customerId
            const baseSpending = 2000 + (seed % 5000) + (index * 500);
            const randomVariation = Math.sin(customerId + index) * 1000;
            const spending = Math.max(500, baseSpending + randomVariation);

            return {
                month,
                spending: Math.round(spending)
            };
        });
    };

    const spendingData = generateMonthlySpending(customerId);

    // Calculate average spending
    const avgSpending = spendingData.reduce((sum, month) => sum + month.spending, 0) / spendingData.length;

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
                        Gasto: {formatCurrency(payload[0].value)}
                    </p>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom>
                Evolución de Gastos (Últimos 6 meses)
            </Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
                Gasto promedio: {formatCurrency(avgSpending)}
            </Typography>

            <Box sx={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={spendingData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="spending"
                            name="Gasto"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default CustomerSpendingChart;