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
      
      {/* COLUNA ESQUERDA - CONTEÚDO */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          {/* 1. LOGO */}
          <img src="/logo.png" alt="Logo Contrata" style={logoStyle} />
          
          {/* 2. NOME DO SITE (ABAIXO DA LOGO) */}
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>

          {/* 3. FRASE ATUALIZADA (ABAIXO DO NOME) */}
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL <br/>
            <span style={{fontSize: '20px', opacity: 0.9}}>PARA VOCÊ E SUA EMPRESA</span>
          </h1>
          
          {/* 4. SETA */}
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

          {/* 5. FORMULÁRIO */}
          {!enviado ? (
            <form onSubmit={salvarFila} style={formStyle}>
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
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
              <p style={{fontWeight: '900', color: '#16a34a', margin: 0}}>✓ PRÉ-CADASTRO REALIZADO!</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA - IMAGEM (ESCRITÓRIO/POST-ITS) */}
      <section style={rightSection}></section>

    </main>
  );
}

// ESTILOS AJUSTADOS PARA A NOVA ORDEM
const containerStyle: React.CSSProperties = { 
  display: 'flex', 
  minHeight: '100vh', 
  width: '100%', 
  backgroundColor: '#fff', 
  fontFamily: 'sans-serif',
  overflow: 'hidden' 
};

const leftSection: React.CSSProperties = { 
  flex: '1', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: '40px',
  backgroundColor: '#fff' 
};

const rightSection: React.CSSProperties = { 
  flex: '1.2', 
  backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000")',
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  display: 'block' 
};

const contentWrapper: React.CSSProperties = { 
  maxWidth: '550px', 
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '80px', 
  marginBottom: '15px', 
  objectFit: 'contain' 
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: '28px', 
  fontWeight: '900', 
  color: '#2563eb', // Azul padrão
  marginBottom: '25px',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const titleStyle: React.CSSProperties = { 
  fontSize: '22px', 
  fontWeight: '800', 
  color: '#262626', 
  lineHeight: '1.4', 
  marginBottom: '30px',
  textTransform: 'uppercase'
};

const arrowWrapper: React.CSSProperties = { 
  marginBottom: '30px' 
};

const arrowIcon: React.CSSProperties = { 
  fontSize: '32px', 
  color: '#333',
  opacity: 0.5
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '12px', 
  width: '100%',
  maxWidth: '350px' 
};

const inputStyle: React.CSSProperties = { 
  padding: '16px 20px', 
  borderRadius: '50px', 
  border: '1.5px solid #f1f5f9', 
  fontSize: '15px', 
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
  fontSize: '14px', 
  cursor: 'pointer', 
  textTransform: 'uppercase',
  transition: '0.3s'
};

const successBox: React.CSSProperties = { 
  width: '100%',
  maxWidth: '350px',
  padding: '20px', 
  textAlign: 'center', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '20px' 
};