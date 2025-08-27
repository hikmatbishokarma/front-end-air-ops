export interface Itinerary {
  sectorNo?: number;
  source: string;
  destination: string;
  depatureDate: string;
  depatureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  paxNumber: number;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  requestedBy: { id: string; name: string };
  itinerary: Itinerary[];
  aircraft?: { id: string; name: string; code: string };
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

export interface SectorFormValues {
  depatureDate: string;
  depatureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  // crews: Record<CrewDesignation, CrewMember[]>;
  assignedCrews: AssignedCrewInfo[];
  fuelRecord: FuelRecordInfo; // adjust with Fuel type
  documents: DocumentInfo[];
}
