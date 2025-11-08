import { DEPARTMENT_TYPES } from "@/shared/utils";

export const securityFormFields = [
  {
    name: "type",
    label: "Type",
    options: [
      { value: "APPROVALS", label: "Approvals" },
      { value: "ORGANIZATION", label: "Organization" },
      { value: "MEETINGS", label: "Meetings" },
      { value: "AUDIT", label: "Audit" },
      { value: "FILE_RECORDS", label: "File Records" },
      { value: "LIBRARY", label: "Library" },
      { value: "STAFF", label: "Staff" },
      { value: "SECURITY_TRAINING", label: "Security Training" },
      { value: "REGISTERS", label: "Registers" },
      { value: "AIRCRAFT_DOCUMENTS", label: "Aircraft Documents" },
      { value: "MANUALS", label: "Manuals" },
      { value: "AGREEMENTS", label: "Agreements" },
    ],
    required: true,
  },
  { name: "name", label: "Name", required: true },
  {
    name: "department",
    label: "Department ",
    required: true,
    options: DEPARTMENT_TYPES,
  },
  { name: "attachment", label: "Upload", required: true, type: "upload" },
];
