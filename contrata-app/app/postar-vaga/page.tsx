// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostarVagaPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salario, setSalario] = useState('');
  const [tipo, setTipo] = useState('Presencial');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    getSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("Você precisa estar logado para postar.");
      setLoading(false);
      return;
    }

    // REMOVIDO A COLUNA 'cidade' PARA EVITAR O ERRO DE SCHEMA CACHE
    const { error } = await supabase.from('vagas').insert([
      {
        empresa_id: user.id,
        titulo,
        descricao,
        salario,
        tipo_trabalho: tipo
      }
    ]);

    if (error) {
      alert("Erro ao postar vaga: " + error.message);
    } else {
      alert("✅ Vaga publicada com sucesso!");
      router.push('/feed');
    }
    setLoading(false);
  };

  const s: { [key: string]: React.CSSProperties } = {
    bg: { minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' },
    container: { maxWidth: '700px', margin: '0 auto' },
    header: { marginBottom: '30px' },
    btnVoltar: { color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' },
    tituloPrincipal: { fontSize: '32px', fontWeight: '900', marginTop: '20px', letterSpacing: '-1px' },
    card: { backgroundColor: '#0a1a31', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' as 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '8px' },
    label: { fontSize: '10px', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' },
    input: { backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' },
    btnPublicar: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }
  };

  return (
    <main style={s.bg}>
      <div style={s.container}>
        <header style={s.header}>
          <Link href="/feed" style={s.btnVoltar}>← Voltar ao Feed</Link>
          <h1 style={s.tituloPrincipal}>ANUNCIAR NOVA VAGA</h1>
        </header>

        <form onSubmit={handleSubmit} style={s.card}>
          <div style={s.inputGroup}>
            <label style={s.label}>TÍTULO DA VAGA</label>
            <input 
              style={s.input} 
              placeholder="Ex: Vendedor" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required 
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>TIPO DE TRABALHO</label>
            <select style={s.input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Presencial">Presencial</option>
              <option value="Remoto">Remoto</option>
            </select>
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>SALÁRIO</label>
            <input 
              style={s.input} 
              placeholder="Ex: 1500" 
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>DESCRIÇÃO</label>
            <textarea 
              style={{...s.input, minHeight: '120px'}} 
              placeholder="Detalhes da vaga..." 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={s.btnPublicar}>
            {loading ? 'ENVIANDO...' : 'PUBLICAR AGORA'}
          </button>
        </form>
      </div>
    </main>
  );
}