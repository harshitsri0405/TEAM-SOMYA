import BusSensorHealth from '../components/dashboard/BusSensorHealth';
import RecentDetectionsTable from '../components/dashboard/RecentDetectionsTable';

export default function BusFleet() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Bus Fleet</h2>
      <div className="grid grid-cols-3 gap-4" style={{ height: '320px' }}>
        <BusSensorHealth />
        <div className="col-span-2">
          <RecentDetectionsTable />
        </div>
      </div>
    </div>
  );
}