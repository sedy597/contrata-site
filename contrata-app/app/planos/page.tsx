'use client';
import Link from 'next/link';

export default function PlanosPage() {
  const logoPath = "/logo.png";

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.1, pointerEvents: 'none', background: 'url("https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=1200") center/cover no-repeat' }}></div>

      <header style={{ padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <Link href="/feed"><img src={logoPath} style={{ height: '40px' }} alt="Logo" /></Link>
        <Link href="/feed" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px' }}>VOLTAR AO FEED</Link>
      </header>

      <section style={{ position: 'relative', zIndex: 10, padding: '40px 20px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center' }}>
             <div style={iconCircleStyle}>📄</div>
             <h2 style={headerTabStyle}>Candidatos</h2>
          </div>
          <div style={{ textAlign: 'center' }}>
             <div style={iconCircleStyle}>🏢</div>
             <h2 style={{ ...headerTabStyle, backgroundColor: '#8b5cf6' }}>Empresas</h2>
          </div>
        </div>

        {/* GRADE DE PLANOS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', maxWidth: '1300px', margin: '0 auto' }}>
          
          {/* CANDIDATO - DESTAQUE */}
          <div style={{ ...cardStyle, border: '2px solid #3b82f6' }}>
            <h4 style={{ ...cardTitleStyle, color: '#3b82f6' }}>Plano Destaque</h4>
            <div style={priceStyle}>R$ 9,90</div>
            <ul style={featureListStyle}>
              <li>✓ Primeiras posições</li>
              <li>✓ Mais visualizações</li>
            </ul>
            <Link href="/pagamento?valor=9.90&plano=destaque" style={btnLinkStyle}>
              <button style={{ ...btnActionStyle, backgroundColor: '#1e3a8a' }}>Assinar</button>
            </Link>
          </div>

          {/* CANDIDATO - PREMIUM */}
          <div style={{ ...cardStyle, border: '2px solid #8b5cf6' }}>
            <h4 style={{ ...cardTitleStyle, color: '#8b5cf6' }}>Plano Premium</h4>
            <div style={priceStyle}>R$ 19,90</div>
            <ul style={featureListStyle}>
              <li>✓ Destaque + Recomendações</li>
              <li>✓ Currículo Impulsionado</li>
            </ul>
            <Link href="/pagamento?valor=19.90&plano=premium" style={btnLinkStyle}>
              <button style={{ ...btnActionStyle, backgroundColor: '#6d28d9' }}>Assinar</button>
            </Link>
          </div>

          {/* EMPRESA - BÁSICO */}
          <div style={{ ...cardStyle, borderColor: '#ffbf00' }}>
            <h4 style={{ ...cardTitleStyle, color: '#ffbf00' }}>Empresa Basic</h4>
            <div style={priceStyle}>R$ 29,90</div>
            <ul style={featureListStyle}>
              <li>✓ 3 vagas / mês</li>
              <li>✓ 30 currículos</li>
            </ul>
            <Link href="/pagamento?valor=29.90&plano=empresa_basic" style={btnLinkStyle}>
              <button style={{ ...btnActionStyle, backgroundColor: '#d97706' }}>Assinar</button>
            </Link>
          </div>

          {/* EMPRESA - ILIMITADO */}
          <div style={{ ...cardStyle, borderColor: '#ef4444' }}>
            <h4 style={{ ...cardTitleStyle, color: '#ef4444' }}>Empresa PRO</h4>
            <div style={priceStyle}>R$ 99,90</div>
            <ul style={featureListStyle}>
              <li>✓ Vagas Ilimitadas</li>
              <li>✓ Filtros Avançados</li>
            </ul>
            <Link href="/pagamento?valor=99.90&plano=empresa_pro" style={btnLinkStyle}>
              <button style={{ ...btnActionStyle, backgroundColor: '#dc2626' }}>Assinar</button>
            </Link>
          </div>
        </div>

        {/* BOTÃO PLANO PERSONALIZADO ABAIXO */}
        <div style={{ marginTop: '50px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '15px' }}>Não encontrou o que precisava?</p>
          <Link href="/planos/personalizado">
            <button style={{ 
              backgroundColor: 'transparent', 
              color: 'white', 
              border: '2px dashed rgba(255,255,255,0.3)', 
              padding: '15px 40px', 
              borderRadius: '50px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              fontSize: '14px',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
            >
              ✨ MONTAR MEU PLANO PERSONALIZADO
            </button>
          </Link>
        </div>

      </section>
    </main>
  );
}

// ESTILOS
const iconCircleStyle = { width: '60px', height: '60px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 10px' };
const headerTabStyle = { backgroundColor: '#1e3a8a', padding: '8px 20px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' as const };
const cardStyle = { backgroundColor: 'white', color: 'black', width: '190px', padding: '25px 15px', borderRadius: '20px', display: 'flex', flexDirection: 'column' as const, textAlign: 'center' as const };
const cardTitleStyle = { fontSize: '14px', fontWeight: '900', marginBottom: '10px' };
const priceStyle = { fontSize: '20px', fontWeight: '900', marginBottom: '15px' };
const featureListStyle = { listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '10px', textAlign: 'left' as const, display: 'flex', flexDirection: 'column' as const, gap: '8px', color: '#444', flex: 1 };
const btnActionStyle = { width: '100%', color: 'white', border: 'none', padding: '10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' };
const btnLinkStyle = { textDecoration: 'none', width: '100%' };