import { gql } from "@apollo/client";

export const GET_CITIES = gql`
  query cities(
    $filter: CityFilter! = {}
    $paging: OffsetPaging! = { limit: 20 }
    $sorting: [CitySort!]! = []
  ) {
    cities(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        state
      }
    }
  }
`;
