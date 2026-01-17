// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const carregarVagas = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);

      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setVagas(data || []);
      setLoading(false);
    };
    carregarVagas();
  }, []);

  // --- AÇÃO REAL DE CANDIDATURA (Seção 5.3 do Doc) ---
  const aplicarParaVaga = async (vagaId, empresaId) => {
    if (!user) return alert("Você precisa estar logado!");

    const { error } = await supabase.from('candidaturas').insert([
      {
        vaga_id: vagaId,
        candidato_id: user.id,
        empresa_id: empresaId,
        status: 'Pendente'
      }
    ]);

    if (error) {
      if (error.code === '23505') alert("Você já se candidatou a esta vaga!");
      else alert("Erro: " + error.message);
    } else {
      alert("✅ SUCESSO! Sua candidatura foi enviada para a empresa.");
    }
  };

  const styles = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'flex', gap: '30px' },
    vagaCard: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' },
    btnCandidatar: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px' }}>Vagas Disponíveis</h1>
          
          {loading ? <p>Carregando...</p> : vagas.map((vaga) => (
            <div key={vaga.id} style={styles.vagaCard}>
              <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '900' }}>{vaga.tipo_trabalho?.toUpperCase()}</span>
              <h2 style={{ fontSize: '22px', margin: '10px 0' }}>{vaga.titulo}</h2>
              <p style={{ opacity: 0.6, fontSize: '14px' }}>{vaga.descricao}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>R$ {vaga.salario || 'A combinar'}</span>
                <button 
                  onClick={() => aplicarParaVaga(vaga.id, vaga.empresa_id)}
                  style={styles.btnCandidatar}
                >
                  CANDIDATAR-SE AGORA
                </button>
              </div>
            </div>
          ))}
        </div>
        <AdsLateral />
      </main>
    </div>
  );
}