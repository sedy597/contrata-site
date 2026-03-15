// @ts-nocheck
'use client';
import Link from 'next/link';

export default function PlanosPage() {
  const logoPath = "/logo.png";

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR SUPERIOR */}
      <header style={{ padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', zIndex: 100 }}>
        <Link href="/feed"><img src={logoPath} style={{ height: '45px', cursor: 'pointer' }} alt="Logo" /></Link>
        <Link href="/feed" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: '900', fontSize: '12px', letterSpacing: '1px' }}>← VOLTAR AO FEED</Link>
      </header>

      <section style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
        
        {/* LADO ESQUERDO: TEXTO E MARKETING (AZUL ESCURO) */}
        <div style={{ flex: '1 1 40%', backgroundColor: '#0f172a', padding: '60px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800")', backgroundSize: 'cover' }}></div>
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.1', marginBottom: '25px', letterSpacing: '-2px' }}>
              Turbine seu futuro na <br/>
              <span style={{ color: '#3b82f6' }}>CONTRATA EMPREGOS</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px', lineHeight: '1.6' }}>
              Escolha o plano ideal para destacar seu perfil ou encontrar os melhores talentos para sua empresa em Ibitinga e região.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={featureBadge}>✔️ Destaque garantido nas buscas</div>
              <div style={featureBadge}>✔️ Suporte prioritário 24h</div>
              <div style={featureBadge}>✔️ Selo de Confiança no Perfil</div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: GRADE DE PLANOS (BRANCO) */}
        <div style={{ flex: '1 1 60%', padding: '60px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '900' }}>Planos e Assinaturas</h2>
            <div style={{ width: '50px', height: '4px', backgroundColor: '#2563eb', margin: '15px auto' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            
            {/* PLANO DESTAQUE - CANDIDATO */}
            <div style={cardStyle}>
              <div style={{...iconBox, color: '#3b82f6'}}>📄</div>
              <h4 style={{ fontWeight: '900', fontSize: '14px', color: '#64748b' }}>CANDIDATO</h4>
              <h3 style={planNameStyle}>Plano Destaque</h3>
              <div style={priceStyle}>R$ 9,90<span style={monthStyle}>/mês</span></div>
              <ul style={listStyle}>
                <li>✓ Primeiras posições</li>
                <li>✓ 2x mais visualizações</li>
              </ul>
              <Link href="/pagamento?valor=9.90&plano=destaque" style={btnLink}>Assinar</Link>
            </div>

            {/* PLANO PREMIUM - CANDIDATO */}
            <div style={{...cardStyle, borderColor: '#8b5cf6', boxShadow: '0 20px 40px rgba(139,92,246,0.1)'}}>
              <div style={{...iconBox, color: '#8b5cf6'}}>💎</div>
              <h4 style={{ fontWeight: '900', fontSize: '14px', color: '#64748b' }}>CANDIDATO</h4>
              <h3 style={planNameStyle}>Plano Premium</h3>
              <div style={priceStyle}>R$ 19,90<span style={monthStyle}>/mês</span></div>
              <ul style={listStyle}>
                <li>✓ Destaque + Recomendações</li>
                <li>✓ Currículo Impulsionado</li>
              </ul>
              <Link href="/pagamento?valor=19.90&plano=premium" style={{...btnLink, backgroundColor: '#8b5cf6'}}>Assinar</Link>
            </div>

            {/* EMPRESA BASIC */}
            <div style={cardStyle}>
              <div style={{...iconBox, color: '#d97706'}}>🏢</div>
              <h4 style={{ fontWeight: '900', fontSize: '14px', color: '#64748b' }}>EMPRESA</h4>
              <h3 style={planNameStyle}>Empresa Basic</h3>
              <div style={priceStyle}>R$ 29,90<span style={monthStyle}>/mês</span></div>
              <ul style={listStyle}>
                <li>✓ 3 vagas por mês</li>
                <li>✓ Filtros de candidatos</li>
              </ul>
              <Link href="/pagamento?valor=29.90&plano=empresa_basic" style={{...btnLink, backgroundColor: '#d97706'}}>Assinar</Link>
            </div>

            {/* EMPRESA PRO */}
            <div style={cardStyle}>
              <div style={{...iconBox, color: '#dc2626'}}>🚀</div>
              <h4 style={{ fontWeight: '900', fontSize: '14px', color: '#64748b' }}>EMPRESA</h4>
              <h3 style={planNameStyle}>Empresa PRO</h3>
              <div style={priceStyle}>R$ 99,90<span style={monthStyle}>/mês</span></div>
              <ul style={listStyle}>
                <li>✓ Vagas Ilimitadas</li>
                <li>✓ Filtros Avançados</li>
              </ul>
              <Link href="/pagamento?valor=99.90&plano=empresa_pro" style={{...btnLink, backgroundColor: '#dc2626'}}>Assinar</Link>
            </div>

          </div>

          <div style={{ marginTop: '50px', textAlign: 'center' }}>
             <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>Precisa de uma solução sob medida?</p>
             <button style={btnPersonalizado}>✨ MONTAR PLANO PERSONALIZADO</button>
          </div>
        </div>
      </section>

      <footer style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
        © 2026 CONTRATA EMPREGOS | AMBIENTE 100% SEGURO
      </footer>
    </main>
  );
}

// ESTILOS
const featureBadge = { backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' };
const cardStyle = { backgroundColor: 'white', padding: '30px 20px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', textAlign: 'center', transition: '0.3s' };
const iconBox = { fontSize: '32px', marginBottom: '15px' };
const planNameStyle = { fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '10px' };
const priceStyle = { fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '20px' };
const monthStyle = { fontSize: '14px', color: '#64748b', fontWeight: '600' };
const listStyle = { listStyle: 'none', padding: 0, margin: '0 0 30px 0', textAlign: 'left', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 };
const btnLink = { backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px' };
const btnPersonalizado = { backgroundColor: 'transparent', color: '#2563eb', border: '2px dashed #2563eb', padding: '15px 30px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' };