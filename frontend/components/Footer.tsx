export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white mt-16 border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#D62828] px-4 py-2 text-sm font-bold uppercase tracking-[0.35em] text-white shadow-lg shadow-[#D62828]/20">
              <span>🍔</span>
              Nands Burger
            </div>
            <p className="max-w-xl text-sm text-gray-300">
              A hamburgueria que entrega sabor artesanal, combos caprichados e atendimento rápido para seu pedido chegar sempre quentinho.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F77F00]">Atendimento</p>
                <p className="mt-2 text-sm text-gray-200">Seg-Sex 11h-22h • Sáb-Dom 12h-00h</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F77F00]">Contato</p>
                <p className="mt-2 text-sm text-gray-200">(11) 4000-1234 • WhatsApp</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#F77F00] mb-4">Navegação</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white">Início</a></li>
              <li><a href="/products" className="hover:text-white">Cardápio</a></li>
              <li><a href="/#promocoes" className="hover:text-white">Promoções</a></li>
              <li><a href="/#contato" className="hover:text-white">Contato</a></li>
              <li><a href="/cart" className="hover:text-white">Carrinho</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#F77F00] mb-4">Siga a Nands</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">WhatsApp</a></li>
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Atendimento</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#222222] mt-10 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2026 Nands Burger. Sabor e velocidade em cada pedido.</p>
        </div>
      </div>
    </footer>
  );
}
