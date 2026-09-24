import { useDashboardStore } from '../../store/useDashboardStore';

// Confidence >= 0.9 reads as high-severity red, matches Image 3's badge logic
const STATUS_STYLES = {
  'AI Detected': 'bg-slate-500/15 text-slate-300',
  Verified: 'bg-accent-blue/15 text-accent-blue',
  Assigned: 'bg-purple-400/15 text-purple-300',
  'In Progress': 'bg-risk-high/15 text-risk-high',
  Resolved: 'bg-risk-low/15 text-risk-low'
};

const STATUS_FLOW = ['AI Detected', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LiveIncidentFeed() {
  const incidents = useDashboardStore((s) => s.incidents);
    const filters = useDashboardStore((s) => s.filters);

  const filteredIncidents = incidents.filter((inc) => {
    if (filters.hazardType !== 'All' && inc.hazardType !== filters.hazardType) return false;
    if (filters.status !== 'All' && inc.status !== filters.status) return false;
    return true;
  });
  
  const selectedIncidentId = useDashboardStore((s) => s.selectedIncidentId);
  const selectIncident = useDashboardStore((s) => s.selectIncident);
  const updateIncidentStatus = useDashboardStore((s) => s.updateIncidentStatus);

  const advanceStatus = (inc, e) => {
    e.stopPropagation();
    const idx = STATUS_FLOW.indexOf(inc.status);
    if (idx < STATUS_FLOW.length - 1) {
      updateIncidentStatus(inc.id, STATUS_FLOW[idx + 1]);
    }
  };

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-border">
        <h3 className="text-sm font-medium text-slate-800">Live Incident Feed</h3>
        <span className="text-[11px] text-slate-500">{filteredIncidents.length} events</span>
      </div>

      <div className="overflow-y-auto flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-base-850 text-slate-500 text-[11px]">
            <tr>
              <th className="text-left font-normal px-4 py-2">Timestamp</th>
              <th className="text-left font-normal px-2 py-2">Hazard Type</th>
              <th className="text-left font-normal px-2 py-2">Confidence</th>
              <th className="text-left font-normal px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((inc) => (
              <tr
                key={inc.id}
                onClick={() => selectIncident(inc.id)}
                className={`cursor-pointer border-t border-base-border/60 hover:bg-base-800/60 transition-colors ${
                  selectedIncidentId === inc.id ? 'bg-accent-blue/5' : ''
                }`}
              >
                <td className="px-4 py-2.5 text-slate-400 font-mono">{formatTime(inc.timestamp)}</td>
                <td className="px-2 py-2.5 text-slate-700">{inc.hazardType}</td>
                <td className="px-2 py-2.5">
                  <span
                    className={
                      inc.confidence >= 0.9 ? 'text-risk-veryhigh' : 'text-risk-high'
                    }
                  >
                    {(inc.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <button
                    onClick={(e) => advanceStatus(inc, e)}
                    className={`px-2 py-0.5 rounded-full text-[11px] ${STATUS_STYLES[inc.status]}`}
                    title="Click to advance status"
                  >
                    {inc.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}