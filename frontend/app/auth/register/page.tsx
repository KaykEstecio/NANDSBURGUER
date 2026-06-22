import { RegisterForm } from '../../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100vh-220px)] place-items-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_70px_rgba(23,20,18,0.15)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="burger-noise flex min-h-[500px] flex-col justify-end bg-primary p-8 text-white sm:p-10">
          <div className="h-1 w-16 bg-secondary" />
          <h1 className="display-title mt-6 max-w-md text-5xl leading-[0.92] sm:text-6xl">
            Crie sua conta. A chapa já está quente.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Cadastre-se para finalizar pedidos e acompanhar cada etapa.
          </p>
        </div>
        <div className="grid place-items-center p-5 sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
