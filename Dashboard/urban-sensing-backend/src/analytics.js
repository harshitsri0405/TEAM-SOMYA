import { getAllEvents } from './store.js';
import { getFleetStatus } from './fleet.js';

export function getKpis() {
  const events = getAllEvents();
  const defects = events.filter((e) => e.event_type === 'infrastructure_defect');
  const incidents = events.filter((e) => e.event_type === 'incident_alert');
  const unresolvedDefects = defects.filter((e) => e.status !== 'Resolved');
  const criticalDefects = defects.filter((e) => e.confidence >= 0.9);

  return {
    totalDetections: events.length,
    activeBusNodes: getFleetStatus().activeCount || 108,
    offlineBusNodes: getFleetStatus().offlineCount || 10,
    detectedRisksTotal: defects.length,
    criticalIssues: criticalDefects.length,
    unresolvedCritical: criticalDefects.filter((e) => e.status !== 'Resolved').length,
    activeIncidents: incidents.length,
    unresolvedAlerts: unresolvedDefects.length
  };
}

export function getRiskByType() {
  const defects = getAllEvents().filter((e) => e.event_type === 'infrastructure_defect');
  const counts = {};
  defects.forEach((e) => {
    counts[e.defect_type] = (counts[e.defect_type] ?? 0) + 1;
  });
  return counts;
}

export function getVehicleDensity() {
  const samples = getAllEvents().filter((e) => e.event_type === 'traffic_sample');
  const totals = {};
  let speedSum = 0;
  let congestionSum = 0;

  samples.forEach((s) => {
    Object.entries(s.vehicle_counts ?? {}).forEach(([k, v]) => {
      totals[k] = (totals[k] ?? 0) + v;
    });
    speedSum += s.avg_traffic_speed_kmph ?? 0;
    congestionSum += s.congestion_score ?? 0;
  });

  return {
    vehicleCounts: totals,
    avgSpeed: samples.length ? +(speedSum / samples.length).toFixed(1) : 0,
    avgCongestion: samples.length ? +(congestionSum / samples.length).toFixed(2) : 0,
    sampleCount: samples.length
  };
}

function gridKey(lat, lon, precision = 3) {
  return `${lat.toFixed(precision)},${lon.toFixed(precision)}`;
}

export function getCongestionHeatmap() {
  const samples = getAllEvents().filter((e) => e.event_type === 'traffic_sample');
  const cells = {};

  samples.forEach((s) => {
    if (!s.gps) return;
    const key = gridKey(s.gps.lat, s.gps.lon);
    if (!cells[key]) {
      cells[key] = { lat: s.gps.lat, lon: s.gps.lon, congestionSum: 0, count: 0 };
    }
    cells[key].congestionSum += s.congestion_score ?? 0;
    cells[key].count += 1;
  });

  return Object.values(cells).map((c) => ({
    lat: c.lat,
    lon: c.lon,
    avgCongestion: +(c.congestionSum / c.count).toFixed(2),
    sampleCount: c.count
  }));
}

export function getBottlenecks(threshold = 0.6) {
  const bySegment = {};
  getAllEvents()
    .filter((e) => e.event_type === 'traffic_sample' && e.road_segment_id)
    .forEach((s) => {
      if (!bySegment[s.road_segment_id]) {
        bySegment[s.road_segment_id] = { roadSegmentId: s.road_segment_id, scores: [], avgSpeedSum: 0, count: 0 };
      }
      bySegment[s.road_segment_id].scores.push(s.congestion_score ?? 0);
      bySegment[s.road_segment_id].avgSpeedSum += s.avg_traffic_speed_kmph ?? 0;
      bySegment[s.road_segment_id].count += 1;
    });

  return Object.values(bySegment)
    .map((seg) => ({
      roadSegmentId: seg.roadSegmentId,
      avgCongestion: +(seg.scores.reduce((a, b) => a + b, 0) / seg.count).toFixed(2),
      avgSpeedKmph: +(seg.avgSpeedSum / seg.count).toFixed(1),
      sampleCount: seg.count
    }))
    .filter((seg) => seg.avgCongestion >= threshold)
    .sort((a, b) => b.avgCongestion - a.avgCongestion);
}

export function getDuplicateStats() {
  const defects = getAllEvents().filter((e) => e.event_type === 'infrastructure_defect');
  const totalDetections = defects.reduce((sum, e) => sum + (e.duplicate_detection_count ?? 1), 0);
  const uniqueRisks = defects.length;
  const duplicatesRemoved = totalDetections - uniqueRisks;

  return {
    totalDetections,
    duplicatesRemoved,
    uniqueRisks,
    duplicateRemovalPct: totalDetections ? +((duplicatesRemoved / totalDetections) * 100).toFixed(1) : 0
  };
}