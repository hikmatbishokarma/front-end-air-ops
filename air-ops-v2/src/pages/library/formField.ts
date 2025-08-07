import { DEPARTMENT_TYPES } from "../../lib/utils";

export const libraryFormFields = [
  { name: "name", label: "Name", required: true },
  {
    name: "department",
    label: "Department ",
    required: true,
    options: DEPARTMENT_TYPES,
  },
  { name: "attachment", label: "Upload", required: true, type: "upload" },
];
