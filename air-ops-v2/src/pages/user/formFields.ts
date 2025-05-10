export const userFormFields = [
  { name: "name", label: "Name", xs: 6, required: true },
  {
    name: "email",
    label: "Email",
    xs: 6,
    required: true,
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    },
  },
  {
    name: "phone",
    label: "Phone",
    xs: 6,
    required: true,
    pattern: {
      value: /^[0-9]{10}$/, // Simple 10-digit number validation
      message: "Phone number must be 10 digits",
    },
  },
  { name: "address", label: "Address" },
  { name: "roles", label: "Roles", type: "select", options: [] },
];
