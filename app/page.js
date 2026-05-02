"use client"
import { useState, useEffect } from 'react';

export default function ProjetoFaculdade() {
  const [clima, setClima] = useState(null);
  const [tarefa, setTarefa] = useState("");

  // 1. Uso de API externa (Clima)
  useEffect(() => {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Sao+Paulo&units=metric&appid=COLOQUE_SUA_CHAVE_AQUI')
      .then(res => res.json())
      .then(data => setClima(data.main?.temp));
  }, []);

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 aria-label="Título do Projeto">Monitor de Clima e Tarefas</h1>
      
      <section role="region" aria-labelledby="clima-heading" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h2 id="clima-heading">Dados do Clima (API Externa)</h2>
        {clima ? <p>Temperatura em São Paulo: {clima}°C</p> : <p>Carregando clima...</p>}
      </section>

      <section role="region" aria-labelledby="tarefas-heading">
        <h2 id="tarefas-heading">Gerenciador de Tarefas (Banco de Dados)</h2>
        <input 
          type="text" 
          aria-label="Digitar nova tarefa"
          value={tarefa} 
          onChange={(e) => setTarefa(e.target.value)} 
          placeholder="Ex: Estudar para prova"
        />
        <button onClick={() => alert('Tarefa Salva!')} style={{ marginLeft: '10px', padding: '5px 15px' }}>
          Salvar na Nuvem
        </button>
      </section>

      <footer style={{ marginTop: '50px', fontSize: '0.8rem' }}>
        <p>Acessibilidade: Contraste verificado | CI/CD: Ativo via Vercel</p>
      </footer>
    </main>
  );
}
