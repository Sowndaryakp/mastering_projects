import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  login: (user, role) => set({ user, role }),
  logout: () => set({ user: null, role: null }),
}));

export default useAuthStore; 