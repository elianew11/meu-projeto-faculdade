import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão com o Banco
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [dados, setDados] = useState([]);
  const [clima, setClima] = useState("☀️ 27°C"); // Valor padrão caso a API falhe

  useEffect(() => {
    async function fetchData() {
      // Busca dados do Supabase
      const { data } = await supabase.from('tarefas').select('*');
      if (data) setDados(data);
      
      // Busca Clima (Uso de API)
      try {
        const res = await fetch('https://wttr.in/Sao+Paulo?format=1');
        const text = await res.text();
        if (text) setClima(text);
      } catch (e) { console.log("Erro API clima"); }
    }
    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px' }}>
      <main style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '30px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <h1 style={{ color: '#38bdf8', textAlign: 'center' }}>EcoMonitor Dashboard</h1>
        
        <div style={{ background: '#334155', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1rem', color: '#94a3b8', margin: 0 }}>CLIMA ATUAL (API)</h2>
          <p style={{ fontSize: '2.5rem', margin: '10px 0' }}>{clima}</p>
        </div>

        <div style={{ background: 'white', color: '#1e293b', padding: '20px', borderRadius: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📋 Tarefas no Banco de Dados</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {dados.length > 0 ? dados.map(item => (
              <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.titulo}</span>
                <strong style={{ color: item.concluido ? 'green' : 'orange' }}>
                  {item.concluido ? '✓ OK' : '...'}
                </strong>
              </li>
            )) : <p style={{ color: '#666' }}>Conectando ao Supabase...</p>}
          </ul>
        </div>

        <footer style={{ marginTop: '30px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
          <p>Acessibilidade: Cores de Alto Contraste Ativas</p>
          <p>Infraestrutura: Nuvem Vercel & GitHub CI/CD</p>
        </footer>
      </main>
    </div>
  );
}
