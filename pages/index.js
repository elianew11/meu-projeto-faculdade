import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão com o banco
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [dados, setDados] = useState([]);
  const [clima, setClima] = useState("Carregando clima...");
  const [statusBanco, setStatusBanco] = useState("Verificando...");

  useEffect(() => {
    async function carregarTudo() {
      // 1. Busca Clima de Lençóis Paulista
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-22.60&longitude=-48.80&current_weather=true');
        const json = await res.json();
        setClima(json.current_weather.temperature + "°C em Lençóis Paulista");
      } catch (e) { setClima("Clima indisponível"); }

      // 2. Busca Dados (Supabase)
      try {
        const { data, error } = await supabase.from('tarefas').select('*');
        if (error) throw error;
        setDados(data || []);
        setStatusBanco("Conectado");
      } catch (e) { setStatusBanco("Erro na conexão"); }
    }
    carregarTudo();
  }, []);

  return (
    <div style={styles.body}>
      <main style={styles.container}>
        
        {/* CABEÇALHO COM SEU NOME */}
        <header style={styles.header}>
          <h1 style={styles.title}>EcoMonitor Dashboard</h1>
          <div style={styles.authorBadge} aria-label="Autor do projeto">
            <strong>Desenvolvido por:</strong> Eliane Rodrigues Martins
          </div>
          <p style={styles.subAuthor}>Curso: UNIVESP - POLO LENÇÓIS PAULISTA-SP / Disciplina: Projeto Integrador III / Curso: Tecnologia da Informação / Ano: 2026</p>
        </header>

        {/* CARD DE CLIMA */}
        <section style={styles.cardClima}>
          <h2 style={styles.cardLabel}>🌤️ INFORMAÇÃO DA API (IoT/Clima)</h2>
          <p style={styles.temp}>{clima}</p>
        </section>

        {/* CARD DE BANCO DE DADOS */}
        <section style={styles.cardBanco}>
          <h2 style={styles.cardLabel}>🗄️ DADOS DO BANCO (CLOUD)</h2>
          <p style={{fontSize: '0.75rem', color: statusBanco === "Conectado" ? "#10b981" : "#ef4444", fontWeight: 'bold'}}>
            Status: {statusBanco}
          </p>
          
          <div style={styles.lista}>
            {dados.length > 0 ? dados.map(item => (
              <div key={item.id} style={styles.item}>
                <span>{item.titulo}</span>
                <span>{item.concluido ? "✅" : "⏳"}</span>
              </div>
            )) : (
              <p style={{color: '#666', textAlign: 'center', fontSize: '0.9rem'}}>Carregando registros...</p>
            )}
          </div>
        </section>

        {/* RODAPÉ COM ASSINATURA TÉCNICA */}
        <footer style={styles.footer}>
          <div style={styles.divider}></div>
          <p style={styles.footerText}><strong>Projeto Acadêmico - Sistema de Software Completo</strong></p>
          <p style={styles.footerText}>© 2024 - SEU NOME COMPLETO</p>
          <p style={styles.footerText}>Stack: Next.js • JavaScript • Supabase Cloud • Vercel CI/CD</p>
          <div style={styles.a11yBadge}>♿ Acessibilidade WCAG Ativa</div>
        </footer>

      </main>
    </div>
  );
}

const styles = {
  body: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' },
  container: { maxWidth: '500px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { color: '#0f172a', marginBottom: '10px', fontSize: '1.8rem' },
  authorBadge: { backgroundColor: '#e2e8f0', color: '#475569', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', display: 'inline-block' },
  subAuthor: { color: '#64748b', fontSize: '0.8rem', marginTop: '8px' },
  cardClima: { background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '20px', textAlign: 'center', border: '1px solid #e2e8f0' },
  cardBanco: { background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
  cardLabel: { fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1.5px', marginBottom: '15px', textTransform: 'uppercase' },
  temp: { fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', margin: 0 },
  lista: { marginTop: '15px' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9', color: '#334155' },
  footer: { marginTop: '40px', textAlign: 'center', paddingBottom: '20px' },
  divider: { height: '1px', backgroundColor: '#e2e8f0', marginBottom: '20px' },
  footerText: { fontSize: '0.75rem', color: '#94a3b8', margin: '5px 0' },
  a11yBadge: { display: 'inline-block', marginTop: '10px', fontSize: '0.7rem', background: '#0f172a', color: 'white', padding: '3px 10px', borderRadius: '4px' }
};
