// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FeedPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // Pega a sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login'); // Se não tem sessão, expulsa pro login
      } else {
        setSession(session);
      }
    };
    checkUser();
  }, [router]);

  // --- O LOGOUT QUE RESOLVE O SEU PROBLEMA ---
  const handleLogout = async () => {
    try {
      // 1. Avisa o Supabase para invalidar o token no servidor
      await supabase.auth.signOut();

      // 2. LIMPEZA BRUTA: Remove manualmente tudo o que o Supabase salva no navegador
      // Isso impede que ele "lembre" de você ao dar F5
      localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0] + '-auth-token');
      localStorage.clear(); 
      sessionStorage.clear();

      // 3. Limpa os cookies (opcional, mas garante)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 4. Redireciona e força um refresh total da página
      window.location.href = '/login'; 
      
    } catch (error) {
      console.error("Erro ao sair:", error);
      window.location.href = '/login';
    }
  };

  return (
    <div style={styles.bg}>
      {/* MENU LATERAL */}
      <aside style={styles.side}>
        <div style={styles.card}>
          <p style={styles.blueTitle}>PAINEL</p>
          <Link href="/feed" style={styles.linkAct}>📱 Feed</Link>
          <div style={styles.divisor}></div>
          {/* Botão que abre o modal de confirmação */}
          <button onClick={() => setShowLogoutModal(true)} style={styles.btnLogout}>
            🚪 Sair da Conta
          </button>
        </div>
      </aside>

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
      {showLogoutModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{color: '#fbbf24', fontSize: '40px', marginBottom: '10px'}}>⚠️</div>
            <h2 style={{color: 'white', marginBottom: '10px'}}>Deseja Sair?</h2>
            <p style={{color: 'white', fontSize: '14px', opacity: 0.7, marginBottom: '25px'}}>
              Você precisará fazer login novamente para acessar.
            </p>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
              <button onClick={() => setShowLogoutModal(false)} style={styles.btnVoltar}>VOLTAR</button>
              <button onClick={handleLogout} style={styles.btnSairAgora}>SAIR AGORA</button>
            </div>
          </div>
        </div>
      )}

      <main style={styles.main}>
         <h1 style={{color: 'white'}}>Bem-vindo ao Feed</h1>
         <p style={{color: 'white', opacity: 0.6}}>Você está logado como: {session?.user?.email}</p>
      </main>
    </div>
  );
}

const styles = {
  bg: { minHeight: '100vh', backgroundColor: '#061224', display: 'flex' },
  side: { width: '250px', padding: '20px', borderRight: '1px solid #1e293b' },
  main: { flex: 1, padding: '40px' },
  card: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' },
  blueTitle: { fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', marginBottom: '15px' },
  linkAct: { display: 'block', color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', marginBottom: '10px' },
  divisor: { height: '1px', backgroundColor: '#1e293b', margin: '15px 0' },
  btnLogout: { background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', width: '100%' },
  
  // ESTILO DO MODAL
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { backgroundColor: '#0a1a31', padding: '40px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'center', width: '400px' },
  btnVoltar: { background: 'none', border: '1px solid white', color: 'white', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnSairAgora: { backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};