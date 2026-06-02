// Takoraa Dashboard — client default controls
const JUDGE_DESC = {
  'Off': 'The judge never runs; responses are returned exactly as the model produced them.',
  'Suspicious Only': 'The judge runs only when hard checks mark a response suspicious.',
  'Sampled': 'The judge runs on a random sample of responses to estimate quality.',
  'Strict': 'The judge evaluates every response before it is returned.',
};
const POL_DESC = {
  Classification: 'Repeatable labels, routing classes, and simple category decisions.',
  Extraction: 'Stable structured fields from text, invoices, tickets, or JSON-like tasks.',
  Dynamic: 'Open-ended chat, tools, multimodal, code, deep reasoning, or long context.',
};
const PRESETS = [
  { key: 'use_defaults', icon: 'refresh', title: 'Use defaults', desc: 'Remove this client override.' },
  { key: 'disabled', icon: 'cancel', title: 'Disabled', desc: 'Turn off routing, cache, and pruning.' },
  { key: 'balanced', icon: 'balance', title: 'Balanced', desc: 'Use 50% pruning rollout with retry.' },
  { key: 'aggressive', icon: 'rocket', title: 'Aggressive', desc: 'Use 100% pruning rollout with retry.' },
];
const CTRL_DEFAULTS = {
  scope: 'Client defaults',
  routing: true,
  cache: true, cacheTtl: '3600',
  pol: { Classification: { on: true, ttl: '3600' }, Extraction: { on: true, ttl: '3600' }, Dynamic: { on: true, ttl: '3600' } },
  pruning: false, rollout: 100, minTokens: '900', aggressiveMin: '1800', retry: false, embedding: false,
  judge: 'Suspicious Only',
};

