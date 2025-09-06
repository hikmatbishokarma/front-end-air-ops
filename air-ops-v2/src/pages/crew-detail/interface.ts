export interface Nominee {
  fullName: string;
  gender: string;
  relation: string;
  idProof: string;
  mobileNumber: string;
  alternateContact: string;
  address: string;
  insurance: string;
}

export interface Certification {
  name: string;
  licenceNo: string;
  dateOfIssue: string;
  issuedBy: string;
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
  profile: string;
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
