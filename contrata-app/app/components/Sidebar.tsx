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

  const buscarContagemNotificacoes = async (userId) => {
    if (!userId) return;
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) buscarContagemNotificacoes(s.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, ns) => {
      setSession(ns);
      if (ns) buscarContagemNotificacoes(ns.user.id);
    });

    const interval = setInterval(() => {
      if (session?.user?.id) buscarContagemNotificacoes(session.user.id);
    }, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []); // VAZIO PARA NÃO DAR LOOP

  const confirmarSaida = async () => {
    await supabase.auth.signOut();
    setMostrarModal(false);
    router.push('/login');
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

  const navStyle: React.CSSProperties = { width: '240px', backgroundColor: '#030a16', height: '100vh', position: 'fixed', left: 0, top: 0, padding: '30px 20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 1000 };
  const itemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', borderRadius: '12px', transition: '0.3s', cursor: 'pointer' };
  const badgeStyle: React.CSSProperties = { position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #030a16' };

  return (
    <>
      <nav style={navStyle}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#3b82f6', letterSpacing: '2px' }}>CONTRATA</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <div style={{ ...itemStyle, backgroundColor: pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: pathname === item.path ? '#3b82f6' : 'white' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span>{item.icon}</span>
                  {item.notify && notificacoesNaoLidas > 0 && <div style={badgeStyle}>{notificacoesNaoLidas}</div>}
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.name}</span>
              </div>
            </Link>
          ))}
          {session && (
            <div onClick={() => setMostrarModal(true)} style={{ ...itemStyle, color: '#ef4444', marginTop: 'auto' }}>
              <span>🚪</span> <span style={{ fontWeight: 'bold', fontSize: '11px' }}>SAIR</span>
            </div>
          )}
        </div>
      </nav>

      {mostrarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#061224', padding: '40px', borderRadius: '20px', textAlign: 'center', color: 'white' }}>
            <h3>Deseja Sair?</h3>
            <button onClick={() => setMostrarModal(false)} style={{ marginRight: '10px' }}>VOLTAR</button>
            <button onClick={confirmarSaida} style={{ backgroundColor: '#ef4444', color: 'white' }}>SAIR</button>
          </div>
        </div>
      )}
    </>
  );
}