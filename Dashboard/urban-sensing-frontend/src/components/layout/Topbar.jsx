import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Filter, Bell, X } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { HAZARD_TYPES_LABELS, STATUS_OPTIONS } from '../../data/mockData';

function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

function FiltersDropdown({ onClose }) {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  const filters = useDashboardStore((s) => s.filters);
  const setFilter = useDashboardStore((s) => s.setFilter);

  return (
    <div
      ref={ref}
      className="absolute top-10 right-0 w-64 bg-white border border-base-border rounded-lg shadow-lg p-3 z-50 text-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-slate-700">Filters</span>
        <button onClick={onClose}>
          <X size={14} className="text-slate-400" />
        </button>
      </div>

      <label className="block text-slate-400 mb-1">Hazard Type</label>
      <select
        value={filters.hazardType}
        onChange={(e) => setFilter('hazardType', e.target.value)}
        className="w-full mb-3 border border-base-border rounded-md px-2 py-1.5 text-slate-700"
      >
        <option>All</option>
        {HAZARD_TYPES_LABELS.map((label) => (
          <option key={label}>{label}</option>
        ))}
      </select>

      <label className="block text-slate-400 mb-1">Status</label>
      <select
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
        className="w-full border border-base-border rounded-md px-2 py-1.5 text-slate-700"
      >
        <option>All</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={() => {
          setFilter('hazardType', 'All');
          setFilter('status', 'All');
        }}
        className="w-full mt-3 text-accent-blue text-[11px] hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

function NotificationsDropdown({ onClose }) {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  const incidents = useDashboardStore((s) => s.incidents);
  const anprAlerts = useDashboardStore((s) => s.anprAlerts);
  const selectIncident = useDashboardStore((s) => s.selectIncident);

  const recent = [...incidents.slice(0, 5).map((i) => ({ ...i, label: i.hazardType }))].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div
      ref={ref}
      className="absolute top-10 right-0 w-72 bg-white border border-base-border rounded-lg shadow-lg z-50 text-xs overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-base-border font-medium text-slate-700">Recent Alerts</div>
      <div className="max-h-72 overflow-y-auto divide-y divide-base-border">
        {recent.length === 0 ? (
          <div className="p-4 text-center text-slate-400">No alerts yet</div>
        ) : (
          recent.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                selectIncident(item.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-base-800"
            >
              <div className="text-slate-700">{item.label}</div>
              <div className="text-slate-400">{new Date(item.timestamp).toLocaleTimeString()} · Bus {item.busId}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function Topbar() {
  const activeBusNodes = useDashboardStore((s) => s.kpis.activeBusNodes);
  const lastSync = useDashboardStore((s) => s.network.lastSyncSecondsAgo);
  const filters = useDashboardStore((s) => s.filters);
  const setFilter = useDashboardStore((s) => s.setFilter);

  const [openMenu, setOpenMenu] = useState(null); // 'filters' | 'notifications' | null

  return (
    <header className="h-14 shrink-0 border-b border-base-border bg-white flex items-center justify-between px-4 gap-4 relative">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-risk-low bg-risk-low/10 px-2 py-1 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
          LIVE
        </span>
        <span className="text-sm text-slate-600">
          Real-time monitoring from {activeBusNodes} buses
        </span>
        <span className="text-xs text-slate-400">Last updated: {lastSync} sec ago</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <button
          onClick={() => setFilter('dateRange', 'Today')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${
            filters.dateRange === 'Today' ? 'border-accent-blue text-accent-blue bg-accent-blue/5' : 'border-base-border hover:bg-base-800'
          }`}
        >
          <Calendar size={13} /> Today
        </button>
        <button
          onClick={() => setFilter('dateRange', 'Last 24 Hours')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${
            filters.dateRange === 'Last 24 Hours' ? 'border-accent-blue text-accent-blue bg-accent-blue/5' : 'border-base-border hover:bg-base-800'
          }`}
        >
          <Clock size={13} /> Last 24 Hours
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'filters' ? null : 'filters')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${
              filters.hazardType !== 'All' || filters.status !== 'All'
                ? 'border-accent-blue text-accent-blue bg-accent-blue/5'
                : 'border-base-border hover:bg-base-800'
            }`}
          >
            <Filter size={13} /> Filters
          </button>
          {openMenu === 'filters' && <FiltersDropdown onClose={() => setOpenMenu(null)} />}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'notifications' ? null : 'notifications')}
            className="relative p-1.5 rounded-md border border-base-border hover:bg-base-800"
          >
            <Bell size={14} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[9px] flex items-center justify-center rounded-full bg-risk-veryhigh text-white">
              12
            </span>
          </button>
          {openMenu === 'notifications' && <NotificationsDropdown onClose={() => setOpenMenu(null)} />}
        </div>
      </div>
    </header>
  );
}