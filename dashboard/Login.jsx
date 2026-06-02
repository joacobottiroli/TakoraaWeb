// Takoraa Dashboard — login screen
function Login({ onLogin }) {
  const [mode, setMode] = React.useState('customer');
  const instruction = 'Verify your dashboard admin key to open the dashboard.';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: 420, maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <img src="../assets/takoraa-logo-horizontal.png" alt="Takoraa" style={{ width: 230 }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 16, color: 'var(--on-surface-var)', marginBottom: 24 }}>AI optimization dashboard</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div className="seg">
            <button className="on"><Icon name="business_center" size={18} /> Customer</button>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--on-surface-var)', margin: '0 0 24px', lineHeight: 1.5 }}>{instruction}</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field">
            <label>Backend URL</label>
            <input className="input" defaultValue="https://api.takoraa.ai" />
          </div>
          <div className="field">
            <label>Dashboard admin key</label>
            <input className="input mono" type="password" defaultValue="tk_live_demo_key_4821" />
          </div>
          <button type="submit" className="btn btn-filled" style={{ justifyContent: 'center', marginTop: 8, padding: '13px 20px' }}>
            Verify API key
          </button>
        </form>
      </div>
    </div>
  );
}
Object.assign(window, { Login });
