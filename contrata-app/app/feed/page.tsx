// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFeed();
  }, []);

  async function carregarFeed() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);

    // Busca as vagas e conta curtidas/comentários (Interação Real Seção 6)
    const { data, error } = await supabase
      .from('vagas')
      .select(`
        *,
        profiles:empresa_id(full_name),
        curtidas(count),
        comentarios(count)
      `)
      .order('created_at', { ascending: false });

    if (!error) setVagas(data || []);
    setLoading(false);
  }

  // Ação de Curtir (Apenas uma por usuário - Requisito da Seção 6)
  async function toggleCurtida(vagaId) {
    if (!user) return alert("Faz login para interagir!");

    const { data: existente } = await supabase
      .from('curtidas')
      .select('*')
      .eq('vaga_id', vagaId)
      .eq('usuario_id', user.id)
      .single();

    if (existente) {
      await supabase.from('curtidas').delete().eq('id', existente.id);
    } else {
      await supabase.from('curtidas').insert({ vaga_id: vagaId, usuario_id: user.id });
    }
    carregarFeed();
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' },
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' },
    btnInteracao: { background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <section>
          <h1 style={{ fontWeight: '900', fontSize: '32px', marginBottom: '30px' }}>Feed Principal</h1>
          
          {loading ? <p>Sincronizando interações...</p> : vagas.map(v => (
            <div key={v.id} style={s.card}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#2563eb' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{v.profiles?.full_name}</h4>
                  <small style={{ opacity: 0.4 }}>Postado em {new Date(v.created_at).toLocaleDateString()}</small>
                </div>
              </div>

              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{v.titulo}</h2>
              <p style={{ opacity: 0.6, fontSize: '14px', marginBottom: '20px' }}>{v.descricao}</p>

              {/* BARRA DE INTERAÇÕES (REQUISITO 6) */}
              <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <button onClick={() => toggleCurtida(v.id)} style={s.btnInteracao}>
                  👍 {v.curtidas?.[0]?.count || 0} Curtidas
                </button>
                <button style={s.btnInteracao}>
                  💬 {v.comentarios?.[0]?.count || 0} Comentários
                </button>
                <button style={s.btnInteracao} onClick={() => alert("Link de compartilhamento copiado!")}>
                  🚀 Partilhar
                </button>
              </div>
            </div>
          ))}
        </section>

        <aside>
          <div style={{ position: 'sticky', top: '40px' }}>
            <AdsLateral />
            {/* Seção de Sugestões da Lateral (Requisito 6) */}
            <div style={{ ...s.card, marginTop: '20px' }}>
              <h4 style={{ fontSize: '13px', color: '#3b82f6', marginBottom: '15px' }}>SUGESTÕES PARA VOCÊ</h4>
              <p style={{ fontSize: '12px', opacity: 0.5 }}>Novos perfis e empresas de Ibitinga em breve aqui.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}