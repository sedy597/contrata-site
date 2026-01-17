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

  // Função para contar notificações (Protegida)
  const buscarContagemNotificacoes = async (userId) => {
    if (!userId) return;
    try {
      const { count } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', userId)
        .eq('lida', false);
      setNotificacoesNaoLidas(count || 0);
    } catch (e) {
      console.error("Erro ao contar notificações", e);
    }
  };

  useEffect(() => {
    // 1. Verifica sessão ao carregar
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) buscarContagemNotificacoes(s.user.id);
    });

    // 2. Ouve mudanças (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, ns) => {
      setSession(ns);
      if (ns) {
        buscarContagemNotificacoes(ns.user.id);
      } else {
        setNotificacoesNaoLidas(0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const confirmarSaida = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMostrarModal(false);
    router.push('/login');
    router.refresh();
  };

  // ITENS QUE TODO MUNDO VÊ
  const menuItems = [
    { name: 'HOME', path: '/', icon: '🏠' },
    { name: 'FEED / INÍCIO', path: '/feed', icon: '📱' },
  ];

  // ITENS QUE SÓ QUEM ESTÁ LOGADO VÊ
  if (session) {
    menuItems.push(
      { name: 'NOTIFICAÇÕES', path: '/notificacoes', icon: '🔔', notify: true },
      { name: 'MEU PERFIL', path: '/perfil', icon: '👤' },
      { name: 'PLANOS', path: '/planos', icon: '✨' },
      { name: 'SUPORTE / SAC', path: '/sac', icon: '🎧' }
    );
  }

  // ESTILOS
  const navStyle: React.CSSProperties = { 
    width: '240px', backgroundColor: '#030a16', height: '100vh', position: 'fixed', 
    left: 0, top: 0, padding: '30px 20px', display: 'flex', flexDirection: 'column' as 'column', 
    borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 1000 
  };

  const itemStyle = (isActive: boolean) => ({
    display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', borderRadius: '12px',
    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    color: isActive ? '#3b82f6' : 'white',
    textDecoration: 'none', transition: '0.3s', marginBottom: '8px'
  });

  const badgeStyle: React.CSSProperties = { 
    position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', 
    fontSize: '9px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #030a16' 
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#3b82f6', letterSpacing: '2px' }}>CONTRATA</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} style={itemStyle(pathname === item.path)}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.notify && notificacoesNaoLidas > 0 && (
                  <div style={badgeStyle}>{notificacoesNaoLidas}</div>
                )}
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.name}</span>
            </Link>
          ))}

          {/* BOTÃO DE SAIR OU LOGIN NO RODAPÉ */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            {session ? (
              <div onClick={() => setMostrarModal(true)} style={{ ...itemStyle(false), color: '#ef4444', cursor: 'pointer' }}>
                <span style={{ fontSize: '18px' }}>🚪</span>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>SAIR DA CONTA</span>
              </div>
            ) : (
              <Link href="/login" style={{ ...itemStyle(false), color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <span style={{ fontSize: '18px' }}>🔑</span>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>FAZER LOGIN</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL DE SAÍDA */}
      {mostrarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: '#061224', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '100%', maxWidth: '380px' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'white' }}>Deseja Sair?</h3>
            <p style={{ opacity: 0.6, fontSize: '14px', marginBottom: '25px', color: 'white' }}>Você precisará fazer login novamente para acessar seu painel.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setMostrarModal(false)} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>VOLTAR</button>
              <button onClick={confirmarSaida} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>SAIR AGORA</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}