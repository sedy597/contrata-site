// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({
    full_name: '', user_type: '', bio: '', avatar_url: '', telefone: ''
  });
  const [vagasMinhas, setVagasMinhas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const carregarDadosOficiais = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      setUser(session.user);

      // 1. Busca os dados de perfil (Seção 5 do Doc)
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (prof) setPerfil(prof);

      // 2. Busca o Feed do Perfil (Seção 5.3 do Doc)
      const { data: vgs } = await supabase
        .from('vagas')
        .select('*')
        .eq('empresa_id', session.user.id)
        .order('created_at', { ascending: false });
      
      setVagasMinhas(vgs || []);
      setLoading(false);
    };
    carregarDadosOficiais();
  }, [router]);

  const s = {
    layout: { display: 'flex', backgroundColor: '#061224', minHeight: '100vh', color: 'white' },
    main: { flex: 1, marginLeft: '240px', padding: '40px' },
    cardTopo: { backgroundColor: '#0a1a31', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', position: 'relative' },
    avatar: { width: '90px', height: '90px', borderRadius: '25px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px', fontWeight: 'bold', marginBottom: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' },
    badge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '6px 16px', borderRadius: '50px', fontSize: '11px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' },
    btnPremium: { backgroundColor: '#facc15', color: '#000', padding: '12px 25px', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
    btnSAC: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)' },
    vagaItem: { backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <main style={s.main}>
        {loading ? <p>Sincronizando com o Documento Oficial...</p> : (
          <>
            {/* CABEÇALHO DO PERFIL (REQUISITO 5.1 e 5.2) */}
            <section style={s.cardTopo}>
              <div style={s.avatar}>
                {perfil.avatar_url ? <img src={perfil.avatar_url} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'25px'}} /> : (perfil.full_name?.charAt(0) || 'U')}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={s.badge}>{perfil.user_type === 'empresa' ? '🏢 Empresa Contratante' : '👤 Candidato'}</div>
                <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px', margin: '10px 0 5px 0' }}>{perfil.full_name || 'Usuário'}</h1>
                <p style={{ opacity: 0.5, fontSize: '16px' }}>{user?.email}</p>
                
                {perfil.bio && (
                  <p style={{ marginTop: '20px', fontSize: '15px', opacity: 0.8, maxWidth: '600px', lineHeight: '1.6', color: '#cbd5e1' }}>
                    {perfil.bio}
                  </p>
                )}
              </div>

              {/* NAVEGAÇÃO GLOBAL (REQUISITO 12) */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <Link href="/planos" style={s.btnPremium}>👑 UPGRADE PARA PREMIUM</Link>
                <Link href="/sac" style={s.btnSAC}>🎧 SUPORTE / SAC</Link>
              </div>
            </section>

            {/* FEED DO PERFIL (REQUISITO 5.3) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900' }}>GERENCIAR POSTAGENS</h2>
              <Link href="/postar-vaga" style={{ color: '#3b82f6', fontSize: '13px', fontWeight: 'bold' }}>+ NOVA VAGA</Link>
            </div>

            {vagasMinhas.length > 0 ? (
              vagasMinhas.map(v => (
                <div key={v.id} style={s.vagaItem}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{v.titulo}</h3>
                    <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '5px' }}>Publicado em {new Date(v.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 15px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' }}>EDITAR</button>
                    <button style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>EXCLUIR</button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '30px', opacity: 0.4 }}>
                <p>Nenhuma vaga postada até o momento.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}