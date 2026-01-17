// @ts-nocheck
// ... dentro do seu componente PerfilPage, adicione este estado:
const [inscritos, setInscritos] = useState([]);

// ... dentro do useEffect onde você carrega os dados:
async function buscarInscritos() {
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from('candidaturas')
    .select(`
      id,
      status,
      vagas (titulo),
      profiles:candidato_id (full_name, telefone, curriculo_url)
    `)
    .eq('empresa_id', session.user.id);

  if (!error) setInscritos(data || []);
}
buscarInscritos();

// ... No seu HTML (dentro do return), abaixo da lista de vagas:
<h2 style={{ marginTop: '50px', fontSize: '22px', fontWeight: '900' }}>CANDIDATOS INTERESSADOS</h2>
{inscritos.length > 0 ? (
  inscritos.map(cand => (
    <div key={cand.id} style={{ backgroundColor: '#0a1a31', padding: '20px', borderRadius: '20px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0, color: '#3b82f6' }}>{cand.profiles.full_name}</h4>
          <p style={{ fontSize: '13px', margin: '5px 0' }}>Vaga: <strong>{cand.vagas?.titulo}</strong></p>
          <p style={{ fontSize: '13px', opacity: 0.6 }}>WhatsApp: {cand.profiles.telefone || 'Não informado'}</p>
        </div>
        <a 
          href={cand.profiles.curriculo_url} 
          target="_blank" 
          style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 15px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}
        >
          VER CURRÍCULO
        </a>
      </div>
    </div>
  ))
) : (
  <p style={{ opacity: 0.3 }}>Nenhum candidato inscrito ainda.</p>
)}