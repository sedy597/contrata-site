'use client';
import Link from 'next/link';

export default function TermosPage() {
  const logoPath = "/logo.png";

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* HEADER SIMPLIFICADO */}
      <header style={{ padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/"><img src={logoPath} style={{ height: '35px' }} alt="Logo" /></Link>
        <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>VOLTAR AO CADASTRO</Link>
      </header>

      <section style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>Termos e Privacidade</h1>
          <p style={{ opacity: 0.5, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px' }}>Última atualização: Janeiro de 2026</p>
        </div>

        <div style={contentBoxStyle}>
          <h2 style={sectionTitleStyle}>1. Aceitação dos Termos</h2>
          <p style={textStyle}>
            Ao acessar a plataforma <b>Contrata Empregos</b>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. O uso desta plataforma é restrito a fins profissionais de recrutamento e busca de emprego.
          </p>

          <h2 style={sectionTitleStyle}>2. Uso do Cadastro e Planos</h2>
          <p style={textStyle}>
            O usuário é responsável por manter a confidencialidade de sua senha e conta. Os planos <b>Destaque</b> e <b>Premium</b> são assinaturas mensais que oferecem visibilidade aumentada. O cancelamento pode ser feito a qualquer momento através do nosso SAC, porém não haverá reembolso proporcional de meses já iniciados.
          </p>

          <h2 style={sectionTitleStyle}>3. Proteção de Dados (LGPD)</h2>
          <p style={textStyle}>
            Coletamos seu nome, e-mail, telefone e currículo apenas para fins de conexão com empresas. Seus dados nunca serão vendidos a terceiros. Ao se candidatar a uma vaga, você autoriza explicitamente o envio de seu perfil para a empresa anunciante.
          </p>

          <h2 style={sectionTitleStyle}>4. Responsabilidade das Vagas</h2>
          <p style={textStyle}>
            A Contrata Empregos é uma plataforma de conexão. Não nos responsabilizamos pelo conteúdo das vagas publicadas por empresas, nem por promessas de contratação. Recomendamos que nunca realize pagamentos para participar de processos seletivos.
          </p>

          <h2 style={sectionTitleStyle}>5. Propriedade Intelectual</h2>
          <p style={textStyle}>
            O design, logotipos e códigos desta plataforma são de propriedade exclusiva da Contrata Empregos. A reprodução sem autorização é proibida.
          </p>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', opacity: 0.5, marginBottom: '20px' }}>Dúvidas sobre nossos termos?</p>
          <Link href="/sac" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px 30px', borderRadius: '12px', color: 'white', textDecoration: 'none', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
            Falar com Suporte Jurídico
          </Link>
        </div>
      </section>

      <footer style={{ padding: '60px', textAlign: 'center', opacity: 0.2 }}>
        <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>CONTRATA EMPREGOS BRASIL - IBITINGA/SP</p>
      </footer>
    </main>
  );
}

// ESTILOS
const contentBoxStyle = {
  backgroundColor: 'rgba(255,255,255,0.02)',
  padding: '50px',
  borderRadius: '30px',
  border: '1px solid rgba(255,255,255,0.05)',
  lineHeight: '1.8'
};

const sectionTitleStyle = {
  fontSize: '20px',
  fontWeight: '900',
  color: '#3b82f6',
  marginBottom: '15px',
  marginTop: '30px'
};

const textStyle = {
  fontSize: '15px',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '20px'
};