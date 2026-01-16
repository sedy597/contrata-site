// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa se o usuário está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. BACKGROUND CORPORATIVO (DUAS FOTOS) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', opacity: 0.4, pointerEvents: 'none' }}>
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200" style={{ width: '50%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} alt="executivo1" />
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200" style={{ width: '50%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} alt="executivo2" />
      </div>

      {/* 2. FILTRO AZUL ESCURO (OVERLAY) */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6, 18, 36, 0.88)', zIndex: 1 }}></div>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, position: 'relative', padding: '0 20px', textAlign: 'center' }}>
        
        {/* LOGO */}
        <img src="/logo.png" alt="Logo" style={{ height: '160px', marginBottom: '30px', filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.3))' }} />

        {session ? (
          /* --- TELA QUANDO LOGADO --- */
          <div style={{ animation: 'fadeIn 0.8s ease' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '10px' }}>Bem-vindo de volta!</h1>
            <p style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '18px', marginBottom: '40px' }}>{session.user.email}</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Link href="/vagas" style={btnPrimary}>BUSCAR VAGAS</Link>
              <Link href="/perfil" style={btnSecondary}>VER MEU PERFIL</Link>
            </div>
          </div>
        ) : (
          /* --- TELA QUANDO OFFLINE (CHECK DA HOME) --- */
          <div style={{ animation: 'fadeIn 0.8s ease' }}>
            <h2 style={{ color: '#3b82f6', fontWeight: '900', letterSpacing: '6px', fontSize: '14px', marginBottom: '15px', textTransform: 'uppercase' }}>Contrata Empregos Brasil</h2>
            <h1 style={{ color: 'white', fontSize: '65px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '45px', lineHeight: '1' }}>Encontre o emprego ideal.</h1>

            {/* CAIXA DE BUSCA SIMULADA */}
            <div style={{ width: '100%', maxWidth: '550px', margin: '0 auto 45px', backgroundColor: 'white', borderRadius: '50px', padding: '6px', display: 'flex', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <input 
                type="text" 
                placeholder="Qual vaga você procura?" 
                style={{ flex: 1, border: 'none', outline: 'none', padding: '0 25px', fontSize: '16px', color: 'black', background: 'transparent' }} 
              />
              <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '14px 30px', borderRadius: '50px', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>PROCURAR</button>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Link href="/cadastro" style={btnPrimary}>SOU CANDIDATO</Link>
              <Link href="/login" style={btnSecondary}>SOU EMPRESA</Link>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 10, padding: '30px', textAlign: 'center', opacity: 0.3, fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>
        © 2026 CONTRATA EMPREGOS BRASIL - IBITINGA/SP
      </footer>
    </main>
  );
}

// ESTILOS DOS BOTÕES
const btnPrimary = { 
  backgroundColor: '#2563eb', 
  color: 'white', 
  padding: '18px 40px', 
  borderRadius: '50px', 
  fontWeight: '900', 
  textDecoration: 'none',
  fontSize: '12px',
  transition: '0.3s',
  display: 'inline-block'
};

const btnSecondary = { 
  backgroundColor: 'rgba(255,255,255,0.05)', 
  color: 'white', 
  padding: '18px 40px', 
  borderRadius: '50px', 
  fontWeight: '900', 
  textDecoration: 'none',
  fontSize: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  display: 'inline-block'
};