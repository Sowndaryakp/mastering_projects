import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { roles } from '../../utils/roleUtils';

const backgroundImage =
  "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1500&q=80')";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo: just show success, no real registration logic
    if (email && password && role) {
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError('Please fill in all fields.');
      setSuccess('');
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
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Register</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
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
          Register
        </button>
        {/* Go to Login link */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-700 hover:underline font-semibold">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 