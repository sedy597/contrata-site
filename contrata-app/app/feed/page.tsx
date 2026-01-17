// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFeed();
  }, []);

  async function carregarFeed() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);

    // Busca vagas com contagem real de curtidas e comentários (Requisito 6)
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

  async function toggleCurtida(vagaId) {
    if (!user) return alert("Faça login para interagir!");

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
    carregarFeed(); // Atualiza contador na tela
  }

  const aplicarVaga = async (vagaId, empresaId) => {
    if (!user) return alert("Faça login para se candidatar!");
    const { error } = await supabase.from('candidaturas').insert([
      { vaga_id: vagaId, candidato_id: user.id, empresa_id: empresaId }
    ]);
    if (error) alert("Você já se candidatou!");
    else alert("✅ Candidatura enviada com sucesso!");
  };

  const vagasFiltradas = vagas.filter(v => 
    v.titulo.toLowerCase().includes(busca.toLowerCase()) || 
    v.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' },
    busca: { width: '100%', padding: '15px 25px', borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '30px', fontSize: '16px' },
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' },
    btnInteracao: { background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    btnCandidatar: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        {/* COLUNA CENTRAL: POSTAGENS E BUSCA */}
        <section>
          <input 
            style={s.busca} 
            placeholder="🔍 Buscar por cargo ou empresa em Ibitinga..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {loading ? <p>Carregando feed...</p> : vagasFiltradas.map((v, index) => (
            <div key={v.id}>
              {/* ADS A CADA 3 VAGAS (REQUISITO 10) */}
              {index > 0 && index % 3 === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '20px', fontSize: '11px', opacity: 0.4 }}>
                  CONTEÚDO PATROCINADO
                </div>
              )}

              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {v.profiles?.full_name?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{v.profiles?.full_name || 'Empresa'}</h4>
                      <small style={{ opacity: 0.4 }}>{new Date(v.created_at).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>R$ {v.salario || 'A combinar'}</span>
                </div>

                <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>{v.titulo}</h2>
                <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>{v.descricao}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => toggleCurtida(v.id)} style={s.btnInteracao}>
                      👍 {v.curtidas?.[0]?.count || 0}
                    </button>
                    <button style={s.btnInteracao}>
                      💬 {v.comentarios?.[0]?.count || 0}
                    </button>
                  </div>
                  <button onClick={() => aplicarVaga(v.id, v.empresa_id)} style={s.btnCandidatar}>
                    CANDIDATAR-SE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* COLUNA LATERAL (REQUISITO 6) */}
        <aside>
          <div style={{ position: 'sticky', top: '40px' }}>
            <AdsLateral />
            <div style={{ ...s.card, marginTop: '20px' }}>
              <h4 style={{ fontSize: '13px', color: '#3b82f6', marginBottom: '15px', textTransform: 'uppercase' }}>Sugestões para você</h4>
              <p style={{ fontSize: '12px', opacity: 0.5, lineHeight: '1.5' }}>Baseado no seu perfil, encontramos novas empresas em Ibitinga que podem te interessar.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}