// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarFeed();
  }, []);

  async function carregarFeed() {
    setLoading(true);
    // Busca simples para testar a conexão
    const { data, error } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      setErro(error.message);
    } else {
      setVagas(data || []);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
        <section>
          <h1 style={{ fontWeight: '900', marginBottom: '20px' }}>Feed de Vagas</h1>

          {/* AVISO DE ERRO CASO O SUPABASE FALHE */}
          {erro && (
            <div style={{ backgroundColor: '#450a0a', border: '1px solid #ef4444', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              <strong>Erro de Conexão:</strong> {erro}
            </div>
          )}

          {loading ? <p>Buscando no banco de dados...</p> : (
            vagas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #1e293b', borderRadius: '20px' }}>
                <p style={{ opacity: 0.5 }}>O banco de dados está vazio ou a leitura foi bloqueada.</p>
                <button onClick={carregarFeed} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Tentar Novamente</button>
              </div>
            ) : (
              vagas.map(v => (
                <div key={v.id} style={{ backgroundColor: '#0a1a31', padding: '25px', borderRadius: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ color: '#3b82f6', margin: '0 0 10px 0' }}>{v.titulo}</h3>
                  <p style={{ opacity: 0.7, lineHeight: '1.6' }}>{v.descricao}</p>
                  <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.4 }}>
                    Postado por: {v.profiles?.full_name || 'Empresa Anônima'}
                  </div>
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