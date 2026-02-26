// ===== VEHICLES =====
export type VehicleStatus = "moving" | "idle" | "stopped" | "offline";

export interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: VehicleStatus;
  healthScore: number;
  assignedDriver: string | null;
  lastLocation: { lat: number; lng: number; label: string };
  speed: number;
  heading: number;
  fuelLevel: number;
  odometer: number;
}

export const vehicles: Vehicle[] = [
  { id: "v1", registration: "GR-2841-24", make: "MAN", model: "TGS 26.360", year: 2022, type: "Heavy Truck", status: "moving", healthScore: 87, assignedDriver: "d1", lastLocation: { lat: 5.6037, lng: -0.1870, label: "Accra" }, speed: 72, heading: 45, fuelLevel: 65, odometer: 124500 },
  { id: "v2", registration: "GR-1193-23", make: "Scania", model: "P410", year: 2021, type: "Heavy Truck", status: "moving", healthScore: 92, assignedDriver: "d2", lastLocation: { lat: 6.0244, lng: -0.1833, label: "Tema Motorway" }, speed: 85, heading: 30, fuelLevel: 48, odometer: 198200 },
  { id: "v3", registration: "GR-5527-24", make: "DAF", model: "CF 85", year: 2023, type: "Heavy Truck", status: "idle", healthScore: 78, assignedDriver: "d3", lastLocation: { lat: 6.6885, lng: -1.6244, label: "Kumasi" }, speed: 0, heading: 0, fuelLevel: 30, odometer: 87600 },
  { id: "v4", registration: "GR-3310-23", make: "Mercedes-Benz", model: "Actros 2644", year: 2020, type: "Heavy Truck", status: "stopped", healthScore: 45, assignedDriver: null, lastLocation: { lat: 5.5571, lng: -0.2012, label: "Accra Workshop" }, speed: 0, heading: 0, fuelLevel: 12, odometer: 312400 },
  { id: "v5", registration: "GR-8891-24", make: "Isuzu", model: "FVR 34", year: 2023, type: "Medium Truck", status: "moving", healthScore: 95, assignedDriver: "d4", lastLocation: { lat: 6.1300, lng: 1.2228, label: "Near Lomé Border" }, speed: 60, heading: 90, fuelLevel: 72, odometer: 45300 },
  { id: "v6", registration: "GR-4456-22", make: "MAN", model: "TGA 18.360", year: 2019, type: "Heavy Truck", status: "moving", healthScore: 71, assignedDriver: "d5", lastLocation: { lat: 6.3549, lng: 2.4183, label: "Cotonou" }, speed: 55, heading: 270, fuelLevel: 38, odometer: 267800 },
  { id: "v7", registration: "GR-7724-24", make: "Toyota", model: "Hilux", year: 2024, type: "Pickup", status: "idle", healthScore: 98, assignedDriver: "d6", lastLocation: { lat: 5.5560, lng: -0.1969, label: "Tema Port" }, speed: 0, heading: 0, fuelLevel: 85, odometer: 12400 },
  { id: "v8", registration: "GR-6632-23", make: "Scania", model: "R450", year: 2022, type: "Heavy Truck", status: "offline", healthScore: 33, assignedDriver: null, lastLocation: { lat: 5.6150, lng: -0.2050, label: "Achimota" }, speed: 0, heading: 0, fuelLevel: 5, odometer: 345100 },
  { id: "v9", registration: "GR-2205-24", make: "Volvo", model: "FH 540", year: 2023, type: "Heavy Truck", status: "moving", healthScore: 89, assignedDriver: "d7", lastLocation: { lat: 7.3370, lng: -2.3285, label: "Sunyani" }, speed: 68, heading: 180, fuelLevel: 55, odometer: 78900 },
  { id: "v10", registration: "GR-9918-23", make: "DAF", model: "XF 105", year: 2021, type: "Heavy Truck", status: "idle", healthScore: 82, assignedDriver: "d8", lastLocation: { lat: 5.1100, lng: -1.2467, label: "Cape Coast" }, speed: 0, heading: 0, fuelLevel: 42, odometer: 189500 },
  { id: "v11", registration: "GR-1147-24", make: "Hino", model: "500 Series", year: 2024, type: "Medium Truck", status: "moving", healthScore: 96, assignedDriver: "d9", lastLocation: { lat: 6.4379, lng: 3.4151, label: "Lagos" }, speed: 42, heading: 315, fuelLevel: 60, odometer: 23400 },
  { id: "v12", registration: "GR-3389-22", make: "MAN", model: "TGX 18.500", year: 2020, type: "Heavy Truck", status: "stopped", healthScore: 58, assignedDriver: "d10", lastLocation: { lat: 6.1751, lng: -1.0345, label: "Nkawkaw" }, speed: 0, heading: 0, fuelLevel: 20, odometer: 298700 },
  { id: "v13", registration: "GR-5504-24", make: "Isuzu", model: "NPR 75", year: 2023, type: "Light Truck", status: "moving", healthScore: 91, assignedDriver: "d11", lastLocation: { lat: 5.6480, lng: -0.0070, label: "Tema" }, speed: 35, heading: 60, fuelLevel: 78, odometer: 34200 },
  { id: "v14", registration: "GR-8820-23", make: "Mercedes-Benz", model: "Sprinter", year: 2022, type: "Van", status: "idle", healthScore: 86, assignedDriver: null, lastLocation: { lat: 5.6037, lng: -0.1870, label: "Accra Central" }, speed: 0, heading: 0, fuelLevel: 90, odometer: 56700 },
  { id: "v15", registration: "GR-2276-24", make: "Scania", model: "G410", year: 2023, type: "Heavy Truck", status: "moving", healthScore: 88, assignedDriver: "d12", lastLocation: { lat: 6.6000, lng: -1.6000, label: "Ejisu" }, speed: 78, heading: 45, fuelLevel: 52, odometer: 67800 },
  { id: "v16", registration: "GR-4401-23", make: "DAF", model: "LF 210", year: 2021, type: "Medium Truck", status: "offline", healthScore: 25, assignedDriver: null, lastLocation: { lat: 5.5500, lng: -0.2200, label: "Dansoman" }, speed: 0, heading: 0, fuelLevel: 0, odometer: 401200 },
  { id: "v17", registration: "GR-6617-24", make: "Volvo", model: "FM 460", year: 2024, type: "Heavy Truck", status: "moving", healthScore: 97, assignedDriver: "d13", lastLocation: { lat: 6.1200, lng: 1.2100, label: "Aflao Border" }, speed: 15, heading: 90, fuelLevel: 68, odometer: 8900 },
  { id: "v18", registration: "GR-7783-22", make: "Toyota", model: "Dyna", year: 2020, type: "Light Truck", status: "idle", healthScore: 74, assignedDriver: "d14", lastLocation: { lat: 9.4035, lng: -0.8393, label: "Tamale" }, speed: 0, heading: 0, fuelLevel: 45, odometer: 156300 },
  { id: "v19", registration: "GR-1150-24", make: "MAN", model: "TGS 33.400", year: 2023, type: "Heavy Truck", status: "moving", healthScore: 84, assignedDriver: "d15", lastLocation: { lat: 5.9230, lng: -0.0450, label: "Dodowa Road" }, speed: 65, heading: 30, fuelLevel: 58, odometer: 54600 },
  { id: "v20", registration: "GR-9934-23", make: "Hino", model: "700 Series", year: 2022, type: "Heavy Truck", status: "stopped", healthScore: 62, assignedDriver: null, lastLocation: { lat: 6.6885, lng: -1.6244, label: "Kumasi Depot" }, speed: 0, heading: 0, fuelLevel: 15, odometer: 234500 },
  { id: "v21", registration: "GR-3321-24", make: "Isuzu", model: "FTS 34", year: 2024, type: "Heavy Truck", status: "moving", healthScore: 99, assignedDriver: "d1", lastLocation: { lat: 5.8800, lng: 0.1700, label: "Somanya" }, speed: 70, heading: 45, fuelLevel: 80, odometer: 5600 },
  { id: "v22", registration: "GR-5548-23", make: "Scania", model: "S500", year: 2022, type: "Heavy Truck", status: "idle", healthScore: 76, assignedDriver: null, lastLocation: { lat: 4.9016, lng: -1.7831, label: "Takoradi" }, speed: 0, heading: 0, fuelLevel: 35, odometer: 178900 },
  { id: "v23", registration: "GR-8815-24", make: "DAF", model: "CF 450", year: 2023, type: "Heavy Truck", status: "moving", healthScore: 90, assignedDriver: "d2", lastLocation: { lat: 6.1300, lng: 1.2200, label: "Lomé Approach" }, speed: 50, heading: 90, fuelLevel: 62, odometer: 43200 },
  { id: "v24", registration: "GR-2209-22", make: "Mercedes-Benz", model: "Atego 1524", year: 2020, type: "Medium Truck", status: "offline", healthScore: 40, assignedDriver: null, lastLocation: { lat: 5.6037, lng: -0.1870, label: "Accra" }, speed: 0, heading: 0, fuelLevel: 8, odometer: 356700 },
  { id: "v25", registration: "GR-7741-24", make: "Volvo", model: "FMX 500", year: 2024, type: "Heavy Truck", status: "moving", healthScore: 94, assignedDriver: "d3", lastLocation: { lat: 6.4379, lng: 3.4151, label: "Lagos Ring Road" }, speed: 40, heading: 200, fuelLevel: 70, odometer: 11200 },
];

