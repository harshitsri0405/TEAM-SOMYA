import { useNavigate } from 'react-router-dom';
import { Bus, AlertTriangle, Siren, Car, ShieldAlert, BellRing } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

const CARD_CONFIG = [
  {
    key: 'activeBuses',
    label: 'Active Buses',
    icon: Bus,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
    getValue: (s) => s.kpis.activeBusNodes,
    getSub: (s) => `${s.kpis.offlineBusNodes} Offline`,
    delta: '+8% vs yesterday',
    to: '/bus-fleet'
  },
  {
    key: 'detectedRisks',
    label: 'Detected Risks (Total)',
    icon: AlertTriangle,
    color: 'text-risk-high',
    bg: 'bg-risk-high/10',
    getValue: () => 312,
    getSub: () => 'High+Critical (36%)',
    delta: '+14% vs yesterday',
    to: '/incidents'
  },
  {
    key: 'criticalIssues',
    label: 'Critical Issues',
    icon: Siren,
    color: 'text-risk-veryhigh',
    bg: 'bg-risk-veryhigh/10',
    getValue: () => 62,
    getSub: () => 'Unresolved: 62',
    delta: '+10% vs yesterday',
    to: '/incidents'
  },
  {
    key: 'trafficCongestion',
    label: 'Traffic Congestion',
    icon: Car,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    getValue: () => 28,
    getSub: () => 'Severe: 8',
    delta: '+9% vs yesterday',
    to: '/analytics'
  },
  {
    key: 'activeIncidents',
    label: 'Active Incidents',
    icon: ShieldAlert,
    color: 'text-accent-teal',
    bg: 'bg-accent-teal/10',
    getValue: () => 15,
    getSub: () => 'In Progress: 9',
    delta: '-6% vs yesterday',
    deltaDown: true,
    to: '/incidents'
  },
  {
    key: 'unresolvedAlerts',
    label: 'Unresolved Alerts',
    icon: BellRing,
    color: 'text-risk-veryhigh',
    bg: 'bg-risk-veryhigh/10',
    getValue: () => 34,
    getSub: () => 'Pending: 34',
    delta: '+11% vs yesterday',
    to: '/alerts'
  }
];

export function ExecutiveKpiStrip() {
  const store = useDashboardStore();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-6 gap-3">
      {CARD_CONFIG.map(({ key, label, icon: Icon, color, bg, getValue, getSub, delta, deltaDown, to }) => (
        <button
          key={key}
          onClick={() => navigate(to)}
          className="panel p-3.5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`w-8 h-8 rounded-md flex items-center justify-center ${bg}`}>
              <Icon size={16} className={color} />
            </span>
            <span className={`text-[11px] ${deltaDown ? 'text-risk-low' : 'text-slate-500'}`}>
              {delta}
            </span>
          </div>
          <div className="text-2xl font-semibold text-slate-800 leading-none">
            {getValue(store)}
          </div>
          <div className="text-xs text-slate-500 mt-1">{label}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{getSub(store)}</div>
        </button>
      ))}
    </div>
  );
}