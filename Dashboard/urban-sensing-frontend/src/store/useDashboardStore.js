import { create } from 'zustand';
import { initialKpis, makeDefectEvent, makeAnprAlert } from '../data/mockData';
import { mapToIncident, mapToAnprAlert, mapToTrafficSample } from '../services/eventMapper';
import {
  fetchInitialEvents,
  pushStatusUpdate,
  connectLiveFeed,
  fetchVehicleDensity,
  fetchRiskByType,
  fetchCongestionHeatmap,
  fetchBottlenecks,
  fetchFleetStatus,
  fetchDuplicateStats,
  pushAssignment
} from '../services/backendApi';

export const useDashboardStore = create((set, get) => ({
  kpis: initialKpis,

  actionRequired: [
    { id: 'AR-1', label: 'Accident — MG Road', confidence: 0.96, ageMinutes: 2, severity: 'CRITICAL' },
    { id: 'AR-2', label: 'Severe Waterlogging — ORR', confidence: 0.89, ageMinutes: 7, severity: 'HIGH' },
    { id: 'AR-3', label: 'Rash Driving — Nice Road Jn.', confidence: 0.91, ageMinutes: 9, severity: 'HIGH' },
    { id: 'AR-4', label: 'Damaged Signboard — Silk Board', confidence: 0.82, ageMinutes: 12, severity: 'MODERATE' },
    { id: 'AR-5', label: 'Missing Zebra Crossing — HSR Layout', confidence: 0.86, ageMinutes: 15, severity: 'MODERATE' }
  ],
  dismissActionItem: (id) =>
    set((state) => ({ actionRequired: state.actionRequired.filter((item) => item.id !== id) })),

  // ---- These 3 arrays now come from the REAL backend, not mockData ----
  incidents: [],
  trafficSamples: [],
  anprAlerts: [],
  connectionStatus: 'connecting', // 'connecting' | 'live' | 'offline'

  selectedIncidentId: null,
  selectIncident: (id) => set({ selectedIncidentId: id }),

  filters: { hazardType: 'All', status: 'All', dateRange: 'Today' },
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),

  updateIncidentStatus: async (id, status) => {
    set((state) => ({
      incidents: state.incidents.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    }));
    try {
      await pushStatusUpdate(id, status);
    } catch {
      // backend unreachable — local UI state already updated optimistically
    }
  },

  assignIncident: async (id, { assignedTo, eta }) => {
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'Assigned', assignedTo, eta } : inc
      )
    }));
    try {
      await pushAssignment(id, { assignedTo, eta });
    } catch {
      // backend unreachable — local UI state already updated optimistically
    }
  },

  network: { edgeNodeOnline: true, localBufferCount: 3, lastSyncSecondsAgo: 0 },
  toggleEdgeNode: () =>
    set((state) => ({ network: { ...state.network, edgeNodeOnline: !state.network.edgeNodeOnline } })),

  vehicleDensity: { vehicleCounts: {}, avgSpeed: 0, avgCongestion: 0 },
  riskByType: {},
    vehicleDensity: { vehicleCounts: {}, avgSpeed: 0, avgCongestion: 0 },
  riskByType: {},
  congestionHeatmap: [],
    vehicleDensity: { vehicleCounts: {}, avgSpeed: 0, avgCongestion: 0 },
  riskByType: {},
  congestionHeatmap: [],
  bottlenecks: [],
    vehicleDensity: { vehicleCounts: {}, avgSpeed: 0, avgCongestion: 0 },
  riskByType: {},
  congestionHeatmap: [],
  bottlenecks: [],
  fleetStatus: { buses: [], activeCount: 0, offlineCount: 0 },
    vehicleDensity: { vehicleCounts: {}, avgSpeed: 0, avgCongestion: 0 },
  riskByType: {},
  congestionHeatmap: [],
  bottlenecks: [],
  fleetStatus: { buses: [], activeCount: 0, offlineCount: 0 },
  duplicateStats: { totalDetections: 0, duplicatesRemoved: 0, uniqueRisks: 0, duplicateRemovalPct: 0 },

      refreshAnalytics: async () => {
    try {
      const [density, risk, heatmap, bottlenecks, fleet, duplicates] = await Promise.all([
        fetchVehicleDensity(),
        fetchRiskByType(),
        fetchCongestionHeatmap(),
        fetchBottlenecks(),
        fetchFleetStatus(),
        fetchDuplicateStats()
      ]);
      set({
        vehicleDensity: density,
        riskByType: risk,
        congestionHeatmap: heatmap,
        bottlenecks,
        fleetStatus: fleet,
        duplicateStats: duplicates
      });
    } catch {
      // backend unreachable — panels will just show last-known/local data
    }
  },

  // ---- Demo controls stay 100% local/fake, on purpose — safety net for live demos ----
  triggerDemoIncident: (overrides = {}) => {
    const incident = makeDefectEvent(overrides);
    set((state) => ({
      incidents: [incident, ...state.incidents].slice(0, 30),
      selectedIncidentId: incident.id,
      kpis: { ...state.kpis, totalDetections: state.kpis.totalDetections + 1 }
    }));
    return incident;
  },
  triggerDemoAnprAlert: () => {
    const alert = makeAnprAlert();
    set((state) => ({ anprAlerts: [alert, ...state.anprAlerts].slice(0, 20) }));
    return alert;
  },

  // ---- Called once from App.jsx to load history + open the live socket ----
  initLiveConnection: async () => {
    get().refreshAnalytics();

    try {
      const history = await fetchInitialEvents();
      const mappedIncidents = history.filter((e) => e.event_type === 'infrastructure_defect').map(mapToIncident);
      set({
        incidents: mappedIncidents,
        trafficSamples: history.filter((e) => e.event_type === 'traffic_sample').map(mapToTrafficSample),
        anprAlerts: history.filter((e) => e.event_type === 'incident_alert').map(mapToAnprAlert),
        selectedIncidentId: mappedIncidents[0]?.id ?? null,
        connectionStatus: 'live'
      });
    } catch {
      set({ connectionStatus: 'offline' });
    }

    connectLiveFeed((msg) => {
      set({ connectionStatus: 'live', network: { ...get().network, lastSyncSecondsAgo: 0 } });

      if (msg.type === 'new_event') {
        get().refreshAnalytics();
        const raw = msg.data;
        if (raw.event_type === 'infrastructure_defect') {
          const mapped = mapToIncident(raw);
          set((state) => ({
            incidents: [mapped, ...state.incidents].slice(0, 50),
            selectedIncidentId: state.selectedIncidentId ?? mapped.id,
            kpis: { ...state.kpis, totalDetections: state.kpis.totalDetections + 1 }
          }));
        } else if (raw.event_type === 'traffic_sample') {
          set((state) => ({ trafficSamples: [mapToTrafficSample(raw), ...state.trafficSamples].slice(0, 20) }));
        } else if (raw.event_type === 'incident_alert') {
          set((state) => ({ anprAlerts: [mapToAnprAlert(raw), ...state.anprAlerts].slice(0, 20) }));
        }
      }

      if (msg.type === 'status_update') {
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === msg.data.event_id ? { ...inc, status: msg.data.status } : inc
          )
        }));
      }
    });
  }
}));