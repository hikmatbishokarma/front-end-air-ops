import { FileObject } from "../../interfaces/common.interface";

export interface Nominee {
  fullName: string;
  gender: string;
  relation: string;
  idProof: FileObject | null;
  mobileNumber: string;
  alternateContact: string;
  address: string;
  insurance: FileObject | null;
}

export interface Certification {
  name: string;
  licenceNo: string;
  dateOfIssue: string;
  issuedBy: FileObject | null;
  validTill: string;
}

export interface BankDetail {
  accountPayee: string;
  bankName: string;
  accountNumber: string;
  branch: string;
  swiftCode: string;
  ifscCode: string;
  isDefault: boolean;
}

export interface CrewDetailFormValues {
  roles: any;
  profile: FileObject | null;
  location: string;
  designation: string;

  fullName: string;
  displayName: string;
  gender: string;
  dateOfBirth: string;

  phone: string;
  alternateContact: string;

  email: string;
  education: string;
  experience: string;

  martialStatus: string;
  anniversaryDate: string;

  nationality: string;
  religion: string;

  aadhar: string;
  pan: string;
  gst: string;
  passportNo: string;

  currentAddress: string;
  permanentAddress: string;
  certifications: Certification[];
  nominees: Nominee[];

  bloodGroup: string;
  crewId?: string;

  bankDetails: BankDetail[];
}

export interface CrewDetailEditProps {
  id: string | number; // Use the actual type of your ID (string is common for UUIDs, number for integers)

  /** Function to call to close the edit modal or form. */
  onClose: () => void;

  /** Function to call to refresh the list/table data after a successful save/update. */
  refreshList: () => void;
}

export interface CrewDetailCreateProps {
  /** Function to call to close the edit modal or form. */
  onClose: () => void;

  /** Function to call to refresh the list/table data after a successful save/update. */
  refreshList: () => void;
}
