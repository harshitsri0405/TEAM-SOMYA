const BASE_URL = 'http://localhost:4000';
const WS_URL = 'ws://localhost:4000';

export async function fetchInitialEvents() {
  const res = await fetch(`${BASE_URL}/events?limit=50`);
  if (!res.ok) throw new Error('Failed to fetch initial events');
  return res.json();
}

export async function pushStatusUpdate(eventId, status) {
  const res = await fetch(`${BASE_URL}/events/${eventId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// Reconnects automatically if the backend restarts or drops.
export function connectLiveFeed(onMessage) {
  let socket;
  let retryTimer;

  function connect() {
    socket = new WebSocket(WS_URL);
    socket.onmessage = (msg) => {
      try {
        onMessage(JSON.parse(msg.data));
      } catch {
        // ignore malformed frame
      }
    };
    socket.onclose = () => {
      retryTimer = setTimeout(connect, 2000);
    };
    socket.onerror = () => socket.close();
  }

  connect();
  return () => {
    clearTimeout(retryTimer);
    socket?.close();
  };
}

export async function fetchVehicleDensity() {
  const res = await fetch(`${BASE_URL}/analytics/vehicle-density`);
  if (!res.ok) throw new Error('Failed to fetch vehicle density');
  return res.json();
}

export async function fetchRiskByType() {
  const res = await fetch(`${BASE_URL}/analytics/risk-by-type`);
  if (!res.ok) throw new Error('Failed to fetch risk by type');
  return res.json();
}

export async function fetchCongestionHeatmap() {
  const res = await fetch(`${BASE_URL}/analytics/congestion-heatmap`);
  if (!res.ok) throw new Error('Failed to fetch congestion heatmap');
  return res.json();
}

export async function fetchBottlenecks() {
  const res = await fetch(`${BASE_URL}/analytics/bottlenecks`);
  if (!res.ok) throw new Error('Failed to fetch bottlenecks');
  return res.json();
}

export async function fetchFleetStatus() {
  const res = await fetch(`${BASE_URL}/buses`);
  if (!res.ok) throw new Error('Failed to fetch fleet status');
  return res.json();
}

export async function fetchDuplicateStats() {
  const res = await fetch(`${BASE_URL}/analytics/duplicates`);
  if (!res.ok) throw new Error('Failed to fetch duplicate stats');
  return res.json();
}

export async function pushAssignment(eventId, { assignedTo, eta }) {
  const res = await fetch(`${BASE_URL}/events/${eventId}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignedTo, eta })
  });
  if (!res.ok) throw new Error('Failed to assign event');
  return res.json();
}