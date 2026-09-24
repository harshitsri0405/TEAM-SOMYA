import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  AlertTriangle,
  ScanLine,
  Bell,
  FileText,
  Bus,
  Users,
  Settings as SettingsIcon,
  Radio
} from 'lucide-react';

const NAV_SECTIONS = [
  { items: [{ label: 'Dashboard', icon: LayoutDashboard, to: '/' }] },
  { items: [{ label: 'Live Risk Map', icon: MapPin, to: '/live-map' }] },
  { label: 'Analytics', items: [{ label: 'Traffic, Road & Infra Analytics', icon: BarChart3, to: '/analytics' }] },
  { label: 'Incidents', items: [{ label: 'All Incidents & Workflow', icon: AlertTriangle, to: '/incidents' }] },
  { label: 'Vehicles (ANPR)', items: [{ label: 'ANPR Dashboard', icon: ScanLine, to: '/anpr' }] },
  {
    items: [
      { label: 'Alerts', icon: Bell, to: '/alerts' },
      { label: 'Reports', icon: FileText, to: '/reports' },
      { label: 'Bus Fleet', icon: Bus, to: '/bus-fleet' },
      { label: 'Users & Roles', icon: Users, to: '/users' },
      { label: 'Settings', icon: SettingsIcon, to: '/settings' }
    ]
  }
];

function SystemStatus() {
  const rows = [
    ['Data Freshness', 'LIVE', 'text-risk-low'],
    ['Auto Sync', 'ON', 'text-risk-low'],
    ['Time Source', 'GPS', 'text-slate-600'],
    ['Server Status', 'Healthy', 'text-risk-low']
  ];
  return (
    <div className="panel p-3 text-xs">
      <div className="flex items-center gap-1.5 mb-2 text-slate-500">
        <Radio size={12} className="text-risk-low" />
        <span>System Status</span>
      </div>
      <div className="space-y-1.5">
        {rows.map(([label, value, color]) => (
          <div key={label} className="flex justify-between">
            <span className="text-slate-400">{label}</span>
            <span className={color}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-full border-r border-base-border bg-white flex flex-col">
      <div className="px-4 py-4 border-b border-base-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent-blue/10 flex items-center justify-center">
            <Bus size={18} className="text-accent-blue" />
          </div>
          <div className="leading-tight">
  <div className="text-sm font-semibold text-slate-800">NagarNetra</div>
  <div className="text-xs text-slate-500">AI-Powered Urban Sensing</div>
</div>
        </div>
        <div className="text-[11px] text-accent-teal mt-1.5">City Digital Risk Map</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i}>
            {section.label && (
              <div className="px-2 mb-1 text-[10px] uppercase tracking-wide text-slate-400">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ label, icon: Icon, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-accent-blue/10 text-accent-blue font-medium'
                        : 'text-slate-500 hover:bg-base-800 hover:text-slate-700'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-base-border">
        <SystemStatus />
      </div>
    </aside>
  );
}