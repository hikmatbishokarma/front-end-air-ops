import { FileObject } from "@/shared/types/common";
import { SectorLocation } from "@/shared/types/location";

export interface Sector {
  sectorNo?: number;
  source: SectorLocation;
  destination: SectorLocation;
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
  tripId: string;
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
  fuelReceipt?: FileObject | null; // file url
  handledBy: string;
  designation: string;
}

export interface DocumentInfo {
  type: string; // e.g. "Flight Plan"
  fileUrl?: FileObject | null | undefined; // uploaded report
  externalLink?: string; // optional online link
}

export interface CrewAssignmentDetails {
  crewId: string;
  weight: string;
  baggage: string;
}

export interface AssignedCrewInfo {
  designation: string;
  crews: string[];
  crewAssignmentDetails?: CrewAssignmentDetails[];
}

export interface BaReport {
  name: string;
  reading: string;
  conductedDate: moment.Moment | null;
  record: FileObject | null;
  video: FileObject | null;
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
