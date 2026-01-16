// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function MinhasCandidaturasPage() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('candidaturas')
          .select(`
            *,
            vagas (titulo_vaga, empresa_nome)
          `)
          .eq('candidato_id', user.id)
          .order('created_at', { ascending: false });

        if (!error) setCandidaturas(data || []);
      }
      setLoading(false);
    }
    carregarDados();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '40px' }}>
          <Link href="/perfil" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>← Voltar ao Perfil</Link>
          <h1 style={{ fontSize: '32px', fontWeight: '900', marginTop: '10px' }}>Minhas Candidaturas</h1>
          <p style={{ opacity: 0.5 }}>Acompanhe o status dos seus envios para as empresas de Ibitinga.</p>
        </header>

        {loading ? (
          <p>Carregando seus registros...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {candidaturas.length === 0 ? (
              <div style={cardInfo}>
                <p>Você ainda não se candidatou a nenhuma vaga.</p>
                <Link href="/vagas" style={btnLink}>Ver Vagas Disponíveis</Link>
              </div>
            ) : (
              candidaturas.map((c) => (
                <div key={c.id} style={cardCandidatura}>
                  <div style={{ flex: 1 }}>
                    <span style={badgeStatus}>ENVIADO</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 5px 0' }}>{c.vagas?.titulo_vaga}</h3>
                    <p style={{ color: '#3b82f6', fontSize: '14px' }}>{c.vagas?.empresa_nome}</p>
                    <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '10px' }}>Enviado em: {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>

                  <div style={cardLadoEmpresa}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '10px', opacity: 0.6 }}>COMO A EMPRESA TE VÊ:</p>
                    <div style={{ 
                      padding: '10px', 
                      borderRadius: '8px', 
                      backgroundColor: c.plano_candidato === 'pro' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                      border: c.plano_candidato === 'pro' ? '1px solid #10b981' : '1px solid transparent'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {c.plano_candidato === 'pro' ? '✅ TOPO DA LISTA (PRO)' : '⏳ FILA COMUM (GRÁTIS)'}
                      </span>
                    </div>
                    {c.plano_candidato === 'gratuito' && (
                      <Link href="/planos" style={{ display: 'block', fontSize: '11px', color: '#fbbf24', marginTop: '8px' }}>Subir para o topo agora ↑</Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ESTILOS
const cardCandidatura = { backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' };
const badgeStatus = { backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' };
const cardLadoEmpresa = { backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', width: '220px', textAlign: 'center' };
const cardInfo = { textAlign: 'center', padding: '60px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px' };
const btnLink = { display: 'inline-block', marginTop: '20px', backgroundColor: '#2563eb', color: 'white', padding: '12px 25px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' };