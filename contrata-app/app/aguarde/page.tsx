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
      alert("Houve um erro ou este e-mail já está na fila. Tente novamente!");
    }
    setLoading(false);
  };

  return (
    <main style={containerStyle}>
      
      {/* COLUNA ESQUERDA - TEXTOS E FORMULÁRIO */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          <img src="/logo.png" alt="Logo Contrata" style={logoStyle} />
          
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL PARA VOCÊ E SUA EMPRESA
          </h1>
          
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>
          
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

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
              <p style={{fontWeight: '900', color: '#16a34a', margin: 0}}>✓ PRÉ-CADASTRO REALIZADO!</p>
              <p style={{fontSize: '12px', color: '#64748b', marginTop: '5px'}}>Avisaremos você em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA */}
      <section style={rightSection}></section>

    </main>
  );
}

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
  alignItems: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '140px', // AUMENTADO PARA 140PX
  marginBottom: '40px', 
  objectFit: 'contain' 
};

const titleStyle: React.CSSProperties = { 
  fontSize: '28px', // AUMENTADO
  fontWeight: '800', 
  color: '#262626', 
  lineHeight: '1.2', 
  marginBottom: '15px', 
  textAlign: 'center'
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: '24px', 
  fontWeight: '900', 
  color: '#2563eb', 
  marginBottom: '30px', 
  textAlign: 'center'
};

const arrowWrapper: React.CSSProperties = { 
  textAlign: 'center', 
  marginBottom: '30px' 
};

const arrowIcon: React.CSSProperties = { 
  fontSize: '40px', 
  color: '#262626', 
  fontWeight: '100'
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '15px', 
  width: '400px', // AUMENTADO
  maxWidth: '100%' 
};

const inputStyle: React.CSSProperties = { 
  padding: '20px', // AUMENTADO
  borderRadius: '50px', 
  border: '1.5px solid #f1f5f9', 
  fontSize: '16px', 
  fontWeight: '600', 
  outline: 'none', 
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  color: '#1e293b'
};

const btnStyle: React.CSSProperties = { 
  backgroundColor: '#262626', 
  color: 'white', 
  padding: '22px 30px', // AUMENTADO
  borderRadius: '50px', 
  border: 'none', 
  fontWeight: '900', 
  fontSize: '16px', // AUMENTADO
  cursor: 'pointer', 
  textTransform: 'uppercase',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
};

const successBox: React.CSSProperties = { 
  width: '400px', 
  padding: '20px', 
  textAlign: 'center', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '20px', 
  border: '1px solid #b9f6ca' 
};