// Tracks per-bus sensor health via periodic heartbeats. Real buses will
// POST here every ~30s; a bus not heard from in HEARTBEAT_TIMEOUT_MS
// is considered offline.

const HEARTBEAT_TIMEOUT_MS = 60 * 1000;
const fleet = new Map(); // bus_id -> { gps, health, lastSeen }

export function recordHeartbeat(busId, payload) {
  fleet.set(busId, {
    busId,
    gps: payload.gps ?? null,
    health: {
      gps: payload.health?.gps ?? 100,
      camera: payload.health?.camera ?? 100,
      aiDevice: payload.health?.aiDevice ?? 100,
      network: payload.health?.network ?? 100
    },
    lastSeen: Date.now()
  });
}

export function getFleetStatus() {
  const now = Date.now();
  const buses = Array.from(fleet.values()).map((b) => ({
    ...b,
    online: now - b.lastSeen <= HEARTBEAT_TIMEOUT_MS
  }));
  return {
    buses,
    activeCount: buses.filter((b) => b.online).length,
    offlineCount: buses.filter((b) => !b.online).length
  };
}