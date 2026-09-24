import { useDashboardStore } from '../../store/useDashboardStore';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_STYLES = {
  'AI Detected': 'bg-slate-100 text-slate-500',
  Verified: 'bg-accent-blue/10 text-accent-blue',
  Assigned: 'bg-purple-100 text-purple-600',
  'In Progress': 'bg-risk-high/10 text-risk-high',
  Resolved: 'bg-risk-low/10 text-risk-low'
};

export default function RecentDetectionsTable() {
  const incidents = useDashboardStore((s) => s.incidents);
  const selectIncident = useDashboardStore((s) => s.selectIncident);
  const recent = incidents.slice(0, 6);

  return (
    <div className="panel h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-border">
        <h3 className="text-sm font-medium text-slate-800">Recent Detections</h3>
        <span className="text-[11px] text-accent-blue cursor-pointer hover:underline">View All</span>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-white text-slate-400">
            <tr>
              <th className="text-left font-normal px-4 py-1.5">Time</th>
              <th className="text-left font-normal px-2 py-1.5">Type</th>
              <th className="text-left font-normal px-2 py-1.5">Bus</th>
              <th className="text-left font-normal px-2 py-1.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((inc) => (
              <tr
                key={inc.id}
                onClick={() => selectIncident(inc.id)}
                className="cursor-pointer border-t border-base-border/60 hover:bg-base-800/60"
              >
                <td className="px-4 py-2 text-slate-500 font-mono">{formatTime(inc.timestamp)}</td>
                <td className="px-2 py-2 text-slate-700">{inc.hazardType}</td>
                <td className="px-2 py-2 text-slate-500">{inc.busId}</td>
                <td className="px-2 py-2">
                  <span className={`px-1.5 py-0.5 rounded-full ${STATUS_STYLES[inc.status]}`}>{inc.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}