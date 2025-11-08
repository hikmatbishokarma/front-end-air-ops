// /types/sector.ts
export type Designation =
  | "PILOT"
  | "CABIN_CREW"
  | "ENGINEER"
  | "SECURITY"
  | "OPERATIONS"
  | "CAMO";

export interface SectorDocument {
  type: string;
  externalLink?: string;
}

export interface AssignedCrew {
  designation: Designation;
  crews: string[]; // userIds like "c1"
}

export interface FuelRecord {
  fuelStation?: string;
  uploadedDate?: string; // iso
  fuelOnArrival?: string;
  fuelGauge?: string;
}

export interface Sector {
  _id: string;
  sectorNo: number;
  source: string; // "HYD"
  destination: string; // "BLR"
  depatureDate: string; // iso
  depatureTime: string; // "10:00"
  arrivalDate: string; // iso
  arrivalTime: string; // "10:10"
  pax?: number;
  flightTime: string; // "0h 10m"
  assignedCrews: AssignedCrew[];
  documents: SectorDocument[];
  fuelRecord?: FuelRecord;
}

export interface TripRecordFromBackend {
  _id: string;
  tripId: string;
  quotationNo: string;
  sectors: Sector[];
}
