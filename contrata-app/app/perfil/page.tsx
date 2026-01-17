// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const [vagasMinhas, setVagasMinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const carregarPerfilEVagas = async () => {
      setLoading(true);
      try {
        // 1. Pega usuário logado
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        setUser(session.user);

        // 2. Pega dados do perfil (Nome, tipo, etc)
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setPerfil(prof);

        // 3. Busca apenas as vagas que ESSA empresa postou
        // Usando as colunas novas: titulo, descricao, empresa_id
        const { data: vgs, error } = await supabase
          .from('vagas')
          .select('*')
          .eq('empresa_id', session.user.id)
          .order('created_at', { ascending: false });

        if (!error) setVagasMinhas(vgs || []);

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfilEVagas();
  }, [router]);

  // Função para deletar vaga
  const excluirVaga = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta vaga?")) {
      const { error } = await supabase.from('vagas').delete().eq('id', id);
      if (!error) {
        setVagasMinhas(vagasMinhas.filter(v => v.id !== id));
        alert("Vaga removida!");
      }
    }
  };

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    cardPerfil: { backgroundColor: '#0a1a31', padding: '30px', borderRadius: '24px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)' },
    vagaLinha: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '15px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.05)' },
    btnExcluir: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        <div style={s.cardPerfil}>
          <h1 style={{ fontSize: '24px', fontWeight: '900' }}>{perfil?.full_name || 'Usuário'}</h1>
          <p style={{ opacity: 0.5, fontSize: '14px' }}>{user?.email}</p>
          <span style={{ backgroundColor: '#3b82f6', fontSize: '10px', padding: '4px 10px', borderRadius: '50px', fontWeight: 'bold', marginTop: '10px', display: 'inline-block' }}>
            {perfil?.user_type === 'empresa' ? 'CONTA EMPRESA' : 'CONTA CANDIDATO'}
          </span>
        </div>

        <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>
          {perfil?.user_type === 'empresa' ? 'Minhas Vagas Postadas' : 'Minhas Candidaturas'}
        </h2>

        {loading ? (
          <p>Carregando...</p>
        ) : vagasMinhas.length > 0 ? (
          <div>
            {vagasMinhas.map(v => (
              <div key={v.id} style={s.vagaLinha}>
                <div>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>{v.titulo}</h3>
                  <p style={{ fontSize: '12px', opacity: 0.5, margin: '5px 0 0 0' }}>Postado em: {new Date(v.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => excluirVaga(v.id)} style={s.btnExcluir}>EXCLUIR</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.3 }}>Nenhuma atividade encontrada.</p>
        )}
      </main>
    </div>
  );
}