// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [user, setUser] = useState(null);
  const [vagas, setVagas] = useState([]);
  
  // Campos de Edição
  const [nome, setNome] = useState('');
  const [bio, setBio] = useState('');
  const [telefone, setTelefone] = useState('');

  const router = useRouter();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');
    setUser(session.user);

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (prof) {
      setNome(prof.full_name || '');
      setBio(prof.bio || '');
      setTelefone(prof.telefone || '');
    }

    const { data: vgs } = await supabase.from('vagas').select('*').eq('empresa_id', session.user.id);
    setVagas(vgs || []);
    setLoading(false);
  }

  // SALVAR EDIÇÃO
  async function salvarPerfil() {
    const { error } = await supabase.from('profiles').update({
      full_name: nome,
      bio: bio,
      telefone: telefone
    }).eq('id', user.id);

    if (error) alert("Erro ao salvar: " + error.message);
    else {
      alert("Perfil atualizado!");
      setEditando(false);
    }
  }

  // DELETAR CONTA (REQUISITO DE SEGURANÇA/LGPD - SEÇÃO 14)
  async function deletarConta() {
    const confirmacao = confirm("PERIGO: Isso apagará todos os seus dados e vagas permanentemente. Deseja continuar?");
    if (confirmacao) {
      // No Supabase real, você precisaria de uma Edge Function para deletar o USER do Auth, 
      // mas aqui vamos limpar o profile e deslogar.
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      router.push('/login');
    }
  }

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    card: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', marginBottom: '15px' },
    btnSalvar: { backgroundColor: '#2563eb', color: 'white', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
    btnDelete: { backgroundColor: 'transparent', color: '#ef4444', padding: '10px', border: '1px solid #ef4444', borderRadius: '10px', cursor: 'pointer', marginTop: '50px', fontSize: '12px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900' }}>MEU PERFIL</h1>
            <button onClick={() => setEditando(!editando)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              {editando ? 'CANCELAR' : 'EDITAR PERFIL'}
            </button>
          </div>

          {editando ? (
            <div>
              <label>Nome Completo</label>
              <input style={s.input} value={nome} onChange={e => setNome(e.target.value)} />
              
              <label>Bio / Descrição</label>
              <textarea style={{...s.input, height: '100px'}} value={bio} onChange={e => setBio(e.target.value)} />
              
              <label>Telefone / WhatsApp</label>
              <input style={s.input} value={telefone} onChange={e => setTelefone(e.target.value)} />
              
              <button onClick={salvarPerfil} style={s.btnSalvar}>GUARDAR ALTERAÇÕES</button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '32px', margin: '0' }}>{nome || 'Sem Nome'}</h2>
              <p style={{ opacity: 0.5 }}>{user?.email}</p>
              <p style={{ marginTop: '20px', color: '#cbd5e1' }}>{bio || 'Nenhuma bio adicionada.'}</p>
              <p style={{ marginTop: '10px', color: '#3b82f6' }}>{telefone}</p>
            </div>
          )}
        </div>

        {/* LISTA DE VAGAS */}
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>MINHAS POSTAGENS</h2>
        {vagas.map(v => (
          <div key={v.id} style={{ ...s.card, padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{v.titulo}</span>
            <span style={{ color: '#ef4444', cursor: 'pointer', fontSize: '12px' }} onClick={() => supabase.from('vagas').delete().eq('id', v.id).then(() => carregarDados())}>EXCLUIR</span>
          </div>
        ))}

        {/* BOTÃO CRÍTICO: DELETAR CONTA */}
        <button onClick={deletarConta} style={s.btnDelete}>⚠️ EXCLUIR MINHA CONTA PERMANENTEMENTE</button>
      </main>
    </div>
  );
}