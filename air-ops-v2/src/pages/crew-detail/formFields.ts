export const crewDetailFormFields = [
  { name: "firstName", label: "First Name", required: true },
  { name: "middleName", label: "Middle Name" },
  { name: "lastName", label: "Last Name", required: true },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["MALE", "FEMALE", "OTHER"],
    required: true,
  },
  { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
  { name: "bloodGroup", label: "Blood Group", required: true },
  { name: "designation", label: "Designation", required: true },
  { name: "education", label: "Education", required: true },
  { name: "experience", label: "Experience", required: true },
  {
    name: "mobileNumber",
    label: "Mobile Number",
    required: true,
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Phone number must be 10 digits",
    },
  },
  { name: "alternateContact", label: "Alternate Contact" },
  {
    name: "email",
    label: "Email",
    required: true,
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    },
  },
  { name: "aadharCard", label: "Aadhar Card" },
  { name: "pan", label: "PAN" },
  { name: "passportNo", label: "Passport No" },
  { name: "pinCode", label: "PIN Code" },
  { name: "temporaryAddress", label: "Temporary Address" },
  { name: "permanentAddress", label: "Permanent Address" },

  // Security
  { name: "userName", label: "Username", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "repeatPassword",
    label: "Repeat Password",
    type: "password",
    required: true,
  },
  {
    name: "enableTwoFactorAuth",
    label: "Enable Two-Factor Auth",
    type: "switch",
  },
];

export const certificationFormFields = [
  { name: "certification", label: "Certification", required: true },
  { name: "validTill", label: "Valid Till", type: "date", required: true },
  { name: "uploadCertificate", label: "Upload Certificate", type: "file" },
];

export const nomineeFormFields = [
  { name: "fullName", label: "Full Name", required: true },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["MALE", "FEMALE", "OTHER"],
    required: true,
  },
  { name: "relation", label: "Relation", required: true },
  { name: "idProof", label: "ID Proof", required: true },
  { name: "mobileNumber", label: "Mobile Number", required: true },
  { name: "alternateContact", label: "Alternate Contact" },
];

export const crewProfileFormFields = [
  { name: "profile", label: "Profile", required: false, type: "file" },
  { name: "location", label: "Location ", required: false },
  { name: "about", label: "About", required: false },
];
