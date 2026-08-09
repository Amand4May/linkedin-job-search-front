// src/services/vagasService.js

// URL base do back-end em Node.js
const API_URL = 'http://localhost:3000/api';

export async function buscarVagas(cargo, local) {
  try {
    const resposta = await fetch(`${API_URL}/vagas?cargo=${encodeURIComponent(cargo)}&local=${encodeURIComponent(local)}`);
    
    if (!resposta.ok) {
      throw new Error('Erro ao buscar vagas do servidor');
    }
    
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro no serviço de vagas:", erro);
    return []; 
  }
}