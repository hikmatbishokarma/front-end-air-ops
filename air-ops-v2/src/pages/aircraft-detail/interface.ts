import { FileObject } from "../../interfaces/common.interface";

export interface sepcification {
  title: string;
  value: string;
}

// Data structure for React Hook Form state
export interface AircraftDetailFormData {
  name: string;
  code: string;

  noteText: string;
  warningText: string;
  // category: any;
  specifications: sepcification[];
  termsAndConditions: string;
  isActive: boolean;

  // These fields are FileObject | null in the RHF state
  warningImage: FileObject | null;
  flightImage: FileObject | null;
  seatLayoutImage: FileObject | null;
  rangeMapImage: FileObject | null;

  // This field is an array of FileObject[] in the RHF state
  flightInteriorImages: FileObject[];
}

// Data structure for the DB/GQL response (read-only)
export interface AircraftDetailDB {
  id: string; // Assuming update requires ID
  name: string;
  code: string;
  noteText: string;
  termsAndConditions: string;
  isActive: boolean;
  specifications: sepcification[];

  warningImage: string | null;
  flightImage: string | null;
  seatLayoutImage: string | null;
  rangeMapImage: string | null;
  flightInteriorImages: string[] | null;
}
