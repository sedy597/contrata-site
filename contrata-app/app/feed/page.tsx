// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // 1. Pega a sessão e o tipo de usuário
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single();
          setUserType(profile?.user_type);
        }

        // 2. Busca as vagas (Usando as colunas exatas que criamos no SQL)
        const { data, error } = await supabase
          .from('vagas')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erro ao buscar vagas:", error.message);
        } else {
          setVagas(data || []);
        }
      } catch (error) {
        console.error("Erro no feed:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const styles = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    mainContent: { flex: 1, marginLeft: '240px', padding: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    title: { fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' },
    btnPostar: { backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    vagaCard: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
    badge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '5px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold', width: 'fit-content' },
    vagaTitle: { fontSize: '20px', fontWeight: 'bold' },
    vagaDesc: { fontSize: '14px', opacity: 0.6, lineHeight: '1.5' },
    salario: { color: '#10b981', fontWeight: 'bold', fontSize: '14px' },
    btnCandidatar: { backgroundColor: 'white', color: '#061224', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Vagas em Ibitinga</h1>
            <p style={{ opacity: 0.5 }}>As melhores oportunidades da região</p>
          </div>
          
          {userType === 'empresa' && (
            <Link href="/postar-vaga" style={styles.btnPostar}>
              + ANUNCIAR VAGA
            </Link>
          )}
        </header>

        {loading ? (
          <p>Carregando vagas...</p>
        ) : vagas.length > 0 ? (
          <div style={styles.grid}>
            {vagas.map((vaga) => (
              <div key={vaga.id} style={styles.vagaCard}>
                <div style={styles.badge}>{vaga.tipo_trabalho || 'Presencial'}</div>
                <h2 style={styles.vagaTitle}>{vaga.titulo}</h2>
                <p style={styles.vagaDesc}>{vaga.descricao}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={styles.salario}>{vaga.salario ? `R$ ${vaga.salario}` : 'A combinar'}</span>
                  <button style={styles.btnCandidatar}>VER DETALHES</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>
            Nenhuma vaga postada ainda.
          </div>
        )}
      </main>
    </div>
  );
}