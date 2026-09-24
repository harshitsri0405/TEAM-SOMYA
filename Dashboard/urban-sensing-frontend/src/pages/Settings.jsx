import { useDashboardStore } from '../store/useDashboardStore';

export default function Settings() {
  const network = useDashboardStore((s) => s.network);
  const toggleEdgeNode = useDashboardStore((s) => s.toggleEdgeNode);
  const connectionStatus = useDashboardStore((s) => s.connectionStatus);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Settings</h2>

      <div className="panel p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-700 font-medium">Edge Node Connection</div>
          <div className="text-xs text-slate-400">Simulates bus connectivity for demo purposes</div>
        </div>
        <button
          onClick={toggleEdgeNode}
          className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-medium"
        >
          {network.edgeNodeOnline ? 'Set Offline' : 'Set Online'}
        </button>
      </div>

      <div className="panel p-4">
        <div className="text-sm text-slate-700 font-medium mb-2">Backend Connection</div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'live' ? 'bg-risk-low' : connectionStatus === 'connecting' ? 'bg-risk-high' : 'bg-risk-veryhigh'
            }`}
          />
          <span className="text-slate-500 capitalize">{connectionStatus}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">ws://localhost:4000</span>
        </div>
      </div>

      <div className="panel p-4">
        <div className="text-sm text-slate-700 font-medium mb-2">About</div>
        <p className="text-xs text-slate-500 leading-relaxed">
          AI-Powered Mobile Urban Sensing Platform — converts public transport buses into mobile
          sensing units using onboard cameras, GPS, and edge-AI, aggregated by a centralized
          urban intelligence platform for city authorities.
        </p>
      </div>
    </div>
  );
}