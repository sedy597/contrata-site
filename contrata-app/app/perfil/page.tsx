// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({});
  const [candidaturasRecebidas, setCandidaturasRecebidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosIniciais() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Busca perfil
        const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setPerfil(p || {});

        // BUSCA CANDIDATURAS REAIS (Onde o dono do perfil é a empresa)
        const { data: cands, error } = await supabase
          .from('candidaturas')
          .select(`
            id,
            vagas (titulo),
            profiles:candidato_id (full_name, telefone, curriculo_url)
          `)
          .eq('empresa_id', session.user.id);

        if (!error) setCandidaturasRecebidas(cands || []);
      }
      setLoading(false);
    }
    carregarDadosIniciais();
  }, []);

  const s = {
    card: { backgroundColor: '#0a1a31', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' },
    btnCV: { backgroundColor: '#10b981', color: 'white', padding: '8px 15px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '40px' }}>
        
        <section style={s.card}>
          <h1>{perfil.full_name || 'Meu Perfil'}</h1>
          <p style={{ opacity: 0.5 }}>{user?.email}</p>
        </section>

        <h2 style={{ margin: '40px 0 20px 0', fontSize: '20px', fontWeight: '900' }}>
          📩 CANDIDATURAS RECEBIDAS
        </h2>

        {candidaturasRecebidas.length > 0 ? (
          candidaturasRecebidas.map(item => (
            <div key={item.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{item.profiles?.full_name || 'Candidato'}</h3>
                  <p style={{ fontSize: '13px', opacity: 0.6 }}>Vaga: {item.vagas?.titulo}</p>
                  <p style={{ fontSize: '13px', color: '#3b82f6' }}>WhatsApp: {item.profiles?.telefone}</p>
                </div>
                {item.profiles?.curriculo_url && (
                  <a href={item.profiles.curriculo_url} target="_blank" style={s.btnCV}>ABRIR CURRÍCULO</a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.3 }}>Nenhuma candidatura recebida ainda.</p>
        )}
      </main>
    </div>
  );
}