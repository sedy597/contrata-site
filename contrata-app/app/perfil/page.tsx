// @ts-nocheck
// ... dentro do componente PerfilPage ...

const excluirVaga = async (id) => {
  if (confirm("Tens a certeza que queres apagar esta vaga?")) {
    const { error } = await supabase
      .from('vagas')
      .delete()
      .eq('id', id)
      .eq('empresa_id', user.id); // Segurança extra: garante que só apagas o que é teu

    if (error) {
      console.error("Erro ao apagar:", error.message);
      alert("Erro ao apagar: " + error.message);
    } else {
      alert("Vaga removida com sucesso!");
      // Atualiza a lista localmente para sumir da tela na hora
      setVagasMinhas(vagasMinhas.filter(v => v.id !== id));
    }
  }
};

// ... no botão de excluir dentro do map ...
<button 
  onClick={() => excluirVaga(v.id)} 
  style={{ color: '#ef4444', border: '1px solid #ef4444', background: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}
>
  EXCLUIR VAGA
</button>