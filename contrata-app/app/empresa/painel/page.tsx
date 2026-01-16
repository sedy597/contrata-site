// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function PainelEmpresaPage() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vagaSelecionada, setVagaSelecionada] = useState('todas');
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      
      // 1. Carrega as vagas da empresa (para o filtro)
      const { data: listaVagas } = await supabase.from('vagas').select('id, titulo_vaga');
      setVagas(listaVagas || []);

      // 2. Carrega candidaturas com a LOGICA DE PRIORIDADE
      // O segredo está no .order('plano_candidato', { ascending: false })
      // Isso faz com que 'pro' (P) venha antes de 'gratuito' (G) na ordenação
      let query = supabase
        .from('candidaturas')
        .select(`
          *,
          vagas (titulo_vaga)
        `)
        .order('plano_candidato', { ascending: false }) 
        .order('created_at', { ascending: false });

      if (vagaSelecionada !== 'todas') {
        query = query.eq('vaga_id', vagaSelecionada);
      }

      const { data, error } = await query;
      
      if (!error) setCandidaturas(data || []);
      setLoading(false);
    }

    carregarDados();
  }, [vagaSelecionada]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900' }}>Painel da Empresa</h1>
            <p style={{ opacity: 0.5 }}>Gerencie os candidatos e encontre os melhores talentos.</p>
          </div>

          <select 
            onChange={(e) => setVagaSelecionada(e.target.value)}
            style={selectStyle}
          >
            <option value="todas">Todas as Vagas</option>
            {vagas.map(v => (
              <option key={v.id} value={v.id}>{v.titulo_vaga}</option>
            ))}
          </select>
        </header>

        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando candidatos...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {candidaturas.length === 0 ? (
              <div style={cardVazio}>Nenhuma candidatura recebida ainda.</div>
            ) : (
              candidaturas.map((c) => (
                <div key={c.id} style={{
                  ...cardCandidato,
                  border: c.plano_candidato === 'pro' ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: c.plano_candidato === 'pro' ? 'rgba(251, 191, 36, 0.03)' : 'rgba(255,255,255,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={avatarCandidato}>
                        {c.nome_candidato[0].toUpperCase()}
                        {c.plano_candidato === 'pro' && <div style={seloPro}>PRO</div>}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{c.nome_candidato}</h3>
                        <p style={{ fontSize: '13px', color: '#3b82f6', marginBottom: '10px' }}>Vaga: {c.vagas?.titulo_vaga}</p>
                        <p style={{ fontSize: '14px', opacity: 0.7, maxWidth: '600px' }}>"{c.resumo_profissional}"</p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', opacity: 0.4 }}>Recebido em: {new Date(c.created_at).toLocaleDateString()}</span>
                      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                        <button style={btnAcaoSecundario}>Ver E-mail</button>
                        <button style={btnAcaoPrincipal}>Abrir Currículo</button>
                      </div>
                    </div>
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
const selectStyle = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '12px', outline: 'none', cursor: 'pointer' };
const cardVazio = { textAlign: 'center', padding: '100px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', opacity: 0.5 };
const cardCandidato = { padding: '25px', borderRadius: '20px', transition: '0.3s' };
const avatarCandidato = { width: '50px', height: '50px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', position: 'relative' };
const seloPro = { position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#fbbf24', color: 'black', fontSize: '8px', fontWeight: '900', padding: '2px 5px', borderRadius: '4px' };
const btnAcaoPrincipal = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnAcaoSecundario = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' };