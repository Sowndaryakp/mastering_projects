import { create } from 'zustand';
import axios from 'axios';

const useHODsStore = create((set) => ({
  hods: [],
  loading: false,
  error: '',
  fetchHODs: async () => {
    set({ loading: true, error: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/users/hods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ hods: res.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch HODs', loading: false });
    }
  },
  updateHODStatus: (id, updates) => {
    set((state) => ({
      hods: state.hods.map((hod) =>
        hod.id === id ? { ...hod, ...updates } : hod
      ),
    }));
  },
  getHODById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/users/hods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateHOD: async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:8080/api/users/hods/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  patchHOD: async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:8080/api/users/hods/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteHOD: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/hods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      throw err;
    }
  },
}));

export default useHODsStore; 