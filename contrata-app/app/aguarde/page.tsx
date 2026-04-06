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

    // 1. DISPARA O E-MAIL DE VERIFICAÇÃO DO SUPABASE (AUTENTICAÇÃO)
    const { error: authError } = await supabase.auth.signUp({
      email: email,
      password: 'senha-provisoria-contrata-2026', 
    });

    if (authError) {
      alert("Aviso: " + authError.message);
    } else {
      // 2. SALVA TAMBÉM NA TABELA DE BACKUP (WAITLIST)
      await supabase.from('waitlist').insert([{ email }]);
      setEnviado(true);
    }

    setLoading(false);
  };

  return (
    <main style={containerStyle}>
      
      {/* COLUNA ESQUERDA - O VISUAL GIGANTE QUE O CLIENTE APROVOU */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          {/* LOGO GIGANTE */}
          <img src="/logo.png" alt="Logo Contrata" style={logoStyle} />

          {/* NOME DO SITE (COLADO NA LOGO) */}
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>

          {/* FRASE DE IMPACTO GIGANTE COM COMPLEMENTO */}
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL <br/>
            <span style={{color: '#1e293b', display: 'block', marginTop: '5px'}}>PARA VOCÊ E SUA EMPRESA</span>
          </h1>
          
          {/* SETA PESADA */}
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

          {/* FORMULÁRIO ROBUSTO SEM SCROLL */}
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
                {loading ? 'ENVIANDO...' : 'FAÇA SEU PRÉ CADASTRO'}
              </button>
            </form>
          ) : (
            <div style={successBox}>
              <p style={{fontWeight: '900', color: '#16a34a', fontSize: '24px', margin: 0}}>✓ SUCESSO!</p>
              <p style={{fontSize: '16px', color: '#475569', marginTop: '10px'}}>
                Enviamos um e-mail de confirmação. <br/> 
                Confira sua caixa de entrada!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA - IMAGEM DO ESCRITÓRIO */}
      <section style={rightSection}></section>

    </main>
  );
}

// --- ESTILIZAÇÃO COMPLETA (IGUAL AO QUE VOCÊ GOSTOU) ---

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
  padding: '15px', 
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
  height: 'auto',
  width: '100%',
  maxWidth: '750px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '35vh', // Logo gigante baseada na altura da tela
  maxHeight: '400px',
  width: 'auto',
  objectFit: 'contain',
  marginBottom: '5px' 
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: 'clamp(28px, 4.5vh, 52px)', 
  fontWeight: '900', 
  color: '#2563eb', 
  margin: '0 0 10px 0', 
  textTransform: 'uppercase',
  letterSpacing: '2px'
};

const titleStyle: React.CSSProperties = { 
  fontSize: 'clamp(18px, 3.2vh, 34px)',
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
  fontSize: '50px', 
  color: '#262626',
  fontWeight: 'bold',
  lineHeight: '1'
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '12px', 
  width: '100%',
  maxWidth: '400px' 
};

const inputStyle: React.CSSProperties = { 
  padding: '18px 25px', 
  borderRadius: '50px', 
  border: '2px solid #f1f5f9', 
  fontSize: '18px', 
  fontWeight: '600',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  outline: 'none',
  color: '#1e293b'
};

const btnStyle: React.CSSProperties = { 
  backgroundColor: '#262626', 
  color: 'white', 
  padding: '20px', 
  borderRadius: '50px', 
  border: 'none', 
  fontWeight: '900', 
  fontSize: '18px', 
  cursor: 'pointer', 
  textTransform: 'uppercase',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
};

const successBox: React.CSSProperties = { 
  padding: '30px', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '30px',
  border: '2px solid #b9f6ca', 
  maxWidth: '450px' 
};