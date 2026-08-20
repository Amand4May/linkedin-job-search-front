import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, LoaderCircle } from 'lucide-react';
import { buscarVagas } from '../services/vagasService';

// Mock de vagas, tirar depois
const mockVagas = [
  {
    id: '4403070416',
    title: 'Analista de Recursos Humanos',
    company_name: 'RHBH',
    location: 'Sorocaba, São Paulo, Brasil',
    posted_time: '3 months ago',
    description: 'Vaga para atuação no setor de RH...',
    url: 'https://www.linkedin.com/jobs/view/4403070416',
  },
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
  const [erroBusca, setErroBusca] = useState('');
  const [erroCidades, setErroCidades] = useState('');

  useEffect(() => {
    const controlador = new AbortController();

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', {
      signal: controlador.signal,
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao carregar cidades');
        }

        return res.json();
      })
      .then((data) => {
        const cidades = data.map((municipio) => ({
          nome: municipio.nome,
          codigo_ibge: municipio.id,
          estado: municipio.microrregiao?.mesorregiao?.UF?.sigla || '',
        }));

        setListaCidades(cidades);
      })
      .catch((erro) => {
        if (erro.name !== 'AbortError') {
          console.error('Erro ao carregar cidades da API', erro);
          setErroCidades('Não foi possível carregar as cidades neste momento.');
        }
      });

    return () => controlador.abort();
  }, []);

  const sugestoesLocais = useMemo(() => {
    if (localBusca.trim().length < 2) {
      return [];
    }

    const termo = localBusca.toLowerCase();

    return listaCidades
      .filter((cidade) => cidade.nome.toLowerCase().includes(termo))
      .slice(0, 6);
  }, [listaCidades, localBusca]);

  const handleBuscar = async (evento) => {
    evento.preventDefault();
    setCarregando(true);
    setFezBusca(true);
    setMostrarSugestoes(false);
    setErroBusca('');

    //teste do loading, remover depois
    await new Promise(resolve => setTimeout(resolve, 3000));

    const resultados = await buscarVagas(termoBusca, apenasRemoto ? 'remoto' : localBusca);

    if (resultados.length > 0) {
      setVagas(resultados);
      setErroBusca('');
    } else {
      setVagas([]);
      setErroBusca('Nenhuma vaga encontrada para sua busca.');
    }

    setCarregando(false);
  };

  const sugestoesId = mostrarSugestoes && sugestoesLocais.length > 0 && !apenasRemoto ? 'sugestoes-locais' : undefined;

  return (
    <main id="conteudo-principal" className="flex-grow w-full max-w-5xl mx-auto p-6 flex flex-col" tabIndex="-1">
      <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-texto focus:shadow-lg">
        Pular para o conteúdo
      </a>

      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 transition-all">
          Encontre seu próximo emprego
        </h1>
        <p className="text-mutado mb-10 font-medium text-lg">
          Busque oportunidades no LinkedIn de forma inteligente.
        </p>

        <form onSubmit={handleBuscar} className="max-w-4xl mx-auto relative" aria-label="Formulário de busca de vagas">
          <div className="flex flex-col md:flex-row bg-card rounded-2xl md:rounded-full border-2 border-borda focus-within:border-destaque focus-within:ring-4 focus-within:ring-destaque/20 transition-all shadow-md">
            <div className="flex-grow flex items-center px-6 py-4 md:py-2 border-b-2 md:border-b-0 md:border-r-2 border-borda">
              <label htmlFor="cargo" className="sr-only">
                Cargo ou empresa
              </label>
              <Search className="text-mutado mr-3" size={24} aria-hidden="true" />
              <input
                id="cargo"
                name="cargo"
                type="text"
                placeholder="Cargo ou empresa"
                className="w-full bg-transparent text-texto focus:outline-none text-lg placeholder:opacity-50"
                value={termoBusca}
                onChange={(evento) => setTermoBusca(evento.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="w-full md:w-56 flex items-center px-4 py-4 md:py-2">
              <label htmlFor="local" className="sr-only">
                Cidade
              </label>
              <MapPin className="text-mutado mr-2" size={20} aria-hidden="true" />
              <input
                id="local"
                name="local"
                type="text"
                placeholder="Cidade..."
                className="w-full bg-transparent text-texto focus:outline-none text-base placeholder:opacity-50 disabled:opacity-30"
                value={localBusca}
                onChange={(evento) => {
                  setLocalBusca(evento.target.value);
                  setMostrarSugestoes(true);
                }}
                onFocus={() => setMostrarSugestoes(true)}
                disabled={apenasRemoto}
                autoComplete="address-level2"
                aria-autocomplete="list"
                aria-expanded={Boolean(sugestoesId)}
                aria-controls={sugestoesId}
              />
            </div>

            <div className="p-2">
              <button
                type="submit"
                disabled={carregando}
                className="w-full md:w-auto bg-primaria hover:bg-hover text-[#fffefe] font-bold py-3 px-8 rounded-xl md:rounded-full transition disabled:opacity-50 cursor-pointer text-lg"
              >
                {carregando ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
                    Buscando...
                  </span>
                ) : (
                  'Buscar'
                )}
              </button>
            </div>
          </div>

          {mostrarSugestoes && sugestoesLocais.length > 0 && !apenasRemoto && (
            <ul id="sugestoes-locais" className="absolute left-0 right-0 mt-2 bg-card border-2 border-destaque rounded-2xl shadow-2xl overflow-hidden z-50 text-left" role="listbox" aria-label="Sugestões de cidades">
              {sugestoesLocais.map((cidade) => (
                <li key={cidade.codigo_ibge} role="option" aria-selected={localBusca === cidade.nome}>
                  <button
                    type="button"
                    className="w-full px-6 py-3 hover:bg-destaque hover:text-[#fffefe] cursor-pointer transition font-semibold text-sm border-b border-borda last:border-b-0 flex justify-between items-center text-left"
                    onClick={() => {
                      setLocalBusca(cidade.nome);
                      setMostrarSugestoes(false);
                    }}
                  >
                    <span>{cidade.nome}</span>
                    <span className="text-xs opacity-60 uppercase">{cidade.estado || ''}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex justify-center items-center gap-3">
            <span className={`font-semibold ${apenasRemoto ? 'text-destaque' : 'text-mutado'}`}>
              Apenas vagas remotas
            </span>
            <label htmlFor="remoto" className="relative inline-flex items-center cursor-pointer">
              <input
                id="remoto"
                type="checkbox"
                className="sr-only peer"
                checked={apenasRemoto}
                onChange={(evento) => {
                  setApenasRemoto(evento.target.checked);
                  if (evento.target.checked) {
                    setLocalBusca('');
                  }
                }}
              />
              <span className="w-12 h-6 bg-borda rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#fffefe] after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-destaque"></span>
            </label>
          </div>
        </form>
      </div>

      {erroCidades && (
        <p role="alert" className="text-center text-sm text-mutado mb-6">
          {erroCidades}
        </p>
      )}

      {/* BLOCO DO SKELETON LOADING INSERIDO AQUI */}
      {carregando && (
        <section className="grid gap-6 mt-6" aria-live="polite" aria-busy="true">
          {[1, 2, 3].map((item) => (
            <article key={item} className="border-2 border-borda bg-card p-6 rounded-xl shadow-sm animate-pulse">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="w-full md:w-2/3">
                  <div className="h-8 bg-borda/60 rounded-md w-3/4 mb-3"></div>
                  <div className="h-6 bg-borda/50 rounded-md w-1/2 mb-4"></div>
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="h-7 bg-borda/40 rounded-full w-28"></div>
                    <div className="h-7 bg-borda/40 rounded-full w-24"></div>
                  </div>
                </div>

                <div className="h-11 w-full md:w-40 bg-borda/50 rounded-lg"></div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-4 bg-borda/40 rounded w-full"></div>
                <div className="h-4 bg-borda/40 rounded w-full"></div>
                <div className="h-4 bg-borda/40 rounded w-2/3"></div>
              </div>
            </article>
          ))}
        </section>
      )}

      {!carregando && fezBusca && vagas.length === 0 && (
        <p className="text-center text-mutado mt-10 flex-grow font-semibold" role="status" aria-live="polite">
          {erroBusca || 'Nenhuma vaga encontrada para sua busca.'}
        </p>
      )}

      {!carregando && vagas.length > 0 && (
        <section className="grid gap-6" aria-labelledby="resultado-busca">
          <h2 id="resultado-busca" className="sr-only">
            {vagas.length} vagas encontradas
          </h2>

          {vagas.map((vaga) => (
            <article key={vaga.id} className="border-2 border-borda bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition" aria-label={`Vaga ${vaga.title} na empresa ${vaga.company_name}`}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{vaga.title}</h3>
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
            </article>
          ))}
        </section>
      )}
    </main>
  );
}