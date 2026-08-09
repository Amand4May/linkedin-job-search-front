import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { buscarVagas } from '../services/vagasService'; 

// Mock de vagas, tirar depois
const mockVagas = [
  {
    id: '4403070416',
    title: 'Analista de Recursos Humanos',
    company_name: 'RHBH',
    location: 'Belo Horizonte, Minas Gerais, Brazil',
    posted_time: '3 months ago',
    description: 'Vaga para atuação no setor de RH...',
    url: 'https://www.linkedin.com/jobs/view/4403070416'
  }
];

export default function Home() {
  const [vagas, setVagas] = useState(mockVagas);
  const [carregando, setCarregando] = useState(false);
  
  const [termoBusca, setTermoBusca] = useState('');
  const [localBusca, setLocalBusca] = useState('');
  const [apenasRemoto, setApenasRemoto] = useState(false);
  
  const [listaCidades, setListaCidades] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [fezBusca, setFezBusca] = useState(false);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
      .then(res => res.json())
      .then(data => {
        const cidades = data.map(m => ({
          nome: m.nome,
          codigo_ibge: m.id,
          estado: m.microrregiao?.mesorregiao?.UF?.sigla || ''
        }));
        setListaCidades(cidades);
      })
      .catch(err => console.error("Erro ao carregar cidades da API", err));
  }, []);

  const sugestoesLocais = localBusca.trim().length < 2 ? [] : listaCidades.filter(cidade => 
    cidade.nome.toLowerCase().includes(localBusca.toLowerCase())
  ).slice(0, 6);

  // Substitui o setTimeout antigo pela chamada do service
  const handleBuscar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setFezBusca(true);
    setMostrarSugestoes(false);

    // Chama o back-end em Node.js através do service
    const resultados = await buscarVagas(termoBusca, apenasRemoto ? 'remoto' : localBusca);
    
    // Se o back-end estiver desligado, o service retorna array vazio []
    // Podemos tratar para exibir o mock ou manter vazio
    if (resultados.length > 0) {
      setVagas(resultados);
    } else {
      setVagas([]); // ou manter os mocks se preferir testar 
    }
    
    setCarregando(false);
  };

  return (
    <main className="flex-grow w-full max-w-5xl mx-auto p-6 flex flex-col">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 transition-all">
          Encontre seu próximo emprego
        </h1>
        <p className="text-mutado mb-10 font-medium text-lg">
          Busque oportunidades no LinkedIn de forma inteligente.
        </p>
        
        <form onSubmit={handleBuscar} className="max-w-4xl mx-auto relative">
          
          <div className="flex flex-col md:flex-row bg-card rounded-2xl md:rounded-full border-2 border-borda focus-within:border-destaque focus-within:ring-4 focus-within:ring-destaque/20 transition-all shadow-md">
            
            {/* Campo 1: Cargo ou Empresa */}
            <div className="flex-grow flex items-center px-6 py-4 md:py-2 border-b-2 md:border-b-0 md:border-r-2 border-borda">
              <Search className="text-mutado mr-3" size={24} />
              <input 
                type="text" 
                placeholder="Cargo ou empresa"
                className="w-full bg-transparent text-texto focus:outline-none text-lg placeholder:opacity-50"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>

            {/* Campo 2: Localização via API */}
            <div className="w-full md:w-56 flex items-center px-4 py-4 md:py-2">
              <MapPin className="text-mutado mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Cidade..."
                className="w-full bg-transparent text-texto focus:outline-none text-base placeholder:opacity-50 disabled:opacity-30"
                value={localBusca}
                onChange={(e) => {
                  setLocalBusca(e.target.value);
                  setMostrarSugestoes(true);
                }}
                onFocus={() => setMostrarSugestoes(true)}
                disabled={apenasRemoto}
              />
            </div>

            {/* Botão de Buscar */}
            <div className="p-2">
              <button 
                type="submit" 
                disabled={carregando}
                className="w-full md:w-auto bg-primaria hover:bg-hover text-[#fffefe] font-bold py-3 px-8 rounded-xl md:rounded-full transition disabled:opacity-50 cursor-pointer text-lg"
              >
                {carregando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Dropdown de Sugestões da API */}
          {mostrarSugestoes && sugestoesLocais.length > 0 && !apenasRemoto && (
            <div className="absolute left-0 right-0 mt-2 bg-card border-2 border-destaque rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
              {sugestoesLocais.map((cidade) => (
                <div 
                  key={cidade.codigo_ibge}
                  className="px-6 py-3 hover:bg-destaque hover:text-[#fffefe] cursor-pointer transition font-semibold text-sm border-b border-borda last:border-b-0 flex justify-between items-center"
                  onClick={() => {
                    setLocalBusca(cidade.nome);
                    setMostrarSugestoes(false);
                  }}
                >
                  <span>{cidade.nome}</span>
                  <span className="text-xs opacity-60 uppercase">{cidade.estado || ''}</span>
                </div>
              ))}
            </div>
          )}

          {/* Botão Toggle de Vagas Remotas */}
          <div className="mt-6 flex justify-center items-center gap-3">
            <span className={`font-semibold ${apenasRemoto ? 'text-destaque' : 'text-mutado'}`}>
              Apenas vagas remotas
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={apenasRemoto}
                onChange={(e) => {
                  setApenasRemoto(e.target.checked);
                  if(e.target.checked) setLocalBusca('');
                }}
              />
              <div className="w-12 h-6 bg-borda rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#fffefe] after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-destaque"></div>
            </label>
          </div>

        </form>
      </div>

      {carregando && (
        <div className="flex justify-center mt-12 flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-destaque"></div>
        </div>
      )}

      {!carregando && fezBusca && vagas.length === 0 && (
        <p className="text-center text-mutado mt-10 flex-grow font-semibold">
          Nenhuma vaga encontrada para sua busca.
        </p>
      )}

      {!carregando && vagas.length > 0 && (
        <div className="grid gap-6">
          {vagas.map((vaga) => (
            <div key={vaga.id} className="border-2 border-borda bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{vaga.title}</h2>
                  <div className="mt-1 text-mutado font-bold text-lg">{vaga.company_name}</div>
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="opacity-90 text-sm font-semibold px-3 py-1 rounded-full border bg-fundo border-borda">
                      📍 {vaga.location}
                    </span>
                    <span className="opacity-80 text-sm font-medium bg-fundo px-3 py-1 rounded-full border border-borda">
                      ⏱️ {vaga.posted_time}
                    </span>
                  </div>
                </div>

                <a
                  href={vaga.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-center bg-transparent border-2 border-destaque text-destaque font-bold px-6 py-2 rounded-lg hover:bg-destaque hover:text-[#fffefe] transition whitespace-nowrap"
                >
                  Ver no LinkedIn
                </a>
              </div>
              
              <p className="mt-5 text-sm opacity-90 line-clamp-3">
                {vaga.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}