import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

import './localization';

import Header from './components/Header';
import EventForm from './components/EventForm';
import EventCard from './components/EventCard';
import EditEventDialog from './components/EditEventDialog';
import OwnerFilter from './components/OwnerFilter';
import DateRangeFilter from './components/DateRangeFilter';

import { 
  convertYyyyMmDdToDdMmYyyy, 
  convertDdMmYyyyToYyyyMmDd, 
  getTitleBackgroundColor, 
  getCardBackgroundColor 
} from './utils';

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
  spacing: 4,
});

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

function App() {
  const endpointUrl = 'https://0gssb4529e.execute-api.us-east-1.amazonaws.com/dev/event';
  const ownerEndpointUrl = 'https://0gssb4529e.execute-api.us-east-1.amazonaws.com/dev/owner';

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    guests: '',
    date: '',
    time: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    Auth.getCurrentUser({ bypassCache: true })
      .then(u => {
        setUser(u);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', (data) => {
      const { event } = data.payload;
      if (event === 'signIn') {
        Auth.getCurrentUser({ bypassCache: true })
          .then(u => {
            setUser(u);
            setIsAuthenticated(true);
            fetchEvents();
          })
          .catch(() => {
            setUser(null);
            setIsAuthenticated(false);
          });
      } else if (event === 'signOut') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchOwners();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(endpointUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await fetch(ownerEndpointUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();     
      setOwners(data);
    } catch (error) {
      console.error('Erro ao buscar owners:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    if (!formData.title || !formData.description || !formData.guests || !formData.date || !formData.time) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const eventData = {
      ...formData,
      owner: user ? user.username : null,
    };
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchEvents();
      setFormData({ title: '', description: '', guests: '', date: '', time: '' });
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const handleRemoveEvent = async (id) => {
    try {
      const response = await fetch(`${endpointUrl}?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    setEditingEvent(prev => ({ ...prev, [name]: value }));
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchEvents();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Erro ao editar evento:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    let ownerMatches = ownerFilter ? event.owner === ownerFilter : true;
    let dateMatches = true;
    
    if (dateRange.start) {
      dateMatches = event.date >= dateRange.start;
    }
    if (dateRange.end) {
      dateMatches = dateMatches && event.date <= dateRange.end;
    }
    
    return ownerMatches && dateMatches;
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ width: '95%', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Meus Eventos
        </Typography>
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          gap={2}
          mb={2}
        >
          <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
            <OwnerFilter owners={owners} onFilterChange={setOwnerFilter} />
          </Box>
          <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
            <DateRangeFilter onDateRangeChange={setDateRange} />
          </Box>
        </Box>
        {isAuthenticated && (
          <EventForm 
            formData={formData} 
            onInputChange={handleInputChange} 
            onAddEvent={handleAddEvent} 
          />
        )}
        <Grid container spacing={1}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAuthenticated={isAuthenticated}
              getCardBackgroundColor={getCardBackgroundColor}
              getTitleBackgroundColor={getTitleBackgroundColor}
              convertYyyyMmDdToDdMmYyyy={convertYyyyMmDdToDdMmYyyy}
              primaryButtonSx={primaryButtonSx}
              secondaryButtonSx={secondaryButtonSx}
              onEdit={handleOpenEditDialog}
              onRemove={handleRemoveEvent}
            />
          ))}
        </Grid>
        <EditEventDialog
          open={editDialogOpen}
          editingEvent={editingEvent}
          onEditInputChange={handleEditInputChange}
          onClose={handleCloseEditDialog}
          onSave={handleSaveEdit}
          primaryButtonSx={primaryButtonSx}
          secondaryButtonSx={secondaryButtonSx}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
