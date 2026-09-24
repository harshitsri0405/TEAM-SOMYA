// Fake edge-AI bus — sends the exact 3 payload shapes over MQTT
// that a real bus running the AI model will eventually send.
// Swap this script for the real model later; the backend doesn't change.

import mqtt from 'mqtt';

const mqttClient = mqtt.connect('mqtt://localhost:1883');
mqttClient.on('connect', () => console.log('Simulator connected to MQTT broker'));

const DEFECT_TYPES = [
  'pothole', 'damaged_road', 'missing_divider', 'missing_zebra_crossing',
  'damaged_signboard', 'waterlogging', 'vulnerable_pedestrian_crossing'
];
const INCIDENT_TYPES = ['hit_and_run', 'rash_driving'];
const BUS_IDS = ['DL1PC4521', 'DL8CAF9021', 'KA05HB1090', 'KA03MZ2200', 'UP16BT7788'];

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomGps() {
  return {
    lat: +(12.9716 + (Math.random() - 0.5) * 0.08).toFixed(4),
    lon: +(77.5946 + (Math.random() - 0.5) * 0.08).toFixed(4),
    heading_deg: +(Math.random() * 360).toFixed(1),
    speed_kmph: +(5 + Math.random() * 30).toFixed(1)
  };
}

function makeDefectEvent() {
  return {
    event_id: uuid(),
    bus_id: randomFrom(BUS_IDS),
    event_type: 'infrastructure_defect',
    ts: new Date().toISOString(),
    gps: randomGps(),
    camera_id: randomFrom(['front_wide', 'front_narrow', 'left_side', 'right_side']),
    road_segment_id: `osm_way_${Math.floor(10000000 + Math.random() * 90000000)}`,
    defect_type: randomFrom(DEFECT_TYPES),
    confidence: +(0.8 + Math.random() * 0.19).toFixed(2),
    mask_area_px: Math.floor(1000 + Math.random() * 6000),
    bbox: [
      Math.floor(Math.random() * 600), Math.floor(Math.random() * 600),
      Math.floor(400 + Math.random() * 300), Math.floor(400 + Math.random() * 300)
    ],
    evidence: { crop_jpeg_b64: '/9j/4AAQSkZJRgABAQAAAQABAAD/...', sha256: uuid().replace(/-/g, '') },
    schema_version: '1.2'
  };
}

function makeTrafficSample() {
  return {
    event_id: uuid(),
    bus_id: randomFrom(BUS_IDS),
    event_type: 'traffic_sample',
    ts: new Date().toISOString(),
    gps: randomGps(),
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
}

function makeAnprAlert() {
  const plate = `${randomFrom(['DL', 'KA', 'UP', 'MH'])}${Math.floor(1 + Math.random() * 9)}${randomFrom(['A', 'B', 'C'])}${randomFrom(['A', 'B', 'F'])}${Math.floor(1000 + Math.random() * 8999)}`;
  return {
    event_id: uuid(),
    bus_id: randomFrom(BUS_IDS),
    event_type: 'incident_alert',
    incident_type: randomFrom(INCIDENT_TYPES),
    ts: new Date().toISOString(),
    gps: { lat: randomGps().lat, lon: randomGps().lon },
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
}

const TOPIC_BY_TYPE = {
  infrastructure_defect: 'defects',
  traffic_sample: 'traffic',
  incident_alert: 'incidents'
};

function sendEvent(event) {
  const topic = `buses/${event.bus_id}/${TOPIC_BY_TYPE[event.event_type]}`;
  mqttClient.publish(topic, JSON.stringify(event), (err) => {
    if (err) {
      console.error(`❌ ${event.event_type} (${event.bus_id}) — publish failed:`, err.message);
    } else {
      console.log(`✅ ${event.event_type} (${event.bus_id}) → published to ${topic}`);
    }
  });
}

function pickAndSend() {
  const roll = Math.random();
  if (roll < 0.6) sendEvent(makeTrafficSample());
  else if (roll < 0.9) sendEvent(makeDefectEvent());
  else sendEvent(makeAnprAlert());
}

function sendHeartbeat() {
  BUS_IDS.forEach((busId) => {
    fetch('http://localhost:4000/buses/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'bus-fleet-secret-key-2026' },
      body: JSON.stringify({
        bus_id: busId,
        gps: randomGps(),
        health: {
          gps: Math.floor(90 + Math.random() * 10),
          camera: Math.floor(85 + Math.random() * 15),
          aiDevice: Math.floor(80 + Math.random() * 18),
          network: Math.floor(75 + Math.random() * 20)
        }
      })
    }).catch(() => {});
  });
}

console.log('NagarNetra simulator started — sending fake bus events every 3 seconds...');
setInterval(pickAndSend, 3000);
pickAndSend();

setInterval(sendHeartbeat, 10000);
sendHeartbeat();