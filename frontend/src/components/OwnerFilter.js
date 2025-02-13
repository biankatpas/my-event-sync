import React, { useMemo, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const OwnerFilter = ({ owners, onFilterChange }) => {
  const [selectedOwner, setSelectedOwner] = useState('');

  const ownerOptions = useMemo(() => {
    return owners || [];
  }, [owners]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOwner(value);
    onFilterChange(value);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 4 }}>
      <InputLabel id="owner-filter-label">Filtrar Eventos</InputLabel>
      <Select
        labelId="owner-filter-label"
        id="owner-filter"
        value={selectedOwner}
        label="Filtrar Eventos"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {ownerOptions.map((owner) => (
          <MenuItem key={owner.id} value={owner.id}>
            {owner.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OwnerFilter;
