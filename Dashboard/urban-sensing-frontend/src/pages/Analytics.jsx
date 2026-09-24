import RiskByTypeChart from '../components/dashboard/RiskByTypeChart';
import TrafficAnalyticsPanel from '../components/dashboard/TrafficAnalyticsPanel';
import RiskEventsChart from '../components/dashboard/RiskEventsChart';
import BottlenecksPanel from '../components/dashboard/BottlenecksPanel';

export default function Analytics() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Traffic, Road &amp; Infra Analytics</h2>
      <div className="grid grid-cols-2 gap-4" style={{ height: '340px' }}>
        <TrafficAnalyticsPanel />
        <RiskByTypeChart />
      </div>
      <div style={{ height: '340px' }}>
        <RiskEventsChart />
      </div>
      <div style={{ height: '280px' }}>
        <BottlenecksPanel />
      </div>
    </div>
  );
}