// Event schemas match the onboard edge-AI payload contracts exactly
// (infrastructure_defect, traffic_sample, incident_alert/ALPR).

export const DEFECT_TYPES = [
  'pothole',
  'damaged_road',
  'missing_divider',
  'missing_zebra_crossing',
  'damaged_signboard',
  'waterlogging',
  'vulnerable_pedestrian_crossing'
];

const DEFECT_LABELS = {
  pothole: 'Pothole',
  damaged_road: 'Damaged Road',
  missing_divider: 'Missing Divider',
  missing_zebra_crossing: 'Missing Zebra Crossing',
  damaged_signboard: 'Damaged Signboard',
  waterlogging: 'Waterlogging',
  vulnerable_pedestrian_crossing: 'School Children Crossing'
};
export const HAZARD_TYPES_LABELS = Object.values(DEFECT_LABELS);

export const STATUS_OPTIONS = ['AI Detected', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
export const INCIDENT_TYPES = ['hit_and_run', 'rash_driving'];

const BUS_IDS = ['DL1PC4521', 'DL8CAF9021', 'KA05HB1090', 'KA03MZ2200', 'UP16BT7788'];

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomGps() {
  return {
    lat: +(12.9716 + (Math.random() - 0.5) * 0.08).toFixed(4),
    lon: +(77.5946 + (Math.random() - 0.5) * 0.08).toFixed(4)
  };
}

// ---- infrastructure_defect event ----
export function makeDefectEvent(overrides = {}) {
  const defectType = overrides.defectType ?? randomFrom(DEFECT_TYPES);
  const busId = randomFrom(BUS_IDS);
  const gps = { ...randomGps(), heading_deg: +(Math.random() * 360).toFixed(1), speed_kmph: +(15 + Math.random() * 25).toFixed(1) };

  const rawPayload = {
    event_id: uuid(),
    bus_id: busId,
    event_type: 'infrastructure_defect',
    ts: new Date().toISOString(),
    gps,
    camera_id: randomFrom(['front_wide', 'front_narrow', 'left_side', 'right_side']),
    road_segment_id: `osm_way_${Math.floor(10000000 + Math.random() * 90000000)}`,
    defect_type: defectType,
    confidence: +(0.8 + Math.random() * 0.19).toFixed(2),
    mask_area_px: Math.floor(1000 + Math.random() * 6000),
    bbox: [
      Math.floor(Math.random() * 600),
      Math.floor(Math.random() * 600),
      Math.floor(400 + Math.random() * 300),
      Math.floor(400 + Math.random() * 300)
    ],
    evidence: {
      crop_jpeg_b64: '/9j/4AAQSkZJRgABAQAAAQABAAD/...',
      sha256: uuid().replace(/-/g, '')
    },
    schema_version: '1.2'
  };

  return {
    id: rawPayload.event_id,
    timestamp: rawPayload.ts,
    hazardType: DEFECT_LABELS[defectType],
    confidence: rawPayload.confidence,
    status: 'AI Detected',
    busId,
    lat: gps.lat,
    lng: gps.lon,
    thumbnail: null,
    rawPayload,
    ...overrides
  };
}

export const initialIncidents = Array.from({ length: 8 }).map(() =>
  makeDefectEvent({ status: randomFrom(STATUS_OPTIONS) })
);

// ---- traffic_sample event (high frequency, no images) ----
export function makeTrafficSample(overrides = {}) {
  const busId = randomFrom(BUS_IDS);
  const rawPayload = {
    event_id: uuid(),
    bus_id: busId,
    event_type: 'traffic_sample',
    ts: new Date().toISOString(),
    gps: { ...randomGps(), heading_deg: +(Math.random() * 360).toFixed(1), speed_kmph: +(5 + Math.random() * 20).toFixed(1) },
    road_segment_id: `osm_way_${Math.floor(10000000 + Math.random() * 90000000)}`,
    vehicle_counts: {
      car: Math.floor(Math.random() * 25),
      two_wheeler: Math.floor(Math.random() * 35),
      bus: Math.floor(Math.random() * 5),
      truck: Math.floor(Math.random() * 4),
      auto_rickshaw: Math.floor(Math.random() * 10)
    },
    avg_traffic_speed_kmph: +(5 + Math.random() * 20).toFixed(1),
    congestion_score: +Math.random().toFixed(2),
    schema_version: '1.0'
  };
  return { id: rawPayload.event_id, busId, rawPayload, ...overrides };
}

export const initialTrafficSamples = Array.from({ length: 6 }).map(() => makeTrafficSample());

// ---- incident_alert / ALPR event (highest priority) ----
export function makeAnprAlert(overrides = {}) {
  const busId = randomFrom(BUS_IDS);
  const plate = `${randomFrom(['DL', 'KA', 'UP', 'MH'])}${Math.floor(1 + Math.random() * 9)}${randomFrom(['A', 'B', 'C'])}${randomFrom(['A', 'B', 'F'])}${Math.floor(1000 + Math.random() * 8999)}`;

  const rawPayload = {
    event_id: uuid(),
    bus_id: busId,
    event_type: 'incident_alert',
    incident_type: randomFrom(INCIDENT_TYPES),
    ts: new Date().toISOString(),
    gps: randomGps(),
    trigger: { source: 'can_bus_imu', reason: 'harsh_deceleration', jerk_g: +(0.4 + Math.random() * 0.5).toFixed(2) },
    track_id: `trk_${Math.floor(10000 + Math.random() * 89999)}`,
    plate_number: plate,
    plate_confidence: +(0.75 + Math.random() * 0.24).toFixed(2),
    vehicle_class: randomFrom(['two_wheeler', 'car', 'auto_rickshaw', 'truck']),
    evidence: {
      crop_jpeg_b64: '/9j/4AAQSkZJRgABAQAAAQABAAD/...',
      sha256: uuid().replace(/-/g, ''),
      frame_buffer_ref: `local://ringbuf/trk_${Math.floor(10000 + Math.random() * 89999)}/48frames.mp4`
    },
    schema_version: '1.0'
  };

  return {
    id: rawPayload.event_id,
    timestamp: rawPayload.ts,
    busId,
    incidentType: rawPayload.incident_type,
    plateNumber: rawPayload.plate_number,
    plateConfidence: rawPayload.plate_confidence,
    vehicleClass: rawPayload.vehicle_class,
    rawPayload,
    ...overrides
  };
}

export const initialAnprAlerts = Array.from({ length: 4 }).map(() => makeAnprAlert());

export const initialKpis = {
  totalDetections: 684,
  activeBusNodes: 108,
  offlineBusNodes: 10,
  pendingSyncCount: 23
};