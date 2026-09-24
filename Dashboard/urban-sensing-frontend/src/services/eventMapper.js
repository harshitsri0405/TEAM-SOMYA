const DEFECT_LABELS = {
  pothole: 'Pothole',
  damaged_road: 'Damaged Road',
  missing_divider: 'Missing Divider',
  missing_zebra_crossing: 'Missing Zebra Crossing',
  damaged_signboard: 'Damaged Signboard',
  waterlogging: 'Waterlogging',
  vulnerable_pedestrian_crossing: 'School Children Crossing'
};

export function mapToIncident(raw) {
  return {
    id: raw.event_id,
    timestamp: raw.ts,
    hazardType: DEFECT_LABELS[raw.defect_type] ?? raw.defect_type,
    confidence: raw.confidence,
    status: raw.status ?? 'AI Detected',
    busId: raw.bus_id,
    lat: raw.gps?.lat,
    lng: raw.gps?.lon,
    thumbnail: null,
    rawPayload: raw
  };
}

export function mapToAnprAlert(raw) {
  return {
    id: raw.event_id,
    timestamp: raw.ts,
    busId: raw.bus_id,
    incidentType: raw.incident_type,
    plateNumber: raw.plate_number,
    plateConfidence: raw.plate_confidence,
    vehicleClass: raw.vehicle_class,
    rawPayload: raw
  };
}

export function mapToTrafficSample(raw) {
  return { id: raw.event_id, busId: raw.bus_id, rawPayload: raw };
}