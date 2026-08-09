import { Sun, Moon } from 'lucide-react';

export default function Header({ temaEscuro, toggleTema }) {
  return (
    <header className="bg-primaria shadow-md transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <div className="text-[#fffefe] text-2xl font-black tracking-tight cursor-pointer">
          Vagas<span className="text-destaque">Link</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex gap-6 text-[#fffefe] font-medium opacity-90">
            <a href="#" className="hover:opacity-100 transition">Início</a>
            <a href="#" className="hover:opacity-100 transition">Contato</a>
          </nav>
          
          {/* Botão atualizado com os ícones do Lucide */}
          <button 
            onClick={toggleTema} 
            className="p-2.5 bg-hover rounded-full text-[#fffefe] hover:scale-110 transition transform shadow-sm cursor-pointer flex items-center justify-center"
            title={temaEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"}
          >
            {/* Se for tema escuro, mostra o Sol. Se for claro, mostra a Lua */}
            {temaEscuro ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
          </button>
        </div>

      </div>
    </header>
  );
}