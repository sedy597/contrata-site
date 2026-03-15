// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { ComponenteVagas } from '../components/ComponenteVagas';

export default function FeedPage() {
  const [session, setSession] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'vagas' | 'candidaturas' | 'notificacoes'>('vagas');
  const [loading, setLoading] = useState(true);
  
  const [busca, setBusca] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); } 
      else {
        setSession(session);
        setUserName(session.user.email?.split('@')[0] || 'Usuário');
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return null;

  return (
    <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVBAR INTERNA UNIFICADA */}
      <nav style={navStyle}>
        <div style={containerNav}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '40px', cursor: 'pointer' }} onClick={() => router.push('/')} />
            <div style={{ display: 'flex', gap: '5' }}>
              <button onClick={() => setAbaAtiva('vagas')} style={abaAtiva === 'vagas' ? navLinkAtivo : navLinkInativo}>Vagas</button>
              <button onClick={() => setAbaAtiva('candidaturas')} style={abaAtiva === 'candidaturas' ? navLinkAtivo : navLinkInativo}>Candidaturas</button>
              <button onClick={() => setAbaAtiva('notificacoes')} style={abaAtiva === 'notificacoes' ? navLinkAtivo : navLinkInativo}>Notificações 🔔</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <button onClick={() => router.push('/planos')} style={btnUpgradeNav}>💎 SEJA PRO</button>
             <div style={avatarCircle} onClick={() => router.push('/perfil')}>{userName[0].toUpperCase()}</div>
             <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} style={btnSair}>Sair</button>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO DINÂMICO */}
      <section style={{ maxWidth: '1200px', margin: '40px auto', width: '100%', padding: '0 20px', flex: 1 }}>
        
        {abaAtiva === 'vagas' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h1 style={pageTitle}>Vagas para você em <span style={{color: '#2563eb'}}>Ibitinga e Região</span></h1>
            <div style={searchBar}>
              <input type="text" placeholder="Cargo ou palavra-chave" style={inputSearch} onChange={(e) => setBusca(e.target.value)} />
              <button style={btnSearch}>BUSCAR</button>
            </div>
            <ComponenteVagas busca={busca} />
          </div>
        )}

        {abaAtiva === 'candidaturas' && (
          <div style={cardEmpty}>
            <span style={{fontSize: '50px'}}>📂</span>
            <h2 style={{fontWeight: '900', margin: '20px 0'}}>Minhas Candidaturas</h2>
            <p style={{color: '#64748b'}}>Você ainda não se candidatou a nenhuma vaga.</p>
            <button onClick={() => setAbaAtiva('vagas')} style={btnPrimary}>VER VAGAS ABERTAS</button>
          </div>
        )}

        {abaAtiva === 'notificacoes' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={pageTitle}>Notificações e Alertas</h2>
            {[1,2,3].map(n => (
              <div key={n} style={cardNotif}>
                <div style={dotNotif}></div>
                <div style={{flex: 1}}>
                  <p style={{fontWeight: '800', color: '#0f172a'}}>Nova vaga de seu interesse!</p>
                  <p style={{fontSize: '14px', color: '#64748b'}}>Uma empresa de Ibitinga acabou de postar: "Auxiliar Administrativo".</p>
                </div>
                <span style={{fontSize: '12px', color: '#94a3b8'}}>Há 2 horas</span>
              </div>
            ))}
          </div>
        )}

      </section>

      <footer style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
        CONTRATA EMPREGOS BRASIL © 2026 - <span onClick={() => router.push('/sac')} style={{cursor: 'pointer'}}>Suporte (SAC)</span> | <span onClick={() => router.push('/termos')} style={{cursor: 'pointer'}}>Termos de Uso</span>
      </footer>
    </main>
  );
}

// ESTILOS
const navStyle = { backgroundColor: '#ffffff', height: '70px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 };
const containerNav = { maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' };
const navLinkAtivo = { background: 'none', border: 'none', color: '#2563eb', fontWeight: '900', fontSize: '14px', borderBottom: '3px solid #2563eb', height: '70px', cursor: 'pointer', padding: '0 15px' };
const navLinkInativo = { background: 'none', border: 'none', color: '#64748b', fontWeight: '600', fontSize: '14px', height: '70px', cursor: 'pointer', padding: '0 15px' };
const avatarCircle = { width: '40px', height: '40px', backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', cursor: 'pointer' };
const btnUpgradeNav = { backgroundColor: '#0f172a', color: '#fbbf24', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: '900', fontSize: '11px', cursor: 'pointer' };
const btnSair = { background: 'none', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '8px', color: '#e11d48', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' };
const pageTitle = { fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '30px', letterSpacing: '-1px' };
const searchBar = { display: 'flex', backgroundColor: 'white', padding: '10px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginBottom: '40px' };
const inputSearch = { flex: 1, border: 'none', padding: '15px', outline: 'none', fontSize: '16px', fontWeight: '600' };
const btnSearch = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0 30px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' };
const cardEmpty = { textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '30px', border: '2px dashed #e2e8f0' };
const btnPrimary = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' };
const cardNotif = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0' };
const dotNotif = { width: '10px', height: '10px', backgroundColor: '#2563eb', borderRadius: '50%' };