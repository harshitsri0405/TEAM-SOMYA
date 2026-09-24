// Subscribes to the topics buses publish on, validates + stores each
// event, then hands it to the same broadcast() function the REST route
// used — so the dashboard doesn't care whether data arrived via MQTT or HTTP.

import mqtt from 'mqtt';
import { validateEvent } from './eventSchema.js';
import { addEvent } from './store.js';

const TOPICS = ['buses/+/defects', 'buses/+/traffic', 'buses/+/incidents'];

export function startMqttSubscriber(onNewEvent) {
  const client = mqtt.connect('mqtt://localhost:1883');

  client.on('connect', () => {
    console.log('Backend subscribed to MQTT topics:', TOPICS.join(', '));
    client.subscribe(TOPICS);
  });

  client.on('message', (topic, messageBuffer) => {
    let payload;
    try {
      payload = JSON.parse(messageBuffer.toString());
    } catch {
      console.error('Received malformed MQTT payload on', topic);
      return;
    }

    const error = validateEvent(payload);
    if (error) {
      console.error('Invalid MQTT event on', topic, '-', error);
      return;
    }

    const stored = addEvent(payload);
    if (!stored.isDuplicate) {
      onNewEvent(stored);
    }
  });

  client.on('error', (err) => console.error('MQTT client error:', err.message));

  return client;
}