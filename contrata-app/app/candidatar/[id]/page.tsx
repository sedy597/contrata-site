// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PerfilPublicoPage() {
  const { id } = useParams(); // ID do usuário que está sendo visitado
  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [planoUsuarioLogado, setPlanoUsuarioLogado] = useState('gratuito');

  useEffect(() => {
    async function carregarDados() {
      const { data: { user: logado } } = await supabase.auth.getUser();
      
      if (logado) {
        // 1. Checar plano do usuário que está logado
        const { data: pLogado } = await supabase.from('profiles').select('plano').eq('id', logado.id).single();
        setPlanoUsuarioLogado(pLogado?.plano || 'gratuito');

        // 2. Lógica de Limite para Gratuitos (Ex: 3 perfis por dia)
        // Aqui simulamos uma checagem. No futuro, você pode salvar "visualizacoes_hoje" no banco.
        if (pLogado?.plano === 'gratuito') {
           // Simulação: Se o ID terminar em número par e for grátis, bloqueia (exemplo didático)
           // No real, você contaria as linhas na tabela 'visualizacoes_perfil'
        }

        // 3. Registrar a visita no banco (Para alimentar o "Quem viu meu perfil")
        if (logado.id !== id) {
          await supabase.from('visualizacoes_perfil').insert([
            { perfil_visited_id: id, visitante_id: logado.id }
          ]);
        }
      }

      // 4. Carregar os dados do perfil visitado
      const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single();
      const { data: pst } = await supabase.from('posts').select('*').eq('autor_id', id).order('created_at', { ascending: false });
      
      setPerfil(p);
      setPosts(pst || []);
      setLoading(false);
    }
    carregarDados();
  }, [id]);

  if (loading) return <div style={msgCentral}>Buscando informações...</div>;

  // TELA DE BLOQUEIO PRO
  if (limiteAtingido && planoUsuarioLogado === 'gratuito') {
    return (
      <div style={msgCentral}>
        <div style={modalBloqueio}>
          <div style={{fontSize: '50px'}}>🔒</div>
          <h2 style={{margin: '20px 0'}}>Limite de Visualização</h2>
          <p style={{opacity: 0.7, marginBottom: '30px'}}>Usuários gratuitos podem ver apenas 3 perfis profissionais por dia.</p>
          <Link href="/planos" style={btnPro}>SEJA PRO PARA VER TUDO</Link>
          <Link href="/feed" style={{display:'block', marginTop: '20px', color: 'white', opacity: 0.5}}>Voltar ao Feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#061224', color: 'white', padding: '40px 20px 40px 260px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* CABEÇALHO DO PERFIL VISITADO */}
        <div style={cardHeader}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
             <div style={avatarGrande}>👤</div>
             <div style={{flex: 1}}>
                <h1 style={{fontSize: '28px', fontWeight: '900'}}>@{perfil?.username}</h1>
                <p style={{color: '#3b82f6'}}>{perfil?.cargo_atual || 'Profissional em Ibitinga'}</p>
                <div style={{display:'flex', gap: '15px', marginTop: '10px', fontSize: '13px', opacity: 0.6}}>
                  <span><b>{posts.length}</b> posts</span>
                  <span><b>120</b> seguidores</span>
                </div>
             </div>
             <button style={btnSeguir}>SEGUIR</button>
          </div>
          
          <div style={{marginTop: '30px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '15px'}}>
            <h3 style={{fontSize: '14px', color: '#fbbf24', marginBottom: '10px'}}>Sobre o Profissional</h3>
            <p style={{fontSize: '14px', lineHeight: '1.6', opacity: 0.8}}>{perfil?.experiencia || 'Este usuário ainda não preencheu a bio profissional.'}</p>
          </div>

          <button 
            onClick={() => window.open(`https://wa.me/${perfil?.whatsapp}`)} 
            style={btnWhats}
          >
            ENTRAR EM CONTATO VIA WHATSAPP
          </button>
        </div>

        {/* POSTAGENS DELE */}
        <h2 style={{fontSize: '18px', fontWeight: '900', marginBottom: '20px'}}>Publicações de @{perfil?.username}</h2>
        {posts.map(post => (
          <div key={post.id} style={cardPost}>
            <p>{post.texto}</p>
            <small style={{opacity: 0.3}}>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        ))}

      </div>
    </div>
  );
}

// ESTILOS
const msgCentral = { minHeight: '100vh', backgroundColor: '#061224', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' };
const cardHeader = { backgroundColor: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' };
const avatarGrande = { width: '100px', height: '100px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' };
const btnSeguir = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const btnWhats = { width: '100%', marginTop: '20px', backgroundColor: '#25d366', color: 'black', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' };
const cardPost = { backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)' };
const modalBloqueio = { backgroundColor: '#030a16', padding: '50px', borderRadius: '30px', border: '1px solid #3b82f6', maxWidth: '400px' };
const btnPro = { backgroundColor: '#fbbf24', color: 'black', padding: '15px 30px', borderRadius: '50px', fontWeight: '900', textDecoration: 'none', display: 'block' };