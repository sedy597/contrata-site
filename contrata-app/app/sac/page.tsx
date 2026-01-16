'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SACPage() {
  const [assunto, setAssunto] = useState('Problemas com Pagamento');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const enviarSuporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    // Simulação de envio (Podemos salvar em uma tabela 'suporte' depois)
    setTimeout(() => {
      setEnviado(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ padding: '60px', maxWidth: '800px' }}>
      
      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>Central de Suporte</h1>
        <p style={{ opacity: 0.5, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Estamos aqui para ajudar você e sua empresa
        </p>
      </header>

      {enviado ? (
        <div style={successBoxStyle}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>📩</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#00dfaa' }}>Mensagem Enviada!</h2>
          <p style={{ opacity: 0.7, marginTop: '10px' }}>
            Nossa equipe técnica analisará sua solicitação e responderá para o seu e-mail de cadastro em até 24h.
          </p>
          <button onClick={() => setEnviado(false)} style={btnResetStyle}>ENVIAR OUTRA MENSAGEM</button>
        </div>
      ) : (
        <form onSubmit={enviarSuporte} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>QUAL O ASSUNTO?</label>
            <select 
              style={inputStyle} 
              value={assunto} 
              onChange={(e) => setAssunto(e.target.value)}
            >
              <option>Problemas com Pagamento / Planos</option>
              <option>Dificuldade em Postar Vaga</option>
              <option>Denunciar Perfil ou Vaga</option>
              <option>Sugestões e Melhorias</option>
              <option>Outros Assuntos</option>
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>DETALHE O QUE ESTÁ ACONTECENDO</label>
            <textarea 
              required
              placeholder="Descreva aqui seu problema ou dúvida..."
              style={{ ...inputStyle, height: '180px', resize: 'none' }}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} style={btnSubmitStyle}>
            {loading ? 'ENVIANDO AGUARDE...' : 'ABRIR CHAMADO DE SUPORTE'}
          </button>
        </form>
      )}

      <footer style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
        <div style={{ display: 'flex', gap: '40px', opacity: 0.4, fontSize: '12px' }}>
          <div><strong>📍 LOCALIZAÇÃO:</strong><br/>Ibitinga, SP</div>
          <div><strong>⏰ ATENDIMENTO:</strong><br/>Seg à Sex: 08h - 18h</div>
          <div><strong>🛡️ SEGURANÇA:</strong><br/>Protocolo SSL Ativo</div>
        </div>
      </footer>
    </div>
  );
}

// ESTILOS VISUAIS
const formStyle = { display: 'flex', flexDirection: 'column' as const, gap: '25px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column' as const, gap: '10px' };
const labelStyle = { fontSize: '11px', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' };
const inputStyle = { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: 'white', outline: 'none', fontSize: '14px' };
const btnSubmitStyle = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px', transition: '0.3s' };
const successBoxStyle = { backgroundColor: 'rgba(0,223,170,0.05)', padding: '50px', borderRadius: '30px', border: '1px solid rgba(0,223,170,0.2)', textAlign: 'center' as const };
const btnResetStyle = { marginTop: '30px', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };