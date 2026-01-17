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
  
  // Estados da Postagem (Requisito 6.1)
  const [textoPost, setTextoPost] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagemUrl, setImagemUrl] = useState('');
  const [novoComentario, setNovoComentario] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }

    const { data, error } = await supabase
      .from('vagas')
      .select(`
        *,
        profiles:empresa_id(full_name, user_type),
        curtidas(usuario_id),
        comentarios(id, texto, created_at, profiles:usuario_id(full_name))
      `)
      .order('created_at', { ascending: false });

    if (!error) setVagas(data || []);
    setLoading(false);
  }

  // --- FUNÇÃO DE POSTAR (REQUISITO 6.1) ---
  async function handlePostar(e) {
    e.preventDefault();
    if (!textoPost.trim()) return alert("A caixa de texto é obrigatória!");

    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase.from('vagas').insert([
      { 
        titulo: textoPost.substring(0, 40) + '...', 
        descricao: textoPost, 
        empresa_id: session.user.id,
        imagem_url: imagemUrl 
      }
    ]);

    if (error) {
      alert("Erro ao postar: " + error.message);
    } else {
      setTextoPost('');
      setImagemUrl('');
      carregarDados();
    }
    setUploading(false);
  }

  // --- INTERAÇÕES (REQUISITO 6.2) ---
  async function toggleLike(vagaId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Logue para curtir!");
    
    const { data: ex } = await supabase.from('curtidas').select('*').eq('vaga_id', vagaId).eq('usuario_id', session.user.id).single();
    
    if (ex) {
      await supabase.from('curtidas').delete().eq('id', ex.id);
    } else {
      await supabase.from('curtidas').insert({ vaga_id: vagaId, usuario_id: session.user.id });
    }
    carregarDados();
  }

  async function enviarComentario(vagaId) {
    const texto = novoComentario[vagaId];
    if (!texto?.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('comentarios').insert([{ vaga_id: vagaId, usuario_id: session.user.id, texto: texto }]);
    
    setNovoComentario({ ...novoComentario, [vagaId]: '' });
    carregarDados();
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' },
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' },
    postBox: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '2px solid #3b82f6', marginBottom: '30px' },
    btnPost: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <section>
          {/* CAIXA DE POSTAGEM OBRIGATÓRIA (6.1) */}
          {perfil?.user_type === 'empresa' && (
            <div style={s.postBox}>
              <textarea 
                style={{ width: '100%', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '18px', resize: 'none' }}
                placeholder="O que sua empresa está contratando?"
                value={textoPost}
                onChange={(e) => setTextoPost(e.target.value)}
                rows="3"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Link da imagem (opcional)" 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1e293b', padding: '8px', borderRadius: '8px', color: 'white', fontSize: '12px', width: '60%' }}
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                />
                <button onClick={handlePostar} disabled={uploading} style={s.btnPost}>
                  {uploading ? 'POSTANDO...' : 'PUBLICAR'}
                </button>
              </div>
            </div>
          )}

          {/* LISTA DE POSTS */}
          {loading ? <p>Carregando...</p> : vagas.map(v => (
            <div key={v.id} style={s.card}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{v.profiles?.full_name?.charAt(0)}</div>
                <div>
                  <h4 style={{ margin: 0 }}>{v.profiles?.full_name}</h4>
                  <small style={{ opacity: 0.4 }}>{new Date(v.created_at).toLocaleDateString()}</small>
                </div>
              </div>

              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{v.descricao}</p>
              {v.imagem_url && <img src={v.imagem_url} style={{ width: '100%', borderRadius: '15px', marginTop: '15px' }} alt="Post" />}

              {/* INTERAÇÕES (6.2) */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                <button onClick={() => toggleLike(v.id)} style={{ background: 'none', border: 'none', color: v.curtidas?.some(c => c.usuario_id === perfil?.id) ? '#3b82f6' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  👍 {v.curtidas?.length || 0} Curtidas
                </button>
                <span style={{ color: '#94a3b8' }}>💬 {v.comentarios?.length || 0} Comentários</span>
              </div>

              {/* COMENTÁRIOS (6.2) */}
              <div style={{ marginTop: '15px' }}>
                {v.comentarios?.map(c => (
                  <div key={c.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', marginBottom: '8px', fontSize: '13px' }}>
                    <strong style={{ color: '#3b82f6' }}>{c.profiles?.full_name}:</strong> {c.texto}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input 
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px', color: 'white' }}
                    placeholder="Escreva um comentário..."
                    value={novoComentario[v.id] || ''}
                    onChange={(e) => setNovoComentario({ ...novoComentario, [v.id]: e.target.value })}
                  />
                  <button onClick={() => enviarComentario(v.id)} style={{ backgroundColor: '#3b82f6', border: 'none', color: 'white', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>OK</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside>
          <AdsLateral />
          <div style={{ ...s.card, marginTop: '20px' }}>
            <h4 style={{ fontSize: '12px', color: '#3b82f6' }}>{perfil?.user_type === 'empresa' ? 'CANDIDATOS' : 'EMPRESAS'}</h4>
            <p style={{ opacity: 0.5, fontSize: '12px' }}>Sugestões baseadas no seu perfil.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}