// export enum QuotationStatus {
//   NEW_REQUEST = "new request",
//   QUOTED = "quoted",
//   CANCELLED = "cancelled",
//   CONFIRMED = "confirmed",
//   OPTION = "option",
//   BOOKED = "booked",
//   CONTRACT_SENT = "contract sent",
//   INVOICE_SENT = "invoice sent",
//   BRIEFING_SENT = "briefing sent",
//   DONE = "done",
//   UPGRADED = "upgraded",
// }

export enum QuotationStatus {
  QUOTE = "Quote",
  PROFOMA_INVOICE = "Proforma Invoice",
  TAX_INVOICE = "Tax Invoice",
  CANCELLED = "Cancelled",
  SALE_CONFIRMED = "Sale Confirmed",
}

export const removeTypename = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (typeof obj === "object" && obj !== null) {
    const { __typename, ...cleanedObj } = obj; // Remove __typename
    return Object.keys(cleanedObj).reduce((acc, key) => {
      acc[key] = removeTypename(cleanedObj[key]); // Recursively clean nested objects
      return acc;
    }, {} as any);
  }
  return obj;
};

export const getEnumKeyByValue = (obj, value) => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

export enum SalesDocumentType {
  QUOTATION = "quotation",
  PROFORMA_INVOICE = "Proforma Invoice",
  TAX_INVOICE = "Tax Invoice",
  SALE_CONFIRMATION = "Sale Confirmation",
}

export enum InvoiceType {
  PROFORMA_INVOICE = "Proforma Invoice",
  TAX_INVOICE = "Tax Invoice",
}

export const SalesCategoryLabels = {
  QUOTES: "Quotes",
  INVOICES: "Invoices",
  SALE_CONFIRMATION: "Sale Confirmation",
  REPORTS: "Reports",
} as const;

export enum LeaveType {
  CASUAL_LEAVE = "Casual Leave",
  SICK_LEAVE = "Sick Leave",
  PRIVILEGE_LEAVE = "Privilege Leave",
  PATERNITY_LEAVE = "Paternity Leave",
  MARRIAGE_LEAVE = "Marriage Leave",
  BEREAVEMENT_LEAVE = "Bereavement Leave",
}

export enum LeaveStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  DECLINED = "Declined",
  CANCELLED = "Cancelled",
}

export const DEPARTMENT_TYPES = [
  { label: "Sales", value: "SALES" },
  { label: "Ops", value: "OPS" },
  { label: "Camo", value: "CAMO" },
  { label: "Engineering", value: "ENGINEERING" },
  { label: "Security", value: "SECURITY" },
  { label: "Accounts", value: "ACCOUNTS" },
  { label: "HR", value: "HR" },
  { label: "Admin", value: "ADMIN" },
  { label: "Audit", value: "AUDIT" },
  { label: "Training", value: "TRAINING" },
  { label: "Others", value: "OTHERS" },
];

export const SECURITY_TYPES = [
  {
    "label": "All",
    "value": "All",
  },
  {
    "label": "Approvals",
    "value": "APPROVALS",
  },
  {
    "label": "Organization",
    "value": "ORGANIZATION",
  },
  {
    "label": "Meetings",
    "value": "MEETINGS",
  },
  {
    "label": "Audit",
    "value": "AUDIT",
  },
  {
    "label": "File Records",
    "value": "FILE_RECORDS",
  },
  {
    "label": "Library",
    "value": "LIBRARY",
  },
  {
    "label": "Staff",
    "value": "STAFF",
  },
  {
    "label": "Security Training",
    "value": "SECURITY_TRAINING",
  },
  {
    "label": "Registers",
    "value": "REGISTERS",
  },
  {
    "label": "Aircraft Documents",
    "value": "AIRCRAFT_DOCUMENTS",
  },
  {
    "label": "Manuals",
    "value": "MANUALS",
  },
  {
    "label": "Agreements",
    "value": "AGREEMENTS",
  },
];
