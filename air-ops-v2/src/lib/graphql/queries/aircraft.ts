import { gql } from "@apollo/client";

export const GET_AIRCRAFT = gql`
  query aircrafts(
    $filter: AircraftFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AircraftSort!]! = []
  ) {
    aircraft(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        category {
          id
          name
        }
      }
    }
  }
`;
