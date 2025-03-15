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
        requestedBy {
          id
          name
        }
        status
        itinerary
        providerType
        updatedAt
        referenceNumber
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
