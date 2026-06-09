import { RegisterForm } from '../../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100vh-200px)] place-items-center px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:justify-center lg:gap-16">
        <div className="space-y-6 rounded-[2rem] border border-[#D62828]/30 bg-[#000000] p-10 text-white shadow-xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Nands Burger</p>
          <h1 className="text-4xl font-bold">Crie sua conta e peça agora</h1>
          <p className="max-w-sm text-gray-300">
            Cadastre-se para ter pedidos salvos, histórico de compras e acesso ao balcão rápido.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
