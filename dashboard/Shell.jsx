// Takoraa Dashboard — shell primitives: Sidebar (Icon comes from Icons.jsx)
const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'requests', label: 'Requests', icon: 'receipt_long' },
  { id: 'apiKeys', label: 'API keys', icon: 'key' },
  { id: 'access', label: 'Dashboard access', icon: 'admin_panel_settings' },
  { id: 'providers', label: 'Provider connections', icon: 'hub' },
  { id: 'controls', label: 'Controls', icon: 'tune' },
];

function Sidebar({ active, onSelect, onLogout, lang, setLang }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><img src="../assets/takoraa-logo-horizontal.png" alt="Takoraa" /></div>
      <nav>
        {SECTIONS.map((s) => (
          <div key={s.id} className={`nav-item ${active === s.id ? 'active' : ''}`} onClick={() => onSelect(s.id)}>
            <Icon name={s.icon} />
            <span className="lbl">{s.label}</span>
          </div>
        ))}
      </nav>
      <div className="nav-spacer"></div>
      <div className="lang">
        <span className="lab">Language</span>
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} title="English">🇬🇧</button>
        <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')} title="Spanish">🇪🇸</button>
      </div>
      <div className="account">
        <div className="nm">Northwind AI</div>
        <div className="pl">Scale · monthly</div>
        <button className="btn btn-outlined" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={onLogout}>
          <Icon name="logout" /> Log out
        </button>
      </div>
    </aside>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="h-title">{title}</h1>
      <p className="h-sub">{subtitle}</p>
    </div>
  );
}

Object.assign(window, { Sidebar, PageHeader, SECTIONS });
