// Takoraa Dashboard — live request monitor
const REQUESTS = [
  { id: 'a91c4f2e', cache: false, quality: 'pass', opt: 'Model routing', model: 'haiku-4.5', requested: 'gpt-4o', key: 'prod-gateway', prefix: 'tk_live_a91c', tin: 3120, tout: 412, latency: 680, time: '14:32', reason: null },
  { id: 'b7720d11', cache: true, quality: 'pass', opt: null, model: 'sonnet-4.5', requested: 'sonnet-4.5', key: 'prod-gateway', prefix: 'tk_live_a91c', tin: 1840, tout: 0, latency: 12, time: '14:32', reason: null },
  { id: 'c3f02a88', cache: false, quality: 'flag', opt: 'Context pruning', model: 'gpt-4o', requested: 'gpt-4o', key: 'batch-jobs', prefix: 'tk_live_3f02', tin: 8200, tout: 1024, latency: 2140, time: '14:31', reason: 'Output below quality threshold' },
  { id: 'd5519e03', cache: false, quality: 'pass', opt: 'Model routing', model: 'haiku-4.5', requested: 'gpt-4o', key: 'prod-gateway', prefix: 'tk_live_a91c', tin: 640, tout: 188, latency: 410, time: '14:31', reason: null },
  { id: 'e1a8c7d4', cache: true, quality: null, opt: null, model: 'haiku-4.5', requested: 'haiku-4.5', key: 'staging', prefix: 'tk_live_77be', tin: 220, tout: 0, latency: 9, time: '14:30', reason: null },
];

function Requests() {
  const [sel, setSel] = React.useState(REQUESTS[0].id);
  const req = REQUESTS.find((r) => r.id === sel);
  return (
    <div className="page">
      <PageHeader title="Live request monitor" subtitle="Watch incoming request metadata, route decisions, cache reuse, and quality checks." />
      <div style={{ height: 24 }} />
      <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="podcasts" size={18} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Updated Jan 30, 14:32 | 5 visible</span>
        </div>
        <button className="btn btn-outlined" style={{ padding: '8px 16px' }}><Icon name="refresh" /> Refresh</button>
      </div>
      <div style={{ height: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <SummaryTile icon="receipt_long" label="Requests" value="5" />
        <SummaryTile icon="cached" label="Cache hits" value="2" />
        <SummaryTile icon="timer" label="Avg latency" value="650 ms" />
      </div>
      <div style={{ height: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 16, alignItems: 'start' }}>
        <div className="panel">
          <h3 className="sect-title" style={{ marginBottom: 14 }}>Live traffic</h3>
          {REQUESTS.map((r, i) => (
            <React.Fragment key={r.id}>
              <ReqRow r={r} sel={r.id === sel} onClick={() => setSel(r.id)} />
              {i < REQUESTS.length - 1 && <hr className="divider" style={{ margin: '14px 0' }} />}
            </React.Fragment>
          ))}
        </div>
        <ReqDetail r={req} />
      </div>
    </div>
  );
}

function SummaryTile({ icon, label, value }) {
  return (
    <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={20} color="var(--primary)" />
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-var)' }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{value}</div>
      </div>
    </div>
  );
}

function Chip({ label, icon, em }) {
  return <span className={`status-chip ${em ? 'em' : ''}`}><Icon name={icon} />{label}</span>;
}

function ReqRow({ r, sel, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: 10, borderRadius: 8, cursor: 'pointer', background: sel ? 'rgba(37,99,235,0.10)' : 'transparent' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 800 }}>Request ID: {r.id}</span>
        <Chip label={r.cache ? 'Cache hit' : 'Provider call'} icon={r.cache ? 'cached' : 'cloud'} em={r.cache} />
        {r.quality && <Chip label={r.quality === 'pass' ? 'Quality passed' : 'Quality flagged'} icon={r.quality === 'pass' ? 'verified' : 'report_problem'} em={r.quality === 'pass'} />}
        {r.opt && <Chip label={r.opt} icon="auto_graph" em />}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--on-surface-var)' }}>
        <span>Model: <b style={{ color: 'var(--on-surface)' }}>{r.model}</b></span>
        <span>Takoraa key: <b style={{ color: 'var(--on-surface)' }}>{r.key}</b></span>
        <span>Tokens: <b style={{ color: 'var(--on-surface)' }}>{(r.tin + r.tout).toLocaleString()}</b></span>
        <span>Time: <b style={{ color: 'var(--on-surface)' }}>Jan 30 {r.time}</b></span>
      </div>
    </div>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="stat" style={{ minWidth: 0 }}>
      <div className="l">{label}</div>
      <div className="v" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

function ReqDetail({ r }) {
  return (
    <div className="panel">
      <h3 className="sect-title">Request details</h3>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-var)', marginTop: 6 }}>REQUEST ID</div>
      <div className="mono" style={{ fontSize: 12, color: 'var(--on-surface-var)', marginTop: 2 }}>{r.id}-9f3b-4c2a-bd71</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        <DetailTile label="Time" value={`Jan 30, ${r.time}`} />
        <DetailTile label="Cache" value={r.cache ? 'Cache hit' : 'Provider call'} />
        <DetailTile label="Requested" value={r.requested} />
        <DetailTile label="Used" value={r.model} />
        <DetailTile label="Input tokens" value={r.tin.toLocaleString()} />
        <DetailTile label="Output tokens" value={r.tout.toLocaleString()} />
        <DetailTile label="Latency" value={`${r.latency} ms`} />
        <DetailTile label="Takoraa key" value={r.key} />
      </div>
      <div style={{ height: 18 }} />
      <div style={{ fontSize: 14, fontWeight: 800 }}>Quality check</div>
      <div style={{ marginTop: 10 }}>
        {!r.quality ? <span className="muted" style={{ fontSize: 14 }}>Not evaluated</span> : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <DetailTile label="Result" value={r.quality === 'pass' ? 'Quality passed' : 'Quality flagged'} />
            {r.reason && <DetailTile label="Reason" value={r.reason} />}
          </div>
        )}
      </div>
      <div style={{ height: 18 }} />
      <div style={{ fontSize: 14, fontWeight: 800 }}>Optimizations</div>
      <div style={{ marginTop: 10 }}>
        {r.opt ? (
          <div style={{ background: 'rgba(37,99,235,0.12)', borderRadius: 8, padding: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{r.opt}</span>
            <span style={{ fontSize: 12, color: 'var(--on-surface-var)' }}>{(Math.round(r.tin * 0.4)).toLocaleString()} tokens trimmed</span>
          </div>
        ) : <span className="muted" style={{ fontSize: 14 }}>No visible optimizations recorded.</span>}
      </div>
    </div>
  );
}
Object.assign(window, { Requests });
