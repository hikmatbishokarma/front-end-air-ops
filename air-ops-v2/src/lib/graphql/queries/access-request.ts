import { gql } from "@apollo/client";

export const REQUEST_ACCESS = gql`
  mutation requestAccess($docId: String!) {
    requestManualAccess(docId: $docId) {
      id
    }
  }
`;

export const GET_ACCESS_REQUEST_BY_ID = gql`
  query accessRequest($id: ID!) {
    accessRequest(id: $id) {
      id
    }
  }
`;

export const GET_ACCESS_REQUESTS = gql`
  query accessRequests(
    $filter: AccessRequestFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AccessRequestSort!]! = []
  ) {
    accessRequests(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        status
      }
    }
  }
`;
