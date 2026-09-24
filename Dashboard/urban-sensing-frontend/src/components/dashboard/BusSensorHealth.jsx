import { Satellite, Camera, Cpu, Wifi } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

function ringColor(value) {
  if (value >= 95) return '#16a34a';
  if (value >= 85) return '#eab308';
  return '#dc2626';
}

function HealthRing({ value, icon: Icon, label }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = ringColor(value);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={13} className="text-slate-500 mb-0.5" />
          <span className="text-[11px] font-semibold text-slate-800">{value}%</span>
        </div>
      </div>
      <span className="text-[11px]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// Averages each health metric across all buses that have sent a heartbeat.
// Falls back to sensible demo defaults when no bus has heartbeated yet
// (e.g. simulator hasn't sent one, or it's the very first page load).
function averageHealth(buses) {
  if (!buses || buses.length === 0) {
    return { gps: 98, camera: 96, aiDevice: 94, network: 88 };
  }
  const sums = buses.reduce(
    (acc, b) => ({
      gps: acc.gps + (b.health?.gps ?? 0),
      camera: acc.camera + (b.health?.camera ?? 0),
      aiDevice: acc.aiDevice + (b.health?.aiDevice ?? 0),
      network: acc.network + (b.health?.network ?? 0)
    }),
    { gps: 0, camera: 0, aiDevice: 0, network: 0 }
  );
  const n = buses.length;
  return {
    gps: Math.round(sums.gps / n),
    camera: Math.round(sums.camera / n),
    aiDevice: Math.round(sums.aiDevice / n),
    network: Math.round(sums.network / n)
  };
}

export default function BusSensorHealth() {
  const fleetStatus = useDashboardStore((s) => s.fleetStatus);
  const avg = averageHealth(fleetStatus.buses);

  const sensors = [
    { key: 'gps', label: 'GPS', value: avg.gps, icon: Satellite },
    { key: 'camera', label: 'Camera', value: avg.camera, icon: Camera },
    { key: 'aiDevice', label: 'AI Device', value: avg.aiDevice, icon: Cpu },
    { key: 'network', label: 'Network', value: avg.network, icon: Wifi }
  ];

  const activeCount = fleetStatus.activeCount || 108;
  const offlineCount = fleetStatus.offlineCount || 10;

  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-slate-800 mb-3">Bus &amp; Sensor Health</h3>
      <div className="flex justify-around flex-1 items-center min-w-0 flex-wrap gap-2">
        {sensors.map((s) => (
          <HealthRing key={s.key} value={s.value} icon={s.icon} label={s.label} />
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-slate-500 border-t border-base-border pt-2 mt-2">
        <span>
          Active Buses: <span className="text-slate-800 font-medium">{activeCount}</span>
        </span>
        <span>
          Offline: <span className="text-risk-veryhigh font-medium">{offlineCount}</span>
        </span>
      </div>
    </div>
  );
}