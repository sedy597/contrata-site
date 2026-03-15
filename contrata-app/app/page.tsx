// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase'; // Ajustado para o caminho correto
import { ComponenteVagas } from './components/ComponenteVagas';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAnunciarVaga = () => {
    if (session) {
      router.push('/empresa/painel');
    } else {
      router.push('/cadastro');
    }
  };

  if (loading) return null;

  const theme = {
    bg: isDarkMode ? '#061224' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#0f172a',
    subtext: isDarkMode ? '#94a3b8' : '#475569',
    card: isDarkMode ? '#0b1e3b' : '#ffffff',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    nav: isDarkMode ? '#061224' : '#ffffff',
    accent: '#2563eb', 
  };

  const areasData = [
    { nome: 'Primeiro Emprego', icone: '🚀', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80' },
    { nome: 'Administrativo', icone: '🏢', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80' },
    { nome: 'Vendas', icone: '🤝', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=400&q=80' },
    { nome: 'Jurídico', icone: '⚖️', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80' },
    { nome: 'Financeiro', icone: '💰', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' },
    { nome: 'Produção', icone: '⚙️', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80' }
  ];

  // ==========================================
  // 1. DASHBOARD PREMIUM (USUÁRIO LOGADO)
  // ==========================================
  if (session) {
    const userEmail = session.user.email?.split('@')[0];
    return (
      <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ backgroundColor: '#0f172a', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', cursor: 'pointer' }} onClick={() => router.push('/')} />
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button onClick={handleAnunciarVaga} style={btnNavOn}>Anunciar Vaga</button>
            <button onClick={() => router.push('/feed')} style={btnNavOn}>Ver Vagas</button>
            <div style={avatarCircleOn}>{userEmail[0].toUpperCase()}</div>
          </div>
        </nav>

        <section style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={welcomeBannerBig}>
            <div style={{ zIndex: 2, position: 'relative' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px', color: 'white' }}>Olá, {userEmail}! 👋</h1>
              <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '500px', color: 'white' }}>Temos novas oportunidades esperando por você hoje na <b>CONTRATA EMPREGOS</b>.</p>
              <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                <button onClick={() => router.push('/feed')} style={btnDashAction}>VER VAGAS AGORA</button>
                <button onClick={handleAnunciarVaga} style={{...btnDashAction, backgroundColor: '#fbbf24', color: '#0f172a'}}>POSTAR NOVA VAGA</button>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" style={imgBannerOverlay} />
          </div>

          <div style={gridDash}>
            <div style={cardDashAction} onClick={() => router.push('/perfil')}>
              <div style={iconBox}>👤</div>
              <h3 style={cardTitle}>Meu Currículo</h3>
              <p style={cardDesc}>Mantenha seus dados atualizados.</p>
            </div>
            <div style={cardDashAction} onClick={() => router.push('/feed')}>
              <div style={iconBox}>📂</div>
              <h3 style={cardTitle}>Candidaturas</h3>
              <p style={cardDesc}>Vagas que você aplicou.</p>
            </div>
            <div style={cardDashAction} onClick={() => router.push('/planos')}>
              <div style={iconBox}>💎</div>
              <h3 style={cardTitle}>Membro Premium</h3>
              <p style={cardDesc}>Destaque seu perfil no topo.</p>
            </div>
          </div>

          <div style={{marginTop: '60px'}}>
             <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '25px' }}>Vagas Recomendadas</h2>
             <ComponenteVagas limit={4} />
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // 2. HOME OFFLINE (DESIGN PREMIUM COMPLETO)
  // ==========================================
  return (
    <main style={{ backgroundColor: theme.bg, minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.nav, borderBottom: `1px solid ${theme.border}`, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', cursor: 'pointer' }} onClick={() => router.push('/')} />
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={btnTheme}>{isDarkMode ? '☀️ Claro' : '🌙 Escuro'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => router.push('/login')} style={{...btnSimple, color: theme.text}}>Entrar</button>
          <button onClick={handleAnunciarVaga} style={btnOutlineNav}>Anunciar Vaga</button>
          <button onClick={() => router.push('/cadastro')} style={btnAccentNav}>Cadastrar CV grátis</button>
        </div>
      </nav>

      <div style={{ flex: 1, width: '100%', animation: 'fadeIn 0.6s ease' }}>
        
        {/* HERO SECTION - LOGO GIGANTE + MULHER CORPORATIVA */}
        <section style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)', padding: '100px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
            <div style={{ flex: '1 1 600px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '220px', marginBottom: '20px', filter: 'drop-shadow(0 15px 25px rgba(255,255,255,0.3))' }} />
              <h1 style={{ color: '#ffffff', fontSize: '42px', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-1px' }}>
                A maior plataforma de empregos do Brasil é a <br/>
                <span style={{color: '#93c5fd', fontSize: '56px', textTransform: 'uppercase'}}>Contrata Empregos</span>
              </h1>
              <div style={searchBoxHero}>
                <input type="text" placeholder="Qual vaga você busca?" style={inputHero} />
                <button onClick={() => router.push('/cadastro')} style={btnHero}>BUSCAR AGORA</button>
              </div>
            </div>
            <div style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" alt="Profissional" style={{ maxWidth: '100%', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
        </section>

        {/* ÁREAS COM FOTOS ESCURECIDAS */}
        <section style={{ padding: '80px 20px', backgroundColor: theme.bg }}>
          <h2 style={{ textAlign: 'center', color: theme.text, marginBottom: '50px', fontSize: '32px', fontWeight: '900' }}>Ache um emprego na sua área</h2>
          <div style={gridAreasVisual}>
            {areasData.map(area => (
              <div key={area.nome} style={{...cardVisualArea, backgroundImage: `url(${area.img})`}}>
                <div style={cardOverlay}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>{area.icone}</div>
                  <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>{area.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3 PASSOS */}
        <section style={{ padding: '80px 20px', backgroundColor: isDarkMode ? '#081a36' : '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px' }}>
            <div style={{ flex: '1 1 400px' }}>
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Passos" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} />
            </div>
            <div style={{ flex: '1 1 500px' }}>
              <h2 style={{ color: theme.text, fontSize: '38px', fontWeight: '900', marginBottom: '40px', lineHeight: '1.2' }}>3 passos rumo à sua entrevista</h2>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}><div style={iconCircle}>1</div><div><h3 style={{color: theme.text, fontSize: '22px'}}>Crie sua conta</h3><p style={{color: theme.subtext}}>Grátis e em menos de 3 minutos.</p></div></div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}><div style={iconCircle}>2</div><div><h3 style={{color: theme.text, fontSize: '22px'}}>Hora do CV</h3><p style={{color: theme.subtext}}>Apareça para as empresas da região.</p></div></div>
              <div style={{ display: 'flex', gap: '20px' }}><div style={iconCircle}>3</div><div><h3 style={{color: theme.text, fontSize: '22px'}}>Aplique</h3><p style={{color: theme.subtext}}>Conquiste sua vaga de emprego.</p></div></div>
            </div>
          </div>
        </section>
      </div>

      <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{fontWeight: '900', fontSize: '18px'}}>CONTRATA EMPREGOS BRASIL © 2026</p>
      </footer>
    </main>
  );
}

// ESTILOS GERAIS
const gridAreasVisual = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' };
const cardVisualArea = { position: 'relative', height: '160px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', textAlign: 'center' };
const cardOverlay = { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 };
const iconCircle = { width: '50px', height: '50px', backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', flexShrink: 0 };
const searchBoxHero = { backgroundColor: 'white', borderRadius: '100px', padding: '8px', display: 'flex', width: '100%', maxWidth: '700px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const inputHero = { flex: 1, border: 'none', padding: '0 25px', outline: 'none', fontSize: '16px', borderRadius: '100px', color: '#0f172a', fontWeight: '600' };
const btnHero = { backgroundColor: '#e11d48', color: 'white', padding: '15px 35px', borderRadius: '100px', border: 'none', fontWeight: '900', cursor: 'pointer' };

// ESTILOS DASHBOARD
const welcomeBannerBig = { background: '#1e3a8a', padding: '60px', borderRadius: '30px', color: 'white', marginBottom: '40px', position: 'relative', overflow: 'hidden' };
const imgBannerOverlay = { position: 'absolute', right: 0, top: 0, height: '100%', width: '40%', objectFit: 'cover', opacity: 0.4 };
const gridDash = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' };
const cardDashAction = { backgroundColor: 'white', padding: '30px', borderRadius: '24px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#0f172a' };
const iconBox = { fontSize: '40px', marginBottom: '15px' };
const cardTitle = { fontSize: '18px', fontWeight: '900', marginBottom: '8px' };
const cardDesc = { fontSize: '13px', color: '#64748b' };
const btnDashAction = { backgroundColor: '#ffffff', color: '#1e3a8a', padding: '15px 35px', borderRadius: '12px', border: 'none', fontWeight: '900', cursor: 'pointer' };

// BOTÕES NAVBAR
const btnNavOn = { background: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const avatarCircleOn = { width: '45px', height: '45px', backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' };
const btnAccentNav = { backgroundColor: '#2563eb', color: 'white', padding: '10px 25px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '13px' };
const btnSimple = { background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer' };
const btnTheme = { backgroundColor: '#f1f5f9', border: 'none', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#0f172a' };
const btnOutlineNav = { background: 'none', color: '#2563eb', border: '2px solid #2563eb', padding: '10px 20px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' };