// Takoraa Dashboard — provider connections
function Providers() {
  const [provs, setProvs] = React.useState([
    { key: 'openai', name: 'OpenAI', models: '9 models', status: 'connected', synced: '2 min ago' },
    { key: 'anthropic', name: 'Anthropic', models: '6 models', status: 'connected', synced: '2 min ago' },
    { key: 'google', name: 'Google Gemini', models: 'Coming soon', status: 'integrating', synced: 'in progress' },
  ]);
  const STAT = {
    connected: { c: 'var(--ok)', bg: 'rgba(31,138,76,0.12)', icon: 'check_circle' },
    integrating: { c: '#2563eb', bg: 'rgba(37,99,235,0.12)', icon: 'refresh' },
    degraded: { c: '#b97500', bg: 'rgba(185,117,0,0.12)', icon: 'warning' },
    disconnected: { c: 'var(--on-surface-var)', bg: 'var(--surface-high)', icon: 'cancel' },
  };
  return (
    <div className="page">
      <PageHeader title="Provider connections" subtitle="Connect the model providers Takoraa is allowed to route to. Costs reconcile against each provider's billing API." />
      <div style={{ height: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {provs.map((p) => {
          const s = STAT[p.status];
          return (
            <div key={p.key} className="panel" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontWeight: 800, fontSize: 18, color: 'var(--on-surface-var)' }}>{p.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--on-surface-var)', marginTop: 3 }}>{p.models} · synced {p.synced}</div>
              </div>
              <span className="status-chip" style={{ background: s.bg, color: s.c }}><Icon name={s.icon} />{p.status}</span>
              <button className="btn btn-text" style={{ padding: '8px 10px' }}>{p.status === 'disconnected' ? 'Connect' : 'Manage'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
Object.assign(window, { Providers });
