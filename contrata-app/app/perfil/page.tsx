// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({ full_name: '', bio: '', telefone: '', user_type: '' });
  const [vagasMinhas, setVagasMinhas] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');
    setUser(session.user);

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (prof) setPerfil(prof);

    const { data: vgs } = await supabase.from('vagas').select('*').eq('empresa_id', session.user.id).order('created_at', { ascending: false });
    setVagasMinhas(vgs || []);

    const { data: cands } = await supabase.from('candidaturas')
      .select(`id, vagas(titulo), profiles:candidato_id(full_name, telefone, curriculo_url)`)
      .eq('empresa_id', session.user.id);
    setInscritos(cands || []);
    setLoading(false);
  }

  async function salvarPerfil() {
    const { error } = await supabase.from('profiles').update({
      full_name: perfil.full_name,
      bio: perfil.bio,
      telefone: perfil.telefone
    }).eq('id', user.id);
    
    if (!error) { alert("Dados atualizados!"); setEditando(false); carregarTudo(); }
  }

  async function deletarConta() {
    if (confirm("⚠️ AVISO CRÍTICO: Deseja excluir sua conta permanentemente? Todas as suas vagas e dados serão apagados (Conformidade LGPD).")) {
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      router.push('/login');
    }
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    card: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', marginBottom: '15px' },
    btnPrimary: { backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
    btnDelete: { color: '#ef4444', background: 'none', border: '1px solid #ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', marginTop: '20px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        {loading ? <p>Carregando painel de controle...</p> : (
          <>
            <section style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ backgroundColor: '#3b82f6', padding: '4px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold' }}>
                  CONTA {perfil.user_type?.toUpperCase()}
                </span>
                <button onClick={() => setEditando(!editando)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editando ? 'CANCELAR' : 'EDITAR PERFIL'}
                </button>
              </div>

              {editando ? (
                <div style={{ marginTop: '20px' }}>
                  <input style={s.input} value={perfil.full_name} onChange={e => setPerfil({...perfil, full_name: e.target.value})} placeholder="Nome Completo" />
                  <textarea style={{...s.input, height: '80px'}} value={perfil.bio} onChange={e => setPerfil({...perfil, bio: e.target.value})} placeholder="Sua Bio" />
                  <input style={s.input} value={perfil.telefone} onChange={e => setPerfil({...perfil, telefone: e.target.value})} placeholder="Telefone/WhatsApp" />
                  <button onClick={salvarPerfil} style={s.btnPrimary}>SALVAR ALTERAÇÕES</button>
                </div>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>{perfil.full_name || 'Seu Nome'}</h1>
                  <p style={{ opacity: 0.5 }}>{user?.email}</p>
                  <p style={{ marginTop: '15px', color: '#cbd5e1' }}>{perfil.bio || 'Sem bio definida.'}</p>
                </div>
              )}
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={s.card}>
                <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>MINHAS VAGAS</h3>
                {vagasMinhas.map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{fontSize: '14px'}}>{v.titulo}</span>
                    <button onClick={async () => { await supabase.from('vagas').delete().eq('id', v.id); carregarTudo(); }} style={{color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px'}}>EXCLUIR</button>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>CANDIDATOS</h3>
                {inscritos.map(i => (
                  <div key={i.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{i.profiles?.full_name}</p>
                      <p style={{ margin: 0, fontSize: '11px', opacity: 0.5 }}>{i.vagas?.titulo}</p>
                    </div>
                    {i.profiles?.curriculo_url && <a href={i.profiles.curriculo_url} target="_blank" style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}>VER CV</a>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link href="/planos" style={{ color: '#facc15', fontSize: '12px', fontWeight: 'bold' }}>👑 Planos</Link>
                <Link href="/sac" style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>🎧 Suporte</Link>
              </div>
              <button onClick={deletarConta} style={s.btnDelete}>EXCLUIR MINHA CONTA</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}