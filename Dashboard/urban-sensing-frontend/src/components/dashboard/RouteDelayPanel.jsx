import { Clock } from 'lucide-react';
import { routeDelays } from '../../data/routeData';

export default function RouteDelayPanel() {
  return (
    <div className="panel h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-base-border">
        <Clock size={14} className="text-slate-400" />
        <h3 className="text-sm font-medium text-slate-800">Route Delay Estimation</h3>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-white text-slate-400">
            <tr>
              <th className="text-left font-normal px-4 py-2">Route</th>
              <th className="text-left font-normal px-2 py-2">Free-flow</th>
              <th className="text-left font-normal px-2 py-2">Actual</th>
              <th className="text-left font-normal px-2 py-2">Delay</th>
            </tr>
          </thead>
          <tbody>
            {routeDelays.map((r) => {
              const delay = r.actualMin - r.freeFlowMin;
              const delayPct = delay / r.freeFlowMin;
              return (
                <tr key={r.routeId} className="border-t border-base-border/60">
                  <td className="px-4 py-2.5">
                    <div className="text-slate-700 font-medium">{r.routeId}</div>
                    <div className="text-slate-400">{r.segment}</div>
                  </td>
                  <td className="px-2 py-2.5 text-slate-500">{r.freeFlowMin}m</td>
                  <td className="px-2 py-2.5 text-slate-700">{r.actualMin}m</td>
                  <td className="px-2 py-2.5">
                    <span
                      className={`font-medium ${
                        delayPct > 0.6 ? 'text-risk-veryhigh' : delayPct > 0.3 ? 'text-risk-high' : 'text-risk-low'
                      }`}
                    >
                      +{delay}m
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}