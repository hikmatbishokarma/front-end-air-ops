import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query getClients(
    $filter: clientFilter! = {}
    $paging: OffsetPaging! = { limit: 1000 }
    $sorting: [clientSort!]! = []
  ) {
    clients(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        lastName
        isCompany
        isPerson
        type
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

export const UPDATE_CLIENT = gql`
  mutation updateClient($input: UpdateOneClientInput!) {
    updateOneClient(input: $input) {
      id
    }
  }
`;

export const GET_CLIENT_BY_ID = gql`
  query getClient($id: ID!) {
    client(id: $id) {
      id
      isCompany
      isPerson
      name
      lastName
      phone
      email
      address
      panNo
      gstNo
      billingAddress
      type
    }
  }
`;
