import { gql } from "@apollo/client";

export const GET_AIRCRAFT_CATEGORIES = gql`
  query aircraftcategories(
    $filter: AircraftCategoryFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AircraftCategorySort!]! = []
  ) {
    aircraftCategories(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
      }
    }
  }
`;
