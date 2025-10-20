// Define the structure of the S3 object stored in your RHF form
export interface FileObject {
  key: string;
  url: string; // The signed S3 URL (for the frontend)
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  xs?: number;
  options?: any[];
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  optionsKey?: string;
}

export interface IStatCard {
  name: string; // e.g., "Quotes", "Invoices"
  status: string[]; // Array of string representations of QuotationStatus
  countLabel: string;
}

// Defines the structure of the filter object used for GQL queries
export interface QuoteFilter {
  requestedBy?: { eq: string };
  operatorId?: { eq: string };
  or?: any[];
  createdAt?: {
    between: { lower: string; upper: string };
  };
  quotationNo?: { iLike: string };
  // Add other top-level filter properties as needed
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
