import type { VehicleStatus } from "@/data/mock-data";

export type ThemeMode = "light" | "dark" | "system";

export interface InspectorViewState {
  selectedId: string | null;
  open: boolean;
}

export interface FleetMapViewState {
  filter: VehicleStatus | "all";
  mapStyle: "streets" | "terrain";
  playbackMode: boolean;
  playbackIndex: number;
  followSelected: boolean;
  showTrails: boolean;
}
