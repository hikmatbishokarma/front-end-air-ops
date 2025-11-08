// Quote-specific interfaces

export interface IaircraftCategory {
  id: string;
  name: string;
}

export interface Iaircraft {
  id: string;
  name: string;
  code: string;
  // category: IaircraftCategory;
}

export interface Iclient {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  // isCompany: boolean;
  // isPerson: boolean;
  gstNo?: string;
  panNo?: string;
  type?: string;
}

export interface Irepresentative {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
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
