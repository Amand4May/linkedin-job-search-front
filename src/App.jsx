import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Home = lazy(() => import('./pages/Home'));
const Contato = lazy(() => import('./pages/Contato'));

function RouteTitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'JobIn | Buscador de vagas no LinkedIn',
      '/contato': 'Contato | JobIn',
    };

    document.title = titles[location.pathname] || 'JobIn';
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const toggleTema = () => setTemaEscuro((valor) => !valor);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel*='icon']");

    if (faviconLink) {
      faviconLink.href = temaEscuro ? '/favicon-dark.svg' : '/favicon-light.svg';
      return;
    }

    const novoFavicon = document.createElement('link');
    novoFavicon.rel = 'icon';
    novoFavicon.type = 'image/svg+xml';
    novoFavicon.href = temaEscuro ? '/favicon-dark.svg' : '/favicon-light.svg';
    document.head.appendChild(novoFavicon);
  }, [temaEscuro]);

  return (
    <div className={temaEscuro ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col bg-fundo text-texto font-sans transition-colors duration-300">
        <Header temaEscuro={temaEscuro} toggleTema={toggleTema} />

        <Suspense fallback={<div className="flex-grow flex items-center justify-center p-8 text-mutado font-semibold">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTitleUpdater />
      <AppContent />
    </BrowserRouter>
  );
}