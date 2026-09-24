// Origin–Destination flow + route delay estimates — will eventually
// come from matching consecutive traffic_sample events by road_segment_id
// and bus route, then comparing against a free-flow baseline speed.

export const odFlows = [
  { origin: 'Whitefield', destination: 'MG Road', trips: 142, avgDelayMin: 18 },
  { origin: 'Electronic City', destination: 'Silk Board', trips: 210, avgDelayMin: 27 },
  { origin: 'Hebbal', destination: 'Majestic', trips: 98, avgDelayMin: 12 },
  { origin: 'Koramangala', destination: 'Indiranagar', trips: 76, avgDelayMin: 9 },
  { origin: 'Jayanagar', destination: 'HSR Layout', trips: 64, avgDelayMin: 14 }
];

export const routeDelays = [
  { routeId: 'Route 401K', segment: 'Whitefield → MG Road', freeFlowMin: 32, actualMin: 50, busId: 'DL1PC4521' },
  { routeId: 'Route 500C', segment: 'Electronic City → Silk Board', freeFlowMin: 22, actualMin: 49, busId: 'KA03MZ2200' },
  { routeId: 'Route 210', segment: 'Hebbal → Majestic', freeFlowMin: 28, actualMin: 40, busId: 'KA05HB1090' },
  { routeId: 'Route 335E', segment: 'Koramangala → Indiranagar', freeFlowMin: 15, actualMin: 24, busId: 'UP16BT7788' }
];