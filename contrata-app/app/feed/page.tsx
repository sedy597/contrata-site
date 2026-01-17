// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AdsLateral from '../components/AdsLateral';

export default function FeedPage() {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFeed();
  }, []);

  async function carregarFeed() {
    setLoading(true);
    // Busca vagas e traz info da empresa para saber se é Premium (Seção 10)
    const { data, error } = await supabase
      .from('vagas')
      .select('*, profiles:empresa_id(user_type)') 
      .order('created_at', { ascending: false });

    if (!error) setVagas(data || []);
    setLoading(false);
  }

  // Lógica de Busca em tempo real
  const vagasFiltradas = vagas.filter(v => 
    v.titulo.toLowerCase().includes(busca.toLowerCase()) || 
    v.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    container: { flex: 1, marginLeft: '240px', padding: '40px', display: 'flex', gap: '30px' },
    inputBusca: { width: '100%', padding: '15px 25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '16px', marginBottom: '30px' },
    vagaCard: (isPremium) => ({
      backgroundColor: isPremium ? 'rgba(59, 130, 246, 0.05)' : '#0a1a31',
      padding: '25px',
      borderRadius: '24px',
      border: isPremium ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
      marginBottom: '20px',
      position: 'relative'
    }),
    badgeDestaque: { position: 'absolute', top: '20px', right: '20px', backgroundColor: '#facc15', color: '#000', padding: '4px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: '900' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.container}>
        <div style={{ flex: 1 }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900' }}>Oportunidades</h1>
            <p style={{ opacity: 0.5 }}>Encontra o teu próximo passo em Ibitinga</p>
          </header>

          <input 
            style={s.inputBusca} 
            placeholder="🔍 Procura por cargo, empresa ou palavra-chave..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {loading ? <p>A carregar vagas...</p> : (
            vagasFiltradas.map((v, index) => (
              <div key={v.id}>
                {/* Inserção de Ad a cada 3 vagas (Seção 10 do Doc) */}
                {index > 0 && index % 3 === 0 && (
                  <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '10px', opacity: 0.3 }}>ANÚNCIO PATROCINADO</span>
                  </div>
                )}

                <div style={s.vagaCard(v.salario > 5000)}> {/* Simulação de destaque para salários altos ou premium */}
                  {v.salario > 5000 && <span style={s.badgeDestaque}>DESTAQUE</span>}
                  <h3 style={{ fontSize: '22px', margin: '0 0 10px 0' }}>{v.titulo}</h3>
                  <p style={{ opacity: 0.6, fontSize: '14px', lineHeight: '1.6' }}>{v.descricao}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {v.salario ? `R$ ${v.salario}` : 'Salário a combinar'}
                    </span>
                    <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                      CANDIDATAR-SE
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside style={{ width: '280px' }}>
          <AdsLateral />
        </aside>
      </main>
    </div>
  );
}