import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-14 border-t-2 border-secondary bg-[#171412] text-white">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-full border-2 border-secondary bg-primary text-2xl font-black shadow-[4px_4px_0_#e5a823]">
                N
              </span>
              <div>
                <p className="display-title text-2xl">Nands Burguer</p>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
                  Burger de verdade
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/65">
              Hambúrguer artesanal, chapa quente e pedido sem complicação. Delivery e retirada com
              sabor de hamburgueria de bairro.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold text-white/80">
              <span>Seg–Sex: 11h–22h</span>
              <span>Sáb–Dom: 12h–00h</span>
              <span>(11) 4000-1234</span>
            </div>
          </div>

          <div>
            <h2 className="display-title text-lg text-secondary">Navegue</h2>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm font-bold text-white/70">
              <Link href="/" className="transition hover:text-secondary">
                Início
              </Link>
              <Link href="/products" className="transition hover:text-secondary">
                Cardápio
              </Link>
              <Link href="/cart" className="transition hover:text-secondary">
                Carrinho
              </Link>
              <Link href="/orders" className="transition hover:text-secondary">
                Meus pedidos
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="display-title text-lg text-secondary">Encontre a Nands</h2>
            <div className="mt-4 space-y-2.5 text-sm leading-6 text-white/70">
              <p>Rua do Hambúrguer, 123</p>
              <p>Delivery e retirada no balcão</p>
              <p>Instagram · WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nands Burguer.</p>
          <p>Feito para matar a fome, não a paciência.</p>
        </div>
      </div>
    </footer>
  );
}
