import React, { useMemo, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const OwnerFilter = ({ events, onFilterChange }) => {
  const [selectedOwner, setSelectedOwner] = useState('');

  const ownerOptions = useMemo(() => {
    const ownersSet = new Set();
    events.forEach(event => {
      if (event.owner) {
        ownersSet.add(event.owner);
      }
    });
    return Array.from(ownersSet);
  }, [events]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOwner(value);
    onFilterChange(value);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
        {ownerOptions.map((owner, index) => (
          <MenuItem key={index} value={owner}>
            {owner}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OwnerFilter;
