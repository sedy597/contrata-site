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

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }
    const { data } = await supabase.from('vagas').select('*, profiles:empresa_id(full_name), curtidas(usuario_id), comentarios(id, texto, profiles:usuario_id(full_name))').order('created_at', { ascending: false });
    setVagas(data || []);
    setLoading(false);
  }

  // UPLOAD REAL DE MÍDIA (REQUISITO 6.1)
  async function handleUpload(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('vagas_midia').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('vagas_midia').getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handlePostar(e) {
    e.preventDefault();
    if (!textoPost.trim()) return alert("Texto obrigatório!");
    setUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const fileInput = document.getElementById('fileInput');
      let urlMedia = '';

      if (fileInput.files[0]) {
        urlMedia = await handleUpload(fileInput.files[0]);
      }

      await supabase.from('vagas').insert([{ 
        titulo: textoPost.substring(0, 30), 
        descricao: textoPost, 
        empresa_id: session.user.id,
        imagem_url: urlMedia 
      }]);

      setTextoPost('');
      fileInput.value = '';
      carregarDados();
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' },
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' },
    postBox: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '2px solid #3b82f6', marginBottom: '30px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <section>
          {perfil?.user_type === 'empresa' && (
            <div style={s.postBox}>
              <textarea style={{ width: '100%', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '18px', resize: 'none' }} placeholder="O que sua empresa está contratando?" value={textoPost} onChange={(e) => setTextoPost(e.target.value)} rows="3" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <input type="file" id="fileInput" accept="image/*" style={{ fontSize: '12px' }} />
                <button onClick={handlePostar} disabled={uploading} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {uploading ? 'POSTANDO...' : 'PUBLICAR'}
                </button>
              </div>
            </div>
          )}

          {vagas.map(v => (
            <div key={v.id} style={s.card}>
               <h4 style={{ margin: 0, color: '#3b82f6' }}>{v.profiles?.full_name}</h4>
               <p style={{ margin: '15px 0' }}>{v.descricao}</p>
               {v.imagem_url && <img src={v.imagem_url} style={{ width: '100%', borderRadius: '15px' }} />}
            </div>
          ))}
        </section>
        <aside><AdsLateral /></aside>
      </main>
    </div>
  );
}