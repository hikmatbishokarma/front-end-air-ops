import { gql } from "@apollo/client";

export const CREATE_PRICE = gql`
  mutation createPrice($input: CreateOnePriceInput!) {
    createOnePrice(input: $input) {
      id
    }
  }
`;

export const GET_PRICE_BY_ID = gql`
  query getPriceById($id: ID!) {
    price(id: $id) {
      id
      prices {
        label
        unit
        currency
        price
        margin
        total
      }
      aircraft {
        id
        name
      }
    }
  }
`;

export const GET_PRICES = gql`
  query prices(
    $filter: priceFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [priceSort!]! = []
  ) {
    prices(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        prices {
          label
          unit
        }
        aircraft {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PRICE = gql`
  mutation updatePrice($input: UpdateOnePriceInput!) {
    updateOnePrice(input: $input) {
      id
    }
  }
`;
