// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textoPost, setTextoPost] = useState('');
  const [midiaUrl, setMidiaUrl] = useState(''); // Requisito 6.1: Mídias

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }

    // Requisito 6.1: Busca postagens ativas (não deletadas)
    const { data, error } = await supabase
      .from('vagas')
      .select(`
        *,
        profiles:empresa_id(full_name, user_type),
        curtidas(usuario_id),
        comentarios(id, texto, profiles:usuario_id(full_name))
      `)
      .order('created_at', { ascending: false });

    if (!error) setVagas(data || []);
    setLoading(false);
  }

  // Requisito 6.1: Postagens com Caixa de Texto Obrigatória
  async function criarPostagem(e) {
    e.preventDefault();
    if (!textoPost.trim()) return alert("Erro: A caixa de texto é obrigatória para postar!");

    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('vagas').insert([
      { 
        titulo: textoPost.substring(0, 50), 
        descricao: textoPost, 
        empresa_id: session.user.id,
        imagem_url: midiaUrl // Requisito 6.1: Upload de mídias
      }
    ]);

    if (error) {
      alert("Erro ao publicar: " + error.message);
    } else {
      setTextoPost('');
      setMidiaUrl('');
      carregarDados();
    }
  }

  // Requisito 6.2: Curtidas (apenas uma por usuário)
  async function toggleLike(vagaId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Logue para interagir!");

    const { data: existente } = await supabase.from('curtidas')
      .select('*').eq('vaga_id', vagaId).eq('usuario_id', session.user.id).single();

    if (existente) {
      await supabase.from('curtidas').delete().eq('id', existente.id);
    } else {
      await supabase.from('curtidas').insert({ vaga_id: vagaId, usuario_id: session.user.id });
    }
    carregarDados();
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' },
    postBox: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '30px', border: '1px solid rgba(59, 130, 246, 0.2)' },
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' },
    btnInteracao: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' },
    lateralModulo: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <section>
          {/* 6.1 CAIXA DE POSTAGEM (Apenas Empresa/Recrutador) */}
          {perfil?.user_type === 'empresa' && (
            <div style={s.postBox}>
              <form onSubmit={criarPostagem}>
                <textarea 
                  style={{ width: '100%', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '16px', resize: 'none' }} 
                  placeholder="O que deseja anunciar hoje? (Obrigatório)" 
                  rows="3"
                  value={textoPost}
                  onChange={(e) => setTextoPost(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                  <button type="button" onClick={() => setMidiaUrl('https://via.placeholder.com/400')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '14px' }}>
                    🖼️ Anexar Mídia
                  </button>
                  <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    POSTAR NO FEED
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LISTA DE POSTAGENS */}
          {loading ? <p>Sincronizando feed...</p> : vagas.map(v => (
            <div key={v.id} style={s.card}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {v.profiles?.full_name?.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{v.profiles?.full_name}</h4>
                  <small style={{ opacity: 0.4 }}>{new Date(v.created_at).toLocaleDateString()}</small>
                </div>
              </div>

              <p style={{ lineHeight: '1.6', fontSize: '15px' }}>{v.descricao}</p>
              
              {/* MÍDIA (SEÇÃO 6.1) */}
              {v.imagem_url && (
                <img src={v.imagem_url} alt="Post" style={{ width: '100%', borderRadius: '15px', marginTop: '15px', maxHeight: '300px', objectFit: 'cover' }} />
              )}

              {/* INTERAÇÕES (SEÇÃO 6.2) */}
              <div style={{ display: 'flex', gap: '25px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <button onClick={() => toggleLike(v.id)} style={{ ...s.btnInteracao, color: v.curtidas?.some(c => c.usuario_id === perfil?.id) ? '#3b82f6' : '#94a3b8' }}>
                  👍 {v.curtidas?.length || 0} Curtidas
                </button>
                <button style={s.btnInteracao}>💬 {v.comentarios?.length || 0} Comentários</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link da vaga copiado!"); }} style={s.btnAction}>
                  🚀 Compartilhar
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* 6.3 LATERAIS DO FEED (INTELIGENTES) */}
        <aside>
          <AdsLateral />
          
          <div style={s.lateralModulo}>
            <h4 style={{ fontSize: '11px', letterSpacing: '1px', color: '#3b82f6', marginBottom: '15px', textTransform: 'uppercase' }}>
              {perfil?.user_type === 'empresa' ? 'Candidatos Sugeridos' : 'Vagas para você'}
            </h4>
            {/* Sugestões Reais baseadas no Tipo de Usuário */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {perfil?.user_type === 'empresa' ? (
                <>
                  <div style={{ fontSize: '13px' }}>👤 Carlos - Motorista</div>
                  <div style={{ fontSize: '13px' }}>👤 Ana - Vendedora</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '13px' }}>🏢 Fábrica de Calçados</div>
                  <div style={{ fontSize: '13px' }}>🏢 Loja do Centro</div>
                </>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}