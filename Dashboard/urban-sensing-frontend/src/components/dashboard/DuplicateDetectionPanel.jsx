import { Copy, ArrowRight, Sparkles } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export default function DuplicateDetectionPanel() {
  const { totalDetections, duplicatesRemoved, uniqueRisks, duplicateRemovalPct } = useDashboardStore(
    (s) => s.duplicateStats
  );

  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-slate-800 mb-3">Duplicate Detection (Today)</h3>

      <div className="flex items-center justify-around flex-1 text-center">
        <div>
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-slate-100 flex items-center justify-center">
            <Copy size={15} className="text-slate-500" />
          </div>
          <div className="text-lg font-semibold text-slate-800">{totalDetections}</div>
          <div className="text-[10px] text-slate-400">Total Detections</div>
        </div>

        <ArrowRight size={16} className="text-slate-300 shrink-0" />

        <div>
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-risk-veryhigh/10 flex items-center justify-center">
            <span className="text-risk-veryhigh text-sm font-bold">−{duplicatesRemoved}</span>
          </div>
          <div className="text-lg font-semibold text-risk-veryhigh">{duplicatesRemoved}</div>
          <div className="text-[10px] text-slate-400">Duplicates Removed</div>
        </div>

        <ArrowRight size={16} className="text-slate-300 shrink-0" />

        <div>
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-risk-low/10 flex items-center justify-center">
            <Sparkles size={15} className="text-risk-low" />
          </div>
          <div className="text-lg font-semibold text-slate-800">{uniqueRisks}</div>
          <div className="text-[10px] text-slate-400">Unique Risks</div>
        </div>
      </div>

      <div className="text-center text-[11px] text-risk-low border-t border-base-border pt-2 mt-2">
        {duplicateRemovalPct}% duplicates removed using AI similarity &amp; location matching
      </div>
    </div>
  );
}