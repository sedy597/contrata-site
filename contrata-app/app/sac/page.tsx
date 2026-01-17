// @ts-nocheck
'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';

export default function SACPage() {
  const [assunto, setAssunto] = useState('Problemas com Pagamento / Planos');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const enviarSuporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('suporte').insert([
        {
          usuario_id: session?.user?.id,
          email: session?.user?.email,
          assunto: assunto,
          mensagem: mensagem
        }
      ]);

      if (error) throw error;

      setEnviado(true);
      setMensagem('');
    } catch (error) {
      alert("Erro ao enviar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reutilizando os estilos que já tinhas
  return (
    <div style={{ display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '60px', maxWidth: '1000px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px' }}>Central de Suporte</h1>
        
        {enviado ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'rgba(0,223,170,0.05)', borderRadius: '30px', border: '1px solid #00dfaa' }}>
            <h2 style={{ color: '#00dfaa' }}>Chamado Aberto com Sucesso!</h2>
            <p>Verifique o seu e-mail para acompanhar a resposta em até 24h.</p>
            <button onClick={() => setEnviado(false)} style={{ marginTop: '20px', background: 'none', border: '1px solid white', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>ABRIR OUTRO</button>
          </div>
        ) : (
          <form onSubmit={enviarSuporte} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px' }}>QUAL O ASSUNTO?</label>
              <select 
                style={inputStyle} 
                value={assunto} 
                onChange={(e) => setAssunto(e.target.value)}
              >
                <option>Problemas com Pagamento / Planos</option>
                <option>Dificuldade em Postar Vaga</option>
                <option>Denunciar Perfil ou Vaga</option>
                <option>Sugestões e Melhorias</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px' }}>DESCREVA O SEU PROBLEMA</label>
              <textarea 
                required
                style={{ ...inputStyle, height: '150px' }} 
                value={mensagem} 
                onChange={(e) => setMensagem(e.target.value)} 
              />
            </div>

            <button type="submit" disabled={loading} style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', borderRadius: '15px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>
              {loading ? 'ENVIANDO...' : 'ENVIAR PARA EQUIPE TÉCNICA'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

const inputStyle = { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: 'white', marginTop: '10px' };