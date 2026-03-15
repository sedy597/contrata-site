// @ts-nocheck
'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CadastroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('candidato'); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { user_type: userType, plano: 'free' } }
    });

    if (error) {
      alert("Erro: " + error.message);
      setLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) { router.push('/login'); } 
    else { router.push('/feed'); }
    setLoading(false);
  };

  return (
    <main style={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      
      {/* LADO ESQUERDO: PAINEL DE IDENTIDADE (FIXO 50%) */}
      <div style={{ flex: '1', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', color: 'white', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '40px', left: '40px' }}>
             <Link href="/"><img src="/logo.png" alt="Logo" style={{ height: '40px' }} /></Link>
        </div>
        
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <img 
            src="/logo.png" 
            alt="Logo Gigante" 
            style={{ height: '220px', width: 'auto', marginBottom: '40px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} 
          />
          <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1', marginBottom: '20px' }}>
            CONTRATA<br/><span style={{ color: '#3b82f6' }}>EMPREGOS</span>
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '380px', margin: '0 auto', fontWeight: '500' }}>
            A maior vitrine de talentos e oportunidades de Ibitinga e região.
          </p>
        </div>
        
        {/* Detalhe de design no fundo */}
        <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '4px', background: 'linear-gradient(90deg, #3b82f6, #0f172a)' }}></div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO SOBREPOSTO A IMAGEM (FIXO 50%) */}
      <div style={{ flex: '1', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Imagem de Fundo Full */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80" 
            alt="Escritório" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(3px)' }}></div>
        </div>

        {/* Card do Formulário com Geometria Perfeita */}
        <div style={{ zIndex: 10, width: '100%', maxWidth: '440px', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '50px 45px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '1px solid #f1f5f9' }}>
            
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ color: '#0f172a', fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Começar agora</h2>
              <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Crie sua conta gratuita em segundos.</p>
            </div>

            <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>TIPO DE PERFIL</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} style={inputStyle} required>
                  <option value="candidato">Sou Candidato (Procuro Emprego)</option>
                  <option value="empresa">Sou Empresa (Quero Contratar)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>E-MAIL</label>
                <input type="email" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>SENHA</label>
                <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
              </div>

              <button type="submit" disabled={loading} style={btnSubmitStyle}>
                {loading ? 'CRIANDO CONTA...' : 'FINALIZAR CADASTRO'}
              </button>
            </form>

            <div style={{ marginTop: '35px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '25px' }}>
              <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                Já tem uma conta? 
                <Link href="/login" style={{ color: '#2563eb', fontWeight: '800', marginLeft: '8px', textDecoration: 'none' }}>Fazer Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ESTILOS DE PRECISÃO
const labelStyle: React.CSSProperties = { 
  display: 'block',
  fontSize: '11px', 
  fontWeight: '900', 
  color: '#94a3b8', 
  marginBottom: '8px', 
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const inputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '16px 20px', 
  borderRadius: '14px', 
  border: '2px solid #f1f5f9', 
  fontSize: '15px', 
  fontWeight: '600',
  color: '#0f172a',
  outline: 'none',
  backgroundColor: '#f8fafc',
  transition: '0.2s'
};

const btnSubmitStyle: React.CSSProperties = { 
  width: '100%', 
  backgroundColor: '#2563eb', 
  color: 'white', 
  padding: '18px', 
  borderRadius: '14px', 
  fontWeight: '900', 
  fontSize: '15px', 
  border: 'none', 
  cursor: 'pointer', 
  marginTop: '10px',
  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
};