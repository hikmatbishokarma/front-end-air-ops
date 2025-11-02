import { gql } from "@apollo/client";

export const GET_STATES = gql`
  query states(
    $filter: StateFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [StateSort!]! = []
  ) {
    states(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        isoCode
        countryCode
      }
    }
  }
`;
