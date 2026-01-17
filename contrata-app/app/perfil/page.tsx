// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({
    full_name: '',
    user_type: '',
    bio: '',
    avatar_url: '',
    telefone: ''
  });
  const [vagasMinhas, setVagasMinhas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const carregarDadosCompletos = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        setUser(session.user);

        // Busca dados detalhados do perfil na tabela profiles
        const { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (prof) {
          setPerfil({
            full_name: prof.full_name || 'Usuário',
            user_type: prof.user_type || 'empresa',
            bio: prof.bio || '',
            avatar_url: prof.avatar_url || '',
            telefone: prof.telefone || ''
          });
        }

        // Busca as vagas postadas por esta empresa (empresa_id)
        const { data: vgs } = await supabase
          .from('vagas')
          .select('*')
          .eq('empresa_id', session.user.id)
          .order('created_at', { ascending: false });
        
        setVagasMinhas(vgs || []);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosCompletos();
  }, [router]);

  const excluirVaga = async (id) => {
    if (confirm("Deseja realmente excluir esta vaga?")) {
      const { error } = await supabase.from('vagas').delete().eq('id', id);
      if (!error) {
        setVagasMinhas(vagasMinhas.filter(v => v.id !== id));
      }
    }
  };

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    headerPerfil: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      backgroundColor: '#0a1a31', 
      padding: '30px', 
      borderRadius: '24px', 
      border: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '30px'
    },
    avatar: { 
      width: '80px', 
      height: '80px', 
      borderRadius: '20px', 
      backgroundColor: '#2563eb', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '30px',
      overflow: 'hidden',
      color: 'white',
      fontWeight: 'bold'
    },
    info: { display: 'flex', flexDirection: 'column' as 'column', gap: '5px' },
    badge: { 
      backgroundColor: '#2563eb', 
      color: 'white', 
      padding: '4px 12px', 
      borderRadius: '50px', 
      fontSize: '10px', 
      fontWeight: '900', 
      width: 'fit-content',
      marginBottom: '5px'
    },
    vagaCard: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px', 
      backgroundColor: 'rgba(255,255,255,0.02)', 
      borderRadius: '16px', 
      marginBottom: '12px', 
      border: '1px solid rgba(255,255,255,0.05)' 
    },
    btnExcluir: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        {loading ? (
          <p>Carregando perfil...</p>
        ) : (
          <>
            <section style={s.headerPerfil}>
              <div style={s.avatar}>
                {perfil.avatar_url ? (
                  <img src={perfil.avatar_url} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  perfil.full_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div style={s.info}>
                <div style={s.badge}>
                  {perfil.user_type === 'empresa' ? 'CONTA EMPRESA' : 'CONTA CANDIDATO'}
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0' }}>
                  {perfil.full_name}
                </h1>
                <p style={{ opacity: 0.6, fontSize: '14px', margin: '0' }}>{user?.email}</p>
                {perfil.bio && (
                  <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8, maxWidth: '500px' }}>
                    {perfil.bio}
                  </p>
                )}
                {perfil.telefone && (
                  <p style={{ fontSize: '13px', color: '#3b82f6', marginTop: '5px' }}>
                    📞 {perfil.telefone}
                  </p>
                )}
              </div>
            </section>

            <h2 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: '900', letterSpacing: '1px' }}>
              MINHAS VAGAS POSTADAS
            </h2>

            {vagasMinhas.length > 0 ? (
              <div>
                {vagasMinhas.map(v => (
                  <div key={v.id} style={s.vagaCard}>
                    <div>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 'bold' }}>{v.titulo}</h3>
                      <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '4px' }}>
                        Postado em {new Date(v.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button onClick={() => excluirVaga(v.id)} style={s.btnExcluir}>EXCLUIR</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', opacity: 0.3, border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                Nenhuma vaga encontrada.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}