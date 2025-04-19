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
        quotationNo
        version
        revision
        aircraft {
          id
          name
        }
        grandTotal
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
      quotationNo
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
  query showPreview($quotationNo: String!) {
    showPreview(quotationNo: $quotationNo)
  }
`;

export const SEND_ACKNOWLEDGEMENT = gql`
  mutation sendAcknowledgement($input: acknowledgementInput!) {
    sendAcknowledgement(input: $input)
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
