import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading user profile...</p>;
  }

  if (!user) {
    return <p>Not logged in. <a href={`${import.meta.env.VITE_AUTH_BASE_URL}/auth/google`}>Login</a></p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Display Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* <p><strong>Google ID:</strong> {user.googleId}</p> */}
      {/* <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p> */}
    </div>
  );
};

export default UserProfile;
