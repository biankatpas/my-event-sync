import React from 'react';
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Box,
  Button
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditEventDialog = ({
  open,
  editingEvent,
  onEditInputChange,
  onClose,
  onSave,
  primaryButtonSx,
  secondaryButtonSx
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogContent sx={{ pt: '1.5rem' }}>
      {editingEvent && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Evento"
              name="title"
              value={editingEvent.title}
              onChange={onEditInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              name="description"
              value={editingEvent.description}
              onChange={onEditInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Envolvidos"
              name="guests"
              value={editingEvent.guests}
              onChange={onEditInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data (dd/mm/yyyy)"
              name="date"
              value={editingEvent.date}
              onChange={onEditInputChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1 }}>
                    <CalendarTodayIcon />
                  </Box>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Horário"
              name="time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={editingEvent.time}
              onChange={onEditInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
      )}
    </DialogContent>
    <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }}>
      <Button variant="contained" onClick={onSave} sx={primaryButtonSx} size="small">
        <SaveIcon fontSize="small" />
      </Button>
      <Button variant="contained" onClick={onClose} sx={{ ...secondaryButtonSx, ml: 1 }} size="small">
        <CancelIcon fontSize="small" />
      </Button>
    </Box>
  </Dialog>
);

export default EditEventDialog;
