import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export default function Header({ temaEscuro, toggleTema }) {
  return (
    <header className="bg-primaria shadow-md transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-[#fffefe] text-2xl font-black tracking-tight cursor-pointer hover:opacity-90 transition select-none"
          title="Voltar para o início"
          aria-label="Voltar para a página inicial"
        >
          Job<span className="text-destaque">In</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex gap-6 text-[#fffefe] font-medium opacity-90" aria-label="Navegação principal">
            <Link to="/" className="hover:opacity-100 transition">
              Início
            </Link>
            <Link to="/contato" className="hover:opacity-100 transition">
              Contato
            </Link>
          </nav>

          <button
            type="button"
            onClick={toggleTema}
            className="p-2.5 bg-hover rounded-full text-[#fffefe] hover:scale-110 transition transform shadow-sm cursor-pointer flex items-center justify-center"
            title={temaEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label={temaEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {temaEscuro ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </header>
  );
}