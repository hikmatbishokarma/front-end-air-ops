export interface Sector {
  sectorNo?: number;
  source: string;
  destination: string;
  depatureDate: string;
  depatureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  pax: number;
  flightTime: string;
  assignedCrews: AssignedCrewInfo[];
  fuelRecord: FuelRecordInfo; // adjust with Fuel type
  documents: DocumentInfo[];
  baInfo: BaInfo;
}

export interface Aircraft {
  id: string;
  name: string;
  code: string;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  aircraft?: Aircraft;
}

export interface Trip {
  id: string;
  quotationNo: string;
  quotation: Quotation;
  sectors: Sector[];
  status: string;
}

export interface CrewMember {
  id: string;
  name: string;
  phone?: string;
  designation: string;
}

export interface FuelRecordInfo {
  fuelStation: string;
  uploadedDate: string; // ISO date
  fuelOnArrival: string;
  fuelLoaded: string;
  fuelGauge: string;
  fuelReceipt?: string; // file url
  handledBy: string;
  designation: string;
}

export interface DocumentInfo {
  type: string; // e.g. "Flight Plan"
  fileUrl?: string; // uploaded report
  externalLink?: string; // optional online link
}

export interface AssignedCrewInfo {
  designation: string;
  crews: string[];
}

export interface BaReport {
  name: string;
  reading: string;
  conductedDate: string;
  record: string;
  video: string;
}

export interface BaPerson {
  name: string;
  gender: string;
  age: string;
  certNo: string;
}

export interface BaInfo {
  baMachine: string;
  baPersons: BaPerson[];
  baReports: BaReport[];
}

export interface SectorFormValues {
  depatureDate: string;
  depatureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  // crews: Record<CrewDesignation, CrewMember[]>;
  assignedCrews: AssignedCrewInfo[];
  fuelRecord: FuelRecordInfo; // adjust with Fuel type
  documents: DocumentInfo[];
  baInfo: BaInfo;
}
