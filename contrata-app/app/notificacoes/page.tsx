// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Carrega as notificações de forma segura
  const carregarNotificacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('notificacoes')
          .select('*')
          .eq('usuario_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setNotificacoes(data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Marca como lida SEM dar loop no banco
  const marcarLida = async (id) => {
    try {
      // Atualiza no Banco
      await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
      
      // Atualiza na TELA imediatamente (evita refresh infinito)
      setNotificacoes(prev => 
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );
    } catch (err) {
      console.error("Erro ao marcar lida:", err);
    }
  };

  // 3. O array vazio [] no final garante que SÓ RODE UMA VEZ
  useEffect(() => { 
    carregarNotificacoes(); 
  }, []);

  const getIcone = (tipo) => {
    if (tipo === 'curtida') return '❤️';
    if (tipo === 'comentario') return '💬';
    return '💼';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>Notificações</h1>
          <Link href="/feed" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Voltar ao Feed</Link>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '50px' }}>Sincronizando...</div>
        ) : notificacoes.length > 0 ? (
          notificacoes.map((n) => (
            <div 
              key={n.id} 
              onClick={() => !n.lida && marcarLida(n.id)}
              style={{ 
                ...cardNotificacao, 
                backgroundColor: n.lida ? 'rgba(255,255,255,0.02)' : 'rgba(37, 99, 235, 0.1)',
                borderLeft: n.lida ? '4px solid transparent' : '4px solid #2563eb',
                cursor: n.lida ? 'default' : 'pointer'
              }}
            >
              <div style={{ fontSize: '24px' }}>{getIcone(n.tipo)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', margin: 0, lineHeight: '1.4' }}>
                  <b style={{ color: '#3b82f6' }}>{n.remetente_nome || 'Alguém'}</b> {n.mensagem}
                </p>
                <small style={{ opacity: 0.3, marginTop: '5px', display: 'block' }}>
                  {new Date(n.created_at).toLocaleString('pt-BR')}
                </small>
              </div>
              {!n.lida && <div style={pontoAzul}></div>}
            </div>
          ))
        ) : (
          <div style={vazioCard}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>📭</p>
            Você não tem notificações no momento.
          </div>
        )}
      </div>
    </div>
  );
}

// ESTILOS
const cardNotificacao = { display: 'flex', gap: '20px', alignItems: 'center', padding: '20px', borderRadius: '15px', marginBottom: '12px', transition: '0.2s', border: '1px solid rgba(255,255,255,0.05)' };
const pontoAzul = { width: '10px', height: '10px', backgroundColor: '#2563eb', borderRadius: '50%', boxShadow: '0 0 10px #2563eb' };
const vazioCard = { padding: '80px 20px', textAlign: 'center', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '30px', opacity: 0.4, fontSize: '14px' };