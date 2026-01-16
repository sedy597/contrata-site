'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import Link from 'next/link';

function ConteudoPagamento() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Captura os dados vindos da página de planos
  const valor = searchParams.get('valor') || '0.00';
  const plano = searchParams.get('plano') || 'Plano Selecionado';

  // Identifica se é plano de empresa para mudar o visual e opções
  const ehEmpresa = plano.toLowerCase().includes('empresa') || 
                    plano.toLowerCase().includes('recrutador') || 
                    plano.toLowerCase().includes('pacote');

  // Função que envia o usuário para a página de QR Code ou Aguardando
  const processarEIrParaSucesso = (metodo: string) => {
    router.push(`/pagamento/sucesso?metodo=${metodo}&valor=${valor}&plano=${plano}`);
  };

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: ehEmpresa ? '#8b5cf6' : '#3b82f6', fontSize: '11px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {ehEmpresa ? 'Checkout Corporativo' : 'Área de Pagamento'}
          </h2>
          <h1 style={{ fontSize: '26px', fontWeight: '900', marginTop: '10px' }}>Finalizar Assinatura</h1>
        </header>

        {/* BOX DE RESUMO DO PEDIDO */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '20px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', opacity: 0.5 }}>ASSINATURA:</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{plano.replace('_', ' ')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
            <span style={{ fontSize: '16px' }}>Total a pagar:</span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: ehEmpresa ? '#a78bfa' : '#60a5fa' }}>R$ {valor}</span>
          </div>
        </div>

        {/* OPÇÕES DE PAGAMENTO COM REDIRECIONAMENTO NO CLIQUE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* BOTÃO PIX (SÓ APARECE PARA CANDIDATOS) */}
          {!ehEmpresa && (
            <button 
              onClick={() => processarEIrParaSucesso('PIX')}
              style={{ ...btnStyle, backgroundColor: '#00dfaa', color: '#061224' }}
            >
              <span style={{ fontSize: '20px' }}>📱</span> PAGAR COM PIX
            </button>
          )}

          {/* BOTÃO CARTÃO (PARA TODOS) */}
          <button 
            onClick={() => processarEIrParaSucesso('CARTAO')}
            style={{ ...btnStyle, backgroundColor: '#2563eb', color: 'white' }}
          >
            💳 CARTÃO DE CRÉDITO
          </button>

          {/* BOTÃO BOLETO (SÓ PARA EMPRESAS) */}
          {ehEmpresa && (
            <button 
              onClick={() => processarEIrParaSucesso('BOLETO')}
              style={{ ...btnStyle, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              📄 BOLETO / FATURA CNPJ
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link href="/planos" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
            ← Escolher outro plano
          </Link>
        </div>

        {/* GARANTIA DE SEGURANÇA */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', opacity: 0.2 }}>
          <img src="https://img.icons8.com/color/48/visa.png" width="30" alt="Visa" />
          <img src="https://img.icons8.com/color/48/mastercard.png" width="30" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/shield.png" width="30" alt="Seguro" />
        </div>
      </div>
    </main>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Iniciando Checkout...</div>}>
      <ConteudoPagamento />
    </Suspense>
  );
}

const btnStyle = { 
  width: '100%', 
  border: 'none', 
  padding: '16px', 
  borderRadius: '14px', 
  fontWeight: '900' as const, 
  cursor: 'pointer', 
  fontSize: '12px',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '12px',
  textTransform: 'uppercase' as const,
  transition: '0.2s ease'
};