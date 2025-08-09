import { gql } from "@apollo/client";

export const CREATE_MANUAL = gql`
  mutation CreateManual($input: CreateOneManualInput!) {
    createOneManual(input: $input) {
      id
    }
  }
`;

export const UPDATE_MANUAL = gql`
  mutation UpdateManual($input: UpdateOneManualInput!) {
    updateOneManual(input: $input) {
      id
    }
  }
`;

export const DELETE_MANUAL = gql`
  mutation deleteManual($input: DeleteOneManualInput!) {
    deleteOneManual(input: $input) {
      id
    }
  }
`;

export const GET_MANUALS = gql`
  query manuals(
    $filter: manualFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [manualSort!]! = []
  ) {
    manuals(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        name
        department
        attachment
        createdAt
        updatedAt
        createdBy {
          id
          profile
          displayName
          fullName
        }
      }
    }
  }
`;

export const GET_MANUAL_BY_ID = gql`
  query manual($id: ID!) {
    manual(id: $id) {
      id
      name
      department
      attachment
    }
  }
`;
