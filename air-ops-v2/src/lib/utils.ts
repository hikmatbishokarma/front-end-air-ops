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

import moment from "moment";

export enum QuotationStatus {
  QUOTE = "Quote",
  PROFOMA_INVOICE = "Proforma Invoice",
  TAX_INVOICE = "Tax Invoice",
  CANCELLED = "Cancelled",
  SALE_CONFIRMED = "Sale Confirmed",
  PAX_ADDED = "Pax Added",
  TRIP_GENERATED = "Trip Generated",
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

export enum ClientType {
  COMPANY = "COMPANY",
  PERSON = "PERSON",
  OTHER = "OTHER",
}

export const logoColors = { primary: "#0A58CA", accent: "#E11D48" }; // blue & red

export const calculateFlightTime = (depDate, depTime, arrDate, arrTime) => {
  const depDateTime = moment(
    `${depDate ?? ""} ${depTime ?? ""}`,
    "YYYY-MM-DD HH:mm"
  );
  const arrDateTime = moment(
    `${arrDate ?? ""} ${arrTime ?? ""}`,
    "YYYY-MM-DD HH:mm"
  );

  if (depDateTime.isValid() && arrDateTime.isValid()) {
    const totalMinutes = arrDateTime.diff(depDateTime, "minutes");
    if (totalMinutes >= 0) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }

  return "";
};

export const parseUnitToDecimal = (unitString: string): number => {
  if (!unitString) return 0;

  if (unitString.includes(":")) {
    const [hoursStr, minutesStr] = unitString.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours + minutes / 60;
  } else {
    const hours = Number(unitString);
    return isNaN(hours) ? 0 : hours;
  }
};

export const validateArrivalTime =
  (getValues: any, index: number) => (arrivalTime: string) => {
    const depDate = getValues(`sectors.${index}.depatureDate`);
    const depTime = getValues(`sectors.${index}.depatureTime`);
    const arrDate = getValues(`sectors.${index}.arrivalDate`);

    if (!depDate || !depTime || !arrDate || !arrivalTime) return true;

    // Parse all times as moment objects using consistent format
    const depDateTime = moment(
      `${moment(depDate).format("YYYY-MM-DD")} ${depTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const arrDateTime = moment(
      `${moment(arrDate).format("YYYY-MM-DD")} ${arrivalTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const minArrivalTime = depDateTime.add(2, "minutes");

    // Validate
    // return arrDateTime.isSameOrAfter(depDateTime)
    //   ? true
    //   : "Arrival must be after departure";

    return arrDateTime.isSameOrAfter(minArrivalTime)
      ? true
      : "Arrival must be atleast 2min after departure";
  };

export const validateArrivalAfterDeparture =
  (getValues, index) => (arrivalDate) => {
    const departureDate = getValues(`itinerary.${index}.depatureDate`);
    if (!arrivalDate || !departureDate) return true;
    return (
      moment(arrivalDate).isSameOrAfter(moment(departureDate), "day") ||
      "Arrival date must be same as or after departure date"
    );
  };

export function validateDepartureTime(
  depDate: string | null | undefined,
  timeValue: string | undefined
) {
  if (!timeValue) return "Departure time is required";
  if (!depDate) return true; // Can't validate without date

  const today = moment().startOf("day");
  const isToday = moment(depDate).isSame(today, "day");

  const minDateTime = isToday
    ? moment() // Current time
    : moment(depDate).startOf("day"); // Start of depDate day

  const inputDateTime = moment(depDate)
    .hour(moment(timeValue, "HH:mm").hour())
    .minute(moment(timeValue, "HH:mm").minute())
    .second(0)
    .millisecond(0);

  if (inputDateTime.isBefore(minDateTime)) {
    return "Departure time cannot be in the past";
  }

  return true;
}

export function getMinDepartureTime(depDate: string | null | undefined) {
  if (!depDate) return moment("00:00", "HH:mm");
  const today = moment().startOf("day");
  const isToday = moment(depDate).isSame(today, "day");
  return isToday ? moment() : moment("00:00", "HH:mm");
}

export enum FlightCategoryEnum {
  CHARTER = "Charter",
  IN_HOUSE = "In House",
  TEST_FLIGHT = "Test Flight",
  TRAINING = "Training",
  GROUND_RUN = "Ground Run",
}

export const categoryOptions = [
  {
    id: "CHARTER",
    name: "Charter",
  },
  {
    id: "IN_HOUSE",
    name: "In House",
  },
  {
    id: "TEST_FLIGHT",
    name: "Test Flight",
  },
  {
    id: "TRAINING",
    name: "Training",
  },
  { id: "GROUND_RUN", name: "Ground Run" },
  // { id: "POSITIONING_FLIGHT", name: "Positioning Flight" },
  // { id: "FERRY", name: "Ferry" },
];

// Move your calculation function here or import it
export const calculateTotalFlightTime = (itinerary) => {
  let totalMinutes = 0;
  itinerary.forEach((sector) => {
    console.log(
      "sector:::",
      sector,
      sector.depatureDate &&
        sector.depatureTime &&
        sector.arrivalDate &&
        sector.arrivalTime
    );
    if (
      sector.depatureDate &&
      sector.depatureTime &&
      sector.arrivalDate &&
      sector.arrivalTime
    ) {
      const depDateTime = moment(
        `${sector.depatureDate} ${sector.depatureTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const arrDateTime = moment(
        `${sector.arrivalDate} ${sector.arrivalTime}`,
        "YYYY-MM-DD HH:mm"
      );
      if (arrDateTime.isAfter(depDateTime)) {
        totalMinutes += arrDateTime.diff(depDateTime, "minutes");
      }
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Move your calculation function here or import it
export const flightBlockTime = (sectors) => {
  let totalMinutes = 0;
  sectors.forEach((sector) => {
    if (
      sector.depatureDate &&
      sector.depatureTime &&
      sector.arrivalDate &&
      sector.arrivalTime
    ) {
      const depDateTime = moment(
        `${sector.depatureDate} ${sector.depatureTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const arrDateTime = moment(
        `${sector.arrivalDate} ${sector.arrivalTime}`,
        "YYYY-MM-DD HH:mm"
      );
      if (arrDateTime.isAfter(depDateTime)) {
        totalMinutes += arrDateTime.diff(depDateTime, "minutes");
      }
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")} hr, ${minutes
    .toString()
    .padStart(2, "0")}min`;
};
