export interface Nominee {
  fullName: string;
  gender: string;
  relation: string;
  idProof: string;
  mobileNumber: string;
  alternateContact: string;
}

export interface Certification {
  certification: string;
  validTill: string;
  uploadCertificate?: string;
}

export interface CrewDetailFormValues {
  profile: string;
  location: string;
  type: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  designation: string;
  education: string;
  experience: string;
  mobileNumber: string;
  alternateContact: string;
  email: string;
  nationality: string;
  religion: string;
  anniversaryDate: string;
  martialStatus: string;
  aadhar: string;
  pan: string;
  passportNo: string;
  pinCode: string;
  temporaryAddress: string;
  permanentAddress: string;
  certifications: Certification[];
  nominees: Nominee[];
  userName: string;
  password: string;
  repeatPassword: string;
  enableTwoFactorAuth: boolean;
}