// ===== DRIVERS =====
export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseStatus: "valid" | "expiring" | "expired";
  behaviorScore: number;
  assignedVehicle: string | null;
  activeTrip: string | null;
  avatar: string;
  joinDate: string;
}

export const drivers: Driver[] = [
  { id: "d1", name: "Kwame Asante", phone: "+233 24 567 8901", licenseNumber: "GHA-DL-234891", licenseExpiry: "2027-03-15", licenseStatus: "valid", behaviorScore: 88, assignedVehicle: "v1", activeTrip: "t1", avatar: "KA", joinDate: "2021-06-10" },
  { id: "d2", name: "Kofi Mensah", phone: "+233 20 345 6789", licenseNumber: "GHA-DL-198234", licenseExpiry: "2026-08-22", licenseStatus: "valid", behaviorScore: 92, assignedVehicle: "v2", activeTrip: "t2", avatar: "KM", joinDate: "2020-01-15" },
  { id: "d3", name: "Ama Osei", phone: "+233 27 890 1234", licenseNumber: "GHA-DL-312456", licenseExpiry: "2026-04-10", licenseStatus: "expiring", behaviorScore: 75, assignedVehicle: "v3", activeTrip: null, avatar: "AO", joinDate: "2022-03-20" },
  { id: "d4", name: "Yaw Boateng", phone: "+233 55 123 4567", licenseNumber: "GHA-DL-445678", licenseExpiry: "2027-11-30", licenseStatus: "valid", behaviorScore: 81, assignedVehicle: "v5", activeTrip: "t3", avatar: "YB", joinDate: "2021-09-05" },
  { id: "d5", name: "Akosua Darko", phone: "+233 24 678 9012", licenseNumber: "GHA-DL-567890", licenseExpiry: "2026-06-18", licenseStatus: "valid", behaviorScore: 94, assignedVehicle: "v6", activeTrip: "t4", avatar: "AD", joinDate: "2019-11-22" },
  { id: "d6", name: "Emmanuel Tetteh", phone: "+233 20 789 0123", licenseNumber: "GHA-DL-678901", licenseExpiry: "2026-03-05", licenseStatus: "expiring", behaviorScore: 67, assignedVehicle: "v7", activeTrip: null, avatar: "ET", joinDate: "2023-01-10" },
  { id: "d7", name: "Abena Frimpong", phone: "+233 27 234 5678", licenseNumber: "GHA-DL-789012", licenseExpiry: "2028-01-20", licenseStatus: "valid", behaviorScore: 85, assignedVehicle: "v9", activeTrip: "t5", avatar: "AF", joinDate: "2022-07-14" },
  { id: "d8", name: "Nana Agyemang", phone: "+233 55 345 6789", licenseNumber: "GHA-DL-890123", licenseExpiry: "2025-12-31", licenseStatus: "expired", behaviorScore: 72, assignedVehicle: "v10", activeTrip: null, avatar: "NA", joinDate: "2020-05-30" },
  { id: "d9", name: "Issah Mohammed", phone: "+233 24 456 7890", licenseNumber: "GHA-DL-901234", licenseExpiry: "2027-09-12", licenseStatus: "valid", behaviorScore: 90, assignedVehicle: "v11", activeTrip: "t6", avatar: "IM", joinDate: "2021-02-18" },
  { id: "d10", name: "Gifty Amoah", phone: "+233 20 567 8901", licenseNumber: "GHA-DL-012345", licenseExpiry: "2026-07-25", licenseStatus: "valid", behaviorScore: 78, assignedVehicle: "v12", activeTrip: null, avatar: "GA", joinDate: "2022-11-05" },
  { id: "d11", name: "Samuel Owusu", phone: "+233 27 678 9012", licenseNumber: "GHA-DL-123789", licenseExpiry: "2027-05-08", licenseStatus: "valid", behaviorScore: 86, assignedVehicle: "v13", activeTrip: "t7", avatar: "SO", joinDate: "2023-04-22" },
  { id: "d12", name: "Patience Adjei", phone: "+233 55 789 0123", licenseNumber: "GHA-DL-234890", licenseExpiry: "2026-10-15", licenseStatus: "valid", behaviorScore: 91, assignedVehicle: "v15", activeTrip: "t8", avatar: "PA", joinDate: "2020-08-17" },
  { id: "d13", name: "Francis Kumi", phone: "+233 24 890 1234", licenseNumber: "GHA-DL-345901", licenseExpiry: "2027-02-28", licenseStatus: "valid", behaviorScore: 83, assignedVehicle: "v17", activeTrip: "t9", avatar: "FK", joinDate: "2021-12-01" },
  { id: "d14", name: "Rashida Abdul", phone: "+233 20 901 2345", licenseNumber: "GHA-DL-456012", licenseExpiry: "2026-09-20", licenseStatus: "valid", behaviorScore: 69, assignedVehicle: "v18", activeTrip: null, avatar: "RA", joinDate: "2022-06-30" },
  { id: "d15", name: "Daniel Quaye", phone: "+233 27 012 3456", licenseNumber: "GHA-DL-567123", licenseExpiry: "2027-07-14", licenseStatus: "valid", behaviorScore: 87, assignedVehicle: "v19", activeTrip: "t10", avatar: "DQ", joinDate: "2023-02-14" },
];

