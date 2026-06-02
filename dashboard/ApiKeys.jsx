// Takoraa Dashboard — API keys
function ApiKeys() {
  const [keys, setKeys] = React.useState([
    { name: 'prod-gateway', prefix: 'tk_live_a91c', created: 'Nov 12, 2025', last: '2 min ago', status: 'active' },
    { name: 'batch-jobs', prefix: 'tk_live_3f02', created: 'Dec 03, 2025', last: '1 min ago', status: 'active' },
    { name: 'staging', prefix: 'tk_live_77be', created: 'Jan 08, 2026', last: '3 hours ago', status: 'active' },
    { name: 'legacy-mobile', prefix: 'tk_live_0c4d', created: 'Aug 21, 2025', last: '28 days ago', status: 'revoked' },
  ]);
  const [reveal, setReveal] = React.useState(null);
  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <PageHeader title="API keys" subtitle="Issue and manage the keys your application uses to authenticate with the Takoraa gateway." />
        <button className="btn btn-filled"><Icon name="add" /> Create key</button>
      </div>
      <div style={{ height: 24 }} />
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr 0.6fr', padding: '14px 18px', borderBottom: '1px solid var(--outline-var)', background: 'var(--surface-high)' }}>
          {['Name', 'Key', 'Created', 'Last used', ''].map((h, i) => <div key={i} className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-var)' }}>{h}</div>)}
        </div>
        {keys.map((k, i) => (
          <div key={k.name} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr 0.6fr', padding: '16px 18px', alignItems: 'center', borderBottom: i < keys.length - 1 ? '1px solid var(--divider)' : 'none', opacity: k.status === 'revoked' ? 0.55 : 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{k.name}</div>
            <div className="mono" style={{ fontSize: 12.5, color: 'var(--on-surface-var)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {reveal === k.name ? `${k.prefix}_b82f1d09c4` : `${k.prefix}••••••••`}
              <Icon name={reveal === k.name ? 'visibility_off' : 'visibility'} size={16} color="var(--primary)" />
            </div>
            <div style={{ fontSize: 13, color: 'var(--on-surface-var)' }}>{k.created}</div>
            <div style={{ fontSize: 13, color: 'var(--on-surface-var)' }}>{k.last}</div>
            <div style={{ textAlign: 'right' }}><span className={`pill ${k.status === 'active' ? 'active' : 'inactive'}`}>{k.status}</span></div>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }} />
      <div className="panel" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(37,99,235,0.05)', borderColor: 'rgba(37,99,235,0.22)' }}>
        <Icon name="info" color="var(--primary)" />
        <div style={{ fontSize: 13, color: 'var(--on-surface-var)', lineHeight: 1.5 }}>
          <b style={{ color: 'var(--on-surface)' }}>Keys are shown once.</b> Store the full key in your secret manager at creation — only the prefix is retained here. Point your SDK's <span className="mono">baseURL</span> at <span className="mono">api.takoraa.ai/v1</span> and pass the key as your provider key.
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { ApiKeys });
