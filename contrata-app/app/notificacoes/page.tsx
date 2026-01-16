// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarNotificacoes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });
      setNotificacoes(data || []);
    }
    setLoading(false);
  };

  const marcarLida = async (id) => {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    carregarNotificacoes();
  };

  useEffect(() => { carregarNotificacoes(); }, []);

  const getIcone = (tipo) => {
    if (tipo === 'curtida') return '❤️';
    if (tipo === 'comentario') return '💬';
    return '💼';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900' }}>Notificações</h1>
          <Link href="/feed" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>Voltar ao Feed</Link>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', opacity: 0.5 }}>Carregando notificações...</div>
        ) : notificacoes.length > 0 ? (
          notificacoes.map((n) => (
            <div 
              key={n.id} 
              onClick={() => marcarLida(n.id)}
              style={{ 
                ...cardNotificacao, 
                backgroundColor: n.lida ? 'rgba(255,255,255,0.02)' : 'rgba(37, 99, 235, 0.1)',
                borderLeft: n.lida ? '4px solid transparent' : '4px solid #2563eb'
              }}
            >
              <div style={{ fontSize: '24px' }}>{getIcone(n.tipo)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px' }}>
                  <b style={{ color: '#3b82f6' }}>{n.remetente_nome}</b> {n.mensagem}
                </p>
                <small style={{ opacity: 0.3 }}>{new Date(n.created_at).toLocaleString('pt-BR')}</small>
              </div>
              {!n.lida && <div style={pontoAzul}></div>}
            </div>
          ))
        ) : (
          <div style={vazioCard}>Você não tem notificações no momento.</div>
        )}
      </div>
    </div>
  );
}

// ESTILOS
const cardNotificacao = { display: 'flex', gap: '20px', alignItems: 'center', padding: '25px', borderRadius: '20px', marginBottom: '12px', cursor: 'pointer', transition: '0.2s', border: '1px solid rgba(255,255,255,0.05)' };
const pontoAzul = { width: '10px', height: '10px', backgroundColor: '#2563eb', borderRadius: '50%' };
const vazioCard = { padding: '60px', textAlign: 'center', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '30px', opacity: 0.4 };