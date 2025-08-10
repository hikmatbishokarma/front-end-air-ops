import { Pattern } from "@mui/icons-material";

export const crewDetailFormFields = [
  // { name: "firstName", label: "First Name", required: true },
  // { name: "middleName", label: "Middle Name" },
  // { name: "lastName", label: "Last Name", required: true },
  { name: "fullName", label: "Full Name", required: true },
  { name: "displayName", label: "Display Name", required: true },

  { name: "crewId", label: "Crew ID", required: true },

  {
    name: "gender",
    label: "Gender",
    type: "select",
    optionsKey: "gender",

    required: true,
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",

    required: true,
  },
  {
    name: "phone",
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
    xs: 12,
  },
  { name: "education", label: "Education", required: true },
  { name: "experience", label: "Experience", required: true },

  {
    name: "martialStatus",
    label: "Marital Status",
    type: "select",
    optionsKey: "maritalStatus",
    required: false,
  },
  {
    name: "anniversaryDate",
    label: "Anniversary Date",
    type: "date",
    required: false,
  },

  {
    name: "religion",
    label: "Religion",
    type: "select",
    required: false,
    optionsKey: "religion",
  },

  {
    name: "nationality",
    label: "Nationality",
    type: "select",
    required: false,
    optionsKey: "country",
  },

  {
    name: "aadhar",
    label: "Aadhar",
    pattern: {
      value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      message: "Invalid GST No",
    },
  },
  {
    name: "pan",
    label: "PAN",
    pattern: {
      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      message: "Invalid PAN No",
    },
  },

  {
    name: "passportNo",
    label: "Passport No",
    pattern: {
      value: /^[A-PR-WYa-pr-wy][0-9]{7}$/,
      message: "Invalid passport number",
    },
    xs: 12,
  },

  { name: "currentAddress", label: "Current Address", xs: 12, required: true },
  {
    name: "permanentAddress",
    label: "Permanent Address",
    xs: 12,
    required: true,
  },

  { name: "bloodGroup", label: "Blood Group", required: false },
  // { name: "designation", label: "Designation", required: true },

  // { name: "pinCode", label: "PIN Code" },

  // Security
  // { name: "userName", label: "Username", required: false },
  // { name: "password", label: "Password", type: "password", required: false },
  // {
  //   name: "repeatPassword",
  //   label: "Repeat Password",
  //   type: "password",
  //   required: false,
  // },
  // {
  //   name: "enableTwoFactorAuth",
  //   label: "Enable Two-Factor Auth",
  //   type: "switch",
  // },
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
