import { create } from 'zustand';
import axios from 'axios';

const usePrincipalsStore = create((set) => ({
  principals: [],
  loading: false,
  error: '',
  fetchPrincipals: async () => {
    set({ loading: true, error: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/users/principals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ principals: res.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch principals', loading: false });
    }
  },
  updatePrincipalStatus: (id, updates) => {
    set((state) => ({
      principals: state.principals.map((principal) =>
        principal.id === id ? { ...principal, ...updates } : principal
      ),
    }));
  },
  getPrincipalById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/users/principals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updatePrincipal: async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:8080/api/users/principals/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  patchPrincipal: async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:8080/api/users/principals/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deletePrincipal: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/principals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      throw err;
    }
  },
}));

export default usePrincipalsStore; 