function CtrlToggle({ on, onClick }) { return <div className={`sw ${on ? 'on' : ''}`} onClick={onClick}></div>; }
function CtrlRow({ title, desc, on, onToggle }) {
  return (
    <div className="ctrl-row">
      <div><div className="ctrl-t">{title}</div><div className="ctrl-d">{desc}</div></div>
      <CtrlToggle on={on} onClick={onToggle} />
    </div>
  );
}
function TtlField({ value, onChange }) {
  return (
    <div className="field-m3" style={{ marginTop: 14 }}>
      <label>TTL seconds</label>
      <input className="ul" value={value} inputMode="numeric" onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Controls() {
  const [st, setSt] = React.useState(CTRL_DEFAULTS);
  const [saved, setSaved] = React.useState(CTRL_DEFAULTS);
  const [preset, setPreset] = React.useState('use_defaults');
  const dirty = JSON.stringify(st) !== JSON.stringify(saved);
  const savedIsDefault = JSON.stringify(saved) === JSON.stringify(CTRL_DEFAULTS);
  const set = (patch) => setSt((s) => ({ ...s, ...patch }));
  const setPol = (k, patch) => setSt((s) => ({ ...s, pol: { ...s.pol, [k]: { ...s.pol[k], ...patch } } }));

  const applyPreset = (k) => {
    setPreset(k);
    if (k === 'use_defaults') setSt(CTRL_DEFAULTS);
    else if (k === 'disabled') set({ routing: false, cache: false, pruning: false });
    else if (k === 'balanced') set({ routing: true, cache: true, pruning: true, rollout: 50, retry: true });
    else if (k === 'aggressive') set({ routing: true, cache: true, pruning: true, rollout: 100, retry: true });
  };

  return (
    <div className="page">
      <PageHeader title="Client default controls" subtitle="Fallback settings for API keys that do not have their own controls." />
      <div style={{ height: 24 }} />

      {/* Control scope */}
      <div className="panel" style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="field-m3" style={{ flex: 1, minWidth: 260 }}>
          <label>Control scope</label>
          <select className="ul" value={st.scope} onChange={(e) => set({ scope: e.target.value })}>
            <option>Client defaults</option>
            <option>Key: prod-gateway</option>
            <option>Key: batch-jobs</option>
          </select>
        </div>
        <div className="h-sub" style={{ maxWidth: 300, textAlign: 'right' }}>These settings are the fallback for app keys without overrides.</div>
      </div>
      <div style={{ height: 12 }} />

      {/* Status chips */}
      <div className="panel" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="ctrl-chip"><Icon name="receipt_long" size={16} /> Source: {st.scope === 'Client defaults' ? 'Defaults' : 'Override'}</span>
        <span className="ctrl-chip"><Icon name="tune" size={16} /> Profile: {preset === 'use_defaults' ? 'Defaults' : PRESETS.find((p) => p.key === preset).title}</span>
        <span className="ctrl-chip"><Icon name="timer" size={16} /> Last updated: {dirty ? 'Unsaved changes' : (savedIsDefault ? 'Defaults' : 'Saved')}</span>
        <button className="btn btn-outlined" style={{ marginLeft: 'auto', padding: '8px 16px' }}><Icon name="refresh" /> Refresh</button>
      </div>
      <div style={{ height: 16 }} />

      {/* Presets */}
      <div className="panel">
        <h3 className="sect-title" style={{ marginBottom: 14 }}>Presets</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {PRESETS.map((p) => (
            <div key={p.key} className={`preset ${preset === p.key ? 'on' : ''}`} onClick={() => applyPreset(p.key)}>
              <div className="preset-ic"><Icon name={p.icon} size={22} color="var(--primary)" /></div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 16 }} />

      {/* Routing + Cache */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="panel">
          <h3 className="sect-title" style={{ marginBottom: 16 }}>Model routing</h3>
          <CtrlRow title="Enable routing" desc="Auto models can route to lower-cost model tiers." on={st.routing} onToggle={() => set({ routing: !st.routing })} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel">
            <h3 className="sect-title" style={{ marginBottom: 16 }}>Response cache</h3>
            <CtrlRow title="Enable cache" desc="Reuse matching responses for repeated requests." on={st.cache} onToggle={() => set({ cache: !st.cache })} />
            <TtlField value={st.cacheTtl} onChange={(v) => set({ cacheTtl: v })} />
          </div>
          <div className="panel">
            <h3 className="sect-title" style={{ marginBottom: 8, textAlign: 'center' }}>Cache policies</h3>
            {Object.keys(st.pol).map((k, i) => (
              <div key={k}>
                {i > 0 && <hr className="divider" style={{ margin: '16px 0' }} />}
                <CtrlRow title={k} desc={POL_DESC[k]} on={st.pol[k].on} onToggle={() => setPol(k, { on: !st.pol[k].on })} />
                <TtlField value={st.pol[k].ttl} onChange={(v) => setPol(k, { ttl: v })} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 16 }} />

      {/* Context pruning */}
      <div className="panel">
        <h3 className="sect-title" style={{ marginBottom: 16 }}>Context pruning</h3>
        <CtrlRow title="Enable pruning" desc="Remove low-value conversation history before provider calls." on={st.pruning} onToggle={() => set({ pruning: !st.pruning })} />
        <div style={{ marginTop: 20 }}>
          <div className="ctrl-t" style={{ marginBottom: 12 }}>Rollout {st.rollout}%</div>
          <input type="range" className="ctrl-range" min="0" max="100" value={st.rollout} onChange={(e) => set({ rollout: +e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 22 }}>
          <div className="field-m3"><label>Min input tokens</label><input className="ul" value={st.minTokens} inputMode="numeric" onChange={(e) => set({ minTokens: e.target.value })} /></div>
          <div className="field-m3"><label>Aggressive min tokens</label><input className="ul" value={st.aggressiveMin} inputMode="numeric" onChange={(e) => set({ aggressiveMin: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 22 }}>
          <CtrlRow title="Retry with full context" desc="Fallback when a pruned response looks unsafe." on={st.retry} onToggle={() => set({ retry: !st.retry })} />
          <hr className="divider" style={{ margin: '16px 0' }} />
          <CtrlRow title="Embedding assist" desc="Use embeddings for borderline relevance checks." on={st.embedding} onToggle={() => set({ embedding: !st.embedding })} />
        </div>
      </div>
      <div style={{ height: 16 }} />

      {/* Quality judge */}
      <div className="panel">
        <h3 className="sect-title" style={{ marginBottom: 14 }}>Quality judge</h3>
        <div className="field-m3">
          <label>Judge mode</label>
          <select className="ul" value={st.judge} onChange={(e) => set({ judge: e.target.value })}>
            {['Off', 'Suspicious Only', 'Sampled', 'Strict'].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="h-sub" style={{ marginTop: 14 }}>{JUDGE_DESC[st.judge]}</div>
      </div>
      <div style={{ height: 22 }} />

      {/* Footer actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-outlined" onClick={() => { setSt(CTRL_DEFAULTS); setPreset('use_defaults'); }}><Icon name="refresh" /> Reset to defaults</button>
        <button className="btn btn-outlined" disabled={!dirty} onClick={() => setSt(saved)}><Icon name="undo" /> Discard changes</button>
        <button className="btn btn-filled" disabled={!dirty} onClick={() => setSaved(st)}><Icon name="save" /> Save changes</button>
      </div>
    </div>
  );
}
Object.assign(window, { Controls });
