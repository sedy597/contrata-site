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
    if (!error) { 
        alert("Vaga postada com sucesso!"); 
        setShowModal(false); 
        setNovaVaga({ titulo: '', descricao: '', salario: '', tipo_trabalho: 'Presencial' });
        carregarTudo(); 
    }
  }

  async function excluirVaga(id) {
    if (confirm("Deseja realmente excluir esta vaga?")) {
      await supabase.from('vagas').delete().eq('id', id);
      carregarTudo();
    }
  }

  async function deletarConta() {
    if (confirm("⚠️ ATENÇÃO: Deseja excluir sua conta permanentemente? Esta ação cumpre os requisitos da LGPD e não pode ser desfeita.")) {
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
              {perfil.user_type === 'empresa' && (
                <button onClick={() => setShowModal(true)} style={s.btnPostar}>+ POSTAR VAGA</button>
              )}
            </div>

            <section style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ backgroundColor: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                  CONTA {perfil.user_type?.toUpperCase()}
                </span>
                <button onClick={() => setEditando(!editando)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editando ? 'CANCELAR' : 'EDITAR PERFIL'}
                </button>
              </div>

              {editando ? (
                <div style={{ marginTop: '20px' }}>
                  <input style={s.input} value={perfil.full_name} onChange={e => setPerfil({...perfil, full_name: e.target.value})} placeholder="Nome Completo" />
                  <textarea style={{...s.input, height: '80px'}} value={perfil.bio} onChange={e => setPerfil({...perfil, bio: e.target.value})} placeholder="Sua Bio (Resumo profissional ou da empresa)" />
                  <input style={s.input} value={perfil.telefone} onChange={e => setPerfil({...perfil, telefone: e.target.value})} placeholder="WhatsApp (DDD + Número)" />
                  <button onClick={salvarPerfil} style={s.btnPrimary}>SALVAR ALTERAÇÕES</button>
                </div>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>{perfil.full_name || 'Usuário'}</h2>
                  <p style={{ opacity: 0.5 }}>{user?.email}</p>
                  <p style={{ marginTop: '15px', color: '#cbd5e1', lineHeight: '1.6' }}>{perfil.bio || 'Sem bio definida.'}</p>
                </div>
              )}
            </section>

            {perfil.user_type === 'empresa' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={s.card}>
                    <h3 style={{ fontSize: '16px', marginBottom: '20px', opacity: 0.7 }}>MINHAS VAGAS</h3>
                    {vagasMinhas.length === 0 ? <p style={{opacity: 0.3}}>Nenhuma vaga ativa.</p> : vagasMinhas.map(v => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{fontWeight: '500'}}>{v.titulo}</span>
                        <button onClick={() => excluirVaga(v.id)} style={{color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px'}}>EXCLUIR</button>
                    </div>
                    ))}
                </div>
                <div style={s.card}>
                    <h3 style={{ fontSize: '16px', marginBottom: '20px', opacity: 0.7 }}>CANDIDATOS INTERESSADOS</h3>
                    {inscritos.length === 0 ? <p style={{opacity: 0.3}}>Nenhum inscrito ainda.</p> : inscritos.map(i => (
                    <div key={i.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                        <strong style={{display: 'block'}}>{i.profiles?.full_name}</strong>
                        <span style={{ fontSize: '11px', opacity: 0.5 }}>Vaga: {i.vagas?.titulo}</span>
                        </div>
                        {i.profiles?.curriculo_url && (
                            <a href={i.profiles.curriculo_url} target="_blank" style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', textDecoration: 'none', border: '1px solid #10b981', padding: '4px 8px', borderRadius: '6px' }}>
                                VER CV
                            </a>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            )}

            {showModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                <div style={{ backgroundColor: '#0a1a31', padding: '40px', borderRadius: '24px', width: '450px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h2 style={{ marginBottom: '20px' }}>Nova Oportunidade</h2>
                  <form onSubmit={postarVaga}>
                    <input style={s.input} placeholder="Título da Vaga (ex: Vendedor)" required onChange={e => setNovaVaga({...novaVaga, titulo: e.target.value})} />
                    <textarea style={{...s.input, height: '100px'}} placeholder="Descrição detalhada e requisitos" required onChange={e => setNovaVaga({...novaVaga, descricao: e.target.value})} />
                    <input style={s.input} type="number" placeholder="Salário (Opcional)" onChange={e => setNovaVaga({...novaVaga, salario: e.target.value})} />
                    <select style={s.input} onChange={e => setNovaVaga({...novaVaga, tipo_trabalho: e.target.value})}>
                        <option value="Presencial">Presencial</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Remoto">Remoto</option>
                    </select>
                    <button type="submit" style={{...s.btnPrimary, width: '100%', marginTop: '10px'}}>PUBLICAR AGORA</button>
                    <button type="button" onClick={() => setShowModal(false)} style={{ width: '100%', background: 'none', color: 'rgba(255,255,255,0.5)', border: 'none', marginTop: '15px', cursor: 'pointer', fontSize: '14px' }}>CANCELAR</button>
                  </form>
                </div>
              </div>
            )}

            <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '25px' }}>
                <Link href="/planos" style={{ color: '#facc15', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>👑 PLANOS PREMIUM</Link>
                <Link href="/sac" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>🎧 SUPORTE TÉCNICO</Link>
              </div>
              <button onClick={deletarConta} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', opacity: 0.6 }}>EXCLUIR MINHA CONTA</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}