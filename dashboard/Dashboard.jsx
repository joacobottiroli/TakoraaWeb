// Takoraa Dashboard — provider spend dashboard
const MODEL_COLORS = ['#4157A6','#8B5A7E','#557064','#E0B84D','#B65A4B','#5D7FB1','#2F827C'];
const RANGE_LABELS = {
  MTD: 'Jan 1, 2026 – Jan 30, 2026',
  '7D': 'Jan 24, 2026 – Jan 30, 2026',
  '30D': 'Jan 1, 2026 – Jan 30, 2026',
  '90D': 'Nov 1, 2025 – Jan 30, 2026',
};

function Dashboard() {
  const [range, setRange] = React.useState('30D');
  const models = [
    { name: 'haiku-4.5', v: 612000 }, { name: 'sonnet-4.5', v: 388000 },
    { name: 'haiku-3.5', v: 174000 }, { name: 'gpt-4o-mini', v: 86000 },
    { name: 'gpt-4o', v: 24902 },
  ];
  const total = models.reduce((a, m) => a + m.v, 0);
  const opt = [
    { key: 'Model routing', icon: 'route', desc: 'Spend routed through lower-cost models.', saved: 1940, count: 742000, active: true },
    { key: 'Cache reuse', icon: 'cached', desc: 'Spend served from cache on repeated calls.', saved: 612, count: 496000, active: true },
    { key: 'Context pruning', icon: 'content_cut', desc: 'Spend on trimmed low-value context.', saved: 233, count: 318000, active: true },
  ];
  const optTotal = opt.reduce((a, o) => a + o.saved, 0);
  const maxSaved = Math.max(...opt.map((o) => o.saved));
  const keys = [
    { name: 'prod-gateway', prefix: 'tk_live_a91c', spend: 2840.12 },
    { name: 'staging', prefix: 'tk_live_77be', spend: 0.94 },
    { name: 'batch-jobs', prefix: 'tk_live_3f02', spend: 1341.34 },
  ];

  return (
    <div className="page">
      <PageHeader title="Provider spend dashboard" subtitle="Track provider spend, token usage, and routing activity across the selected reporting window." />
      <div style={{ height: 24 }} />
      {/* Controls */}
      <div className="panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="calendar_today" size={18} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>{RANGE_LABELS[range]}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['MTD', '7D', '30D', '90D'].map((r) => (
            <button key={r} className={`chip ${range === r ? 'sel' : ''}`} onClick={() => setRange(r)}>{r}</button>
          ))}
          <button className="btn btn-outlined" style={{ padding: '8px 16px' }}><Icon name="refresh" /> Refresh</button>
        </div>
      </div>
      <div style={{ height: 16 }} />
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="metric">
          <div className="metric-head"><Icon name="payments" /><span className="metric-label">Provider spend</span></div>
          <div className="metric-value">$4,182.40</div>
          <div className="metric-detail">Provider actual · reconciled through Jan 30</div>
        </div>
        <div className="metric">
          <div className="metric-head"><Icon name="receipt_long" /><span className="metric-label">Requests</span></div>
          <div className="metric-value">1,284,902</div>
          <div className="metric-detail">Cache hit rate 38.6%</div>
        </div>
      </div>
      <div style={{ height: 16 }} />
      {/* Optimization breakdown */}
      <h2 className="sect-title-lg">Optimization breakdown</h2>
      <p className="h-sub" style={{ marginBottom: 16 }}>Spend handled by each optimization type across the selected reporting window.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="bar-panel">
          <h3 className="sect-title" style={{ marginBottom: 14 }}>Spend by optimization</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, height: 180, padding: '0 8px' }}>
            {opt.map((o) => (
              <div key={o.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface-var)' }}>${o.saved.toLocaleString()}</div>
                <div style={{ width: 30, borderRadius: 6, background: 'var(--primary)', height: `${(o.saved / maxSaved) * 130}px` }}></div>
                <div style={{ fontSize: 11, color: 'var(--on-surface-var)' }}>{o.key.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3 className="sect-title" style={{ marginBottom: 16 }}>Optimization impact</h3>
          {opt.map((o, i) => (
            <React.Fragment key={o.key}>
              <OptRow o={o} share={o.saved / optTotal} />
              {i < opt.length - 1 && <hr className="divider" style={{ margin: '16px 0' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{ height: 16 }} />
      {/* Requests by model + quality */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="bar-panel">
          <h3 className="sect-title" style={{ marginBottom: 16 }}>Requests by model</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Donut models={models} total={total} />
            <div style={{ flex: 1 }}>
              {models.map((m, i) => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: MODEL_COLORS[i] }}></span>
                  <span style={{ fontSize: 13, flex: 1 }}>{m.name}</span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--on-surface-var)' }}>{Math.round(m.v / total * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><Icon name="verified_user" size={20} color="var(--primary)" /><h3 className="sect-title">Quality checks</h3></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <div className="stat"><div className="l">Evaluated requests</div><div className="v">128,490</div></div>
            <div className="stat"><div className="l">Quality pass rate</div><div className="v">99.1%</div></div>
            <div className="stat"><div className="l">Fallback rate</div><div className="v">0.8%</div></div>
            <div className="stat"><div className="l">Cost / accepted</div><div className="v">$0.0031</div></div>
          </div>
        </div>
      </div>
      <div style={{ height: 16 }} />
      {/* Spend by API key */}
      <div className="panel">
        <h3 className="sect-title" style={{ marginBottom: 14 }}>Spend by API key</h3>
        {keys.map((k, i) => (
          <React.Fragment key={k.name}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 3 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{k.name}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--on-surface-var)', marginTop: 3 }}>{k.prefix}...</div>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--on-surface-var)' }}>{k.spend < 1 ? 'Est. spend' : 'Provider spend'}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>${k.spend.toFixed(2)}</div>
              </div>
            </div>
            {i < keys.length - 1 && <hr className="divider" style={{ margin: '16px 0' }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function OptRow({ o, share }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Icon name={o.icon} size={18} color="var(--primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, flex: 1 }}>{o.key}</span>
            <span className="pill active">Active</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--on-surface-var)', marginTop: 4 }}>{o.desc}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <div className="stat"><div className="l">Spend</div><div className="v">${o.saved.toLocaleString()}</div></div>
        <div className="stat"><div className="l">Requests</div><div className="v">{o.count.toLocaleString()}</div></div>
        <div className="stat"><div className="l">Share</div><div className="v">{Math.round(share * 100)}%</div></div>
      </div>
    </div>
  );
}

function Donut({ models, total }) {
  let acc = 0;
  const segs = models.map((m, i) => {
    const start = acc / total * 360; acc += m.v;
    const end = acc / total * 360;
    return `${MODEL_COLORS[i]} ${start}deg ${end}deg`;
  });
  return (
    <div style={{ width: 148, height: 148, borderRadius: '50%', background: `conic-gradient(${segs.join(',')})`, flex: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 32, borderRadius: '50%', background: 'var(--surface)' }}></div>
    </div>
  );
}
Object.assign(window, { Dashboard });
