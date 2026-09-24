import { Wifi, WifiOff, Database } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export default function NetworkStatusMonitor() {
  const network = useDashboardStore((s) => s.network);
  const toggleEdgeNode = useDashboardStore((s) => s.toggleEdgeNode);

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-800">Network Status</h3>
        <button
          onClick={toggleEdgeNode}
          className="text-[11px] text-slate-500 hover:text-slate-300"
          title="Simulate connectivity change"
        >
          Toggle
        </button>
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
          network.edgeNodeOnline
            ? 'bg-risk-low/10 text-risk-low'
            : 'bg-risk-high/10 text-risk-high'
        }`}
      >
        {network.edgeNodeOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        Edge Node {network.edgeNodeOnline ? 'Online' : 'Offline (Buffering)'}
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Database size={13} /> Local buffer
        </span>
        <span className={network.localBufferCount > 0 ? 'text-risk-high' : 'text-slate-400'}>
          {network.localBufferCount} events queued
        </span>
      </div>

      {!network.edgeNodeOnline && (
        <p className="text-[11px] text-slate-600 mt-2">
          Detections are being buffered locally and will sync once connectivity
          is restored.
        </p>
      )}
    </div>
  );
}