import { create } from 'zustand';
import axios from 'axios';

const useClassTeachersStore = create((set) => ({
  classTeachers: [],
  loading: false,
  error: '',
  fetchClassTeachers: async () => {
    set({ loading: true, error: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/users/class-teachers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ classTeachers: res.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch class teachers', loading: false });
    }
  },
  updateClassTeacherStatus: (id, updates) => {
    set((state) => ({
      classTeachers: state.classTeachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updates } : teacher
      ),
    }));
  },
  getClassTeacherById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/users/class-teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateClassTeacher: async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:8080/api/users/class-teachers/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  patchClassTeacher: async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:8080/api/users/class-teachers/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteClassTeacher: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/class-teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      throw err;
    }
  },
}));

export default useClassTeachersStore; 