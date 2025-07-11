import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  sidebarOpen: false,
  login: (user, role) => set({ user, role }),
  logout: () => set({ user: null, role: null }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));

export default useAuthStore; 