// Synthetic 24-hour trend — will be replaced by an aggregation query
// over stored infrastructure_defect / traffic_sample / incident_alert
// events once the backend's analytics endpoint exists.

const HOURS = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

function wave(base, amplitude, noise) {
  return HOURS.map((_, i) => {
    const curve = Math.sin((i / 24) * Math.PI * 2) * amplitude;
    return Math.max(0, Math.round(base + curve + (Math.random() - 0.5) * noise));
  });
}

export const riskEventsTrend = {
  hours: HOURS,
  series: [
    { name: 'Road Issues', color: '#dc2626', data: wave(60, 30, 12) },
    { name: 'Traffic Events', color: '#7c3aed', data: wave(40, 20, 10) },
    { name: 'Incidents', color: '#2563eb', data: wave(15, 8, 6) },
    { name: 'Infrastructure', color: '#0d9488', data: wave(25, 15, 8) }
  ]
};