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
      error: null,
      login: async (email, password) => {
        try {
          const response = await axios.post(LOGIN_URL, { email, password });
          const { token, userId, role } = response.data;
          if (token && userId && role) {
            set({ token, userId, role, error: null });
            return { success: true, role };
          } else {
            set({ error: 'Login failed or account not approved yet.' });
            return { success: false };
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed.' });
          return { success: false };
        }
      },
      logout: () => set({ token: null, userId: null, role: null, error: null }),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);

export default useAuthStore; 