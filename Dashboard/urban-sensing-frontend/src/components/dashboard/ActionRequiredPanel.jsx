import { useDashboardStore } from '../../store/useDashboardStore';

const SEVERITY_STYLE = {
  CRITICAL: 'bg-risk-veryhigh text-white',
  HIGH: 'bg-risk-high text-white',
  MODERATE: 'bg-risk-moderate text-slate-900'
};

// Extracts the hazard keyword from a label like "Severe Waterlogging — ORR"
// so we can try to match it against a live incident's hazardType.
function extractKeyword(label) {
  return label.split('—')[0].trim().toLowerCase();
}

export default function ActionRequiredPanel() {
  const items = useDashboardStore((s) => s.actionRequired);
  const incidents = useDashboardStore((s) => s.incidents);
  const selectIncident = useDashboardStore((s) => s.selectIncident);
  const dismissActionItem = useDashboardStore((s) => s.dismissActionItem);
  const assignIncident = useDashboardStore((s) => s.assignIncident);

  const handleView = (item) => {
    const keyword = extractKeyword(item.label);
    const match = incidents.find(
      (inc) =>
        keyword.includes(inc.hazardType.toLowerCase()) ||
        inc.hazardType.toLowerCase().includes(keyword.split(' ')[0])
    );

    if (match) {
      selectIncident(match.id);
    } else if (incidents[0]) {
      // No exact live match (these are static demo action items) —
      // fall back to opening the most recent live incident so "View"
      // always does something visible in the Selected Incident panel.
      selectIncident(incidents[0].id);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssign = (item) => {
    const keyword = extractKeyword(item.label);
    const match = incidents.find(
      (inc) =>
        keyword.includes(inc.hazardType.toLowerCase()) ||
        inc.hazardType.toLowerCase().includes(keyword.split(' ')[0])
    );

    if (match) {
      assignIncident(match.id, { assignedTo: 'PWD Zone 4 Team', eta: 'Pending confirmation' });
      selectIncident(match.id);
    }

    dismissActionItem(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-border">
        <h3 className="text-sm font-medium text-slate-800">Action Required (Top Priority)</h3>
        <span className="text-[11px] text-accent-blue cursor-pointer hover:underline">View All</span>
      </div>
      <div className="overflow-y-auto flex-1 divide-y divide-base-border">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400">
            All caught up — no pending actions
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_STYLE[item.severity]}`}>
                  {item.severity}
                </span>
                <div>
                  <div className="text-slate-700">{item.label}</div>
                  <div className="text-slate-400">
                    {(item.confidence * 100).toFixed(0)}% confidence · {item.ageMinutes} mins ago
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => handleView(item)}
                  className="px-2 py-1 rounded-md border border-base-border text-slate-500 hover:bg-base-800"
                >
                  View
                </button>
                <button
                  onClick={() => handleAssign(item)}
                  className="px-2 py-1 rounded-md bg-accent-blue text-white hover:bg-accent-blue/90"
                >
                  Assign
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}