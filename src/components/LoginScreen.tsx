import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
}

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div
      style={{ background: 'var(--bg-primary)' }}
      className="min-h-screen flex items-center justify-center p-6"
    >

      {/* Centered content */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <h1
            className="text-7xl md:text-8xl font-bold mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Grid Monitor
          </h1>
          <p className="text-3xl md:text-4xl" style={{ color: 'var(--text-secondary)' }}>
            Electrical Grid Monitoring
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 p-10 md:p-12 rounded-2xl w-full max-w-3xl shadow-xl"
          style={{
            background: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
          }}
        >
          <div className="space-y-3">
            <label className="block text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-xl text-xl font-medium focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all"
              style={{
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: `2px solid var(--border-color)`,
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-xl text-xl font-medium focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all"
              style={{
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: `2px solid var(--border-color)`,
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div
              className="p-5 rounded-xl text-lg font-medium text-center"
              style={{
                background: 'var(--surface-critical)',
                color: 'var(--accent-critical)',
                border: '2px solid var(--accent-critical)',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 rounded-xl font-bold text-2xl text-white transition-all hover:opacity-90 active:scale-98 shadow-lg mt-6"
            style={{ background: 'var(--accent-primary)' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}