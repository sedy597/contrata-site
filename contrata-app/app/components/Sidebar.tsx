// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase'; 

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  useEffect(() => {
    // 1. Monitora a Sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) buscarContagemNotificacoes(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) buscarContagemNotificacoes(session.user.id);
    });

    // 2. Busca Notificações a cada 30 segundos se estiver logado
    const interval = setInterval(() => {
      if (session) buscarContagemNotificacoes(session.user.id);
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [session]);

  const buscarContagemNotificacoes = async (userId) => {
    try {
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', userId)
        .eq('lida', false);
      
      if (!error) setNotificacoesNaoLidas(count || 0);
    } catch (e) {
      console.error("Erro ao contar notificações", e);
    }
  };

  const confirmarSaida = async () => {
    await supabase.auth.signOut();
    setMostrarModal(false);
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    { name: 'HOME', path: '/', icon: '🏠' },
    { name: 'FEED / INÍCIO', path: '/feed', icon: '📱' },
    { name: 'NOTIFICAÇÕES', path: '/notificacoes', icon: '🔔', notify: true },
    { name: 'BUSCAR VAGAS', path: '/vagas', icon: '💼' },
    { name: 'MEU PERFIL', path: '/perfil', icon: '👤' },
    { name: 'PLANOS', path: '/planos', icon: '✨' },
    { name: 'SUPORTE / SAC', path: '/sac', icon: '🎧' },
  ];

  return (
    <>
      <nav style={navStyle}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#3b82f6', letterSpacing: '2px' }}>CONTRATA</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                ...itemStyle,
                backgroundColor: pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: pathname === item.path ? '#3b82f6' : 'white',
              }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  {/* BADGE DE NOTIFICAÇÃO VERMELHO */}
                  {item.notify && notificacoesNaoLidas > 0 && (
                    <div style={badgeStyle}>{notificacoesNaoLidas}</div>
                  )}
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.name}</span>
              </div>
            </Link>
          ))}

          {session ? (
            <div onClick={() => setMostrarModal(true)} style={btnSairStyle}>
              <span style={{ fontSize: '18px' }}>🚪</span>
              <span style={{ fontWeight: 'bold', fontSize: '11px' }}>SAIR DA CONTA</span>
            </div>
          ) : (
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <div style={btnLoginStyle}>
                <span style={{ fontSize: '18px' }}>🔑</span>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>FAZER LOGIN</span>
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* MODAL DE SAÍDA */}
      {mostrarModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'white' }}>Deseja Sair?</h3>
            <p style={{ opacity: 0.6, fontSize: '14px', marginBottom: '25px', color: 'white' }}>Você precisará fazer login novamente para acessar seu painel.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setMostrarModal(false)} style={btnVoltarStyle}>VOLTAR</button>
              <button onClick={confirmarSaida} style={btnConfirmarSairStyle}>SAIR AGORA</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ESTILOS OBJETO
const navStyle = {
  width: '240px', backgroundColor: '#030a16', height: '100vh', position: 'fixed',
  left: 0, top: 0, padding: '30px 20px', display: 'flex', flexDirection: 'column',
  borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 1000
};

const itemStyle = {
  display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', borderRadius: '12px',
  transition: '0.3s', cursor: 'pointer'
};

const badgeStyle = {
  position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white',
  fontSize: '9px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #030a16'
};

const overlayStyle = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
  backdropFilter: 'blur(8px)'
};

const modalStyle = {
  backgroundColor: '#061224', border: '1px solid rgba(255,255,255,0.1)',
  padding: '40px', borderRadius: '24px', textAlign: 'center', width: '100%', maxWidth: '380px'
};

const btnVoltarStyle = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' };
const btnConfirmarSairStyle = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' };
const btnSairStyle = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', borderRadius: '12px', color: '#ef4444', cursor: 'pointer', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' };
const btnLoginStyle = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', cursor: 'pointer', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' };