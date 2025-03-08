import { gql } from "@apollo/client";

export const CREATE_REPRESENTATIVE = gql`
  mutation createRepresentative($input: CreateOneRepresentativeInput!) {
    createOneRepresentative(input: $input) {
      id
    }
  }
`;

export const UPDATE_REPRESENTATIVE = gql`
  mutation updateRepresentative($input: UpdateOneRepresentativeInput!) {
    updateOneRepresentative(input: $input) {
      id
    }
  }
`;

export const GET_REPRESENTATIVES = gql`
  query representatives(
    $filter: representativeFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [representativeSort!]! = []
  ) {
    representatives(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
      }
    }
  }
`;

export const GET_REPRESENTATIVE_BY_ID = gql`
  query representative($id: ID!) {
    representative(id: $id) {
      id
      name
      phone
    }
  }
`;
