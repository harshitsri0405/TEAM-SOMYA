import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useDashboardStore } from '../../store/useDashboardStore';

const RISK_COLOR = {
  Pothole: '#e5484d',
  Waterlogging: '#3b82f6',
  'Traffic Congestion': '#f5a524',
  'Missing Zebra Crossing': '#eec94f',
  'Damaged Signboard': '#a78bfa',
  'Rash Driving': '#e5484d',
  Accident: '#e5484d'
};

function congestionColor(score) {
  if (score >= 0.7) return '#dc2626';
  if (score >= 0.4) return '#f59e0b';
  return '#22c55e';
}

export default function GeoMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const incidents = useDashboardStore((s) => s.incidents);
  const congestionHeatmap = useDashboardStore((s) => s.congestionHeatmap);
  const selectIncident = useDashboardStore((s) => s.selectIncident);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [77.5946, 12.9716],
      zoom: 11.5
    });
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    mapRef.current.on('load', () => {
      mapRef.current.addSource('congestion-heatmap', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      mapRef.current.addLayer({
        id: 'congestion-circles',
        type: 'circle',
        source: 'congestion-heatmap',
        paint: {
          'circle-radius': 16,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.35,
          'circle-blur': 0.6
        }
      });
    });
  }, []);

  // Push congestion cells into the heatmap layer whenever new data arrives
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource('congestion-heatmap')) return;

    const applyData = () => {
      const features = congestionHeatmap.map((cell) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [cell.lon, cell.lat] },
        properties: { color: congestionColor(cell.avgCongestion) }
      }));
      map.getSource('congestion-heatmap').setData({ type: 'FeatureCollection', features });
    };

    if (map.isStyleLoaded()) applyData();
    else map.once('load', applyData);
  }, [congestionHeatmap]);

  // Incident markers (unchanged)
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = incidents.map((inc) => {
      const el = document.createElement('div');
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid rgba(255,255,255,0.6)';
      el.style.background = RISK_COLOR[inc.hazardType] ?? '#e5484d';
      el.style.cursor = 'pointer';
      el.title = `${inc.hazardType} · ${inc.id}`;
      el.addEventListener('click', () => selectIncident(inc.id));

      return new maplibregl.Marker({ element: el })
        .setLngLat([inc.lng, inc.lat])
        .addTo(mapRef.current);
    });
  }, [incidents, selectIncident]);

  return (
    <div className="panel h-full overflow-hidden relative">
      <div className="absolute top-3 left-3 z-10 text-xs bg-white/90 border border-base-border rounded-md px-2.5 py-1.5 text-slate-600 shadow-sm">
        Live Risk Map · {incidents.length} active markers · {congestionHeatmap.length} congestion cells
      </div>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}