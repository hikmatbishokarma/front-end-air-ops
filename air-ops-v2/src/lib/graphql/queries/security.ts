import { gql } from "@apollo/client";

export const CREATE_SECURITY = gql`
  mutation CreateSecurity($input: CreateOneSecurityInput!) {
    createOneSecurity(input: $input) {
      id
    }
  }
`;

export const UPDATE_SECURITY = gql`
  mutation UpdateSecurity($input: UpdateOneSecurityInput!) {
    updateOneSecurity(input: $input) {
      id
    }
  }
`;

export const DELETE_SECURITY = gql`
  mutation deleteSecurity($input: DeleteOneSecurityInput!) {
    deleteOneSecurity(input: $input) {
      id
    }
  }
`;

export const GET_SECURITIES = gql`
  query securities(
    $filter: securityFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [securitySort!]! = []
  ) {
    securities(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        type
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

export const GET_SECURITY_BY_ID = gql`
  query security($id: ID!) {
    security(id: $id) {
      type
      id
      name
      department
      attachment
    }
  }
`;
