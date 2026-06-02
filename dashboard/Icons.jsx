// Takoraa Dashboard — inline SVG icon set (outlined, Material/Lucide style).
// Robust everywhere (no icon-font FOUT). Stroke-based, currentColor.
const ICON_PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  receipt_long: '<path d="M6 3h12v16l-2-1.2L14 19l-2-1.2L10 19l-2-1.2L6 19z"/><path d="M9 8h6M9 12h6"/>',
  key: '<circle cx="8" cy="14" r="4"/><path d="M11 11l9-9M17 5l2 2M14 8l2 2"/>',
  admin_panel_settings: '<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/><circle cx="12" cy="10" r="2"/><path d="M8.5 15.5a3.5 3 0 0 1 7 0"/>',
  hub: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4m0 0l-5 5m5-5l5 5"/>',
  tune: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  logout: '<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h11"/>',
  business_center: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M3 13h18"/>',
  calendar_today: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v3.5h-3.5"/>',
  payments: '<rect x="3" y="6" width="15" height="11" rx="2"/><path d="M21 9v9a2 2 0 0 1-2 2H7"/><circle cx="10.5" cy="11.5" r="2"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M9 18h6a3 3 0 0 0 3-3V8.5"/>',
  cached: '<path d="M5 9a7 7 0 0 1 12-3l2 2M19 15a7 7 0 0 1-12 3l-2-2M19 4v4h-4M5 20v-4h4"/>',
  content_cut: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 8l12 8M8 16L20 8"/>',
  verified_user: '<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/><path d="M9 11.5l2 2 4-4"/>',
  memory: '<rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  podcasts: '<circle cx="12" cy="9" r="2"/><path d="M7.5 14a6 6 0 1 1 9 0M5 17a9.5 9.5 0 1 1 14 0M11 13l-1 8h4l-1-8"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6"/>',
  cloud: '<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17.5 18z"/>',
  auto_graph: '<path d="M4 19h16M5 16l4-5 3 3 5-7"/><circle cx="17" cy="7" r="1.4"/>',
  verified: '<path d="M12 3l2 2.2 3-.4.4 3L20 10l-1.5 2.5L20 15l-2.6 2.2.4 3-3-.4L12 22l-2.8-2.2-3 .4.4-3L4 15l1.5-2.5L4 10l2.6-2.2-.4-3 3 .4z"/><path d="M9 12l2 2 4-4"/>',
  report_problem: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  add: '<path d="M12 5v14M5 12h14"/>',
  visibility: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  visibility_off: '<path d="M4 4l16 16M9.5 9.5a3 3 0 0 0 4.2 4.2M6.5 6.7C3.9 8.2 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 4-.9M10 5.2A9.6 9.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-2.4 3.1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  save: '<path d="M5 4h12l3 3v13H4V5a1 1 0 0 1 1-1z"/><path d="M8 4v5h7M8 14h8v6H8z"/>',
  data_object: '<path d="M9 4c-2 0-3 1-3 3v2c0 1.5-.8 2-2 2 1.2 0 2 .5 2 2v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 1.5.8 2 2 2-1.2 0-2 .5-2 2v2c0 2-1 3-3 3"/>',
  person_add: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0M18 8v6M15 11h6"/>',
  check_circle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  warning: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  cancel: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  balance: '<path d="M12 4v15M8 19h8M4 8l16-3"/><path d="M4 8l-2.2 5a2.2 2.2 0 0 0 4.4 0zM20 5l-2.2 5a2.2 2.2 0 0 0 4.4 0z"/>',
  rocket: '<path d="M12 3c2.5 2 4 5 4 8l-2 2.5h-4L8 11c0-3 1.5-6 4-8z"/><path d="M8 13.5l-3 1.2 1.2 3M16 13.5l3 1.2-1.2 3M10 18l2 3 2-3"/><circle cx="12" cy="9" r="1.3"/>',
  undo: '<path d="M9 7L4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-2"/>',
};

function Icon({ name, size = 22, color = 'currentColor' }) {
  const inner = ICON_PATHS[name] || ICON_PATHS.info;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', flex: 'none', verticalAlign: 'middle' }}
      dangerouslySetInnerHTML={{ __html: inner }} />
  );
}
Object.assign(window, { Icon, ICON_PATHS });
