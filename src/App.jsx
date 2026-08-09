import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contato from './pages/Contato';

export default function App() {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const toggleTema = () => setTemaEscuro(!temaEscuro);

  return (
    <BrowserRouter>
      <div className={temaEscuro ? 'dark' : ''}>
        <div className="min-h-screen flex flex-col bg-fundo text-texto font-sans transition-colors duration-300">
          <Header temaEscuro={temaEscuro} toggleTema={toggleTema} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
          
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}