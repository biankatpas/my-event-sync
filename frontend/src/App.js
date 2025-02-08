import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { I18n } from '@aws-amplify/core';
import * as Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

// Define traduções para pt-BR
I18n.putVocabularies({
  'pt-BR': {
    'Sign In': 'Entrar',
    'Sign in': 'Entrar',
    'Signing in': 'Acessando',
    'Phone Number': 'Telefone',
    'Password': 'Senha',
    'Forgot your password?': 'Esqueceu sua senha?',
    'Create Account': 'Criar Nova Conta',
    'Confirm Password': 'Confirmar a senha',
    'Please confirm your Password': 'Confirmar a senha',
    'Reset Password': 'Redefinir sua senha',
    'Enter your phone number': 'Informe seu telefone',
    'Enter your Phone Number': 'Informe seu telefone',
    'Enter your Password': 'Informe sua senha',
    'Enter your Email': 'Informe seu email',
    'Send code': 'Enviar código',
    'Resend Code': 'Novo Código',
    'Back to Sign In': 'Voltar',
    'Sending': 'Enviando',
    'Code': 'Código',
    'Code *': 'Código',
    'New Password': 'Nova senha',
    'Submit': 'Alterar',
    'User does not exist.': 'Usuário não cadastrado.',
  }
});
I18n.setLanguage('pt-BR');

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

// Estilos para os botões
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
  const navigate = useNavigate();

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

  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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

  // Verifica o usuário autenticado ao carregar
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

  // Atualiza o estado via Hub (para signOut, por exemplo)
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', (data) => {
      const { event } = data.payload;
      console.log("Evento do Hub:", event);
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchEvents();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Erro ao editar evento:', error);
    }
  };

  // Função para redirecionar para a página de login
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

  const getCardBackgroundColor = (eventDate) => {
    if (eventDate < today) {
      return "#fafafa";
    } else if (eventDate === today) {
      return "#e8f5e9";
    } else if (eventDate === tomorrowStr) {
      return "#ffcdd2";
    } else if (eventDate === dayAfterTomorrowStr) {
      return "#fff9c4";
    } else {
      return "#f0f8ff";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ width: '95%', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Meus Eventos
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          {!isAuthenticated ? (
            <Typography variant="subtitle1">Bem-vindo!</Typography>
          ) : (
            <Typography variant="subtitle1">
              Olá, {user && user.signInDetails && user.signInDetails.loginId ? user.signInDetails.loginId : 'Usuário'}!
            </Typography>
          )}
          {!isAuthenticated ? (
            <Button variant="contained" onClick={handleLogin} sx={primaryButtonSx}>
              Entrar
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleLogout} sx={secondaryButtonSx}>
              Sair
            </Button>
          )}
        </Box>

        {/* Formulário para novo evento */}
        <Paper style={{ padding: '0.5rem', marginBottom: '2rem' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs="auto">
              <TextField
                label="Evento"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs="auto">
              <TextField
                label="Envolvidos"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs="auto">
              <TextField
                label="Data"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleInputChange}
                sx={{ width: '150px' }}
              />
            </Grid>
            <Grid item xs="auto">
              <TextField
                label="Horário"
                name="time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.time}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs="auto" sx={{ ml: 'auto' }}>
              <Button
                variant="contained"
                onClick={handleAddEvent}
                sx={{ ...primaryButtonSx, width: 60, minWidth: 60, height: '56px' }}
                disabled={!isAuthenticated}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Exibição dos eventos */}
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
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenEditDialog(event)}
                      sx={primaryButtonSx}
                      size="small"
                      disabled={!isAuthenticated}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleRemoveEvent(event.id)}
                      sx={secondaryButtonSx}
                      size="small"
                      disabled={!isAuthenticated}
                    >
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
          <DialogContent sx={{ pt: '1.5rem' }}>
            {editingEvent && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Evento"
                    name="title"
                    value={editingEvent.title}
                    onChange={handleEditInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descrição"
                    name="description"
                    value={editingEvent.description}
                    onChange={handleEditInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Envolvidos"
                    name="guests"
                    value={editingEvent.guests}
                    onChange={handleEditInputChange}
                    fullWidth
                  />
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
                    onChange={handleEditInputChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }}>
            <Button variant="contained" onClick={handleSaveEdit} sx={primaryButtonSx} size="small">
              <SaveIcon fontSize="small" />
            </Button>
            <Button variant="contained" onClick={handleCloseEditDialog} sx={{ ...secondaryButtonSx, ml: 1 }} size="small">
              <CancelIcon fontSize="small" />
            </Button>
          </Box>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;