// ===== TRIPS =====
export type TripStatus = "scheduled" | "in_progress" | "completed" | "delayed";

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  driverId: string;
  vehicleId: string;
  status: TripStatus;
  eta: string;
  progress: number;
  departedAt: string | null;
  arrivedAt: string | null;
  distance: number;
  cargo: string;
}

export const trips: Trip[] = [
  { id: "t1", origin: "Accra", destination: "Kumasi", driverId: "d1", vehicleId: "v1", status: "in_progress", eta: "14:30", progress: 62, departedAt: "2026-02-25T06:00:00", arrivedAt: null, distance: 252, cargo: "Electronics" },
  { id: "t2", origin: "Tema", destination: "Lomé", driverId: "d2", vehicleId: "v2", status: "in_progress", eta: "16:00", progress: 45, departedAt: "2026-02-25T08:30:00", arrivedAt: null, distance: 200, cargo: "Textiles" },
  { id: "t3", origin: "Accra", destination: "Lomé", driverId: "d4", vehicleId: "v5", status: "in_progress", eta: "13:45", progress: 78, departedAt: "2026-02-25T05:30:00", arrivedAt: null, distance: 185, cargo: "Pharmaceuticals" },
  { id: "t4", origin: "Lomé", destination: "Cotonou", driverId: "d5", vehicleId: "v6", status: "in_progress", eta: "12:00", progress: 88, departedAt: "2026-02-25T04:00:00", arrivedAt: null, distance: 155, cargo: "Building Materials" },
  { id: "t5", origin: "Kumasi", destination: "Sunyani", driverId: "d7", vehicleId: "v9", status: "in_progress", eta: "11:30", progress: 55, departedAt: "2026-02-25T07:00:00", arrivedAt: null, distance: 130, cargo: "Agricultural Products" },
  { id: "t6", origin: "Tema", destination: "Lagos", driverId: "d9", vehicleId: "v11", status: "in_progress", eta: "22:00", progress: 35, departedAt: "2026-02-25T06:00:00", arrivedAt: null, distance: 480, cargo: "Auto Parts" },
  { id: "t7", origin: "Tema Port", destination: "Accra Warehouse", driverId: "d11", vehicleId: "v13", status: "in_progress", eta: "10:30", progress: 90, departedAt: "2026-02-25T09:00:00", arrivedAt: null, distance: 28, cargo: "Container Cargo" },
  { id: "t8", origin: "Kumasi", destination: "Accra", driverId: "d12", vehicleId: "v15", status: "in_progress", eta: "15:00", progress: 40, departedAt: "2026-02-25T08:00:00", arrivedAt: null, distance: 252, cargo: "Cocoa Products" },
  { id: "t9", origin: "Accra", destination: "Lomé", driverId: "d13", vehicleId: "v17", status: "delayed", eta: "14:00", progress: 70, departedAt: "2026-02-25T05:00:00", arrivedAt: null, distance: 185, cargo: "Fuel Products" },
  { id: "t10", origin: "Tema", destination: "Kumasi", driverId: "d15", vehicleId: "v19", status: "in_progress", eta: "16:30", progress: 25, departedAt: "2026-02-25T09:30:00", arrivedAt: null, distance: 270, cargo: "FMCG" },
  { id: "t11", origin: "Accra", destination: "Cape Coast", driverId: "d1", vehicleId: "v1", status: "completed", eta: "—", progress: 100, departedAt: "2026-02-24T06:00:00", arrivedAt: "2026-02-24T09:30:00", distance: 145, cargo: "Cement" },
  { id: "t12", origin: "Cotonou", destination: "Lagos", driverId: "d5", vehicleId: "v6", status: "completed", eta: "—", progress: 100, departedAt: "2026-02-24T04:00:00", arrivedAt: "2026-02-24T08:00:00", distance: 115, cargo: "Rice" },
  { id: "t13", origin: "Kumasi", destination: "Tamale", driverId: "d7", vehicleId: "v9", status: "scheduled", eta: "—", progress: 0, departedAt: null, arrivedAt: null, distance: 380, cargo: "Steel" },
  { id: "t14", origin: "Accra", destination: "Takoradi", driverId: "d3", vehicleId: "v3", status: "scheduled", eta: "—", progress: 0, departedAt: null, arrivedAt: null, distance: 225, cargo: "Machinery" },
];

