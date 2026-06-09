'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-[2rem] border border-[#F77F00]/30 bg-white/95 p-10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] max-w-md backdrop-blur-sm">
      <div className="mb-8 space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D62828] text-3xl text-white shadow-lg shadow-[#D62828]/30">🍔</div>
        <h2 className="text-3xl font-bold">Bem-vindo de volta</h2>
        <p className="text-sm text-gray-600">Faça login e continue a sua jornada de sabor.</p>
      </div>

      {error && <div className="bg-[#ffe3e1] text-[#8b1818] p-4 rounded-3xl mb-6 border border-[#f7c0bf]">{error}</div>}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full rounded-full bg-[#D62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f] disabled:cursor-not-allowed disabled:bg-[#f3a29c]"
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
