// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FeedPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // NOVO: Guarda dados do perfil (tipo e plano)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
        // BUSCA O PERFIL: Descobre se é empresa ou candidato (Item 5 do Doc)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear(); 
      sessionStorage.clear();
      window.location.href = '/login'; 
    } catch (error) {
      window.location.href = '/login';
    }
  };

  if (loading) return <div style={{backgroundColor: '#061224', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Carregando...</div>;

  return (
    <div style={styles.bg}>
      {/* MENU LATERAL INTELIGENTE */}
      <aside style={styles.side}>
        <div style={styles.card}>
          <p style={styles.blueTitle}>PAINEL {profile?.user_type?.toUpperCase()}</p>
          
          <Link href="/feed" style={styles.linkAct}>📱 Feed de Vagas</Link>
          
          {/* SE FOR EMPRESA: Mostra botão de postar vaga (Item 2 do Doc) */}
          {profile?.user_type === 'empresa' && (
            <Link href="/postar-vaga" style={styles.linkPostar}>
              ➕ Postar Nova Vaga
            </Link>
          )}

          {/* SE FOR CANDIDATO: Mostra minhas candidaturas */}
          {profile?.user_type === 'candidato' && (
            <Link href="/minhas-vagas" style={styles.linkNormal}>
              📄 Minhas Candidaturas
            </Link>
          )}

          <div style={styles.divisor}></div>
          
          <button onClick={() => setShowLogoutModal(true)} style={styles.btnLogout}>
            🚪 Sair da Conta
          </button>
        </div>

        {/* INDICADOR DE PLANO (Item 8 do Doc) */}
        <div style={{...styles.card, marginTop: '20px', textAlign: 'center'}}>
           <p style={{fontSize: '10px', color: 'white', opacity: 0.5}}>PLANO ATUAL</p>
           <p style={{fontWeight: '900', color: profile?.plano === 'pro' ? '#fbbf24' : '#94a3b8'}}>
             {profile?.plano?.toUpperCase() || 'FREE'}
           </p>
        </div>
      </aside>

      {/* MODAL DE LOGOUT (Mantido) */}
      {showLogoutModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{color: '#fbbf24', fontSize: '40px', marginBottom: '10px'}}>⚠️</div>
            <h2 style={{color: 'white', marginBottom: '10px'}}>Deseja Sair?</h2>
            <p style={{color: 'white', fontSize: '14px', opacity: 0.7, marginBottom: '25px'}}>Você precisará fazer login novamente.</p>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
              <button onClick={() => setShowLogoutModal(false)} style={styles.btnVoltar}>VOLTAR</button>
              <button onClick={handleLogout} style={styles.btnSairAgora}>SAIR AGORA</button>
            </div>
          </div>
        </div>
      )}

      <main style={styles.main}>
          <header style={{marginBottom: '40px'}}>
            <h1 style={{color: 'white', fontSize: '28px', fontWeight: '900'}}>
              Olá, {profile?.user_type === 'empresa' ? 'Recrutador' : 'Profissional'}!
            </h1>
            <p style={{color: '#3b82f6', fontWeight: 'bold'}}>
              {session?.user?.email}
            </p>
          </header>

          <div style={styles.feedPlaceholder}>
             <p style={{color: 'white', opacity: 0.5}}>
               {profile?.user_type === 'empresa' 
                 ? 'Aqui você verá quem se candidatou às suas vagas.' 
                 : 'Aqui você verá as vagas disponíveis em Ibitinga e região.'}
             </p>
          </div>
      </main>
    </div>
  );
}

const styles = {
  bg: { minHeight: '100vh', backgroundColor: '#061224', display: 'flex', fontFamily: 'sans-serif' },
  side: { width: '280px', padding: '20px', borderRight: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' },
  main: { flex: 1, padding: '40px' },
  card: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' },
  blueTitle: { fontSize: '10px', color: '#3b82f6', fontWeight: '900', marginBottom: '15px', letterSpacing: '1px' },
  linkAct: { display: 'block', color: 'white', textDecoration: 'none', fontWeight: 'bold', marginBottom: '15px', fontSize: '14px' },
  linkNormal: { display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '15px', fontSize: '14px' },
  linkPostar: { display: 'block', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', fontWeight: 'bold', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '13px', marginBottom: '15px' },
  divisor: { height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '15px 0' },
  btnLogout: { background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: '14px' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { backgroundColor: '#0a1a31', padding: '40px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'center', width: '400px' },
  btnVoltar: { background: 'none', border: '1px solid white', color: 'white', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnSairAgora: { backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  feedPlaceholder: { padding: '100px', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '20px', textAlign: 'center' }
};