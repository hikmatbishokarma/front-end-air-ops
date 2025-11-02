import { SectorLocation } from "@/shared/types/location";

export interface PriceItem {
  label: string;
  unit: string;
  price: number;
  currency: "INR" | "USD" | string; // Use union type for clarity
  total: number;
}

export interface SectorDetail {
  source: SectorLocation;
  destination: SectorLocation;
  depatureDate: string;
  depatureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  paxNumber: number;
}

// Use interface for the main Quote Creation Payload (DTO)
export interface QuoteCreatePayload {
  aircraft: string;
  category: string;
  requestedBy: string;
  representative?: string;
  providerType?: string;
  status?: string;
  prices?: PriceItem[];
  sectors: SectorDetail[];
  grandTotal: number;
  operatorId?: string;
}
