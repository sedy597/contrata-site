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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('vagas').insert([
      { empresa_id: user.id, titulo, descricao, salario, tipo_trabalho: tipo, cidade: 'Ibitinga' }
    ]);
    if (error) alert("Erro: " + error.message);
    else { alert("✅ Sucesso!"); router.push('/feed'); }
    setLoading(false);
  };

  const s: { [key: string]: React.CSSProperties } = {
    bg: { minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px' },
    card: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column' as 'column', gap: '15px' },
    input: { backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'white' },
    btn: { backgroundColor: '#2563eb', color: 'white', padding: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <main style={s.bg}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link href="/feed" style={{ color: '#3b82f6' }}>← Voltar</Link>
        <h1 style={{ margin: '20px 0' }}>Postar Vaga</h1>
        <form onSubmit={handleSubmit} style={s.card}>
          <input style={s.input} placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          <select style={s.input} value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
          </select>
          <input style={s.input} placeholder="Salário" value={salario} onChange={e => setSalario(e.target.value)} />
          <textarea style={{ ...s.input, height: '100px' }} placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Enviando...' : 'Publicar'}</button>
        </form>
      </div>
    </main>
  );
}