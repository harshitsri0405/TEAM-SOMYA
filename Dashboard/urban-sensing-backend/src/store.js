import db from './db.js';
import { findDuplicate } from './dedupe.js';

const MAX_EVENTS = 5000;

// Maps each event_type to its own collection — matches the architecture
// diagram's "raw defects / raw traffic / raw incidents" separation.
const COLLECTION_BY_TYPE = {
  infrastructure_defect: 'raw_defects',
  traffic_sample: 'raw_traffic',
  incident_alert: 'raw_incidents'
};

function getCollection(eventType) {
  const key = COLLECTION_BY_TYPE[eventType];
  return key ? db.data[key] : null;
}

export function addEvent(event) {
  const collection = getCollection(event.event_type);
  if (!collection) throw new Error(`Unknown event_type: ${event.event_type}`);

  // Dedup only applies to infrastructure_defect events, within their own collection.
  if (event.event_type === 'infrastructure_defect') {
    const duplicateOf = findDuplicate(event, collection);
    if (duplicateOf) {
      duplicateOf.duplicate_detection_count = (duplicateOf.duplicate_detection_count ?? 1) + 1;
      db.write();
      return { ...duplicateOf, isDuplicate: true };
    }
  }

  const enriched = {
    ...event,
    receivedAt: new Date().toISOString(),
    status: 'AI Detected',
    duplicate_detection_count: 1
  };
  collection.unshift(enriched);
  if (collection.length > MAX_EVENTS) collection.pop();
  db.write();
  return enriched;
}

export function getEvents({ eventType, limit = 50 } = {}) {
  if (eventType) {
    const collection = getCollection(eventType);
    return collection ? collection.slice(0, limit) : [];
  }
  // No filter → merge all 3, newest first, for the dashboard's initial load.
  const all = [...db.data.raw_defects, ...db.data.raw_traffic, ...db.data.raw_incidents];
  return all.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, limit);
}

export function getEventById(id) {
  return (
    db.data.raw_defects.find((e) => e.event_id === id) ??
    db.data.raw_traffic.find((e) => e.event_id === id) ??
    db.data.raw_incidents.find((e) => e.event_id === id)
  );
}

export function updateEventStatus(id, status) {
  const event = getEventById(id);
  if (!event) return null;
  event.status = status;
  db.write();
  return event;
}

export function assignEvent(id, { assignedTo, eta }) {
  const event = getEventById(id);
  if (!event) return null;
  event.assignedTo = assignedTo;
  event.eta = eta ?? null;
  event.status = 'Assigned';
  db.write();
  return event;
}

export function getAllEvents() {
  return [...db.data.raw_defects, ...db.data.raw_traffic, ...db.data.raw_incidents];
}

export function getDefects() {
  return db.data.raw_defects;
}

export function getTraffic() {
  return db.data.raw_traffic;
}

export function getIncidents() {
  return db.data.raw_incidents;
}