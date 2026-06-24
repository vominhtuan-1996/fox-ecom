/**
 * Example Login Screen
 * Demonstrates using the auth module from SDK
 */

import React, { useState } from 'react';
import { useAuth } from '@/modules/auth';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return (
      <div className="screen login-screen authenticated">
        <h1>✅ Already Logged In</h1>
        <p>You are already authenticated</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result.success) {
      console.log('✅ Login successful');
      onLoginSuccess?.();
    } else {
      console.error('❌ Login failed:', result.error);
    }
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <h1>🔐 Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && <p className="error">❌ {error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="demo-hint">
          💡 Demo: Try any email/password to test auth flow
        </p>
      </div>
    </div>
  );
}
