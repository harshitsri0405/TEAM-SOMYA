import { ImageOff, Camera } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

// Shows the frame/thumbnail for whichever incident is currently sele
// cted
// in the Live Incident Feed table or the map markers.
export default function DetectionSnapshot() {
  const incidents = useDashboardStore((s) => s.incidents);
  const selectedIncidentId = useDashboardStore((s) => s.selectedIncidentId);
  const selected = incidents.find((inc) => inc.id === selectedIncidentId);

  return (
    <div className="panel p-4 h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-3">
        <Camera size={14} className="text-slate-400" />
        <h3 className="text-sm font-medium text-slate-800">Detection Snapshot</h3>
      </div>

      {!selected ? (
        <div className="flex-1 flex items-center justify-center text-slate-600 text-xs">
          Select an incident to preview
        </div>
      ) : (
        <>
          <div className="flex-1 rounded-md bg-base-900 border border-base-border flex items-center justify-center overflow-hidden">
            {selected.thumbnail ? (
              <img
                src={selected.thumbnail}
                alt={selected.hazardType}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-600">
                <ImageOff size={22} />
                <span className="text-[11px]">No frame captured yet</span>
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Incident</span>
              <span className="text-slate-700">{selected.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hazard</span>
              <span className="text-slate-700">{selected.hazardType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Source Bus</span>
              <span className="text-slate-700">{selected.busId}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}