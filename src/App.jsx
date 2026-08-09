import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const mockVagas = [
  { id: "1", titulo: "Desenvolvedor Front-end React", empresa: "TechCorp", local: "Remoto", url_vaga: "#" },
  { id: "2", titulo: "Engenheiro de Dados Python", empresa: "DataLytics", local: "São Paulo, SP", url_vaga: "#" },
  { id: "3", titulo: "Desenvolvedor Full-Stack", empresa: "InovaTech", local: "Campinas, SP (Híbrido)", url_vaga: "#" },
  { id: "4", titulo: "DevOps Engineer", empresa: "CloudN", local: "Remoto", url_vaga: "#" },
];

export default function App() {
  const [vagas, setVagas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [fezBusca, setFezBusca] = useState(false);
  
  // Controle do Tema
  const [temaEscuro, setTemaEscuro] = useState(false);
  const toggleTema = () => setTemaEscuro(!temaEscuro);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!termoBusca.trim()) return;

    setCarregando(true);
    setFezBusca(true);

    setTimeout(() => {
      const resultados = mockVagas.filter(vaga => 
        vaga.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        vaga.empresa.toLowerCase().includes(termoBusca.toLowerCase())
      );
      
      setVagas(resultados);
      setCarregando(false);
    }, 1200);
  };

  return (
    <div className={temaEscuro ? 'dark' : ''}>
      
      {/* O app usa as nossas variáveis (bg-fundo, text-texto) */}
      <div className="min-h-screen flex flex-col bg-fundo text-texto font-sans transition-colors duration-300">
        
        <Header temaEscuro={temaEscuro} toggleTema={toggleTema} />

        <main className="flex-grow w-full max-w-4xl mx-auto p-8 flex flex-col">
          <div className="text-center mb-10 mt-6">
            <h1 className="text-4xl font-extrabold mb-4">Encontre seu próximo emprego</h1>
            <p className="text-mutado mb-8 font-medium">Busque oportunidades no LinkedIn rapidamente.</p>
            
            <form onSubmit={handleBuscar} className="flex gap-2 max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Ex: React, Python, Front-end..."
                className="w-full p-4 rounded-lg border-2 border-borda bg-card text-texto focus:outline-none focus:ring-2 focus:ring-destaque shadow-sm transition-colors"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={carregando}
                className="bg-primaria hover:bg-hover text-[#fffefe] font-bold py-4 px-8 rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {carregando ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
          </div>

          {carregando && (
            <div className="flex justify-center mt-12 flex-grow">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-destaque"></div>
            </div>
          )}

          {!carregando && fezBusca && vagas.length === 0 && (
            <p className="text-center text-mutado mt-10 flex-grow font-semibold">Nenhuma vaga encontrada para "{termoBusca}".</p>
          )}

          {!carregando && vagas.length > 0 && (
            <div className="grid gap-6">
              {vagas.map((vaga) => (
                <div key={vaga.id} className="border-2 border-borda bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <h2 className="text-2xl font-bold">{vaga.titulo}</h2>
                  <div className="mt-2 text-mutado font-bold">{vaga.empresa}</div>
                  <div className="opacity-80 text-sm mt-1">{vaga.local}</div>
                  <a
                    href={vaga.url_vaga}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 bg-transparent border-2 border-destaque text-destaque font-bold px-5 py-2 rounded-lg hover:bg-destaque hover:text-[#fffefe] transition"
                  >
                    Ver no LinkedIn
                  </a>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}