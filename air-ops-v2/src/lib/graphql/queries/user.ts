import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createOneUser($input: CreateUserInput!) {
    createOneUser(input: $input) {
      id
    }
  }
`;

export const GET_USERS = gql`
  query getAllUser(
    $filter: UserFilter! = {}
    $paging: OffsetPaging! = { limit: 100 }
    $sorting: [UserSort!]! = []
  ) {
    users(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      nodes {
        id
        name
        email
        phone
        type
        roles {
          id
          name
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      address
      city
      dob
      pinCode
      gender
      image
      roles {
        id
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateOneUserInput!) {
    updateOneUser(input: $input) {
      id
    }
  }
`;