// ===== FUEL LOGS =====
export interface FuelLog {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  litres: number;
  cost: number;
  currency: string;
  station: string;
  location: string;
  country: string;
}

export const fuelLogs: FuelLog[] = [
  { id: "f1", date: "2026-02-25", vehicleId: "v1", driverId: "d1", litres: 120, cost: 1680, currency: "GHS", station: "Shell Achimota", location: "Accra", country: "Ghana" },
  { id: "f2", date: "2026-02-25", vehicleId: "v2", driverId: "d2", litres: 150, cost: 2100, currency: "GHS", station: "TotalEnergies Tema", location: "Tema", country: "Ghana" },
  { id: "f3", date: "2026-02-24", vehicleId: "v5", driverId: "d4", litres: 80, cost: 1120, currency: "GHS", station: "Goil Dansoman", location: "Accra", country: "Ghana" },
  { id: "f4", date: "2026-02-24", vehicleId: "v6", driverId: "d5", litres: 200, cost: 95000, currency: "XOF", station: "Total Lomé", location: "Lomé", country: "Togo" },
  { id: "f5", date: "2026-02-23", vehicleId: "v9", driverId: "d7", litres: 100, cost: 1400, currency: "GHS", station: "Shell Kumasi", location: "Kumasi", country: "Ghana" },
  { id: "f6", date: "2026-02-23", vehicleId: "v11", driverId: "d9", litres: 180, cost: 2520, currency: "GHS", station: "TotalEnergies Tema", location: "Tema", country: "Ghana" },
  { id: "f7", date: "2026-02-22", vehicleId: "v15", driverId: "d12", litres: 130, cost: 1820, currency: "GHS", station: "Goil Ejisu", location: "Kumasi", country: "Ghana" },
  { id: "f8", date: "2026-02-22", vehicleId: "v17", driverId: "d13", litres: 90, cost: 42750, currency: "XOF", station: "Oryx Aflao", location: "Aflao", country: "Ghana" },
  { id: "f9", date: "2026-02-21", vehicleId: "v19", driverId: "d15", litres: 110, cost: 1540, currency: "GHS", station: "Shell Dodowa", location: "Dodowa", country: "Ghana" },
  { id: "f10", date: "2026-02-21", vehicleId: "v6", driverId: "d5", litres: 160, cost: 76000, currency: "XOF", station: "Total Cotonou", location: "Cotonou", country: "Benin" },
];

