import React from 'react';
import { Paper, Grid, TextField, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const primaryButtonSx = {
  backgroundColor: '#64b5f6',
  color: 'white',
  padding: '4px',
  '&:hover': { backgroundColor: '#42a5f5' }
};

const EventForm = ({ formData, onInputChange, onAddEvent }) => (
  <Paper style={{ padding: '0.5rem', marginBottom: '2rem' }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm="auto">
        <TextField
          label="Evento"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm>
        <TextField
          label="Descrição"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <TextField
          label="Envolvidos"
          name="guests"
          value={formData.guests}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <TextField
          label="Data"
          name="date"
          type="date"
          InputLabelProps={{ shrink: true, sx: { pt: { xs: 1, sm: 0 } } }}
          value={formData.date}
          onChange={onInputChange}
          fullWidth
          sx={{ width: { xs: '100%', sm: '150px' } }}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <TextField
          label="Horário"
          name="time"
          type="time"
          InputLabelProps={{ shrink: true, sx: { pt: { xs: 1, sm: 0 } } }}
          value={formData.time}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm="auto" sx={{ ml: { xs: 0, sm: 'auto' }, mt: { xs: 1, sm: 0 } }}>
        <Button
          variant="contained"
          onClick={onAddEvent}
          sx={{ ...primaryButtonSx, width: 60, minWidth: 60, height: '56px' }}
        >
          <AddCircleOutlineIcon fontSize="small" />
        </Button>
      </Grid>
    </Grid>
  </Paper>
);

export default EventForm;
