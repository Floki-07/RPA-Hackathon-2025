import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Choose endpoint based on whether it's an admin login or regular login
      const endpoint = isAdmin ? 'http://localhost:3000/api/admin/login' : 'http://localhost:3000/api/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', isAdmin);
        // Redirect to appropriate dashboard
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center w-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isAdmin ? 'Admin Login' : 'User Login'}
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded-md text-white transition-colors ${
              isAdmin 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isAdmin ? 'Login as Admin' : 'Login as User'}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center space-y-4">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            {isAdmin ? 'Switch to User Login' : 'Switch to Admin Login'}
          </button>
          
          {!isAdmin && (
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-500 hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;