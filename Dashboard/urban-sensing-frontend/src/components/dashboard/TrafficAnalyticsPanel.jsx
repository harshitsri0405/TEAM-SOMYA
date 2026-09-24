import { Car } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

const VEHICLE_LABELS = { car: 'Car', two_wheeler: '2-Wheeler', bus: 'Bus', truck: 'Truck', auto_rickshaw: 'Auto' };

export default function TrafficAnalyticsPanel() {
  const { vehicleCounts = {}, avgSpeed = 0, avgCongestion = 0 } = useDashboardStore((s) => s.vehicleDensity);
  const maxCount = Math.max(...Object.values(vehicleCounts), 1);

  return (
    <div className="panel p-4 h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-3">
        <Car size={14} className="text-slate-400" />
        <h3 className="text-sm font-medium text-slate-800">Vehicle Density &amp; Congestion</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="rounded-md bg-base-800 px-3 py-2">
          <div className="text-slate-400">Avg Traffic Speed</div>
          <div className="text-slate-800 font-semibold text-lg">{avgSpeed} km/h</div>
        </div>
        <div className="rounded-md bg-base-800 px-3 py-2">
          <div className="text-slate-400">Congestion Score</div>
          <div
            className={`font-semibold text-lg ${
              avgCongestion > 0.6 ? 'text-risk-veryhigh' : avgCongestion > 0.35 ? 'text-risk-high' : 'text-risk-low'
            }`}
          >
            {avgCongestion}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs flex-1 overflow-y-auto">
        {Object.keys(vehicleCounts).length === 0 ? (
          <div className="text-slate-400 text-center pt-4">Waiting for traffic samples…</div>
        ) : (
          Object.entries(vehicleCounts).map(([type, count]) => (
            <div key={type}>
              <div className="flex justify-between text-slate-500 mb-1">
                <span>{VEHICLE_LABELS[type] ?? type}</span>
                <span>{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-base-700 overflow-hidden">
                <div className="h-full bg-accent-blue rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}