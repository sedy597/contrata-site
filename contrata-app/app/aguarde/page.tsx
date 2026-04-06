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
      
      {/* COLUNA ESQUERDA - CONTEÚDO (GIGANTE) */}
      <section style={leftSection}>
        <div style={contentWrapper}>
          
          {/* 1. LOGO GIGANTE */}
          <div style={{ marginBottom: '30px' }}>
            <img src="/logo.png" alt="Logo Contrata" style={logoStyle} />
          </div>

          {/* 2. NOME DO SITE (GIGANTE E AZUL) */}
          <h2 style={brandNameStyle}>CONTRATA EMPREGOS</h2>

          {/* 3. FRASE ATUALIZADA (GIGANTE) */}
          <h1 style={titleStyle}>
            FAÇA PARTE DA MAIOR PLATAFORMA DE EMPREGOS DO BRASIL <br/>
            <span style={{color: '#333'}}>PARA VOCÊ E SUA EMPRESA</span>
          </h1>
          
          {/* 4. ÍCONE DE SETA (PESADO) */}
          <div style={arrowWrapper}>
             <span style={arrowIcon}>︾</span>
          </div>

          {/* 5. FORMULÁRIO (GIGANTE) */}
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
              <p style={{fontWeight: '900', color: '#16a34a', margin: 0, fontSize: '18px'}}>✓ PRÉ-CADASTRO REALIZADO!</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA - IMAGEM (ESCRITÓRIO/POST-ITS) */}
      <section style={rightSection}></section>

    </main>
  );
}

// ESTILIZAÇÃO GIGANTE E IMPACTANTE (Fiel ao design original)
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
  justifyContent: 'center', // Centraliza verticalmente
  alignItems: 'center', 
  padding: '0 8%', 
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
  maxWidth: '600px', 
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
};

const logoStyle: React.CSSProperties = { 
  height: '110px', // Logo Gigante
  objectFit: 'contain' 
};

const brandNameStyle: React.CSSProperties = { 
  fontSize: '32px', // Nome Gigante
  fontWeight: '900', 
  color: '#2563eb', // Azul padrão
  marginBottom: '35px',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const titleStyle: React.CSSProperties = { 
  fontSize: '32px', // Frase Gigante
  fontWeight: '800', 
  color: '#262626', 
  lineHeight: '1.2', 
  marginBottom: '40px',
  textTransform: 'uppercase'
};

const arrowWrapper: React.CSSProperties = { 
  marginBottom: '40px' 
};

const arrowIcon: React.CSSProperties = { 
  fontSize: '50px', // Seta Pesada
  color: '#262626',
  fontWeight: 'bold'
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '15px', 
  width: '350px' // Formulário Largo
};

const inputStyle: React.CSSProperties = { 
  padding: '18px 25px', 
  borderRadius: '50px', 
  border: '1.5px solid #f1f5f9', 
  fontSize: '16px', 
  fontWeight: '600',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  color: '#1e293b'
};

const btnStyle: React.CSSProperties = { 
  backgroundColor: '#262626', // Preto arredondado
  color: 'white', 
  padding: '20px', 
  borderRadius: '50px', 
  border: 'none', 
  fontWeight: '900', 
  fontSize: '15px', 
  cursor: 'pointer', 
  textTransform: 'uppercase',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  transition: '0.3s transform'
};

const successBox: React.CSSProperties = { 
  width: '100%',
  maxWidth: '350px',
  padding: '25px', 
  textAlign: 'center', 
  backgroundColor: '#f0fdf4', 
  borderRadius: '25px',
  border: '1px solid #b9f6ca' 
};