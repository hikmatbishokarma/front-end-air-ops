// Shared common types used across multiple features
import type { Dispatch, SetStateAction } from "react";

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

export type Setter<T> = Dispatch<SetStateAction<T>>;
