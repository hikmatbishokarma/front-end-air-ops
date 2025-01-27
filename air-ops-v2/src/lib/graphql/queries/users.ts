import { gql } from "@apollo/client";

export const GET_USER_BY_ROLE_TYPE = gql`
  query getAllUser(
    $filter: UserFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
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
        role {
          id
          name
          rolePermissions {
            id
            permissions
          }
        }
      }
    }
  }
`;
