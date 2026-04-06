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
      
      {/* COLUNA ESQUERDA - CONTEÚDO MONUMENTAL */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          {/* 1. LOGO ULTRA GIGANTE (4X MAIOR) */}
          <div style={{ marginBottom: '10px' }}>
            <img src="/logo.png" alt="Logo Contrata" style={logoStyle} />
          </div>

          {/* 2. NOME DO SITE GIGANTE */}
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>

          {/* 3. FRASE DE IMPACTO */}
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL <br/>
            <span style={{color: '#1e293b', display: 'block', marginTop: '15px'}}>PARA VOCÊ E SUA EMPRESA</span>
          </h1>
          
          {/* 4. SETA PESADA */}
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

          {/* 5. FORMULÁRIO ROBUSTO */}
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
              <p style={{fontWeight: '900', color: '#16a34a', fontSize: '24px'}}>✓ PRÉ-CADASTRO REALIZADO!</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA - IMAGEM */}
      <section style={rightSection}></section>

    </main>
  );
}

// ESTILIZAÇÃO COM LOGO EM ESCALA 4X (720px de altura)
const containerStyle: React.CSSProperties = { 
  display: 'flex', 
  minHeight: '100vh', 
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
  padding: '50px 5%', 
  backgroundColor: '#fff',
  overflowY: 'auto' // Permite scroll caso a logo fique maior que a tela em monitores pequenos
};

const rightSection: React.CSSProperties = { 
  flex: '1', 
  backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000")',
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  display: 'block' 
};

const contentWrapper: React.CSSProperties = { 
  maxWidth: '900px', 
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '720px', // LOGO 4X MAIOR (Era 180px, agora 720px)
  maxWidth: '100%',
  width: 'auto',
  objectFit: 'contain' 
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: '52px', // Aumentado para acompanhar a logo
  fontWeight: '900', 
  color: '#2563eb', 
  marginBottom: '30px',
  textTransform: 'uppercase',
  letterSpacing: '3px'
};

const titleStyle: React.CSSProperties = { 
  fontSize: '38px', 
  fontWeight: '800', 
  color: '#262626', 
  lineHeight: '1.1', 
  marginBottom: '50px',
  textTransform: 'uppercase'
};

const arrowWrapper: React.CSSProperties = { 
  marginBottom: '50px' 
};

const arrowIcon: React.CSSProperties = { 
  fontSize: '70px', 
  color: '#262626',
  fontWeight: 'bold'
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '20px', 
  width: '450px' 
};

const inputStyle: React.CSSProperties = { 
  padding: '25px 30px', 
  borderRadius: '80px', 
  border: '2px solid #f1f5f9', 
  fontSize: '20px', 
  fontWeight: '600',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  color: '#1e293b',
  outline: 'none'
};

const btnStyle: React.CSSProperties = { 
  backgroundColor: '#262626', 
  color: 'white', 
  padding: '28px', 
  borderRadius: '80px', 
  border: 'none', 
  fontWeight: '900', 
  fontSize: '20px', 
  cursor: 'pointer', 
  textTransform: 'uppercase',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  transition: '0.3s transform'
};

const successBox: React.CSSProperties = { 
  width: '100%',
  maxWidth: '450px',
  padding: '40px', 
  textAlign: 'center', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '40px',
  border: '3px solid #b9f6ca' 
};