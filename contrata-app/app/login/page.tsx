'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NOVO: Estado para o tipo de conta (Item 5 do documento)
  const [userType, setUserType] = useState('candidato');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Erro: Usuário ou senha inválidos");
      else router.push('/feed');
    } else {
      // ALTERADO: Cadastro enviando user_type nos metadados
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            user_type: userType,
            plano: 'free'
          }
        }
      });
      if (error) alert("Erro ao cadastrar: " + error.message);
      else alert("Sucesso! Verifique seu e-mail para confirmar o cadastro.");
    }
    setLoading(false);
  };

  return (
    <main style={backgroundStyle}>
      <div style={lightEffect1}></div>
      <div style={lightEffect2}></div>

      <div style={authCardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>
            {isLogin ? 'BEM-VINDO DE VOLTA' : 'CRIAR NOVA CONTA'}
          </h1>
          <p style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isLogin ? 'Acesse sua conta profissional' : 'Junte-se à elite de Ibitinga e região'}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* SÓ APARECE NO CADASTRO: Escolha de Tipo de Conta */}
          {!isLogin && (
            <div style={inputWrapperStyle}>
              <label style={labelStyle}>EU SOU:</label>
              <select 
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="candidato">Candidato (Procuro Emprego)</option>
                <option value="empresa">Empresa (Quero Contratar)</option>
              </select>
            </div>
          )}

          <div style={inputWrapperStyle}>
            <label style={labelStyle}>E-MAIL</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              style={inputStyle} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div style={inputWrapperStyle}>
            <label style={labelStyle}>SENHA</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={inputStyle} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" disabled={loading} style={btnSubmitStyle}>
            {loading ? 'PROCESSANDO...' : isLogin ? 'ENTRAR NA PLATAFORMA' : 'FINALIZAR CADASTRO'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', opacity: 0.6 }}>
            {isLogin ? 'Ainda não tem uma conta?' : 'Já possui cadastro?'}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={toggleButtonStyle}
          >
            {isLogin ? 'CRIAR CONTA GRATUITAMENTE' : 'FAZER LOGIN AGORA'}
          </button>
        </div>
      </div>

      <p style={footerNoteStyle}>© 2026 CONTRATA EMPREGOS - CONEXÕES REAIS</p>
    </main>
  );
}

// ESTILOS (Mantive os seus originais para não estragar o visual bonito)
const backgroundStyle: React.CSSProperties = { backgroundColor: '#061224', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' };
const lightEffect1: React.CSSProperties = { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', top: '-100px', left: '-100px', zIndex: 0 };
const lightEffect2: React.CSSProperties = { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', bottom: '-100px', right: '-100px', zIndex: 0 };
const authCardStyle: React.CSSProperties = { backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', padding: '50px 40px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.08)', width: '100%', maxWidth: '420px', zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const inputWrapperStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle: React.CSSProperties = { fontSize: '10px', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' };
const inputStyle: React.CSSProperties = { backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none', fontSize: '14px' };
const btnSubmitStyle: React.CSSProperties = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', marginTop: '10px', letterSpacing: '1px' };
const toggleButtonStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', marginTop: '5px', textDecoration: 'underline' };
const footerNoteStyle: React.CSSProperties = { position: 'absolute', bottom: '30px', fontSize: '9px', fontWeight: 'bold', opacity: 0.2, letterSpacing: '2px' };