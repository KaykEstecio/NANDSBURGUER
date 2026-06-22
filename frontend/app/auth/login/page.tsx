import { LoginForm } from '../../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-220px)] place-items-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_70px_rgba(23,20,18,0.15)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="burger-noise flex min-h-[430px] flex-col justify-end bg-[#171412] p-8 text-white sm:p-10">
          <div className="brand-rule" />
          <h1 className="display-title mt-6 max-w-md text-5xl leading-[0.92] sm:text-6xl">
            Seu próximo burger está a poucos cliques.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            Entre para pedir, acompanhar o preparo e consultar seu histórico.
          </p>
        </div>
        <div className="grid place-items-center p-5 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
