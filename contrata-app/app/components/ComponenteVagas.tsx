// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export function ComponenteVagas() {
  const [busca, setBusca] = useState('');
  const [vagas, setVagas] = useState([]);
  const [vagasSalvas, setVagasSalvas] = useState([]);
  const [sugestoesInput, setSugestoesInput] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [mostrarModalPlanos, setMostrarModalPlanos] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('todas'); 
  const [planoAtivo, setPlanoAtivo] = useState('gratuito'); 

  const cargosPadrao = ['Costureira', 'Bordador', 'Auxiliar de Produção', 'Vendedor', 'Motorista', 'Cozinheira', 'Faxineira', 'Estoquista'];

  const carregarDados = async (termo = '') => {
    setLoading(true);
    let query = supabase.from('vagas').select('*');
    if (termo) query = query.ilike('titulo_vaga', `%${termo}%`);
    const { data } = await query.order('created_at', { ascending: false });
    setVagas(data || []);
    setLoading(false);
    setSugestoesInput([]); 
  };

  const handleDigitacao = (valor) => {
    setBusca(valor);
    if (valor.length > 0) {
      const titulosVagas = vagas.map(v => v.titulo_vaga);
      const combinados = [...new Set([...cargosPadrao, ...titulosVagas])];
      const filtradas = combinados
        .filter(item => item.toLowerCase().includes(valor.toLowerCase()))
        .slice(0, 5);
      setSugestoesInput(filtradas);
    } else {
      setSugestoesInput([]);
    }
  };

  const toggleSalvar = (id) => {
    setVagasSalvas(prev => prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]);
  };

  useEffect(() => { carregarDados(); }, []);

  const exibirVagas = abaAtiva === 'todas' ? vagas : vagas.filter(v => vagasSalvas.includes(v.id));

  return (
    <div style={{ padding: '20px', width: '100%', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setAbaAtiva('todas')} style={abaAtiva === 'todas' ? tabAtiva : tabInativa}>Todas as Vagas</button>
        <button onClick={() => setAbaAtiva('salvas')} style={abaAtiva === 'salvas' ? tabAtiva : tabInativa}>⭐ Salvas ({vagasSalvas.length})</button>
      </div>

      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e3a8a' }}>Vagas Disponíveis</h1>
        
        <div style={{ position: 'relative', maxWidth: '650px', margin: '20px auto', zIndex: 100 }}>
          <div style={searchBarContainer}>
            <input 
              type="text" 
              placeholder="Digite o cargo (ex: Bordador)..." 
              value={busca}
              onChange={(e) => handleDigitacao(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && carregarDados(busca)}
              style={searchInputStyle}
            />
            <button onClick={() => carregarDados(busca)} style={btnBuscaStyle}>BUSCAR</button>
          </div>

          {sugestoesInput.length > 0 && (
            <div style={autocompleteBox}>
              {sugestoesInput.map((sug, i) => (
                <div 
                  key={i} 
                  style={autocompleteItem} 
                  onClick={() => { setBusca(sug); carregarDados(sug); }}
                >
                  🔍 {sug}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {loading && <p style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>Buscando vagas...</p>}

      <div style={vagasGrid}>
        {exibirVagas.map((vaga) => (
          <div key={vaga.id} style={cardVagaStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
              <span style={empresaTag}>{vaga.empresa_nome || 'Empresa Confidencial'}</span>
              <button onClick={() => toggleSalvar(vaga.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: vagasSalvas.includes(vaga.id) ? '#eab308' : '#cbd5e1' }}>
                {vagasSalvas.includes(vaga.id) ? '⭐' : '☆'}
              </button>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '8px', color: '#1e3a8a' }}>{vaga.titulo_vaga}</h3>
            <p style={{ color: '#059669', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>{vaga.salario || 'Salário a combinar'}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href={`/candidatar/${vaga.id}`} style={btnCandidatarPrincipal}>
                {planoAtivo === 'pro' ? '⚡ CANDIDATURA PRIORITÁRIA' : 'CANDIDATAR-SE'}
              </Link>
              <button onClick={() => setMostrarModalPlanos(true)} style={btnAcompanhar}>
                {planoAtivo === 'pro' ? '📊 STATUS EM TEMPO REAL' : '🔒 ACOMPANHAR'}
              </button>
            </div>
          </div>
        ))}
        {!loading && exibirVagas.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>Nenhuma vaga encontrada para esta busca.</p>
        )}
      </div>

      {mostrarModalPlanos && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ fontSize: '50px' }}>🚀</div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '15px 0', color: '#1e3a8a' }}>Seja um Candidato PRO</h2>
            <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '14px' }}>Acompanhe o status da sua vaga em tempo real e fique no topo da lista das empresas.</p>
            <Link href="/planos" style={btnProStyle}>VER PLANOS (R$ 10)</Link>
            <button onClick={() => setMostrarModalPlanos(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const searchBarContainer = { display: 'flex', backgroundColor: '#ffffff', borderRadius: '50px', padding: '6px', border: '2px solid #e2e8f0', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.1)' };
const searchInputStyle = { flex: 1, border: 'none', outline: 'none', padding: '0 25px', color: '#1e3a8a', fontSize: '15px', background: 'transparent' };
const btnBuscaStyle = { backgroundColor: '#1e3a8a', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' };
const autocompleteBox = { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '15px', marginTop: '10px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100 };
const autocompleteItem = { padding: '15px 25px', color: '#1e3a8a', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontWeight: '600', fontSize: '14px' };
const tabAtiva = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const tabInativa = { backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' };
const vagasGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', width: '100%' };
const cardVagaStyle = { backgroundColor: '#ffffff', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const empresaTag = { backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '10px', fontWeight: '900', padding: '6px 12px', borderRadius: '8px' };
const btnCandidatarPrincipal = { backgroundColor: '#2563eb', color: 'white', textAlign: 'center', padding: '12px', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '12px', display: 'block' };
const btnAcompanhar = { backgroundColor: '#ffffff', border: '2px solid #e2e8f0', color: '#64748b', padding: '12px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' };
const modalContent = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' };
const btnProStyle = { backgroundColor: '#2563eb', color: 'white', padding: '15px', borderRadius: '50px', textDecoration: 'none', display: 'block', fontWeight: '900', fontSize: '14px' };