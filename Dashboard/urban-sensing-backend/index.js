import { startMqttBroker } from './src/mqttBroker.js';
import { startMqttSubscriber } from './src/mqttSubscriber.js';
import { recordHeartbeat, getFleetStatus } from './src/fleet.js';
import { requireApiKey } from './src/auth.js';
import { getKpis, getRiskByType, getVehicleDensity, getCongestionHeatmap, getBottlenecks, getDuplicateStats } from './src/analytics.js';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { validateEvent } from './src/eventSchema.js';
import { addEvent, getEvents, getEventById, updateEventStatus, assignEvent } from './src/store.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // 5mb because evidence.crop_jpeg_b64 can be sizeable

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const message = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(message);
  });
}

// ---- POST /events — buses (or the simulator) push detections here ----
app.post('/events', requireApiKey, (req, res) => {
  const error = validateEvent(req.body);
  if (error) return res.status(400).json({ error });

  const stored = addEvent(req.body);

  if (stored.isDuplicate) {
    return res.status(200).json({ message: 'Duplicate merged into existing event', event: stored });
  }

  broadcast({ type: 'new_event', data: stored });
  res.status(201).json(stored);
});

// ---- GET /events — dashboard fetches the feed / initial load here ----
app.get('/events', (req, res) => {
  const { event_type, limit } = req.query;
  res.json(getEvents({ eventType: event_type, limit: limit ? Number(limit) : undefined }));
});

// ---- PATCH /events/:id/status — Verified / Assigned / In Progress / Resolved ----
app.patch('/events/:id/status', (req, res) => {
  const { status } = req.body;
  const updated = updateEventStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Event not found' });

  broadcast({ type: 'status_update', data: updated });
  res.json(updated);
});

app.patch('/events/:id/assign', (req, res) => {
  const { assignedTo, eta } = req.body;
  const updated = assignEvent(req.params.id, { assignedTo, eta });
  if (!updated) return res.status(404).json({ error: 'Event not found' });

  broadcast({ type: 'status_update', data: updated });
  res.json(updated);
});

app.get('/analytics/kpis', (req, res) => res.json(getKpis()));
app.get('/analytics/risk-by-type', (req, res) => res.json(getRiskByType()));
app.get('/analytics/vehicle-density', (req, res) => res.json(getVehicleDensity()));
app.get('/analytics/congestion-heatmap', (req, res) => res.json(getCongestionHeatmap()));
app.get('/analytics/bottlenecks', (req, res) => res.json(getBottlenecks()));
app.get('/analytics/duplicates', (req, res) => res.json(getDuplicateStats()));

app.post('/buses/heartbeat', requireApiKey, (req, res) => {
  const { bus_id, gps, health } = req.body;
  if (!bus_id) return res.status(400).json({ error: 'bus_id required' });
  recordHeartbeat(bus_id, { gps, health });
  res.json({ ok: true });
});

app.get('/buses', (req, res) => res.json(getFleetStatus()));
app.get('/health', (req, res) => res.json({ status: 'ok', clients: wss.clients.size }));

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`NagarNetra backend listening on http://localhost:${PORT}`);
  console.log(`WebSocket also live on ws://localhost:${PORT}`);
});

startMqttBroker();
startMqttSubscriber((event) => {
  broadcast({ type: 'new_event', data: event });
});