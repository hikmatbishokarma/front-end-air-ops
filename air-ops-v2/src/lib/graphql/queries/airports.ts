import { gql } from "@apollo/client";

export const GET_AIRPORTS = gql`
  query airports(
    $filter: AirportFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AirportSort!]! = []
  ) {
    airports(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        iata_code
        icao_code
        name
        city
      }
    }
  }
`;
