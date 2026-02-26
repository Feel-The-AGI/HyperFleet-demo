import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import L, { type DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import {
  Clock3,
  Crosshair,
  Fuel,
  Gauge,
  Navigation,
  Pause,
  Play,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";
import { getDriverById, vehicles, type Vehicle, type VehicleStatus } from "@/data/mock-data";
import type { FleetMapViewState } from "@/types/workspace";

const STREAM_INTERVAL_MS = 3000;
const HISTORY_LIMIT = 14;

type LatLngTuple = [number, number];

interface RouteCorridor {
  id: string;
  tags: string[];
  points: LatLngTuple[];
}

interface CorridorMetrics {
  corridor: RouteCorridor;
  points: LatLngTuple[];
  segmentKm: number[];
  cumulativeKm: number[];
  totalKm: number;
}

interface CorridorProjection {
  segmentIndex: number;
  segmentT: number;
  progressKm: number;
  distanceKm: number;
}

interface VehicleRouteState {
  corridorId: string;
  progressKm: number;
  direction: 1 | -1;
}

interface TrailPath {
  id: string;
  status: VehicleStatus;
  selected: boolean;
  points: LatLngTuple[];
}

const ROUTE_CORRIDORS: RouteCorridor[] = [
  {
    id: "coastal-west-east",
    tags: ["takoradi", "cape coast", "accra", "tema", "aflao", "lome", "cotonou", "lagos"],
    points: [
      [4.9016, -1.7831],
      [5.1053, -1.2467],
      [5.6037, -0.187],
      [5.6698, 0.0175],
      [5.96, 0.55],
      [6.12, 1.21],
      [6.1375, 1.2123],
      [6.3654, 2.4183],
      [6.5244, 3.3792],
    ],
  },
  {
    id: "accra-kumasi-tamale",
    tags: ["accra", "dodowa", "nkawkaw", "kumasi", "tamale", "sunyani", "ejisu"],
    points: [
      [5.6037, -0.187],
      [5.923, -0.045],
      [6.1751, -1.0345],
      [6.6885, -1.6244],
      [7.337, -2.3285],
      [9.4035, -0.8393],
    ],
  },
  {
    id: "accra-ring",
    tags: ["accra", "achimota", "dansoman", "tema", "port", "somanya"],
    points: [
      [5.55, -0.22],
      [5.6037, -0.187],
      [5.615, -0.205],
      [5.648, -0.007],
      [5.6698, 0.0175],
      [5.88, 0.17],
      [5.6037, -0.187],
    ],
  },
  {
    id: "kumasi-cluster",
    tags: ["kumasi", "ejisu", "sunyani", "takoradi"],
    points: [
      [6.6885, -1.6244],
      [6.73, -1.37],
      [7.337, -2.3285],
      [6.6885, -1.6244],
    ],
  },
];

const statusColorClass: Record<VehicleStatus, string> = {
  moving: "bg-fleet-success",
  idle: "bg-fleet-warning",
  stopped: "bg-fleet-danger",
  offline: "bg-muted-foreground",
};

const statusHex: Record<VehicleStatus, string> = {
  moving: "#10b981",
  idle: "#f59e0b",
  stopped: "#ef4444",
  offline: "#64748b",
};

const statusTone: Record<VehicleStatus, "success" | "warning" | "danger" | "neutral"> = {
  moving: "success",
  idle: "warning",
  stopped: "danger",
  offline: "neutral",
};

const statusOrder: Array<VehicleStatus | "all"> = ["all", "moving", "idle", "stopped", "offline"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHeading(heading: number) {
  const normalized = heading % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function angleDelta(a: number, b: number) {
  const delta = Math.abs(normalizeHeading(a) - normalizeHeading(b));
  return delta > 180 ? 360 - delta : delta;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineKm(a: LatLngTuple, b: LatLngTuple) {
  const lat1 = toRadians(a[0]);
  const lat2 = toRadians(b[0]);
  const dLat = lat2 - lat1;
  const dLng = toRadians(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function headingBetween(from: LatLngTuple, to: LatLngTuple) {
  const lat1 = toRadians(from[0]);
  const lat2 = toRadians(to[0]);
  const dLng = toRadians(to[1] - from[1]);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return normalizeHeading((Math.atan2(y, x) * 180) / Math.PI);
}

function buildCorridorMetrics(corridor: RouteCorridor): CorridorMetrics {
  const segmentKm: number[] = [];
  const cumulativeKm: number[] = [0];

  for (let index = 0; index < corridor.points.length - 1; index += 1) {
    const from = corridor.points[index];
    const to = corridor.points[index + 1];
    const km = haversineKm(from, to);
    segmentKm.push(km);
    cumulativeKm.push(cumulativeKm[index] + km);
  }

  return {
    corridor,
    points: corridor.points,
    segmentKm,
    cumulativeKm,
    totalKm: cumulativeKm[cumulativeKm.length - 1] ?? 0,
  };
}

const corridorMetrics = ROUTE_CORRIDORS.map(buildCorridorMetrics);
const corridorById = Object.fromEntries(
  corridorMetrics.map((metrics) => [metrics.corridor.id, metrics]),
) as Record<string, CorridorMetrics>;

function projectToSegment(point: LatLngTuple, from: LatLngTuple, to: LatLngTuple) {
  const midLatCos = Math.max(Math.cos(toRadians((from[0] + to[0] + point[0]) / 3)), 0.2);
  const px = point[1] * midLatCos;
  const py = point[0];
  const ax = from[1] * midLatCos;
  const ay = from[0];
  const bx = to[1] * midLatCos;
  const by = to[0];
  const abx = bx - ax;
  const aby = by - ay;
  const abSq = abx * abx + aby * aby;
  const t = abSq === 0 ? 0 : clamp(((px - ax) * abx + (py - ay) * aby) / abSq, 0, 1);
  const lat = from[0] + (to[0] - from[0]) * t;
  const lng = from[1] + (to[1] - from[1]) * t;
  return { t, point: [lat, lng] as LatLngTuple };
}

function locateOnCorridor(point: LatLngTuple, metrics: CorridorMetrics): CorridorProjection {
  let best: CorridorProjection = {
    segmentIndex: 0,
    segmentT: 0,
    progressKm: 0,
    distanceKm: Number.POSITIVE_INFINITY,
  };

  for (let index = 0; index < metrics.points.length - 1; index += 1) {
    const from = metrics.points[index];
    const to = metrics.points[index + 1];
    const projected = projectToSegment(point, from, to);
    const distanceKm = haversineKm(point, projected.point);
    if (distanceKm < best.distanceKm) {
      const segmentDistance = metrics.segmentKm[index] ?? 0;
      best = {
        segmentIndex: index,
        segmentT: projected.t,
        progressKm: (metrics.cumulativeKm[index] ?? 0) + segmentDistance * projected.t,
        distanceKm,
      };
    }
  }

  return best;
}

function getPointAtProgress(metrics: CorridorMetrics, progressKm: number): LatLngTuple {
  if (metrics.points.length < 2 || metrics.totalKm <= 0) {
    return metrics.points[0] ?? [0, 0];
  }

  const clampedProgress = clamp(progressKm, 0, metrics.totalKm);

  for (let index = 0; index < metrics.segmentKm.length; index += 1) {
    const segmentStart = metrics.cumulativeKm[index] ?? 0;
    const segmentEnd = metrics.cumulativeKm[index + 1] ?? segmentStart;
    if (clampedProgress <= segmentEnd || index === metrics.segmentKm.length - 1) {
      const segmentLength = metrics.segmentKm[index] || 1;
      const t = clamp((clampedProgress - segmentStart) / segmentLength, 0, 1);
      const from = metrics.points[index];
      const to = metrics.points[index + 1] ?? from;
      return [
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
      ];
    }
  }

  return metrics.points[metrics.points.length - 1];
}

function getCorridorSlice(metrics: CorridorMetrics, startKm: number, endKm: number, stepKm = 2.5) {
  if (metrics.totalKm <= 0) return [] as LatLngTuple[];

  const start = clamp(startKm, 0, metrics.totalKm);
  const end = clamp(endKm, 0, metrics.totalKm);
  const direction = start <= end ? 1 : -1;
  const points: LatLngTuple[] = [];
  let cursor = start;

  while ((direction > 0 && cursor < end) || (direction < 0 && cursor > end)) {
    points.push(getPointAtProgress(metrics, cursor));
    cursor += direction * stepKm;
  }

  points.push(getPointAtProgress(metrics, end));
  return points;
}

function dedupePoints(points: LatLngTuple[], minGapMeters = 120) {
  if (!points.length) return [] as LatLngTuple[];
  const result: LatLngTuple[] = [points[0]];
  const minGapKm = minGapMeters / 1000;

  for (let index = 1; index < points.length; index += 1) {
    if (haversineKm(points[index], result[result.length - 1]) >= minGapKm) {
      result.push(points[index]);
    }
  }

  if (result.length === 1 && points.length > 1) {
    result.push(points[points.length - 1]);
  }

  return result;
}

function resolveDirection(heading: number, metrics: CorridorMetrics, segmentIndex: number) {
  const boundedIndex = clamp(segmentIndex, 0, metrics.points.length - 2);
  const from = metrics.points[boundedIndex];
  const to = metrics.points[boundedIndex + 1] ?? from;
  const forwardHeading = headingBetween(from, to);
  const reverseHeading = normalizeHeading(forwardHeading + 180);

  return angleDelta(heading, forwardHeading) <= angleDelta(heading, reverseHeading) ? 1 : -1;
}

function pickBestCorridor(position: LatLngTuple, label: string) {
  const labelLower = label.toLowerCase();
  let best = corridorMetrics[0];
  let bestProjection = locateOnCorridor(position, best);
  let bestScore = bestProjection.distanceKm;

  for (let index = 1; index < corridorMetrics.length; index += 1) {
    const candidate = corridorMetrics[index];
    const projection = locateOnCorridor(position, candidate);
    const hasTagMatch = candidate.corridor.tags.some((tag) => labelLower.includes(tag));
    const score = projection.distanceKm - (hasTagMatch ? 25 : 0);

    if (score < bestScore) {
      best = candidate;
      bestProjection = projection;
      bestScore = score;
    }
  }

  return { metrics: best, projection: bestProjection };
}

function initializeVehicleRoutes(seedVehicles: Vehicle[]) {
  const routeState: Record<string, VehicleRouteState> = {};
  const snappedVehicles = seedVehicles.map((vehicle) => {
    const position: LatLngTuple = [vehicle.lastLocation.lat, vehicle.lastLocation.lng];
    const best = pickBestCorridor(position, vehicle.lastLocation.label);
    const direction =
      vehicle.status === "moving" && vehicle.heading > 0
        ? resolveDirection(vehicle.heading, best.metrics, best.projection.segmentIndex)
        : 1;
    const snappedPoint = getPointAtProgress(best.metrics, best.projection.progressKm);

    routeState[vehicle.id] = {
      corridorId: best.metrics.corridor.id,
      progressKm: best.projection.progressKm,
      direction,
    };

    return {
      ...vehicle,
      heading: vehicle.status === "moving" ? Math.round(vehicle.heading) : vehicle.heading,
      lastLocation: {
        ...vehicle.lastLocation,
        lat: Number(snappedPoint[0].toFixed(5)),
        lng: Number(snappedPoint[1].toFixed(5)),
      },
    };
  });

  return { routeState, snappedVehicles };
}

function vehicleImageByType(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("pickup")) return "/vehicle-types/pickup.svg";
  if (lower.includes("van")) return "/vehicle-types/van.svg";
  if (lower.includes("truck")) return "/vehicle-types/truck.svg";
  return "/vehicle-types/utility.svg";
}

function vehicleAbbreviation(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("pickup")) return "PK";
  if (lower.includes("van")) return "VN";
  if (lower.includes("light")) return "LT";
  if (lower.includes("medium")) return "MT";
  return "HT";
}

function createMarkerIcon(vehicle: Vehicle): DivIcon {
  const pulse =
    vehicle.status === "moving"
      ? `<span class="fleet-marker-pulse" style="background:${statusHex[vehicle.status]}44"></span>`
      : "";

  return L.divIcon({
    className: "fleet-marker-wrapper",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -14],
    html: `
      <div class="fleet-marker" style="--fleet-marker-color:${statusHex[vehicle.status]}">
        ${pulse}
        <span style="font-weight:700;font-size:11px;letter-spacing:0.03em;color:white">${vehicleAbbreviation(vehicle.type)}</span>
      </div>
    `,
  });
}

function streamVehicle(
  vehicle: Vehicle,
  state: VehicleRouteState,
): { vehicle: Vehicle; state: VehicleRouteState } {
  const metrics = corridorById[state.corridorId] ?? corridorMetrics[0];

  if (!metrics || metrics.totalKm <= 0 || vehicle.status !== "moving") {
    const parkedPoint = getPointAtProgress(metrics, state.progressKm);
    return {
      vehicle: {
        ...vehicle,
        speed: vehicle.status === "moving" ? vehicle.speed : 0,
        lastLocation: {
          ...vehicle.lastLocation,
          lat: Number(parkedPoint[0].toFixed(5)),
          lng: Number(parkedPoint[1].toFixed(5)),
        },
      },
      state,
    };
  }

  const speedDelta = Math.random() * 10 - 5;
  const nextSpeed = clamp(Math.round(vehicle.speed + speedDelta), 18, 100);
  const distanceKm = (nextSpeed * STREAM_INTERVAL_MS) / 3_600_000;
  let nextDirection = state.direction;
  let nextProgress = state.progressKm + distanceKm * nextDirection;

  if (nextProgress < 0 || nextProgress > metrics.totalKm) {
    nextDirection = (nextDirection === 1 ? -1 : 1) as 1 | -1;
    nextProgress = clamp(nextProgress, 0, metrics.totalKm);
  }

  const currentPoint = getPointAtProgress(metrics, state.progressKm);
  const nextPoint = getPointAtProgress(metrics, nextProgress);
  const nextHeading = headingBetween(currentPoint, nextPoint);

  return {
    vehicle: {
      ...vehicle,
      speed: nextSpeed,
      heading: Math.round(nextHeading),
      fuelLevel: Math.round(clamp(vehicle.fuelLevel - Math.random() * 0.2, 0, 100) * 10) / 10,
      lastLocation: {
        ...vehicle.lastLocation,
        lat: Number(nextPoint[0].toFixed(5)),
        lng: Number(nextPoint[1].toFixed(5)),
      },
    },
    state: {
      corridorId: metrics.corridor.id,
      direction: nextDirection,
      progressKm: nextProgress,
    },
  };
}

function FitToMarkers({ positions, fitToken }: { positions: Array<[number, number]>; fitToken: number }) {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) return;
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds.pad(0.2), { animate: true, duration: 0.7, maxZoom: 11 });
  }, [fitToken, map, positions]);

  return null;
}

