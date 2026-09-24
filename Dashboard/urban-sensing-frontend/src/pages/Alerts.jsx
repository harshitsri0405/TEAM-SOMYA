import { useDashboardStore } from '../store/useDashboardStore';
import { Bell } from 'lucide-react';

export default function Alerts() {
  const incidents = useDashboardStore((s) => s.incidents);
  const anprAlerts = useDashboardStore((s) => s.anprAlerts);
  const all = [...incidents.map((i) => ({ ...i, kind: i.hazardType })), ...anprAlerts.map((a) => ({ ...a, kind: a.incidentType }))]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Alerts</h2>
      <div className="panel divide-y divide-base-border">
        {all.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No alerts yet</div>
        ) : (
          all.map((item) => (
            <div key={item.id} className="px-4 py-3 flex items-center gap-3 text-sm">
              <Bell size={14} className="text-accent-blue shrink-0" />
              <div>
                <div className="text-slate-700">{item.kind} — Bus {item.busId}</div>
                <div className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}