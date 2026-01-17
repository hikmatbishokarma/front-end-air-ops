// /types/sector.ts
export type Designation =
  | "PILOT"
  | "CABIN_CREW"
  | "ENGINEER"
  | "SECURITY_MANAGER"
  | "OPERATIONS_MANAGER"
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

export interface AirportInfo {
  code: string;
  name: string;
  country: string;
}

export interface AircraftInfo {
  name: string;
  code: string;
  specifications?: any;
}

export interface Sector {
  _id: string;
  sectorNo: number;
  source: string | AirportInfo; // "HYD" or { code, name, country }
  destination: string | AirportInfo; // "BLR" or { code, name, country }
  depatureDate: string; // iso
  depatureTime: string; // "10:00"
  arrivalDate: string; // iso
  arrivalTime: string; // "10:10"
  pax?: number;
  flightTime: string; // "0h 10m"
  assignedCrews: AssignedCrew[];
  documents: SectorDocument[];
  fuelRecord?: FuelRecord;
  // Additional fields from API
  tripId?: string;
  aircraft?: AircraftInfo;
  quotationNo?: string;
  crewDetails?: Record<
    string,
    {
      id: string;
      name: string;
      email: string;
      phone?: string;
      profile?: string;
      designation: string;
    }
  >;
  crewUploadedDocs?: Array<{
    type: string;
    name: string;
    url: string;
    crewDetails: {
      id: string;
      fullName: string;
      email: string;
      profile?: string;
      phone?: string;
      designation: string;
    };
  }>;
}

export interface TripRecordFromBackend {
  _id: string;
  tripId: string;
  quotationNo: string;
  sectors: Sector[];
}
