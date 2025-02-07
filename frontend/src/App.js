import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const convertYyyyMmDdToDdMmYyyy = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const convertDdMmYyyyToYyyyMmDd = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

function App() {
  const endpointUrl = 'https://0gssb4529e.execute-api.us-east-1.amazonaws.com/dev/event';

  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    guests: '',
    date: '',
    time: ''
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(endpointUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    if (!formData.title || !formData.description || !formData.guests || !formData.date || !formData.time) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchEvents();
      setFormData({ title: '', description: '', guests: '', date: '', time: '' });
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const handleRemoveEvent = async (id) => {
    try {
      const response = await fetch(`${endpointUrl}?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchEvents();
    } catch (error) {
      console.error('Erro ao remover evento:', error);
    }
  };

  const handleOpenEditDialog = (event) => {
    const eventToEdit = { ...event, date: convertYyyyMmDdToDdMmYyyy(event.date) };
    setEditingEvent(eventToEdit);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingEvent(null);
    setEditDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    const updatedEvent = { ...editingEvent, date: convertDdMmYyyyToYyyyMmDd(editingEvent.date) };
    try {
      const response = await fetch(endpointUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchEvents();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Erro ao editar evento:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Meus Eventos
      </Typography>

      {/* new event form */}
      <Paper style={{ padding: '1rem', marginBottom: '2rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Evento" name="title" value={formData.title} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Local" name="description" value={formData.description} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Participantes" name="guests" value={formData.guests} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Data"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Horário"
              name="time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleAddEvent} fullWidth>
              Adicionar Evento
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* events table */}
      <TableContainer component={Paper} style={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="Tabela de Eventos">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Participantes</TableCell>
              <TableCell>Evento</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => {
              const rowStyle = event.date === today ? { backgroundColor: '#f0f0f0' } : {};
              return (
                <TableRow key={event.id} style={rowStyle}>
                  <TableCell>{convertYyyyMmDdToDdMmYyyy(event.date)}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.guests}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenEditDialog(event)} style={{ marginRight: '0.5rem' }}>
                      Editar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleRemoveEvent(event.id)}>
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* edit event modal */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar Evento</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem' }}>
          {editingEvent && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Evento" name="title" value={editingEvent.title} onChange={handleEditInputChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Local" name="description" value={editingEvent.description} onChange={handleEditInputChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Participantes" name="guests" value={editingEvent.guests} onChange={handleEditInputChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data (dd/mm/yyyy)"
                  name="date"
                  value={editingEvent.date}
                  onChange={handleEditInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
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
                  onChange={handleEditInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseEditDialog} color="secondary">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveEdit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
