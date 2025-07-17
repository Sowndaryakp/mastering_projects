import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const LOGIN_URL = 'http://localhost:8080/api/auth/login';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      role: null,
      user: null, // <-- add user to state
      email: null, // <-- add email to state
      error: null,
      login: async (email, password) => {
        try {
          const response = await axios.post(LOGIN_URL, { email, password });
          console.log('Login API response:', response.data);
          const { token, userId, role } = response.data;
          if (token && userId && role) {
            set({ token, userId, role, user: null, email, error: null }); // <-- set email on login
            return { success: true, role };
          } else {
            set({ error: response.data.message || 'Login failed or account not approved yet.' });
            return { success: false };
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed.' });
          return { success: false };
        }
      },
      logout: () => set({ token: null, userId: null, role: null, user: null, email: null, error: null }), // <-- clear email on logout
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);

// Clear zustand persisted storage on every page refresh
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    localStorage.removeItem('auth-storage');
  });
}

export default useAuthStore; 