import { FileJson } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export default function RawPayloadViewer() {
  const incidents = useDashboardStore((s) => s.incidents);
  const selectedIncidentId = useDashboardStore((s) => s.selectedIncidentId);
  const selected = incidents.find((inc) => inc.id === selectedIncidentId);

  return (
    <div className="panel p-4 h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-3">
        <FileJson size={14} className="text-slate-400" />
        <h3 className="text-sm font-medium text-slate-800">Processed Event Payload</h3>
      </div>
      {!selected ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select an incident to view its raw payload
        </div>
      ) : (
        <pre className="flex-1 overflow-auto text-[11px] leading-relaxed bg-slate-900 text-slate-200 rounded-md p-3 font-mono">
{JSON.stringify(selected.rawPayload, null, 2)}
        </pre>
      )}
    </div>
  );
}