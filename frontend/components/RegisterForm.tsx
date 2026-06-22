'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password, name);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
        Primeiro pedido?
      </p>
      <h2 className="display-title mt-3 text-4xl">Crie sua conta</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Leva pouco tempo. A parte difícil é escolher o burger.
      </p>

      {error && (
        <div className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.07] p-4 text-sm font-bold text-primary">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm font-black">
          <span>Nome</span>
          <Input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-black">
          <span>E-mail</span>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-black">
          <span>Senha</span>
          <Input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-black">
          <span>Confirmar senha</span>
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </label>
      </div>

      <Button type="submit" disabled={isLoading} className="mt-7 w-full">
        {isLoading ? 'Criando conta...' : 'Criar conta'}
      </Button>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/auth/login" className="font-black text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
