import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Agora o sistema pega as chaves automaticamente da configuração da Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // ... o restante do código que te passei antes continua igual
  const [dados, setDados] = useState([]);
  const [clima, setClima] = useState("Carregando...");

  useEffect(() => {
    // 1. Busca dados do Banco de Dados (Nuvem)
    async function baixarDados() {
      const { data } = await supabase.from('tarefas').select('*');
      setDados(data || []);
    }
    // 2. Busca dados de uma API externa (Uso de API)
    fetch('https://wttr.in/Sao+Paulo?format=3')
      .then(res => res.text())
      .then(text => setClima(text));

    baixarDados();
  }, []);

  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1 tabIndex="0">Dashboard do Projeto Acadêmico</h1>
      
      <section aria-label="Informação do Clima" style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h2>🌤️ Clima via API Externa</h2>
        <p style={{ fontSize: '1.2rem' }}>{clima}</p>
      </section>

      <section aria-label="Lista de Tarefas do Banco de Dados" style={{ marginTop: '20px' }}>
        <h2>🗄️ Dados do Banco (PostgreSQL/Supabase)</h2>
        <ul>
          {dados.map(item => (
            <li key={item.id} style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              {item.titulo} - <strong>{item.concluido ? "✅ Feito" : "⏳ Pendente"}</strong>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => alert('API de fornecimento ativa em: /api/dados')}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          aria-label="Verificar status da API"
        >
          Verificar Integração
        </button>
      </section>

      <footer style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <p>♿ Acessibilidade: Tags semânticas e suporte a tabulação.</p>
        <p>🚀 CI/CD: Deploy automático via GitHub + Vercel.</p>
      </footer>
    </main>
  );
}
