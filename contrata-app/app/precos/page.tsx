'use client';
import Link from 'next/link';

const planos = [
  { nome: 'Básico', preco: 'Grátis', desc: '1 vaga por mês', cor: 'white/10' },
  { nome: 'Pro', preco: 'R$ 49', desc: 'Vagas ilimitadas + Destaque', cor: 'blue-600' },
  { nome: 'Enterprise', preco: 'R$ 199', desc: 'Suporte 24h + API', cor: 'purple-600' },
];

export default function PrecosPage() {
  return (
    <main className="min-h-screen bg-[#061224] text-white p-12 flex flex-col items-center">
      <h1 className="text-5xl font-black tracking-tighter mb-4">PLANOS PARA EMPRESAS</h1>
      <p className="text-white/40 mb-12">Escolha o plano ideal para escalar seu time.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {planos.map((plano) => (
          <div key={plano.nome} className={`bg-${plano.cor} border border-white/10 p-8 rounded-[40px] flex flex-col items-center text-center shadow-2xl`}>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-widest">{plano.nome}</h2>
            <div className="text-4xl font-black mb-6">{plano.preco}<span className="text-sm opacity-50 font-normal">/mês</span></div>
            <p className="text-white/60 mb-8">{plano.desc}</p>
            <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-gray-200 transition-all">
              Assinar Agora
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}