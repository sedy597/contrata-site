'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

function ConteudoConfirmar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processando' | 'sucesso' | 'erro'>('processando');
  
  const plano = searchParams.get('plano') || 'destaque';

  useEffect(() => {
    async function ativarPlano() {
      // 1. Pega o usuário logado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus('erro');
        return;
      }

      // 2. Simula o tempo de processamento bancário (3 segundos)
      setTimeout(async () => {
        const dataExpiracao = new Date();
        dataExpiracao.setMonth(dataExpiracao.getMonth() + 1); // Plano válido por 30 dias

        // 3. Atualiza a coluna 'plano' e 'plano_ativo_ate' na tabela perfis
        const { error } = await supabase
          .from('perfis')
          .update({ 
            plano: plano,
            plano_ativo_ate: dataExpiracao.toISOString()
          })
          .eq('id', session.user.id);

        if (!error) {
          setStatus('sucesso');
        } else {
          console.error("Erro ao ativar plano:", error);
          setStatus('erro');
        }
      }, 3000);
    }
    ativarPlano();
  }, [plano]);

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '50px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '500px', width: '90%' }}>
        
        {status === 'processando' && (
          <>
            <div className="loader"></div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>Processando Pagamento</h1>
            <p style={{ opacity: 0.5, fontSize: '14px' }}>Estamos comunicando com a operadora e liberando seu acesso...</p>
          </>
        )}

        {status === 'sucesso' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#00dfaa' }}>Pagamento Aprovado!</h1>
            <p style={{ margin: '15px 0 30px', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)' }}>
              Excelente! Seu plano <b>{plano.toUpperCase()}</b> foi ativado. Suas vantagens (selos, destaque e acesso ilimitado) já estão liberadas.
            </p>
            <Link href="/feed">
              <button style={btnEstilo}>ACESSAR MEU NOVO FEED</button>
            </Link>
          </>
        )}

        {status === 'erro' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ef4444' }}>Falha na Ativação</h1>
            <p style={{ margin: '15px 0 30px', color: 'rgba(255,255,255,0.7)' }}>Não conseguimos identificar seu pagamento ou sessão. Se o valor foi debitado, chame nosso suporte.</p>
            <Link href="/planos">
              <button style={{ ...btnEstilo, backgroundColor: 'rgba(255,255,255,0.1)' }}>TENTAR NOVAMENTE</button>
            </Link>
          </>
        )}
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid rgba(255,255,255,0.1);
          border-left: 4px solid #3b82f6;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 25px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

export default function ConfirmarPage() {
  return <Suspense><ConteudoConfirmar /></Suspense>;
}

const btnEstilo = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', width: '100%', fontSize: '14px' };