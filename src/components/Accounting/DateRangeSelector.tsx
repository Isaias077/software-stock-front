import React, { useState } from 'react';
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Popover,
    Typography,
    Stack
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { CalendarToday as CalendarIcon, ArrowDropDown as ArrowDownIcon } from '@mui/icons-material';
import { es } from 'date-fns/locale';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from 'date-fns';

interface DateRangeSelectorProps {
    dateRange: {
        start: Date;
        end: Date;
    };
    onDateRangeChange: (start: Date, end: Date) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, onDateRangeChange }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [customRangeAnchorEl, setCustomRangeAnchorEl] = useState<null | HTMLElement>(null);
    const [tempDateRange, setTempDateRange] = useState(dateRange);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenCustomRange = (event: React.MouseEvent<HTMLElement>) => {
        handleClose();
        setCustomRangeAnchorEl(event.currentTarget);
        setTempDateRange(dateRange);
    };

    const handleCloseCustomRange = () => {
        setCustomRangeAnchorEl(null);
    };

    const handleApplyCustomRange = () => {
        onDateRangeChange(tempDateRange.start, tempDateRange.end);
        handleCloseCustomRange();
    };

    const handlePresetRange = (preset: string) => {
        const today = new Date();
        let start: Date;
        let end: Date = today;

        switch (preset) {
            case 'thisMonth':
                start = startOfMonth(today);
                end = today;
                break;
            case 'lastMonth':
                const lastMonth = subMonths(today, 1);
                start = startOfMonth(lastMonth);
                end = endOfMonth(lastMonth);
                break;
            case 'last3Months':
                start = subMonths(today, 3);
                end = today;
                break;
            case 'thisYear':
                start = startOfYear(today);
                end = today;
                break;
            case 'lastYear':
                const lastYear = subMonths(today, 12);
                start = startOfYear(lastYear);
                end = endOfYear(lastYear);
                break;
            default:
                start = startOfMonth(today);
                end = today;
        }

        onDateRangeChange(start, end);
        handleClose();
    };

    // Format date for display
    const formatDateRange = () => {
        const startStr = format(dateRange.start, 'dd/MM/yyyy');
        const endStr = format(dateRange.end, 'dd/MM/yyyy');
        return `${startStr} - ${endStr}`;
    };

    return (
        <Box>
            <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                endIcon={<ArrowDownIcon />}
                onClick={handleClick}
                size="small"
            >
                {formatDateRange()}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handlePresetRange('thisMonth')}>Este mes</MenuItem>
                <MenuItem onClick={() => handlePresetRange('lastMonth')}>Mes anterior</MenuItem>
                <MenuItem onClick={() => handlePresetRange('last3Months')}>Últimos 3 meses</MenuItem>
                <MenuItem onClick={() => handlePresetRange('thisYear')}>Este año</MenuItem>
                <MenuItem onClick={() => handlePresetRange('lastYear')}>Año anterior</MenuItem>
                <MenuItem onClick={handleOpenCustomRange}>Rango personalizado...</MenuItem>
            </Menu>

            <Popover
                open={Boolean(customRangeAnchorEl)}
                anchorEl={customRangeAnchorEl}
                onClose={handleCloseCustomRange}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2, width: 320 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Seleccionar rango de fechas
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <Stack spacing={2} sx={{ my: 2 }}>
                            <DatePicker
                                label="Fecha inicial"
                                value={tempDateRange.start}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setTempDateRange((prev) => ({ ...prev, start: newValue }));
                                    }
                                }}
                                format="dd/MM/yyyy"
                                sx={{ width: '100%' }}
                            />

                            <DatePicker
                                label="Fecha final"
                                value={tempDateRange.end}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setTempDateRange((prev) => ({ ...prev, end: newValue }));
                                    }
                                }}
                                format="dd/MM/yyyy"
                                sx={{ width: '100%' }}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button onClick={handleCloseCustomRange}>Cancelar</Button>
                        <Button
                            variant="contained"
                            onClick={handleApplyCustomRange}
                            disabled={!tempDateRange.start || !tempDateRange.end}
                        >
                            Aplicar
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};

export default DateRangeSelector;