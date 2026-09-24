import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { riskEventsTrend } from '../../data/riskEventsData';

const RANGE_OPTIONS = ['Today', '7 Days', '30 Days'];

export default function RiskEventsChart() {
  const [range, setRange] = useState('Today');

  // Only "Today" has real hour-by-hour synthetic data for now — 7D/30D
  // reuse the same shape scaled up, clearly a placeholder until the
  // backend's time-bucketed aggregation query is wired in.
  const option = useMemo(() => {
    const multiplier = range === '7 Days' ? 6 : range === '30 Days' ? 18 : 1;
    return {
      grid: { left: 36, right: 16, top: 30, bottom: 24 },
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { fontSize: 10, color: '#64748b' } },
      xAxis: {
        type: 'category',
        data: riskEventsTrend.hours,
        axisLabel: { fontSize: 9, color: '#94a3b8', interval: 3 },
        axisLine: { lineStyle: { color: '#e5e7eb' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 9, color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#f1f2f5' } }
      },
      series: riskEventsTrend.series.map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: s.color },
        itemStyle: { color: s.color },
        data: s.data.map((v) => v * multiplier)
      }))
    };
  }, [range]);

  return (
    <div className="panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-800">Risk Events — Last 24 Hours</h3>
        <div className="flex gap-1 text-[11px]">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setRange(opt)}
              className={`px-2 py-0.5 rounded-md ${
                range === opt ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge />
      </div>
    </div>
  );
}