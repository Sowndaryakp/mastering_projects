import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from './authSlice';
import { roles } from '../../utils/roleUtils';

// Hardcoded credentials for demo
const hardcodedUsers = [
  { email: 'student@example.com', password: '123456', role: 'student' },
  { email: 'teacher@example.com', password: '123456', role: 'teacher' },
  { email: 'hod@example.com', password: '123456', role: 'hod' },
  { email: 'principal@example.com', password: '123456', role: 'principal' },
  { email: 'admin@example.com', password: '123456', role: 'admin' },
];

const roleToPath = {
  student: '/student',
  teacher: '/teacher',
  hod: '/hod',
  principal: '/principal',
  admin: '/admin',
};

const backgroundImage =
  "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1500&q=80')"; // Online exam/education themed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = hardcodedUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    if (user) {
      login({ email: user.email }, user.role);
      navigate(roleToPath[user.role]);
    } else {
      setError('Invalid credentials or role.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow">Online Exam Portal</h1>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Login</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Role</label>
          <select
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow-lg hover:bg-blue-800 transition"
        >
          Login
        </button>
        {/* Register link */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-700 hover:underline font-semibold">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 