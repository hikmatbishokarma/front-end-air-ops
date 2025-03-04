export enum QuoteStatus {
  NEW_REQUEST = "new request",
  QUOTED = "quoted",
  OPPORTUNITY = "opportunity",
  APPROVAL = "approval",
  OPTION = "option",
  BOOKED = "booked",
  CONTRACT_SENT = "contract sent",
  INVOICE_SENT = "invoice sent",
  BRIEFING_SENT = "briefing sent",
  DONE = "done",
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
