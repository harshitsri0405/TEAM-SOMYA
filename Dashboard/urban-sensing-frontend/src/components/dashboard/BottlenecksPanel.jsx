import { AlertOctagon } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

function congestionBadge(score) {
  if (score >= 0.85) return 'bg-risk-veryhigh text-white';
  if (score >= 0.7) return 'bg-risk-high text-white';
  return 'bg-risk-moderate text-slate-900';
}

export default function BottlenecksPanel() {
  const bottlenecks = useDashboardStore((s) => s.bottlenecks);

  return (
    <div className="panel h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-base-border">
        <AlertOctagon size={14} className="text-slate-400" />
        <h3 className="text-sm font-medium text-slate-800">Traffic Bottlenecks</h3>
      </div>
      <div className="overflow-y-auto flex-1">
        {bottlenecks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No high-congestion segments detected yet
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-white text-slate-400">
              <tr>
                <th className="text-left font-normal px-4 py-2">Road Segment</th>
                <th className="text-left font-normal px-2 py-2">Avg Speed</th>
                <th className="text-left font-normal px-2 py-2">Congestion</th>
              </tr>
            </thead>
            <tbody>
              {bottlenecks.slice(0, 10).map((b) => (
                <tr key={b.roadSegmentId} className="border-t border-base-border/60">
                  <td className="px-4 py-2 text-slate-700 font-mono">{b.roadSegmentId}</td>
                  <td className="px-2 py-2 text-slate-500">{b.avgSpeedKmph} km/h</td>
                  <td className="px-2 py-2">
                    <span className={`px-1.5 py-0.5 rounded-full ${congestionBadge(b.avgCongestion)}`}>
                      {b.avgCongestion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}