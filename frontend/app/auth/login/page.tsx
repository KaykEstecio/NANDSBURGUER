import { LoginForm } from '../../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-200px)] place-items-center px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:justify-center lg:gap-16">
        <div className="space-y-6 rounded-[2rem] border border-[#F77F00]/30 bg-[#000000] p-10 text-white shadow-xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Nands Burger</p>
          <h1 className="text-4xl font-bold">Entre e peça seu combo favorito</h1>
          <p className="max-w-sm text-gray-300">
            Acesse sua conta para salvar pedidos, ver o status e pedir com rapidez no delivery ou retirada.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
