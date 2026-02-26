import { useEffect, useMemo, useState } from "react";
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
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";
import { getDriverById, vehicles, type Vehicle, type VehicleStatus } from "@/data/mock-data";
import type { FleetMapViewState } from "@/types/workspace";

const STREAM_INTERVAL_MS = 3000;
const HISTORY_LIMIT = 14;

const mapBounds = {
  north: 10.3,
  south: 4.4,
  east: 3.9,
  west: -2.6,
};

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

function streamVehicle(vehicle: Vehicle): Vehicle {
  if (vehicle.status !== "moving") return vehicle;

  const speedDelta = Math.random() * 12 - 6;
  const headingDelta = Math.random() * 16 - 8;
  const nextSpeed = clamp(Math.round(vehicle.speed + speedDelta), 18, 100);
  const nextHeading = normalizeHeading(vehicle.heading + headingDelta);
  const distanceKm = (nextSpeed * STREAM_INTERVAL_MS) / 3_600_000;
  const headingRad = (nextHeading * Math.PI) / 180;

  const deltaLat = (distanceKm / 110.574) * Math.cos(headingRad);
  const lngScale = Math.max(Math.cos((vehicle.lastLocation.lat * Math.PI) / 180), 0.2);
  const deltaLng = (distanceKm / (111.32 * lngScale)) * Math.sin(headingRad);

  return {
    ...vehicle,
    speed: nextSpeed,
    heading: Math.round(nextHeading),
    fuelLevel: Math.round(clamp(vehicle.fuelLevel - Math.random() * 0.25, 0, 100) * 10) / 10,
    lastLocation: {
      ...vehicle.lastLocation,
      lat: Number(clamp(vehicle.lastLocation.lat + deltaLat, mapBounds.south, mapBounds.north).toFixed(5)),
      lng: Number(clamp(vehicle.lastLocation.lng + deltaLng, mapBounds.west, mapBounds.east).toFixed(5)),
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
  const { resolvedTheme } = useTheme();
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>(vehicles);
  const [historyFrames, setHistoryFrames] = useState<Vehicle[][]>([vehicles]);
  const [selectedId, setSelectedId] = useState<string | null>(vehicles[0]?.id ?? null);
  const [lastStreamAt, setLastStreamAt] = useState<Date>(new Date());
  const [fitToken, setFitToken] = useState(1);
  const [fitPositions, setFitPositions] = useState<Array<[number, number]>>(
    vehicles.map((vehicle) => [vehicle.lastLocation.lat, vehicle.lastLocation.lng]),
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
      setLiveVehicles((prev) => prev.map(streamVehicle));
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
    if (!viewState.showTrails) return [] as Array<{ id: string; points: Array<[number, number]> }>;
    const frames = viewState.playbackMode
      ? historyFrames.slice(0, viewState.playbackIndex + 1)
      : historyFrames;

    return filteredVehicles
      .filter((vehicle) => vehicle.status === "moving")
      .map((vehicle) => {
        const points = frames
          .map((frame) => frame.find((entry) => entry.id === vehicle.id))
          .filter((entry): entry is Vehicle => Boolean(entry))
          .map((entry) => [entry.lastLocation.lat, entry.lastLocation.lng] as [number, number]);

        return { id: vehicle.id, points };
      })
      .filter((trail) => trail.points.length > 1);
  }, [filteredVehicles, historyFrames, viewState.playbackIndex, viewState.playbackMode, viewState.showTrails]);

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

            {trailPaths.map((trail) => (
              <Polyline
                key={trail.id}
                positions={trail.points}
                pathOptions={{ color: "#0ea5a4", weight: 2, opacity: 0.7 }}
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

            <Button className="w-full">
              <Truck className="mr-1 h-4 w-4" />
              Open Vehicle Workspace
            </Button>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
