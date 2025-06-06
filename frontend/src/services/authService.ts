import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

// Define a type for the user object for better type safety
export interface User {
  id: string; // or ObjectId, depending on your backend
  googleId: string;
  displayName: string;
  email: string;
  createdAt: string; // Or Date, if you parse it
}

const authService = {
  // Redirects to Google OAuth login URL
  loginWithGoogle: () => {
    window.location.href = `${AUTH_BASE_URL}/auth/google`;
  },

  // Fetches the current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axios.get<User>(`${AUTH_BASE_URL}/auth/current-user`, {
        withCredentials: true, // Important for sessions/cookies
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Not logged in
        return null;
      }
      console.error('Error fetching current user:', error);
      throw error; // Re-throw other errors
    }
  },

  // Logs out the user
  logout: async (): Promise<void> => {
    try {
      await axios.get(`${AUTH_BASE_URL}/auth/logout`, {
        withCredentials: true, // Important for sessions/cookies
      });
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
};

export default authService;
