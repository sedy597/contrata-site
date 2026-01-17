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
  const [imagemUrl, setImagemUrl] = useState(''); // Simulação de Upload de Mídias (Seção 6.1)

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

    // Busca vagas ativas (Não exibe postagens de terceiros no feed pessoal se filtrado, mas aqui é o Geral)
    const { data } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(full_name, user_type), curtidas(usuario_id), comentarios(id, texto, profiles:usuario_id(full_name))')
      .order('created_at', { ascending: false });

    setVagas(data || []);
    setLoading(false);
  }

  async function criarPostagem(e) {
    e.preventDefault();
    if (!textoPost) return alert("A caixa de texto é obrigatória!"); // Requisito 6.1

    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('vagas').insert([
      { 
        titulo: textoPost.substring(0, 30) + "...", 
        descricao: textoPost, 
        empresa_id: session.user.id,
        imagem_url: imagemUrl // Suporte a mídias
      }
    ]);

    if (!error) {
      setTextoPost('');
      setImagemUrl('');
      carregarDados();
    }
  }

  async function toggleLike(vagaId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: existente } = await supabase.from('curtidas')
      .select('*').eq('vaga_id', vagaId).eq('usuario_id', session.user.id).single();

    if (existente) {
      await supabase.from('curtidas').delete().eq('id', existente.id);
    } else {
      // Curtidas: apenas uma por usuário (Requisito 6.2)
      await supabase.from('curtidas').insert({ vaga_id: vagaId, usuario_id: session.user.id });
    }
    carregarDados();
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' },
    postBox: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #1e293b' },
    input: { width: '100%', backgroundColor: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '16px', resize: 'none' },
    card: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' },
    btnAction: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' },
    lateralCard: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <section>
          {/* 6.1 CAIXA DE POSTAGEM OBRIGATÓRIA */}
          {perfil?.user_type === 'empresa' && (
            <div style={s.postBox}>
              <form onSubmit={criarPostagem}>
                <textarea 
                  style={s.input} 
                  placeholder="No que você está pensando?" 
                  value={textoPost}
                  onChange={(e) => setTextoPost(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid #1e293b', paddingTop: '15px' }}>
                  <button type="button" onClick={() => setImagemUrl('URL_SIMULADA')} style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
                    🖼️ Adicionar Mídia
                  </button>
                  <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>Postar</button>
                </div>
              </form>
            </div>
          )}

          {/* LISTA DE POSTAGENS */}
          {vagas.map(v => (
            <div key={v.id} style={s.card}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{v.profiles?.full_name}</h4>
                  <small style={{ opacity: 0.4 }}>{new Date(v.created_at).toLocaleLowerCase()}</small>
                </div>
              </div>
              <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>{v.descricao}</p>
              
              {/* INTERAÇÕES 6.2 */}
              <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <button onClick={() => toggleLike(v.id)} style={s.btnAction}>
                  👍 {v.curtidas?.length || 0} Curtidas
                </button>
                <button style={s.btnAction}>💬 {v.comentarios?.length || 0} Comentários</button>
                <button style={s.btnAction} onClick={() => alert("Link copiado!")}>🚀 Compartilhar</button>
              </div>
            </div>
          ))}
        </section>

        {/* 6.3 LATERAIS DO FEED (INTELIGENTES) */}
        <aside>
          <AdsLateral />
          <div style={s.lateralCard}>
            <h4 style={{ fontSize: '12px', color: '#3b82f6', marginBottom: '15px' }}>
              {perfil?.user_type === 'empresa' ? 'SUGESTÕES DE CANDIDATOS' : 'SUGESTÕES DE VAGAS'}
            </h4>
            <div style={{ fontSize: '13px', opacity: 0.6 }}>
              {perfil?.user_type === 'empresa' ? (
                <p>• João Silva (Desenvolvedor)<br/>• Maria Souza (Designer)</p>
              ) : (
                <p>• Vaga de Vendedor<br/>• Auxiliar ADM</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}