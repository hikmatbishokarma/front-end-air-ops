import { gql } from "@apollo/client";

export const GENERATE_INVOICE = gql`
  query generateInvoice($args: GenerateInvoiceInput!) {
    generateInvoice(args: $args)
  }
`;