// ===== AI AGENT PROPOSALS =====
export type AgentType = "fuel" | "maintenance" | "route" | "behavior" | "compliance";
export type ProposalUrgency = "critical" | "warning" | "info";
export type ProposalStatus = "pending" | "approved" | "rejected" | "deferred";

export interface AgentProposal {
  id: string;
  agentType: AgentType;
  agentName: string;
  confidence: number;
  urgency: ProposalUrgency;
  title: string;
  explanation: string;
  vehicleId?: string;
  driverId?: string;
  timestamp: string;
  status: ProposalStatus;
}

export const agentProposals: AgentProposal[] = [
  { id: "ap1", agentType: "fuel", agentName: "Fuel Anomaly Agent", confidence: 94, urgency: "critical", title: "Suspected fuel theft — GR-4456-22", explanation: "Vehicle GR-4456-22 consumed 42% more fuel than its baseline on the Lomé-Cotonou corridor yesterday. Deviation exceeds 3σ from historical average. Driver Akosua Darko has no prior anomaly flags. Recommend physical tank inspection and fuel log review.", vehicleId: "v6", driverId: "d5", timestamp: "2026-02-25T08:15:00", status: "pending" },
  { id: "ap2", agentType: "maintenance", agentName: "Predictive Maintenance Agent", confidence: 87, urgency: "warning", title: "Brake system attention — GR-3310-23", explanation: "Vehicle GR-3310-23 shows 78% probability of brake pad failure within the next 2,000 km based on wear pattern analysis and mileage since last replacement. Recommend scheduling brake inspection within 5 business days.", vehicleId: "v4", timestamp: "2026-02-25T07:30:00", status: "pending" },
  { id: "ap3", agentType: "route", agentName: "Route Intelligence Agent", confidence: 82, urgency: "info", title: "Faster route available — Trip T6", explanation: "Trip T6 (Tema→Lagos) can save approximately 45 minutes by routing through Aflao-Lomé-Cotonou instead of the current Ho-Kpalimé corridor. Border wait times at Aflao are currently averaging 25 minutes vs 90 minutes at Kodjoviakopé.", vehicleId: "v11", driverId: "d9", timestamp: "2026-02-25T09:00:00", status: "pending" },
  { id: "ap4", agentType: "behavior", agentName: "Driver Behavior Agent", confidence: 91, urgency: "warning", title: "Deteriorating driving pattern — Emmanuel Tetteh", explanation: "Emmanuel Tetteh's behavior score has dropped from 82 to 67 over the past 14 days. Key concerns: 8 harsh braking events (3x fleet average), 12 instances of exceeding 90 km/h in urban zones. Pattern correlates with shift change to night driving. Recommend coaching session and shift review.", driverId: "d6", timestamp: "2026-02-25T06:45:00", status: "pending" },
  { id: "ap5", agentType: "compliance", agentName: "Compliance Agent", confidence: 98, urgency: "critical", title: "License expiring — Nana Agyemang", explanation: "Driver Nana Agyemang's license GHA-DL-890123 expired on 31 Dec 2025. Driver is currently assigned to vehicle GR-9918-23. Recommend immediate reassignment and license renewal before next trip dispatch.", driverId: "d8", timestamp: "2026-02-25T05:00:00", status: "pending" },
  { id: "ap6", agentType: "maintenance", agentName: "Predictive Maintenance Agent", confidence: 76, urgency: "info", title: "Tyre replacement recommended — GR-6632-23", explanation: "Vehicle GR-6632-23 has covered 45,200 km since last tyre change. Based on tyre wear model for Scania R450 on West African roads, recommend replacement within the next 3,000 km to avoid blowout risk.", vehicleId: "v8", timestamp: "2026-02-25T07:00:00", status: "pending" },
  { id: "ap7", agentType: "fuel", agentName: "Fuel Anomaly Agent", confidence: 71, urgency: "info", title: "Fuel efficiency drop — GR-3389-22", explanation: "Vehicle GR-3389-22 fuel efficiency has decreased by 15% over the past 30 days. Likely caused by engine performance degradation at 298,700 km. Cross-referencing with maintenance agent for engine service recommendation.", vehicleId: "v12", timestamp: "2026-02-24T16:00:00", status: "pending" },
  { id: "ap8", agentType: "route", agentName: "Route Intelligence Agent", confidence: 89, urgency: "warning", title: "Delivery window at risk — Trip T9", explanation: "Trip T9 (Accra→Lomé) is currently 70% complete but running 2.5 hours behind schedule due to border delay at Aflao. Current ETA 14:00 exceeds delivery window of 13:00. Recommend notifying recipient and requesting window extension.", vehicleId: "v17", driverId: "d13", timestamp: "2026-02-25T09:30:00", status: "pending" },
];

