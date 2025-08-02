export const securityFormFields = [
  {
    name: "type",
    label: "Type",
    options: [
      { key: "APPROVALS", value: "Approvals" },
      { key: "ORGANIZATION", value: "Organization" },
      { key: "MEETINGS", value: "Meetings" },
      { key: "AUDIT", value: "Audit" },
      { key: "FILE_RECORDS", value: "File Records" },
      { key: "LIBRARY", value: "Library" },
      { key: "STAFF", value: "Staff" },
      { key: "SECURITY_TRAINING", value: "Security Training" },
      { key: "REGISTERS", value: "Registers" },
      { key: "AIRCRAFT_DOCUMENTS", value: "Aircraft Documents" },
      { key: "MANUALS", value: "Manuals" },
      { key: "AGREEMENTS", value: "Agreements" },
    ],
    required: true,
  },
  { name: "name", label: "Name", required: true },
  { name: "department", label: "Department ", required: true },
  { name: "attachment", label: "Upload", required: true, type: "upload" },
];
