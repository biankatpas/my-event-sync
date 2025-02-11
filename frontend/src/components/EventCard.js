import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardActions,
  Button
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EventCard = ({
  event,
  isAuthenticated,
  getCardBackgroundColor,
  getTitleBackgroundColor,
  convertYyyyMmDdToDdMmYyyy,
  primaryButtonSx,
  secondaryButtonSx,
  onEdit,
  onRemove
}) => {
  const cardBg = getCardBackgroundColor(event.date);
  return (
    <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
      <Card
        sx={{
          backgroundColor: cardBg,
          height: '14rem',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid`,
          borderRadius: '3px'
        }}
      >
        <CardContent sx={{ flexGrow: 1, overflow: 'hidden', mb: 1 }}>
          {/* Cabeçalho com data e horário */}
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <CalendarTodayIcon />
            </Grid>
            <Grid item xs>
              <Typography
                variant="h5"
                noWrap
                align="center"
                sx={{
                  fontFamily: '"Roboto Slab", serif',
                  fontWeight: 900
                }}
              >
                {convertYyyyMmDdToDdMmYyyy(event.date)} - {event.time}
              </Typography>
            </Grid>
          </Grid>
          
          {/* Chip combinando título e guests */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Chip
              label={`${event.guests.toUpperCase()} - ${event.title}`}
              sx={{
                backgroundColor: getTitleBackgroundColor(event.guests),
                color: 'white',
                fontWeight: 'bold',
                mt: 0.5
              }}
              size="small"
            />
          </Box>
          
          {/* Descrição do evento */}
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              fontFamily: '"Roboto", sans-serif',
              fontSize: '1rem',
              lineHeight: 1.6,
              fontWeight: 600,
              color: '#424242',
              textAlign: 'center'
            }}
          >
            {event.description}
          </Typography>
        </CardContent>
        
        {/* Botões de editar e remover evento */}
        {isAuthenticated && (
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => onEdit(event)}
              sx={primaryButtonSx}
              size="small"
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              variant="contained"
              onClick={() => onRemove(event.id)}
              sx={secondaryButtonSx}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default EventCard;