// ===== ACTIVITY FEED =====
export interface ActivityEvent {
  id: string;
  type: "trip_completed" | "incident" | "geofence" | "fuel" | "maintenance" | "alert";
  message: string;
  timestamp: string;
  icon: string;
}

export const activityFeed: ActivityEvent[] = [
  { id: "e1", type: "trip_completed", message: "Trip T11 completed — Accra → Cape Coast delivered on time", timestamp: "2026-02-24T09:30:00", icon: "check-circle" },
  { id: "e2", type: "geofence", message: "GR-8891-24 entered Togo border zone", timestamp: "2026-02-25T09:15:00", icon: "map-pin" },
  { id: "e3", type: "fuel", message: "Fuel logged: 150L at TotalEnergies Tema for GR-1193-23", timestamp: "2026-02-25T08:45:00", icon: "fuel" },
  { id: "e4", type: "incident", message: "Tyre puncture reported by Gifty Amoah — GR-3389-22 at Nkawkaw", timestamp: "2026-02-25T08:20:00", icon: "alert-triangle" },
  { id: "e5", type: "maintenance", message: "Service overdue: GR-6632-23 — 5,200 km past scheduled oil change", timestamp: "2026-02-25T07:00:00", icon: "wrench" },
  { id: "e6", type: "alert", message: "Nana Agyemang operating with expired license — immediate action required", timestamp: "2026-02-25T05:00:00", icon: "shield-alert" },
  { id: "e7", type: "trip_completed", message: "Trip T12 completed — Cotonou → Lagos delivered on time", timestamp: "2026-02-24T08:00:00", icon: "check-circle" },
  { id: "e8", type: "geofence", message: "GR-4456-22 exited Cotonou delivery zone", timestamp: "2026-02-25T06:30:00", icon: "map-pin" },
];

