import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

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

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 400,
    },
  },
});

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

  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const dayAfterTomorrowDate = new Date(todayDate);
  dayAfterTomorrowDate.setDate(todayDate.getDate() + 2);
  const dayAfterTomorrowStr = dayAfterTomorrowDate.toISOString().split('T')[0];

  const getChipStyles = (eventDate) => {
    if (eventDate < today) {
      return { bg: "#e0e0e0", color: "black" };
    } else if (eventDate === today) {
      return { bg: "#c8e6c9", color: "black" };
    } else if (eventDate === tomorrowStr) {
      return { bg: "#f8bbd0", color: "black" };
    } else if (eventDate === dayAfterTomorrowStr) {
      return { bg: "#fff9c4", color: "black" };
    } else {
      return { bg: "#bbdefb", color: "black" };
    }
  };

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

  const getCardBackgroundColor = (eventDate) => {
    if (eventDate < today) {
      return "#fafafa";
    } else if (eventDate === today) {
      return "#e8f5e9";
    } else if (eventDate === tomorrowStr) {
      return "#ffcdd2";
    } else if (eventDate === dayAfterTomorrowStr) {
      return "#fffde7";
    } else {
      return "#f0f8ff";
    }
  };

  const primaryButtonSx = {
    backgroundColor: '#64b5f6',
    color: 'white',
    padding: '4px',
    '&:hover': { backgroundColor: '#42a5f5' }
  };

  const secondaryButtonSx = {
    backgroundColor: '#e57373',
    color: 'white',
    padding: '4px',
    '&:hover': { backgroundColor: '#ef5350' }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Meus Eventos
        </Typography>

        {/* Formulário para novo evento em uma única linha */}
        <Paper style={{ padding: '0.5rem', marginBottom: '2rem' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={2}>
              <TextField label="Evento" name="title" value={formData.title} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Descrição" name="description" value={formData.description} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label="Envolvidos" name="guests" value={formData.guests} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={1}>
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
            <Grid item xs={12} md={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleAddEvent}
                sx={{ ...primaryButtonSx, width: 60, minWidth: 60 }}
                size="small"
              >
                <AddCircleOutlineIcon fontSize="small" />
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Exibição dos eventos usando Cards (6 por linha no desktop) */}
        <Grid container spacing={1}>
          {events.map((event) => {
            const cardBg = getCardBackgroundColor(event.date);
            const chipStyles = getChipStyles(event.date);
            return (
              <Grid item xs={12} sm={6} md={2} key={event.id}>
                <Card sx={{ backgroundColor: cardBg }}>
                  <CardContent>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <CalendarTodayIcon />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">{event.title}</Typography>
                      </Grid>
                    </Grid>
                    <Chip 
                      label={event.guests} 
                      sx={{
                        backgroundColor: chipStyles.bg,
                        color: chipStyles.color,
                        fontWeight: 'bold',
                        mt: 0.5
                      }}
                      size="small"
                    />
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid item>
                        <Chip 
                          label={convertYyyyMmDdToDdMmYyyy(event.date)}
                          sx={{ backgroundColor: chipStyles.bg, color: chipStyles.color }}
                          size="small"
                        />
                      </Grid>
                      <Grid item>
                        <Chip 
                          label={event.time}
                          sx={{ backgroundColor: chipStyles.bg, color: chipStyles.color }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {event.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" onClick={() => handleOpenEditDialog(event)} sx={primaryButtonSx} size="small">
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button variant="contained" onClick={() => handleRemoveEvent(event.id)} sx={secondaryButtonSx} size="small">
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Modal de edição de evento */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogContent sx={{ pt: '1.5rem' }}>
            {editingEvent && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField label="Evento" name="title" value={editingEvent.title} onChange={handleEditInputChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Descrição" name="description" value={editingEvent.description} onChange={handleEditInputChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Envolvidos" name="guests" value={editingEvent.guests} onChange={handleEditInputChange} fullWidth />
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
            <Button variant="contained" onClick={handleCloseEditDialog} sx={secondaryButtonSx} size="small">
              <CancelIcon fontSize="small" />
            </Button>
            <Button variant="contained" onClick={handleSaveEdit} sx={primaryButtonSx} size="small">
              <SaveIcon fontSize="small" />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;
