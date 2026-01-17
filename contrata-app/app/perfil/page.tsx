// @ts-nocheck
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [user, setUser] = useState(null);
  const [meusPosts, setMeusPosts] = useState([]);
  
  const [perfil, setPerfil] = useState({
    username: '',
    nome_completo: '',
    avatar_url: '',
    bio: '',
    whatsapp: '',
    cargo_atual: '',
    experiencia: '',
    plano: 'gratuito',
    seguidores: 128, 
    seguindo: 85     
  });

  const carregarDadosCompletos = useCallback(async () => {
    const { data: { user: logado } } = await supabase.auth.getUser();
    if (logado) {
      setUser(logado);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', logado.id).single();
      if (p) setPerfil(prev => ({ ...prev, ...p }));

      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('autor_id', logado.id)
        .order('created_at', { ascending: false });
      
      setMeusPosts(posts || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { carregarDadosCompletos(); }, [carregarDadosCompletos]);

  const salvar = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...perfil });
    if (!error) {
      setEditando(false);
      carregarDadosCompletos();
    }
    setLoading(false);
  };

  // NOVO: Função para Deletar a Conta (Item de Segurança)
  const handleDeleteAccount = async () => {
    const confirmou = window.confirm(
      "⚠️ AVISO IRREVERSÍVEL:\n\nTem certeza que deseja DELETAR SUA CONTA? Todos os seus dados, perfis, posts e candidaturas serão apagados para sempre."
    );

    if (confirmou) {
      setLoading(true);
      try {
        // Chama a função RPC que criamos no SQL Editor do Supabase
        const { error } = await supabase.rpc('delete_user_account');
        if (error) throw error;

        alert("Sua conta foi excluída permanentemente.");
        localStorage.clear();
        window.location.href = '/'; // Volta para a Landing Page
      } catch (err) {
        alert("Erro ao excluir: " + err.message);
        setLoading(false);
      }
    }
  };

  if (loading && !editando) return <div style={msgCentral}>Sincronizando Perfil...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
        
        <main>
          <div style={cardHeader}>
            <div style={{ display: 'flex', gap: '35px', alignItems: 'flex-start' }}>
              <div style={avatarEstilo}>
                {perfil.avatar_url ? <img src={perfil.avatar_url} style={imgStyle}/> : '👤'}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900' }}>{perfil.nome_completo || 'Seu Nome'}</h1>
                    <p style={{ color: '#3b82f6', fontWeight: 'bold' }}>@{perfil.username || 'nick'}</p>
                  </div>
                  <button onClick={() => editando ? salvar() : setEditando(true)} style={editando ? btnSalvar : btnEditar}>
                    {editando ? 'GRAVAR ALTERAÇÕES' : 'EDITAR PERFIL'}
                  </button>
                </div>

                <div style={statsRow}>
                  <span><b>{perfil.seguidores}</b> seguidores</span>
                  <span><b>{perfil.seguindo}</b> seguindo</span>
                  <span><b>{meusPosts.length}</b> posts</span>
                </div>
                
                <div style={{marginTop: '15px'}}>
                   <p style={{fontSize: '14px', color: '#fbbf24', marginBottom: '5px'}}><b>Cargo:</b> {perfil.cargo_atual || 'Não informado'}</p>
                   <p style={{fontSize: '14px', opacity: 0.8}}><b>Bio:</b> {perfil.experiencia || 'Sem descrição profissional.'}</p>
                   {perfil.whatsapp && <p style={{fontSize: '14px', color: '#25d366', marginTop: '5px'}}>📞 {perfil.whatsapp}</p>}
                </div>
              </div>
            </div>

            {editando && (
              <div style={formEdicao}>
                <input style={inputStyle} placeholder="Nome Completo" value={perfil.nome_completo} onChange={e => setPerfil({...perfil, nome_completo: e.target.value})} />
                <input style={inputStyle} placeholder="Nick (@)" value={perfil.username} onChange={e => setPerfil({...perfil, username: e.target.value})} />
                <input style={inputStyle} placeholder="WhatsApp" value={perfil.whatsapp} onChange={e => setPerfil({...perfil, whatsapp: e.target.value})} />
                <input style={inputStyle} placeholder="Cargo Atual" value={perfil.cargo_atual} onChange={e => setPerfil({...perfil, cargo_atual: e.target.value})} />
                <textarea style={{...inputStyle, gridColumn: '1/-1', minHeight: '100px'}} placeholder="Sua Experiência / Resumo Profissional" value={perfil.experiencia} onChange={e => setPerfil({...perfil, experiencia: e.target.value})} />
                <button onClick={() => setEditando(false)} style={{color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer'}}>Cancelar</button>
              </div>
            )}
          </div>

          <h2 style={{fontSize: '20px', fontWeight: '900', marginBottom: '20px'}}>Minha Atividade no Feed</h2>
          {meusPosts.length > 0 ? meusPosts.map(post => (
            <div key={post.id} style={cardPost}>
              <p style={{lineHeight: '1.6'}}>{post.texto}</p>
              <div style={{display:'flex', justifyContent:'space-between', marginTop: '15px', opacity: 0.4, fontSize: '11px'}}>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>👍 {post.curtidas || 0}</span>
              </div>
            </div>
          )) : <div style={vazio}>Você ainda não postou nada no Feed.</div>}
        </main>

        <aside>
          <div style={sidebarCard}>
            <h3 style={sidebarTitulo}>SUGESTÕES</h3>
            <div style={{fontSize: '14px', marginBottom: '15px'}}>💼 Vagas em Ibitinga</div>
            <Link href="/vagas" style={btnLinkSidebar}>Ver todas as Vagas</Link>
          </div>
          <div style={{...sidebarCard, marginTop: '20px'}}>
            <Link href="/perfil/candidaturas" style={opcaoLink}>📁 Candidaturas Enviadas</Link>
            <Link href="/planos" style={{...opcaoLink, color: '#fbbf24'}}>🚀 Mudar para PRO</Link>
            
            {/* NOVO: Botão de Deletar Conta (Fica no final da lista) */}
            <button 
              onClick={handleDeleteAccount}
              style={{...opcaoLink, color: '#ff4444', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', marginTop: '10px', opacity: 0.6}}
            >
              🗑️ Excluir minha conta
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}

// ESTILOS (Mantidos)
const msgCentral = { minHeight: '100vh', backgroundColor: '#061224', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardHeader = { backgroundColor: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' };
const avatarEstilo = { width: '120px', height: '120px', backgroundColor: '#2563eb', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', fontWeight: '900', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const btnEditar = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnSalvar = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const statsRow = { display: 'flex', gap: '25px', margin: '20px 0', fontSize: '14px' };
const cardPost = { backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' };
const sidebarCard = { backgroundColor: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' };
const sidebarTitulo = { fontSize: '11px', opacity: 0.4, marginBottom: '20px', fontWeight: '900', textTransform: 'uppercase' };
const btnLinkSidebar = { display: 'block', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textDecoration: 'none', color: 'white', fontSize: '13px' };
const opcaoLink = { display: 'block', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', fontSize: '14px' };
const formEdicao = { marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' };
const vazio = { padding: '40px', textAlign: 'center', opacity: 0.3, border: '1px dashed #333', borderRadius: '20px' };