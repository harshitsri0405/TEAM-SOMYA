import AnprAlertsPanel from '../components/dashboard/AnprAlertsPanel';

export default function AnprPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">ANPR Dashboard</h2>
      <div style={{ height: '520px' }}>
        <AnprAlertsPanel />
      </div>
    </div>
  );
}