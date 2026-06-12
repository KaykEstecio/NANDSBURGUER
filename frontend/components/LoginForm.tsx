'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    if (!password.trim()) {
      setError('Senha é obrigatória');
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email ou senha incorretos');
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

      {error && <div className="bg-[#ffe3e1] text-[#8b1818] p-3 rounded-2xl mb-5 border border-[#f7c0bf] text-sm flex items-center gap-2">
        <span>⚠️</span>
        {error}
      </div>}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim()) setEmailError('');
            }}
            placeholder="seu@email.com"
            className={`w-full rounded-3xl border bg-[#faf3ed] px-4 py-3 text-sm outline-none transition ${
              emailError ? 'border-[#D62828] focus:border-[#D62828]' : 'border-[#ddd] focus:border-[#D62828]'
            }`}
            required
          />
          {emailError && <p className="text-[#D62828] text-xs mt-1">{emailError}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111111] mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className="mt-8 w-full rounded-full bg-[#D62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f] disabled:cursor-not-allowed disabled:bg-[#f3a29c]"
      >
        {isLoading ? '⏳ Entrando...' : '🚀 Entrar'}
      </button>

      <p className="text-center text-xs text-gray-600 mt-6">
        Não tem conta? <a href="/auth/register" className="text-[#D62828] font-semibold hover:underline">Cadastre-se aqui</a>
      </p>
    </form>
  );
}
