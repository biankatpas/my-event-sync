import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const primaryButtonSx = {
    backgroundColor: '#64b5f6',
    color: 'white',
    padding: '4px',
    '&:hover': { backgroundColor: '#42a5f5' }
};

const DateRangeFilter = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    onDateRangeChange({ start: newStart, end: endDate });
  };

  const handleEndDateChange = (e) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    onDateRangeChange({ start: startDate, end: newEnd });
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange({ start: '', end: '' });
  };

  return (
    <Box display="flex" alignItems="center" gap={2} mt={2}>
      <TextField
        label="Data Inicial"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true, sx: { pt: { xs: 1, sm: 0 } } }}
        sx={{ width: { xs: '100%', sm: '150px' } }}
      />
      <TextField
        label="Data Final"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true, sx: { pt: { xs: 1, sm: 0 } } }}
        sx={{ width: { xs: '100%', sm: '150px' } }}
      />
      <Button 
        variant="outlined" 
        onClick={handleClear}
        sx={{ ...primaryButtonSx, width: 120, minWidth: 60, height: '56px' }}
      >
        Limpar
      </Button>
    </Box>
  );
};

export default DateRangeFilter;
