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

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }

    // Busca as vagas e garante que as colunas de curtidas e comentários existam
    const { data, error } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(full_name), curtidas(count), comentarios(count)')
      .order('created_at', { ascending: false });

    if (error) console.error("Erro ao buscar feed:", error.message);
    setVagas(data || []);
    setLoading(false);
  }

  async function handlePostar(e) {
    e.preventDefault();
    if (!textoPost.trim()) return alert("Escreva algo antes de publicar!");
    
    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const fileInput = document.getElementById('fileInput');
    let mediaUrl = "";

    if (fileInput?.files[0]) {
      const file = fileInput.files[0];
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error: upError } = await supabase.storage.from('vagas_midia').upload(fileName, file);
      if (!upError) {
        const { data } = supabase.storage.from('vagas_midia').getPublicUrl(fileName);
        mediaUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from('vagas').insert([
      { titulo: textoPost.substring(0,30), descricao: textoPost, empresa_id: session.user.id, imagem_url: mediaUrl }
    ]);

    if (!error) {
      setTextoPost('');
      if(fileInput) fileInput.value = '';
      carregarDados();
    }
    setUploading(false);
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
        <section>
          <h1 style={{ fontWeight: '900', fontSize: '32px', marginBottom: '20px' }}>Vagas Disponíveis</h1>

          {/* CAIXA DE POSTAGEM (SEÇÃO 6.1) */}
          {perfil?.user_type === 'empresa' && (
            <div style={{ backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '2px solid #3b82f6', marginBottom: '30px' }}>
              <textarea 
                style={{ width: '100%', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '18px', resize: 'none' }}
                placeholder="O que sua empresa está contratando?"
                value={textoPost}
                onChange={(e) => setTextoPost(e.target.value)}
                rows="3"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'center' }}>
                <input type="file" id="fileInput" accept="image/*" style={{ fontSize: '12px' }} />
                <button onClick={handlePostar} disabled={uploading} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {uploading ? 'POSTANDO...' : 'PUBLICAR'}
                </button>
              </div>
            </div>
          )}

          {/* LISTAGEM (SEÇÃO 6.1) */}
          {loading ? <p>Carregando vagas...</p> : (
            vagas.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', opacity: 0.3, border: '1px dashed white', borderRadius: '20px' }}>
                Nenhuma vaga postada ainda. Seja o primeiro!
              </div>
            ) : (
              vagas.map(v => (
                <div key={v.id} style={{ backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#3b82f6', margin: 0 }}>{v.profiles?.full_name}</h4>
                  <p style={{ margin: '15px 0', lineHeight: '1.6' }}>{v.descricao}</p>
                  {v.imagem_url && <img src={v.imagem_url} style={{ width: '100%', borderRadius: '15px' }} />}
                </div>
              ))
            )
          )}
        </section>
        <aside><AdsLateral /></aside>
      </main>
    </div>
  );
}