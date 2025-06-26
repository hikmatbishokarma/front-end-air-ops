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
  CONFIRMED = "Confirmed",
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
  TRIP_CONFIRMATION = "trip confirmation",
}

export enum InvoiceType {
  PROFORMA_INVOICE = "Proforma Invoice",
  TAX_INVOICE = "Tax Invoice",
}
