import { FileObject } from "../../interfaces/common.interface";

export type OperatorFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  branch: string;
  companyLogo: FileObject | null;
  supportEmail: string;
  ticketFooterNote: string;
  websiteUrl: string;
  themeColor?: string;
  subscriptionPlan?: string;
  billingCycle?: string;
};
