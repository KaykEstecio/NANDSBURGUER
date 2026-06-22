'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setEmailError('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Informe um e-mail válido.');
      return;
    }
    if (!password.trim()) {
      setError('Informe sua senha.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Área do cliente</p>
      <h2 className="display-title mt-3 text-4xl">Bem-vindo de volta</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Entre com seus dados para continuar o pedido.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-primary/25 bg-primary/[0.07] p-4 text-sm font-bold text-primary">
          {error}
        </div>
      )}

      <div className="mt-7 space-y-5">
        <label className="block space-y-2 text-sm font-black">
          <span>E-mail</span>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError('');
            }}
            placeholder="seu@email.com"
            aria-invalid={Boolean(emailError)}
          />
          {emailError && <span className="block text-xs font-bold text-primary">{emailError}</span>}
        </label>
        <label className="block space-y-2 text-sm font-black">
          <span>Senha</span>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
          />
        </label>
      </div>

      <Button type="submit" disabled={isLoading || !email || !password} className="mt-7 w-full">
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link href="/auth/register" className="font-black text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
