'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

function ListaCandidatosContent() {
  const searchParams = useSearchParams();
  const vagaId = searchParams.get('vagaId');
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [vaga, setVaga] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarCandidatos() {
      if (!vagaId) return;

      // 1. Busca detalhes da vaga para o título
      const { data: vagaData } = await supabase
        .from('vagas')
        .select('titulo_vaga')
        .eq('id', vagaId)
        .single();
      setVaga(vagaData);

      // 2. Busca os perfis dos candidatos que se inscreveram nesta vaga
      const { data, error } = await supabase
        .from('candidaturas')
        .select(`
          id,
          created_at,
          perfis:candidato_id (
            id,
            nome,
            email,
            telefone,
            plano
          )
        `)
        .eq('vaga_id', vagaId);

      if (data) setCandidatos(data);
      setLoading(false);
    }
    carregarCandidatos();
  }, [vagaId]);

  if (loading) return <div style={containerStyle}>Carregando candidatos...</div>;

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/empresa" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>← VOLTAR AO PAINEL</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Candidatos para: <span style={{ color: '#3b82f6' }}>{vaga?.titulo_vaga}</span></h1>
      </header>

      <section style={{ padding: '40px 60px', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ opacity: 0.5, marginBottom: '30px', fontWeight: 'bold' }}>{candidatos.length} PROFISSIONAIS INSCRITOS</p>

        <div style={{ display: 'grid', gap: '15px' }}>
          {candidatos.length > 0 ? candidatos.map((item: any) => (
            <div key={item.id} style={cardCandidatoStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* AVATAR COM SELO SE FOR PREMIUM */}
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', border: item.perfis?.plano !== 'gratuito' ? '2px solid #3b82f6' : 'none' }}>
                    {item.perfis?.nome ? item.perfis.nome[0].toUpperCase() : 'U'}
                  </div>
                  {item.perfis?.plano !== 'gratuito' && (
                    <div title="Candidato Premium" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3b82f6', width: '18px', height: '18px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⭐</div>
                  )}
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{item.perfis?.nome || 'Candidato sem nome'}</h3>
                  <p style={{ margin: '3px 0', opacity: 0.6, fontSize: '13px' }}>{item.perfis?.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right', marginRight: '20px' }}>
                  <span style={{ fontSize: '11px', opacity: 0.4, display: 'block' }}>INSCRITO EM:</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <Link href={`/perfil/${item.perfis?.id}`} style={btnVerPerfilStyle}>
                  VER CURRÍCULO COMPLETO
                </Link>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '100px', opacity: 0.3 }}>
              <h3>Ainda não há candidatos para esta vaga.</h3>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function CandidatosPage() {
  return <Suspense><ListaCandidatosContent /></Suspense>;
}

// ESTILOS
const containerStyle = { backgroundColor: '#061224', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' };
const cardCandidatoStyle = { backgroundColor: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' };
const btnVerPerfilStyle = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', padding: '12px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', border: '1px solid rgba(255,255,255,0.1)' };