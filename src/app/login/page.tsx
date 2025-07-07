"use client";
const API_BASE_URL = "http://localhost:19000";

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          // Redirect or update UI after login success
          localStorage.setItem('authToken', data.token);
          window.location.href = '/';
        } else {
          setError('Token not received.');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side */}
      <div className="flex flex-col justify-center items-start p-8 lg:w-1/2 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome Back <span role="img" aria-label="wave">👋</span></h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Today is a new day. It's your day. You shape it.<br />
          Sign in to start managing your projects.
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            placeholder="Example@email.com"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <div className="text-right mb-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
          </div>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="flex items-center my-6 w-full">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <button className="w-full mb-3 py-2 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-100">
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
        <button className="w-full py-2 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-100">
          <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
          <span>Sign in with Facebook</span>
        </button>
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't you have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
        </p>
        <p className="mt-6 text-center text-gray-400 text-xs">&copy; 2023 ALL RIGHTS RESERVED</p>
      </div>

      {/* Right side image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center rounded-l-lg" style={{ backgroundImage: "url('/flower-painting.jpg')" }}></div>

      {/* Mobile image */}
      <div className="lg:hidden w-full h-64 bg-cover bg-center" style={{ backgroundImage: "url('/flower-painting.jpg')" }}></div>
    </div>
  );
}
