import { create } from 'zustand';
import axios from 'axios';

const useAdminStudentsStore = create((set) => ({
  students: [],
  loading: false,
  error: '',
  fetchStudents: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await axios.get('http://localhost:8080/api/users/students');
      set({ students: res.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch students', loading: false });
    }
  },
  updateStudentStatus: (id, approvalStatus, approverName, message) => {
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id
          ? { ...student, approvalStatus, approverName, message }
          : student
      ),
    }));
  },
}));

export default useAdminStudentsStore; 