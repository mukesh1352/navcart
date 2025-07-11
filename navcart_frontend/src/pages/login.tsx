import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user session exists
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('https://navcart.onrender.com/api/me', {
          method: 'GET',
          credentials: 'include', // Include session cookie
        });
        const data = await res.json();
        if (res.ok && data.loggedIn) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate({ to: '/' });
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };

    checkSession();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://navcart.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important to include session cookie
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('Login successful!');
      setTimeout(() => navigate({ to: '/' }), 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default Login;
