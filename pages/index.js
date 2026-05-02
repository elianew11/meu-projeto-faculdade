import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão segura com o banco
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [dados, setDados] = useState([]);
  const [clima, setClima] = useState("Carregando clima...");
  const [statusBanco, setStatusBanco] = useState("Verificando...");

  useEffect(() => {
    async function carregarTudo() {
      // 1. Busca Clima (API Externa) - Usando uma API que só manda números
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-22.60&longitude=-48.80&current_weather=true');
        const json = await res.json();
        setClima(json.current_weather.temperature + "°C em São Paulo");
      } catch (e) {
        setClima("Clima indisponível");
      }

      // 2. Busca Dados (Supabase)
      try {
        const { data, error } = await supabase.from('tarefas').select('*');
        if (error) throw error;
        setDados(data || []);
        setStatusBanco("Conectado");
      } catch (e) {
        console.error(e);
        setStatusBanco("Erro na conexão (Verifique as chaves na Vercel)");
      }
    }
    carregarTudo();
  }, []);

  return (
    <div style={styles.body}>
      <main style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Sistema de Gestão EcoMonitor</h1>
          <p style={styles.badge}>Hospedado na Nuvem (Vercel)</p>
        </header>

        <section style={styles.cardClima}>
          <h2 style={styles.cardLabel}>🌤️ INFORMAÇÃO DA API</h2>
          <p style={styles.temp}>{clima}</p>
        </section>

        <section style={styles.cardBanco}>
          <h2 style={styles.cardLabel}>🗄️ DADOS DO BANCO (SUPABASE)</h2>
          <p style={{fontSize: '0.8rem', color: statusBanco === "Conectado" ? "green" : "red"}}>Status: {statusBanco}</p>
          
          <div style={styles.lista}>
            {dados.length > 0 ? dados.map(item => (
              <div key={item.id} style={styles.item}>
                <span>{item.titulo}</span>
                <span>{item.concluido ? "✅" : "⏳"}</span>
              </div>
            )) : (
              <p style={{color: '#666', textAlign: 'center'}}>Nenhum dado encontrado ou configurando chaves...</p>
            )}
          </div>
        </section>

        <footer style={styles.footer}>
          <p>♿ Acessibilidade: Alto contraste e Tags Semânticas</p>
          <p>🔄 CI/CD: Atualização automática via GitHub Actions</p>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  body: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '500px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '20px' },
  title: { color: '#1a73e8', marginBottom: '5px' },
  badge: { fontSize: '0.8rem', color: '#666', background: '#e8f0fe', display: 'inline-block', padding: '2px 10px', borderRadius: '10px' },
  cardClima: { background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '15px', textAlign: 'center' },
  cardBanco: { background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cardLabel: { fontSize: '0.7rem', color: '#999', letterSpacing: '1px', marginBottom: '10px' },
  temp: { fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 },
  lista: { marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9f9f9' },
  footer: { marginTop: '30px', textAlign: 'center', fontSize: '0.7rem', color: '#999', lineHeight: '1.5' }
};
