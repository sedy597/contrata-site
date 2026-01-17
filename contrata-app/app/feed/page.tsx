// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';
import Link from 'next/link';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single();
          setUserType(profile?.user_type);
        }

        const { data, error } = await supabase
          .from('vagas')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error) setVagas(data || []);
      } catch (error) {
        console.error("Erro no feed:", error);
      } finally {
        setLoading(false);
      }
    };

    // Lógica da Seção 11: Vídeo Global na primeira visita
    const hasSeenVideo = localStorage.getItem('hasSeenWelcomeVideo');
    if (!hasSeenVideo) {
      setShowVideo(true);
      localStorage.setItem('hasSeenWelcomeVideo', 'true');
    }

    carregarDados();
  }, []);

  const styles = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    mainWrapper: { flex: 1, marginLeft: '240px', display: 'flex' },
    feedSection: { flex: 1, padding: '40px' },
    adsSection: { width: '250px', padding: '40px 20px 40px 0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    title: { fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' },
    btnPostar: { backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    vagaCard: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
    badge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '5px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold', width: 'fit-content' },
    vagaTitle: { fontSize: '20px', fontWeight: 'bold' },
    vagaDesc: { fontSize: '14px', opacity: 0.6, lineHeight: '1.5' },
    salario: { color: '#10b981', fontWeight: 'bold', fontSize: '14px' },
    btnCandidatar: { backgroundColor: 'white', color: '#061224', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    // Estilo do Modal de Vídeo (Seção 11)
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalContent: { backgroundColor: '#0a1a31', width: '100%', maxWidth: '800px', borderRadius: '30px', padding: '30px', textAlign: 'center' }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      
      <div style={styles.mainWrapper}>
        <main style={styles.feedSection}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>Vagas em Ibitinga</h1>
              <p style={{ opacity: 0.5 }}>Oportunidades reais sincronizadas</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowVideo(true)} style={{ ...styles.btnPostar, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                📺 COMO FUNCIONA
              </button>
              {userType === 'empresa' && (
                <Link href="/postar-vaga" style={styles.btnPostar}>+ ANUNCIAR VAGA</Link>
              )}
            </div>
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
            <div style={{ textAlign: 'center', padding: '100px', opacity: 0.3, border: '1px dashed white', borderRadius: '20px' }}>
              Nenhuma vaga disponível.
            </div>
          )}
        </main>

        {/* Seção de Ads Lateral (Seção 10) */}
        <aside style={styles.adsSection}>
          <AdsLateral />
        </aside>
      </div>

      {/* Modal de Vídeo Apresentativo (Seção 11) */}
      {showVideo && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: '20px', fontWeight: '900' }}>BEM-VINDO À PLATAFORMA</h2>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <p style={{ opacity: 0.5 }}>[ VÍDEO APRESENTATIVO - SEÇÃO 11 ]</p>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '25px' }}>
              Aprenda a encontrar vagas ou contratar os melhores talentos de Ibitinga.
            </p>
            <button onClick={() => setShowVideo(false)} style={{ ...styles.btnPostar, width: '100%' }}>
              COMEÇAR A USAR AGORA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}