// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostarVagaPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
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
      alert("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    // Enviando o MÍNIMO necessário para o banco aceitar sem reclamar de colunas
    const { error } = await supabase.from('vagas').insert([
      {
        empresa_id: user.id,
        titulo: titulo,
        descricao: descricao
      }
    ]);

    if (error) {
      console.error("Erro no Supabase:", error);
      alert("Erro ao postar: " + error.message);
    } else {
      alert("✅ SUCESSO! Vaga publicada.");
      router.push('/feed');
    }
    setLoading(false);
  };

  const s: { [key: string]: React.CSSProperties } = {
    bg: { minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' },
    container: { maxWidth: '600px', margin: '0 auto' },
    card: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' as 'column', gap: '20px' },
    input: { backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', outline: 'none' },
    btn: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <main style={s.bg}>
      <div style={s.container}>
        <Link href="/feed" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>← Voltar</Link>
        <h1 style={{ fontSize: '28px', margin: '20px 0' }}>Anunciar Vaga</h1>

        <form onSubmit={handleSubmit} style={s.card}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>TÍTULO</label>
            <input 
              style={s.input} 
              placeholder="Ex: Vendedor" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>DESCRIÇÃO</label>
            <textarea 
              style={{...s.input, minHeight: '150px'}} 
              placeholder="Requisitos e atividades..." 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'ENVIANDO...' : 'PUBLICAR AGORA'}
          </button>
        </form>
      </div>
    </main>
  );
}