import { useState } from 'react';
import { MapPin, Cpu, Camera, Copy, X, UserPlus } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

const LIFECYCLE_STEPS = ['AI Detected', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

const SEVERITY_STYLE = {
  CRITICAL: 'bg-risk-veryhigh text-white',
  HIGH: 'bg-risk-high text-white',
  MODERATE: 'bg-risk-moderate text-slate-900'
};

const TEAMS = ['PWD Zone 1 Team', 'PWD Zone 2 Team', 'PWD Zone 3 Team', 'PWD Zone 4 Team', 'Traffic Police Unit'];

function severityFromConfidence(confidence) {
  if (confidence >= 0.9) return 'CRITICAL';
  if (confidence >= 0.85) return 'HIGH';
  return 'MODERATE';
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function SelectedIncidentPanel() {
  const incidents = useDashboardStore((s) => s.incidents);
  const selectedIncidentId = useDashboardStore((s) => s.selectedIncidentId);
  const selectIncident = useDashboardStore((s) => s.selectIncident);
  const updateIncidentStatus = useDashboardStore((s) => s.updateIncidentStatus);
  const assignIncident = useDashboardStore((s) => s.assignIncident);

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [team, setTeam] = useState(TEAMS[0]);
  const [eta, setEta] = useState('');

  const selected = incidents.find((inc) => inc.id === selectedIncidentId);

  if (!selected) {
    return (
      <div className="panel h-full flex items-center justify-center text-slate-400 text-xs p-4">
        Select an incident from the feed or map to see full details
      </div>
    );
  }

  const severity = severityFromConfidence(selected.confidence);
  const currentStepIdx = LIFECYCLE_STEPS.indexOf(selected.status);

  const advanceStatus = () => {
    if (currentStepIdx < LIFECYCLE_STEPS.length - 1) {
      updateIncidentStatus(selected.id, LIFECYCLE_STEPS[currentStepIdx + 1]);
    }
  };

  const confirmAssign = () => {
    assignIncident(selected.id, { assignedTo: team, eta: eta || 'Not set' });
    setShowAssignForm(false);
  };

  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-border">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_STYLE[severity]}`}>
              {severity}
            </span>
            <h3 className="text-sm font-medium text-slate-800">{selected.hazardType}</h3>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {selected.id.slice(0, 8)} · Detected at {formatTime(selected.timestamp)}
          </div>
        </div>
        <button onClick={() => selectIncident(null)} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-y-2 text-xs">
          <div className="flex items-start gap-1.5 text-slate-500">
            <MapPin size={13} className="mt-0.5 shrink-0" />
            <span>
              {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-500">
            <Cpu size={13} className="mt-0.5 shrink-0" />
            <span>Road Defect Detection v2.1</span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-500">
            <Camera size={13} className="mt-0.5 shrink-0" />
            <span>{selected.rawPayload?.camera_id ?? 'front_wide'}</span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-500">
            <Copy size={13} className="mt-0.5 shrink-0" />
            <span>Source: Bus {selected.busId}</span>
          </div>
        </div>

        {selected.assignedTo && (
          <div className="text-xs bg-accent-blue/5 border border-accent-blue/20 rounded-md p-2.5">
            <div className="flex justify-between text-slate-600">
              <span>Assigned To</span>
              <span className="font-medium text-slate-800">{selected.assignedTo}</span>
            </div>
            <div className="flex justify-between text-slate-600 mt-1">
              <span>ETA</span>
              <span className="font-medium text-slate-800">{selected.eta}</span>
            </div>
          </div>
        )}

        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">Lifecycle / Workflow</div>
          <div className="flex items-center">
            {LIFECYCLE_STEPS.map((step, idx) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                      idx <= currentStepIdx
                        ? 'bg-accent-blue text-white'
                        : 'bg-base-800 text-slate-400 border border-base-border'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-[9px] text-slate-400 whitespace-nowrap">{step}</span>
                </div>
                {idx < LIFECYCLE_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 ${idx < currentStepIdx ? 'bg-accent-blue' : 'bg-base-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {showAssignForm && (
          <div className="text-xs bg-base-800 rounded-md p-3 space-y-2">
            <label className="block text-slate-500">Assign to team</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full border border-base-border rounded-md px-2 py-1.5 text-slate-700"
            >
              {TEAMS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <label className="block text-slate-500">ETA (e.g. 4:00 PM)</label>
            <input
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              placeholder="4:00 PM"
              className="w-full border border-base-border rounded-md px-2 py-1.5 text-slate-700"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={confirmAssign}
                className="flex-1 bg-accent-blue text-white rounded-md py-1.5 font-medium"
              >
                Confirm Assign
              </button>
              <button
                onClick={() => setShowAssignForm(false)}
                className="px-3 rounded-md border border-base-border text-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-base-border flex gap-2">
        <button
          onClick={() => setShowAssignForm(true)}
          className="flex items-center justify-center gap-1.5 flex-1 text-xs font-medium py-2 rounded-md border border-base-border text-slate-600 hover:bg-base-800"
        >
          <UserPlus size={13} /> Assign / Reassign
        </button>
        <button
          onClick={advanceStatus}
          disabled={currentStepIdx === LIFECYCLE_STEPS.length - 1}
          className="flex-1 text-xs font-medium py-2 rounded-md bg-accent-blue text-white hover:bg-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentStepIdx === LIFECYCLE_STEPS.length - 1 ? 'Resolved' : `Advance to ${LIFECYCLE_STEPS[currentStepIdx + 1]}`}
        </button>
      </div>
    </div>
  );
}