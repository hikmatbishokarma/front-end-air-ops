import { gql } from "@apollo/client";

export const CREATE_ROLE = gql`
  mutation createOneRole($input: CreateOneRoleInput!) {
    createOneRole(input: $input) {
      roleType
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation updateRole($input: UpdateOneRoleInput!) {
    updateOneRole(input: $input) {
      id
    }
  }
`;

export const GET_ROLES = gql`
  query getAllRoles(
    $filter: roleFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [roleSort!]! = []
  ) {
    roles(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        roleType
        name
        description
        accessPermission {
          action
          resource
        }
      }
    }
  }
`;

export const GET_ROLE_BY_ID = gql`
  query getRoleById($id: ID!) {
    role(id: $id) {
      id
      roleType
      name
      description
      accessPermission {
        action
        resource
      }
    }
  }
`;
