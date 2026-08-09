export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-primaria text-[#d0f0fd] text-center py-6 border-t-4 border-hover transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-medium opacity-100"> Copyright© {anoAtual} JobIn. By <a className="text-fundo hover:underline" href="https://www.linkedin.com/in/marcotduenas/" target="_blank" rel="noopener noreferrer">Marco</a> & <a href="https://www.linkedin.com/in/amand4may/" className="text-fundo hover:underline" target="_blank" rel="noopener noreferrer">Amanda</a>.</p>
      </div>
    </footer>
  );
}