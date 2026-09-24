import LiveIncidentFeed from '../components/dashboard/LiveIncidentFeed';
import ActionRequiredPanel from '../components/dashboard/ActionRequiredPanel';
import SelectedIncidentPanel from '../components/dashboard/SelectedIncidentPanel';

export default function Incidents() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">All Incidents &amp; Workflow</h2>
      <div className="grid grid-cols-2 gap-4" style={{ height: '520px' }}>
        <LiveIncidentFeed />
        <SelectedIncidentPanel />
      </div>
      <div style={{ height: '360px' }}>
        <ActionRequiredPanel />
      </div>
    </div>
  );
}