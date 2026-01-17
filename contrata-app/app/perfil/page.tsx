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
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({ full_name: '', bio: '', telefone: '', user_type: '' });
  const [vagasMinhas, setVagasMinhas] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [novaVaga, setNovaVaga] = useState({ titulo: '', descricao: '', salario: '', tipo_trabalho: 'Presencial' });
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

  async function postarVaga(e) {
    e.preventDefault();
    const { error } = await supabase.from('vagas').insert([
      { ...novaVaga, empresa_id: user.id, salario: parseFloat(novaVaga.salario) || 0 }
    ]);
    if (!error) { alert("Vaga postada!"); setShowModal(false); carregarTudo(); }
  }

  async function excluirVaga(id) {
    if (confirm("Excluir esta vaga?")) {
      await supabase.from('vagas').delete().eq('id', id);
      carregarTudo();
    }
  }

  async function deletarConta() {
    if (confirm("⚠️ EXCLUIR CONTA PERMANENTEMENTE? (LGPD)")) {
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      router.push('/login');
    }
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    card: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', marginBottom: '15px' },
    btnPostar: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    btnPrimary: { backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        {loading ? <p>Sincronizando banco de dados...</p> : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontWeight: '900', fontSize: '28px' }}>Painel do Usuário</h1>
              <button onClick={() => setShowModal(true)} style={s.btnPostar}>+ POSTAR VAGA</button>
            </div>

            <section style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>{perfil.user_type?.toUpperCase()}</span>
                <button onClick={() => setEditando(!editando)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {editando ? 'CANCELAR' : 'EDITAR PERFIL'}
                </button>
              </div>

              {editando ? (
                <div style={{ marginTop: '20px' }}>
                  <input style={s.input} value={perfil.full_name} onChange={e => setPerfil({...perfil, full_name: e.target.value})} placeholder="Nome" />
                  <textarea style={{...s.input, height: '80px'}} value={perfil.bio} onChange={e => setPerfil({...perfil, bio: e.target.value})} placeholder="Sua Bio" />
                  <input style={s.input} value={perfil.telefone} onChange={e => setPerfil({...perfil, telefone: e.target.value})} placeholder="WhatsApp" />
                  <button onClick={salvarPerfil} style={s.btnPrimary}>SALVAR</button>
                </div>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>{perfil.full_name || 'Usuário'}</h2>
                  <p style={{ opacity: 0.5 }}>{user?.email}</p>
                  <p style={{ marginTop: '15px', color: '#cbd5e1' }}>{perfil.bio || 'Sem bio.'}</p>
                </div>
              )}
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={s.card}>
                <h3>MINHAS VAGAS</h3>
                {vagasMinhas.map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>{v.titulo}</span>
                    <button onClick={() => excluirVaga(v.id)} style={{color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer'}}>EXCLUIR</button>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <h3>CANDIDATOS</h3>
                {inscritos.map(i => (
                  <div key={i.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{i.profiles?.full_name}</strong>
                      <p style={{ margin: 0, fontSize: '11px', opacity: 0.5 }}>{i.vagas?.titulo}</p>
                    </div>
                    {i.profiles?.curriculo_url && <a href={i.profiles.curriculo_url} target="_blank" style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px' }}>VER CV</a>}
                  </div>
                ))}
              </div>
            </div>

            {showModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <div style={{ backgroundColor: '#0a1a31', padding: '40px', borderRadius: '24px', width: '450px' }}>
                  <h2>Nova Vaga</h2>
                  <form onSubmit={postarVaga}>
                    <input style={s.input} placeholder="Título" required onChange={e => setNovaVaga({...novaVaga, titulo: e.target.value})} />
                    <textarea style={{...s.input, height: '100px'}} placeholder="Descrição" required onChange={e => setNovaVaga({...novaVaga, descricao: e.target.value})} />
                    <input style={s.input} type="number" placeholder="Salário" onChange={e => setNovaVaga({...novaVaga, salario: e.target.value})} />
                    <button type="submit" style={{...s.btnPrimary, width: '100%'}}>PUBLICAR</button>
                    <button type="button" onClick={() => setShowModal(false)} style={{ width: '100%', background: 'none', color: 'white', border: 'none', marginTop: '10px', cursor: 'pointer' }}>FECHAR</button>
                  </form>
                </div>
              </div>
            )}

            <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link href="/planos" style={{ color: '#facc15', fontWeight: 'bold', textDecoration: 'none' }}>👑 PLANOS</Link>
                <Link href="/sac" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>🎧 SUPORTE</Link>
              </div>
              <button onClick={deletarConta} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>EXCLUIR CONTA</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}