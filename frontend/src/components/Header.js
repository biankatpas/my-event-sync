import React from 'react';
import { Box, Typography, Button } from '@mui/material';

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

const Header = ({ isAuthenticated, user, onLogin, onLogout }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
    {!isAuthenticated ? (
      <Typography variant="subtitle1">Bem-vindo!</Typography>
    ) : (
      <Typography variant="subtitle1">
        Olá, {user && user.signInDetails && user.signInDetails.loginId ? user.signInDetails.loginId : 'Usuário'}!
      </Typography>
    )}
    {!isAuthenticated ? (
      <Button variant="contained" onClick={onLogin} sx={primaryButtonSx}>
        Entrar
      </Button>
    ) : (
      <Button variant="outlined" onClick={onLogout} sx={secondaryButtonSx}>
        Sair
      </Button>
    )}
  </Box>
);

export default Header;
