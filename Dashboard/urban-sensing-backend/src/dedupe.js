// Same pothole seen by 4 different buses shouldn't count as 4 risks —
// this collapses near-duplicate infrastructure_defect reports so KPIs
// reflect unique real-world hazards, not raw detection volume.

const DEDUPE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
const DEDUPE_RADIUS_METERS = 40;

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Returns the original event if this new one is a duplicate, else null.
export function findDuplicate(newEvent, existingEvents) {
  if (newEvent.event_type !== 'infrastructure_defect') return null;

  const cutoff = Date.now() - DEDUPE_WINDOW_MS;
  const candidates = existingEvents.filter(
    (e) =>
      e.event_type === 'infrastructure_defect' &&
      e.defect_type === newEvent.defect_type &&
      new Date(e.ts).getTime() >= cutoff
  );

  return (
    candidates.find((e) => haversineMeters(e.gps, newEvent.gps) <= DEDUPE_RADIUS_METERS) ?? null
  );
}