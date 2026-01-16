'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PainelEmpresaPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [minhasVagas, setMinhasVagas] = useState<any[]>([]);
  const [novaVaga, setNovaVaga] = useState({ titulo_vaga: '', cidade: '', salario: '', descricao: '' });
  const router = useRouter();

  useEffect(() => {
    async function carregarDados() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        router.push('/login');
        return;
      }
      setSession(currentSession);

      // Busca as vagas criadas por esta empresa logada
      const { data } = await supabase
        .from('vagas')
        .select('*, candidaturas(count)')
        .eq('empresa_id', currentSession.user.id)
        .order('created_at', { ascending: false });

      if (data) setMinhasVagas(data);
      setLoading(false);
    }
    carregarDados();
  }, [router]);

  const postarVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('vagas').insert([
      { ...novaVaga, empresa_id: session.user.id }
    ]);

    if (!error) {
      alert("Vaga publicada!");
      window.location.reload();
    } else {
      alert("Erro: " + error.message);
    }
  };

  if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Carregando Painel...</div>;

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/"><img src="/logo.png" style={{ height: '40px' }} alt="Logo" /></Link>
        <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>PAINEL DO RECRUTADOR</span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', padding: '40px 60px' }}>
        
        {/* FORMULÁRIO */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ marginBottom: '20px' }}>Nova Vaga</h2>
          <form onSubmit={postarVaga} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Título (Ex: Vendedor)" style={inputStyle} value={novaVaga.titulo_vaga} onChange={e => setNovaVaga({...novaVaga, titulo_vaga: e.target.value})} required />
            <input placeholder="Cidade" style={inputStyle} value={novaVaga.cidade} onChange={e => setNovaVaga({...novaVaga, cidade: e.target.value})} required />
            <input placeholder="Salário" style={inputStyle} value={novaVaga.salario} onChange={e => setNovaVaga({...novaVaga, salario: e.target.value})} />
            <textarea placeholder="Descrição e Requisitos" style={{...inputStyle, height: '120px'}} value={novaVaga.descricao} onChange={e => setNovaVaga({...novaVaga, descricao: e.target.value})} required />
            <button type="submit" style={btnStyle}>PUBLICAR VAGA</button>
          </form>
        </div>

        {/* LISTA DE VAGAS DA EMPRESA */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Vagas Gerenciadas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {minhasVagas.map(vaga => (
              <div key={vaga.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{vaga.titulo_vaga}</h3>
                  <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.5 }}>{vaga.cidade} • {vaga.candidaturas?.[0]?.count || 0} candidatos</p>
                </div>
                <Link href={`/empresa/candidatos?vagaId=${vaga.id}`} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
                  VER CURRÍCULOS
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyle = { width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', padding: '12px' };
const btnStyle = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };