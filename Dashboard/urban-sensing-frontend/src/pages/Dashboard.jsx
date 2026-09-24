import { ExecutiveKpiStrip } from '../components/dashboard/KpiCards';
import LiveIncidentFeed from '../components/dashboard/LiveIncidentFeed';
import GeoMap from '../components/dashboard/GeoMap';
import NetworkStatusMonitor from '../components/dashboard/NetworkStatusMonitor';
import DetectionSnapshot from '../components/dashboard/DetectionSnapshot';
import ManualDemoTrigger from '../components/dashboard/ManualDemoTrigger';
import RawPayloadViewer from '../components/dashboard/RawPayloadViewer';
import AnprAlertsPanel from '../components/dashboard/AnprAlertsPanel';
import TrafficAnalyticsPanel from '../components/dashboard/TrafficAnalyticsPanel';
import RiskByTypeChart from '../components/dashboard/RiskByTypeChart';
import SelectedIncidentPanel from '../components/dashboard/SelectedIncidentPanel';
import BusSensorHealth from '../components/dashboard/BusSensorHealth';
import RecentDetectionsTable from '../components/dashboard/RecentDetectionsTable';
import ActionRequiredPanel from '../components/dashboard/ActionRequiredPanel';
import RiskEventsChart from '../components/dashboard/RiskEventsChart';
import OriginDestinationPanel from '../components/dashboard/OriginDestinationPanel';
import RouteDelayPanel from '../components/dashboard/RouteDelayPanel';
import BottlenecksPanel from '../components/dashboard/BottlenecksPanel';
import DuplicateDetectionPanel from '../components/dashboard/DuplicateDetectionPanel';

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <ExecutiveKpiStrip />

      {/* Row 1: Map + Live Feed + Selected Incident */}
      <div className="grid grid-cols-4 gap-4" style={{ height: '520px' }}>
        <div className="col-span-2 h-full overflow-hidden">
          <GeoMap />
        </div>
        <div className="col-span-1 h-full overflow-hidden">
          <LiveIncidentFeed />
        </div>
        <div className="col-span-1 h-full overflow-hidden">
          <SelectedIncidentPanel />
        </div>
      </div>

      {/* Row 2: Snapshot + Payload + Network/Demo */}
      <div className="grid grid-cols-3 gap-4 items-stretch">
        <div className="h-80 overflow-hidden">
          <DetectionSnapshot />
        </div>
        <div className="h-80 overflow-hidden">
          <RawPayloadViewer />
        </div>
        <div className="h-80 flex flex-col gap-4 overflow-hidden">
          <NetworkStatusMonitor />
          <div className="panel p-4 flex flex-col justify-center flex-1">
            <h3 className="text-sm font-medium text-slate-800 mb-3">Demo Controls</h3>
            <ManualDemoTrigger />
          </div>
        </div>
      </div>

      {/* Row 3: ANPR + Traffic + Risk by Type */}
      <div className="grid grid-cols-3 gap-4" style={{ height: '320px' }}>
        <div className="h-full overflow-hidden">
          <AnprAlertsPanel />
        </div>
        <div className="h-full overflow-hidden">
          <TrafficAnalyticsPanel />
        </div>
        <div className="h-full overflow-hidden">
          <RiskByTypeChart />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4" style={{ height: '280px' }}>
  <div className="h-full overflow-hidden">
    <BottlenecksPanel />
  </div>
</div>

      <div className="grid grid-cols-3 gap-4" style={{ height: '320px' }}>
  <div className="h-full overflow-hidden">
    <BusSensorHealth />
  </div>
  <div className="h-full overflow-hidden">
    <DuplicateDetectionPanel />
  </div>
  <div className="h-full overflow-hidden">
    <RecentDetectionsTable />
  </div>
</div>

      {/* Row 5: Action Required + Risk Events trend */}
      <div className="grid grid-cols-2 gap-4" style={{ height: '360px' }}>
        <div className="h-full overflow-hidden">
          <ActionRequiredPanel />
        </div>
        <div className="h-full overflow-hidden">
          <RiskEventsChart />
        </div>
      </div>

      {/* Row 6: Origin-Destination + Route Delay */}
      <div className="grid grid-cols-2 gap-4" style={{ height: '340px' }}>
        <div className="h-full overflow-hidden">
          <OriginDestinationPanel />
        </div>
        <div className="h-full overflow-hidden">
          <RouteDelayPanel />
        </div>
      </div>
    </div>
  );
}