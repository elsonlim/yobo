import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LogoutButton: React.FC = () => {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Optionally, redirect to home page or login page
    // For example: window.location.href = '/';
  };

  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
