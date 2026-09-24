import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '../../store/useDashboardStore';

const COLORS = ['#dc2626', '#2563eb', '#0d9488', '#eab308', '#7c3aed', '#ea9c1a', '#db2777'];

const DEFECT_LABELS = {
  pothole: 'Pothole',
  damaged_road: 'Damaged Road',
  missing_divider: 'Missing Divider',
  missing_zebra_crossing: 'Missing Zebra Crossing',
  damaged_signboard: 'Damaged Signboard',
  waterlogging: 'Waterlogging',
  vulnerable_pedestrian_crossing: 'School Children Crossing'
};

export default function RiskByTypeChart() {
  const riskByType = useDashboardStore((s) => s.riskByType);
  const data = Object.entries(riskByType).map(([key, value]) => ({
    name: DEFECT_LABELS[key] ?? key,
    value
  }));

  const option = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 4,
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 10, color: '#64748b' }
    },
    color: COLORS,
    series: [
      {
        name: 'Risk by Type',
        type: 'pie',
        radius: ['42%', '65%'],
        center: ['32%', '50%'],
        label: { show: false },
        data
      }
    ]
  };

  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-slate-800 mb-2">Risk by Type</h3>
      <div className="flex-1">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            Waiting for defect detections…
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge />
        )}
      </div>
    </div>
  );
}