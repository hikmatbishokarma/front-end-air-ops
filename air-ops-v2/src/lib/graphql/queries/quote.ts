import { gql } from "@apollo/client";

export const CREATE_QUOTE = gql`
  mutation createQuote($input: CreateOneQuoteInput!) {
    createOneQuote(input: $input) {
      id
    }
  }
`;

export const GET_QUOTES = gql`
  query getQuotes(
    $filter: QuoteFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [QuoteSort!]! = []
  ) {
    quotes(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        code
        requestedBy {
          id
          name
        }
        status
        itinerary
        providerType
        updatedAt
        referenceNumber
        version
        revision
        aircraft {
          id
          name
        }
      }
    }
  }
`;

export const GET_QUOTE_BY_ID = gql`
  query getQuote($id: ID!) {
    quote(id: $id) {
      id
      code
      requestedBy {
        id
        name
      }
      category {
        id
        name
      }
      aircraft {
        id
        name
      }
      status
      itinerary
      providerType
      updatedAt
      referenceNumber
      grandTotal
      prices {
        currency
        label
        margin
        price
        total
        unit
      }
      representative {
        id
        name
      }
    }
  }
`;

export const UPDATE_QUOTE = gql`
  mutation updateQuote($input: UpdateOneQuoteInput!) {
    updateOneQuote(input: $input) {
      id
    }
  }
`;

export const SHOW_PREVIEW = gql`
  query showPreview($id: String!) {
    showPreview(id: $id)
  }
`;

export const GENERATE_QUOTE_PDF = gql`
  mutation generateQuotePdf($input: GenerateQuotePdfInput!) {
    generateQuotePdf(input: $input)
  }
`;

export const UPDATE_QUOTE_STATUS = gql`
  mutation updateQuoteStatus($input: UpdateQuoteStatusInput!) {
    updateQuotationStatus(input: $input) {
      id
    }
  }
`;

export const UPGRAD_QUOTE = gql`
  mutation upgradQuote($code: String!) {
    upgradeQuote(code: $code) {
      id
    }
  }
`;
