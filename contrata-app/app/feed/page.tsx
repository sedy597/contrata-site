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

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }

    // Busca todas as postagens sem filtros que escondam o conteúdo
    const { data, error } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(full_name)')
      .order('created_at', { ascending: false });

    if (!error) setVagas(data || []);
    setLoading(false);
  }

  async function handlePostar(e) {
    e.preventDefault();
    if (!textoPost.trim()) return;

    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase.from('vagas').insert([
      { 
        titulo: textoPost.substring(0, 30), 
        descricao: textoPost, 
        empresa_id: session.user.id 
      }
    ]);

    if (error) {
      alert("Erro ao publicar: " + error.message);
    } else {
      setTextoPost('');
      // Força a atualização imediata da lista na tela
      await carregarDados(); 
    }
    setUploading(false);
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
        <section>
          {perfil?.user_type === 'empresa' && (
            <div style={{ backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid #3b82f6', marginBottom: '30px' }}>
              <textarea 
                style={{ width: '100%', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '16px', resize: 'none' }}
                placeholder="Escreva sua postagem..."
                value={textoPost}
                onChange={(e) => setTextoPost(e.target.value)}
                rows="3"
              />
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button 
                  onClick={handlePostar} 
                  disabled={uploading}
                  style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {uploading ? 'POSTANDO...' : 'PUBLICAR'}
                </button>
              </div>
            </div>
          )}

          {loading ? <p>Carregando feed...</p> : vagas.map(v => (
            <div key={v.id} style={{ backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#3b82f6', margin: 0 }}>{v.profiles?.full_name}</h4>
              <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{v.descricao}</p>
            </div>
          ))}
        </section>
        <aside><AdsLateral /></aside>
      </main>
    </div>
  );
}