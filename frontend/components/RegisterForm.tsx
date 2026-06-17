'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas nao conferem');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-[2rem] border border-[#F77F00]/30 bg-white/95 p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-10"
    >
      <div className="mb-8 space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F77F00] text-3xl font-black text-[#111] shadow-lg shadow-[#F77F00]/30">
          N
        </div>
        <h2 className="text-3xl font-bold">Junte-se ao Nands Burger</h2>
        <p className="text-sm text-gray-600">Crie sua conta e comece a pedir seus burgers favoritos.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-[#f7c0bf] bg-[#ffe3e1] p-4 text-[#8b1818]">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#111111]">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#111111]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#111111]">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#111111]">Confirmar senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-3xl border border-[#ddd] bg-[#faf3ed] px-4 py-3 text-sm outline-none transition focus:border-[#D62828]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full rounded-full bg-[#F77F00] px-6 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00] disabled:cursor-not-allowed disabled:bg-[#f8cf9d]"
      >
        {isLoading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}
