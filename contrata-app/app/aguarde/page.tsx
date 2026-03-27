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
      alert("Erro ao cadastrar. Tente novamente!");
    }
    setLoading(false);
  };

  return (
    <main style={containerStyle}>
      {/* COLUNA ESQUERDA - ONDE TUDO É GIGANTE */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          <img src="/logo.png" alt="Logo" style={logoStyle} />
          
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL
          </h1>
          
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>
          
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

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
                {loading ? '...' : 'FAÇA SEU PRÉ CADASTRO'}
              </button>
            </form>
          ) : (
            <div style={successBox}>
              <p style={{fontWeight: '900', color: '#16a34a', fontSize: '30px'}}>✓ REALIZADO!</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA - IMAGEM LATERAL PRESERVADA */}
      <section style={rightSection}></section>
    </main>
  );
}

const containerStyle: React.CSSProperties = { 
  display: 'flex', 
  minHeight: '100vh', 
  width: '100%', 
  backgroundColor: '#fff', 
  fontFamily: 'sans-serif',
  overflowX: 'hidden' // Evita scroll lateral se a logo for larga demais
};

const leftSection: React.CSSProperties = { 
  flex: '1.8', // Espaço maior para o conteúdo gigante
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: '40px',
  zIndex: 2 // Garante que o conteúdo fique visível
};

const rightSection: React.CSSProperties = { 
  flex: '1', 
  backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000")', 
  backgroundSize: 'cover', 
  backgroundPosition: 'center',
  display: 'block',
  minWidth: '30%' // Garante que a imagem nunca suma da tela
};

const contentWrapper: React.CSSProperties = { 
  maxWidth: '90% text-align: center',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '400px', // LOGO 400PX
  maxWidth: '100%', // Não deixa ela vazar da metade da tela
  width: 'auto',
  marginBottom: '30px', 
  objectFit: 'contain' 
};

const titleStyle: React.CSSProperties = { 
  fontSize: '40px', 
  fontWeight: '900', 
  color: '#262626', 
  lineHeight: '1.1', 
  marginBottom: '15px', 
  textAlign: 'center'
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: '60px', // MARCA > 50PX
  fontWeight: '900', 
  color: '#2563eb', 
  marginBottom: '30px', 
  textAlign: 'center'
};

const arrowWrapper: React.CSSProperties = { marginBottom: '30px' };

const arrowIcon: React.CSSProperties = { fontSize: '70px', color: '#262626' };

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '20px', 
  width: '100%',
  maxWidth: '650px' 
};

const inputStyle: React.CSSProperties = { 
  height: '100px', // INPUT 100PX
  padding: '0 30px', 
  borderRadius: '50px', 
  border: '3px solid #f1f5f9', 
  fontSize: '24px', 
  fontWeight: '600', 
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  width: '100%'
};

const btnStyle: React.CSSProperties = { 
  height: '100px', // BOTÃO 100PX
  backgroundColor: '#262626', 
  color: 'white', 
  borderRadius: '50px', 
  border: 'none', 
  fontWeight: '900', 
  fontSize: '24px', 
  cursor: 'pointer', 
  textTransform: 'uppercase',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  width: '100%'
};

const successBox: React.CSSProperties = { 
  padding: '40px', 
  textAlign: 'center', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '30px',
  width: '100%'
};