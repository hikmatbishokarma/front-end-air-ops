import { gql } from "@apollo/client";

export const GENERATE_INVOICE = gql`
  mutation generateInvoice($args: GenerateInvoiceInput!) {
    generateInvoice(args: $args) {
      quotationNo
      taxInvoiceNo
      proformaInvoiceNo
      template
      type
    }
  }
`;

export const GET_INVOICES = gql`
  query invoices(
    $filter: InvoiceFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [InvoiceSort!]! = []
  ) {
    invoices(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        createdAt
        type
        template
        taxInvoiceNo
        proformaInvoiceNo
        quotationNo
        quotation {
          id
          quotationNo
          requestedBy {
            id
            name
          }
          aircraft {
            id
            name
            code
          }
          sectors {
            source {
              code
              name
              lat
              long
              city
              country
            }
            destination {
              code
              name
              lat
              long
              city
              country
            }
            depatureDate
            depatureTime
            arrivalDate
            arrivalTime

            paxNumber
          }
        }
      }
    }
  }
`;
