// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({});
  const [vagasMinhas, setVagasMinhas] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    carregarDadosConsolidados();
  }, []);

  async function carregarDadosConsolidados() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');
    setUser(session.user);

    // 1. Dados do Perfil (Nome, Bio, etc)
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (prof) setPerfil(prof);

    // 2. Vagas que eu postei (Se for empresa)
    const { data: vgs } = await supabase.from('vagas').select('*').eq('empresa_id', session.user.id).order('created_at', { ascending: false });
    setVagasMinhas(vgs || []);

    // 3. Candidatos que se aplicaram às minhas vagas
    const { data: cands } = await supabase
      .from('candidaturas')
      .select(`id, vagas(titulo), profiles:candidato_id(full_name, telefone, curriculo_url)`)
      .eq('empresa_id', session.user.id);
    setInscritos(cands || []);

    setLoading(false);
  }

  const excluirVaga = async (id) => {
    if (confirm("Excluir esta vaga permanentemente?")) {
      await supabase.from('vagas').delete().eq('id', id);
      carregarDadosConsolidados();
    }
  };

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    header: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' },
    badge: { backgroundColor: '#2563eb', color: 'white', padding: '5px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold', width: 'fit-content', marginBottom: '10px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    card: { backgroundColor: '#0a1a31', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' },
    btnCV: { backgroundColor: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        {loading ? <p>Sincronizando todos os dados...</p> : (
          <>
            {/* CABEÇALHO COM BIO E NOME */}
            <header style={s.header}>
              <div style={s.badge}>{perfil.user_type?.toUpperCase()}</div>
              <h1 style={{ fontSize: '32px', fontWeight: '900' }}>{perfil.full_name || 'Usuário'}</h1>
              <p style={{ opacity: 0.5 }}>{user?.email}</p>
              {perfil.bio && <p style={{ marginTop: '15px', color: '#cbd5e1', fontStyle: 'italic' }}>"{perfil.bio}"</p>}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Link href="/planos" style={{ backgroundColor: '#facc15', color: 'black', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>👑 UPGRADE</Link>
                <Link href="/sac" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)' }}>🎧 SUPORTE</Link>
              </div>
            </header>

            <div style={s.grid}>
              {/* COLUNA 1: MINHAS VAGAS */}
              <section>
                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>GESTÃO DE VAGAS</h2>
                {vagasMinhas.map(v => (
                  <div key={v.id} style={{ ...s.card, marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{v.titulo}</span>
                    <button onClick={() => excluirVaga(v.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>EXCLUIR</button>
                  </div>
                ))}
              </section>

              {/* COLUNA 2: CANDIDATOS (O que o documento exige) */}
              <section>
                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>CANDIDATOS INTERESSADOS</h2>
                {inscritos.map(i => (
                  <div key={i.id} style={{ ...s.card, marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{i.profiles?.full_name}</p>
                        <p style={{ margin: 0, fontSize: '11px', opacity: 0.5 }}>Vaga: {i.vagas?.titulo}</p>
                      </div>
                      {i.profiles?.curriculo_url && (
                        <a href={i.profiles.curriculo_url} target="_blank" style={s.btnCV}>VER CV</a>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}