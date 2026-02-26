import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { vehicles, getDriverById, type Vehicle, type VehicleStatus } from "@/data/mock-data";
import { Clock3, Fuel as FuelIcon, Gauge, Navigation, Radar, Route, ShieldCheck, X } from "lucide-react";
import L, { type DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const STREAM_INTERVAL_MS = 3000;

const mapBounds = {
  north: 10.3,
  south: 4.4,
  east: 3.9,
  west: -2.6,
};

const statusDotColors: Record<VehicleStatus, string> = {
  moving: "bg-fleet-success",
  idle: "bg-fleet-warning",
  stopped: "bg-fleet-danger",
  offline: "bg-muted-foreground",
};

const statusHexColors: Record<VehicleStatus, string> = {
  moving: "#22c55e",
  idle: "#f59e0b",
  stopped: "#ef4444",
  offline: "#64748b",
};

const statusLabels: Record<VehicleStatus, string> = {
  moving: "Moving",
  idle: "Idle",
  stopped: "Stopped",
  offline: "Offline",
};

const statusBadge: Record<VehicleStatus, string> = {
  moving: "bg-fleet-success text-fleet-success-foreground",
  idle: "bg-fleet-warning text-fleet-warning-foreground",
  stopped: "bg-fleet-danger text-fleet-danger-foreground",
  offline: "bg-muted text-muted-foreground",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHeading(heading: number) {
  const normalized = heading % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function vehicleGlyph(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("pickup")) return "1F6FB";
  if (lower.includes("van")) return "1F690";
  if (lower.includes("truck")) return "1F69A";
  return "1F69A";
}

function vehicleImageByType(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("pickup")) return "/vehicle-types/pickup.svg";
  if (lower.includes("van")) return "/vehicle-types/van.svg";
  if (lower.includes("truck")) return "/vehicle-types/truck.svg";
  return "/vehicle-types/utility.svg";
}

function createMarkerIcon(vehicle: Vehicle): DivIcon {
  const color = statusHexColors[vehicle.status];
  const pulse =
    vehicle.status === "moving"
      ? `<span class="fleet-marker-pulse" style="background:${color}44"></span>`
      : "";

  return L.divIcon({
    className: "fleet-marker-wrapper",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -14],
    html: `
      <div class="fleet-marker" style="--fleet-marker-color:${color}">
        ${pulse}
        <span class="fleet-marker-glyph">&#x${vehicleGlyph(vehicle.type)};</span>
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
    map.fitBounds(bounds.pad(0.2), { animate: true, duration: 0.8, maxZoom: 10 });
  }, [fitToken, map, positions]);

  return null;
}

function FocusOnSelected({ vehicle }: { vehicle: Vehicle | null }) {
  const map = useMap();
  const selectedId = vehicle?.id;

  useEffect(() => {
    if (!vehicle) return;
    map.flyTo([vehicle.lastLocation.lat, vehicle.lastLocation.lng], Math.max(map.getZoom(), 9), { duration: 0.8 });
  }, [map, selectedId]);

  return null;
}

export default function FleetMap() {
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>(vehicles);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastStreamAt, setLastStreamAt] = useState<Date>(new Date());
  const [fitToken, setFitToken] = useState(1);
  const [fitPositions, setFitPositions] = useState<Array<[number, number]>>(
    vehicles.map((vehicle) => [vehicle.lastLocation.lat, vehicle.lastLocation.lng]),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveVehicles((prev) => prev.map(streamVehicle));
      setLastStreamAt(new Date());
    }, STREAM_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const counts = useMemo(
    () => ({
      all: liveVehicles.length,
      moving: liveVehicles.filter((vehicle) => vehicle.status === "moving").length,
      idle: liveVehicles.filter((vehicle) => vehicle.status === "idle").length,
      stopped: liveVehicles.filter((vehicle) => vehicle.status === "stopped").length,
      offline: liveVehicles.filter((vehicle) => vehicle.status === "offline").length,
    }),
    [liveVehicles],
  );

  const filteredVehicles = useMemo(
    () => (filter === "all" ? liveVehicles : liveVehicles.filter((vehicle) => vehicle.status === filter)),
    [filter, liveVehicles],
  );

  const selected = useMemo(
    () => liveVehicles.find((vehicle) => vehicle.id === selectedId) ?? null,
    [liveVehicles, selectedId],
  );

  const driver = selected?.assignedDriver ? getDriverById(selected.assignedDriver) : null;

  useEffect(() => {
    if (!selectedId) return;
    const existsInFilter = filteredVehicles.some((vehicle) => vehicle.id === selectedId);
    if (!existsInFilter) setSelectedId(null);
  }, [filteredVehicles, selectedId]);

  const requestMapFit = (targetVehicles: Vehicle[]) => {
    if (!targetVehicles.length) return;
    setFitPositions(targetVehicles.map((vehicle) => [vehicle.lastLocation.lat, vehicle.lastLocation.lng]));
    setFitToken((value) => value + 1);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between gap-3 border-b bg-card px-4 py-2 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(["all", "moving", "idle", "stopped", "offline"] as const).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => {
                setFilter(statusKey);
                const target =
                  statusKey === "all"
                    ? liveVehicles
                    : liveVehicles.filter((vehicle) => vehicle.status === statusKey);
                requestMapFit(target);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === statusKey
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {statusKey !== "all" && <span className={`h-2 w-2 rounded-full ${statusDotColors[statusKey]}`} />}
              <span className="capitalize">{statusKey}</span>
              <span className="ml-1 text-[10px]">({counts[statusKey]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fleet-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fleet-success" />
            </span>
            <span>Streaming live</span>
            <span className="text-[11px] text-muted-foreground/80">
              {lastStreamAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => requestMapFit(filteredVehicles)}>
            <Radar className="h-3.5 w-3.5" />
            View Interactive Map
          </Button>
        </div>
      </div>

      <div className="flex-1 flex relative min-h-0">
        <div className="flex-1 min-h-0">
          <MapContainer center={[6.2, 0.2]} zoom={7} minZoom={5} maxZoom={14} scrollWheelZoom className="h-full w-full z-0">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            />

            <FitToMarkers positions={fitPositions} fitToken={fitToken} />
            <FocusOnSelected vehicle={selected} />

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
                        alt={`${vehicle.type} vehicle`}
                        className="h-10 w-16 rounded-md border bg-muted/40 object-contain p-1"
                      />
                      <div>
                        <p className="text-sm font-semibold">{vehicle.registration}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.make} {vehicle.model}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <p>Status: <span className="font-medium">{statusLabels[vehicle.status]}</span></p>
                      <p>Speed: <span className="font-medium">{vehicle.speed} km/h</span></p>
                      <p>Fuel: <span className="font-medium">{vehicle.fuelLevel}%</span></p>
                      <p>Health: <span className="font-medium">{vehicle.healthScore}/100</span></p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.lastLocation.label} ({vehicle.lastLocation.lat.toFixed(4)}, {vehicle.lastLocation.lng.toFixed(4)})
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {selected && (
          <div className="absolute md:static right-0 top-0 bottom-0 z-[500] w-[22rem] max-w-[94vw] border-l bg-card overflow-auto shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-sm">{selected.registration}</h3>
              <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <img
                src={vehicleImageByType(selected.type)}
                alt={`${selected.type} image`}
                className="h-28 w-full rounded-lg border bg-muted/40 object-contain p-2"
              />

              <div className="flex items-center justify-between gap-2">
                <Badge className={statusBadge[selected.status]}>{statusLabels[selected.status]}</Badge>
                <span className="text-xs text-muted-foreground">{selected.type}</span>
              </div>

              <div>
                <p className="text-sm font-medium">{selected.make} {selected.model}</p>
                <p className="text-xs text-muted-foreground">Year {selected.year} | Odometer {selected.odometer.toLocaleString()} km</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Gauge className="h-3 w-3" /> Speed</div>
                  <p className="text-sm font-semibold">{selected.speed} km/h</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Navigation className="h-3 w-3" /> Heading</div>
                  <p className="text-sm font-semibold">{selected.heading} deg</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><FuelIcon className="h-3 w-3" /> Fuel</div>
                  <p className="text-sm font-semibold">{selected.fuelLevel}%</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><ShieldCheck className="h-3 w-3" /> Health</div>
                  <p className="text-sm font-semibold">{selected.healthScore}/100</p>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Live location</p>
                <p className="text-sm">{selected.lastLocation.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {selected.lastLocation.lat.toFixed(5)}, {selected.lastLocation.lng.toFixed(5)}
                </p>
              </div>

              <div className="border-t pt-3 space-y-1">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Telemetry stream</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock3 className="h-3 w-3" />
                  Last update {lastStreamAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>

              {driver ? (
                <div className="border-t pt-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Assigned driver</p>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">{driver.avatar}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{driver.name}</p>
                      <p className="text-[11px] text-muted-foreground">{driver.phone}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">Behavior score: {driver.behaviorScore}/100</p>
                </div>
              ) : (
                <div className="border-t pt-3 text-xs text-muted-foreground">No driver assigned.</div>
              )}

              <div className="border-t pt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                <Route className="h-3.5 w-3.5" />
                Marker remains clickable on map for continuous tracking.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
