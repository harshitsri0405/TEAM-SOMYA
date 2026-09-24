import { ArrowRight, Route } from 'lucide-react';
import { odFlows } from '../../data/routeData';

export default function OriginDestinationPanel() {
  const maxTrips = Math.max(...odFlows.map((f) => f.trips), 1);

  return (
    <div className="panel h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-base-border">
        <Route size={14} className="text-slate-400" />
        <h3 className="text-sm font-medium text-slate-800">Origin–Destination Traffic Patterns</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {odFlows.map((flow, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 text-slate-700">
                {flow.origin} <ArrowRight size={11} className="text-slate-400" /> {flow.destination}
              </span>
              <span className="text-slate-400">
                {flow.trips} trips ·{' '}
                <span className={flow.avgDelayMin > 20 ? 'text-risk-veryhigh' : 'text-risk-high'}>
                  {flow.avgDelayMin}m avg delay
                </span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-base-700 overflow-hidden">
              <div
                className="h-full bg-accent-teal rounded-full"
                style={{ width: `${(flow.trips / maxTrips) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}