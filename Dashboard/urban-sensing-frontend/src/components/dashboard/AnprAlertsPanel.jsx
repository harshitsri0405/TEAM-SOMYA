import { ScanLine, TriangleAlert } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

const INCIDENT_LABELS = { hit_and_run: 'Hit & Run', rash_driving: 'Rash Driving' };

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AnprAlertsPanel() {
  const anprAlerts = useDashboardStore((s) => s.anprAlerts);
  const triggerDemoAnprAlert = useDashboardStore((s) => s.triggerDemoAnprAlert);

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-border">
        <div className="flex items-center gap-1.5">
          <ScanLine size={14} className="text-slate-400" />
          <h3 className="text-sm font-medium text-slate-800">ANPR / Incident Alerts</h3>
        </div>
        <button onClick={triggerDemoAnprAlert} className="text-[11px] text-accent-blue hover:underline">
          + Simulate alert
        </button>
      </div>
      <div className="overflow-y-auto flex-1 divide-y divide-base-border">
        {anprAlerts.map((a) => (
          <div key={a.id} className="px-4 py-2.5 text-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-risk-veryhigh font-medium">
                <TriangleAlert size={12} />
                {INCIDENT_LABELS[a.incidentType] ?? a.incidentType}
              </div>
              <div className="text-slate-500 mt-0.5">
                {formatTime(a.timestamp)} · Bus {a.busId} · {a.vehicleClass}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-slate-800">{a.plateNumber}</div>
              <div className="text-slate-400">{(a.plateConfidence * 100).toFixed(0)}% confidence</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}