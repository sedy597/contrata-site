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
      alert("Você precisa estar logado como empresa para postar.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('vagas').insert([
      {
        empresa_id: user.id,
        titulo,
        descricao,
        salario,
        tipo_trabalho: tipo,
        cidade: 'Ibitinga'
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

  return (
    <main style={styles.bg}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/feed" style={styles.btnVoltar}>← Voltar ao Feed</Link>
          <h1 style={styles.tituloPrincipal}>ANUNCIAR NOVA VAGA</h1>
          <p style={styles.subtitulo}>Preencha os detalhes para encontrar os melhores talentos em Ibitinga.</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>TÍTULO DA VAGA</label>
            <input 
              style={styles.input} 
              placeholder="Ex: Vendedor, Costureira, Gerente..." 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>TIPO DE TRABALHO</label>
            <select 
              style={styles.input} 
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="Presencial">Presencial</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SALÁRIO (OPCIONAL)</label>
            <input 
              style={styles.input} 
              placeholder="Ex: R$ 2.500,00 ou A Combinar" 
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>DESCRIÇÃO DAS ATIVIDADES E REQUISITOS</label>
            <textarea 
              style={{...styles.input, minHeight: '150px'}} 
              placeholder="Descreva o que o candidato fará e o que é necessário..." 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btnPublicar}>
            {loading ? 'PUBLICANDO...' : 'PUBLICAR VAGA AGORA'}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  bg: { minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' },
  container: { maxWidth: '700px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  btnVoltar: { color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' },
  tituloPrincipal: { fontSize: '32px', fontWeight: '900', marginTop: '20px', letterSpacing: '-1px' },
  subtitulo: { opacity: 0.5, fontSize: '14px' },
  card: { backgroundColor: '#0a1a31', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' as 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '8px' },
  label: { fontSize: '10px', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' },
  input: { backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' },
  btnPublicar: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }
};