function FocusSelected({
  selected,
  followSelected,
}: {
  selected: Vehicle | null;
  followSelected: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selected || !followSelected) return;
    map.flyTo([selected.lastLocation.lat, selected.lastLocation.lng], Math.max(map.getZoom(), 9), {
      duration: 0.6,
    });
  }, [followSelected, map, selected?.id, selected?.lastLocation.lat, selected?.lastLocation.lng]);

  return null;
}

export default function FleetMap() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const seededFleet = useMemo(() => initializeVehicleRoutes(vehicles), []);
  const routeStateRef = useRef<Record<string, VehicleRouteState>>(seededFleet.routeState);
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>(seededFleet.snappedVehicles);
  const [historyFrames, setHistoryFrames] = useState<Vehicle[][]>([seededFleet.snappedVehicles]);
  const [selectedId, setSelectedId] = useState<string | null>(seededFleet.snappedVehicles[0]?.id ?? null);
  const [lastStreamAt, setLastStreamAt] = useState<Date>(new Date());
  const [fitToken, setFitToken] = useState(1);
  const [fitPositions, setFitPositions] = useState<Array<[number, number]>>(
    seededFleet.snappedVehicles.map((vehicle) => [vehicle.lastLocation.lat, vehicle.lastLocation.lng]),
  );

  const [viewState, setViewState] = useState<FleetMapViewState>({
    filter: "all",
    mapStyle: "streets",
    playbackMode: false,
    playbackIndex: 0,
    followSelected: true,
    showTrails: true,
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveVehicles((prev) =>
        prev.map((vehicle) => {
          const currentState =
            routeStateRef.current[vehicle.id] ??
            initializeVehicleRoutes([vehicle]).routeState[vehicle.id];
          const streamed = streamVehicle(vehicle, currentState);
          routeStateRef.current[vehicle.id] = streamed.state;
          return streamed.vehicle;
        }),
      );
      setLastStreamAt(new Date());
    }, STREAM_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setHistoryFrames((prev) => {
      const next = [...prev, liveVehicles].slice(-HISTORY_LIMIT);
      if (!viewState.playbackMode) {
        setViewState((current) => ({ ...current, playbackIndex: next.length - 1 }));
      }
      return next;
    });
  }, [liveVehicles, viewState.playbackMode]);

  const shownVehicles = useMemo(() => {
    if (!viewState.playbackMode) return liveVehicles;
    return historyFrames[viewState.playbackIndex] ?? liveVehicles;
  }, [historyFrames, liveVehicles, viewState.playbackIndex, viewState.playbackMode]);

  const counts = useMemo(
    () => ({
      all: shownVehicles.length,
      moving: shownVehicles.filter((vehicle) => vehicle.status === "moving").length,
      idle: shownVehicles.filter((vehicle) => vehicle.status === "idle").length,
      stopped: shownVehicles.filter((vehicle) => vehicle.status === "stopped").length,
      offline: shownVehicles.filter((vehicle) => vehicle.status === "offline").length,
    }),
    [shownVehicles],
  );

  const filteredVehicles = useMemo(
    () =>
      viewState.filter === "all"
        ? shownVehicles
        : shownVehicles.filter((vehicle) => vehicle.status === viewState.filter),
    [shownVehicles, viewState.filter],
  );

  const selected = useMemo(
    () => filteredVehicles.find((vehicle) => vehicle.id === selectedId) ?? null,
    [filteredVehicles, selectedId],
  );

  const driver = selected?.assignedDriver ? getDriverById(selected.assignedDriver) : null;

  const trailPaths = useMemo(() => {
    if (!viewState.showTrails) return [] as TrailPath[];
    const frames = viewState.playbackMode
      ? historyFrames.slice(0, viewState.playbackIndex + 1)
      : historyFrames;

    return filteredVehicles
      .map((vehicle) => {
        const routeState = routeStateRef.current[vehicle.id];
        const metrics = routeState ? corridorById[routeState.corridorId] : undefined;
        if (!metrics) return null;

        const progressHistory = frames
          .map((frame) => frame.find((entry) => entry.id === vehicle.id))
          .filter((entry): entry is Vehicle => Boolean(entry))
          .map((entry) =>
            locateOnCorridor([entry.lastLocation.lat, entry.lastLocation.lng], metrics).progressKm,
          );

        const selectedTrail = vehicle.id === selectedId;
        const currentProgress = progressHistory.at(-1) ?? routeState.progressKm;
        let points: LatLngTuple[];

        if (progressHistory.length > 1) {
          const start = progressHistory[0] ?? currentProgress;
          const end = progressHistory[progressHistory.length - 1] ?? currentProgress;
          const extraLeadKm = selectedTrail ? 35 : 16;
          const extraTailKm = selectedTrail ? 45 : 22;
          points = getCorridorSlice(
            metrics,
            start - extraTailKm * routeState.direction,
            end + extraLeadKm * routeState.direction,
            selectedTrail ? 1.4 : 2.2,
          );
        } else {
          const tailKm = selectedTrail ? 60 : 24;
          const leadKm = selectedTrail ? 40 : 16;
          points = getCorridorSlice(
            metrics,
            currentProgress - tailKm * routeState.direction,
            currentProgress + leadKm * routeState.direction,
            selectedTrail ? 1.2 : 2,
          );
        }

        return {
          id: vehicle.id,
          status: vehicle.status,
          selected: selectedTrail,
          points: dedupePoints(points),
        };
      })
      .filter((trail): trail is TrailPath => Boolean(trail) && trail.points.length > 1);
  }, [
    filteredVehicles,
    historyFrames,
    selectedId,
    viewState.playbackIndex,
    viewState.playbackMode,
    viewState.showTrails,
  ]);

  const requestMapFit = (targetVehicles: Vehicle[]) => {
    if (!targetVehicles.length) return;
    setFitPositions(targetVehicles.map((vehicle) => [vehicle.lastLocation.lat, vehicle.lastLocation.lng]));
    setFitToken((value) => value + 1);
  };

  useEffect(() => {
    if (!selectedId) return;
    if (!filteredVehicles.some((vehicle) => vehicle.id === selectedId)) {
      setSelectedId(filteredVehicles[0]?.id ?? null);
    }
  }, [filteredVehicles, selectedId]);

  const tileConfig =
    viewState.mapStyle === "terrain"
      ? {
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution: "Map data: OpenStreetMap contributors, SRTM",
        }
      : resolvedTheme === "dark"
        ? {
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            attribution: "Map data: OpenStreetMap contributors and CARTO",
          }
        : {
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            attribution: "Map data: OpenStreetMap contributors and CARTO",
          };

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Live Tracking"
        title="Fleet Interactive Map"
        description="Track moving units in real time, inspect telemetry, and replay recent movement windows."
        actions={
          <>
            <Badge variant="outline" className="gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {lastStreamAt.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => requestMapFit(filteredVehicles)}>
              <Crosshair className="mr-1 h-3.5 w-3.5" />
              Fit View
            </Button>
          </>
        }
      />

      <div className="surface-raised rounded-2xl p-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <FilterChipBar
            items={statusOrder.map((status) => ({
              key: status,
              label: status === "all" ? "all" : status,
              count: counts[status],
              colorClassName: status === "all" ? undefined : statusColorClass[status],
            }))}
            active={viewState.filter}
            onChange={(value) => {
              const nextFilter = value as VehicleStatus | "all";
              setViewState((current) => ({ ...current, filter: nextFilter }));
              const target = nextFilter === "all" ? shownVehicles : shownVehicles.filter((item) => item.status === nextFilter);
              requestMapFit(target);
            }}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={viewState.playbackMode ? "default" : "outline"}
              onClick={() => setViewState((current) => ({ ...current, playbackMode: !current.playbackMode }))}
            >
              {viewState.playbackMode ? <Pause className="mr-1 h-3.5 w-3.5" /> : <Play className="mr-1 h-3.5 w-3.5" />}
              {viewState.playbackMode ? "Live Mode" : "Replay Mode"}
            </Button>
            <Button
              size="sm"
              variant={viewState.showTrails ? "default" : "outline"}
              onClick={() => setViewState((current) => ({ ...current, showTrails: !current.showTrails }))}
            >
              <Route className="mr-1 h-3.5 w-3.5" />
              Trails
            </Button>
            <Button
              size="sm"
              variant={viewState.followSelected ? "default" : "outline"}
              onClick={() => setViewState((current) => ({ ...current, followSelected: !current.followSelected }))}
            >
              <Navigation className="mr-1 h-3.5 w-3.5" />
              Follow Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setViewState((current) => ({
                  ...current,
                  mapStyle: current.mapStyle === "streets" ? "terrain" : "streets",
                }))
              }
            >
              <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
              {viewState.mapStyle === "streets" ? "Terrain" : "Streets"}
            </Button>
          </div>
        </div>

        {viewState.playbackMode ? (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">Playback</span>
            <input
              type="range"
              min={0}
              max={Math.max(historyFrames.length - 1, 0)}
              value={viewState.playbackIndex}
              className="h-2 w-full accent-[hsl(var(--primary))]"
              onChange={(event) =>
                setViewState((current) => ({ ...current, playbackIndex: Number(event.target.value) }))
              }
            />
            <span className="text-xs text-muted-foreground">{viewState.playbackIndex + 1}/{historyFrames.length}</span>
          </div>
        ) : null}
      </div>

      <section className="workspace-grid with-inspector">
        <div className="map-shell h-[calc(100svh-18rem)] min-h-[34rem]">
          <MapContainer center={[6.2, 0.2]} zoom={7} minZoom={5} maxZoom={14} scrollWheelZoom className="h-full w-full">
            <TileLayer url={tileConfig.url} attribution={tileConfig.attribution} />
            <FitToMarkers positions={fitPositions} fitToken={fitToken} />
            <FocusSelected selected={selected} followSelected={viewState.followSelected} />

            {corridorMetrics.map((metrics) => (
              <Polyline
                key={`corridor-${metrics.corridor.id}`}
                positions={metrics.points}
                pathOptions={{
                  color: resolvedTheme === "dark" ? "#134e4a" : "#0f766e",
                  weight: 1.4,
                  opacity: 0.26,
                  dashArray: "5 8",
                }}
              />
            ))}

            {trailPaths.map((trail) => (
              <Polyline
                key={trail.id}
                positions={trail.points}
                pathOptions={{
                  color: trail.selected ? "#2dd4bf" : statusHex[trail.status],
                  weight: trail.selected ? 4 : 2.6,
                  opacity: trail.selected ? 0.95 : trail.status === "offline" ? 0.42 : 0.7,
                  dashArray: trail.status === "offline" ? "4 7" : undefined,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            ))}

            <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
              {filteredVehicles.map((vehicle) => (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lastLocation.lat, vehicle.lastLocation.lng]}
                  icon={createMarkerIcon(vehicle)}
                  eventHandlers={{ click: () => setSelectedId(vehicle.id) }}
                >
                  <Popup>
                    <div className="min-w-[220px] space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={vehicleImageByType(vehicle.type)}
                          alt={`${vehicle.type} view`}
                          className="h-10 w-16 rounded-md border bg-muted/30 object-contain p-1"
                        />
                        <div>
                          <p className="text-sm font-semibold">{vehicle.registration}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.make} {vehicle.model}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <p>Status: <span className="font-semibold capitalize">{vehicle.status}</span></p>
                        <p>Speed: <span className="font-semibold">{vehicle.speed} km/h</span></p>
                        <p>Fuel: <span className="font-semibold">{vehicle.fuelLevel}%</span></p>
                        <p>Health: <span className="font-semibold">{vehicle.healthScore}/100</span></p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.lastLocation.label} ({vehicle.lastLocation.lat.toFixed(4)}, {vehicle.lastLocation.lng.toFixed(4)})
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        {selected ? (
          <InspectorPanel title={selected.registration} subtitle={`${selected.make} ${selected.model}`}>
            <img
              src={vehicleImageByType(selected.type)}
              alt={`${selected.type} profile`}
              className="h-28 w-full rounded-xl border bg-muted/30 object-contain p-2"
            />

            <div className="flex items-center justify-between">
              <StatusPill label={selected.status} tone={statusTone[selected.status]} />
              <p className="text-xs text-muted-foreground">{selected.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="surface-raised rounded-xl p-2.5">
                <p className="text-[11px] text-muted-foreground">Speed</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                  <Gauge className="h-3.5 w-3.5 text-primary" />
                  {selected.speed} km/h
                </p>
              </div>
              <div className="surface-raised rounded-xl p-2.5">
                <p className="text-[11px] text-muted-foreground">Heading</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  {selected.heading} deg
                </p>
              </div>
              <div className="surface-raised rounded-xl p-2.5">
                <p className="text-[11px] text-muted-foreground">Fuel</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                  <Fuel className="h-3.5 w-3.5 text-primary" />
                  {selected.fuelLevel}%
                </p>
              </div>
              <div className="surface-raised rounded-xl p-2.5">
                <p className="text-[11px] text-muted-foreground">Health</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {selected.healthScore}/100
                </p>
              </div>
            </div>

            <div className="surface-raised rounded-xl p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Live Position</p>
              <p className="mt-1 text-sm">{selected.lastLocation.label}</p>
              <p className="text-xs text-muted-foreground">
                {selected.lastLocation.lat.toFixed(5)}, {selected.lastLocation.lng.toFixed(5)}
              </p>
            </div>

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Assigned Driver</p>
              {driver ? (
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {driver.avatar}
                  </span>
                  <div>
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.phone}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No driver assigned</p>
              )}
            </div>

            <div className="rounded-xl border border-border/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Telemetry</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last stream {lastStreamAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>

            <Button className="w-full" onClick={() => navigate(`/vehicles?vehicle=${selected.id}`)}>
              <Truck className="mr-1 h-4 w-4" />
              Open Vehicle Workspace
            </Button>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
