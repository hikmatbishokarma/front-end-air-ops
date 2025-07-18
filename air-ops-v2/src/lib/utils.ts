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
  ALL = "all",
  CASUAL_LEAVE = "Casual Leave",
  SICK_LEAVE = "Sick Leave",
  PRIVILEGE_LEAVE = "Privilege Leave",
  PATERNITY_LEAVE = "Paternity Leave",
  MARRIAGE_LEAVE = "Marriage Leave",
  BEREAVEMENT_LEAVE = "Bereavement Leave",
}

export enum LeaveStatus {
  ALL = "all",
  PENDING = "Pending",
  APPROVED = "Approved",
  DECLINED = "Declined",
  CANCELLED = "Cancelled",
}
