import { gql } from "@apollo/client";

export const CREATE_LEAVE = gql`
  mutation createLeave($input: CreateOneLeaveInput!) {
    createOneLeave(input: $input) {
      id
    }
  }
`;

export const UPDATE_LEAVE = gql`
  mutation updateLeave($input: UpdateOneLeaveInput!) {
    updateOneLeave(input: $input) {
      id
    }
  }
`;

export const UPDATE_LEAVE_REQUEST = gql`
  mutation updateLeaveRequest(
    $data: UpdateLeaveRequestDataInput!
    $where: UpdateLeaveRequestWhereInput!
  ) {
    updateLeaveRequest(where: $where, data: $data) {
      id
    }
  }
`;

export const GET_LEAVES = gql`
  query getLeaves(
    $filter: LeaveFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [LeaveSort!]! = []
  ) {
    leaves(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        type
        fromDate
        toDate
        status
        reason
        createdAt
        crew {
          id
          displayName
          fullName
        }
      }
    }
  }
`;

export const GET_LEAVE_BY_ID = gql`
  query getLeaveById($id: ID!) {
    leave(id: $id) {
      id
      type
      fromDate
      toDate
      status
      crew {
        id
        displayName
        fullName
      }
    }
  }
`;