// ===== CHART DATA =====
export const fuelConsumptionTrend = [
  { day: "Mon", litres: 820, cost: 11480 },
  { day: "Tue", litres: 945, cost: 13230 },
  { day: "Wed", litres: 780, cost: 10920 },
  { day: "Thu", litres: 1100, cost: 15400 },
  { day: "Fri", litres: 960, cost: 13440 },
  { day: "Sat", litres: 650, cost: 9100 },
  { day: "Sun", litres: 420, cost: 5880 },
];

export const tripCompletionData = [
  { day: "Mon", completed: 8, delayed: 1, cancelled: 0 },
  { day: "Tue", completed: 12, delayed: 2, cancelled: 1 },
  { day: "Wed", completed: 10, delayed: 0, cancelled: 0 },
  { day: "Thu", completed: 14, delayed: 3, cancelled: 0 },
  { day: "Fri", completed: 11, delayed: 1, cancelled: 1 },
  { day: "Sat", completed: 6, delayed: 0, cancelled: 0 },
  { day: "Sun", completed: 3, delayed: 0, cancelled: 0 },
];

export const driverScoreDistribution = [
  { range: "60-69", count: 2 },
  { range: "70-79", count: 4 },
  { range: "80-89", count: 5 },
  { range: "90-100", count: 4 },
];

// ===== ALERTS =====
export type AlertUrgency = "critical" | "warning" | "info";
export type AlertCategory = "geofence" | "fuel" | "maintenance" | "document" | "hours" | "incident";

export interface Alert {
  id: string;
  urgency: AlertUrgency;
  category: AlertCategory;
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  relatedId?: string;
}

