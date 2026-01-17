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

  const logoPath = "/logo.png";

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Criar a conta no Supabase
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          user_type: userType,
          plano: 'free'
        }
      }
    });

    if (error) {
      alert("Erro: " + error.message);
      setLoading(false);
      return;
    }

    // 2. LOGICA DE ENTRADA AUTOMÁTICA
    // Se não houver erro e o usuário foi criado, fazemos o login imediato
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      // Se der erro no auto-login, manda para a página de login apenas por segurança
      router.push('/login');
    } else {
      // SUCESSO TOTAL: Vai direto para o Feed já logado!
      router.push('/feed');
    }
    
    setLoading(false);
  };

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', opacity: 0.4, pointerEvents: 'none' }}>
        <img 
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(60%)' }} 
          alt="Escritório" 
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6, 18, 36, 0.85)', zIndex: 1 }}></div>

      {/* HEADER */}
      <header style={{ width: '100%', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50, position: 'relative', backgroundColor: 'rgba(6, 18, 36, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/">
           <img src={logoPath} alt="Logo" style={{ height: '65px', width: 'auto', display: 'block' }} />
        </Link>
        
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={navButtonStyle}>Home</Link>
          <Link href="/login" style={{...navButtonStyle, marginLeft: '80px'}}>Login</Link>
          <Link href="/cadastro" style={{...navButtonStyle, backgroundColor: '#2563eb', fontWeight: '900', marginLeft: '80px'}}>Criar Conta</Link>
        </nav>
      </header>

      {/* CONTEÚDO CENTRAL */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, position: 'relative', padding: '40px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={logoPath} 
            alt="Logo Central" 
            style={{ height: '150px', width: 'auto', marginBottom: '20px', filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.4))' }} 
          />
          <h2 style={{ color: '#3b82f6', fontWeight: '900', letterSpacing: '6px', fontSize: '18px', textTransform: 'uppercase' }}>CADASTRE-SE GRÁTIS</h2>
        </div>

        <form 
          onSubmit={handleCadastro} 
          style={formCardStyle}
        >
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '30px', letterSpacing: '-1px' }}>Criar Conta</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={labelStyle}>EU SOU:</label>
              <select 
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="candidato">Candidato (Procuro Emprego)</option>
                <option value="empresa">Empresa (Quero Contratar)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={labelStyle}>E-MAIL</label>
              <input 
                type="email" 
                placeholder="SEU MELHOR E-MAIL" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={labelStyle}>SENHA</label>
              <input 
                type="password" 
                placeholder="CRIE UMA SENHA" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle} 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={submitButtonStyle}
            >
              {loading ? 'CRIANDO CONTA...' : 'FINALIZAR E ENTRAR'}
            </button>
          </div>

          <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Já possui uma conta? 
            <Link href="/login" style={{ color: '#3b82f6', marginLeft: '8px', textDecoration: 'none', borderBottom: '1px solid #3b82f6' }}>
              FAZER LOGIN
            </Link>
          </p>
        </form>
      </section>

      <footer style={{ width: '100%', padding: '30px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>© 2026 Contrata Empregos.</p>
      </footer>
    </main>
  );
}

// Estilos mantidos conforme o seu original
const navButtonStyle: React.CSSProperties = { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '12px 30px', borderRadius: '50px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '2px' };
const formCardStyle: React.CSSProperties = { width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' };
const labelStyle: React.CSSProperties = { fontSize: '10px', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' };
const inputStyle: React.CSSProperties = { backgroundColor: '#ffffff', color: '#000000', padding: '15px 20px', borderRadius: '15px', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 'bold' };
const submitButtonStyle: React.CSSProperties = { backgroundColor: '#2563eb', color: '#ffffff', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 20px rgba(37,99,235,0.3)' };