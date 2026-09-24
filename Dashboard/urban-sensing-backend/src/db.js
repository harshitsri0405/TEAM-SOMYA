import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'events.json');

const adapter = new JSONFile(file);
const db = new Low(adapter, {
  raw_defects: [],
  raw_traffic: [],
  raw_incidents: []
});

await db.read();
db.data ||= { raw_defects: [], raw_traffic: [], raw_incidents: [] };

// Backward-compat: if an older events.json (single "events" array) exists,
// split it into the 3 new collections once, so no data is lost.
if (db.data.events && Array.isArray(db.data.events)) {
  db.data.raw_defects = db.data.events.filter((e) => e.event_type === 'infrastructure_defect');
  db.data.raw_traffic = db.data.events.filter((e) => e.event_type === 'traffic_sample');
  db.data.raw_incidents = db.data.events.filter((e) => e.event_type === 'incident_alert');
  delete db.data.events;
  await db.write();
}

export default db;