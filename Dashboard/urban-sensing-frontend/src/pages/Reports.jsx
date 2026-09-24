import { useDashboardStore } from '../store/useDashboardStore';
import { FileText, Download } from 'lucide-react';

export default function Reports() {
  const kpis = useDashboardStore((s) => s.kpis);
  const incidents = useDashboardStore((s) => s.incidents);
  const riskByType = useDashboardStore((s) => s.riskByType);
  const duplicateStats = useDashboardStore((s) => s.duplicateStats);

  const downloadCsv = () => {
    const header = 'Timestamp,Hazard Type,Confidence,Bus,Status\n';
    const rows = incidents
      .map((i) => `${i.timestamp},${i.hazardType},${i.confidence},${i.busId},${i.status}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Reports</h2>
        <button
          onClick={downloadCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-medium"
        >
          <Download size={13} /> Export Incident CSV
        </button>
      </div>

      <div className="panel p-6">
        <div className="flex items-center gap-2 mb-4 text-slate-700">
          <FileText size={16} />
          <span className="font-medium">Daily Summary</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-slate-400">Total Detections</div>
            <div className="text-2xl font-semibold text-slate-800">{kpis.totalDetections}</div>
          </div>
          <div>
            <div className="text-slate-400">Active Bus Nodes</div>
            <div className="text-2xl font-semibold text-slate-800">{kpis.activeBusNodes}</div>
          </div>
          <div>
            <div className="text-slate-400">Offline Nodes</div>
            <div className="text-2xl font-semibold text-slate-800">{kpis.offlineBusNodes}</div>
          </div>
          <div>
            <div className="text-slate-400">Duplicates Removed</div>
            <div className="text-2xl font-semibold text-risk-veryhigh">{duplicateStats.duplicatesRemoved}</div>
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <div className="font-medium text-slate-700 mb-3">Risk Breakdown by Type</div>
        <div className="space-y-2 text-sm">
          {Object.entries(riskByType).length === 0 ? (
            <div className="text-slate-400 text-xs">No data yet</div>
          ) : (
            Object.entries(riskByType).map(([type, count]) => (
              <div key={type} className="flex justify-between text-slate-600">
                <span>{type.replace(/_/g, ' ')}</span>
                <span className="font-medium text-slate-800">{count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}