// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function VagasPage() {
  const [busca, setBusca] = useState('');
  const [vagas, setVagas] = useState([]);
  const [vagasSalvas, setVagasSalvas] = useState([]);
  const [sugestoesInput, setSugestoesInput] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [mostrarModalPlanos, setMostrarModalPlanos] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('todas'); 
  const [planoAtivo, setPlanoAtivo] = useState('gratuito'); 

  // Lista para o Autocomplete ser sempre rico
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
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px' }}>
      
      {/* ABAS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
        <button onClick={() => setAbaAtiva('todas')} style={abaAtiva === 'todas' ? tabAtiva : tabInativa}>Todas as Vagas</button>
        <button onClick={() => setAbaAtiva('salvas')} style={abaAtiva === 'salvas' ? tabAtiva : tabInativa}>⭐ Salvas ({vagasSalvas.length})</button>
      </div>

      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '900' }}>Vagas em Ibitinga</h1>
        
        {/* BARRA DE BUSCA COM AUTOCOMPLETE */}
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

      {/* GRID DE VAGAS */}
      <div style={vagasGrid}>
        {exibirVagas.map((vaga) => (
          <div key={vaga.id} style={cardVagaStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={empresaTag}>{vaga.empresa_nome}</span>
              <button onClick={() => toggleSalvar(vaga.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
                {vagasSalvas.includes(vaga.id) ? '⭐' : '☆'}
              </button>
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '5px' }}>{vaga.titulo_vaga}</h3>
            <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>{vaga.salario || 'Salário a combinar'}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href={`/candidatar/${vaga.id}`} style={btnCandidatarPrincipal}>
                {planoAtivo === 'pro' ? '⚡ CANDIDATURA PRIORITÁRIA' : 'CANDIDATAR-SE'}
              </Link>
              <button onClick={() => setMostrarModalPlanos(true)} style={btnAcompanhar}>
                {planoAtivo === 'pro' ? '📊 STATUS EM TEMPO REAL' : '🔒 ACOMPANHAR'}
              </button>
            </div>

            {planoAtivo === 'gratuito' && (
              <p style={{ fontSize: '10px', opacity: 0.4, marginTop: '15px', textAlign: 'center' }}>
                Assinantes PRO aparecem no topo desta vaga.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MODAL PLANOS */}
      {mostrarModalPlanos && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ fontSize: '50px' }}>🚀</div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '15px 0' }}>Seja um Candidato PRO</h2>
            <p style={{ opacity: 0.7, marginBottom: '25px', fontSize: '14px' }}>Acompanhe o status da sua vaga em tempo real e fique no topo da lista das empresas.</p>
            <Link href="/planos" style={btnProStyle}>VER PLANOS (R$ 10)</Link>
            <button onClick={() => setMostrarModalPlanos(false)} style={{ background: 'none', border: 'none', color: 'white', marginTop: '20px', cursor: 'pointer', opacity: 0.5 }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ESTILOS
const searchBarContainer = { display: 'flex', backgroundColor: 'white', borderRadius: '50px', padding: '5px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' };
const searchInputStyle = { flex: 1, border: 'none', outline: 'none', padding: '0 25px', color: 'black', fontSize: '16px' };
const btnBuscaStyle = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' };
const autocompleteBox = { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '15px', marginTop: '10px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 100 };
const autocompleteItem = { padding: '15px 25px', color: '#333', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: '600' };
const tabAtiva = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' };
const tabInativa = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', cursor: 'pointer' };
const vagasGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', maxWidth: '1100px', margin: '0 auto' };
const cardVagaStyle = { backgroundColor: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' };
const empresaTag = { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '10px', fontWeight: '900', padding: '5px 12px', borderRadius: '8px' };
const btnCandidatarPrincipal = { backgroundColor: '#2563eb', color: 'white', textAlign: 'center', padding: '14px', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '13px' };
const btnAcompanhar = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 };
const modalContent = { backgroundColor: '#061224', border: '1px solid #3b82f6', padding: '40px', borderRadius: '30px', textAlign: 'center', maxWidth: '400px' };
const btnProStyle = { backgroundColor: '#2563eb', color: 'white', padding: '15px', borderRadius: '50px', textDecoration: 'none', display: 'block', fontWeight: '900' };