'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PersonalizadoPage() {
  const [valor, setValor] = useState(50);

  const getVantagens = (v: number) => {
    if (v < 30) return ["Selo Básico", "Destaque por 7 dias", "1 Vaga extra"];
    if (v < 70) return ["Selo Prata", "Destaque por 30 dias", "5 Vagas extras", "Acesso a Banco de Talentos"];
    return ["Selo Black", "Destaque Vitalício", "Vagas Ilimitadas", "Suporte 24h VIP", "Topo das buscas"];
  };

  return (
    <main style={{ backgroundColor: '#061224', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '60px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900' }}>Personalize seu Investimento</h1>
        <p style={{ opacity: 0.6, marginBottom: '40px' }}>Escolha quanto quer investir e veja suas vantagens aumentarem.</p>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '48px', color: '#3b82f6', marginBottom: '10px' }}>R$ {valor},00</h2>
          
          <input 
            type="range" 
            min="10" 
            max="200" 
            step="10" 
            value={valor} 
            onChange={(e) => setValor(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', marginBottom: '30px' }}
          />

          <div style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px' }}>
            <h4 style={{ fontSize: '12px', color: '#3b82f6', marginBottom: '15px' }}>SUAS VANTAGENS:</h4>
            {getVantagens(valor).map((item, i) => (
              <p key={i} style={{ fontSize: '14px', margin: '8px 0' }}>⭐ {item}</p>
            ))}
          </div>

          <Link href={`/pagamento?valor=${valor}&plano=personalizado`}>
            <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', width: '100%', padding: '15px', borderRadius: '15px', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer' }}>
              IR PARA PAGAMENTO
            </button>
          </Link>
        </div>
        
        <Link href="/planos" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'block', marginTop: '20px', fontSize: '12px' }}>Voltar para planos fixos</Link>
      </div>
    </main>
  );
}