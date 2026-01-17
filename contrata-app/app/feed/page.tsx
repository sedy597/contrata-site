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

  useEffect(() => { 
    carregarTudo(); 
  }, []);

  async function carregarTudo() {
    setLoading(true);
    
    // 1. Pega o perfil de quem está logado (para mostrar a caixa de postar)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setPerfil(p);
    }

    // 2. BUSCA GLOBAL: Sem filtros, sem frescura. Se tá no banco, aparece.
    const { data, error } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("ERRO NO DOMÍNIO:", error.message);
    }
    
    setVagas(data || []);
    setLoading(false);
  }

  async function handlePostar(e) {
    e.preventDefault();
    if (!textoPost.trim()) return alert("Digite o texto!");

    const { data: { session } } = await supabase.auth.getSession();
    
    // Insere direto
    const { error } = await supabase.from('vagas').insert([
      { 
        titulo: textoPost.substring(0, 30), 
        descricao: textoPost, 
        empresa_id: session.user.id 
      }
    ]);

    if (error) {
      alert("Erro ao gravar no banco: " + error.message);
    } else {
      setTextoPost('');
      alert("Postado com sucesso! Atualizando feed...");
      carregarTudo();
    }
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
        <section>
          <h1 style={{ fontWeight: '900', fontSize: '32px', marginBottom: '30px' }}>Feed Oficial</h1>

          {/* CAIXA DE POSTAGEM */}
          {perfil?.user_type === 'empresa' && (
            <div style={{ backgroundColor: '#0a1a31', padding: '25px', borderRadius: '20px', border: '2px solid #3b82f6', marginBottom: '30px' }}>
              <textarea 
                style={{ width: '100%', background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '18px', resize: 'none' }}
                placeholder="Postar agora no domínio oficial..."
                value={textoPost}
                onChange={(e) => setTextoPost(e.target.value)}
              />
              <button onClick={handlePostar} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>
                PUBLICAR AGORA
              </button>
            </div>
          )}

          {loading ? <p>Buscando dados no servidor...</p> : (
            vagas.length === 0 ? <p>O banco de dados retornou 0 postagens.</p> :
            vagas.map(v => (
              <div key={v.id} style={{ backgroundColor: '#0a1a31', padding: '20px', borderRadius: '20px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#3b82f6' }}>{v.profiles?.full_name}</strong>
                <p style={{ marginTop: '10px' }}>{v.descricao}</p>
              </div>
            ))
          )}
        </section>
        <aside><AdsLateral /></aside>
      </main>
    </div>
  );
}