export const alerts: Alert[] = [
  { id: "a1", urgency: "critical", category: "document", title: "Expired Driver License", message: "Nana Agyemang's license expired on 31 Dec 2025", timestamp: "2026-02-25T05:00:00", acknowledged: false, relatedId: "d8" },
  { id: "a2", urgency: "critical", category: "fuel", title: "Fuel Anomaly Detected", message: "42% overconsumption on GR-4456-22", timestamp: "2026-02-25T08:15:00", acknowledged: false, relatedId: "v6" },
  { id: "a3", urgency: "warning", category: "maintenance", title: "Service Overdue", message: "GR-6632-23 is 5,200 km past scheduled service", timestamp: "2026-02-25T07:00:00", acknowledged: false, relatedId: "v8" },
  { id: "a4", urgency: "warning", category: "hours", title: "Driving Hours Approaching Limit", message: "Kwame Asante has driven 9.5 hours today", timestamp: "2026-02-25T09:30:00", acknowledged: false, relatedId: "d1" },
  { id: "a5", urgency: "info", category: "geofence", title: "Border Zone Entry", message: "GR-8891-24 entered Togo border zone", timestamp: "2026-02-25T09:15:00", acknowledged: true, relatedId: "v5" },
  { id: "a6", urgency: "warning", category: "incident", title: "Tyre Puncture Reported", message: "Gifty Amoah reported puncture at Nkawkaw", timestamp: "2026-02-25T08:20:00", acknowledged: false, relatedId: "v12" },
  { id: "a7", urgency: "info", category: "maintenance", title: "Tyre Replacement Recommended", message: "GR-6632-23 at 45,200 km since last tyre change", timestamp: "2026-02-25T07:00:00", acknowledged: true, relatedId: "v8" },
  { id: "a8", urgency: "critical", category: "maintenance", title: "Low Health Score", message: "GR-4401-23 health score dropped to 25/100", timestamp: "2026-02-25T06:00:00", acknowledged: false, relatedId: "v16" },
];

// ===== MAINTENANCE =====
export interface MaintenanceItem {
  id: string;
  vehicleId: string;
  type: string;
  status: "scheduled" | "overdue" | "completed";
  dueDate: string;
  completedDate?: string;
  cost?: number;
  workshop?: string;
  notes?: string;
}

export const maintenanceItems: MaintenanceItem[] = [
  { id: "m1", vehicleId: "v4", type: "Brake Inspection", status: "overdue", dueDate: "2026-02-20", notes: "Predicted 78% failure probability" },
  { id: "m2", vehicleId: "v8", type: "Oil Change", status: "overdue", dueDate: "2026-02-15", notes: "5,200 km past due" },
  { id: "m3", vehicleId: "v8", type: "Tyre Replacement", status: "scheduled", dueDate: "2026-03-01", notes: "45,200 km since last change" },
  { id: "m4", vehicleId: "v12", type: "Engine Service", status: "scheduled", dueDate: "2026-03-05", notes: "298,700 km — major service" },
  { id: "m5", vehicleId: "v16", type: "Full Overhaul", status: "scheduled", dueDate: "2026-03-10", cost: 15000, workshop: "Accra Central Workshop" },
  { id: "m6", vehicleId: "v1", type: "Oil Change", status: "completed", dueDate: "2026-02-10", completedDate: "2026-02-10", cost: 450, workshop: "Shell Quick Service Accra" },
  { id: "m7", vehicleId: "v2", type: "Tyre Rotation", status: "completed", dueDate: "2026-02-08", completedDate: "2026-02-09", cost: 200, workshop: "Tema Auto Centre" },
  { id: "m8", vehicleId: "v24", type: "Transmission Repair", status: "overdue", dueDate: "2026-02-18", notes: "Health score 40 — critical" },
];

// ===== HELPER FUNCTIONS =====
export function getDriverById(id: string) { return drivers.find(d => d.id === id); }
export function getVehicleById(id: string) { return vehicles.find(v => v.id === id); }
export function getTripById(id: string) { return trips.find(t => t.id === id); }

export function getFleetStats() {
  const active = vehicles.filter(v => v.status === "moving").length;
  const idle = vehicles.filter(v => v.status === "idle").length;
  const stopped = vehicles.filter(v => v.status === "stopped").length;
  const offline = vehicles.filter(v => v.status === "offline").length;
  const activeTrips = trips.filter(t => t.status === "in_progress").length;
  const avgHealthScore = Math.round(vehicles.reduce((acc, v) => acc + v.healthScore, 0) / vehicles.length);
  const pendingAlerts = alerts.filter(a => !a.acknowledged).length;
  const totalFuelCostGHS = fuelLogs.filter(f => f.currency === "GHS").reduce((acc, f) => acc + f.cost, 0);

  return { total: vehicles.length, active, idle, stopped, offline, activeTrips, avgHealthScore, pendingAlerts, totalFuelCostGHS };
}
