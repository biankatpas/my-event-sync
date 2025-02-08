import React, { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import * as Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

function LoginPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    Auth.getCurrentUser()
      .then(user => {
        navigate('/', { replace: true });
      })
      .catch(error => {
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, [navigate]);

  useEffect(() => {
    const removeListener = Hub.listen('auth', (data) => {
      if (data.payload.event === 'signedIn') {
        navigate('/', { replace: true });
      }
    });
    return () => {
      removeListener();
    };
  }, [navigate]);

  if (checkingAuth) {
    return <div>Verificando autenticação...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Authenticator hideSignUp={false} />
    </div>
  );
}

export default LoginPage;
