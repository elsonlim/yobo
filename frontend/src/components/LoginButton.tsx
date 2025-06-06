import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginButton: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <button onClick={login} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Login with Google'}
    </button>
  );
};

export default LoginButton;
