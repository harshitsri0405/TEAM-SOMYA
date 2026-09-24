// Validates incoming payloads against the 3 contract shapes the edge-AI
// buses (or, for now, the simulator) will send.

const DEFECT_TYPES = [
  'pothole', 'damaged_road', 'missing_divider', 'missing_zebra_crossing',
  'damaged_signboard', 'waterlogging', 'vulnerable_pedestrian_crossing'
];
const INCIDENT_TYPES = ['hit_and_run', 'rash_driving'];

function isValidGps(gps) {
  return gps && typeof gps.lat === 'number' && typeof gps.lon === 'number';
}

export function validateEvent(body) {
  if (!body || typeof body !== 'object') return 'Body must be a JSON object';
  if (!body.event_id || !body.bus_id || !body.event_type || !body.ts) {
    return 'Missing required fields: event_id, bus_id, event_type, ts';
  }

  switch (body.event_type) {
    case 'infrastructure_defect':
      if (!isValidGps(body.gps)) return 'infrastructure_defect requires gps.lat/lon';
      if (!DEFECT_TYPES.includes(body.defect_type)) return `Invalid defect_type: ${body.defect_type}`;
      if (typeof body.confidence !== 'number') return 'confidence must be a number';
      return null;

    case 'traffic_sample':
      if (!isValidGps(body.gps)) return 'traffic_sample requires gps.lat/lon';
      if (!body.vehicle_counts || typeof body.vehicle_counts !== 'object') {
        return 'traffic_sample requires vehicle_counts object';
      }
      return null;

    case 'incident_alert':
      if (!isValidGps(body.gps)) return 'incident_alert requires gps.lat/lon';
      if (!INCIDENT_TYPES.includes(body.incident_type)) return `Invalid incident_type: ${body.incident_type}`;
      if (!body.plate_number) return 'incident_alert requires plate_number';
      return null;

    default:
      return `Unknown event_type: ${body.event_type}`;
  }
}