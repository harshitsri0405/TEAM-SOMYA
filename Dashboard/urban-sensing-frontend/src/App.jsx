import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Incidents from './pages/Incidents';
import AnprPage from './pages/AnprPage';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import BusFleet from './pages/BusFleet';
import UsersRoles from './pages/UsersRoles';
import Settings from './pages/Settings';
import { useDashboardStore } from './store/useDashboardStore';

export default function App() {
  const initLiveConnection = useDashboardStore((s) => s.initLiveConnection);

  useEffect(() => {
    initLiveConnection();
  }, [initLiveConnection]);

  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex bg-base-950 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-map" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/anpr" element={<AnprPage />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/bus-fleet" element={<BusFleet />} />
            <Route path="/users" element={<UsersRoles />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}