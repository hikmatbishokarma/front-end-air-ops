export const operatorFormFields = [
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
  { name: "companyName", label: "Company Name", xs: 6, required: true },
  { name: "address", label: "Address", required: true },
  { name: "city", label: "City", options: [] },
  { name: "state", label: "State" },
  {
    name: "pinCode",
    label: "Pin Code",
    xs: 6,
    pattern: {
      value: /^[0-9]{6}$/, // Simple 10-digit number validation
      message: "Zip Code must be 6 digits",
    },
  },
  {
    name: "supportEmail",
    label: "Support Email",
    xs: 6,
    required: true,
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    },
  },
  { name: "websiteUrl", label: "Website Url", xs: 6 },
  {
    name: "companyLogo",
    label: "Company Logo",
    xs: 6,
    required: true,
    type: "file",
  },
];
