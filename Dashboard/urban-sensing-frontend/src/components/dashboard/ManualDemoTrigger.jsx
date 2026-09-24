import { Zap } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

// Safety net for live presentations — fires a synthetic incident through
// the exact same store pipeline as a real detection, so the demo never
// depends on a real bus passing a real pothole at the right second.
export default function ManualDemoTrigger() {
  const triggerDemoIncident = useDashboardStore((s) => s.triggerDemoIncident);

  return (
    <button
      onClick={() => triggerDemoIncident()}
      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-accent-blue/15 text-accent-blue text-sm font-medium hover:bg-accent-blue/25 transition-colors"
    >
      <Zap size={15} />
      Trigger Demo Alert
    </button>
  );
}