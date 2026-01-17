// @ts-nocheck
export default function AdsLateral() {
  const styles = {
    container: {
      width: '200px',
      padding: '20px',
      backgroundColor: 'rgba(255,255,255,0.02)',
      borderRadius: '20px',
      border: '1px dashed rgba(255,255,255,0.1)',
      textAlign: 'center' as 'center',
      height: 'fit-content',
      position: 'sticky' as 'sticky',
      top: '40px'
    },
    label: { fontSize: '10px', opacity: 0.3, letterSpacing: '1px', marginBottom: '15px', display: 'block' },
    box: { 
      height: '250px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: '#3b82f6', 
      fontWeight: 'bold' as 'bold',
      fontSize: '12px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '12px',
      marginBottom: '15px'
    },
    btn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', width: '100%', fontWeight: 'bold' as 'bold' }
  };

  return (
    <div style={styles.container}>
      <span style={styles.label}>PUBLICIDADE</span>
      <div style={styles.box}>
        ESPAÇO DISPONÍVEL <br/> PARA ANUNCIANTE
      </div>
      <button style={styles.btn}>ANUNCIE AQUI</button>
    </div>
  );
}