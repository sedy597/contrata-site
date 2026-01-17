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
  const [uploading, setUploading] = useState(false);
  const [novoComentario, setNovoComentario] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  // BUSCA DADOS E ATUALIZA A TELA (REATIVIDADE)
  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }

    const { data, error } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(full_name, user_type), curtidas(usuario_id), comentarios(id, texto, profiles:usuario_id(full_name))')
      .order('created_at', { ascending: false });

    if (!error) setVagas(data || []);
    setLoading(false);
  }

  // UPLOAD DE MÍDIA REAL (REQUISITO 6.1)
  async function handleUpload(file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: upError } = await supabase.storage.from('vagas_midia').upload(fileName, file);
    if (upError) throw upError;
    const { data } = supabase.storage.from('vagas_midia').getPublicUrl(fileName);
    return data.publicUrl;
  }

  // POSTAR E ATUALIZAR NA HORA (REQUISITO 6.1)
  async function handlePostar(e) {
    e.preventDefault();
    if (!textoPost.trim()) return alert("A caixa de texto é obrigatória!");
    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const fileInput = document.getElementById('fileInput');
      let urlMedia = '';

      if (fileInput?.files[0]) {
        urlMedia = await handleUpload(fileInput.files[0]);
      }

      const { error } = await supabase.from('vagas').insert([{ 
        titulo: textoPost.substring(0, 35) + "...", 
        descricao: textoPost, 
        empresa_id: session.user.id,
        imagem_url: urlMedia 
      }]);

      if (error) throw error;

      setTextoPost('');
      if(fileInput) fileInput.value = '';
      await carregarDados(); // <--- O SEGREDO: Atualiza o feed na hora
    } catch (err) {
      alert("Erro ao postar: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  // INTERAÇÕES: CURTIDAS E COMENTÁRIOS (REQUISITO 6.2)
  async function toggleLike(vagaId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Logue para interagir!");
    const { data: ex } = await supabase.from('curtidas').select('*').eq('vaga_id', vagaId).eq('usuario_id', session.user.id).single();
    if (ex) await supabase.from('curtidas').delete().eq('id', ex.id);
    else await supabase.from('curtidas').insert({ vaga_id: vagaId, usuario_id: session.user.id });
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
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' },
    input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <section>
          {/* CAIXA DE POSTAGEM OBRIGATÓRIA */}
          {perfil?.user_type === 'empresa' && (
            <div style={{...s.card, border: '2px solid #3b82f6'}}>
              <textarea 
                style={{ ...s.input, background: 'none', border: 'none', fontSize: '18px', resize: 'none' }} 
                placeholder="O que sua empresa está buscando hoje?" 
                value={textoPost} 
                onChange={(e) => setTextoPost(e.target.value)} 
                rows="3"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '15px' }}>
                <input type="file" id="fileInput" accept="image/*" style={{ fontSize: '12px' }} />
                <button onClick={handlePostar} disabled={uploading} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {uploading ? 'POSTANDO...' : 'PUBLICAR'}
                </button>
              </div>
            </div>
          )}

          {/* FEED DE POSTAGENS */}
          {loading ? <p>Carregando...</p> : vagas.map(v => (
            <div key={v.id} style={s.card}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{v.profiles?.full_name?.charAt(0)}</div>
                <div>
                  <h4 style={{ margin: 0 }}>{v.profiles?.full_name}</h4>
                  <small style={{ opacity: 0.4 }}>{new Date(v.created_at).toLocaleDateString()}</small>
                </div>
              </div>

              <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '15px' }}>{v.descricao}</p>
              {v.imagem_url && <img src={v.imagem_url} style={{ width: '100%', borderRadius: '15px', marginBottom: '15px' }} alt="Mídia" />}

              <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <button onClick={() => toggleLike(v.id)} style={{ background: 'none', border: 'none', color: v.curtidas?.some(c => c.usuario_id === perfil?.id) ? '#3b82f6' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  👍 {v.curtidas?.length || 0} Curtidas
                </button>
                <span style={{ color: '#94a3b8' }}>💬 {v.comentarios?.length || 0} Comentários</span>
              </div>

              {/* ÁREA DE COMENTÁRIOS */}
              <div style={{ marginTop: '15px' }}>
                {v.comentarios?.map(c => (
                  <div key={c.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', marginBottom: '5px', fontSize: '13px' }}>
                    <strong style={{ color: '#3b82f6' }}>{c.profiles?.full_name}:</strong> {c.texto}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input style={{ ...s.input, padding: '8px' }} placeholder="Escreva um comentário..." value={novoComentario[v.id] || ''} onChange={(e) => setNovoComentario({ ...novoComentario, [v.id]: e.target.value })} />
                  <button onClick={() => enviarComentario(v.id)} style={{ backgroundColor: '#3b82f6', border: 'none', color: 'white', padding: '0 15px', borderRadius: '10px', cursor: 'pointer' }}>OK</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* LATERAIS INTELIGENTES (REQUISITO 6.3) */}
        <aside>
          <AdsLateral />
          <div style={{ ...s.card, marginTop: '20px' }}>
            <h4 style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase' }}>{perfil?.user_type === 'empresa' ? 'Candidatos' : 'Empresas'} Sugeridas</h4>
            <p style={{ opacity: 0.5, fontSize: '12px', marginTop: '10px' }}>Sugestões baseadas na sua localização em Ibitinga.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}