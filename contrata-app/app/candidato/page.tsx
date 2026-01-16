'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function CandidatoPage() {
  const [minhasVagas, setMinhasVagas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarMinhasCandidaturas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('candidaturas')
          .select(`
            id,
            created_at,
            vagas (titulo, localizacao, salario)
          `)
          .eq('candidato_id', user.id);

        if (!error) setMinhasVagas(data || []);
      }
      setLoading(false);
    };

    buscarMinhasCandidaturas();
  }, []);

  return (
    <main className="min-h-screen bg-[#061224] text-white p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <Link href="/" className="bg-white text-black px-3 py-1 font-bold text-sm">CONTRATA</Link>
        <h1 className="text-xl font-black uppercase text-blue-400">Minhas Inscrições</h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <p className="text-center opacity-40">Carregando...</p>
        ) : minhasVagas.length > 0 ? (
          minhasVagas.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{item.vagas?.titulo}</h2>
                <p className="text-white/40 text-sm">{item.vagas?.localizacao}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">Enviado</span>
                <p className="text-[10px] text-white/20 mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="text-white/20 font-bold uppercase text-xs mb-4">Você ainda não se candidatou a nada.</p>
            <Link href="/vagas" className="text-blue-400 font-bold hover:underline">Ver vagas abertas</Link>
          </div>
        )}
      </div>
    </main>
  );
}