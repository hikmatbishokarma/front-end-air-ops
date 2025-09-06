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
      totalCount
      nodes {
        id
        code
        category
        requestedBy {
          id
          name
        }
        status
        isLatest
        itinerary
        providerType
        updatedAt
        createdAt
        quotationNo
        version
        revision
        aircraft {
          id
          name
          code
        }
        grandTotal
        confirmationTemplate
        operator {
          id
          name
          companyName
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
      category
      aircraft {
        id
        name
        code
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

export const SALE_CONFIRMATION = gql`
  mutation saleConfirmation($args: SaleConfirmationInput!) {
    saleConfirmation(args: $args) {
      id
      quotationNo
      confirmationTemplate
    }
  }
`;

export const FLIGHT_SEGMENTS_FOR_CALENDER = gql`
  query flightSegmentsForCalendar(
    $endDate: DateTime!
    $startDate: DateTime!
    $operatorId: String
  ) {
    flightSegmentsForCalendar(
      startDate: $startDate
      endDate: $endDate
      operatorId: $operatorId
    ) {
      id
      title
      start
      end
      depatureTime
      arrivalTime
      aircraft
      source
      destination
      duration
      __typename
    }
  }
`;

export const PREVIEW_SALES_CONFIRMATION = gql`
  query previewSalesConfirmation($quotationNo: String!) {
    previewSalesConfirmation(quotationNo: $quotationNo)
  }
`;
