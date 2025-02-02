import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query getClients(
    $filter: clientFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [clientSort!]! = []
  ) {
    clients(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
      }
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation createClient($input: CreateOneClientInput!) {
    createOneClient(input: $input) {
      id
    }
  }
`;
