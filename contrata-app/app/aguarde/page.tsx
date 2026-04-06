 // @ts-nocheck
'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AguardePage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const salvarFila = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('waitlist').insert([{ email }]);
    if (!error) {
      setEnviado(true);
    } else {
      alert("Houve um erro ou este e-mail já está na fila.");
    }
    setLoading(false);
  };

  return (
    <main style={containerStyle}>
      
      {/* COLUNA ESQUERDA - CONTEÚDO COMPRIMIDO */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          {/* 1. LOGO GIGANTE MAS LIMITADA À TELA */}
          <img src="/logo.png" alt="Logo Contrata" style={logoStyle} />

          {/* 2. NOME DO SITE (BEM PRÓXIMO) */}
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>

          {/* 3. FRASE DE IMPACTO */}
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL <br/>
            <span style={{color: '#1e293b'}}>PARA VOCÊ E SUA EMPRESA</span>
          </h1>
          
          {/* 4. SETA (REDUZIDA PARA CABER) */}
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

          {/* 5. FORMULÁRIO */}
          {!enviado ? (
            <form onSubmit={salvarFila} style={formStyle}>
              <input 
                type="email" 
                placeholder="Digite seu melhor e-mail" 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'PROCESSANDO...' : 'FAÇA SEU PRÉ CADASTRO'}
              </button>
            </form>
          ) : (
            <div style={successBox}>
              <p style={{fontWeight: '900', color: '#16a34a', fontSize: '20px'}}>✓ PRÉ-CADASTRO REALIZADO!</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA - IMAGEM */}
      <section style={rightSection}></section>

    </main>
  );
}

// ESTILIZAÇÃO SEM SCROLL (VIEWPORT FOCUSED)
const containerStyle: React.CSSProperties = { 
  display: 'flex', 
  height: '100vh', 
  width: '100%', 
  backgroundColor: '#ffffff', 
  fontFamily: 'sans-serif',
  overflow: 'hidden' 
};

const leftSection: React.CSSProperties = { 
  flex: '1', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: '20px', 
  backgroundColor: '#fff'
};

const rightSection: React.CSSProperties = { 
  flex: '1', 
  backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000")',
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  display: 'block' 
};

const contentWrapper: React.CSSProperties = { 
  height: '95%', // Ocupa quase toda a altura mas com folga
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '35vh', // Altura relativa: 35% da altura da tela
  maxHeight: '400px',
  width: 'auto',
  objectFit: 'contain',
  marginBottom: '5px' // Super próximo do nome
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: 'clamp(24px, 4vh, 48px)', // Fonte que se ajusta ao tamanho da tela
  fontWeight: '900', 
  color: '#2563eb', 
  margin: '0 0 15px 0', // Margin mínima
  textTransform: 'uppercase',
  letterSpacing: '2px'
};

const titleStyle: React.CSSProperties = { 
  fontSize: 'clamp(18px, 3vh, 32px)',
  fontWeight: '800', 
  color: '#262626', 
  lineHeight: '1.1', 
  margin: '0 0 15px 0',
  textTransform: 'uppercase'
};

const arrowWrapper: React.CSSProperties = { 
  margin: '0 0 15px 0' 
};

const arrowIcon: React.CSSProperties = { 
  fontSize: '40px', 
  color: '#262626',
  fontWeight: 'bold',
  lineHeight: '1'
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '10px', 
  width: '100%',
  maxWidth: '400px' 
};

const inputStyle: React.CSSProperties = { 
  padding: '15px 25px', 
  borderRadius: '50px', 
  border: '2px solid #f1f5f9', 
  fontSize: '16px', 
  fontWeight: '600',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  outline: 'none'
};

const btnStyle: React.CSSProperties = { 
  backgroundColor: '#262626', 
  color: 'white', 
  padding: '18px', 
  borderRadius: '50px', 
  border: 'none', 
  fontWeight: '900', 
  fontSize: '16px', 
  cursor: 'pointer', 
  textTransform: 'uppercase',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
};

const successBox: React.CSSProperties = { 
  padding: '20px', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '30px',
  border: '2px solid #b9f6ca' 
};