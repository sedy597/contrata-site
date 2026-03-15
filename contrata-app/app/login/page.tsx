// @ts-nocheck
'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('candidato');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Suporte a modo escuro local
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Erro: Usuário ou senha inválidos");
      else router.push('/feed');
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          data: { user_type: userType, plano: 'free' }
        }
      });
      if (error) alert("Erro ao cadastrar: " + error.message);
      else alert("Sucesso! Verifique seu e-mail.");
    }
    setLoading(false);
  };

  // TEMA DINÂMICO
  const theme = {
    bg: isDarkMode ? '#060b14' : '#ffffff',
    card: isDarkMode ? '#0f172a' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    subtext: isDarkMode ? '#94a3b8' : '#475569',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    inputBg: isDarkMode ? '#1e293b' : '#f1f5f9',
    accent: '#2563eb',
    lightBlue: '#93c5fd'
  };

  return (
    <main style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: theme.bg, color: theme.text, transition: '0.3s' }}>
      
      {/* LADO 1: FORMULÁRIO (BRANCO/ESCURO) */}
      <div style={{ flex: '1 1 50%', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: isDarkMode ? 'none' : `1px solid ${theme.border}` }}>
        
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <button onClick={() => setIsDarkMode(!isDarkMode)} style={themeToggleBtn}>
                {isDarkMode ? '🌙 DARK' : '☀️ LIGHT'}
             </button>
             <Link href="/" style={{ fontSize: '12px', fontWeight: '900', color: theme.accent, textDecoration: 'none' }}>VOLTAR À HOME</Link>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '10px' }}>
              {isLogin ? 'Login' : 'Cadastro'}
            </h2>
            <p style={{ color: theme.subtext, fontWeight: '500' }}>
              Acesse a <span style={{ color: theme.accent, fontWeight: '800' }}>CONTRATA EMPREGOS</span>
            </p>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {!isLogin && (
              <div>
                <label style={labelStyle(theme)}>TIPO DE PERFIL</label>
                <select 
                  value={userType} 
                  onChange={(e) => setUserType(e.target.value)} 
                  style={inputStyle(theme)}
                >
                  <option value="candidato">Candidato</option>
                  <option value="empresa">Empresa</option>
                </select>
              </div>
            )}

            <div>
              <label style={labelStyle(theme)}>E-MAIL</label>
              <input 
                type="email" 
                placeholder="nome@exemplo.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={inputStyle(theme)} 
              />
            </div>

            <div>
              <label style={labelStyle(theme)}>SENHA</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={inputStyle(theme)} 
              />
            </div>

            <button type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? 'CARREGANDO...' : isLogin ? 'ENTRAR AGORA' : 'CRIAR MINHA CONTA'}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <span style={{ color: theme.subtext, fontSize: '14px' }}>
               {isLogin ? 'Não tem uma conta?' : 'Já é cadastrado?'}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ background: 'none', border: 'none', color: theme.accent, fontWeight: '900', cursor: 'pointer', marginLeft: '8px', fontSize: '14px' }}
            >
              {isLogin ? 'Crie uma aqui' : 'Faça login'}
            </button>
          </div>
        </div>
      </div>

      {/* LADO 2: VISUAL (AZUL CORPORATIVO) */}
      <div style={{ flex: '1 1 50%', backgroundColor: '#0f172a', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '60px' }}>
        
        {/* Gráfico de Fundo Sutil */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '240px', width: 'auto', marginBottom: '40px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
          
          <h2 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1', marginBottom: '20px', letterSpacing: '-2px' }}>
            CONTRATA<br/>
            <span style={{ color: theme.lightBlue }}>EMPREGOS</span>
          </h2>
          
          <div style={{ width: '60px', height: '4px', backgroundColor: theme.accent, margin: '30px auto' }}></div>
          
          <p style={{ fontSize: '20px', fontWeight: '500', opacity: 0.8, maxWidth: '400px' }}>
            Conectando os melhores profissionais às empresas que mais crescem.
          </p>
        </div>

        {/* Rodapé Interno */}
        <div style={{ position: 'absolute', bottom: '40px', opacity: 0.4, fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' }}>
           IBITINGA - SP | BRASIL
        </div>
      </div>
    </main>
  );
}

// ESTILOS AUXILIARES
const labelStyle = (theme) => ({
  display: 'block',
  fontSize: '11px',
  fontWeight: '900',
  color: theme.subtext,
  marginBottom: '8px',
  letterSpacing: '1px',
  textTransform: 'uppercase'
});

const inputStyle = (theme) => ({
  width: '100%',
  padding: '16px',
  borderRadius: '8px',
  border: `1px solid ${theme.border}`,
  backgroundColor: theme.inputBg,
  color: theme.text,
  fontSize: '15px',
  fontWeight: '600',
  outline: 'none',
  transition: '0.2s',
  boxSizing: 'border-box'
});

const submitBtnStyle = {
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '20px',
  borderRadius: '8px',
  fontWeight: '900',
  fontSize: '14px',
  cursor: 'pointer',
  marginTop: '10px',
  letterSpacing: '1px',
  transition: '0.3s'
};

const themeToggleBtn = {
  backgroundColor: '#0f172a',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: '900',
  cursor: 'pointer'
};