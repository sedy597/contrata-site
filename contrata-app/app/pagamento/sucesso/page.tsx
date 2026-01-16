'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ConteudoSucesso() {
  const searchParams = useSearchParams();
  const metodo = searchParams.get('metodo') || 'PIX';
  const valor = searchParams.get('valor') || '0.00';

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        
        {metodo === 'PIX' ? (
          <>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📱</div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>Quase lá! Pague o Pix</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '30px' }}>
              Escaneie o QR Code abaixo ou copie o código para finalizar sua assinatura de <b>R$ {valor}</b>.
            </p>
            
            {/* SIMULAÇÃO DE QR CODE */}
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', width: '200px', height: '200px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ContrataEmpregosPix" alt="QR Code" />
            </div>

            <button 
              onClick={() => alert("Código Pix Copiado!")}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '20px' }}
            >
              COPIAR CÓDIGO PIX
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>⏳</div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>Pagamento em Processamento</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '30px' }}>
              Estamos aguardando a confirmação da sua operadora de cartão ou compensação do boleto. 
              Isso pode levar alguns minutos.
            </p>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                <p style={{ color: '#3b82f6', fontWeight: 'bold', margin: 0 }}>Status: Aguardando Aprovação</p>
            </div>
          </>
        )}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '15px' }}>Assim que aprovado, seus benefícios serão liberados automaticamente.</p>
          <Link href="/feed">
            <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
              VOLTAR PARA O FEED
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConteudoSucesso />
    </Suspense>
  );
}