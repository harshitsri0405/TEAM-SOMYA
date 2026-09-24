import Aedes from 'aedes';
import { createServer } from 'net';

const MQTT_PORT = 1883;

export function startMqttBroker() {
  const aedes = new Aedes();
  const server = createServer(aedes.handle);

  server.listen(MQTT_PORT, () => {
    console.log(`MQTT broker (Aedes) listening on mqtt://localhost:${MQTT_PORT}`);
  });

  aedes.on('client', (client) => {
    console.log(`MQTT client connected: ${client.id}`);
  });

  aedes.on('clientDisconnect', (client) => {
    console.log(`MQTT client disconnected: ${client.id}`);
  });

  return aedes;
}