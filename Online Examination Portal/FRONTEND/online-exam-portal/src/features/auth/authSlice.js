import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // can store userId or user object
  role: null,
  token: null,
  sidebarOpen: false,
  login: ({ token, userId, role }) => set({ user: userId, role, token }),
  logout: () => set({ user: null, role: null, token: null }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));

export default useAuthStore; 